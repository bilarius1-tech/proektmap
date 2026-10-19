#!/usr/bin/env bash
# Бэкап ИИ Форума: БД proektmap_forum + загруженные файлы + config.php. Хранит 14 дней.
# Cron (root): 30 3 * * * /var/www/www-root/data/www/proektmap.ru/forum/scripts/backup-forum.sh
set -euo pipefail

FORUM_DIR="${FORUM_DIR:-/var/www/www-root/data/www/proektmap-forum}"
BACKUP_DIR="${BACKUP_DIR:-/root/backups/forum}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M)"

umask 077
mkdir -p "$BACKUP_DIR"

# root читает MySQL через /root/.my.cnf, пароль в командную строку не попадает.
mysqldump --single-transaction --quick --routines --no-tablespaces proektmap_forum \
  | gzip > "$BACKUP_DIR/proektmap_forum-$STAMP.sql.gz"

tar -czf "$BACKUP_DIR/proektmap_forum-files-$STAMP.tar.gz" \
  -C "$FORUM_DIR" config.php composer.json composer.lock public/assets/avatars public/assets/files 2>/dev/null \
  || tar -czf "$BACKUP_DIR/proektmap_forum-files-$STAMP.tar.gz" -C "$FORUM_DIR" config.php composer.json composer.lock

find "$BACKUP_DIR" -name 'proektmap_forum-*' -mtime +"$KEEP_DAYS" -delete

echo "OK $BACKUP_DIR/proektmap_forum-$STAMP.sql.gz"
