# ADR 002 — TBank secret via file, not raw dotenv `$`

## Context
TBank Token uses HMAC over secret; Next/dotenv can mangle `$` inside `.env` values.

## Decision
Store terminal password in `/var/www/reverans/secrets/tbank_secret` and set `TBANK_SECRET_FILE`. PM2 ecosystem injects without shell `$` expansion.

## Consequences
- Never commit the secret file
- App prefers `TBANK_SECRET_FILE` over `TBANK_SECRET_KEY`
