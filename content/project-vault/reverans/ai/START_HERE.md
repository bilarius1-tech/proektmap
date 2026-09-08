# START HERE — новый агент

Ты в проекте **Reverans** (СКХГ «Реверанс»), сайт https://reverans.online.

## Прочитай по порядку (обязательно)

1. **Этот файл**  
2. [docs/DEVLOG.md](./docs/DEVLOG.md) ← **что делать сейчас**  
3. [docs/AGENT_HANDOFF.md](./docs/AGENT_HANDOFF.md) ← карта, доступы, ловушки  
4. [AGENTS.md](./AGENTS.md)  
5. [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)  
6. По задаче: `tz/outputs/TZ_reverance.md` (+ wireframes / UI kit)

Не начинай код, пока не прочитал пункты 2–3.

## Одной фразой

Коммерческая платформа студии худ. гимнастики: **админка + лендинг + ЛК родителя live**; Яндекс/ТБанк — после ключей клиента. Дизайн вторичен. Инфра — **этот VPS** (не Vercel).

Инструкция клиенту по ключам: [docs/CLIENT_KEYS_YANDEX_TBANK.md](./docs/CLIENT_KEYS_YANDEX_TBANK.md).

## Workspace vs production

| | Путь |
|--|------|
| Cursor / git | `/root/projects/reverans` |
| Production app | `deploy@159.194.228.226:/var/www/reverans/web` |
| Remote git | `https://origin.cursor.com/ztim2008/reverans.git` · [codebase](https://cursor.com/codebase/ztim2008/reverans) |

Правки в `web/` → rsync/scp на VPS → `npm run build` → `pm2 restart reverans --update-env` → `./harness/check-service.sh --quiet`.

## Завтра утром (чеклист агента)

```bash
cd /root/projects/reverans
git pull origin main
cat docs/DEVLOG.md | head -40
./harness/check-service.sh --quiet
```

Дальше — только приоритет из DEVLOG «Сейчас». Если клиент уже прошёл QA — читай фидбек и правь админку; иначе не ломай рабочий `/admin` ради красоты лендинга.
