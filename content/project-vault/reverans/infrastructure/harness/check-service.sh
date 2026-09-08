#!/usr/bin/env bash
# Reverans service harness — infrastructure + (optional) app health.
# Exit: 0 = all pass, 1 = warnings only, 2 = failures
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${ROOT}/lib/common.sh"

MODE="remote"
JSON=0
QUIET=0

usage() {
  cat <<'USAGE'
Usage: check-service.sh [--local] [--json] [--quiet]

  --local   Run checks on this host (use when already on the VPS)
  --json    Print machine-readable summary line at end
  --quiet   Only print FAIL/WARN lines + summary

Exit codes: 0 pass · 1 warn · 2 fail
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --local) MODE="local"; shift ;;
    --json) JSON=1; shift ;;
    --quiet) QUIET=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 2 ;;
  esac
done

HARNESS_MODE="$MODE"

if [[ -f "${ROOT}/config.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/config.env"
  set +a
elif [[ -f "${ROOT}/config.env.example" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/config.env.example"
  set +a
fi

HARNESS_HOST="${HARNESS_HOST:-159.194.228.226}"
HARNESS_USER="${HARNESS_USER:-deploy}"
HARNESS_SSH_KEY="${HARNESS_SSH_KEY/#\~/$HOME}"
HARNESS_SSH_KEY="${HARNESS_SSH_KEY:-$HOME/.ssh/reverans_deploy_ed25519}"
HARNESS_SSH_PORT="${HARNESS_SSH_PORT:-22}"
HARNESS_DISK_WARN_PCT="${HARNESS_DISK_WARN_PCT:-80}"
HARNESS_DISK_FAIL_PCT="${HARNESS_DISK_FAIL_PCT:-92}"
HARNESS_MEM_WARN_MIB="${HARNESS_MEM_WARN_MIB:-200}"

REPORT_DIR="${ROOT}/reports"
mkdir -p "${REPORT_DIR}"
REPORT_FILE="${REPORT_DIR}/latest.txt"
START_TS="$(harness_ts)"
TMP_OUT="$(mktemp)"
trap 'rm -f "$TMP_OUT"' EXIT

emit() {
  # Always capture full log; optionally filter to stdout
  local line="$1"
  printf '%s\n' "$line" >>"$TMP_OUT"
  if (( QUIET == 1 )); then
    if [[ "$line" =~ (FAIL|WARN|SUMMARY|Harness start|Harness done|^\{\"pass) ]]; then
      printf '%s\n' "$line"
    fi
  else
    printf '%s\n' "$line"
  fi
}

# Redefine log helpers to use emit
pass() { HARNESS_PASS=$((HARNESS_PASS + 1)); emit "$(printf '[%s] %-5s %s' "$(harness_ts)" PASS "$*")"; }
warn() { HARNESS_WARN=$((HARNESS_WARN + 1)); emit "$(printf '[%s] %-5s %s' "$(harness_ts)" WARN "$*")"; }
fail() { HARNESS_FAIL=$((HARNESS_FAIL + 1)); emit "$(printf '[%s] %-5s %s' "$(harness_ts)" FAIL "$*")"; }
info() { emit "$(printf '[%s] %-5s %s' "$(harness_ts)" INFO "$*")"; }

info "Harness start mode=${MODE} host=${HARNESS_HOST} user=${HARNESS_USER}"

if OUT="$(remote 'whoami; hostname' 2>/tmp/harness_ssh_err.$$)"; then
  WHO="$(printf '%s\n' "$OUT" | sed -n '1p')"
  HN="$(printf '%s\n' "$OUT" | sed -n '2p')"
  if [[ "$WHO" == "deploy" ]]; then
    pass "ssh identity deploy@${HN}"
  else
    fail "ssh identity expected deploy, got ${WHO}"
  fi
else
  ERR="$(tr '\n' ' ' </tmp/harness_ssh_err.$$ 2>/dev/null || true)"
  rm -f /tmp/harness_ssh_err.$$
  fail "ssh unreachable (${ERR})"
  info "Aborting further remote checks"
  CODE=2
  emit "SUMMARY pass=${HARNESS_PASS} warn=${HARNESS_WARN} fail=${HARNESS_FAIL} exit=${CODE}"
  cp "$TMP_OUT" "$REPORT_FILE"
  exit "$CODE"
fi
rm -f /tmp/harness_ssh_err.$$

DISK_LINE="$(remote "df -P / | awk 'NR==2 {print \$5\" \"\$4}'" || true)"
DISK_PCT="${DISK_LINE%%\%*}"
DISK_AVAIL="$(printf '%s\n' "$DISK_LINE" | awk '{print $2}')"
if [[ "$DISK_PCT" =~ ^[0-9]+$ ]]; then
  if (( DISK_PCT >= HARNESS_DISK_FAIL_PCT )); then
    fail "disk / used ${DISK_PCT}% (avail ${DISK_AVAIL}, fail>=${HARNESS_DISK_FAIL_PCT}%)"
  elif (( DISK_PCT >= HARNESS_DISK_WARN_PCT )); then
    warn "disk / used ${DISK_PCT}% (avail ${DISK_AVAIL}, warn>=${HARNESS_DISK_WARN_PCT}%)"
  else
    pass "disk / used ${DISK_PCT}% avail ${DISK_AVAIL}"
  fi
else
  fail "disk parse failed: ${DISK_LINE}"
fi

MEM_AVAIL="$(remote "awk '/MemAvailable:/ {print int(\$2/1024)}' /proc/meminfo" || true)"
if [[ "$MEM_AVAIL" =~ ^[0-9]+$ ]]; then
  if (( MEM_AVAIL < HARNESS_MEM_WARN_MIB )); then
    warn "mem available ${MEM_AVAIL} MiB (< ${HARNESS_MEM_WARN_MIB})"
  else
    pass "mem available ${MEM_AVAIL} MiB"
  fi
else
  warn "mem parse failed: ${MEM_AVAIL}"
fi

for svc in nginx fail2ban ssh; do
  ST="$(remote "systemctl is-active ${svc} 2>/dev/null || true" || true)"
  if [[ "$ST" == "active" ]]; then
    pass "systemd ${svc}=active"
  else
    fail "systemd ${svc}=${ST:-unknown}"
  fi
done

MYSQL_ST="$(remote "systemctl is-active mysql 2>/dev/null || systemctl is-active mysqld 2>/dev/null || true" || true)"
if [[ "$MYSQL_ST" == "active" ]]; then
  pass "systemd mysql=active"
else
  warn "systemd mysql=${MYSQL_ST:-absent} (ok until project requires DB)"
fi

FAILED="$(remote "systemctl --failed --no-legend --no-pager 2>/dev/null | wc -l" || echo 999)"
FAILED="$(echo "$FAILED" | tr -d '[:space:]')"
if [[ "$FAILED" =~ ^[0-9]+$ ]] && (( FAILED == 0 )); then
  pass "no failed systemd units"
elif [[ "$FAILED" =~ ^[0-9]+$ ]]; then
  LIST="$(remote "systemctl --failed --no-legend --no-pager 2>/dev/null | awk '{print \$1}' | tr '\n' ' '" || true)"
  fail "failed systemd units (${FAILED}): ${LIST}"
else
  warn "could not list failed units"
fi

NODE_V="$(remote "node -v 2>/dev/null || true" || true)"
NPM_V="$(remote "npm -v 2>/dev/null || true" || true)"
PM2_V="$(remote "pm2 -v 2>/dev/null || true" || true)"
[[ "$NODE_V" == v* ]] && pass "node ${NODE_V}" || fail "node missing"
[[ -n "$NPM_V" ]] && pass "npm ${NPM_V}" || fail "npm missing"
[[ -n "$PM2_V" ]] && pass "pm2 ${PM2_V}" || fail "pm2 missing"

PM2_EN="$(remote "systemctl is-enabled pm2-deploy 2>/dev/null || true" || true)"
[[ "$PM2_EN" == "enabled" ]] && pass "pm2-deploy enabled" || warn "pm2-deploy=${PM2_EN:-unknown}"

if remote "test -d /var/www/reverans && test -w /var/www/reverans"; then
  OWN="$(remote "stat -c '%U:%G' /var/www/reverans" || true)"
  pass "project root /var/www/reverans (${OWN})"
else
  fail "project root /var/www/reverans missing or not writable"
fi

PORTS="$(remote "ss -lnt | awk 'NR>1 {print \$4}' | sed 's/.*://' | sort -n | uniq | tr '\n' ' '" || true)"
for p in 22 80; do
  if echo " ${PORTS} " | grep -q " ${p} "; then
    pass "listen :${p}"
  else
    fail "not listening :${p}"
  fi
done

if [[ -n "${HARNESS_PM2_APPS:-}" ]]; then
  for app in ${HARNESS_PM2_APPS}; do
    ST="$(remote "pm2 jlist 2>/dev/null | python3 -c \"import sys,json; d=json.load(sys.stdin); print(next((p['pm2_env']['status'] for p in d if p.get('name')=='${app}'),'missing'))\" 2>/dev/null || echo missing" || echo missing)"
    [[ "$ST" == "online" ]] && pass "pm2 app ${app}=online" || fail "pm2 app ${app}=${ST}"
  done
else
  info "pm2 apps: not configured (set HARNESS_PM2_APPS when app exists)"
fi

# HTTPS listen on VPS IP (ISPmanager binds to public IP, not 0.0.0.0)
if remote "ss -lnt | awk '{print \$4}' | grep -qE '(:|\\.)443$'"; then
  pass "listen :443"
else
  warn "not listening :443 (expected until SSL/domain)"
fi

if [[ -n "${HARNESS_HTTP_URL:-}" ]]; then
  EXPECT="${HARNESS_HTTP_EXPECT:-200}"
  CURL_OPTS=( -sS -o /dev/null -w '%{http_code}' --connect-timeout 8 --max-time 15 )
  # Optional: force check against VPS IP while public DNS still points elsewhere
  if [[ -n "${HARNESS_HTTP_RESOLVE:-}" ]]; then
    # format host:port:ip  e.g. reverans.online:443:159.194.228.226
    CURL_OPTS+=( --resolve "${HARNESS_HTTP_RESOLVE}" )
  fi
  # Self-signed / staging certs on VPS until LE is reissued after DNS cutover
  if [[ "${HARNESS_HTTP_INSECURE:-0}" == "1" ]]; then
    CURL_OPTS+=( -k )
  fi
  CODE_HTTP="$(curl "${CURL_OPTS[@]}" "${HARNESS_HTTP_URL}" || echo 000)"
  [[ "$CODE_HTTP" == "$EXPECT" ]] && pass "http ${HARNESS_HTTP_URL} → ${CODE_HTTP}" || fail "http ${HARNESS_HTTP_URL} → ${CODE_HTTP} (expect ${EXPECT})"
else
  info "http check: skipped (set HARNESS_HTTP_URL when domain is live)"
fi

# TZ pack must stay published for agents & stakeholders
TZ_URL="${HARNESS_TZ_URL:-https://reverans.online/tz/outputs/TZ_reverance.md}"
TZ_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 8 --max-time 15 "${TZ_URL}" || echo 000)"
[[ "$TZ_CODE" == "200" ]] && pass "tz pack ${TZ_URL} → ${TZ_CODE}" || fail "tz pack ${TZ_URL} → ${TZ_CODE}"

# Optional product probes (enable as features ship)
if [[ -n "${HARNESS_PROBE_PATHS:-}" ]]; then
  for path in ${HARNESS_PROBE_PATHS}; do
    PCODE="$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 8 --max-time 15 "https://reverans.online${path}" || echo 000)"
    if [[ "$PCODE" =~ ^2 ]]; then
      pass "probe ${path} → ${PCODE}"
    elif [[ "$PCODE" =~ ^3 ]]; then
      pass "probe ${path} → ${PCODE} (redirect)"
    else
      warn "probe ${path} → ${PCODE}"
    fi
  done
fi

END_TS="$(harness_ts)"
CODE=0
exit_code_from_counts || CODE=$?

info "Harness done start=${START_TS} end=${END_TS}"
emit "SUMMARY pass=${HARNESS_PASS} warn=${HARNESS_WARN} fail=${HARNESS_FAIL} exit=${CODE}"

if (( JSON == 1 )); then
  emit "$(printf '{"pass":%s,"warn":%s,"fail":%s,"exit":%s,"ts":"%s"}' \
    "$HARNESS_PASS" "$HARNESS_WARN" "$HARNESS_FAIL" "$CODE" "$END_TS")"
fi

cp "$TMP_OUT" "$REPORT_FILE"
exit "$CODE"
