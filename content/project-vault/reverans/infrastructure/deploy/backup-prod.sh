#!/usr/bin/env bash
# Full production backup on VPS (code + uploads + storage + DB + tz).
# Safe location: /var/www/reverans/backups — OUTSIDE web/, so rsync cannot wipe it.
set -euo pipefail

KEY="${DEPLOY_SSH_KEY:-${HOME}/.ssh/reverans_deploy_ed25519}"
HOST="${DEPLOY_HOST:-deploy@159.194.228.226}"
KEEP="${BACKUP_KEEP:-10}"

ssh -i "${KEY}" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new "${HOST}" \
  "KEEP=${KEEP} bash -s" <<'REMOTE'
set -euo pipefail
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
ROOT=/var/www/reverans
DEST="${ROOT}/backups"
WEB="${ROOT}/web"
WORK="${DEST}/work-${STAMP}"
OUT="${DEST}/reverans-full-${STAMP}.tar.gz"

mkdir -p "${DEST}" "${WORK}/web" "${WORK}/tz" "${WORK}/db"
chmod 700 "${DEST}"

echo "==> stamp ${STAMP}"

# App without heavy/rebuildable dirs; KEEP uploads + storage + .env
rsync -a \
  --exclude node_modules \
  --exclude .next \
  --exclude '.git' \
  "${WEB}/" "${WORK}/web/"

# TZ static docs
if [[ -d "${ROOT}/tz" ]]; then
  rsync -a "${ROOT}/tz/" "${WORK}/tz/"
fi

# Extra data dir if present
if [[ -d "${ROOT}/data" ]]; then
  rsync -a "${ROOT}/data/" "${WORK}/data/"
fi

# PostgreSQL dump via DATABASE_URL from .env (do not echo secrets)
if [[ -f "${WEB}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source <(grep -E '^(DATABASE_URL)=' "${WEB}/.env" | sed 's/\r$//')
  set +a
fi
if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "==> pg_dump"
  # pg_dump rejects Prisma-style ?schema=public — strip query string
  DUMP_URL="${DATABASE_URL%%\?*}"
  pg_dump --no-owner --no-acl "${DUMP_URL}" > "${WORK}/db/reverans_db.sql"
else
  echo "WARN: DATABASE_URL missing — DB not dumped" >&2
fi

# Manifest
{
  echo "created_utc=${STAMP}"
  echo "host=$(hostname)"
  echo "web_bytes=$(du -sb "${WORK}/web" | awk '{print $1}')"
  echo "uploads_count=$(find "${WORK}/web/public/uploads" -type f 2>/dev/null | wc -l)"
  echo "db_dump=$([ -f "${WORK}/db/reverans_db.sql" ] && echo yes || echo no)"
} > "${WORK}/MANIFEST.txt"

echo "==> pack ${OUT}"
tar -C "${WORK}" -czf "${OUT}" .
chmod 600 "${OUT}"
rm -rf "${WORK}"

# Retention
ls -1t "${DEST}"/reverans-full-*.tar.gz 2>/dev/null | tail -n +"$((KEEP + 1))" | while read -r old; do
  rm -f "${old}"
done

echo "OK ${OUT}"
ls -lh "${OUT}"
df -h "${DEST}" | tail -1
REMOTE
