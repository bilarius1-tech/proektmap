# ProektMap — Карта роста

Платформа для обучения AI-инжинирингу: **готовые маршруты** от цели до проверяемого результата.

**Сайт:** [https://proektmap.ru](https://proektmap.ru)

> Мы уже спроектировали маршрут. Вам осталось пройти его.

---

## Центр продукта

| Что | URL | Зачем |
|-----|-----|--------|
| **Готовые решения AI** | [/resheniya](https://proektmap.ru/resheniya) | Результат → этапы → артефакт → проверка |
| Песочница | [/sandbox](https://proektmap.ru/sandbox) | Открытия и исследования |
| Креативная библиотека вайбкодера | [/sandbox/creative-library](https://proektmap.ru/sandbox/creative-library) | Стеки-рецепты, Tier 1–3, FPS Killers |
| Вайбик | [/vaibik](https://proektmap.ru/vaibik) | Демо-персонаж / квест |

`/solutions` и старые Blueprint (`/blueprints`) — соседние/legacy сущности, не путать с `/resheniya`.

---

## Философия (коротко)

1. Маршрут уже спроектирован — ProektMap выбирает основной стек.
2. Понятный язык, действие и наблюдаемый сигнал готовности.
3. AI — инструмент, не замена инженеру.
4. Песочница — первый шаг; **`/resheniya` — центр результата**.

Полный канон: [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md).

---

## Стек

- **Next.js 16** + TypeScript  
- **Prisma 7** + PostgreSQL  
- Tailwind в зависимостях; UI в основном на **inline styles**  
- Деплой: PM2 (порт 3030) + nginx  

---

## Быстрый старт (локально)

```bash
git clone git@github.com:bilarius1-tech/proektmap.git
cd proektmap
cp .env.example .env   # если есть; иначе заполни .env вручную
npm install
npx prisma generate
npx prisma db push     # без --force-reset!
npm run dev
```

Нужны переменные: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` и ключи сервисов (см. `.env` на сервере / документацию).

Seed (если БД пустая):

```bash
npx tsx prisma/seed.ts
```

---

## Креативная библиотека вайбкодера

Не awesome-list, а **решения**:

```text
Задача (рецепт) → рекомендованный стек → проще/сложнее
  → бриф для AI-агента → карточки Tier 1–3 → FPS Killers
```

Примеры рецептов: сайт-фильм, hero за вечер, виртуальная галерея, карта с точками, тур по продукту.

- Live: [proektmap.ru/sandbox/creative-library](https://proektmap.ru/sandbox/creative-library)  
- Данные: `src/lib/creative-library/data.ts`  
- Канон: [`docs/VIBECODER-CREATIVE-LIBRARY.md`](docs/VIBECODER-CREATIVE-LIBRARY.md)

---

## Документация

| Файл | О чём |
|------|--------|
| [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md) | Философия продукта |
| [`docs/RESHENIYA-V1.md`](docs/RESHENIYA-V1.md) | Модель `/resheniya` |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Архитектура (если есть) |
| [`docs/DEVLOG.md`](docs/DEVLOG.md) | Дневник разработки |
| [`AGENTS.md`](AGENTS.md) | Правила для AI-агентов на сервере |

---

## Git: main = master

Рабочая ветка деплоя — **`main`**. После коммита ветки `main` и `master` должны указывать на **один commit** (инцидент 22–23.08.2026: иначе 404 на `/resheniya`).

```bash
git checkout main && git pull
# …работа, commit…
git checkout master && git merge main && git checkout main
git rev-parse main master   # хеши одинаковые
git push origin main master
```

---

## Важно

- **Никогда** не запускай `prisma db push --force-reset` на проде — сотрёт данные.  
- Секреты только в `.env` (файл в gitignore).  
- После изменений на сервере: `rm -rf .next && npx next build && pm2 restart proektmap`.

---

## Автор / продукт

**ProektMap (Карта роста)** — школа и навигатор AI-инженеров в России.  
Сайт: [proektmap.ru](https://proektmap.ru)
