# AGENTS.md — правила для AI-агентов

## Проект
**ProektMap (Карта роста)** — платформа для обучения AI-инжинирингу.
Сайт: https://proektmap.ru | Сервер: 109.196.165.106

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
- `docs/` — документация (DEVLOG, BUGS, ARCHITECTURE)

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
- Админ: bilariuss@yandex.ru, пароль bilariuss111111

### 10. Пользователь — Алексей
- Не программист, AI-инженер
- Предпочитает простые объяснения
- Ценит надёжность и предсказуемость
- Работает из России (Windows 11)

## Философия проекта
См. docs/PHILOSOPHY.md — Decision-Driven Development.
