
---

## 06.07.2026 — День 1: Фундамент ProektMap

### Сделано
- Проект создан: Next.js 16 + TypeScript + Tailwind + Prisma 7
- Домен proektmap.ru → A-запись → SSL → Nginx → :3030
- Engineering Blueprint Manifest v1.0 (3 документа)
- Prisma модель: Blueprint → Stage → Card → Project → CardProgress
- Сид: 1 Blueprint, 9 этапов, 29 карточек, 520 XP
- Дизайн: #0FB880, Inter, светлая тема, сайдбар с этапами
- PM2 + Nginx HTTPS

### Баги исправлены
- Nginx SSL: ISPmanager перезаписал конфиг → listen 109.196.165.106:443 ssl
- Prisma 7: url в schema больше не поддерживается → prisma.config.ts

### Технический стек (финальный)
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Next.js API routes
- БД: PostgreSQL 16 + Prisma 7 + PrismaPg adapter
- Хостинг: VPS, Nginx, PM2, SSL (Let's Encrypt)

### Точка отката
- Git tag: day-20260706-foundation (создать)

---

## 06.07.2026 — День 1 (вечер)

### Сделано
- **AI-консультант:** DeepSeek API, кнопка «🤖 Спросить» на каждой карточке
- **GitHub:** репозиторий https://github.com/bilarius1-tech/proektmap
- **Секреты:** .env / start.sh → .gitignore, .env.example для примера
- **AI отвечает на русском, простым языком, с контекстом карточки**

### Баги
- GitHub Push Protection: блокировал коммит с API-ключом → разрешён вручную
- Git filter-branch: конфликты → решено force push с чистым состоянием

### Точка отката
- Git tag: day-20260706-foundation
- PM2: proektmap (порт 3030)

### Следующие шаги
- Артефакты этапов (карта страниц, дизайн-токены)
- XP при выполнении карточек + сохранение прогресса
- Email Magic Link для входа
- Админка для управления Blueprint'ами

---

## 07.07.2026 — День 2: Админ-панель

### Сделано
- CSS-токены (Яндекс-стиль): цвета, типографика, отступы
- Админ-панель: 5 разделов (Обзор, Blueprints, Этапы, Решения, Настройки)
- Basic Auth middleware (admin / bilariuss111111)
- Lucide иконки, без emoji
- Настройки сайта: SEO, мета-теги, коды Метрики

### Технически
- /admin/* защищены middleware
- Все страницы — серверные компоненты + async getDb()
- Таблицы на чистом CSS (без библиотек)

---

## 07.07.2026 — День 2: Админка, меню, дизайн

### Сделано
- **CSS-токены (Яндекс-стиль):** цвета, типографика, отступы, тени
- **Админ-панель:** 6 разделов + Basic Auth
- **CRUD:** Blueprints, Stages, Decisions — полноценные формы
- **DataTable:** WordPress-стиль с пагинацией и поиском
- **Меню:** древовидный редактор в /admin/menu, рендеринг из БД
- **Методология ПОНЯТЬ/ВЫБРАТЬ/ПРОВЕРИТЬ:** 3 вкладки на каждой карточке
- **4 новых поля Decision:** context, constraints, validation, iteration
- **Промпт-билдер:** сборка из всех полей
- **Мобильная версия:** гамбургер, FAB, адаптивный layout
- **Dark mode:** CSS-переменные + тоггл в header
- **Streak:** ежедневный бонус XP (2/5/15)
- **Регистрация:** Яндекс OAuth + Email/пароль + /dashboard
- **Пользователи в админке:** /admin/users
- **SEO:** sitemap.xml, llms.txt, динамические meta-теги
- **Глобальный layout:** header + footer на всех страницах

### Технически
- 10 этапов вайбкодинга, 21 Decision
- Prisma 7 + PrismaPg + PostgreSQL
- NextAuth v4 (Яндекс + Credentials)
- DeepSeek API (готов, ожидает биллинга)

### В планах
- Drag-and-drop сортировка меню
- Mega-menu (выпадающие колонки)
- Биллинг (ЮKassa)
- AI-интеграция (после биллинга)
- Контент: наполнить 5 решений реальными данными

### Точка отката
- Git tag: day-20260707-v03

---

## 07.07.2026 — День 2 (продолжение)

### Skills-система
- **Skill модель:** title, slug, skillMd, assetsPath, scriptsPath, refsPath
- **DecisionSkill:** связь многие-ко-многим с Decision
- **3 сидированных навыка:** Домен, DNS, SSL, Деплой
- **/admin/skills:** таблица с поиском и пагинацией
- **docs/SKILLS.md:** полная документация

### Drag-and-drop меню
- **MenuItem.location:** header | footer
- **Drag-and-drop сортировка** в админке
- **Footer из БД:** /admin/menu → вкладка «Футер»

### Исследование конкурентов
- vibe-coding-cn (22k ⭐, MIT): skills + prompts + CLAUDE.md
- vibe-vibe (5.7k, CC BY-NC-SA): Docker, обучение
- cloudflare/vibesdk (5.1k, MIT): платформа на Drizzle

---

## Этап 0: Философия общения с AI — контент заполнен

### 3 решения с полным контентом:
1. **Как общаться с AI** — problem/why/content/tradeoffs/mistakes/context/constraints/validation/iteration/prompt
2. **Утренний ритуал** — шаблон для начала дня с AI
3. **Вечерний ритуал** — шаблон для итогов дня

### Контент написан от боли пользователя:
- Конкретные примеры «плохо» / «хорошо»
- Сколько времени экономит каждый ритуал
- Готовые промпт-шаблоны для копирования

---

## Этап 2: Дизайн-система — контент заполнен

### 3 решения на основе исследования:
1. **Создать Design Tokens** — CSS-переменные, примеры из Stripe/shadcn
2. **Выбрать шрифт** — Inter + JetBrains Mono через next/font
3. **Создать DESIGN.md** — формат Google Stitch, awesome-design-md (96k ⭐)

### Источники:
- Doka.guide (CSS-переменные на русском)
- awesome-design-md (75+ примеров от Stripe, Apple, Linear)
- shadcn/ui theming (стандарт индустрии)
- DESIGN.md формат (v0, Bolt.new, Cursor)

---

## 🎉 Этапы 2-9 заполнены! Blueprint «Корпоративный сайт» готов.

### Все 10 этапов, 42 решения, 715 XP

- Этап 0: Философия общения с AI (3)
- Этап 1: Инструменты (8) — домен, хостинг, VS Code, SourceCraft, OpenRouter, Git, выбор среды
- Этап 2: Дизайн-система (3) — токены, шрифты, DESIGN.md
- Этап 3: UI Kit (4) — Header/Footer, Button, Card
- Этап 4: Next.js (3) — create-next-app, страницы, Server/Client
- Этап 5: Деплой (4) — DNS, SSL, запуск, Git-откат
- Этап 6: SEO (4) — мета-теги, sitemap, llms.txt, Schema.org
- Этап 7: Аналитика (3) — Метрика, Вебмастер, оптимизация
- Этап 8: Право (4) — политика, соглашение, cookie, реквизиты
- Этап 9: Telegram (5) — бот, webhook, chat_id, форма, безопасность

### Каждое решение содержит:
- problem, why, recommended, content
- tradeoffs, whenNotUse, mistakes
- context, constraints, validation, iteration
- promptTitle, promptTemplate (готовый для AI)

---

## 📚 Библиотека промптов — форк vibe-coding-cn (22k ⭐)

### Что сделано
- **Модель Prompt**: Prisma (prompts), 6 категорий: Код, Деплой, Дизайн, SEO, Право, AI
- **15 промптов**: адаптированы с китайского на русский рынок (Яндекс, reg.ru, Beget, 152-ФЗ)
- **Страница /prompts**: поиск, фильтр по категориям, раскрытие, копирование в 1 клик
- **Админка /admin/prompts**: CRUD, включение/выключение, счётчик использований
- **PromptsBlock**: переиспользуемый компонент (как AIRadar) — встроен в каждый Blueprint
- **API**: /api/admin/prompts — POST/PUT/PATCH/DELETE

### Технически
- `src/components/blueprint/prompts-block.tsx` — компонент
- `src/app/prompts/` — публичная страница
- `src/app/admin/prompts/` — админ-панель
- `src/app/api/admin/prompts/` — API CRUD
- `prisma/schema.prisma` — модель Prompt

---

## 🔤 Система подсказок для новичков — TemplateHelp

### Что сделано
- **Модель PromptVariable**: 33 переменные с описаниями, примерами, категориями
- **TemplateHelp компонент**: RenderTemplate + VariableLegend
- **RenderTemplate**: `{{переменные}}` в тексте промпта → кликабельные подсказки
- **VariableLegend**: раскрывающийся справочник всех переменных с категориями
- **Админка /admin/prompt-vars**: CRUD переменных, вкл/выкл
- **Интегрировано**: /prompts + PromptsBlock в Blueprint'ах

### Как работает для новичка
1. Открыл промпт → видит `{{project}}` выделенным
2. Нажал → всплывающее окно: «Название проекта. Подставьте своё. Пример: Сайт стоматологии»
3. Не понял систему → кнопка «Как пользоваться шаблонами?» → полный справочник

### Категории переменных
- общее (3): project, context, task
- код (10): path, source, stack, error, input, output...
- деплой (4): domain, server, nodeVersion, token
- дизайн (1): layout
- seo (3): page, type, topic
- право (4): company, email, inn, phone
- ai (4): role, restrictions, style, format

### Расширяемость
Админ может добавлять/редактировать/отключать переменные через /admin/prompt-vars.
Система автоматически подхватывает новые переменные во всех промптах.

---

## 📁 Категории + пагинация + Lucide иконки

- **Пагинация**: 30 промптов на страницу, URL-параметр `?page=2&cat=Код`
- **Lucide иконки**: 6 категорий (Code, Rocket, Palette, Search, Shield, Sparkles)
- **Админка /admin/prompt-cats**: CRUD категорий, 20 иконок на выбор
- **Эмодзи заменены** на векторные иконки Lucide везде

---

## 📚 Этап: Библиотека промптов — завершён

### Компоненты
- **Модель Prompt** — 15 промптов, 6 категорий, теги, счётчик использований
- **Модель PromptVariable** — 33 переменные с описаниями и примерами
- **Модель PromptCategory** — 6 категорий, иконки Lucide, CRUD
- **/prompts** — публичная страница с поиском, фильтрами, пагинацией
- **PromptsBlock** — переиспользуемый компонент в каждом Blueprint
- **TemplateHelp** — RenderTemplate (кликабельные `{{переменные}}`) + VariableLegend (справочник)
- **Админка**: /admin/prompts, /admin/prompt-vars, /admin/prompt-cats

### Технический стек
- Форк vibe-coding-cn (22k ⭐), адаптация под РФ
- Lucide иконки (Code, Rocket, Palette, Search, Shield, Sparkles)
- Пагинация 30/page, URL-параметры
- position:fixed + z-index:99999 для tooltip-подсказок

### Файлы
- `src/app/prompts/` — публичная страница + клиент
- `src/components/blueprint/prompts-block.tsx` — компонент
- `src/components/blueprint/template-help.tsx` — подсказки
- `src/app/admin/prompts/` — CRUD промптов
- `src/app/admin/prompt-vars/` — CRUD переменных
- `src/app/admin/prompt-cats/` — CRUD категорий
- `src/app/api/admin/prompts/` — API промптов
- `src/app/api/admin/prompt-vars/` — API переменных
- `src/app/api/admin/prompt-cats/` — API категорий
- `prisma/schema.prisma` — Prompt, PromptVariable, PromptCategory

### Расширяемость
Админ может: добавлять промпты, переменные, категории, иконки через админку.
Система готова к масштабированию до 10 000+ промптов.
---
## ✅ Blueprint «Корпоративный сайт» — ПОЛНОСТЬЮ ЗАВЕРШЁН

- **10 этапов, 45 решений, 765 XP**
- Полный путь: от AI-коммуникации до мониторинга
- Библиотека промптов с подсказками для новичков
- Админка: Blueprints, Stages, Decisions, Prompts, Variables, Categories, Menu, Skills, Referrals, AI Radar, Users, Settings

---

## 🧬 Интеграция трёх open-source находок yourkeychen

### huashu-design → Дизайн-система v2
- 20 принципов дизайна (не правила — линзы)
- 5D-рубрикатор: эстетика, доступность, производительность, масштабируемость, консистентность
- AI-ревью дизайна с конкретными исправлениями
- +3 решения, +75 XP

### code-review-graph → Новый этап «Граф знаний»
- Blast-radius анализ: изменение → кто ещё затронут
- Экономия токенов: 38x–528x (82x медиана)
- Hub-узлы, bridge-узлы, knowledge gaps
- +4 решения, +100 XP

### SkillClaw → Авто-эволюция навыков
- Pipeline: Summarize → Aggregate → Execute → PRM
- Коллективный разум: опыт всех → навык один
- Модель SkillEvolution в БД (версионирование навыков)
- +1 решение, +25 XP

### Итого
- **11 этапов, 52 решения, 940 XP** 🔥
- Полный AI-инжиниринг: от дизайна до графа знаний

---

## 🧹 Убраны избыточные компоненты из Blueprint

- PromptsBlock и AIRadar удалены из карточек решений
- Оставлены только на странице /prompts и в админке
- Типы и пропсы почищены
- Причина: дублирование, не нужно в каждом развёрнутом решении

---

## 📄 Юридические страницы + Cookie-баннер

- /privacy — Политика конфиденциальности (152-ФЗ)
- /terms — Пользовательское соглашение
- /offer — Публичная оферта (для ЮKassa)
- /refund — Условия возврата
- CookieConsent — баннер снизу с кнопкой «Принять»
- Логотип: ProektMap → Карта роста
- Все страницы: ИП Тимофеев А.Г., ИНН 532002912418
