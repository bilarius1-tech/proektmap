# PROJECT-MAP — Реверанс

Карта для агента проекта #2 (куда класть аналоги).

```
project-root/
├── START_HERE.md          # вход нового агента
├── AGENTS.md              # закон + карта + запреты
├── .cursor/rules/         # always-on дисциплина
├── docs/
│   ├── DEVLOG.md          # «Сейчас» = приоритет дня
│   ├── DAILY_JOURNAL.md
│   ├── DEVELOPMENT.md
│   ├── PHILOSOPHY.md
│   └── AGENT_HANDOFF.md
├── harness/
│   ├── check-service.sh
│   ├── config.env.example
│   └── LOOP.md
├── deploy/
│   ├── rsync-web.sh
│   └── backup-*.sh
├── tz/outputs/            # продуктовое ТЗ / wireframes / landing HTML
├── ecosystem.config.cjs
├── secrets/               # VPS only — never in git/Vault values
└── web/                   # Next.js app
    ├── prisma/schema.prisma
    ├── .env               # VPS only
    └── src/app/
        ├── (marketing)/
        ├── admin/
        ├── cabinet/
        ├── login|register/
        └── api/
```

## Связь с ProektMap vocabulary

| Reverans | Agent-engineering track |
|----------|-------------------------|
| `AGENTS.md` + `.cursor/rules` | Harness |
| 15m `check-service.sh` + day DoD | Loop |
| Dev Graph D1–D10 | Graph |
