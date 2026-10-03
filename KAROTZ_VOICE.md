# 🎤 Karotz Voice Integration v2.0.0 - Contrôle Vocal Complet

**Donnez une voix intelligente à votre Karotz avec LLM, Home Assistant et TTS !**

Ce document décrit l'intégration vocale complète pour votre lapin connecté Karotz, combinant :
- **Speech-To-Text (STT)** via Open WebUI / Ollama
- **Traitement Home Assistant** pour les commandes domotiques
- **LLM Fallback** pour les questions générales
- **Text-To-Speech (TTS)** via Piper
- **Restitution sonore** directe sur le Karotz

## 📋 Table des Matières

- [🎯 Architecture du Système](#-architecture-du-système)
- [🚀 Installation Rapide](#-installation-rapide)
- [📁 Structure du Projet](#-structure-du-projet)
- [🔧 Configuration Détaillée](#-configuration-détaillée)
- [🎚️ Scripts Karotz](#-scripts-karotz)
- [🏗️ Add-on Home Assistant](#-add-on-home-assistant)
- [🔄 Flux de Traitement](#-flux-de-traitement)
- [🤖 Exemples d'Utilisation](#-exemples-dutilisation)
- [🐛 Dépannage](#-dépannage)
- [🔄 Migration depuis v1.0](#-migration-depuis-v10)

---

## 🎯 Architecture du Système

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KAROTZ (Lapin Connecté)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   Bouton    │───▶│ voice_start  │───▶│ Enregistrement│              │
│  │   (Press)   │    │   (CGI)      │    │  Audio WAV   │              │
│  └─────────────┘    └─────────────┘    └──────┬───────┘              │
│                                                   │                      │
│                              ┌────────────────────────────────────┐   │
│                              │ voice.addon_url                     │   │
│                              │ http://HA_IP:8000/api/voice         │   │
│                              └────────────────────────────────────┘   │
│                                                   │                      │
│                                                   ▼                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐  │
│  │   Bouton    │───▶│ voice_stop   │───▶│  2. Envoi à l'Add-on            │  │
│  │   (Relâché) │    │   (CGI)      │    │     via POST multipart      │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   HOME ASSISTANT ADD-ON (karotz-voice)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  ENDPOINT: POST /api/voice                                       │  │
│  │  1. Réception fichier audio (.wav)                               │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  ÉTAPE 1: Speech-To-Text (STT)                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │ • Open WebUI STT API                                    │    │  │
│  │  │   POST http://192.168.1.51:8080/v1/audio/transcriptions   │    │  │
│  │  │ • Format: multipart/form-data                              │    │  │
│  │  │ • Modèle: whisper-1 (ou autre)                            │    │  │
│  │  │ • Langue: fr (configurable)                              │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │  Sortie: "allume la lumière du salon"                         │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  ÉTAPE 2: Home Assistant Intent Detection                       │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │ • Home Assistant Conversation API                        │    │  │
│  │  │   POST /api/conversation/process                         │    │  │
│  │  │ • Agent ID: configurable                                   │    │  │
│  │  │ • Analyse la demande et exécute les intents               │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │  Sortie: Intent détecté ? → Réponse HA                        │  │
│  │         "J'allume la lumière du salon"                        │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  ÉTAPE 3: LLM Fallback (si pas d'intent HA)                       │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │ • Open WebUI Chat API                                      │    │  │
│  │  │   POST http://192.168.1.51:8080/v1/chat/completions     │    │  │
│  │  │ • Modèle: llama3:8b (configurable)                         │    │  │
│  │  │ • Prompt systémique: Assistant vocal maison connectée     │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │  Sortie: Réponse intelligente                                 │  │
│  │         "Il fait 22 degrés dans le salon et il pleut dehors."   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  ÉTAPE 4: Synthèse Vocale (TTS)                                 │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │ • Piper TTS API                                              │    │  │
│  │  │   POST http://192.168.1.100:8001/tts                        │    │  │
│  │  │ • Format: texte → MP3                                        │    │  │
│  │  │ • Cache: fichiers audio mis en cache                        │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │  Sortie: Fichier audio.mp3                                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  ÉTAPE 5: Restitution Sonore                                     │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │ • Commande CGI Karotz                                       │    │  │
│  │  │   GET /cgi-bin/sound?url=...                                 │    │  │
│  │  │   GET /cgi-bin/play_sound?url=...                             │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │  Sortie: Le Karotz parle ! 🎵                                  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation Rapide

### Prérequis

- ✅ **Karotz** avec firmware OpenKarotz ou FreeRabbit
- ✅ **Home Assistant** (version ≥ 2024.0.0) avec Supervisor
- ✅ **Open WebUI** (version ≥ 0.2.0) installé sur Proxmox ou autre serveur
- ✅ **Ollama** (optionnel, pour les modèles locaux)
- ✅ **Piper TTS Add-on** installé et configuré

### Étape 1: Cloner le dépôt

```bash
git clone https://github.com/Desperado88/Home-Assistant-Karotz-2025.git
cd Home-Assistant-Karotz-2025
```

### Étape 2: Installer l'Add-on dans Home Assistant

#### Méthode A: Via l'interface Supervisor

1. Copier le dossier `karotz-voice-addon/` dans `/addons/` de votre Home Assistant
2. Redémarrer Home Assistant
3. Dans **Supervisor → Add-on Store → ... (trois points) → Repositories**
4. Ajouter: `https://github.com/Desperado88/Home-Assistant-Karotz-2025`
5. Installer **Karotz Voice Complete**

#### Méthode B: Manuellement

```bash
# Copier sur votre Home Assistant (via SSH)
scp -r karotz-voice-addon/ root@homeassistant:/addons/karotz_voice_complete/

# Redémarrer Home Assistant
```

### Étape 3: Configurer l'Add-on

Dans l'interface de configuration de l'add-on:

```yaml
# Configuration minimale
{
  "ha_url": "http://supervisor/core",
  "ha_token": "votre_token_long_lived",
  "openwebui_stt_url": "http://192.168.1.51:8080/v1/audio/transcriptions",
  "openwebui_llm_url": "http://192.168.1.51:8080/v1/chat/completions",
  "piper_tts_url": "http://192.168.1.100:8001",
  "karotz_ip": "192.168.1.103",
  "llm_model": "llama3:8b",
  "stt_language": "fr"
}
```

Voir [Configuration Détaillée](#-configuration-détaillée) pour toutes les options.

### Étape 4: Installer les Scripts sur le Karotz

```bash
# Se connecter au Karotz
ssh karotz@<KAROTZ_IP>

# Créer les répertoires
mkdir -p /karotz/Run /usr/www/cgi-bin /karotz/Sounds

# Copier les scripts (depuis votre machine)
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/karotz/Run/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/www/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/www/cgi-bin/

# Donner les permissions
ssh karotz@<KAROTZ_IP> "chmod +x /karotz/Run/voice.recorder_cmd /usr/www/cgi-bin/voice_start /usr/www/cgi-bin/voice_stop"

# Configurer l'URL de l'add-on
echo "http://<HOME_ASSISTANT_IP>:8000" > /karotz/Run/voice.addon_url
```

### Étape 5: Démarrer et Tester

1. **Démarrer l'add-on** dans Supervisor
2. **Vérifier le statut:** `http://<HA_IP>:8000/health`
3. **Tester l'enregistrement:**
   ```bash
   # Sur le Karotz
   curl "http://localhost/cgi-bin/voice_start"
   # Appuyez sur le bouton, puis:
   curl "http://localhost/cgi-bin/voice_stop"
   ```

---

## 📁 Structure du Projet

```
Home-Assistant-Karotz-2025/
├── Karotz_Scripts/                     # Scripts pour le Karotz
│   ├── voice.recorder_cmd              # Commande d'enregistrement audio
│   ├── voice_start                      # CGI: Démarre l'enregistrement
│   ├── voice_stop                       # CGI: Arrête et envoie à l'add-on
│   └── README.md                        # Instructions d'installation
│
├── karotz-voice-addon/                 # Add-on Home Assistant
│   ├── app.py                          # Serveur FastAPI principal
│   ├── config.yaml                     # Configuration de l'add-on
│   ├── build.yaml                      # Configuration de build
│   ├── Dockerfile                      # Dockerfile pour le conteneur
│   ├── requirements.txt                # Dépendances Python
│   ├── run.sh                          # Script de démarrage
│   └── README.md                        # Documentation de l'add-on
│
└── KAROTZ_VOICE.md                     # Documentation complète (ce fichier)
```

---

## 🔧 Configuration Détaillée

### Configuration de l'Add-on (config.yaml)

Toutes les options sont configurables via l'interface Supervisor:

#### 🏠 Home Assistant
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `ha_url` | url | `http://supervisor/core` | URL de Home Assistant |
| `ha_token` | password | - | Token Long Lived pour l'API HA |

#### 🤖 Open WebUI (STT et LLM)
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `openwebui_stt_url` | url | `http://192.168.1.51:8080/v1/audio/transcriptions` | URL de l'API STT |
| `openwebui_llm_url` | url | `http://192.168.1.51:8080/v1/chat/completions` | URL de l'API LLM |
| `openwebui_api_key` | password | - | Clé API Open WebUI (optionnelle) |

#### 🧠 Modèles IA
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `llm_model` | str | `llama3:8b` | Modèle LLM à utiliser |
| `stt_model` | str | `whisper-1` | Modèle STT à utiliser |
| `stt_language` | str | `fr` | Langue pour la transcription |

**Modèles LLM recommandés:**
- `llama3:8b` - Bon équilibre performance/qualité
- `mistral:7b` - Excellente compréhension du français
- `qwen2.5:7b` - Très bon pour les tâches générales
- `phi3:3.8b` - Léger et rapide

**Modèles STT:**
- `whisper-1` - Modèle Whisper par défaut
- `large-v3` - Meilleure précision (nécessite plus de ressources)

#### 🔊 Piper TTS
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `piper_tts_url` | url | `http://192.168.1.100:8001` | URL de l'add-on Piper TTS |

#### 🐰 Karotz
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `karotz_ip` | str | `192.168.1.103` | Adresse IP du Karotz |

#### ⚙️ Pipeline Vocal
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `voice_pipeline` | bool | `true` | Activer le pipeline vocal |
| `conversation_agent` | str | - | Agent Home Assistant (optionnel) |
| `input_audio_format` | list | `wav` | Format audio: auto, karotz_raw, wav, flac |
| `use_ha_conversation` | bool | `true` | Utiliser HA Conversation API |
| `use_openwebui_stt` | bool | `true` | Utiliser Open WebUI pour STT |
| `use_openwebui_llm` | bool | `true` | Utiliser Open WebUI pour LLM |

#### 🎵 TTS
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `tts_engine` | list | `piper` | Moteur TTS: espeak, piper, ha |
| `tts_entity` | str | `tts.piper` | Entité TTS Home Assistant |
| `voice_pitch` | int | `0` | Hauteur de voix (-60 à 60) |

#### 📝 Autres
| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `auto_listen` | bool | `false` | Écoute passive (réservé) |
| `wake_chime` | str | `start_record` | Son de réveil (réservé) |
| `log_level` | list | `info` | Niveau de journalisation: debug, info, warning, error |

---

## 🎚️ Scripts Karotz

### voice.recorder_cmd

**Emplacement:** `/karotz/Run/voice.recorder_cmd`

**Fonction:** Contient la commande d'enregistrement audio.

**Contenu:**
```bash
#!/bin/sh
# Utilise ALSA arecord ou le binaire natif Karotz
if command -v arecord >/dev/null 2>&1; then
    arecord -D hw:0,0 -f S16_LE -r 16000 -c 1 /tmp/voice.wav
else
    /usr/scripts/k2k/rec > /tmp/voice.wav
fi
```

**Configuration:**
- Format: S16_LE (16-bit signed little-endian)
- Fréquence: 16000 Hz
- Canaux: 1 (mono)
- Fichier de sortie: `/tmp/voice.wav`

### voice_start

**Emplacement:** `/usr/www/cgi-bin/voice_start`

**Fonction:**
1. Lance l'enregistrement en arrière-plan
2. Enregistre le PID dans `/tmp/voice.pid`
3. Allume la LED en bleu
4. Joue un son de bip d'initialisation

**Appel:**
```bash
curl "http://<KAROTZ_IP>/cgi-bin/voice_start"
```

**Réponse:**
```
Enregistrement démarré avec succès (PID: 12345)
```

### voice_stop

**Emplacement:** `/usr/www/cgi-bin/voice_stop`

**Fonction:**
1. Tue le processus d'enregistrement
2. Lit l'URL de l'add-on depuis `/karotz/Run/voice.addon_url`
3. Envoie `/tmp/voice.wav` via `curl` en POST multipart
4. Reçoit la réponse et déclenche la lecture audio sur le Karotz
5. Supprime le fichier temporaire

**Appel:**
```bash
curl "http://<KAROTZ_IP>/cgi-bin/voice_stop"
```

---

## 🏗️ Add-on Home Assistant

### Architecture Technique

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Server (port 8000)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Endpoints:                                            │
│  ├── POST /api/voice         # Traitement vocal complet   │
│  ├── GET  /health           # État du service            │
│  ├── GET  /config           # Configuration actuelle     │
│  ├── GET  /audio/{name}    # Téléchargement audio        │
│  └── GET  /service/KarotzRvTTS  # Compatibilité TTS       │
│                                                         │
│  Services:                                              │
│  ├── STT Service       # Open WebUI STT                │
│  ├── HA Service        # Home Assistant API            │
│  ├── LLM Service       # Open WebUI LLM                │
│  ├── TTS Service       # Piper TTS                      │
│  └── Karotz Service    # Commandes CGI Karotz          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Fichiers de l'Add-on

#### app.py
Serveur FastAPI principal avec:
- Traitement asynchrone des requêtes
- Intégration complète STT → HA → LLM → TTS
- Gestion des erreurs et fallback
- Cache audio pour optimiser les performances

#### config.yaml
Configuration de l'add-on pour Supervisor:
- Définition des ports (8000)
- Options configurables
- Schéma de validation

#### build.yaml
Configuration de build Docker:
- Architecture multi-arch (aarch64, amd64, armhf, armv7, i386)
- Options de build personnalisables

#### Dockerfile
Image Docker avec:
- Base: Home Assistant base images
- Python 3.11
- Toutes les dépendances système (ffmpeg, espeak, curl, git)
- Dépendances Python (FastAPI, httpx, requests, etc.)

#### requirements.txt
Dépendances Python:
```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
python-multipart>=0.0.6
httpx>=0.26.0
requests>=2.31.0
pydantic>=2.5.0
```

#### run.sh
Script de démarrage:
- Configuration de l'environnement
- Vérification des dépendances
- Lancement du serveur Uvicorn

---

## 🔄 Flux de Traitement

### Diagramme de Séquence

```
Utilisateur
   │
   ▼
Appuie bouton Karotz
   │
   ▼
DBus Monitor → lclick_start
   │
   ▼
voice_start CGI
   │
   ├── Lance voice.recorder_cmd en arrière-plan
   ├── Enregistre PID dans /tmp/voice.pid
   ├── Allume LED bleue
   └── Joue bip de démarrage
   │
   ▼
Utilisateur parle...
   │
   ▼
Utilisateur relâche bouton
   │
   ▼
DBus Monitor → lclick_end
   │
   ▼
voice_stop CGI
   │
   ├── Tue le processus d'enregistrement
   ├── Lit /karotz/Run/voice.addon_url
   ├── POST /api/voice avec /tmp/voice.wav
   │        │
   │        ▼
   │   Add-on vocal
   │        │
   │        ▼
   │   ┌─────────────────┐
   │   │ STT (Open WebUI)│──── STT Response
   │   └─────────────────┘
   │        │
   │        ▼
   │   ┌─────────────────────┐
   │   │ HA Conversation API │──── HA Response
   │   └─────────────────────┘
   │        │
   │        ▼
   │   Intent détecté?
   │        │
   │   Oui ─────▶ Réponse HA
   │        │
   │   Non ─────▶ LLM (Open WebUI)
   │                │
   │                ▼
   │           LLM Response
   │        │
   │        ▼
   │   ┌─────────────────┐
   │   │ TTS (Piper)      │──── Audio MP3
   │   └─────────────────┘
   │        │
   │        ▼
   │   GET /cgi-bin/sound?url=...
   │        │
   │        ▼
   └── Karotz joue l'audio
```

### Détail des Étapes

#### Étape 1: Réception Audio
```python
# Format attendu:
# - POST multipart avec field 'audio'
# - Ou corps brut (raw audio)

@APP.post("/api/voice")
async def voice_endpoint(audio: UploadFile = File(None)):
    # Sauvegarde dans /data/incoming/voice-*.wav
    # Détection automatique du format
```

#### Étape 2: Speech-To-Text
```python
async def transcribe_audio(audio_path: Path) -> str:
    # Envoi à Open WebUI STT
    stt_url = get_openwebui_stt_url()
    api_key = get_openwebui_api_key()
    
    files = {"file": (audio_path.name, open(audio_path, "rb"), "audio/wav")}
    data = {"model": "whisper-1", "language": "fr"}
    
    # Requête HTTP asynchrone
    async with httpx.AsyncClient() as client:
        response = await client.post(stt_url, files=files, data=data)
        return response.json()["text"]
```

#### Étape 3: Home Assistant Intent Detection
```python
async def process_home_assistant(text: str) -> dict:
    ha_url = get_ha_url()
    agent_id = options.get("conversation_agent", "")
    
    payload = {
        "text": text,
        "language": "fr",
        "agent_id": agent_id
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{ha_url}/api/conversation/process",
            json=payload,
            headers=ha_headers()
        )
        
        # Analyse de la réponse
        data = response.json()
        return {
            "intent_detected": "target" in data.get("response", {}),
            "response": extract_response_text(data)
        }
```

#### Étape 4: LLM Fallback
```python
async def process_llm(text: str) -> str:
    llm_url = get_openwebui_llm_url()
    model = get_llm_model()
    
    system_prompt = """Tu es un assistant vocal pour maison connectée.
                    Réponds en français, de manière concise et naturelle."""
    
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ],
        "temperature": 0.7
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{llm_url}/chat/completions", json=payload)
        return response.json()["choices"][0]["message"]["content"]
```

#### Étape 5: Synthèse Vocale
```python
async def synthesize_text(text: str) -> Path:
    piper_url = get_piper_tts_url()
    cache_key = hashlib.md5(text.encode()).hexdigest()
    mp3_path = CACHE_DIR / f"{cache_key}.mp3"
    
    # Vérifier le cache
    if mp3_path.exists():
        return mp3_path
    
    # Envoyer à Piper TTS
    payload = {"text": text, "language": "fr"}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{piper_url}/tts", json=payload)
        mp3_path.write_bytes(response.content)
        return mp3_path
```

#### Étape 6: Restitution Sonore
```python
async def play_on_karotz(audio_path: Path) -> bool:
    karotz_url = get_karotz_url()
    audio_url = f"http://{karotz_url.split('://')[1]}/audio/{audio_path.name}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{karotz_url}/cgi-bin/sound",
            params={"url": audio_url}
        )
        return response.status_code == 200
```

---

## 🤖 Exemples d'Utilisation

### Exemple 1: Commande Domotique Simple

**Utilisateur:** "Allume la lumière du salon"

**Flux:**
1. STT: "Allume la lumière du salon"
2. HA Intent: Detecté → Exécute `light.turn_on` pour le salon
3. Réponse HA: "J'ai allumé la lumière du salon"
4. TTS: Génère audio MP3
5. Karotz: "J'ai allumé la lumière du salon"

**JSON Response:**
```json
{
  "return": 0,
  "transcript": "allume la lumière du salon",
  "intent_detected": true,
  "intent_response": "J'ai allumé la lumière du salon",
  "llm_response": null,
  "final_text": "J'ai allumé la lumière du salon",
  "audio_url": "http://192.168.1.100:8000/audio/abc123.mp3",
  "actions": []
}
```

### Exemple 2: Question Générale (Fallback LLM)

**Utilisateur:** "Quelle est la capitale de la France ?"

**Flux:**
1. STT: "Quelle est la capitale de la France ?"
2. HA Intent: Non détecté (pas de commande domotique)
3. LLM: "La capitale de la France est Paris"
4. TTS: Génère audio MP3
5. Karotz: "La capitale de la France est Paris"

**JSON Response:**
```json
{
  "return": 0,
  "transcript": "Quelle est la capitale de la France ?",
  "intent_detected": false,
  "intent_response": "",
  "llm_response": "La capitale de la France est Paris",
  "final_text": "La capitale de la France est Paris",
  "audio_url": "http://192.168.1.100:8000/audio/def456.mp3",
  "actions": []
}
```

### Exemple 3: Avec Actions (LED, Oreilles)

**Utilisateur:** "Fais danser le lapin !"

**LLM Response:** "[led all 255 0 0] Je danse ! [led all 0 255 0] [ears 100 0] [ears 0 100] [ears 100 100]"

**Flux:**
1. Application des actions pendant la lecture
2. LED passe du rouge au vert
3. Oreilles bougent
4. Karotz: "Je danse !"

**JSON Response:**
```json
{
  "return": 0,
  "transcript": "Fais danser le lapin !",
  "intent_detected": false,
  "intent_response": "",
  "llm_response": "[led all 255 0 0] Je danse ! [led all 0 255 0] [ears 100 0] [ears 0 100]",
  "final_text": "Je danse !",
  "audio_url": "http://192.168.1.100:8000/audio/ghi789.mp3",
  "actions": [
    {"type": "led", "args": "all 255 0 0"},
    {"type": "led", "args": "all 0 255 0"},
    {"type": "ears", "args": "100 0"},
    {"type": "ears", "args": "0 100"},
    {"type": "ears", "args": "100 100"}
  ]
}
```

### Exemple 4: Commande avec Confirmation

**Utilisateur:** "Éteins toutes les lumières"

**HA Response:** "J'ai éteint 5 lumières dans la maison"

**JSON Response:**
```json
{
  "return": 0,
  "transcript": "Éteins toutes les lumières",
  "intent_detected": true,
  "intent_response": "J'ai éteint 5 lumières dans la maison",
  "llm_response": null,
  "final_text": "J'ai éteint 5 lumières dans la maison",
  "audio_url": "http://192.168.1.100:8000/audio/jkl012.mp3",
  "actions": []
}
```

---

## 🐛 Dépannage

### Problèmes Courants

#### 1. L'add-on ne démarre pas

**Symptômes:**
- Statut "error" dans Supervisor
- Logs: "ModuleNotFoundError: No module named 'fastapi'"

**Solutions:**
```bash
# Rebuilder l'add-on
docker pull ghcr.io/home-assistant/amd64-base:latest

# Vérifier les dépendances
python3 -c "import fastapi; import uvicorn; import httpx"

# Réinstaller les dépendances
pip3 install -r /app/requirements.txt
```

#### 2. Erreur de connexion à Open WebUI

**Symptômes:**
- Logs: "ConnectionError: Failed to connect to 192.168.1.51:8080"

**Solutions:**
```bash
# Vérifier que Open WebUI est accessible
curl http://192.168.1.51:8080/health

# Vérifier le firewall
ping 192.168.1.51

# Vérifier que le port est ouvert
nc -zv 192.168.1.51 8080

# Vérifier la configuration dans l'add-on
cat /data/options.json
```

#### 3. Home Assistant retourne "Unauthorized"

**Symptômes:**
- Logs: "HTTP 401 Unauthorized"

**Solutions:**
```bash
# Générer un nouveau token Long Lived dans Home Assistant
# Profile → Long Lived Access Tokens

# Tester le token
curl -H "Authorization: Bearer <TOKEN>" http://supervisor/core/api/

# Mettre à jour la configuration de l'add-on
```

#### 4. La transcription retourne du texte vide

**Symptômes:**
- Logs: "Transcription: " (vide)

**Solutions:**
```bash
# Vérifier que le fichier audio est valide
# Le fichier doit être au format WAV, 16kHz, mono, 16-bit

# Tester manuellement la transcription
curl -X POST \
  -F "file=@/tmp/test.wav" \
  -F "model=whisper-1" \
  -F "language=fr" \
  http://192.168.1.51:8080/v1/audio/transcriptions

# Tester avec un fichier connu
# Télécharger un fichier WAV de test et le convertir
ffmpeg -i input.mp3 -ar 16000 -ac 1 -f wav test.wav
```

#### 5. Le TTS ne génère pas de fichier

**Symptômes:**
- Logs: "Exception TTS: ..."

**Solutions:**
```bash
# Vérifier que Piper TTS est en cours d'exécution
curl http://192.168.1.100:8001/health

# Tester manuellement le TTS
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"text": "Bonjour", "language": "fr"}' \
  http://192.168.1.100:8001/tts

# Vérifier que le format est MP3
file /data/cache/*.mp3
```

#### 6. Le Karotz ne joue pas le son

**Symptômes:**
- Le fichier audio est généré mais rien n'est joué

**Solutions:**
```bash
# Tester manuellement la lecture sur le Karotz
curl "http://<KAROTZ_IP>/cgi-bin/sound?url=http://<ADDON_IP>:8000/audio/test.mp3"

# Vérifier que le fichier est accessible depuis le Karotz
curl -I http://<ADDON_IP>:8000/audio/test.mp3

# Tester avec un fichier MP3 direct
curl "http://<KAROTZ_IP>/cgi-bin/play_sound?url=http://exemple.com/test.mp3"
```

#### 7. Problème de format audio

**Symptômes:**
- STT échoue avec "Invalid audio format"

**Solutions:**
```bash
# Convertir le fichier audio au bon format
ffmpeg -i input.wav -ar 16000 -ac 1 -f wav -acodec pcm_s16le output.wav

# Vérifier le format
file /tmp/voice.wav
# Doit afficher: "RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 16000 Hz"

# Modifier voice.recorder_cmd pour utiliser le bon format
echo "arecord -D hw:0,0 -f S16_LE -r 16000 -c 1 /tmp/voice.wav" > /karotz/Run/voice.recorder_cmd
```

### Vérifications de Base

#### Vérifier l'add-on
```bash
# État
docker ps | grep karotz_voice

# Logs
docker logs <container_name>

# Test de l'endpoint health
curl http://localhost:8000/health
```

#### Vérifier Open WebUI
```bash
# État
curl http://192.168.1.51:8080/health

# Test STT
curl -X POST -F "file=@test.wav" http://192.168.1.51:8080/v1/audio/transcriptions

# Test LLM
curl -X POST -H "Content-Type: application/json" \
  -d '{"model":"llama3:8b","messages":[{"role":"user","content":"Bonjour"}]}' \
  http://192.168.1.51:8080/v1/chat/completions
```

#### Vérifier Piper TTS
```bash
# État
curl http://192.168.1.100:8001/health

# Test TTS
curl -X POST -H "Content-Type: application/json" \
  -d '{"text":"Bonjour"}' \
  http://192.168.1.100:8001/tts
```

#### Vérifier Home Assistant
```bash
# État
curl -H "Authorization: Bearer <TOKEN>" http://supervisor/core/api/

# Test Conversation API
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}' \
  http://supervisor/core/api/conversation/process
```

---

## 🔄 Migration depuis v1.0

### Changements Majeurs

1. **Passage à FastAPI** (au lieu de Flask)
   - Meilleure performance
   - Support natif async/await
   - Documentation automatique

2. **Nouvelle Architecture STT**
   - Intégration native Open WebUI
   - Support multipart/form-data
   - Meilleure gestion des erreurs

3. **Fallback LLM Intelligent**
   - Détection automatique quand HA ne comprend pas
   - Prompt systémique personnalisé
   - Support de plusieurs modèles

4. **Cache Audio Amélioré**
   - Cache basé sur hash MD5
   - Fichiers MP3 au lieu de WAV
   - Nettoyage automatique

5. **Gestion des Actions**
   - Balises [led], [ears], [nose]
   - Exécution asynchrone

### Étapes de Migration

1. **Sauvegarder la configuration actuelle**
```bash
# Dans le dossier de l'ancien add-on
cp /data/options.json /backup/options_v1.json
```

2. **Installer la nouvelle version**
```bash
# Suivre les instructions d'installation ci-dessus
```

3. **Mettre à jour la configuration**
```yaml
# Comparer les nouvelles options avec l'ancienne configuration
# Noter que certaines options ont changé de nom:
# - stt_model au lieu de whisper_model
# - openwebui_stt_url au lieu de stt_url
# - use_openwebui_stt au lieu de voice_pipeline
```

4. **Mettre à jour les scripts Karotz**
```bash
# Les nouveaux scripts sont compatibles avec l'ancienne version
# Mais il est recommandé de mettre à jour pour les nouvelles fonctionnalités
cp Karotz_Scripts/voice.* /usr/www/cgi-bin/
```

5. **Redémarrer et Tester**
```bash
# Redémarrer l'add-on
# Tester avec une simple commande
```

---

## 📖 Documentation Complémentaire

- [Documentation Open WebUI](https://docs.openwebui.com/)
- [Home Assistant REST API](https://developers.home-assistant.io/docs/api/rest/)
- [OpenKarotz API Documentation](https://www.openkarotz.org/api/)
- [Ollama Documentation](https://github.com/jmorganca/ollama)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## 🎉 Conclusion

Vous avez maintenant un système de contrôle vocal complet pour votre Karotz ! 🎉

**Fonctionnalités clés:**
- ✅ Reconnaissance vocale précise via Open WebUI
- ✅ Intégration native avec Home Assistant
- ✅ Réponses intelligentes via LLM
- ✅ Voix naturelle avec Piper TTS
- ✅ Contrôle complet du Karotz (LED, oreilles)
- ✅ Architecture extensible et personnalisable

**Prochaines étapes suggérées:**
1. Personnaliser le `system_prompt` dans `app.py` pour adapter le comportement
2. Ajouter des agents conversation spécifiques dans Home Assistant
3. Configurer des automatisations basées sur la reconnaissance vocale
4. Expérimenter avec différents modèles LLM
5. Partager vos retours et suggestions !

---

*Documentation générée le 3 octobre 2026*
*Version: 2.0.0*
*Licence: MIT*