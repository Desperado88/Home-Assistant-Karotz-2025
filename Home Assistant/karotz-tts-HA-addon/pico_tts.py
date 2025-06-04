from flask import Flask, request, send_file
import hashlib
import os
import subprocess

app = Flask(__name__)
CACHE_DIR = "/app/cache"

@app.route("/service/KarotzRvTTS")
def tts():
    text = request.args.get("text", "")
    lang = request.args.get("language", "fr-FR")
    gender = request.args.get("gender", "female")

    if lang == "fr": lang = "fr-FR"

    md5Hash = hashlib.md5((lang + gender + text).encode("utf-8")).hexdigest()
    mp3_path = f"{CACHE_DIR}/{md5Hash}.mp3"
    wav_path = f"{CACHE_DIR}/{md5Hash}.wav"

    if not os.path.isfile(mp3_path):
        subprocess.run(["pico2wave", "-l", lang, "-w", wav_path, text])
        subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", mp3_path])
        os.remove(wav_path)

    return send_file(mp3_path, mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)