# COPY-FIRST — bootstrap project #2 from this DNA

Order for a new VPS studio / membership product of the same class:

1. Copy `ai/AGENTS.md` + `ai/START_HERE.md` → adapt product name/URLs only  
2. Copy `ai/.cursor/rules/` — keep harness, day-close, development, 00-start-here; rewrite product rule  
3. Copy harness pattern from `infrastructure/harness/` + `ai/harness/LOOP.md`  
4. Copy Dev Graph idea from `ai/.cursor/rules/dev-graph.mdc` — redefine D1–Dn DoD  
5. Copy deploy ritual from `docs/DEPLOYMENT.md` + `infrastructure/deploy/rsync-web.sh`  
6. Seed `.env` from `docs/.env.example` + fill names in `docs/SECRETS.md`  
7. Optional: start Prisma from `database/schema.prisma` as inspiration (do not copy customer data)  
8. Read ADRs in `ai/decisions/` before inventing Vercel or raw TBank dotenv secrets  

**Ready prompt (copy-paste):** see [`BOOTSTRAP-FROM-DNA.md`](./BOOTSTRAP-FROM-DNA.md)  
or the «Скопировать промпт» block on https://proektmap.ru/project-vault/reverans (after unlock).

Vocabulary: https://proektmap.ru/agent-engineering

## Do not copy

- Client marketing content as if it were the new brand  
- `.env` values, API keys, SSL private keys  
- Production customer DB rows / PII  
