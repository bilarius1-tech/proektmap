#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PYTHON_PACKAGES="$ROOT/.voice-venv/site-packages"
CACHE="$ROOT/.voice-cache/piper"
MODEL="$CACHE/ru_RU-denis-medium.onnx"
CONFIG="$MODEL.json"
BASE_URL="https://huggingface.co/rhasspy/piper-voices/resolve/main/ru/ru_RU/denis/medium"

command -v python3 >/dev/null || { echo "Нужен Python 3"; exit 1; }
command -v ffmpeg >/dev/null || { echo "Нужен ffmpeg"; exit 1; }

mkdir -p "$PYTHON_PACKAGES"
if ! PYTHONPATH="$PYTHON_PACKAGES" python3 -c "import piper" 2>/dev/null; then
  python3 -m pip install --target "$PYTHON_PACKAGES" piper-tts
fi

mkdir -p "$CACHE"
if [[ ! -s "$MODEL" ]]; then
  curl --fail --location --retry 3 \
    "$BASE_URL/ru_RU-denis-medium.onnx?download=true" \
    --output "$MODEL"
fi
if [[ ! -s "$CONFIG" ]]; then
  curl --fail --location --retry 3 \
    "$BASE_URL/ru_RU-denis-medium.onnx.json?download=true" \
    --output "$CONFIG"
fi

echo "Локальный Piper TTS готов: $MODEL"
