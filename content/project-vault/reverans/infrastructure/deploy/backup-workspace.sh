#!/usr/bin/env bash
# Archive this workspace (Nordic/agent tree) into production backups folder.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEY="${DEPLOY_SSH_KEY:-${HOME}/.ssh/reverans_deploy_ed25519}"
HOST="${DEPLOY_HOST:-deploy@159.194.228.226}"
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
LOCAL_TAR="/tmp/reverans-workspace-${STAMP}.tar.gz"

echo "==> pack workspace ${ROOT}"
tar -C "${ROOT}" -czf "${LOCAL_TAR}" \
  --exclude='web/node_modules' \
  --exclude='web/.next' \
  --exclude='**/node_modules' \
  --exclude='**/.next' \
  --exclude='harness/reports' \
  --exclude='.git' \
  --exclude='secrets' \
  --exclude='web/.env' \
  --exclude='web/public/uploads' \
  .

echo "==> upload to VPS backups"
ssh -i "${KEY}" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new "${HOST}" \
  'mkdir -p /var/www/reverans/backups && chmod 700 /var/www/reverans/backups'
scp -i "${KEY}" -o IdentitiesOnly=yes "${LOCAL_TAR}" \
  "${HOST}:/var/www/reverans/backups/reverans-workspace-${STAMP}.tar.gz"
ssh -i "${KEY}" -o IdentitiesOnly=yes "${HOST}" \
  "chmod 600 /var/www/reverans/backups/reverans-workspace-${STAMP}.tar.gz && ls -lh /var/www/reverans/backups/reverans-workspace-${STAMP}.tar.gz"
rm -f "${LOCAL_TAR}"
echo "OK workspace backup on VPS"
