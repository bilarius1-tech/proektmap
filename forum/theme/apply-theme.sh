#!/usr/bin/env bash
# Применяет тему ИИ Форума из forum/theme/ в настройки Flarum и пересобирает CSS.
set -euo pipefail

THEME_DIR="$(cd "$(dirname "$0")" && pwd)"
FORUM_DIR="${FORUM_DIR:-/var/www/www-root/data/www/proektmap-forum}"
SITE_PUBLIC="$(cd "$THEME_DIR/../.." && pwd)/public"

install -o www-root -g www-root -m 644 "$SITE_PUBLIC/favicon.ico" "$FORUM_DIR/public/assets/favicon.ico"

cd "$FORUM_DIR"
THEME_DIR="$THEME_DIR" /opt/php84/bin/php -r '
$cfg = require "config.php";
$db = $cfg["database"];
$pdo = new PDO("mysql:host={$db["host"]};port={$db["port"]};dbname={$db["database"]};charset=utf8mb4", $db["username"], $db["password"]);
$dir = getenv("THEME_DIR");
$settings = [
  "custom_less"          => file_get_contents("$dir/custom.less"),
  "custom_header"        => file_get_contents("$dir/custom-header.html"),
  "custom_footer"        => file_get_contents("$dir/custom-footer.html"),
  "favicon_path"         => "favicon.ico",
  "color_scheme"         => "light",
  "allow_user_color_scheme" => "1",
  "theme_primary_color"  => "#0FB880",
  "theme_secondary_color"=> "#111111",
  "theme_colored_header" => "0",
];
$stmt = $pdo->prepare("REPLACE INTO settings (`key`, `value`) VALUES (?, ?)");
foreach ($settings as $k => $v) { $stmt->execute([$k, $v]); }
echo "settings: ".count($settings)."\n";
'

sudo -u www-root /opt/php84/bin/php -d memory_limit=1G flarum cache:clear >/dev/null
echo "OK: тема применена"
