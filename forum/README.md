# ИИ Форум ProektMap — установка и эксплуатация

Архитектура и безопасность: `docs/forum-architecture.md`.

| Что | Где |
|---|---|
| Flarum 2.0.x | `/var/www/www-root/data/www/proektmap-forum` (вне Git) |
| Веб-корень nginx | `/var/www/www-root/data/www/proektmap-forum-web/community → ../proektmap-forum/public` |
| Расширение SSO | `forum/extensions/proektmap-sso` (в Git, подключено composer path-репозиторием, симлинк) |
| nginx | `/etc/nginx/proektmap/community.conf`, `community-gate.conf`, `site-auth-limits.conf`; зоны и `map` — `/etc/nginx/conf.d/proektmap-community-zones.conf` |
| Тема | `forum/theme/` (LESS, шапка, подвал) → `forum/theme/apply-theme.sh` |
| PHP | `/opt/php84/bin/php`, FPM-пул `proektmap.ru` (`/var/www/php-fpm/26.sock`, пользователь `www-root`) |
| БД | MySQL 8, `proektmap_forum` / пользователь `proektmap_forum@localhost` |
| Секреты | `/root/.secrets/proektmap-forum.env` (600), `config.php` форума (640) |
| Бэкапы | `/root/backups/forum/`, cron 03:30, 14 дней |

Системный `php` на сервере — 8.1 и Flarum 2 не подходит. Все команды — через `/opt/php84/bin/php` и `composer84`.

---

## Команды на каждый день

```bash
cd /var/www/www-root/data/www/proektmap-forum
sudo -u www-root /opt/php84/bin/php -d memory_limit=1G flarum cache:clear   # после правок расширения или настроек в БД
sudo -u www-root /opt/php84/bin/php flarum migrate          # после обновления пакетов
sudo -u www-root /opt/php84/bin/php flarum info             # версии и включённые расширения
tail -f storage/logs/flarum-$(date +%F).log                 # ошибки форума и письма (пока mail_driver=log)
```

`cache:clear` пересобирает LESS темы: со стандартными 128 МБ компилятор падает по памяти. Поэтому `-d memory_limit=1G` в CLI и `php_admin_value[memory_limit] = 512M` в `/opt/php84/etc/php-fpm.d/site.d/proektmap.ru.conf` (пересборка из админки).

Тема — правка файлов в `forum/theme/`, затем:

```bash
/var/www/www-root/data/www/proektmap.ru/forum/theme/apply-theme.sh
```

Почта: пока `SMTP_PASS` в `.env` ProektMap пустой, форум пишет письма в лог (`mail_driver=log`). Подключение: пароль приложения Яндекса → `SMTP_PASS` в `.env` → `forum/scripts/configure-mail.sh`. Письма уходят через очередь в БД (`config.php` → `queue.driver=database`), её разбирает `flarum schedule:run` из cron root раз в минуту — ответ на форуме не ждёт SMTP. Хвост очереди: таблицы `queue_jobs`, `queue_failed_jobs`.

Уведомления по умолчанию (для тех, кто не менял настройки; задано в `proektmap-sso`): подписка на свои темы и темы, где ответил; письмо о новом ответе в подписанной теме и при упоминании.

Ссылка `/community/?compose=1` открывает окно новой темы (кнопка «Создать тему» на главной сайта).

Проверка SSO целиком (вход, повторный вход, выход):

```bash
/var/www/www-root/data/www/proektmap.ru/forum/scripts/e2e-sso.sh
```

Тесты расширения:

```bash
cd /var/www/www-root/data/www/proektmap.ru/forum/extensions/proektmap-sso
/opt/php84/bin/php /tmp/phpunit-11.phar        # phar: curl -fsSL -o /tmp/phpunit-11.phar https://phar.phpunit.de/phpunit-11.phar
```

---

## Установка с нуля (production)

1. Composer под PHP 8.4 (`/usr/local/bin/composer84` — обёртка над `composer.phar`).
2. База:
   ```sql
   CREATE DATABASE proektmap_forum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'proektmap_forum'@'localhost' IDENTIFIED BY '<пароль>';
   GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,ALTER,INDEX,DROP,REFERENCES,LOCK TABLES,CREATE TEMPORARY TABLES
     ON proektmap_forum.* TO 'proektmap_forum'@'localhost';
   ```
3. Flarum:
   ```bash
   cd /var/www/www-root/data/www
   sudo -u www-root -H composer84 create-project flarum/flarum:^2.0 proektmap-forum
   cd proektmap-forum
   sudo -u www-root /opt/php84/bin/php flarum install -f install.json   # baseUrl https://proektmap.ru/community; файл удалить после
   chmod 640 config.php
   sudo -u www-root -H composer84 require flarum-lang/russian:^2.0 fof/oauth:^2.0
   sudo -u www-root -H composer84 config repositories.proektmap-sso \
     '{"type":"path","url":"/var/www/www-root/data/www/proektmap.ru/forum/extensions/proektmap-sso","options":{"symlink":true}}'
   sudo -u www-root -H composer84 require "proektmap/sso:*@dev"
   for e in flarum-nicknames flarum-lang-russian fof-oauth proektmap-sso; do
     sudo -u www-root /opt/php84/bin/php flarum extension:enable $e
   done
   ```
4. В `config.php` добавить блок (секрет = `COMMUNITY_OAUTH_CLIENT_SECRET` из `.env` ProektMap):
   ```php
   'proektmap_sso' => [
     'client_id' => 'proektmap-forum',
     'client_secret' => '<64 hex>',
     'authorize_url' => 'https://proektmap.ru/api/community/oauth/authorize',
     'token_url' => 'http://127.0.0.1:3030/api/community/oauth/token',
     'userinfo_url' => 'http://127.0.0.1:3030/api/community/oauth/userinfo',
     'site_url' => 'https://proektmap.ru',
   ],
   ```
5. Настройки (таблица `settings`): `default_locale=ru`, `fof-oauth.proektmap=1`, `fof-oauth.oauth_only=1`, `fof-oauth.log-oauth-errors=0`, `display_name_driver=nickname`, `theme_primary_color=#0FB880`.
6. nginx: скопировать `forum/deploy/nginx/*` в `/etc/nginx/proektmap/` и `conf.d/`, в vhost `proektmap.ru` перед `location /` добавить `include /etc/nginx/proektmap/community.conf;`, затем `nginx -t && nginx -s reload`.
7. ProektMap `.env`: `COMMUNITY_OAUTH_*` (см. `.env.example`), `npx prisma db push`, сборка, `pm2 restart proektmap`.

ISPmanager может перегенерировать vhost (рядом лежит `proektmap.ru.conf.ispmanager`). После правок домена в панели проверить, что строка `include /etc/nginx/proektmap/community.conf;` на месте.

## Development

Отдельный dev-форум ставится так же, с базой `proektmap_forum_dev` и `baseUrl` dev-адреса. В `config.php` dev-форума — свой `client_id`/секрет и `redirect_uri`, а на стороне ProektMap — dev-инстанс Next.js с теми же значениями в `.env.local`. Продовый секрет в dev не копировать.

---

## Открыт для всех (с 19.10.2026)

- nginx: `community-gate.conf` = копия `forum/deploy/nginx/community-gate.open.conf` (без пароля).
- `.env` ProektMap: `COMMUNITY_PUBLIC=1` — в статьях блога «Обсудить на ИИ Форуме».
- Меню: `header-community-forum` «ИИ Форум» → `/community`, ребёнок «Сообщества».
- `public/robots.txt`: служебные пути форума закрыты, `Sitemap: /community/sitemap.xml`.
- `SITE_TREE`: `/community` (исключение `EXTERNAL_APP_ROUTES` в `scripts/validate-sitemap.ts`).
- Главная сайта: блок «Сейчас на ИИ Форуме» — 5 последних тем из публичного API форума (`src/lib/community/latest.ts`, кеш 5 минут, таймаут 2,5 с; форум недоступен — блок скрыт).
- Шапка форума: кнопка «На главную сайта» (`forum/extensions/proektmap-sso/js/dist/forum.js`, пишется вручную, без сборщика; после правки — `cache:clear`).

Закрыть обратно на бету: `cp forum/deploy/nginx/community-gate.conf /etc/nginx/proektmap/ && nginx -t && systemctl reload nginx`, `COMMUNITY_PUBLIC=0` и перезапуск.

## Модерация и антиспам

- Flarum: не чаще одного поста в 10 секунд (429).
- Участник моложе 24 часов (`NewcomerPolicy`): максимум 3 темы и 20 ответов в час (429). Пост с внешней ссылкой (не proektmap.ru) уходит на одобрение — флаг «Новый участник, внешняя ссылка» в очереди модератора.
- Сайт: `/api/auth/register` и `/api/auth/verify` — 5 запросов в минуту с IP (+5 всплеск), nginx `site-auth-limits.conf`.
- Модераторов назначает админ: профиль пользователя → группы → «Модератор».

---

## Бэкап

```bash
/var/www/www-root/data/www/proektmap.ru/forum/scripts/backup-forum.sh
ls -la /root/backups/forum/
```

## Восстановление

```bash
gunzip -c /root/backups/forum/proektmap_forum-<STAMP>.sql.gz | mysql proektmap_forum
tar -xzf /root/backups/forum/proektmap_forum-files-<STAMP>.tar.gz -C /var/www/www-root/data/www/proektmap-forum
sudo -u www-root /opt/php84/bin/php -d memory_limit=1G /var/www/www-root/data/www/proektmap-forum/flarum cache:clear
```

## Откат (rollback)

| Ситуация | Действие |
|---|---|
| Форум сломался, сайт работает | В vhost закомментировать `include /etc/nginx/proektmap/community.conf;`, `nginx -s reload`. `/community` уйдёт в Next.js (404), сайт не задет |
| Сломалось обновление пакетов | `composer.json`/`composer.lock` из бэкапа файлов → `composer84 install` → `flarum migrate` → `cache:clear` |
| Нужно отключить SSO | `UPDATE settings SET value='0' WHERE \`key\`='fof-oauth.proektmap';` + `cache:clear`. Или убрать `COMMUNITY_OAUTH_CLIENT_SECRET` из `.env` ProektMap и перезапустить — эндпоинты ответят 503 |
| Откат кода ProektMap | `git revert` коммита форума на `main`, выровнять `master`, сборка, `pm2 restart`. Таблицы `user_identities` и `community_oauth_codes` безопасно оставить |
| Полный откат БД ProektMap | Дамп до интеграции: `/root/backups/proektmap-before-forum-20261019-0549.dump` (`pg_restore` внутри контейнера `leads-pg`) |
