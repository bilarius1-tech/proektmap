# AGENT HANDOFF — Reverans

Передача контекста новому агенту. Обновлено: **2026-09-08** (биллинг/пакеты/бэкапы).

## ТХ / что важно сразу

1. Прочитай [START_HERE.md](../START_HERE.md) и блок **Сейчас** в [DEVLOG.md](./DEVLOG.md).  
2. Яндекс + **боевой** ТБанк на VPS — **не коммитить** секреты. Пароль терминала: файл `/var/www/reverans/secrets/tbank_secret` (`TBANK_SECRET_FILE`), не сырой dotenv (`$` ломает Token).  
3. Зачисление: админ **Дети → Зачислить** (ФИО+группа) → код → родитель в ЛК **Привязать**.  
4. Не рефакторить ради красоты; harness зелёный.  
5. Git: `origin` → Cursor Origin `ztim2008/reverans`.

## Что это

**СКХГ «Реверанс»** — веб-платформа студии художественной гимнастики (Москва).  
Владелец: [CLIENT — redacted in Vault].  
Сайт: https://reverans.online  

Роли: `parent` | `admin` | `coach`.

## Состояние продукта

| Зона | Статус |
|------|--------|
| VPS + SSL + Nginx + PM2 | ✅ |
| PostgreSQL + Prisma | ✅ (+ nullable parent / `inviteCode`) |
| Лендинг + CMS (тексты/галерея/SEO/legal) | ✅ |
| Бренд «Реверанс» + Playfair local | ✅ |
| Админка студия + сайт + мобильный shell | ✅ UX: модалки, cards, поиск |
| Смена пароля админа | ✅ `/admin/settings` |
| Регистрация родителя `/register` | ✅ |
| ЛК `/cabinet` (дети, договор, оплата UI) | ✅ + привязка по коду |
| Документы: contract / consent / medical | ✅ подпись + скан медсправки + админ preview |
| Инд. тренировки админ `/admin/trainings` | ✅ |
| Яндекс OAuth | ✅ ключи на VPS |
| ТБанк Init + webhook | ✅ **боевой** терминал; секрет в `secrets/tbank_secret` |
| Два педагога на группу | ✅ |
| PWA «на экран телефона» | ✅ |
| Кабинет педагога | ❌ |
| Онлайн‑касса | ❌ |

Harness: `pass=30 warn=0 fail=0`.

## Куда смотреть в коде

```
/root/projects/reverans/
├── START_HERE.md
├── docs/DEVLOG.md
├── docs/CLIENT_KEYS_YANDEX_TBANK.md   ← отдать клиентке
├── docs/AGENT_HANDOFF.md             ← этот файл
├── web/
│   ├── prisma/schema.prisma
│   ├── src/lib/{auth,tbank,payments,documents,cms}.ts
│   ├── src/app/cabinet/              # ЛК родителя
│   ├── src/app/register/
│   ├── src/app/api/payment/          # Init + webhook
│   ├── src/app/admin/                # студия + site + trainings
│   └── public/fonts/playfair-display/
└── harness/check-service.sh
```

Production: `deploy@159.194.228.226:/var/www/reverans/web` · PM2 `reverans`.

## Доступы (секреты не в git)

| Что | Где |
|-----|-----|
| SSH | `deploy@159.194.228.226` · `/root/.ssh/reverans_deploy_ed25519` · `ssh reverans` |
| Admin | https://reverans.online/login · `ADMIN_EMAIL` (see SECRETS.md) · password in `secrets/admin.env` on VPS only · Yandex OAuth same account |
| DB / NextAuth | `web/.env` на VPS |
| Git | `https://origin.cursor.com/ztim2008/reverans.git` · [codebase](https://cursor.com/codebase/ztim2008/reverans) |

Ожидаемые env (ещё пустые):

```
YANDEX_CLIENT_ID=
YANDEX_CLIENT_SECRET=
TBANK_TERMINAL_KEY=
TBANK_SECRET_KEY=
# TBANK_API_URL=https://securepay.tinkoff.ru/v2
```

Redirect Яндекс: `https://reverans.online/api/auth/callback/yandex`  
Webhook ТБанк: `https://reverans.online/api/payment/webhook`

## Деплой

**Важно:** не использовать `rsync --delete` без exclude `public/uploads/` и `storage/` — иначе сотрутся все загруженные фото.

```bash
cd /root/projects/reverans
./deploy/rsync-web.sh
# опционально удалить устаревший код (uploads всё равно сохранятся):
# ./deploy/rsync-web.sh --delete-code

ssh -i ~/.ssh/reverans_deploy_ed25519 -o IdentitiesOnly=yes deploy@159.194.228.226 'bash -lc "
  export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh
  cd /var/www/reverans/web
  npx prisma db push   # если менялась схема
  NODE_OPTIONS=--max-old-space-size=2048 npm run build
  pm2 restart reverans --update-env
"'
./harness/check-service.sh --quiet
```

Ручной rsync (если без скрипта) — **обязательные** exclude:

```bash
rsync -az -e 'ssh -i ~/.ssh/reverans_deploy_ed25519 -o IdentitiesOnly=yes' \
  --exclude node_modules --exclude .next --exclude .env --exclude '.env.*' \
  --exclude 'public/uploads/' --exclude 'storage/' \
  /root/projects/reverans/web/ deploy@159.194.228.226:/var/www/reverans/web/
```

## Ловушки

1. Два дерева: workspace ≠ production без rsync+build.  
2. Не Vercel/Supabase.  
3. `/tz/` — Nginx alias.  
4. Uploads после `next start` → rewrite на `/api/media`; файлы только в `public/uploads` на VPS.  
5. Секреты только `.env` / `secrets/`.  
6. `ensureCmsSeeded` не перезаписывает существующие секции (`update: {}`).  
7. ТБанк secret — через `TBANK_SECRET_FILE`, иначе `$` в dotenv ломает Token.  
8. После смены schema: `prisma db push --accept-data-loss` на VPS (nullable поля).  
9. **`rsync --delete` без exclude uploads = потеря галереи и CMS-фото.**  
10. Бэкапы: `/var/www/reverans/backups/` (`./deploy/backup-prod.sh`; nightly cron 03:15 UTC). Перед rsync — авто-бэкап.

## Следующая сессия

1. Фидбек Софьи по зачислению / админ UX  
2. Онлайн‑касса / чеки при готовности Т‑Бизнеса  
3. Кабинет педагога  
4. Обновить DEVLOG / handoff
