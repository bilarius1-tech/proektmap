# SECRETS.md — names only (Reverans)

Never put real values in git, Vault package, or chat logs.

| Name | Purpose | Where set (prod) |
|------|---------|------------------|
| `DATABASE_URL` | PostgreSQL connection | `web/.env` |
| `NEXTAUTH_SECRET` | Session signing | `web/.env` |
| `NEXTAUTH_URL` | Canonical auth URL | `web/.env` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `web/.env` |
| `YANDEX_CLIENT_ID` | Yandex OAuth | `web/.env` |
| `YANDEX_CLIENT_SECRET` | Yandex OAuth | `web/.env` |
| `YANDEX_REDIRECT_URI` | OAuth callback | `web/.env` |
| `TBANK_TERMINAL_KEY` | Acquiring terminal | `web/.env` / PM2 env |
| `TBANK_SECRET_KEY` | Acquiring password (prefer file) | avoid raw if contains `$` |
| `TBANK_SECRET_FILE` | Path to secret file | e.g. `/var/www/reverans/secrets/tbank_secret` |
| `TBANK_API_URL` | API base | usually `https://securepay.tinkoff.ru/v2` |
| `TBANK_TAXATION` / `TBANK_VAT` | Optional fiscal receipt | `web/.env` |
| `NODE_EXTRA_CA_CERTS` | Russian Trusted CA bundle path | PM2 env |
| `ADMIN_*` / `secrets/admin.env` | Bootstrap admin password | VPS `secrets/` only |
| `HARNESS_*` | SSH/disk thresholds for harness | `harness/config.env` (not committed) |

See also `docs/.env.example`.
