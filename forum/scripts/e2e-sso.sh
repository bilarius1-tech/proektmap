#!/usr/bin/env bash
# Сквозной тест SSO: вход на ProektMap → /community/auth/proektmap → пользователь форума.
# Секреты берутся из /root/.secrets/proektmap-forum.env (TEST_USER, TEST_PASSWORD, FORUM_BETA_*).
set -euo pipefail

SITE="${SITE:-https://proektmap.ru}"
. /root/.secrets/proektmap-forum.env

JAR="$(mktemp)"
trap 'rm -f "$JAR"' EXIT
BASIC=()
[ -n "${FORUM_BETA_PASSWORD:-}" ] && BASIC=(-u "${FORUM_BETA_USER}:${FORUM_BETA_PASSWORD}")

step() { printf '\n== %s\n' "$*"; }
me() {
  curl -s "${BASIC[@]}" -b "$JAR" "$SITE/community" \
    | grep -oE '"session":\{"userId":[0-9]+' | grep -oE '[0-9]+$' || echo 0
}

step "1. Гость на форуме"
echo "userId=$(me)"

step "2. Вход на ProektMap (email/пароль)"
CSRF=$(curl -s -c "$JAR" -b "$JAR" "$SITE/api/auth/csrf" | sed -E 's/.*"csrfToken":"([^"]+)".*/\1/')
curl -s -o /dev/null -c "$JAR" -b "$JAR" -X POST "$SITE/api/auth/callback/credentials" \
  --data-urlencode "csrfToken=$CSRF" --data-urlencode "email=$TEST_USER" --data-urlencode "password=$TEST_PASSWORD" \
  --data-urlencode "json=true"
curl -s -b "$JAR" "$SITE/api/auth/session" | grep -q '"email"' && echo "ProektMap: сессия есть" || { echo "ProektMap: вход не удался"; exit 1; }

step "3. SSO в форум"
FINAL=$(curl -s -o /dev/null -w '%{url_effective} %{http_code}' -L "${BASIC[@]}" -c "$JAR" -b "$JAR" \
  "$SITE/community/auth/proektmap?returnTo=/community/t/voprosy")
echo "итоговый URL: $FINAL"
UID1=$(me)
echo "userId=$UID1"
[ "$UID1" != "0" ] || { echo "FAIL: не залогинен в форуме"; exit 1; }

step "4. Повторный вход не создаёт дубликат"
curl -s -o /dev/null -L "${BASIC[@]}" -c "$JAR" -b "$JAR" "$SITE/community/auth/proektmap"
UID2=$(me)
echo "userId=$UID2"
[ "$UID1" = "$UID2" ] || { echo "FAIL: другой пользователь после повторного входа"; exit 1; }

step "5. Выход на ProektMap гасит сессию форума"
CSRF=$(curl -s -c "$JAR" -b "$JAR" "$SITE/api/auth/csrf" | sed -E 's/.*"csrfToken":"([^"]+)".*/\1/')
curl -s -o /dev/null -c "$JAR" -b "$JAR" -X POST "$SITE/api/auth/signout" --data-urlencode "csrfToken=$CSRF" --data-urlencode "json=true"
curl -s -o /dev/null "${BASIC[@]}" -c "$JAR" -b "$JAR" "$SITE/community"
UID3=$(me)
echo "userId=$UID3"
[ "$UID3" = "0" ] || { echo "FAIL: форум не разлогинился"; exit 1; }

printf '\nOK: SSO вход, повторный вход и синхронный выход работают\n'
