#!/bin/bash
# ProektMap — синхронизация VK Video → БД (раз в час)
set -euo pipefail

ROOT="/var/www/www-root/data/www/proektmap.ru"
LOCKFILE="/tmp/proektmap-vk-video-sync.lock"
LOGFILE="/var/log/proektmap-vk-video-sync.log"
TIMEOUT=90

if [ -f "$LOCKFILE" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] SKIPPED: lock" >> "$LOGFILE"
  exit 0
fi
touch "$LOCKFILE"
trap 'rm -f "$LOCKFILE"' EXIT

# Подтягиваем CRON_SECRET из .env без экспорта всего файла в лог
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
  "https://proektmap.ru/api/vk-video/sync" 2>&1) || {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] FAIL: $RESPONSE" >> "$LOGFILE"
  exit 1
}

echo "[$(date '+%Y-%m-%d %H:%M:%S')] OK: $(echo "$RESPONSE" | head -c 500)" >> "$LOGFILE"

if [ -f "$LOGFILE" ] && [ "$(stat -c%s "$LOGFILE" 2>/dev/null || echo 0)" -gt 1048576 ]; then
  mv "$LOGFILE" "${LOGFILE}.1"
fi
