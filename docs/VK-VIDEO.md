# VK Video на ProektMap

Каналы Алексея попадают на сайт как хаб `/video` и виджет «Последние уроки» на главной.

- https://vkvideo.ru/@craftum_design  
- https://vkvideo.ru/@club240887610  

Синк: VK API → таблица `vk_videos` → страницы читают БД (без HTML-парсинга).

---

## Как получить VK_SERVICE_TOKEN

### 1. Создать приложение

1. Открой [dev.vk.com](https://dev.vk.com/) / [vk.com/apps?act=manage](https://vk.com/apps?act=manage)  
2. **Создать** → тип **Standalone-приложение** (или «Веб-сайт»)  
3. Заполни название, например `ProektMap Video Sync`  
4. В настройках приложения скопируй **ID приложения** (`client_id`)

### 2. Получить service token (сервисный ключ)

Для публичных видео сообществ обычно достаточно **сервисного ключа доступа**:

1. В карточке приложения открой **Настройки**  
2. Раздел **Сервисный ключ доступа** / Service access key  
3. Скопируй ключ  

Альтернатива (если сервисного ключа нет в интерфейсе):

```
https://oauth.vk.com/authorize?client_id=APP_ID&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=video,offline&response_type=token&v=5.199
```

- Замени `APP_ID` на ID приложения  
- Открой ссылку под своим аккаунтом (админ каналов)  
- После редиректа в адресе будет `access_token=...` — скопируй до `&`  
- `scope=video,offline` — доступ к video и долгий токен  

> Токен — секрет. Не коммить в git, не светить в Telegram.

### 3. Прописать на сервере

В `/var/www/www-root/data/www/proektmap.ru/.env`:

```bash
VK_SERVICE_TOKEN=сюда_токен
```

Перезапуск приложения (чтобы Next подхватил env):

```bash
cd /var/www/www-root/data/www/proektmap.ru
pm2 restart proektmap --update-env
```

### 4. Первый синк

```bash
cd /var/www/www-root/data/www/proektmap.ru
npx tsx --env-file=.env scripts/sync-vk-video.ts
```

Или (под admin-сессией / cron secret):

```bash
curl -X POST https://proektmap.ru/api/vk-video/sync \
  -H "x-cron-secret: $CRON_SECRET"
```

Ожидание: JSON с `totalUpserted > 0` и без `error` по каналам.

### 5. Cron (уже есть обёртка)

Скрипт: `scripts/vk-video-sync-wrapper.sh`  
Рекомендуемый crontab (раз в час):

```cron
15 * * * * /bin/bash /var/www/www-root/data/www/proektmap.ru/scripts/vk-video-sync-wrapper.sh
```

Лог: `/var/log/proektmap-vk-video-sync.log`

---

## Права и типичные ошибки

| Ошибка | Что сделать |
|--------|-------------|
| `VK_SERVICE_TOKEN не задан` | Добавь в `.env`, `pm2 restart --update-env` |
| `Access denied` / code 15 | Нужен токен с scope `video` или сервисный ключ приложения |
| Пустой список | Видео приватные / канал другой screen name — проверь URL |
| `utils.resolveScreenName` fail | Сервисный ключ часто не умеет этот метод — задай `communityId` в `channels.ts` (для Craftum: `219351616`) |

Видео должны быть **доступны без закрытой стены** для API.

---

## Что видит пользователь

- `/video` — каталог, фильтр по каналу, превью, встроенный плеер VK, ссылка «Открыть в VK»  
- Главная — блок «Последние уроки» (до 4 роликов)  
- CTA на `/resheniya/premium-landing` и `/ai-skills`  
- Пример плохо→хорошо: урок без маршрута vs урок + готовое решение  

Меню: пункт `header-video` через `scripts/sync-header-menu.ts`.
