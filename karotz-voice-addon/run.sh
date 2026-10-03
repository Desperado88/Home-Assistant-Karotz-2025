#!/usr/bin/env bash
# Script de démarrage pour l'add-on vocal Karotz
# Ce script configure l'environnement et lance l'application

set -euo pipefail

# Configuration des variables d'environnement
export OPTIONS_FILE="/data/options.json"
export DATA_DIR="/data"
export CACHE_DIR="/data/cache"
export INCOMING_DIR="/data/incoming"

# Créer les répertoires nécessaires
mkdir -p "${DATA_DIR}" "${CACHE_DIR}" "${INCOMING_DIR}"

# Charger les options de configuration si elles existent
if [ -f "${OPTIONS_FILE}" ]; then
    echo "Chargement de la configuration depuis ${OPTIONS_FILE}"
    # Exporter les variables depuis le JSON (format simple)
    # Note: Pour un traitement JSON complet, utiliser jq si disponible
    export HA_URL=$(jq -r '.ha_url // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export HA_TOKEN=$(jq -r '.ha_token // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export OPENWEBUI_STT_URL=$(jq -r '.openwebui_stt_url // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export OPENWEBUI_LLM_URL=$(jq -r '.openwebui_llm_url // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export OPENWEBUI_API_KEY=$(jq -r '.openwebui_api_key // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export KAROTZ_IP=$(jq -r '.karotz_ip // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export PIPER_TTS_URL=$(jq -r '.piper_tts_url // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export LLM_MODEL=$(jq -r '.llm_model // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export STT_MODEL=$(jq -r '.stt_model // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")
    export STT_LANGUAGE=$(jq -r '.stt_language // "fr"' "${OPTIONS_FILE}" 2>/dev/null || echo "fr")
fi

# Vérifier si jq est disponible, sinon l'installer
echo "Vérification de jq..."
if ! command -v jq >/dev/null 2>&1; then
    echo "Installation de jq..."
    apk add --no-cache jq
fi

# Configuration du niveau de journalisation
export LOG_LEVEL=$(jq -r '.log_level // "info"' "${OPTIONS_FILE}" 2>/dev/null || echo "info")

# Nettoyer les fichiers temporaires au démarrage
find "${CACHE_DIR}" -name "*.mp3" -mtime +7 -delete 2>/dev/null || true
find "${CACHE_DIR}" -name "*.wav" -mtime +7 -delete 2>/dev/null || true
find "${INCOMING_DIR}" -name "voice-*" -mtime +1 -delete 2>/dev/null || true

# Afficher les informations de configuration
echo "=== Karotz Voice Add-on ==="
echo "Version: 2.0.0"
echo "Port: 8000"
echo "Configuration chargée depuis: ${OPTIONS_FILE}"
echo "Langue STT: ${STT_LANGUAGE:-fr}"
echo "Modèle LLM: ${LLM_MODEL:-llama3:8b}"
echo "Niveau de log: ${LOG_LEVEL:-info}"
echo ""

# Vérifier les dépendances critiques
echo "Vérification des dépendances..."

# Vérifier Python
if ! command -v python3 >/dev/null 2>&1; then
    echo "ERREUR: Python 3 non trouvé!"
    exit 1
fi

# Vérifier pip
if ! python3 -m pip >/dev/null 2>&1; then
    echo "ERREUR: pip non trouvé!"
    exit 1
fi

# Vérifier l'application
if [ ! -f "/app/app.py" ]; then
    echo "ERREUR: Fichier app.py non trouvé!"
    exit 1
fi

# Vérifier les dépendances Python installées
python3 -c "import fastapi; import uvicorn; import httpx; import requests" 2>/dev/null || {
    echo "Installation des dépendances manquantes..."
    python3 -m pip install --no-cache-dir -r /app/requirements.txt
}

echo "Toutes les dépendances sont prêtes!"
echo ""

# Message de démarrage
echo "Démarrage du serveur Karotz Voice Add-on..."
echo "Serveur accessible sur: http://0.0.0.0:8000"
echo "Point de santé: http://0.0.0.0:8000/health"
echo "Endpoint vocal: POST http://0.0.0.0:8000/api/voice"
echo ""

# Lancer le serveur FastAPI avec Uvicorn
exec python3 -m uvicorn app:APP \
    --host 0.0.0.0 \
    --port 8000 \
    --log-level "${LOG_LEVEL:-info}" \
    --workers 1 \
    --reload false

# Note: Le serveur s'exécute en foreground, donc on utilise exec pour le remplacer par le processus uvicorn
# Cela permet une meilleure gestion des signaux (comme SIGTERM)
