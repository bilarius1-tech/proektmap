#!/usr/bin/env bash
# Переносит SMTP из .env ProektMap в настройки Flarum (пароль хранится в БД форума, как штатно у Flarum).
set -euo pipefail

SITE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
FORUM_DIR="${FORUM_DIR:-/var/www/www-root/data/www/proektmap-forum}"

set -a
# shellcheck disable=SC1091
. <(grep -E '^SMTP_(HOST|PORT|USER|PASS)=' "$SITE_DIR/.env")
set +a

: "${SMTP_HOST:?}" "${SMTP_PORT:?}" "${SMTP_USER:?}" "${SMTP_PASS:?}"

cd "$FORUM_DIR"
/opt/php84/bin/php -r '
$cfg = require "config.php";
$db = $cfg["database"];
$pdo = new PDO("mysql:host={$db["host"]};port={$db["port"]};dbname={$db["database"]};charset=utf8mb4", $db["username"], $db["password"]);
$port = (int) getenv("SMTP_PORT");
$settings = [
  "mail_driver"     => "smtp",
  "mail_host"       => getenv("SMTP_HOST"),
  "mail_port"       => (string) $port,
  "mail_encryption" => $port === 465 ? "ssl" : "tls",
  "mail_username"   => getenv("SMTP_USER"),
  "mail_password"   => getenv("SMTP_PASS"),
  "mail_from"       => getenv("SMTP_USER"),
];
$stmt = $pdo->prepare("REPLACE INTO settings (`key`, `value`) VALUES (?, ?)");
foreach ($settings as $k => $v) { $stmt->execute([$k, $v]); }
echo "mail: smtp {$settings["mail_host"]}:{$port}\n";
'
sudo -u www-root /opt/php84/bin/php -d memory_limit=1G flarum cache:clear >/dev/null
