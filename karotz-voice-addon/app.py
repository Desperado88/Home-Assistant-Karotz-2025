import hashlib
import json
import logging
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urljoin

import requests
from flask import Flask, jsonify, request, send_file


APP = Flask(__name__)
DATA_DIR = Path("/data")
CACHE_DIR = DATA_DIR / "cache"
INCOMING_DIR = DATA_DIR / "incoming"
MODEL_DIR = Path(os.environ.get("MODEL_DIR", "/data/models"))
WHISPER_DIR = Path(os.environ.get("WHISPER_CPP_DIR", "/opt/whisper.cpp"))
OPTIONS_FILE = Path(os.environ.get("OPTIONS_FILE", "/data/options.json"))

HA_URL = os.environ.get("SUPERVISOR_TOKEN") and "http://supervisor/core" or os.environ.get("HA_URL", "http://homeassistant.local:8123")
HA_TOKEN = os.environ.get("SUPERVISOR_TOKEN") or os.environ.get("HA_TOKEN", "")

ACTION_RE = re.compile(r"\[(ears|led|nose)\s+([^\]]+)\]", re.IGNORECASE)


def load_options():
    defaults = {
        "karotz_url": "http://192.168.1.xxx",
        "voice_pipeline": True,
        "conversation_agent": "",
        "stt_language": "fr",
        "stt_model": "small",
        "input_audio_format": "karotz_raw",
        "tts_engine": "piper",
        "tts_entity": "tts.piper",
        "voice_pitch": 0,
        "auto_listen": False,
        "wake_chime": "start_record",
        "log_level": "info",
    }
    if OPTIONS_FILE.exists():
        with OPTIONS_FILE.open("r", encoding="utf-8") as fh:
            defaults.update(json.load(fh))
    return defaults


def setup_logging():
    level_name = str(load_options().get("log_level", "info")).upper()
    logging.basicConfig(level=getattr(logging, level_name, logging.INFO), format="%(asctime)s %(levelname)s %(message)s")


def ha_headers():
    headers = {"Content-Type": "application/json"}
    if HA_TOKEN:
        headers["Authorization"] = f"Bearer {HA_TOKEN}"
    return headers


def run_checked(cmd, **kwargs):
    logging.debug("Running command: %s", " ".join(str(x) for x in cmd))
    return subprocess.run(cmd, check=True, text=True, capture_output=True, **kwargs)


def whisper_binary():
    for name in ("whisper-cli", "main"):
        candidate = WHISPER_DIR / "build" / "bin" / name
        if candidate.exists():
            return candidate
        candidate = WHISPER_DIR / name
        if candidate.exists():
            return candidate
    raise RuntimeError("whisper.cpp binary not found")


def whisper_model_path(model_name):
    return MODEL_DIR / f"ggml-{model_name}.bin"


def ensure_whisper_model(model_name):
    model_path = whisper_model_path(model_name)
    if model_path.exists():
        return model_path

    script = WHISPER_DIR / "models" / "download-ggml-model.sh"
    if not script.exists():
        raise RuntimeError("whisper.cpp model download script not found")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    run_checked([str(script), model_name], cwd=str(MODEL_DIR))
    if not model_path.exists():
        downloaded = MODEL_DIR / "models" / f"ggml-{model_name}.bin"
        if downloaded.exists():
            shutil.move(str(downloaded), str(model_path))
    if not model_path.exists():
        raise RuntimeError(f"Unable to download whisper model: {model_name}")
    return model_path


def normalize_audio(source_path, options):
    normalized = source_path.with_suffix(".16k.wav")
    input_format = options.get("input_audio_format", "karotz_raw")
    cmd = ["ffmpeg", "-y"]
    if input_format == "karotz_raw" or source_path.suffix == ".raw":
        cmd.extend(["-f", "u16le", "-ar", "16000", "-ac", "1"])
    cmd.extend([
        "-i",
        str(source_path),
        "-ac",
        "1",
        "-ar",
        "16000",
        "-f",
        "wav",
        str(normalized),
    ])
    run_checked(cmd)
    return normalized


def transcribe(audio_path, options):
    if not options.get("voice_pipeline", True):
        return ""

    model = ensure_whisper_model(options["stt_model"])
    normalized = normalize_audio(audio_path, options)
    out_base = normalized.with_suffix("")
    cmd = [
        str(whisper_binary()),
        "-m",
        str(model),
        "-f",
        str(normalized),
        "-l",
        options.get("stt_language", "fr"),
        "-otxt",
        "-of",
        str(out_base),
        "-nt",
    ]
    run_checked(cmd)
    txt_path = Path(f"{out_base}.txt")
    return txt_path.read_text(encoding="utf-8").strip() if txt_path.exists() else ""


def process_conversation(text, options):
    agent = options.get("conversation_agent", "").strip()
    if not agent:
        return text

    payload = {
        "text": text,
        "language": options.get("stt_language", "fr"),
        "agent_id": agent,
    }
    response = requests.post(f"{HA_URL}/api/conversation/process", headers=ha_headers(), json=payload, timeout=60)
    response.raise_for_status()
    data = response.json()
    return (
        data.get("response", {})
        .get("speech", {})
        .get("plain", {})
        .get("speech", "")
        .strip()
    )


def strip_and_apply_actions(text, options):
    clean_parts = []
    last = 0
    actions = []

    for match in ACTION_RE.finditer(text):
        clean_parts.append(text[last:match.start()])
        actions.append((match.group(1).lower(), match.group(2).strip()))
        last = match.end()
    clean_parts.append(text[last:])

    for action, args in actions:
        try:
            apply_action(action, args, options)
        except Exception as exc:
            logging.warning("Unable to apply action [%s %s]: %s", action, args, exc)

    return re.sub(r"\s+", " ", "".join(clean_parts)).strip(), actions


def karotz_get(path, params=None):
    options = load_options()
    base = options.get("karotz_url", "").rstrip("/") + "/"
    url = urljoin(base, path.lstrip("/"))
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response


def apply_action(action, args, options):
    parts = args.split()
    if action == "ears" and len(parts) >= 2:
        karotz_get("/cgi-bin/ears", {"left": parts[0], "right": parts[1], "noreset": "1"})
    elif action == "led" and len(parts) >= 4:
        zone, r, g, b = parts[:4]
        color = "".join(f"{max(0, min(255, int(x))):02X}" for x in (r, g, b))
        params = {"pulse": "0", "color": color, "nomemory": "1"}
        if zone.lower() in ("all", "0", "led"):
            karotz_get("/cgi-bin/leds", params)
        else:
            karotz_get("/cgi-bin/leds", params)
    elif action == "nose" and parts:
        # Karotz/OpenKarotz has no nose primitive in this repository. Map it to a short LED cue.
        n = int(parts[0])
        colors = ["00FF00", "00FFFF", "FF00FF", "FFFF00", "FF6600", "FF0000"]
        karotz_get("/cgi-bin/leds", {"pulse": "1", "color": colors[n % len(colors)], "color2": "000000", "speed": "250", "nomemory": "1"})


def synthesize_espeak(text, options):
    digest = hashlib.md5(("espeak" + text + str(options.get("voice_pitch", 0))).encode("utf-8")).hexdigest()
    wav_path = CACHE_DIR / f"{digest}.wav"
    mp3_path = CACHE_DIR / f"{digest}.mp3"
    if mp3_path.exists():
        return mp3_path

    pitch = str(50 + int(options.get("voice_pitch", 0)))
    run_checked(["espeak-ng", "-v", options.get("stt_language", "fr"), "-p", pitch, "-w", str(wav_path), text])
    run_checked(["ffmpeg", "-y", "-i", str(wav_path), "-codec:a", "libmp3lame", str(mp3_path)])
    wav_path.unlink(missing_ok=True)
    return mp3_path


def synthesize_ha(text, options):
    digest = hashlib.md5(("ha" + options.get("tts_entity", "") + text + str(options.get("voice_pitch", 0))).encode("utf-8")).hexdigest()
    mp3_path = CACHE_DIR / f"{digest}.mp3"
    if mp3_path.exists():
        return mp3_path

    payload = {
        "engine_id": options.get("tts_entity") or "tts.piper",
        "message": text,
        "language": options.get("stt_language", "fr"),
        "cache": True,
        "options": {"preferred_format": "mp3"},
    }
    response = requests.post(f"{HA_URL}/api/tts_get_url", headers=ha_headers(), json=payload, timeout=60)
    response.raise_for_status()
    url = response.json().get("url") or response.json().get("path")
    if not url:
        raise RuntimeError("Home Assistant TTS did not return an URL")
    if url.startswith("/"):
        url = f"{HA_URL}{url}"
    audio = requests.get(url, headers=ha_headers(), timeout=60)
    audio.raise_for_status()

    raw_path = CACHE_DIR / f"{digest}.raw"
    raw_path.write_bytes(audio.content)
    if int(options.get("voice_pitch", 0)) > 0:
        shift = 1 + int(options["voice_pitch"]) / 100.0
        run_checked(["ffmpeg", "-y", "-i", str(raw_path), "-filter:a", f"asetrate=44100*{shift},aresample=44100", str(mp3_path)])
        raw_path.unlink(missing_ok=True)
    else:
        shutil.move(str(raw_path), str(mp3_path))
    return mp3_path


def synthesize(text, options):
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    if options.get("tts_engine") == "espeak":
        return synthesize_espeak(text, options)
    return synthesize_ha(text, options)


def play_on_karotz(mp3_path):
    karotz_get("/cgi-bin/sound", {"url": f"{request.host_url.rstrip('/')}/audio/{mp3_path.name}"})


@APP.route("/health")
def health():
    return jsonify({"ok": True, "options": load_options()})


@APP.route("/api/mic")
def mic():
    enabled = request.args.get("on")
    state_file = DATA_DIR / "mic.enabled"
    if enabled == "1":
        state_file.write_text("1", encoding="utf-8")
    elif enabled == "0":
        state_file.unlink(missing_ok=True)
        try:
            karotz_get("/cgi-bin/cmd", {"cmd": "echo RT >/dev/null"})
        except Exception:
            logging.debug("RT stop command failed or is unsupported", exc_info=True)
    return jsonify({"auto_listen": state_file.exists()})


@APP.route("/api/voice", methods=["POST"])
def voice():
    options = load_options()
    INCOMING_DIR.mkdir(parents=True, exist_ok=True)

    if "audio" in request.files:
        upload = request.files["audio"]
        suffix = Path(upload.filename or "audio.wav").suffix or ".wav"
        fd, name = tempfile.mkstemp(prefix="voice-", suffix=suffix, dir=str(INCOMING_DIR))
        os.close(fd)
        audio_path = Path(name)
        upload.save(audio_path)
    else:
        default_suffix = ".raw" if options.get("input_audio_format") == "karotz_raw" else ".wav"
        fd, name = tempfile.mkstemp(prefix="voice-", suffix=default_suffix, dir=str(INCOMING_DIR))
        os.close(fd)
        audio_path = Path(name)
        audio_path.write_bytes(request.get_data())

    transcript = transcribe(audio_path, options)
    reply = process_conversation(transcript, options) if transcript else ""
    spoken_text, actions = strip_and_apply_actions(reply, options)
    audio_url = ""
    if spoken_text:
        mp3 = synthesize(spoken_text, options)
        audio_url = f"{request.host_url.rstrip('/')}/audio/{mp3.name}"

    return jsonify({
        "return": 0,
        "transcript": transcript,
        "reply": reply,
        "spoken_text": spoken_text,
        "actions": [{"type": a, "args": b} for a, b in actions],
        "audio_url": audio_url,
    })


@APP.route("/audio/<name>")
def audio(name):
    path = CACHE_DIR / name
    if not path.exists():
        return jsonify({"return": 1, "msg": "audio not found"}), 404
    return send_file(path, mimetype="audio/mpeg")


@APP.route("/service/KarotzRvTTS")
def karotz_rv_tts():
    options = load_options()
    text = request.args.get("text", "")
    if not text:
        return jsonify({"return": 1, "msg": "missing text"}), 400
    return send_file(synthesize(text, options), mimetype="audio/mpeg")


if __name__ == "__main__":
    setup_logging()
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    APP.run(host="0.0.0.0", port=5000)
