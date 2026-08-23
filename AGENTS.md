# AGENTS.md — правила для AI-агентов

## Проект
**ProektMap (Карта роста)** — платформа для обучения AI-инжинирингу.
Сайт: https://proektmap.ru | Сервер: 109.196.165.106

**Центр продукта:** `/resheniya` — «Готовые решения AI» (результат → этапы → артефакт → проверка).
Старые Blueprint (`/blueprints`) — legacy. `/solutions` — другая сущность, не путать.

## Стек
Next.js 16 + TypeScript + Prisma 7 + PostgreSQL + Tailwind CSS
Деплой: PM2 на порту 3030, nginx reverse proxy

## ⚠️ КРИТИЧЕСКИЕ ПРАВИЛА

### 1. НИКОГДА не делай `prisma db push --force-reset`
Это удаляет ВСЕ данные из БД. Используй `prisma db push` (без флагов) для обновления схемы.

### 2. Если БД была сброшена — запусти seed
```bash
cd /var/www/www-root/data/www/proektmap.ru
npx tsx prisma/seed.ts
```
Seed-файл восстанавливает: админа, все Blueprint'ы, этапы, решения, промпты, глоссарий, AI-модели, настройки сайта.

### 3. После любых изменений кода
```bash
rm -rf .next && npx next build && pm2 restart proektmap
```
Не деплой без проверки билда!

### 4. Файлы на сервере
- Проект: `/var/www/www-root/data/www/proektmap.ru`
- PM2: `pm2 status proektmap`
- Nginx: `/etc/nginx/sites-enabled/proektmap.conf`
- Логи: `pm2 logs proektmap`

### 5. Структура проекта
- `src/app/` — страницы и API
- `src/components/` — переиспользуемые компоненты
- `src/lib/` — утилиты (auth, db, project-context)
- `prisma/schema.prisma` — модель БД
- `prisma/seed.ts` — ПОЛНЫЙ посев (защита от сброса)
- `docs/` — документация (DEVLOG, BUGS, ARCHITECTURE, PHILOSOPHY, RESHENIYA-V1, **SCROLL-FILM**)
- `docs/SCROLL-FILM.md` — канон по scroll-лендингу / сайт-фильму (`/demo/scroll-film`)
- `src/app/resheniya/` — готовые AI-решения (каталог, обзор, workspace)
- `.cursor/skills/` — Skills для Cursor-агентов
- `.cursor/rules/` — правила по путям файлов
- `.reasonix/skills/` — библиотека Skills проекта

### 5.1. Меню сайта (обязательно)
Пункты шапки и футера **только** через админку https://proektmap.ru/admin/menu (таблица `MenuItem`).
**Не хардкодить** ссылки в `header.tsx` / `footer.tsx`.
Агенту: править через БД/`scripts/sync-header-menu.ts` или API `/api/admin/menu` (нужна сессия admin).
Правило: `.cursor/rules/menu.mdc`

### 6. Важные API эндпоинты
- `/api/ai/ask` — AI-консультант (требуется Pro)
- `/api/blog/auto-publish` — авто-публикация новостей
- `/api/billing/webhook` — webhook ЮKassa
- `/api/admin/settings` — настройки сайта

### 7. Переменные окружения (.env)
DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET, DEEPSEEK_API_KEY, OPENROUTER_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

### 8. Как закрывать день
```bash
cd /var/www/www-root/data/www/proektmap.ru
cat >> docs/DEVLOG.md << 'LOG'
## День X — что сделано
LOG
git add -A && git commit -m "описание" && git push
```

### 9. Особенности проекта
- Дизайн: inline styles (не Tailwind, несмотря на то что он в зависимостях)
- Иконки: Lucide (lucide-react), установлены локально
- Шрифт: Inter (Google Fonts)
- Русский язык: ВЕСЬ интерфейс и документация на русском
- Деньги: ЮKassa, 300₽/мес Pro подписка
  - Admin: credentials in .env

### 10. Пользователь — Алексей
- Не программист, AI-инженер
- Предпочитает простые объяснения
- Ценит надёжность и предсказуемость
- Работает из России (Windows 11)


## Visual Content

ProektMap не должен быть стеной текста.

При создании и редактировании образовательных страниц используй skill `visual-content`.

Всегда анализируй возможность:
- схемы;
- диаграммы;
- UI-примера;
- скриншота;
- интерактивной визуализации;
- оригинальной иллюстрации.

Не добавляй изображения ради декора.

Предпочитай собственные SVG/HTML/CSS-визуализации и оригинальные изображения.

Не копируй изображения из Google, Яндекс.Картинок или Pinterest без проверки прав.

Skill: .reasonix/skills/visual-content/SKILL.md
Skill: .reasonix/skills/yookassa-checkout/SKILL.md

### /resheniya — обязательные Skills агентов

| Задача | Skill | Путь |
|--------|-------|------|
| Создать/расширить маршрут | `resheniya-author` | `.cursor/skills/resheniya-author/SKILL.md` |
| Проверить до публикации | `resheniya-auditor` | `.cursor/skills/resheniya-auditor/SKILL.md` |

Правило (auto на `src/app/resheniya/**`): `.cursor/rules/resheniya.mdc`

Автор и аудитор — разные роли. Автор не объявляет маршрут готовым без аудита.

## Trust System

ProektMap использует трёхуровневую систему проверки Skills:
- 🟢 verified — ручная проверка, нет доступа к secrets, протестирован
- 🟡 community — новый Skill, код открыт, ждёт проверки
- 🔴 flagged — подозрительный код, не использовать

Перед использованием любого Skill проверяй его trust-статус.
При создании новых Skills ставь trust: community до прохождения аудита.

## Философия проекта
См. `docs/PHILOSOPHY.md` (v3) и `docs/RESHENIYA-V1.md`.
