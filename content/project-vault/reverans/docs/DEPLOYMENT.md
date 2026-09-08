# DEPLOYMENT — Реверанс (VPS pattern)

## Paths

| | |
|--|--|
| Workspace / git | `/root/projects/reverans` |
| Production app | `/var/www/reverans/web` |
| PM2 | `reverans` · `127.0.0.1:3050` |
| Nginx | vhost `reverans.online` → proxy + `/tz/` alias |
| Backups | `/var/www/reverans/backups/` (outside `web/`) |

## After app changes

```bash
cd /root/projects/reverans
./deploy/rsync-web.sh          # excludes public/uploads + storage
# on VPS:
cd /var/www/reverans/web
NODE_OPTIONS=--max-old-space-size=2048 npm run build
pm2 restart reverans --update-env
./harness/check-service.sh --quiet
```

## Hard rules

- Never rsync `--delete` over uploads/gallery without backup
- Never commit `.env` / `secrets/`
- Prefer `TBANK_SECRET_FILE` over inline secret ( `$` mangling )
- Do not change UFW / ISPmanager without human confirm

## Harness must stay green

- `https://reverans.online/api/health`
- `https://reverans.online/tz/outputs/TZ_reverance.md`
