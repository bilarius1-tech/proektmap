# Service Harness — Reverans

Deterministic health checks for the client VPS. Used by agents and the recurring Loop.

## Quick start

```bash
# From control workspace (SSH to VPS)
./harness/check-service.sh

# Already on VPS as deploy
./harness/check-service.sh --local

# Compact / CI-friendly
./harness/check-service.sh --quiet
./harness/check-service.sh --json
```

Exit codes: `0` pass · `1` warnings · `2` failures.

Last report: `harness/reports/latest.txt` (gitignored).

## Config

```bash
cp harness/config.env.example harness/config.env
# edit thresholds, optional HTTP / PM2 app names
```

## What it checks today

| Area | Checks |
|------|--------|
| Access | SSH as `deploy` |
| Resources | disk %, MemAvailable |
| systemd | nginx, fail2ban, ssh, failed units |
| Toolchain | node, npm, pm2, pm2-deploy |
| Paths | `/var/www/reverans` writable |
| Ports | :22 :80 ( :443 warn until SSL ) |
| Optional | `HARNESS_PM2_APPS`, `HARNESS_HTTP_URL` |

## Loop

Cursor Loop wakes the agent on an interval, re-runs this harness, and reports only deltas / regressions.

Stop: ask the agent to stop the Reverans service loop.

## After the app exists

1. Set `HARNESS_PM2_APPS="your-pm2-name"` in `config.env`
2. Set `HARNESS_HTTP_URL` to a real health endpoint
3. Re-run harness once; keep the Loop
