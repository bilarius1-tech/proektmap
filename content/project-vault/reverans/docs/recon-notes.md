# PASS 1 — Recon notes (Reverans)

**Status:** PASS  
**Date:** 2026-09-08  
**Agent:** Project Vault archaeology

## Access

| Check | Result |
|-------|--------|
| https://reverans.online/ | HTTP 200 |
| https://reverans.online/api/health | 200 · `ok:true`, yandex+tbank integrations true |
| Workspace | `/root/projects/reverans` present |
| Production | SSH `reverans` → `/var/www/reverans/web` · PM2 `reverans` online |
| Local prod mirror on nordic | absent (expected) |

## Product roles

`parent` · `admin` · `coach`

## Stack (confirmed)

Next.js App Router + TypeScript + Tailwind · Prisma + PostgreSQL (`reverans_db`) · NextAuth (Yandex + email) · TBank acquiring · Nginx + PM2 on VPS (not Vercel)

## Deploy pattern

`./deploy/rsync-web.sh` (exclude uploads/storage) → `npm run build` → `pm2 restart reverans --update-env` → `./harness/check-service.sh --quiet`

## AI engineering artifacts found

| Artifact | Path |
|----------|------|
| START_HERE / AGENTS | `/root/projects/reverans/START_HERE.md`, `AGENTS.md` |
| Philosophy / Development / DEVLOG / Handoff | `docs/*` |
| Cursor rules | `.cursor/rules/*.mdc` (6 rules) |
| Harness | `harness/check-service.sh`, `config.env.example` |
| Loop | `harness/LOOP.md` (15m infra loop) |
| Dev Graph | `.cursor/rules/dev-graph.mdc` (D1–D10) |
| Product TZ | `tz/outputs/` |
| Skills | none project-local (prompts in `docs/CLIENT_*`) |

## Secrets locations (names only — values NOT read into package)

- Workspace / prod: `web/.env`
- VPS: `secrets/tbank_secret`, `secrets/admin.env`
- Harness local overrides: `harness/config.env` (gitignored)

## Client Boundary risks

- Admin email / owner name in handoff → redact in package  
- Customer rows in DB → schema-only dump only  
- Gallery/uploads may contain faces → excluded from source archive  
- SSL private key path in nginx → redacted  

## DNA harvest candidates

Listed in INSTANCE brief + §8 of PROJECT-VAULT-TZ.md — all present except formal Cursor skills directory.
