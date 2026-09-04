---
name: arsenal-resheniya-bridge
description: >-
  Связывает готовые AI-решения /resheniya с Нейро каталогом /arsenal: подбирает
  1–3 стека и 2–4 инструмента под миссию решения, без свалки всего каталога.
  Use when creating/expanding a /resheniya solution, adding arsenal cross-links,
  editing RESHENIYA_ARSENAL_BRIDGES, or when the user asks связку с арсеналом /
  Нейро каталогом.
trust: community
---

# Arsenal ↔ Resheniya Bridge

## Роль

Ты дополняешь маршрут `/resheniya` мостом в **Нейро каталог** (`/arsenal`): конкретные стеки и 2–4 инструмента под миссию. Не превращай обзор решения в полный каталог.

Display name: **Нейро каталог**. URL: `/arsenal`.

## Когда применять

- Создание или расширение решения в `src/app/resheniya/**`
- После `resheniya-author`, до/параллельно с validator
- Явный запрос: «связка с арсеналом», «инструменты из Нейро каталога»

## Обязательное чтение

1. `docs/ARSENAL-V1-STACKS.md` — 12 стеков и миссии
2. `src/lib/arsenal/stacks.ts` — актуальные `relatedRoutes` и `tools[]`
3. `src/lib/arsenal/resheniya-bridges.ts` — канон мостов
4. Компоненты: `NeuroCatalogCallout`, `ArsenalBridgePanel`

## Формула моста

```text
Миссия решения
  → 1–3 стека /arsenal/<stack>
    → 2–4 инструмента /arsenal/tools/<slug>
      → одна фраза why
```

| Решение | Типичные стеки |
|---------|----------------|
| `saas-product` | `vibe-coder`, `prompt-ops`, `mcp-agents` |
| `telegram-bot` | `mcp-agents`, `desktop-agent`, `rf-stack` |
| `avito-business` | `listing-photo`, `seller-content`, `short-video` |

Новое решение: найди стек по миссии в `ARSENAL-V1-STACKS.md`, возьми 2–4 тула из `stack.tools` (не весь список).

## Workflow

```text
Bridge Progress:
- [ ] 1. Миссия решения → кандидаты стеков
- [ ] 2. Запись в RESHENIYA_ARSENAL_BRIDGES
- [ ] 3. ArsenalBridgePanel на обзоре /resheniya/<slug>
- [ ] 4. relatedRoutes стека → точный href решения (не только /resheniya)
- [ ] 5. Без пустых «смотрите арсенал» без slug
```

### 1. Данные моста

В `src/lib/arsenal/resheniya-bridges.ts` добавь/обнови:

```ts
{
  solutionSlug: "your-slug",
  stackSlugs: ["vibe-coder"],      // 1–3
  toolSlugs: ["opencode", "…"],    // 2–4, существуют в tools.ts
  why: "Одна фраза: зачем этот набор рядом с маршрутом.",
}
```

Проверь: `getArsenalStack` / `getArsenalToolsBySlugs` не возвращают пустоту.

### 2. UI

На обзоре решения:

```tsx
import ArsenalBridgePanel from "@/components/arsenal/arsenal-bridge-panel";
// …
<ArsenalBridgePanel solutionSlug="your-slug" />
```

На каталоге `/resheniya` — общий `NeuroCatalogCallout` (уже есть). Не дублируй целый каталог на каждом шаге workspace.

### 3. Обратная связь из арсенала

В `stacks.ts` у релевантных стеков в `relatedRoutes` укажи **конкретный** маршрут:

- хорошо: `/resheniya/avito-business`
- слабо: только `/resheniya` без контекста (допустимо для общих стеков)

## Жёсткие запреты

- Пустая ссылка «см. Нейро каталог» **без** `/arsenal/<stack>` или `/arsenal/tools/<slug>`
- Свалка >4 тулов на обзоре «на всякий случай»
- Jailbreak / серый OSINT / пиратские каталоги (план §7.5)
- Путать `/arsenal` с `/ai-tools` или `/solutions`
- Менять меню в `header.tsx` — только БД / sync-скрипт

## Чеклист перед сдачей

- [ ] Мост в `RESHENIYA_ARSENAL_BRIDGES`
- [ ] `ArsenalBridgePanel` на page обзора
- [ ] Стеки/тулы существуют
- [ ] `why` понятен без автора
- [ ] При необходимости — `relatedRoutes` стека обновлены

## Trust

`trust: community` до аудита. Не ставь `verified` себе.
