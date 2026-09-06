# AI Engineering Skills — канон v0.1

> **Решение:** 06.09.2026  
> **Публичный путь:** `/ai-skills`  
> **Статус:** MVP реализован · Design-кластер · фазы A/B со связкой дизайн-системы  
> **Связано:** `docs/PHILOSOPHY.md`, `docs/DESIGN-SKILLS.md`, `docs/SKILLS.md`, `/skills`, `/arsenal`, `/resheniya`  
> **Паттерн примеров:** эталон для правила `.cursor/rules/examples-teaching.mdc` (плохо→хорошо, before→after, Copy)

---

## Обещание

Скилы, которые превращают AI из генератора кода в специализированного инженера.

ProektMap здесь не собирает awesome-list. Он даёт **готовый маршрут усиления агента**: какой Skill зачем, в каком порядке, какой результат ожидать.

```text
Задача
  → Skill Stack / Recipe
    → порядок применения
      → install + invoke
        → наблюдаемый результат
          → следующий Skill
```

---

## Граница слоёв (обязательно)

Слово «Skill» в экосистеме занято. Публичные названия и роли:

| Слой | URL / место | Для кого | Что это | Не путать с |
|------|-------------|----------|---------|-------------|
| **Карта способностей** | `/skills` | человек | компетенции создателя (Capability Map) | агентными пакетами |
| **AI Engineering Skills** | `/ai-skills` | человек + агент | внешние Skill-пакеты (Anthropic, community), разобранные как инженерные объекты | обучением и композициями |
| **Design Skills** | `/design-skills` | агент | визуальные рецепты композиции ProektMap (`pm-hero-…`) | GitHub/Anthropic skills |
| **Prisma / admin Skill** | `/admin/skills` | человек | учебный модуль с XP | `/ai-skills` |
| **Внутренние agent skills** | `.cursor/skills/`, `.reasonix/skills/` | агенты сайта | процедуры сборки ProektMap | публичной библиотекой |

### Правило нейминга в UI

- `/skills` в меню и заголовках: **«Карта способностей»** (не «AI Skills»).
- `/ai-skills`: **«AI Engineering Skills»** / коротко **«AI Skills»**.
- Внутренний тип данных MVP: `AiSkill` (не `Skill`, не `CapabilitySkill`, не `DesignSkill`).

### Кросс-ссылки (заложить сразу)

- С `/skills` (домен UI) → блок «Прокачать агента» → `/ai-skills`.
- С `/ai-skills` ↔ `/sandbox/design-system` (язык продукта ↔ усилители агента).
- С карточки AiSkill → `/sandbox/design-system`, `/ui-patterns`, релевантный `/resheniya`.
- Хаб `/ai-skills`: блок **Контур AI-дизайна** + копируемый **DESIGN.md**.

### Фазы A/B (06.09.2026)

- **B:** контур AI-дизайна + шаблон DESIGN.md на хабе.
- **A:** двусторонние мосты с `/sandbox/design-system` + строка про токены/DESIGN.md во всех invoke и Recipe.

---

## Сущности MVP

### 1. AiSkill (атом)

| Поле | Назначение |
|------|------------|
| `slug` | канонический id (`frontend-design`, `impeccable`, …) |
| `title` | название |
| `author` | автор / источник (Anthropic, community, …) |
| `repository` | URL репозитория / канона |
| `category` | для MVP только `design` |
| `typeLabels` | напр. `Frontend`, `Design` |
| `summary` | короткое «что умеет» |
| `does` | развёрнуто: что делает |
| `whenToUse` | список ситуаций |
| `install` | команды / шаги установки (copy) |
| `invoke` | как вызвать / prompt / instruction (copy) |
| `example` | before → after или сценарий |
| `result` | наблюдаемый результат |
| `limits` | ограничения |
| `agents` | совместимость: Claude Code, Cursor, Agents |
| `tags` | поиск |
| `relatedSlugs` | рёбра графа |
| `trust` | `verified` \| `community` \| `flagged` |

Рейтинг ★ в MVP **не показываем** (нет данных). Поле можно зарезервировать позже.

### 2. SkillRecipe (маршрут под задачу)

| Поле | Назначение |
|------|------------|
| `slug` | id рецепта |
| `title` | задача человеческим языком |
| `goal` | итоговый результат |
| `steps` | упорядоченный список `{ skillSlug, role, note }` |
| `stackSlug?` | опциональная ссылка на Stack |

### 3. SkillStack (именованный комплект)

| Поле | Назначение |
|------|------------|
| `slug` | id стека |
| `title` | бренд комплекта |
| `summary` | зачем этот набор |
| `skillSlugs` | состав (без жёсткого порядка; порядок — в Recipe) |
| `recipeSlug?` | основной рецепт применения |

**Разница:** Stack = «какой комплект взять». Recipe = «в каком порядке применять».

### 4. Skill Graph

Не отдельная таблица в MVP: строится из `relatedSlugs` + явной схемы Design-кластера (ниже).  
UI: одна визуальная схема на хабе `/ai-skills` и/или на Recipe.

---

## MVP-скоуп (жёстко)

Только **Design-кластер**. Фильтры Code / Research / SEO / DevOps / Marketing — **не делаем** (иначе пустые кнопки).

### 4 Skills

1. **Frontend Design** (`frontend-design`) — Anthropic  
   Проектирование и реализация UI с акцентом на визуальное качество.
2. **taste-skill** (`taste-skill`) — community / канон вкуса  
   Визуальный вкус: композиция, типографика, качество решений.
3. **Web Design Guidelines** (`web-design-guidelines`) — best practices check  
   Проверка интерфейса по web/design guidelines.
4. **Impeccable** (`impeccable`) — polish-слой  
   Команды и правила доводки визуального качества до «impeccable».

### Skill Graph (канон цепочки)

```text
        WEB DESIGN
            │
     ┌──────┴──────┐
     ↓             ↓
taste-skill   web-design-guidelines
     │             │
     └──────┬──────┘
            ↓
     Frontend Design
            ↓
      IMPLEMENTATION
            ↓
        Impeccable
            ↓
         POLISH
```

Смысл ролей в цепочке:

| Этап | Skill | Роль |
|------|-------|------|
| Вкус | taste-skill | задать визуальные критерии |
| Нормы | web-design-guidelines | проверить best practices |
| Сборка | Frontend Design | спроектировать и реализовать |
| Доводка | Impeccable | polish до продакшен-качества |

### 1 Recipe

**slug:** `quality-saas-ui`  
**title:** Создать качественный SaaS-интерфейс  

**AI Engineering Route:**

1. Frontend Design — каркас и реализация  
2. taste-skill — вкус и композиция  
3. web-design-guidelines — проверка норм  
4. Impeccable — финальный polish  

> Порядок в Recipe может отличаться от «педагогического» графа выше: Recipe — практический маршрут под задачу; Graph — карта ролей. Оба валидны; на UI подписать, что Recipe — рекомендуемый порядок для SaaS UI.

**Практический канон для MVP (зафиксировать в данных):**  
`Frontend Design → taste-skill → web-design-guidelines → Impeccable`  
как в продуктовом брифе. Graph показывает роли; Recipe — порядок копирования.

### 1 Stack

**slug:** `premium-landing-stack`  
**title:** Premium Landing Stack  
**состав:** Frontend Design + taste-skill + Impeccable + Web Design Guidelines  
**основной recipe:** `quality-saas-ui` (или отдельный landing-recipe позже; в MVP один recipe закрывает и SaaS, и landing-уровень polish)

---

## Информационная архитектура

```text
/ai-skills                          хаб: обещание + Graph + 4 карточки + Recipe + Stack
/ai-skills/[slug]                   карточка Skill (полный контракт)
/ai-skills/recipes/quality-saas-ui  страница Recipe (опционально в MVP: блок на хабе)
/ai-skills/stacks/premium-landing-stack  страница Stack (опционально в MVP: блок на хабе)
```

**MVP-минимум страниц:** хаб + 4 деталки Skill.  
Recipe и Stack на хабе как полноценные блоки (отдельные URL — если влезает без расползания; иначе phase 1.1).

### Контракт страницы Skill

```text
← AI Skills
Title · by Author
TYPE labels
───
ЧТО ДЕЛАЕТ
КОГДА ИСПОЛЬЗОВАТЬ
INSTALL [Copy]
PROMPT / INSTRUCTION [Copy]
EXAMPLES (before → after)
RESULT / LIMITS / AGENTS
RELATED SKILLS
место в Graph / ссылка на Recipe и Stack
```

---

## Данные и техника (до кода)

- **Хранение MVP:** статический TypeScript-модуль (`src/lib/ai-skills/data.ts` или рядом), без Prisma.
- **Админка / БД / marketplace / рейтинги / CLI / MCP** — вне MVP.
- **SEO:** регистрация в `SITE_TREE`, `metadata` + canonical, `npm run validate:sitemap`.
- **Меню:** пункт только через `MenuItem` / `sync-header-menu` (не хардкод в header). Предлагаемый label: «AI Skills», href `/ai-skills`.
- **Визуал:** в духе существующих инженерных разделов ProektMap (inline styles); Graph — простая SVG/HTML-схема, не тяжёлый canvas.
- **Копирайт чужих Skill:** на сайте — разбор и маршрут ProektMap; полные тексты чужих SKILL.md не копировать verbatim без лицензии; install ведёт в исходный репозиторий; invoke — краткая инструкция «как подключить», не зеркало всего файла.

---

## Критерий успеха MVP

Пользователь открывает Recipe «Качественный SaaS UI» → ставит Stack в Cursor/Claude → получает заметно более сильный UI, чем без цепочки, и понимает **зачем каждый Skill в порядке**.

Антикритерий: раздел выглядит как четыре красивые ссылки на GitHub.

---

## Что сознательно не делаем сейчас

- Другие категории Skills
- Поиск/фильтры за пределами Design
- Рейтинги, комментарии, community upload
- Смешение с `/skills` Capability Map
- Подмена Design Skills (`/design-skills`) этим разделом
- Монетизация отдельным paywall на Skill

---

## Чеклист внедрения (когда будет «да» на код)

1. `src/lib/ai-skills/` — типы + данные 4 Skills + 1 Recipe + 1 Stack + edges графа  
2. `src/app/ai-skills/page.tsx` + `[slug]/page.tsx`  
3. UI: хаб (Graph + cards + recipe + stack) + деталка Skill  
4. `SITE_TREE` + sitemap validate  
5. Меню через БД  
6. Кросс-ссылка с `/skills` (UI-домен)  
7. Короткая запись в `docs/DEVLOG.md`  
8. Build + проверка HTTP 200 на `/ai-skills` и 4 slug

---

## Связь с философией

`/resheniya` — что получить.  
`/arsenal` — чем собрать.  
`/ai-skills` — **чем усилить агента**.  

Тот же принцип карты: маршрут уже спроектирован.
