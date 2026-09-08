# DEVELOPMENT — Reverans

Правила ежедневной разработки для людей и агентов.

## Источники правды

0. `START_HERE.md` + `docs/AGENT_HANDOFF.md` — вход для нового агента  
1. `docs/DEVLOG.md` — текущий день / приоритет / закрытие дня  
2. `docs/DAILY_JOURNAL.md` — дневник работ (запись перед закрытием дня)  
3. `AGENTS.md` — карта проекта и запреты  
4. `tz/outputs/TZ_reverance.md` — продукт  
5. `.cursor/rules/*` — дисциплина агента

## Стек на этом VPS

Next.js 15 · Prisma · PostgreSQL · NextAuth · PM2 · Nginx · harness/loop  

Не Vercel. Секреты только в `web/.env` (не в git).

## Цикл дня

### Старт

1. Прочитать `docs/DEVLOG.md` → блок **Сейчас**  
2. `./harness/check-service.sh --quiet`  
3. Работать только по текущему приоритету (не расползаться)  

### В течение дня

- Маленькие логические коммиты (не «всё подряд»)  
- После UI/API: `cd web && npm run build && pm2 restart reverans --update-env`  
- Не коммитить `.env`, `secrets/`, пароли, ключи  

### Закрытие дня (обязательно)

1. Обновить `docs/DEVLOG.md`: что сделано, что осталось, статус harness, блок **Сейчас**  
2. Дописать день в `docs/DAILY_JOURNAL.md` (шаблон в файле)  
3. `git status` → `git add` → `git commit`  
4. `git push` (remote: Cursor Origin `ztim2008/reverans`)  
5. Короткий отчёт пользователю: hash + remote; логин только если менялся  

Шаблон дня — в DEVLOG и DAILY_JOURNAL.

### Откат

Код откатывается через **git** (коммиты уже на Origin). Отдельные ежедневные «точки отката» не заводим — см. `docs/DAILY_JOURNAL.md` → раздел «Откат». Перед опасными шагами можно поставить `git tag`.

## Deploy

Синхронизация с workspace (не затирать uploads):

```bash
cd /root/projects/reverans
./deploy/rsync-web.sh
```

На VPS:

```bash
cd /var/www/reverans/web
NODE_OPTIONS=--max-old-space-size=2048 npm run build
pm2 restart reverans --update-env
./harness/check-service.sh --quiet
```

`public/uploads/` и `storage/` на проде **не** синхронизировать через `rsync --delete` — там галерея и CMS-фото.

Перед `rsync` скрипт по умолчанию делает бэкап (`BACKUP_BEFORE=0` — пропуск).

## Backups

Каталог **вне** `web/`, чтобы rsync его не трогал:

`/var/www/reverans/backups/` (права `700`, архивы `600`)

| Архив | Содержимое |
|-------|------------|
| `reverans-full-*.tar.gz` | web (с uploads, `.env`), tz, data, `pg_dump` SQL |
| `reverans-workspace-*.tar.gz` | дерево агента (без secrets) |

```bash
./deploy/backup-prod.sh        # сейчас с агента → VPS
./deploy/backup-workspace.sh   # workspace → VPS
```

На VPS: cron `03:15 UTC` → `/var/www/reverans/bin/backup-nightly.sh` (хранить ~14 full).

## Git

- Ветка по умолчанию: `main`  
- Сообщения: кратко, зачем (fix / add / update)  
- Push — только по явной просьбе пользователя **или** как часть процедуры «закрытие дня», если пользователь её запросил  

## Не делать без согласования

UFW enable, отключение root SSH, DROP DATABASE, публичный 5432, коммит секретов, гигантские рефакторы вне приоритета дня.
