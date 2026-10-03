#!/usr/bin/env python3
"""
Karotz Voice Add-on - Serveur FastAPI pour le traitement vocal complet

Flux de traitement:
1. Réception de l'audio depuis le Karotz
2. Transcription STT (Open WebUI / Whisper.cpp / OpenAI)
3. Traitement Home Assistant (Intent Detection)
4. Fallback LLM (Open WebUI / Ollama) si HA ne comprend pas
5. Synthèse vocale TTS (Piper)
6. Restitution sonore sur le Karotz

Auteurs: Mathieu Courcelle
Licence: MIT
"""

import hashlib
import json
import logging
import os
import re
import tempfile
from pathlib import Path
from typing import Optional, Dict, Any
from urllib.parse import urljoin

import httpx
import requests
from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

# Configuration de l'application
APP = FastAPI(
    title="Karotz Voice Add-on",
    description="Serveur de traitement vocal complet pour Karotz avec Home Assistant, LLM et TTS",
    version="2.0.0"
)

# CORS Middleware pour permettre les requêtes depuis le Karotz
APP.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chemins des répertoires
DATA_DIR = Path("/data")
CACHE_DIR = DATA_DIR / "cache"
INCOMING_DIR = DATA_DIR / "incoming"
OPTIONS_FILE = Path(os.environ.get("OPTIONS_FILE", "/data/options.json"))

# Variables d'environnement pour Home Assistant
HA_URL = os.environ.get("SUPERVISOR_TOKEN") and "http://supervisor/core" or os.environ.get("HA_URL", "http://homeassistant.local:8123")
HA_TOKEN = os.environ.get("SUPERVISOR_TOKEN") or os.environ.get("HA_TOKEN", "")

# Configuration par défaut
DEFAULT_CONFIG = {
    "ha_url": HA_URL,
    "ha_token": HA_TOKEN,
    "openwebui_stt_url": "http://192.168.1.51:8080/v1/audio/transcriptions",
    "openwebui_llm_url": "http://192.168.1.51:8080/v1/chat/completions",
    "openwebui_api_key": "",
    "llm_model": "llama3:8b",
    "stt_model": "whisper-1",
    "stt_language": "fr",
    "piper_tts_url": "http://192.168.1.100:8001",
    "karotz_ip": "192.168.1.103",
    "voice_pipeline": True,
    "conversation_agent": "",
    "input_audio_format": "wav",
    "tts_engine": "piper",
    "tts_entity": "tts.piper",
    "voice_pitch": 0,
    "auto_listen": False,
    "wake_chime": "start_record",
    "log_level": "info",
    "use_ha_conversation": True,
    "use_openwebui_stt": True,
    "use_openwebui_llm": True,
}


class VoiceRequest(BaseModel):
    """Modèle pour les requêtes vocales"""
    audio: Optional[UploadFile] = None
    text: Optional[str] = None


class ConfigResponse(BaseModel):
    """Modèle pour la réponse de configuration"""
    ha_url: str
    openwebui_stt_url: str
    openwebui_llm_url: str
    piper_tts_url: str
    karotz_ip: str
    llm_model: str
    stt_model: str
    stt_language: str
    use_ha_conversation: bool
    use_openwebui_stt: bool
    use_openwebui_llm: bool


class VoiceResponse(BaseModel):
    """Modèle pour la réponse vocale"""
    return_code: int
    transcript: str
    intent_detected: bool
    intent_response: Optional[str] = None
    llm_response: Optional[str] = None
    final_text: str
    audio_url: Optional[str] = None
    actions: Optional[list] = None


def load_options() -> Dict[str, Any]:
    """Charger les options de configuration depuis le fichier ou utiliser les valeurs par défaut"""
    config = DEFAULT_CONFIG.copy()
    
    if OPTIONS_FILE.exists():
        try:
            with OPTIONS_FILE.open("r", encoding="utf-8") as fh:
                file_config = json.load(fh)
                config.update(file_config)
        except Exception as e:
            logging.warning(f"Erreur de chargement de {OPTIONS_FILE}: {e}")
    
    # Convertir les chemins relatifs en absolus si nécessaire
    for key in ["openwebui_stt_url", "openwebui_llm_url", "piper_tts_url", "ha_url"]:
        if config.get(key) and not config[key].startswith("http") and not config[key].startswith("/"):
            config[key] = f"http://{config[key]}"
    
    return config


def setup_logging():
    """Configurer le niveau de journalisation"""
    level_name = str(load_options().get("log_level", "info")).upper()
    logging.basicConfig(
        level=getattr(logging, level_name, logging.INFO),
        format="%(asctime)s %(levelname)s %(message)s"
    )
    logging.info("Karotz Voice Add-on démarré")


def ha_headers() -> Dict[str, str]:
    """Générer les en-têtes HTTP pour Home Assistant"""
    headers = {"Content-Type": "application/json"}
    options = load_options()
    token = options.get("ha_token", HA_TOKEN)
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def get_ha_url() -> str:
    """Obtenir l'URL de Home Assistant"""
    options = load_options()
    ha_url = options.get("ha_url", HA_URL)
    return ha_url.rstrip("/")


def get_openwebui_stt_url() -> str:
    """Obtenir l'URL de l'API STT Open WebUI"""
    options = load_options()
    url = options.get("openwebui_stt_url", "http://192.168.1.51:8080/v1/audio/transcriptions")
    return url.rstrip("/")


def get_openwebui_llm_url() -> str:
    """Obtenir l'URL de l'API LLM Open WebUI"""
    options = load_options()
    url = options.get("openwebui_llm_url", "http://192.168.1.51:8080/v1/chat/completions")
    return url.rstrip("/")


def get_piper_tts_url() -> str:
    """Obtenir l'URL de l'API TTS Piper"""
    options = load_options()
    url = options.get("piper_tts_url", "http://192.168.1.100:8001")
    return url.rstrip("/")


def get_karotz_url() -> str:
    """Obtenir l'URL du Karotz"""
    options = load_options()
    karotz_ip = options.get("karotz_ip", "192.168.1.103")
    return f"http://{karotz_ip}"


def get_llm_model() -> str:
    """Obtenir le modèle LLM à utiliser"""
    options = load_options()
    return options.get("llm_model", "llama3:8b")


def get_stt_language() -> str:
    """Obtenir la langue pour la transcription STT"""
    options = load_options()
    return options.get("stt_language", "fr")


def get_openwebui_api_key() -> str:
    """Obtenir la clé API Open WebUI"""
    options = load_options()
    return options.get("openwebui_api_key", "")


# Étape 1: Speech-To-Text (STT)
async def transcribe_audio(audio_path: Path, options: Dict[str, Any]) -> str:
    """
    Transcrire l'audio en texte en utilisant Open WebUI STT
    """
    if not options.get("use_openwebui_stt", True):
        logging.info("STT désactivé, retour texte vide")
        return ""
    
    stt_url = get_openwebui_stt_url()
    api_key = get_openwebui_api_key()
    language = get_stt_language()
    
    logging.info(f"Transcription STT via {stt_url}")
    
    try:
        # Préparer les en-têtes
        headers = {"Content-Type": "multipart/form-data"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        
        # Préparer les données pour l'envoi
        files = {
            "file": (audio_path.name, open(audio_path, "rb"), "audio/wav"),
        }
        
        data = {
            "model": options.get("stt_model", "whisper-1"),
            "language": language,
        }
        
        # Envoyer la requête
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{stt_url}",
                files=files,
                data=data,
                headers=headers
            )
            
            if response.status_code != 200:
                logging.error(f"Erreur STT: {response.status_code} - {response.text}")
                # Essayer une requête plus simple (format OpenAI)
                files_simple = {
                    "file": (audio_path.name, open(audio_path, "rb"), "audio/wav"),
                }
                response = await client.post(
                    f"{stt_url}",
                    files=files_simple,
                    headers=headers
                )
                
                if response.status_code != 200:
                    logging.error(f"Erreur STT (2ème tentative): {response.status_code} - {response.text}")
                    return ""
            
            result = response.json()
            
            # Extraire le texte selon différents formats possibles
            text = ""
            if "text" in result:
                text = result["text"]
            elif "transcription" in result:
                text = result["transcription"]
            elif "choices" in result and len(result["choices"]) > 0:
                text = result["choices"][0].get("text", "")
            elif "response" in result:
                text = result["response"]
            
            logging.info(f"Transcription STT: {text}")
            return text.strip()
            
    except Exception as e:
        logging.error(f"Exception STT: {e}")
        return ""


# Étape 2: Traitement Home Assistant (Intent Detection)
async def process_home_assistant(text: str, options: Dict[str, Any]) -> Dict[str, Any]:
    """
    Traiter le texte via l'API Conversation de Home Assistant
    Retourne: {"success": bool, "response": str, "intent_detected": bool}
    """
    if not options.get("use_ha_conversation", True) or not text.strip():
        return {"success": False, "response": "", "intent_detected": False}
    
    ha_url = get_ha_url()
    agent_id = options.get("conversation_agent", "")
    language = get_stt_language()
    
    logging.info(f"Traitement Home Assistant via {ha_url}")
    
    try:
        payload = {
            "text": text,
            "language": language,
        }
        
        if agent_id:
            payload["agent_id"] = agent_id
        
        headers = ha_headers()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{ha_url}/api/conversation/process",
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                logging.warning(f"Home Assistant a retourné le code {response.status_code}")
                return {"success": False, "response": response.text, "intent_detected": False}
            
            data = response.json()
            logging.info(f"Réponse HA: {json.dumps(data, indent=2)}")
            
            # Analyser la réponse
            # Structure typique: {"response": {"speech": {"plain": {"speech": "texte"}}}}
            if "response" in data:
                response_text = data["response"]
                if isinstance(response_text, dict):
                    if "speech" in response_text:
                        speech = response_text["speech"]
                        if isinstance(speech, dict):
                            if "plain" in speech:
                                plain = speech["plain"]
                                if isinstance(plain, dict):
                                    response_text = plain.get("speech", "")
                                else:
                                    response_text = str(plain)
                            else:
                                response_text = speech.get("speech", "")
                        else:
                            response_text = str(speech)
                    else:
                        response_text = response_text.get("text", "")
                
                # Vérifier si un intent a été détecté
                intent_detected = False
                if "target" in data.get("response", {}):
                    intent_detected = True
                
                return {
                    "success": True,
                    "response": response_text.strip(),
                    "intent_detected": intent_detected
                }
            else:
                return {"success": False, "response": "", "intent_detected": False}
                
    except Exception as e:
        logging.error(f"Exception Home Assistant: {e}")
        return {"success": False, "response": f"Erreur HA: {e}", "intent_detected": False}


# Étape 3: Fallback LLM (Open WebUI / Ollama)
async def process_llm(text: str, options: Dict[str, Any]) -> str:
    """
    Traiter le texte via Open WebUI LLM en fallback
    """
    if not options.get("use_openwebui_llm", True) or not text.strip():
        return ""
    
    llm_url = get_openwebui_llm_url()
    api_key = get_openwebui_api_key()
    model = get_llm_model()
    language = get_stt_language()
    
    logging.info(f"Traitement LLM via {llm_url} avec modèle {model}")
    
    try:
        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        
        # Préparer le prompt systémique
        system_prompt = f"""Tu es un assistant vocal intelligent pour une maison connectée avec Home Assistant.
Tu réponds en français de manière concise et claire.
Si tu ne comprends pas la demande, demande des clarifications.
Ne mentionne pas que tu es un modèle de langage ou que tu utilises de l'IA.
Réponds naturellement comme si tu faisais partie de la maison.

Exemples de réponses:
- Utilisateur: "Allume la lumière du salon" → Toi: "J'allume la lumière du salon"
- Utilisateur: "Quelle est la température ?" → Toi: "Il fait 22 degrés dans le salon"
- Utilisateur: "Raconte une blague" → Toi: "Pourquoi le lapin ne passe-t-il pas inaperçu ? Parce qu'il a de grandes oreilles !"

Important: Réponds toujours avec une phrase complète et naturelle."""

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            "stream": False,
            "max_tokens": 500,
            "temperature": 0.7,
            "language": language
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{llm_url}/chat/completions",
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                logging.error(f"Erreur LLM: {response.status_code} - {response.text}")
                
                # Essayer un format différent (Ollama direct)
                try:
                    payload_ollama = {
                        "model": model,
                        "prompt": text,
                        "stream": False,
                        "options": {"temperature": 0.7}
                    }
                    
                    response = await client.post(
                        f"{llm_url}/api/generate",
                        json=payload_ollama,
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        return data.get("response", "").strip()
                    else:
                        logging.error(f"Erreur LLM (Ollama): {response.status_code}")
                        return ""
                except:
                    return ""
            
            data = response.json()
            
            # Extraire la réponse selon différents formats
            if "choices" in data and len(data["choices"]) > 0:
                content = data["choices"][0].get("message", {}).get("content", "")
                return content.strip()
            elif "response" in data:
                return data["response"].strip()
            elif "message" in data:
                return data["message"].get("content", "").strip()
            else:
                logging.warning(f"Format de réponse LLM inattendu: {data}")
                return ""
            
    except Exception as e:
        logging.error(f"Exception LLM: {e}")
        return ""


# Étape 4: Synthèse Vocale (TTS Piper)
async def synthesize_text(text: str, options: Dict[str, Any]) -> Optional[Path]:
    """
    Synthétiser le texte en audio via l'add-on TTS Piper
    Retourne le chemin du fichier audio généré
    """
    if not text.strip():
        return None
    
    piper_url = get_piper_tts_url()
    cache_dir = CACHE_DIR
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    logging.info(f"Synthèse TTS via {piper_url}")
    
    try:
        # Créer une clé de cache pour éviter de régénérer le même texte
        cache_key = hashlib.md5((text + str(options.get("voice_pitch", 0))).encode("utf-8")).hexdigest()
        mp3_path = cache_dir / f"{cache_key}.mp3"
        wav_path = cache_dir / f"{cache_key}.wav"
        
        # Vérifier si le fichier existe déjà
        if mp3_path.exists():
            logging.info(f"Utilisation du cache TTS: {mp3_path}")
            return mp3_path
        
        # Envoyer la requête à Piper TTS
        payload = {
            "text": text,
            "language": get_stt_language(),
            "voice": options.get("tts_entity", "piper"),
            "pitch": options.get("voice_pitch", 0)
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Essayer d'abord l'endpoint /tts (format standard)
            try:
                response = await client.post(
                    f"{piper_url}/tts",
                    json=payload
                )
                
                if response.status_code == 200:
                    # Sauvegarder le fichier audio
                    if response.headers.get("content-type", "").startswith("audio/"):
                        mp3_path.write_bytes(response.content)
                        return mp3_path
                    else:
                        # Peut-être un JSON avec une URL
                        data = response.json()
                        audio_url = data.get("url", data.get("path", ""))
                        if audio_url:
                            if audio_url.startswith("http"):
                                audio_response = await client.get(audio_url)
                                if audio_response.status_code == 200:
                                    mp3_path.write_bytes(audio_response.content)
                                    return mp3_path
            except:
                pass
            
            # Essayer l'endpoint /api/tts
            try:
                response = await client.post(
                    f"{piper_url}/api/tts",
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    audio_url = data.get("url", data.get("file", ""))
                    if audio_url:
                        if audio_url.startswith("http"):
                            audio_response = await client.get(audio_url)
                            if audio_response.status_code == 200:
                                mp3_path.write_bytes(audio_response.content)
                                return mp3_path
                        else:
                            # Fichier local sur le serveur TTS
                            audio_response = await client.get(f"{piper_url}{audio_url}")
                            if audio_response.status_code == 200:
                                mp3_path.write_bytes(audio_response.content)
                                return mp3_path
            except:
                pass
            
            # Essayer l'endpoint /service/KarotzRvTTS (compatibilité avec l'ancien format)
            try:
                params = {"text": text}
                response = await client.get(
                    f"{piper_url}/service/KarotzRvTTS",
                    params=params
                )
                
                if response.status_code == 200:
                    mp3_path.write_bytes(response.content)
                    return mp3_path
            except:
                pass
            
            # Fallback: utiliser espeak si Piper n'est pas disponible
            try:
                import subprocess
                pitch = str(50 + int(options.get("voice_pitch", 0)))
                wav_path_temp = cache_dir / f"{cache_key}_temp.wav"
                
                subprocess.run([
                    "espeak-ng",
                    "-v", get_stt_language(),
                    "-p", pitch,
                    "-w", str(wav_path_temp),
                    text
                ], check=True, capture_output=True)
                
                # Convertir WAV en MP3
                subprocess.run([
                    "ffmpeg", "-y",
                    "-i", str(wav_path_temp),
                    "-codec:a", "libmp3lame",
                    str(mp3_path)
                ], check=True, capture_output=True)
                
                wav_path_temp.unlink(missing_ok=True)
                return mp3_path
                
            except Exception as e:
                logging.error(f"Fallback TTS échoué: {e}")
                return None
            
            logging.error("Aucune méthode TTS n'a fonctionné")
            return None
            
    except Exception as e:
        logging.error(f"Exception TTS: {e}")
        return None


# Étape 5: Restitution sonore sur le Karotz
async def play_on_karotz(audio_path: Path) -> bool:
    """
    Envoyer la commande au Karotz pour lire le fichier audio
    """
    karotz_url = get_karotz_url()
    
    logging.info(f"Lecture audio sur Karotz: {audio_path}")
    
    try:
        # Créer une URL accessible depuis le Karotz
        # On utilise le endpoint /audio/ pour servir le fichier
        audio_url = f"http://{karotz_url.split('://')[1]}/audio/{audio_path.name}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Essayer d'abord via CGI sound
            response = await client.get(
                f"{karotz_url}/cgi-bin/sound",
                params={"url": audio_url}
            )
            
            if response.status_code == 200:
                return True
            
            # Essayer avec play_sound
            response = await client.get(
                f"{karotz_url}/cgi-bin/play_sound",
                params={"url": audio_url}
            )
            
            if response.status_code == 200:
                return True
            
            # Essayer avec cmd
            response = await client.get(
                f"{karotz_url}/cgi-bin/cmd",
                params={"cmd": f"PlaySoundEx {audio_url}"}
            )
            
            return response.status_code == 200
            
    except Exception as e:
        logging.error(f"Exception lecture Karotz: {e}")
        return False


# Gestion des actions (LED, oreilles, etc.)
def strip_and_apply_actions(text: str, options: Dict[str, Any]) -> tuple:
    """
    Extraire et appliquer les actions depuis le texte
    Retourne: (texte_nettoyé, liste_d_actions)
    """
    ACTION_RE = re.compile(r"\[(ears|led|nose)\s+([^\]]+)\]", re.IGNORECASE)
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
            logging.warning("Impossible d'appliquer l'action [%s %s]: %s", action, args, exc)

    cleaned_text = re.sub(r"\s+", " ", "".join(clean_parts)).strip()
    return cleaned_text, actions


def apply_action(action: str, args: str, options: Dict[str, Any]):
    """
    Appliquer une action spécifique (LED, oreilles, etc.)
    """
    parts = args.split()
    karotz_url = get_karotz_url()
    
    try:
        if action == "ears" and len(parts) >= 2:
            async def set_ears():
                async with httpx.AsyncClient(timeout=5.0) as client:
                    await client.get(
                        f"{karotz_url}/cgi-bin/ears",
                        params={"left": parts[0], "right": parts[1], "noreset": "1"}
                    )
            
            import asyncio
            asyncio.run(set_ears())
            
        elif action == "led" and len(parts) >= 4:
            zone, r, g, b = parts[:4]
            color = "".join(f"{max(0, min(255, int(x))):02X}" for x in (r, g, b))
            params = {"pulse": "0", "color": color, "nomemory": "1"}
            
            async def set_led():
                async with httpx.AsyncClient(timeout=5.0) as client:
                    await client.get(
                        f"{karotz_url}/cgi-bin/leds",
                        params=params
                    )
            
            import asyncio
            asyncio.run(set_led())
            
        elif action == "nose" and parts:
            n = int(parts[0])
            colors = ["00FF00", "00FFFF", "FF00FF", "FFFF00", "FF6600", "FF0000"]
            
            async def set_nose():
                async with httpx.AsyncClient(timeout=5.0) as client:
                    await client.get(
                        f"{karotz_url}/cgi-bin/leds",
                        params={
                            "pulse": "1",
                            "color": colors[n % len(colors)],
                            "color2": "000000",
                            "speed": "250",
                            "nomemory": "1"
                        }
                    )
            
            import asyncio
            asyncio.run(set_nose())
            
    except Exception as e:
        logging.error(f"Erreur application action {action}: {e}")


# Endpoints FastAPI

@APP.get("/health")
async def health_check():
    """Vérifier l'état du service"""
    return JSONResponse(content={
        "status": "ok",
        "version": "2.0.0",
        "options": load_options()
    })


@APP.get("/config")
async def get_config():
    """Obtenir la configuration actuelle"""
    options = load_options()
    return JSONResponse(content=ConfigResponse(
        ha_url=options.get("ha_url", HA_URL),
        openwebui_stt_url=options.get("openwebui_stt_url", ""),
        openwebui_llm_url=options.get("openwebui_llm_url", ""),
        piper_tts_url=options.get("piper_tts_url", ""),
        karotz_ip=options.get("karotz_ip", ""),
        llm_model=options.get("llm_model", ""),
        stt_model=options.get("stt_model", ""),
        stt_language=options.get("stt_language", ""),
        use_ha_conversation=options.get("use_ha_conversation", True),
        use_openwebui_stt=options.get("use_openwebui_stt", True),
        use_openwebui_llm=options.get("use_openwebui_llm", True)
    ).dict())


@APP.post("/api/voice")
async def voice_endpoint(
    request: Request,
    audio: Optional[UploadFile] = File(None)
):
    """
    Endpoint principal pour le traitement vocal
    
    Accepte:
    - POST avec fichier multipart (audio=@fichier.wav)
    - POST avec corps brut (audio raw)
    
    Retourne:
    {
        "return": 0 ou 1,
        "transcript": "texte transcrit",
        "intent_detected": bool,
        "intent_response": "réponse HA",
        "llm_response": "réponse LLM",
        "final_text": "texte final",
        "audio_url": "URL de l'audio généré",
        "actions": [...]
    }
    """
    options = load_options()
    
    # Créer les répertoires nécessaires
    INCOMING_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    
    # Traitement de l'audio
    audio_path = None
    try:
        if audio is not None:
            # Fichier multipart
            suffix = Path(audio.filename or "audio.wav").suffix or ".wav"
            fd, name = tempfile.mkstemp(prefix="voice-", suffix=suffix, dir=str(INCOMING_DIR))
            os.close(fd)
            audio_path = Path(name)
            
            # Sauvegarder le fichier
            content = await audio.read()
            audio_path.write_bytes(content)
            
        else:
            # Corps brut
            body = await request.body()
            if not body:
                raise HTTPException(status_code=400, detail="Aucun fichier audio fourni")
            
            input_format = options.get("input_audio_format", "wav")
            suffix = ".raw" if input_format == "karotz_raw" else ".wav"
            fd, name = tempfile.mkstemp(prefix="voice-", suffix=suffix, dir=str(INCOMING_DIR))
            os.close(fd)
            audio_path = Path(name)
            audio_path.write_bytes(body)
        
        logging.info(f"Fichier audio reçu: {audio_path} ({audio_path.stat().st_size} octets)")
        
        # Étape 1: Speech-To-Text (STT)
        transcript = await transcribe_audio(audio_path, options)
        
        if not transcript:
            logging.warning("Aucune transcription obtenue")
            # Nettoyer
            if audio_path.exists():
                audio_path.unlink()
            
            return JSONResponse(content={
                "return": 1,
                "error": "Aucune transcription obtenue",
                "transcript": "",
                "intent_detected": False,
                "intent_response": "",
                "llm_response": "",
                "final_text": "",
                "audio_url": ""
            })
        
        logging.info(f"Transcription: {transcript}")
        
        # Étape 2: Traitement Home Assistant (Intent Detection)
        ha_result = await process_home_assistant(transcript, options)
        intent_detected = ha_result.get("intent_detected", False)
        intent_response = ha_result.get("response", "")
        
        logging.info(f"Home Assistant - Intent détecté: {intent_detected}, Réponse: {intent_response}")
        
        # Étape 3: Fallback LLM si aucun intent n'a été détecté ou si HA n'a pas compris
        llm_response = ""
        if not intent_detected or not intent_response.strip():
            llm_response = await process_llm(transcript, options)
            logging.info(f"LLM Fallback - Réponse: {llm_response}")
        
        # Déterminer le texte final
        if intent_detected and intent_response.strip():
            final_text = intent_response
        elif llm_response.strip():
            final_text = llm_response
        else:
            final_text = "Désolé, je n'ai pas compris."
        
        # Nettoyer le texte final et extraire les actions
        final_text_clean, actions = strip_and_apply_actions(final_text, options)
        
        logging.info(f"Texte final: {final_text_clean}")
        
        # Étape 4: Synthèse Vocale (TTS)
        audio_file = await synthesize_text(final_text_clean, options)
        
        # Étape 5: Restitution sonore sur le Karotz
        audio_url = ""
        if audio_file and audio_file.exists():
            audio_url = f"{request.url_for('serve_audio', name=audio_file.name)}"
            # Jouer immédiatement sur le Karotz
            await play_on_karotz(audio_file)
        
        # Nettoyer les fichiers temporaires
        if audio_path.exists():
            audio_path.unlink()
        
        # Formater la réponse
        response_data = VoiceResponse(
            return_code=0,
            transcript=transcript,
            intent_detected=intent_detected,
            intent_response=intent_response,
            llm_response=llm_response,
            final_text=final_text_clean,
            audio_url=audio_url,
            actions=[{"type": a, "args": b} for a, b in actions]
        )
        
        return JSONResponse(content=response_data.dict())
        
    except Exception as e:
        logging.error(f"Exception dans voice_endpoint: {e}")
        
        # Nettoyer
        if audio_path and audio_path.exists():
            audio_path.unlink()
        
        raise HTTPException(status_code=500, detail=str(e))


@APP.get("/audio/{name}")
async def serve_audio(name: str):
    """Servir les fichiers audio depuis le cache"""
    path = CACHE_DIR / name
    if not path.exists():
        raise HTTPException(status_code=404, detail="Fichier audio non trouvé")
    return FileResponse(path, media_type="audio/mpeg")


@APP.get("/service/KarotzRvTTS")
async def karotz_rv_tts(text: str = ""):
    """
    Endpoint de compatibilité pour l'ancien script CGI TTS du Karotz
    """
    if not text:
        raise HTTPException(status_code=400, detail="Texte manquant")
    
    options = load_options()
    audio_file = await synthesize_text(text, options)
    
    if audio_file and audio_file.exists():
        return FileResponse(audio_file, media_type="audio/mpeg")
    else:
        raise HTTPException(status_code=500, detail="Échec de la synthèse vocale")


@APP.get("/api/mic")
async def mic_control(on: Optional[int] = None):
    """
    Contrôle du micro pour l'écoute passive
    """
    state_file = DATA_DIR / "mic.enabled"
    
    if on == 1:
        state_file.write_text("1", encoding="utf-8")
    elif on == 0:
        state_file.unlink(missing_ok=True)
        # Arrêter l'enregistrement sur le Karotz
        try:
            karotz_url = get_karotz_url()
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.get(f"{karotz_url}/cgi-bin/cmd", params={"cmd": "echo RT >/dev/null"})
        except:
            pass
    
    return JSONResponse(content={"auto_listen": state_file.exists()})


# Montage des fichiers statiques
APP.mount("/static", StaticFiles(directory=str(CACHE_DIR)), name="static")


if __name__ == "__main__":
    import uvicorn
    setup_logging()
    
    # Créer les répertoires nécessaires
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    INCOMING_DIR.mkdir(parents=True, exist_ok=True)
    
    # Démarrer le serveur
    uvicorn.run(
        APP,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )