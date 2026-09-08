# ADR 001 — VPS + Nginx + PM2, not Vercel/Supabase

## Context
Product TZ mentions Vercel/Supabase/R2 in places. This pilot runs on a single VPS.

## Decision
Host Next.js behind Nginx with PM2 (`reverans` on :3050). PostgreSQL local. Files on disk (`public/uploads`, `storage/`).

## Consequences
- Deploy = rsync (excluding uploads) → build → pm2 restart → harness
- Secrets only in `web/.env` + `secrets/` on VPS
- No serverless cold starts; ops owned on the box
