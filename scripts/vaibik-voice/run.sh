#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
bash "$ROOT/scripts/vaibik-voice/setup.sh"
PYTHONPATH="$ROOT/.voice-venv/site-packages" python3 \
  "$ROOT/scripts/vaibik-voice/generate.py" "${1:-all}"
