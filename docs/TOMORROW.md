# План на 12.08.2026 — Skills Library: Фаза 1 продолжается

## Главная цель: расширить ядро Skills, усилить витрину

---

## Задача 1: Skill — Telegram Bot Builder (2-3 часа)

**Файл:** 

**Содержание:**
- Архитектура Telegram-бота: aiogram / grammy / Telegraf
- Структура: команды, клавиатуры, инлайн-режим
- База данных: PostgreSQL + Prisma
- Платежи: Telegram Stars + ЮKassa
- Mini App: WebApp интеграция
- Деплой: VPS + webhook vs polling
- Тестирование: тестовый бот + ngrok
- Пример: бот-магазин с корзиной и оплатой

**Критерии:**
- trust: verified
- tested_with: [Reasonix, Cursor]
- 8+ разделов, код на TypeScript
- Ссылка на Blueprint «Telegram Bot» на proektmap.ru

## Задача 2: Страница /skills — фильтрация и поиск (1-2 часа)

- Фильтр по trust: 🟢 / 🟡 / все
- Фильтр по статусу: готов / план
- Поиск по названию и описанию
- Сортировка: по статусу (verified сначала)

## Задача 3: Добавить Skills в главное меню (30 мин)

- Через админку:  → новый пункт «🧩 Skills» → href: /skills
- Проверить на мобильной и десктопной версии

## Задача 4: Блог-пост «Как мы упаковали ЮKassa в Skill» (1-2 часа)

- Формат: историю создания skill, методология, код
- Промо: ссылка на /skills, ссылка на ЮKassa Checkout
- SEO: «интеграция ЮKassa», «приём платежей Next.js»

---

## Бэклог (если останется время)

- Skill: russian-ai-stack (подбор российского AI-стека)
- Skill: glossary-enricher (обогащение текста терминами)
- Skill: decision-coach (Decision-Driven Development)
- GitHub-зеркало для 
- Счётчик установок Skills (Google Analytics events на /skills)

---

## Критерии готовности дня
- [ ] +1 новый verified Skill (telegram-bot-builder)
- [ ] Фильтрация и поиск на /skills
- [ ] Пункт в главном меню
- [ ] Блог-пост про Skills
- [ ] Всё задеплоено, 200 OK
