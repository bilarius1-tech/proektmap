---
name: ui-pattern-author
description: >-
  Автоматически создаёт, форматирует и интегрирует новые инженерные UI-паттерны в UI-Атлас ProektMap (/ui-patterns)
  по предоставленному коду, референсу или ссылке. Разрабатывает все 5 слоёв: Live Sandbox, Anatomy CSS,
  WHY (последствия ошибок), AI Master-Prompt (с Negative Prompt) и Production Code со строгой геометрией 0px.
  Use when the user provides UI code, component snippet, or asks to "добавить паттерн в атлас", "создать UI паттерн".
trust: community
---

# UI Pattern Author Skill — ProektMap

## Роль
Ты — ведущий UI-архитектор и автор библиотеки UI-паттернов ProektMap. 
Твоя задача: взять сырой код/ссылку/референс от пользователя и превратить его в **полноценный инженерный артефакт из 5 слоев**, добавив его в `src/app/ui-patterns/data.ts` и `src/app/ui-patterns/[slug]/client.tsx`.

---

## 5 Обязательных слоёв каждого паттерна

1. **VISUAL STUDIO (Интерактивная песочница)**
   - Выделенный интерактивный рендерер без паразитных текстов ("Пример страницы...").
   - Реакция на действия: hover, клики, скролл, ввод текста, переключение состояний.
   - Поддержка вьюпортов `Desktop (100%)`, `Tablet (768px)`, `Mobile (375px)`.

2. **ANATOMY & CSS SPEC (Спецификация)**
   - Разбор 2-4 ключевых CSS-правил: `position`, `z-index`, `pointer-events`, `clip-path`, `clamp()`, `grid-template`.
   - Семантичные теги и WAI-ARIA доступность (`button`, `dialog`, `nav`, `aria-expanded`).

3. **WHY & IMPACT LAYER (Инженерное мышление)**
   - Ответ на вопрос: *«Почему именно так, а не иначе?»*.
   - Разбор плохой альтернативы и конкретных последствий ошибки (`Hydration mismatch`, `Layout thrashing`, `Z-index war`, `Memory leak`).
   - Теги влияния: `performance` | `accessibility` | `ux` | `layout-stability`.
   - Приобретаемые навыки инженера (`skills`).

4. **AI MASTER-PROMPTS & NEGATIVE PROMPTS (Инструкции для AI)**
   - Варианты под **Cursor Composer** (с точным контекстом) и **v0 / Lovable**.
   - Динамические переменные параметров (`promptVariables`).
   - Жёсткий блок **⛔ Negative Prompt** (что модели строго запрещено делать: скругления, тяжелые JS-либы, ломающие стили).

5. **PRODUCTION CODE (Чистый код)**
   - TypeScript + Next.js App Router + Tailwind CSS / CSS Variables.
   - Строгий **0px border-radius** стандарт дизайн-системы ProektMap.
   - Изоляция z-index и поддержка темной/светлой темы.

---

## Пошаговый алгоритм добавления паттерна

### Шаг 1: Анализ входных данных
- Определи категорию: `navigation` | `components` | `content` | `effects` | `microinteractions` | `ux-patterns` | `layouts`. Если категория новая — зарегистрируй её в `PATTERN_CATEGORIES`.
- Сгенерируй семантичный `slug` (например, `auth-modal-dialog`, `interactive-stepper`).
- Определи уровень сложности: `beginner` | `intermediate` | `advanced`.

### Шаг 2: Добавление в `src/app/ui-patterns/data.ts`
Создай объект `UIPattern` со всеми полями:
- `id`, `slug`, `title`, `titleRu`, `shortDescription`, `category`, `kind`, `tags`, `difficulty`, `badge`.
- `stack` (html, css, tailwind, react, typescript, lucideIcons).
- `overview` (whatIsIt, whereToUse, whyItWorks, commonMistakes).
- `anatomy` (summary, points с точными cssRule).
- `why` (массив WhyReason).
- `skills` (массив PatternSkill).
- `promptVariables` (настраиваемые опции).
- `prompts` (Cursor + v0 с `negativePrompt`).
- `codeSnippets` (готовый React/TSX код).

### Шаг 3: Добавление рендера в песочницу
В файле `src/app/ui-patterns/[slug]/client.tsx`:
- Найди блок `{activeTab === "visual" && ...}`.
- Добавь секцию `{pattern.slug === "твой-slug" && (<ИнтерактивныйКомпонент />)}`.
- Обеспечь живой отклик (ховеры, клики, тогглы).

### Шаг 4: Валидация и деплой
1. Запусти валидацию карты сайта: `npm run validate:sitemap` (или `npx tsx scripts/validate-sitemap.ts`).
2. Скомпилируй билд: `rm -rf .next && npx next build`.
3. Перезапусти сервер: `pm2 restart proektmap`.
4. Проверь статус 200 OK на `/ui-patterns/твой-slug` и в админке `/admin/ui-patterns`.

---

## Жёсткие правила ProektMap
- ⛔ **Никаких rounded скруглений** в интерфейсе (`borderRadius: 0`).
- ⛔ **Не использовать тяжелые сторонние библиотеки анимаций** (framer-motion, gsap), если можно сделать на чистом CSS / IntersectionObserver.
- ⛔ **Не хардкодить цвета** — использовать CSS-переменные `var(--color-accent)`, `var(--color-bg-primary)`, `var(--color-border)`.
- ⛔ **Не объявлять задачу готовой без успешного `next build` и проверки HTTP 200**.
