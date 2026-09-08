# PM2 — Reverans

- Process name: `reverans`
- Bind: `127.0.0.1:3050` (Nginx terminates TLS and proxies)
- Start: `pm2 start ecosystem.config.cjs`
- Restart after build: `pm2 restart reverans --update-env`
- Production ecosystem on VPS loads `web/.env` and `secrets/tbank_secret` without expanding `$` in dotenv (see pattern notes in DEPLOYMENT.md).
