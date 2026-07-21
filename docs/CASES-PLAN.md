# BuildPattern — центральный экран ProektMap

> Обновлено с учётом ревью: **не кейсы, а паттерны сборки.**

## Философия

### Кейс vs Паттерн

| Кейс (история) | Паттерн (шаблон) |
|-----------------|-------------------|
| Мы сделали AI SEO Auditor | Тебе нужен аудит сайтов? Бери Firecrawl + OpenAI + Supabase |
| Использовали Firecrawl | Повторяешь схему |
| Получили такой результат | Получаешь такой же результат |

**ProektMap строит паттерны.** Паттерн — это не «мы сделали», а «ты можешь сделать».

### Центральный экран

```
Пользователь приходит с мыслью «Хочу AI-консультанта»
↓
/pages — витрина паттернов (главный экран)
↓
Паттерн: AI Консультант
  ├── Outcome: сложность, срок, доход
  ├── Сущности: User, Dialog, Message, Subscription
  ├── Почему этот стек: Supabase ✓, Firebase ✗
  ├── Архитектура: React Flow схема
  ├── Стек: Next.js + OpenAI + Telegram + Supabase
  ├── Эволюция: v1 → v2 → v3 → v4
  └── Связанные MCP / агенты
```

Каталоги (MCP, агенты, инструменты) становятся справочниками — пользователь приходит в них из паттерна, а не наоборот.

## Модель данных

### BuildPattern

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | — |
| title | String | «AI SEO Аудитор» |
| slug | String | `ai-seo-auditor` |
| description | String | Кратко: что делает, для кого (200 символов) |
| longDescription | String | Полный разбор (Markdown) |
| difficulty | Enum | `beginner` / `intermediate` / `advanced` |
| timeToBuild | String | «2 дня» / «1 неделя» |
| outcome | JSON | `{revenuePotential, launchTime, complexity, maintenance}` |
| entities | JSON | `[{name, fields, relations}]` — сущности БД |
| stack | JSON | `[{tool, why, whyNot, alternatives}]` — стек с пояснениями |
| architecture | JSON | `[{phase, steps}]` — шаги сборки по фазам |
| evolution | JSON | `[{version, desc, adds}]` — v1→v2→v3→v4 |
| mcpServers | JSON | ID связанных MCP-серверов |
| sourceUrl | String | GitHub / статья-источник |
| mistakes | JSON | `[{title, desc, loss, lesson}]` — типичные ошибки |
| isPublished | Boolean | Опубликован / черновик |
| sortOrder | Int | Порядок |
| createdAt | DateTime | — |

### Outcome (встроенный JSON)

```json
{
  "revenuePotential": 49,
  "launchTime": "2 дня",
  "complexity": 3,
  "maintenance": "2 часа/неделю"
}
```

### StackWhy (встроенный JSON в stack)

```json
[
  {
    "tool": "Supabase",
    "why": "Авторизация из коробки, PostgreSQL, дешёвый старт, realtime",
    "whyNot": "Firebase — дороже на росте, сложнее SQL-аналитика",
    "alternatives": ["Firebase", "Appwrite", "PocketBase"]
  }
]
```

### Entities (встроенный JSON)

```json
[
  {
    "name": "Project",
    "fields": ["id", "url", "userId", "createdAt"],
    "relations": "has many Audits, belongs to User"
  }
]
```

### Evolution (встроенный JSON)

```json
[
  { "version": "v1", "desc": "Чат + GPT", "adds": "Базовый диалог" },
  { "version": "v2", "desc": "Чат + GPT + память", "adds": "Контекст диалога" },
  { "version": "v3", "desc": "Чат + память + Telegram", "adds": "CRM в Telegram" },
  { "version": "v4", "desc": "SaaS с подпиской", "adds": "Stripe, личный кабинет" }
]
```

## Страницы

### `/patterns` — витрина паттернов (главный экран)

- Карточки: название, сложность (звёзды), время, доход, стек (иконки)
- Таблица сравнения: Сложность / Запуск / Доход
- Фильтры: уровень, время, доход, категория
- Сортировка: для новичков / по доходу / по скорости

### `/patterns/[slug]` — детальный разбор

- Outcome: карточка с метриками
- Сущности: схема данных
- Почему этот стек: таблица с ✓/✗
- Архитектура: React Flow схема
- Эволюция: таймлайн v1→v4
- Типичные ошибки
- Связанные MCP и агенты
- Кнопка «Собрать» → открывает Blueprint

### Интеграция в Blueprint

- «Похожие паттерны» на главной Blueprint'а
- В этапе «Инструменты»: ссылки на паттерны с таким же стеком

## Технический стек

| Слой | Технология |
|------|-----------|
| БД | PostgreSQL + Prisma |
| API | Next.js Route Handlers |
| UI | React + TypeScript + Tailwind |
| Схемы | React Flow (уже установлен) |
| Markdown | react-markdown |
| SEO | Динамические meta + sitemap |

## 3 уровня паттернов

### Уровень 1: Новичок (complexity 1-3)

- Telegram Bot
- AI Чат-виджет
- Генератор статей

### Уровень 2: Практик (complexity 4-6)

- AI SEO Аудитор
- AI Консультант
- Автоворонка

### Уровень 3: Профи (complexity 7-10)

- SaaS продукт
- AI агентная система
- Маркетплейс

## Порядок реализации (завтра)

### Фаза 1: Модель + API (30 мин)
- Prisma модель `BuildPattern`
- API CRUD: `/api/admin/patterns`
- API публичный: `/api/patterns`

### Фаза 2: Витрина `/patterns` + `/` (главный экран) (45 мин)
- Серверная страница + таблица сравнения сложность/срок/доход
- Карточки с outcome
- Фильтры
- SEO

### Фаза 3: Детальная страница `/patterns/[slug]` (45 мин)
- Outcome карточка
- Сущности → Почему стек → Архитектура (React Flow) → Эволюция
- Связанные MCP и агенты
- Типичные ошибки

### Фаза 4: Админка `/admin/patterns` (30 мин)
- CRUD + Markdown редактор
- JSON-редактор для outcome/entities/stack/evolution

### Фаза 5: Интеграция (15 мин)
- Блок «Похожие паттерны» на главной Blueprint'а
- Ссылки на паттерны из карточек MCP

---

## Паттерны для запуска (3 шт)

### 1. AI SEO Аудитор

| Outcome | Значение |
|---------|----------|
| Сложность | 3/10 |
| Запуск | 2 дня |
| Доход | $49/мес |
| Поддержка | 2 часа/неделю |

**Сущности:** Project, Audit, Page, Issue, Report, User, Subscription

**Стек:**
- Next.js — SSG для отчётов, быстрый UI
- OpenAI — анализ SEO-ошибок
- Firecrawl — сбор страниц
- Supabase — БД + авторизация (почему не Firebase: SQL-аналитика дешевле)

**Эволюция:** v1: веб-интерфейс → v2: PDF-отчёты → v3: мониторинг по крону → v4: SaaS подписка

### 2. AI Консультант для сайта

| Outcome | Значение |
|---------|----------|
| Сложность | 5/10 |
| Запуск | 3 дня |
| Доход | $99/мес |
| Поддержка | 4 часа/неделю |

**Сущности:** Site, Dialog, Message, KnowledgeBase, Owner, Subscription

**Стек:**
- Next.js — чат-виджет + админка
- OpenAI — AI ответы
- Telegram Bot API — CRM для владельца
- Supabase — БД диалогов + realtime

**Эволюция:** v1: чат-виджет → v2: Telegram CRM → v3: обучение на диалогах → v4: мульти-сайт

### 3. Telegram Support Bot

| Outcome | Значение |
|---------|----------|
| Сложность | 2/10 |
| Запуск | 1 день |
| Доход | $29/мес |
| Поддержка | 1 час/неделю |

**Сущности:** Bot, User, Message, FAQ, Subscription

**Стек:**
- Node.js — легковесный рантайм
- Telegram Bot API — нативный интерфейс
- OpenAI — ответы на вопросы
- Supabase — хранение FAQ и пользователей

**Эволюция:** v1: автоответчик → v2: FAQ-база → v3: эскалация на человека → v4: мульти-канальность

---

## Правила для AI-агентов

1. Вся разработка на русском языке
2. Использовать существующие компоненты (React Flow, Prisma, CSS-переменные)
3. Стиль: Swiss Design, плотная сетка, без скруглений
4. Иконки: Lucide (локально)
5. Шрифты: Montserrat (заголовки) + Inter (текст)
6. Тёмная тема: `var(--color-bg-primary)`, не `white`
7. SSH: `/c/Windows/System32/OpenSSH/ssh.exe root@109.196.165.106`
8. Проект на сервере: `/var/www/www-root/data/www/proektmap.ru`
9. Проект локально: `C:\Users\bilar\proektmap` (читать, не писать)
10. Сборка: `rm -rf .next && npx next build`
11. Деплой: `pm2 restart proektmap`
