# Инженерия агентов — трек ProektMap

> **Статус:** MVP (хаб + 3 модуля) + voice guides  
> **URL:** `/agent-engineering`  
> **Позиционирование:** отдельно от `/resheniya` (продукт) — здесь окружение агента

## Идея

Промпт — тонкий вход. Ремесло — **окружение**: закон проекта, цикл с проверкой, карта связей.

Лестница:

1. **Harness** — каркас (rules, skills, hooks, права, папка)
2. **Loop** — повтор до DoD (бюджет, критик, стоп)
3. **Graph** — граф зависимостей + update; self-rewrite только с разрешения

## Файлы

| Путь | Назначение |
|------|------------|
| `src/lib/agent-engineering/` | Данные модулей (DRY для хаба и страниц) |
| `src/app/agent-engineering/page.tsx` | Хаб трека |
| `src/app/agent-engineering/[slug]/page.tsx` | harness / loop / graph |
| `src/components/agent-engineering/agent-engineering-callout.tsx` | Callout на `/resheniya` |
| `src/lib/voice-guide/guide-data.ts` | Voice: хаб + 3 модуля |
| `docs/AGENT-ENGINEERING.md` | Этот канон |

## SEO и меню

- `SITE_TREE` → группа «Начать» → «Инженерия агентов» + дети
- Меню: `header-agent-engineering` через `scripts/sync-header-menu.ts`
- Voice MP3: `/agent-engineering`, `/harness`, `/loop`, `/graph`

## Связи

- → `/arsenal` (vibe-coder, mcp-agents, desktop-agent, prompt-ops)
- → `/resheniya` после готовности окружения
- ← лёгкий callout на каталоге `/resheniya`

## Углубление (запланировано)

Статус: **запланировано** — после MVP-уроков, без срыва текущего хаба.

| Что углубить | Зачем | Набросок |
|---|---|---|
| Практика 10–15 мин на модуль | Закрепить DoD руками, не только чтением | Мини-лабы: чеклист harness → loop с curl → graphify query |
| Шаблоны артефактов | Скачать и заполнить | Markdown: AGENTS-черновик, сценарий loop, отчёт graph |
| Downloadable harness checklist | Быстрый аудит чужого/своего проекта | PDF/MD: права, skills, hooks, запреты |
| Advanced self-rewrite lab | Безопасная практика патча skills | Песочница + diff на «да» человека, без расширения .env |
| Больше упражнений / уровни | Новичок → средний вайбкодер → прод-контур | 2–3 задания сверх текущих промптов в модулях |
| Опц. skill `agent-engineering-author` | Расширять модули по контракту | Как resheniya-author, но для трека окружения |

Не смешивать с `/resheniya`: углубление — про **машину работы агента**, не про продукт-маршруты.
