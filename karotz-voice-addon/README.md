# Karotz Voice Add-on v2.0.0

**Add-on vocal complet pour Karotz/OpenKarotz avec intégration LLM et Home Assistant**

Ce projet implémente un système de contrôle vocal complet pour votre lapin connecté Karotz, avec intégration Home Assistant, modèles de langage (LLM) via Open WebUI/Ollama, et synthèse vocale TTS via Piper.

## 🎯 Fonctionnalités

- ✅ **Réception audio** depuis le Karotz via POST multipart ou corps brut
- ✅ **Speech-To-Text (STT)** via Open WebUI, OpenAI, ou Whisper.cpp
- ✅ **Traitement Home Assistant** avec détection d'intent via l'API `/api/conversation/process`
- ✅ **Fallback LLM** avec Open WebUI/Ollama pour les demandes non comprises par HA
- ✅ **Synthèse vocale (TTS)** via l'add-on Piper TTS ou eSpeak
- ✅ **Restitution sonore** directe sur le Karotz
- ✅ **Gestion des actions** (LED, oreilles) via des balises spéciales
- ✅ **Cache audio** pour éviter la régénération des mêmes phrases
- ✅ **Interface REST** complète avec FastAPI

## 🏗️ Architecture du flux

```
Bouton Karotz
    ↓
Enregistrement Audio (ALSA/arecord ou natif)
    ↓
Fichier: /tmp/voice.wav
    ↓
POST /api/voice (cette API)
    ↓
┌─────────────────────────────────────┐
│ 1. Speech-To-Text (STT)               │
│    • Open WebUI: http://192.168.1.51:8080/v1/audio/transcriptions
│    • Format: multipart/form-data avec fichier audio
│    • Langue: configurable (fr par défaut)
└─────────────────────────────────────┘
    ↓
Texte transcrit
    ↓
┌─────────────────────────────────────┐
│ 2. Traitement Home Assistant         │
│    • POST /api/conversation/process  │
│    • Avec agent_id optionnel          │
│    • Analyse la demande et exécute les intents
└─────────────────────────────────────┘
    ↓
┌─────────────────┐
│ Intent détecté ? │
└──────────┬───────┘
            │ Oui
            ↓
    Réponse HA
    ↓
    FIN
    ↓
     Non
    ↓
┌─────────────────────────────────────┐
│ 3. Fallback LLM (si pas d'intent)     │
│    • Open WebUI: http://192.168.1.51:8080/v1/chat/completions
│    • Modèles: llama3, mistral, qwen2.5, etc.
│    • Prompt systémique personnalisé   │
└─────────────────────────────────────┘
    ↓
Réponse LLM
    ↓
┌─────────────────────────────────────┐
│ 4. Synthèse Vocale (TTS)             │
│    • Piper TTS: http://192.168.1.100:8001/tts
│    • Format: texte → MP3
│    • Cache des fichiers générés     │
└─────────────────────────────────────┘
    ↓
Fichier audio MP3
    ↓
┌─────────────────────────────────────┐
│ 5. Restitution sonore                │
│    • GET /cgi-bin/sound?url=...
│    • Ou GET /cgi-bin/play_sound?url=..
│    • Lecture directe sur le Karotz    │
└─────────────────────────────────────┘
```

## 📋 Prérequis

### Matériel
- **Karotz** avec firmware OpenKarotz ou FreeRabbit
- **Home Assistant** (version ≥ 2024.0.0)
- **Serveur Open WebUI/Ollama** (pour STT et LLM)
- **Add-on Piper TTS** (pour la synthèse vocale)

### Réseau
- Tous les composants doivent pouvoir communiquer entre eux
- Vérifiez que les ports sont ouverts:
  - Add-on vocal: `8000` (TCP)
  - Open WebUI: `8080` (TCP)
  - Piper TTS: `8001` (TCP)

## 🚀 Installation

### 1. Ajouter l'add-on à Home Assistant

1. **Copier le dossier** `karotz-voice-addon/` dans le dossier `addons/` de votre Home Assistant
   - Via SAMBA: `\\HASSIO\addons\`
   - Via SSH: `/addons/`

2. **Redémarrer Home Assistant** pour découvrir le nouvel add-on

3. **Installer l'add-on** via l'interface Supervisor

### 2. Configurer l'add-on

Dans l'interface de configuration de l'add-on, configurez les options suivantes:

#### Configuration Home Assistant
```yaml
ha_url: "http://supervisor/core"
ha_token: "votre_token_long_lived"
```

#### Configuration Open WebUI (STT et LLM)
```yaml
openwebui_stt_url: "http://192.168.1.51:8080/v1/audio/transcriptions"
openwebui_llm_url: "http://192.168.1.51:8080/v1/chat/completions"
openwebui_api_key: "votre_clé_api_openwebui"  # Optionnel
```

#### Modèles IA
```yaml
llm_model: "llama3:8b"  # ou mistral, qwen2.5, etc.
stt_model: "whisper-1"  # Modèle STT
stt_language: "fr"     # Langue par défaut
```

#### Configuration TTS Piper
```yaml
piper_tts_url: "http://192.168.1.100:8001"  # URL de l'add-on Piper TTS
```

#### Configuration Karotz
```yaml
karotz_ip: "192.168.1.103"  # Adresse IP de votre Karotz
```

#### Options de pipeline
```yaml
voice_pipeline: true       # Activer le pipeline vocal
conversation_agent: ""    # Agent Home Assistant (optionnel)
input_audio_format: "wav" # Format audio: auto, karotz_raw, wav, flac
use_ha_conversation: true # Utiliser Home Assistant Conversation
use_openwebui_stt: true    # Utiliser Open WebUI pour STT
use_openwebui_llm: true    # Utiliser Open WebUI pour LLM
```

#### Options TTS
```yaml
tts_engine: "piper"        # Moteur TTS: espeak, piper, ha
tts_entity: "tts.piper"    # Entité TTS Home Assistant
voice_pitch: 0             # Hauteur de voix (-60 à 60)
```

### 3. Installer les scripts sur le Karotz

Voir le dossier `Karotz_Scripts/` dans ce dépôt pour les scripts nécessaires:
- `/karotz/Run/voice.recorder_cmd`
- `/usr/www/cgi-bin/voice_start`
- `/usr/www/cgi-bin/voice_stop`

Consultez `Karotz_Scripts/README.md` pour les instructions détaillées.

### 4. Configurer l'URL de l'add-on sur le Karotz

```bash
# Créer le fichier de configuration
echo "http://<HOME_ASSISTANT_IP>:8000" > /karotz/Run/voice.addon_url

# Remplacer <HOME_ASSISTANT_IP> par l'adresse de votre serveur Home Assistant
# Exemple: echo "http://192.168.1.100:8000" > /karotz/Run/voice.addon_url
```

## 🎚️ Configuration des scripts Karotz

### Configuration minimale

1. **Créer les répertoires:**
```bash
mkdir -p /karotz/Run /usr/www/cgi-bin /karotz/Sounds
```

2. **Copier les scripts:**
```bash
# Depuis votre machine locale vers le Karotz
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/karotz/Run/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/www/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/www/cgi-bin/
```

3. **Donner les permissions:**
```bash
chmod +x /karotz/Run/voice.recorder_cmd
chmod +x /usr/www/cgi-bin/voice_start
chmod +x /usr/www/cgi-bin/voice_stop
chown www-data:www-data /usr/www/cgi-bin/voice_start
chown www-data:www-data /usr/www/cgi-bin/voice_stop
```

4. **Configurer l'URL de l'add-on:**
```bash
echo "http://<HA_IP>:8000" > /karotz/Run/voice.addon_url
```

5. **Vérifier les dépendances:**
```bash
# Vérifier que ces commandes existent sur le Karotz
which arecord || which /usr/scripts/k2k/rec
which curl
which madplay
```

## 🔧 API Endpoints

### POST /api/voice
Envoi d'audio pour traitement vocal

**Requête:**
```bash
curl -X POST \
  -F "audio=@/tmp/voice.wav;filename=voice.wav" \
  http://localhost:8000/api/voice
```

**Réponse:**
```json
{
  "return": 0,
  "transcript": "allume la lumière du salon",
  "intent_detected": true,
  "intent_response": "J'allume la lumière du salon",
  "llm_response": null,
  "final_text": "J'allume la lumière du salon",
  "audio_url": "http://localhost:8000/audio/abc123.mp3",
  "actions": []
}
```

### GET /health
Vérifier l'état du service

**Requête:**
```bash
curl http://localhost:8000/health
```

**Réponse:**
```json
{
  "status": "ok",
  "version": "2.0.0",
  "options": {
    "ha_url": "http://supervisor/core",
    "openwebui_stt_url": "http://192.168.1.51:8080/v1/audio/transcriptions",
    "openwebui_llm_url": "http://192.168.1.51:8080/v1/chat/completions",
    "piper_tts_url": "http://192.168.1.100:8001",
    "karotz_ip": "192.168.1.103"
  }
}
```

### GET /config
Obtenir la configuration actuelle

**Requête:**
```bash
curl http://localhost:8000/config
```

### GET /audio/{name}
Télécharger un fichier audio depuis le cache

**Requête:**
```bash
curl http://localhost:8000/audio/abc123.mp3 -o voice.mp3
```

### GET /service/KarotzRvTTS
Endpoint de compatibilité pour l'ancien système TTS

**Requête:**
```bash
curl "http://localhost:8000/service/KarotzRvTTS?text=Bonjour"
```

### GET /api/mic
Contrôle du micro pour l'écoute passive

**Requête:**
```bash
# Activer
curl "http://localhost:8000/api/mic?on=1"

# Désactiver
curl "http://localhost:8000/api/mic?on=0"
```

## 🤖 Balises d'actions

Vous pouvez inclure des balises spéciales dans les réponses pour contrôler le Karotz:

| Balise | Format | Description |
|-------|--------|-------------|
| LED | `[led all 255 0 0]` | Allumer la LED en rouge |
| LED | `[led 0 255 0 0]` | Allumer la zone 0 en rouge |
| Oreilles | `[ears 50 50]` | Positionner les oreilles à 50% |
| Nez | `[nose 0]` | Animation du nez (0-5) |

### Exemples:
```
"[led all 0 0 255] Bonjour ! [led all 255 255 255]"
"J'allume la lumière [ears 100 100]"
```

## 🐛 Dépannage

### Problème: L'add-on ne démarre pas
- **Vérifiez les logs:** `docker logs <container_name>`
- **Vérifiez les dépendances:** `docker exec -it <container_name> bash` puis `python3 -c "import fastapi"`
- **Vérifiez les ports:** `netstat -tulnp | grep 8000`

### Problème: La transcription échoue
- Vérifiez que Open WebUI est accessible: `curl http://192.168.1.51:8080/health`
- Vérifiez que la clé API est correcte
- Vérifiez le format audio: le fichier doit être au format WAV, 16kHz, mono

### Problème: Home Assistant ne comprend pas
- Vérifiez que l'agent conversation est configuré dans HA
- Vérifiez que le token HA est valide
- Testez l'API HA: `curl -H "Authorization: Bearer <TOKEN>" http://<HA_IP>:8123/api/conversation/process -d '{"text":"test"}'`

### Problème: Le TTS ne fonctionne pas
- Vérifiez que Piper TTS est en cours d'exécution
- Vérifiez que l'URL est correcte: `curl http://192.168.1.100:8001/health`
- Testez la synthèse: `curl -X POST -H "Content-Type: application/json" -d '{"text":"Bonjour"}' http://192.168.1.100:8001/tts`

### Problème: Le Karotz ne joue pas le son
- Vérifiez que le fichier audio est généré dans le cache
- Vérifiez que l'URL de l'audio est accessible depuis le Karotz
- Testez manuellement: `curl "http://<KAROTZ_IP>/cgi-bin/sound?url=http://<ADDON_IP>:8000/audio/abc.mp3"`

## 📊 Exemples de configuration

### Configuration minimale
```yaml
{
  "ha_url": "http://supervisor/core",
  "ha_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "openwebui_stt_url": "http://192.168.1.51:8080/v1/audio/transcriptions",
  "openwebui_llm_url": "http://192.168.1.51:8080/v1/chat/completions",
  "piper_tts_url": "http://192.168.1.100:8001",
  "karotz_ip": "192.168.1.103",
  "llm_model": "llama3:8b",
  "stt_language": "fr"
}
```

### Configuration avancée
```yaml
{
  "ha_url": "http://192.168.1.100:8123",
  "ha_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "openwebui_stt_url": "http://192.168.1.51:8080/v1/audio/transcriptions",
  "openwebui_llm_url": "http://192.168.1.51:8080/v1/chat/completions",
  "openwebui_api_key": "sk-...",
  "piper_tts_url": "http://192.168.1.100:8001",
  "karotz_ip": "192.168.1.103",
  "llm_model": "mistral:7b",
  "stt_model": "whisper-1",
  "stt_language": "fr",
  "voice_pipeline": true,
  "conversation_agent": "homeassistant",
  "use_ha_conversation": true,
  "use_openwebui_stt": true,
  "use_openwebui_llm": true,
  "tts_engine": "piper",
  "voice_pitch": 0,
  "log_level": "info"
}
```

## 🔄 Intégration avec OpenKarotz DBus

Si vous utilisez OpenKarotz avec le moniteur DBus, vous pouvez configurer l'activation vocale via le bouton:

1. **Vérifiez que le fichier** `/usr/openkarotz/Run/voice.addon_url` existe
2. **Redémarrez** le service OpenKarotz
3. **Le moniteur DBus** devrait automatiquement utiliser `voice_start` et `voice_stop`

## 📚 Documentation complémentaire

- [Documentation OpenKarotz API](https://www.openkarotz.org/api/)
- [Home Assistant Conversation API](https://developers.home-assistant.io/docs/api/rest/)
- [Open WebUI Documentation](https://docs.openwebui.com/)
- [Ollama Documentation](https://github.com/jmorganca/ollama)

## 🎯 Prochaines étapes

1. ✅ Installer l'add-on dans Home Assistant
2. ✅ Configurer les URLs et tokens
3. ✅ Installer les scripts sur le Karotz
4. ✅ Tester avec une simple commande: "Allume la lumière"
5. ✅ Configurer les automatisations dans Home Assistant
6. ✅ Personnaliser les réponses LLM avec des prompts spécifiques

## 💡 Astuces

- **Cache audio:** Les fichiers TTS sont mis en cache pendant 7 jours
- **Optimisation:** Pour de meilleures performances, hébergez Open WebUI sur du matériel puissant
- **Langues:** Vous pouvez configurer plusieurs langues STT/TTT
- **Personnalisation:** Modifiez le `system_prompt` dans `app.py` pour adapter le comportement LLM
- **Sécurité:** Ne pas exposer les ports de l'add-on sur Internet

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur GitHub:
https://github.com/Desperado88/Home-Assistant-Karotz-2025/issues

## 📜 Licence

MIT License - Copyright (c) 2024 Mathieu Courcelle

---

**Amusez-vous avec votre assistant vocal intelligent ! 🎉**