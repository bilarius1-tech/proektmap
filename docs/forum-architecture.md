# Архитектура: ИИ Форум ProektMap (Flarum 2.x + SSO)

Версия 1.0 · 19.10.2026 · Этап 2 ТЗ. Аудит: `docs/forum-integration-audit.md`. Эксплуатация: `forum/README.md`.

Статус: **staging** — форум работает на `https://proektmap.ru/community` под паролем беты, ссылки с сайта выключены (`COMMUNITY_PUBLIC=0`).

---

## 1. Схема

```
Пользователь
   │  уже вошёл на ProektMap (NextAuth, Яндекс ID или email)
   ▼
https://proektmap.ru/community  ── nginx ──► PHP-FPM 8.4 ──► Flarum 2.0.x (MySQL proektmap_forum)
   │  гость + /api/auth/session отдаёт user → авто-вход (скрипт расширения)
   ▼
/community/auth/proektmap            (fof/oauth: state + PKCE S256)
   ▼ 302
/api/community/oauth/authorize       (Next.js: проверяет client_id, redirect_uri, сессию)
   │  нет сессии → /auth?callbackUrl=…&from=community → Яндекс → обратно сюда
   ▼ 302 ?code&state
/community/auth/proektmap            (fof/oauth проверяет state)
   │  сервер-сервер по 127.0.0.1:3030:
   │    POST /api/community/oauth/token     (client_secret + code + code_verifier)
   │    GET  /api/community/oauth/userinfo  (Bearer, 5 минут)
   ▼
Flarum: login_providers(provider=proektmap, identifier=users.id) → вход
        нет связи → авто-регистрация без окна (AutoRegisterResponseFactory)
```

ProektMap — единственный поставщик личности. Форум не ходит в Яндекс и не видит его токенов.

---

## 2. Компоненты и файлы

| Где | Что |
|---|---|
| `src/app/api/community/oauth/authorize/route.ts` | Выдаёт одноразовый code (60 с, в БД только sha256) |
| `src/app/api/community/oauth/token/route.ts` | Обмен code → access token. Проверка секрета клиента, PKCE, атомарное гашение кода |
| `src/app/api/community/oauth/userinfo/route.ts` | `sub, name, preferred_username, email, email_verified, picture` |
| `src/lib/community/oauth.ts` | PKCE, HMAC-токен, конфиг из env, username-транслит |
| `src/lib/community/oauth-client.ts` | `safeCallbackPath` для `/auth` (защита от open redirect) |
| `src/lib/community/config.ts` | Имя «ИИ Форум», `COMMUNITY_PUBLIC`, URL тега материалов |
| `src/lib/auth/index.ts` | Вход через Яндекс пишет `user_identities`, аватар, подтверждение email |
| `src/app/auth/page.tsx` | Учитывает `callbackUrl`, показывает ошибки входа |
| `src/components/community/discuss-link.tsx` | Блок «Обсудить на ИИ Форуме» в статье блога |
| `forum/extensions/proektmap-sso/` | Flarum-расширение `proektmap/sso` |
| `forum/deploy/nginx/` | Конфиги nginx |
| `forum/scripts/` | `backup-forum.sh`, `e2e-sso.sh` |
| `/var/www/www-root/data/www/proektmap-forum/` | Установка Flarum (вне Git) |

### Расширение `proektmap/sso`

| Класс | Роль |
|---|---|
| `ProektMapProvider` | Провайдер для `fof/oauth` (league GenericProvider, PKCE). Доверяет email только при `email_verified` |
| `AutoRegisterResponseFactory` | Новый пользователь из ProektMap создаётся сразу, без окна регистрации. При ошибке — стандартное окно Flarum |
| `AutoLoginScript` | Гость + есть сессия ProektMap → тихий SSO. Не чаще раза в 10 минут на вкладку |
| `SyncProektMapSession` | Выход на сайте гасит сессию форума. Выход на форуме гасит cookie сайта. Отказ SSO не зацикливает вход |
| `SyncNickname` | Имя на ProektMap → nickname на форуме при каждом входе |
| `SsoConfig` | Ключи из `PROEKTMAP_SSO_*` env или блока `proektmap_sso` в `config.php` |
| `Antispam\NewcomerThrottler` | Аккаунт моложе 24 ч: 3 темы и 20 ответов в час, сверх — 429 |
| `Antispam\HoldNewcomerLinks` | Пост новичка с внешней ссылкой → неодобрен + флаг `approval` (очередь модератора) |
| `Seo\DiscussionMeta` | `description` из первого поста, Open Graph, картинка — `/api/og` сайта |
| `Seo\SitemapController` | `/community/sitemap.xml`: главная, теги, темы, видимые гостю |

---

## 3. Сопоставление пользователей

```
ProektMap users.id (UUID)  ◄── user_identities(provider=yandex, providerAccountId=Yandex ID)
        │
        └──► Flarum login_providers(provider=proektmap, identifier=users.id) ──► Flarum users.id
```

- Ключ форума — `users.id` ProektMap. Email не ключ: смена email или имени не создаёт дубликат.
- `user_identities` заполняется при каждом входе через Яндекс. Старые пользователи получат запись при следующем входе.
- Пользователь сменил основной email в Яндексе → тот же аккаунт ProektMap (по Yandex ID), email обновляется, если адрес свободен.
- Первый вход через Яндекс в аккаунт, созданный по паролю без подтверждения почты, сбрасывает этот пароль: его мог задать не владелец почты.
- Вход через Яндекс без email запрещён (`/auth?error=YandexNoEmail`): иначе сессия получала бы Yandex ID вместо `users.id`.
- Существующий пользователь форума с тем же **подтверждённым** email привязывается автоматически (так связан админ). Неподтверждённый email к чужому аккаунту не привязывается.

---

## 4. Безопасность

| Требование | Как закрыто |
|---|---|
| HTTPS | nginx, Let's Encrypt. Обмен токенами — только loopback `127.0.0.1:3030` |
| OAuth state / CSRF | `fof/oauth`: state в кеше сессии, `hash_equals`. Подделка → 401 |
| PKCE | S256, verifier хранит форум, challenge — ProektMap |
| redirect_uri | Белый список из одного адреса. Чужой → 400 без редиректа |
| Повтор callback / code | Код одноразовый (`updateMany … usedAt: null`), 60 секунд. Повтор → `invalid_grant` |
| Секрет клиента | 64 hex, `.env` ProektMap и `config.php` форума (640), не в Git, не в БД форума |
| Access token | HMAC-SHA256, 5 минут, только для userinfo. Не хранится |
| Пароли | Не передаются. Форум в режиме «только OAuth», пароль — только у админа |
| Open redirect | `safeCallbackPath` на `/auth`, `isSafeReturnPath` в `fof/oauth` |
| XSS | Форматтер Flarum экранирует HTML (проверено: `<script>` → текст) |
| Rate limit | nginx `pm_community_auth` 30/мин на вход; `pm_site_register` 5/мин на регистрацию и подтверждение email сайта; Flarum: пост раз в 10 с; новички — 3 темы и 20 ответов в час |
| Подтверждение email сайта | `POST /api/auth/verify` больше не отдаёт ссылку в ответе (иначе любой «подтверждал» чужой адрес, а форум доверяет `email_verified`) |
| `NEXTAUTH_SECRET` | Сменён 19.10.2026, живёт только в `.env`. PM2 пересоздан с чистым окружением, `start.sh` без секретов |
| Cookie | Flarum `Path=/community`, NextAuth `Path=/` — не пересекаются |
| Логи | В логах нет кодов и токенов. `fof-oauth.log-oauth-errors=0`: иначе пишет cookie |
| Индексация служебного | `X-Robots-Tag: noindex` (nginx `map`) на admin, api, auth, settings, notifications, logout + `robots.txt` |

---

## 5. Данные

- ProektMap: PostgreSQL 16 (Docker `leads-pg`, порт 5433), новые таблицы `user_identities`, `community_oauth_codes`.
- Форум: MySQL 8, база `proektmap_forum`, пользователь `proektmap_forum@localhost` только на эту базу (без SUPER/FILE/GRANT).
- Секреты форума: `/root/.secrets/proektmap-forum.env` (600): пароль БД, админ, бета-пароль, тестовый пользователь.

---

## 6. Роли

| Группа | Права |
|---|---|
| Администратор | Всё, вход по паролю на `/community/admin` |
| Модератор | Скрытие/удаление сообщений, закрытие и переименование тем, теги, закрепление, жалобы, блокировка |
| Участник | Темы, ответы, правка своих сообщений, лайки, жалобы |
| Гость | Чтение |

Модераторов назначает админ в профиле пользователя → группы.

---

## 7. Решения и почему

1. **ProektMap как мини-OAuth2-провайдер, а не Flarum → Яндекс.** Один вход, авто-вход в форум, ключ `users.id` без привязки к email.
2. **MySQL, а не PostgreSQL ProektMap.** В PHP 8.4 на сервере нет `pdo_pgsql`, расширения Flarum тестируются на MySQL. База ProektMap не затрагивается.
3. **Без Docker.** Инфраструктура сервера — PM2 + nginx + ISPmanager PHP-FPM. Flarum встал в существующий FPM-пул `proektmap.ru`.
4. **`/community` на основном домене.** Маршрут в Next.js свободен, nginx отдаёт путь в PHP раньше `location /`.
5. **Авто-регистрация вместо окна Flarum.** Человек уже зарегистрирован на ProektMap — ТЗ запрещает второй шаг регистрации.
6. **Скрипт авто-входа проверяет `/api/auth/session`, а не наличие cookie.** Просроченная cookie не должна уводить гостя на страницу входа.

---

## 8. Что не закрыто и следующие шаги

Сделано 19.10.2026: тема (этап 6), модерация и антиспам (этап 8), открытие (этап 11).

- **SMTP.** В `.env` ProektMap пустой `SMTP_PASS`, письма форума пишутся в лог. Нужен пароль приложения Яндекса или ящик `noreply@proektmap.ru` → `forum/scripts/configure-mail.sh`. Без почты не уходят только письма-уведомления; уведомления на сайте работают.
- **Подтверждение email на сайте** не отправляет писем вообще (ссылка только в логе PM2). Пользователи с паролем без подтверждения получают на форуме неподтверждённый email. Решается тем же SMTP.
- **Единичный 504** при создании темы (19.10, запрос шёл 72 с, повторить не удалось). Если повторится — смотреть `flarum-*.log` и nginx `error.log` по времени.
