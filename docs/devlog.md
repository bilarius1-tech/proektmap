

---

## 2026-07-28 — Главная страница: новый hero, сетка, дизайн

### Первый экран
- **Анимированный hero**: переливающийся градиент (3 цветовых блоба — зелёный/синий/фиолетовый), медленно плавают 18-25с циклы, чистый CSS без Canvas
- **Сетка из точек** поверх фона для текстуры
- **h1**: «Школа AI-инженеров: создай проект с нуля с помощью ИИ» — SEO под Яндекс
- **Счётчики**: реальные цифры из БД — решений, навыков, статей
- **«Как это работает»**: 3 шага с Lucide-иконками (Map, Bot, Rocket) вместо эмодзи
- **«Два пути»**: GitBranch и Compass из Lucide вместо букв D и Q

### Сетка и цвета
- Все блоки главной: единая ширина **960px**
- Фон: `#ffffff` (через CSS-переменные)
- Бордеры: `#efefef` (через CSS-переменные — ночной режим работает)
- Убраны `borderRadius: 0` — наследуют токены


---

## 2026-07-29 — AI Архитектор, Blueprint, блог, SEO

### AI Архитектор
- Таймаут увеличен с 35с до **90с**
- Токенов: 8000 → **16000**
- Модель: `deepseek-chat` (стабильный JSON)
- PDF экспорт: заменён jsPDF (без кириллицы) на **window.print()** — полный unicode
- Создан `/api/architect/save` эндпоинт
- Исправлены слаги решений (спецсимволы `:()`) → 404
- Улучшена обработка ошибок сохранения

### Blueprint
- Модель расширена: `goal`, `entities`, `checklist`, `artifacts`, `targetAudience`, `timeToComplete`, `coverImage`, `viewCount`, `startCount`, `completeCount`
- Каталог `/blueprints` с карточками (обложка, цель, статы)
- Обзор перед стартом: цель, сущности БД, чек-лист, артефакты
- Эталонный Blueprint: «Сайт компании с каталогом и заказом» (8 stages + seed)
- ImagePicker для обложек в админке

### Блог
- Счётчик комментариев в списке (был 0)
- Виджет «Обсуждения» — 5 последних комментариев из API
- Share-кнопки: TG, VK, копировать ссылку
- OG-изображение из coverImage поста

### SEO + Техника
- Sitemap расширен (skills, solutions, glossary, patterns)
- Nginx: www → non-www 301 редирект
- 404 страница с навигацией
- Slug: авто-транслит латиницей в реальном времени
- Auth: убран Яндекс, только email/пароль; убраны хардкоды email из проверок isAdmin
- Партнёр: kapibara231@bk.ru / Админ: bilariuss@yandex.ru:123456

### Дизайн
- Шрифты: Onest + Inter
- Мобильная адаптация без !important
- Главная: анимированный hero (переливающиеся блобы), счётчики, «Как это работает», сетка 960px
- Фон #ffffff, бордеры #efefef, Lucide иконки вместо эмодзи
- Ночной режим работает


---

## 2026-07-30 — Telegram Bot MAX, Песочница, Hub Pages

### Стратегия
- Проведена стратегическая сессия: курс на Российскую AI-экосистему
- Якорный продукт: **Telegram Bot MAX** — раздел-экосистема
- Приоритеты: Telegram → AI без VPN → Vibe Coding → Витрина → AI-Фриланс
- Документы: `ROADMAP.md`, `STRATEGY.md`

### Telegram-экосистема (seed-telegram-ecosystem.js)
- Blueprint «Telegram Бот»: 6 этапов, 24 решения, 520 XP
- AI Tools (5): aiogram, grammy, python-telegram-bot, Telethon, BotFather
- Glossary (11): Polling, Webhook, Inline Keyboard, Telegram Stars, Mini App, FSM...
- Skills (3): aiogram бот, Mini App React, Платежи
- Solutions (3): Бот-магазин, AI-консультант, Приём заказов
- Prompts (4): Архитектор, Генератор aiogram, Генератор Mini App, Assistant
- Relations (26): всё связано с Blueprint

### Hub Pages — новый формат
- `docs/HUB-PAGE.md` — задокументированный паттерн
- **/telegram**: что такое бот, 5 шагов создания, подводные камни, FAQ, Term-глоссарий
- **/ai-without-vpn**: 5 замен сервисов, российский стек, таблица, FAQ
- **/vibecraft**: 10 инструментов, таблица сравнения, гайд РФ (оплата/хостинг/домен/почта), 10 вопросов из Telegram

### Меню
- Раздел «Песочница»: 🤖 Telegram Бот, 🛡️ AI без VPN, ⚡ Vibe Coding
- Мега-меню: выпадающий список 2-колоночной сеткой, адаптив
- Компонент `desktop-menu-item.tsx` с hover-логикой

### Философия v2.0
- `docs/PHILOSOPHY.md`: Песочница как четвёртый столп экосистемы
- Воронка: Песочница → Blueprint → Проект → Результат
- 4 столпа: 🧭 Песочница, 📐 Blueprint, 🧠 AI Архитектор, 🎓 Знания

### Техническое
- Прямой доступ к Prisma через скрипты (node + adapter-pg + dotenv)
- Prisma 7 имена: `aITool`, `mCPServer`
- Схема: scp скрипт → копирование в проект → node запуск

### План на завтра
- Hub Page «Российский AI-стек»
- Квиз «Какой Blueprint»
- Калькулятор стоимости


---

## 2026-07-31 — База знаний, Knowledge Panel, Text Selection

### Personal Knowledge Base
- **Модель KnowledgeClip** добавлена в Prisma: id, userId, text, pageTitle, pageUrl, blueprintId?, skillId?, glossaryId?, note, color
- **API /api/knowledge**: GET (список), POST (сохранить), DELETE (удалить) — авторизация через auth()
- **TextSelectionPopover**: при выделении текста появляется кнопка «💾 Сохранить» над выделением
- **KnowledgePanel**: выезжающая панель 420px справа, группировка клипов по источникам, удаление, AI-кнопки «Объяснить» и «Конспект»
- **KnowledgeProvider**: клиентская обёртка, коммуникация через custom events `kp:toggle` / `kp:toggle-learning`
- **KnowledgeButtons**: кнопки в хедере — 📚 «База знаний» и 🎓 «Режим обучения»
- **SessionProvider**: добавлен в layout для поддержки useSession в клиентских компонентах

### Техническое
- Схема Prisma обновлена через `prisma db push` + `prisma generate`
- API использует `(session.user as any).id` как остальные роуты проекта
- Панель знаний открывается/закрывается через кастомные события — не зависит от пропсов
