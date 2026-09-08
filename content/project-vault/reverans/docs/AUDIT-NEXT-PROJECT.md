# AUDIT — next project from DNA alone (PASS 7)

**Date:** 2026-09-08  
**Capsule:** `reverans@1.0.0`  
**Auditor stance:** agent with only this package + ProektMap Vault page, no source VPS write access.

## Checklist answers

### How to raise harness on day 0?
1. Copy `ai/AGENTS.md`, `ai/START_HERE.md`, `ai/.cursor/rules/`  
2. Copy `infrastructure/harness/check-service.sh` + `config.env.example` → `harness/`  
3. Adapt HTTP probes to new domain `/api/health`  
4. Follow `ai/harness/LOOP.md` (15m tick pattern)  
5. Read `ai/COPY-FIRST.md`

**Verdict:** YES — path is explicit.

### Which rules/skills first?
Rules: `00-start-here`, `harness`, `day-close`, `development`, then rewrite product rule.  
Skills: none shipped as Cursor skills — prompts in `ai/prompts/` substitute.  
**Gap (non-critical):** no formal `SKILL.md` files; Phase 2 could add.

### How are Loop and Graph arranged?
- Loop: infra every 15m via harness; Dev Loop after Graph day DoD  
- Graph: D1–D10 in `ai/.cursor/rules/dev-graph.mdc` with DoD table  
Linked to https://proektmap.ru/agent-engineering/{harness,loop,graph}

**Verdict:** YES.

### Deploy pattern on VPS?
`rsync-web.sh` (exclude uploads) → `npm run build` → `pm2 restart` → harness.  
Documented in `docs/DEPLOYMENT.md` + `infrastructure/pm2|nginx`.

**Verdict:** YES.

### Which secrets to create (names)?
See `docs/SECRETS.md` + `docs/.env.example`.  
Critical: `DATABASE_URL`, `NEXTAUTH_*`, `YANDEX_*`, `TBANK_*` / `TBANK_SECRET_FILE`.

**Verdict:** YES — names only, no values leaked.

### What is missing for project #2 of the same class?
| Gap | Severity | Mitigation |
|-----|----------|------------|
| No Cursor `skills/` directory | low | Use `ai/prompts/` + COPY-FIRST |
| Prisma migrations folder empty (db push era) | low | Use `schema.prisma` + schema SQL |
| «Create from this» UI not built | expected (Phase 2) | Manual copy from package |
| Canvas Dev Graph file not packaged | low | Rule `dev-graph.mdc` enough |
| Screenshots optional absent | low | Live URL in manifest |

**Critical gaps:** none blocking day-0 harness bootstrap.

## DoD PASS 7

PASS — DNA alone can bootstrap a similar Cursor+VPS studio project; gaps documented for Phase 2.
