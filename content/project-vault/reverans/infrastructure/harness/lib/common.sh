#!/usr/bin/env bash
# Shared helpers for Reverans harness.
# shellcheck shell=bash

harness_ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

harness_log() {
  local level="$1"; shift
  printf '[%s] %-5s %s\n' "$(harness_ts)" "$level" "$*"
}

# Counters (sourced scripts mutate these)
HARNESS_PASS=0
HARNESS_WARN=0
HARNESS_FAIL=0

pass() { HARNESS_PASS=$((HARNESS_PASS + 1)); harness_log PASS "$*"; }
warn() { HARNESS_WARN=$((HARNESS_WARN + 1)); harness_log WARN "$*"; }
fail() { HARNESS_FAIL=$((HARNESS_FAIL + 1)); harness_log FAIL "$*"; }

# Run remote command as deploy (or local if --local)
remote() {
  if [[ "${HARNESS_MODE:-remote}" == "local" ]]; then
    bash -lc "$*"
  else
    ssh -i "${HARNESS_SSH_KEY}" \
      -p "${HARNESS_SSH_PORT}" \
      -o StrictHostKeyChecking=accept-new \
      -o IdentitiesOnly=yes \
      -o ConnectTimeout=12 \
      -o BatchMode=yes \
      "${HARNESS_USER}@${HARNESS_HOST}" \
      "bash -lc $(printf '%q' "$*")"
  fi
}

exit_code_from_counts() {
  if (( HARNESS_FAIL > 0 )); then
    return 2
  fi
  if (( HARNESS_WARN > 0 )); then
    return 1
  fi
  return 0
}
