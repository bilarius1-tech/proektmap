#!/bin/bash
# ProektMap — автопилот поисковых активов (1 раз/день)
set -euo pipefail

ROOT="/var/www/www-root/data/www/proektmap.ru"
LOCKFILE="/tmp/proektmap-content-autopilot.lock"
LOGFILE="/var/log/proektmap-content-autopilot.log"
TIMEOUT=150

if [ -f "$LOCKFILE" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] SKIPPED: lock" >> "$LOGFILE"
  exit 0
fi
touch "$LOCKFILE"
trap 'rm -f "$LOCKFILE"' EXIT

SECRET=$(grep -E '^CRON_SECRET=' "$ROOT/.env" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")
if [ -z "${SECRET:-}" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] FAIL: no CRON_SECRET" >> "$LOGFILE"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] START" >> "$LOGFILE"
RESPONSE=$(curl -s -X POST \
  -H "x-cron-secret: $SECRET" \
  -H "Content-Type: application/json" \
  --max-time "$TIMEOUT" \
  "https://proektmap.ru/api/blog/content-autopilot" 2>&1) || {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] FAIL: $RESPONSE" >> "$LOGFILE"
  exit 1
}

echo "[$(date '+%Y-%m-%d %H:%M:%S')] OK: $RESPONSE" >> "$LOGFILE"
