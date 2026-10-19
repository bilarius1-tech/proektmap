# Аудит: интеграция форума Flarum 2.x в ProektMap

Версия: 1.0 · Дата: 19.10.2026 · Этап 1 (AUDIT) по ТЗ «Форум ProektMap на Flarum 2.x»

На этом этапе production-код не менялся. Создан только этот файл.

---

## 1. Стек проекта

| Слой | Что используется |
|---|---|
| Фреймворк | Next.js 16 (App Router), React 19, TypeScript |
| Backend | Тот же Next.js: route handlers в `src/app/api/**`, server components, `src/middleware.ts` |
| Frontend | React, inline styles + CSS-переменные (`var(--color-*)`, `var(--space-*)`), шрифт Inter, иконки Lucide |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| БД ProektMap | PostgreSQL 14, `localhost:5433`, база `proektmap`, schema `public` |
| Авторизация | NextAuth (next-auth) **v4.24**, не Auth.js v5 |
| Процесс | PM2, процесс `proektmap`, `next start --port 3030` |
| Веб-сервер | nginx (под ISPmanager) → reverse proxy на `127.0.0.1:3030` |
| Docker | Не используется (нет `Dockerfile` / `docker-compose`) |

Сервер общий: на нём ещё ~16 PM2-процессов других проектов, Apache (ISPmanager), MySQL 8.0, PHP-FPM 8.1 и 8.4.

---

## 2. Авторизация — детально

### 2.1. Файлы

| Файл | Роль |
|---|---|
| `src/lib/auth/index.ts` | `authOptions`: провайдеры, callbacks, helper `auth()` |
| `src/app/api/auth/[...nextauth]/route.ts` | Реэкспорт handler NextAuth (`/api/auth/*`) |
| `src/app/auth/page.tsx` | Страница входа: email/пароль + кнопка «Войти через Яндекс» |
| `src/app/api/auth/register/route.ts` | Регистрация по email/паролю (bcrypt) |
| `src/app/api/auth/check/route.ts` | API текущего пользователя: `{ authenticated, email, role, subscription }` |
| `src/app/api/auth/verify/route.ts` | Токен подтверждения email (письмо не отправляется, только `console.log`) |
| `src/middleware.ts` | `getToken()` из `next-auth/jwt`; защита `/dashboard`, `/admin`, `/api/ai/ask` |
| `src/components/layout/user-menu.tsx` | `signOut({ callbackUrl: "/" })` |

### 2.2. Провайдеры

1. **Yandex** — встроенный `next-auth/providers/yandex`.
   - authorize: `https://oauth.yandex.ru/authorize?scope=login:info+login:email+login:avatar`
   - token: `https://oauth.yandex.ru/token`
   - userinfo: `https://login.yandex.ru/info?format=json`
   - profile → `id` (Yandex user id), `name` (display_name / real_name / first_name), `email` (default_email или emails[0]), `image` (`https://avatars.yandex.net/get-yapic/<default_avatar_id>/islands-200`).
   - state и CSRF обеспечивает NextAuth (cookie `__Secure-next-auth.state`, `__Host-next-auth.csrf-token`).
   - Callback: `https://proektmap.ru/api/auth/callback/yandex`.
2. **Credentials** — email + пароль (bcrypt), без обязательного подтверждения email.

### 2.3. Сессия

- `session: { strategy: "jwt" }` — **сессий в БД нет**, нет NextAuth Prisma Adapter.
- Cookie: `__Secure-next-auth.session-token` (HTTPS), `HttpOnly`, `SameSite=Lax`, `Path=/`. Содержимое — JWE, зашифрованный ключом из `NEXTAUTH_SECRET`.
- В токене: `id` (users.id, UUID), `email`, `name`, `role`, `subscription`.
- `callbacks.jwt` на каждом запросе ищет пользователя **по email** и подменяет `token.id` на `users.id`.

### 2.4. Найденный auth flow (Яндекс)

```
Пользователь → /auth → signIn("yandex", { callbackUrl: "/dashboard" })
  → /api/auth/signin/yandex (NextAuth ставит state-cookie, POST защищён csrf-token)
  → oauth.yandex.ru/authorize
  → /api/auth/callback/yandex (проверка state, обмен code → token, запрос login.yandex.ru/info)
  → callbacks.signIn: ищет users по email; если нет — создаёт (role=user, subscription=free)
  → callbacks.jwt: token.id := users.id (поиск по email)
  → cookie __Secure-next-auth.session-token
  → redirect /dashboard
```

### 2.5. Модель пользователя (`prisma/schema.prisma`, таблица `users`)

Ключевые поля: `id` (UUID, стабильный), `email` (unique), `name`, `avatar` (строка, default `""`), `role` (`user`/`admin`), `subscription`, `createdAt`, `emailVerified`, `passwordHash`, `publicProfile`, `bio`, `headline`.

Таблиц `Account` / `Session` / `VerificationToken` **нет**.

Состояние БД на 19.10.2026: 22 пользователя, 18 без пароля (вошли через Яндекс), 1 админ, 0 с подтверждённым email.

### 2.6. Ответы на вопросы ТЗ

| Вопрос | Ответ |
|---|---|
| Механизм | NextAuth v4, JWT-стратегия в зашифрованной cookie |
| Где хранится пользователь | PostgreSQL `proektmap.users` |
| Стабильный идентификатор | `users.id` (UUID). Yandex ID **не сохраняется нигде** |
| Email / имя / аватар | Email и имя — в `users` и сессии. Аватар Яндекса приходит в `profile.image`, но **не сохраняется** в `users.avatar` |
| API текущего пользователя | `GET /api/auth/check` (без id, имени и аватара), `GET /api/auth/session` (стандарт NextAuth) |
| Можно ли быть OAuth-провайдером | Сейчас нет: ProektMap только клиент Яндекса. Эндпоинтов authorize/token/userinfo для третьих сторон нет |

---

## 3. Домены и URL

- Канонический домен: `https://proektmap.ru` (www и http → 301 на него).
- SSL: Let's Encrypt через ISPmanager, `/var/www/httpd-cert/www-root/proektmap.ru_le1.*`.
- nginx-конфиг прода: `/etc/nginx/vhosts/www-root/proektmap.ru.conf` (а не `/etc/nginx/sites-enabled/proektmap.conf`, как написано в `AGENTS.md`). Весь `location /` проксируется в Next.js.
- Рядом есть поддомен `boro.proektmap.ru` (отдельный проект).
- Маршрута `/community` в Next.js **нет** (`src/app/community` не существует) — путь свободен.

Вывод: `https://proektmap.ru/community` технически возможен. Достаточно добавить в nginx `location ^~ /community` перед `location /`, отдать его PHP-FPM 8.4, а остальное оставить Next.js. Поддомен не нужен.

---

## 4. Деплой

- Git: ветки `main` и `master` указывают на один коммит (`26e0b94`) — правило §0 соблюдается.
- `deploy.sh`: `git push` → по SSH `git pull && next build && pm2 restart proektmap && nginx -s reload`.
- `start.sh` запускает Next с переменными окружения. Файл в `.gitignore` и в историю Git не попадал.
- Docker нет — по ТЗ инфраструктуру не меняем. Flarum ставим как обычное PHP-приложение рядом.

### Готовность сервера к Flarum 2.x

| Требование Flarum 2.0.2 | На сервере |
|---|---|
| PHP ^8.3 | PHP 8.4.11 FPM (`php-fpm84.service`, `/opt/php84`). Системный CLI — 8.1, не подходит |
| Расширения: curl, dom, fileinfo, gd, json, mbstring, openssl, pdo_mysql, tokenizer, zip, intl | Есть все |
| `pdo_pgsql` | **Нет** → Postgres для Flarum не вариант без доустановки |
| MySQL 8 / MariaDB | MySQL 8.0.46 уже работает |
| Composer | **Не установлен** — нужно поставить (запускать через `/opt/php84/bin/php`) |

---

## 5. Состояние экосистемы Flarum (проверено на Packagist 19.10.2026)

| Пакет | Версия | Совместим с 2.x |
|---|---|---|
| `flarum/core` | v2.0.2 (17.10.2026), PHP ^8.3 | да |
| `flarum/flarum` (skeleton) | v2.0.0 | да |
| `flarum-lang/russian` | 2.0.77 | да |
| `fof/oauth` | 2.0.0 (10.10.2026) | да. Провайдеры: Discord, Facebook, GitHub, GitLab, Google, LinkedIn. **Яндекса нет.** Есть экстендер `RegisterProvider` для своих провайдеров, связывание аккаунтов, режим «только OAuth» |
| `fof/passport` (generic OAuth2) | 1.1.1 (2023) | **нет**, не использовать |
| `flarum/flags`, `flarum/approval`, `flarum/suspend`, `flarum/nicknames` | v2.0.x | да (жалобы, премодерация, блокировки) |
| `fof/user-bio` | 2.0.0 | да |
| `fof/sitemap` | 3.0.0-beta.6 | только beta — проверить перед продом |
| `fof/default-group` | 2.0.0-beta.1 | только beta |
| `fof/spamblock`, `fof/nightmode` | 1.x | **нет** версии под 2.x |

Сторонние расширения «Yandex для Flarum» на GitHub написаны под 1.x — по ТЗ не берём.

---

## 6. Меню, карта сайта, SEO

- Корень меню **«Сообщество» уже есть**: `header-community` → `/specialists`, дети «Люди» (`/specialists`) и «Работы» (`/ai-workshop`). Новый корень не нужен: форум — третий ребёнок, например «Форум» → `/community`. Делается через `/admin/menu`, не в коде.
- `scripts/validate-sitemap.ts` считает ошибкой любой `href` в `SITE_TREE` без `src/app<href>/page.tsx`. Для `/community` (не Next.js) нужно исключение для внешних префиксов в валидаторе.
- `src/middleware.ts` ставит `X-Robots-Tag: index, follow` только на ответы Next.js — до Flarum он не дойдёт. Robots для форума задаются самим Flarum и nginx.
- `public/robots.txt`: закрыты `/api/`, `/admin/`, `/dashboard/`. Нужно добавить `Disallow: /community/admin`, `/community/api`, а также sitemap форума.
- Кандидаты под кнопку «Обсудить в сообществе»: `src/app/blog/[slug]`, `src/app/glossary/[slug]`, `/video`, `/resheniya/*`, `/ui-patterns/*`.

---

## 7. Точки интеграции

| # | Где | Что меняется (на следующих этапах) |
|---|---|---|
| 1 | nginx vhost `proektmap.ru.conf` | `location ^~ /community` → PHP-FPM 8.4, root = `.../flarum/public` |
| 2 | MySQL 8 | Отдельная БД `proektmap_forum` + пользователь только с правами на неё |
| 3 | Next.js: новые эндпоинты SSO | `/api/community/oauth/authorize`, `/token`, `/userinfo` (см. RECOMMENDATION) |
| 4 | `src/app/auth/page.tsx` | Учитывать `callbackUrl` из query, а не всегда уходить на `/dashboard` |
| 5 | `src/lib/auth/index.ts` | Сохранять Yandex ID и аватар (без изменения логики входа) |
| 6 | Prisma | Новая таблица связей `user_identities` (provider, providerAccountId, userId) |
| 7 | Flarum extension `proektmap/sso` | Провайдер «ProektMap» для `fof/oauth`, авто-вход и выход |
| 8 | `/admin/menu` | Ребёнок «Форум» у `header-community` |
| 9 | `SITE_TREE` + валидатор + `robots.txt` | `/community` как внешний раздел |
| 10 | Страницы контента | Компонент-ссылка «Обсудить в сообществе» |

---

## 8. Риски

### Критические / безопасность

1. **Секреты открытым текстом в `start.sh`.** Там лежат Yandex client secret, ключ DeepSeek, `NEXTAUTH_SECRET` и пароль БД. В Git файл не попадал, но дублирует `.env`. Хуже того, `NEXTAUTH_SECRET` там — читаемая фраза, а не случайная строка. Рекомендация: убрать значения из `start.sh` (читать `.env`), сгенерировать новый `NEXTAUTH_SECRET` (`openssl rand -base64 32`). Побочный эффект: все пользователи разлогинятся один раз. Решение за Алексеем.
2. **Сопоставление только по email и без подтверждения email.** Через форму email/пароль можно зарегистрировать чужой адрес. Если владелец потом зайдёт через Яндекс с тем же email, он попадёт в аккаунт, пароль от которого знает злоумышленник (pre-account takeover). Для форума это значит: identity форума должна опираться на `users.id` ProektMap, а не на email.
3. **Яндекс без email.** Если Яндекс не вернул email, `signIn` ничего не создаёт, но вход разрешается. В сессии остаётся `token.id` = Yandex ID, а не `users.id`. Такому пользователю SSO в форум выдавать нельзя — нужен явный отказ с понятным сообщением.

### Технические

4. **Yandex ID не хранится** → связку «ProektMap ↔ Yandex ↔ Flarum» из ТЗ сейчас построить нельзя. Нужна таблица `user_identities` и заполнение при входе. Существующие 18 яндекс-пользователей допишутся при следующем входе.
5. **`/auth` игнорирует `callbackUrl`** → после входа из форума пользователя унесёт на `/dashboard`, а не обратно в тему.
6. **ISPmanager может перезаписать nginx-конфиг** (рядом лежит `proektmap.ru.conf.ispmanager`, текущий файл от него отличается). Блок `/community` нужно вынести в include-файл и задокументировать.
7. **Общий домен = общие cookie.** Cookie Flarum (`flarum_session`, `flarum_remember`) должны иметь `Path=/community`, чтобы не пересекаться с Next. Cookie NextAuth (`Path=/`) будет приходить и во Flarum — это нормально, Flarum её не читает.
8. **Переход из меню.** Next `<Link>` на `/community` попробует клиентскую навигацию. Для не-Next путей надёжнее обычный `<a>` (проверить в `hub-sidebar` / `mobile-menu` на этапе 9).
9. **Валидатор sitemap** упадёт на `/community` без исключения.
10. **Flarum 2.0 вышел 08.10.2026.** Часть FoF-расширений ещё в beta (`fof/sitemap`, `fof/default-group`) или без 2.x (`fof/spamblock`). Антиспам строим на core-расширениях (`flarum/approval`, `flarum/flags`, `flarum/suspend`) и встроенном throttle.
11. **Composer и CLI PHP 8.1.** Все команды Flarum (`php flarum ...`, composer) запускать через `/opt/php84/bin/php`, иначе установка упадёт.
12. **Нагрузка.** Общий сервер, ~16 Node-процессов. Flarum на PHP-FPM лёгкий, но нужен отдельный FPM-pool с лимитом процессов.

### Продуктовые

13. «Сообщество» сейчас ведёт на `/specialists` (каталог людей). Форум не заменяет его, а встаёт рядом.
14. SMTP-переменные в `.env` есть, но ProektMap сам писем не шлёт (verify только логирует). Работоспособность SMTP для Flarum надо проверить отдельно.

---

## 9. Варианты архитектуры авторизации

### Вариант A. ProektMap как мини-OAuth2-провайдер → Flarum через `fof/oauth` (SSO)

ProektMap получает три эндпоинта для одного доверенного клиента (форума): `authorize` (authorization code + state + PKCE), `token`, `userinfo`. Во Flarum маленькое расширение регистрирует провайдер «ProektMap» через `fof/oauth` `RegisterProvider` (на основе `league/oauth2-client` GenericProvider). Включён режим «только OAuth», пароль остаётся только у админа.

- Если пользователь уже вошёл на ProektMap, `authorize` сразу возвращает code без экранов: один редирект туда-обратно, и он в форуме.
- Если не вошёл → `/auth?callbackUrl=...` → «Войти через Яндекс» → обратно в форум.
- Связь хранит штатная таблица Flarum `login_providers` (`provider='proektmap'`, `identifier=users.id`). Дубликатов нет: идентификатор — UUID ProektMap, не email.
- State/CSRF/повторный callback обрабатывают `fof/oauth` + одноразовый короткоживущий code на стороне ProektMap.
- Авто-вход: расширение при заходе гостя (если есть признак сессии ProektMap) один раз делает тихий редирект на вход через ProektMap, с защитой от зацикливания.
- Logout: выход во Flarum ведёт на `signOut` ProektMap. Выход на ProektMap гасит форумную сессию при следующем запросе (cookie ProektMap пропала → расширение разлогинивает).

### Вариант B. Flarum → Yandex OAuth напрямую (резерв)

Свой провайдер «Яндекс» для `fof/oauth`, отдельный redirect URI в приложении Яндекса.

- Проще в коде ProektMap (ноль изменений), но **это вторая система пользователей**: пользователь заново жмёт «Войти через Яндекс» уже во форуме, авто-входа нет.
- Связь с `users.id` ProektMap не появляется сама: в Flarum лежит Yandex ID, в ProektMap — email. Сопоставлять можно только по email, а это риск №2.
- Выход на сайте и в форуме не связан.

### Вариант C. Flarum читает cookie NextAuth напрямую

PHP расшифровывает JWE NextAuth через общий `NEXTAUTH_SECRET`.

- Хрупко: завязано на внутренний формат next-auth v4 (HKDF + A256GCM), сломается при переходе на Auth.js v5.
- Секрет сессий ProektMap оказывается во втором приложении.
- Не рекомендуется.

---

## RECOMMENDATION

**Рекомендую вариант A: ProektMap — мини-OAuth2-провайдер, Flarum 2.x логинит через `fof/oauth` с собственным провайдером «ProektMap». Адрес — `https://proektmap.ru/community`.**

Почему:

1. **Один пользователь, один вход.** Яндекс-логин остаётся ровно там, где он есть сейчас (NextAuth). Форум доверяет ProektMap, а не Яндексу. Пользователь, уже вошедший на сайт, попадает в форум без второго нажатия — это главный UX-сценарий ТЗ (§21, п. 4). Вариант B его не даёт.
2. **Стабильный ключ без email.** Форум хранит `users.id` (UUID) ProektMap в штатной таблице `login_providers`. Повторный вход, смена имени и смена email не создают дубликатов. Связка с Yandex ID появляется на стороне ProektMap (таблица `user_identities`) и закрывает требование ТЗ «ProektMap ↔ Yandex ↔ Flarum».
3. **Минимум кастомного кода и стандартные механизмы.** State, CSRF, связывание аккаунтов, «только OAuth», группы при регистрации уже есть в стабильном `fof/oauth` 2.0.0. Свой код — одно маленькое расширение Flarum (провайдер + авто-вход/выход) и три небольших route handler в Next.js. Огромного плагина нет.
4. **Не трогает существующий логин.** Вход в ProektMap не меняется. Добавляются: учёт `callbackUrl` на `/auth`, сохранение Yandex ID и аватара при входе, новые эндпоинты. Всё обратно совместимо.
5. **Не меняет инфраструктуру.** Без Docker и поддомена: PHP-FPM 8.4 и MySQL 8 уже работают на сервере. Отдельная БД `proektmap_forum` с отдельным пользователем, БД ProektMap (PostgreSQL) не затрагивается.
6. **Безопасный резерв.** Если вариант A забуксует, вариант B ставится тем же `fof/oauth` с провайдером «Яндекс» без переделки форума.

Обязательные условия для варианта A (войдут в `docs/forum-architecture.md`):

- В SSO отдаём только пользователей, у которых есть `users.id` и email. Пользователь Яндекса без email получает понятный отказ.
- Секрет клиента форума и ключи — только в `.env` обоих приложений, не в Git.
- Code одноразовый, живёт ≤ 60 секунд, привязан к `redirect_uri` из белого списка (`https://proektmap.ru/community/auth/proektmap`) и к PKCE.
- `userinfo` отдаёт минимум: `sub` (= `users.id`), `name`, `email`, `email_verified`, `avatar`.
- До запуска форума отдельно решить риск №1 (секреты в `start.sh`, слабый `NEXTAUTH_SECRET`).

---

## Следующие шаги (по отдельной команде)

1. **Этап 2 — `docs/forum-architecture.md`:** контракт эндпоинтов SSO, схема `user_identities`, nginx-блок, FPM-pool, cookie, logout, роли и права, антиспам, SEO, бэкап и откат.
2. Согласовать с Алексеем: ротацию `NEXTAUTH_SECRET` (разлогин всех один раз), пункт меню «Форум» под «Сообществом», какие страницы получают «Обсудить».
3. **Этап 3 — dev-Flarum:** установить composer, поставить Flarum 2.0.x в отдельный каталог, создать БД `proektmap_forum_dev`, подключить русский язык.
4. **Этапы 4–5:** эндпоинты SSO в Next.js, расширение `proektmap/sso`, таблица `user_identities`, учёт `callbackUrl` на `/auth`.
