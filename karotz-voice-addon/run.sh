#!/usr/bin/env bash
set -euo pipefail

export OPTIONS_FILE="/data/options.json"
export WHISPER_CPP_DIR="/opt/whisper.cpp"
export MODEL_DIR="/data/models"
mkdir -p "${MODEL_DIR}" /data/cache /data/incoming

python3 /app/app.py
