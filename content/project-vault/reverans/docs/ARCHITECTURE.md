# ARCHITECTURE — Реверанс

Платформа студии художественной гимнастики: публичный сайт + аутентификация + ЛК родителя + админка + платежи ТБанк.

## Слои

| Слой | Маршруты / зона | Назначение |
|------|-----------------|------------|
| Public / marketing | `(marketing)/`, landing CSS, CMS sections | Лендинг, цены, контакты, галерея, SEO |
| Auth | `/login`, `/register`, NextAuth `/api/auth/*` | Email/password + Yandex OAuth; роли parent/admin/coach |
| Parent cabinet | `/cabinet/*` | Дети, договоры, медсправка, оплата месяца / пакеты |
| Admin | `/admin/*` | Группы, дети, платежи, документы, CMS, тренировки |
| Coach | (planned) | Свои группы — не в MVP snapshot |
| APIs | `/api/*` | Health, CMS, payment Init, TBank webhook, uploads |
| Static TZ | Nginx `/tz/` → product docs | Публичное ТЗ без секретов |

## Данные (сущности, без PII)

`User` · `Group` · `Child` (nullable `userId`, `inviteCode`) · `Document` · `Payment` · `PaymentBatch` · `IndividualTraining` · CMS (`SiteSettings`, `PageSeo`, `SiteSection`, `MediaAsset`, `GalleryItem`)

ORM: Prisma · DB: PostgreSQL `reverans_db`

## Инфра

```
Internet → Nginx (TLS :443) → PM2 Next.js 127.0.0.1:3050
                           ↘ /tz/ static alias
PostgreSQL localhost
secrets/ + web/.env on VPS
harness Loop every 15m
```

## Внешние интеграции

| Provider | Use |
|----------|-----|
| Yandex ID | OAuth login |
| TBank acquiring | Payment Init + signed webhook → status `paid` |

## Dev Graph (фазы)

D1–D2 Landing → D3 Auth → D4 Parent children → D5 Documents → D6–D7 Payments/TBank → D8–D9 Admin → D10 QA.  
Подробно: `ai/.cursor/rules/dev-graph.mdc`.
