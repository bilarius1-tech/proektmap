#!/usr/bin/env bash
# Safe sync of web/ → production. NEVER deletes public/uploads or storage.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/reverans_deploy_ed25519}"
HOST="${DEPLOY_HOST:-deploy@159.194.228.226}"
REMOTE="${DEPLOY_REMOTE_PATH:-/var/www/reverans/web}"

# Optional: BACKUP_BEFORE=0 to skip (default: backup)
if [[ "${BACKUP_BEFORE:-1}" != "0" ]]; then
  echo "→ production backup before sync"
  "${ROOT}/deploy/backup-prod.sh" || {
    echo "WARN: backup failed — aborting rsync to protect data" >&2
    exit 1
  }
fi

RSYNC=(rsync -az
  -e "ssh -i ${KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
  --exclude node_modules
  --exclude .next
  --exclude .env
  --exclude '.env.*'
  --exclude 'public/uploads/'
  --exclude 'public/uploads/**'
  --exclude 'storage/'
  --exclude 'storage/**'
)

if [[ "${1:-}" == "--delete-code" ]]; then
  # Deletes obsolete *code* on remote, but still keeps uploads/storage via excludes above.
  RSYNC+=(--delete)
fi

echo "→ rsync ${ROOT}/web/ → ${HOST}:${REMOTE}/"
"${RSYNC[@]}" "${ROOT}/web/" "${HOST}:${REMOTE}/"

echo "→ ensure uploads dir on remote"
ssh -i "${KEY}" -o IdentitiesOnly=yes "${HOST}" \
  "mkdir -p ${REMOTE}/public/uploads ${REMOTE}/storage/medical /var/www/reverans/backups && chmod 755 ${REMOTE}/public/uploads && chmod 700 /var/www/reverans/backups"

echo "OK. Next on VPS: npm run build && pm2 restart reverans --update-env"
