# AGENTS.md — Reverans (СКХГ «Реверанс»)

**Новый чат / новый агент:** сначала [START_HERE.md](./START_HERE.md) и [docs/AGENT_HANDOFF.md](./docs/AGENT_HANDOFF.md).

Читать **до** изменений кода:

1. [docs/DEVLOG.md](./docs/DEVLOG.md) — текущий приоритет и закрытие дня  
2. [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) — цикл разработки / deploy / git  
3. [docs/PHILOSOPHY.md](./docs/PHILOSOPHY.md) — границы продукта  
4. ТЗ: `tz/outputs/` · https://reverans.online/tz/outputs/

## Источники продукта

| Документ | Путь |
|----------|------|
| ТЗ | `tz/outputs/TZ_reverance.md` |
| PRD | `tz/outputs/prd_reverance.md` |
| UI kit | `tz/outputs/ui_kit_reverance.md` |
| Wireframes | `tz/outputs/wireframes_reverance.md` |
| Landing HTML | `tz/outputs/landing/` |

## Инфра (этот VPS)

| | |
|--|--|
| SSH | `deploy@159.194.228.226` |
| App | `/var/www/reverans/web` · PM2 `reverans` · `:3050` |
| Nginx | `reverans.online` → proxy + `/tz/` static |
| DB | PostgreSQL `reverans_db` @ localhost |
| Harness | `./harness/check-service.sh` |
| Loop | каждые 15м |

## Роли

`parent` | `admin` | `coach`

## Секреты (только `.env`)

`DATABASE_URL` · `NEXTAUTH_SECRET` · `NEXTAUTH_URL` · `ADMIN_*` · позже `YANDEX_*` / `TBANK_*`

## Harness / Loop / Graph

- Harness / Loop — health  
- Graph — `.cursor/rules/dev-graph.mdc` + canvas  
- Day close — `.cursor/rules/day-close.mdc`

## Текущий приоритет

См. **docs/DEVLOG.md → Сейчас**.  
Ждём ключи Яндекс/ТБанк: [docs/CLIENT_KEYS_YANDEX_TBANK.md](./docs/CLIENT_KEYS_YANDEX_TBANK.md).  
Handoff: [docs/AGENT_HANDOFF.md](./docs/AGENT_HANDOFF.md).
