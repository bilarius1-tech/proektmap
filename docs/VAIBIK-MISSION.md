# Вайбик: Миссия №1 в ProektMap

Источник: VibeCraft-проект `bilarius/vaibik-mission` (zip → `/root/backups/vaibik/`).

## URL

- Меню / старт: https://proektmap.ru/vaibik  
- Квест: https://proektmap.ru/vaibik/quest  
- О миссии: `/vaibik/about` · Контакты: `/vaibik/contacts`

## Где код

- Страницы: `src/app/vaibik/`
- Компоненты: `src/components/vaibik/`
- Логика/аудио Web Speech: `src/lib/vaibik/`
- Картинки: `public/vaibik/assets/`

DynamoDB / VibeCraft-bridge отключены (не нужны на ProektMap).

## Связки

- Статья блога: `/blog/ii-dlya-detey-kak-eto-pomozhet-prodavtsam-na-avito`
- Песочница: карточка «Вайбик: Миссия №1»
- Карта сайта + пункт меню `header-vaibik`

## Голос (MP3)

Уже подключено: реплики с ключами из `quest-lines` играют MP3 из `public/audio/vaibik/`.
Если файла нет — запасной голос браузера (Web Speech).

Перегенерация пакета: `npm run voice:generate` (см. `docs/VAIBIK_AUDIO.md`).
