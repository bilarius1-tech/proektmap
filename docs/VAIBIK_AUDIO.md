# Локальная озвучка Вайбика

## Где лежат файлы

- игровые MP3: `public/audio/vaibik/<audio-id>.mp3`;
- тестовые MP3: `public/audio/vaibik/test/TEST_01.mp3` … `TEST_05.mp3`;
- manifest: `src/lib/audio/vaibik-audio-manifest.json`;
- типизированный API ID: `src/lib/audio/vaibik-audio.ts`;
- AudioManager: `src/lib/audio/vaibik-audio-manager.ts`;
- элементы mute, volume и субтитров: `src/components/quest/vaibik-voice.tsx`.

Имя игрового файла всегда равно ID: `lab.intro.greet` превращается только в
`/audio/vaibik/lab.intro.greet.mp3`.

## Команды

```bash
npm run voice:test       # установить локальный Piper и создать 5 тестовых MP3
npm run voice:generate   # создать полный пакет из VAIBIK_VOICE_SCRIPT.txt
npm run voice:check      # проверить manifest, файлы и динамические комбинации
```

При первом запуске генератор создаёт игнорируемые Git каталоги `.voice-venv`
и `.voice-cache`, устанавливает Piper и скачивает русскую модель
`ru_RU-denis-medium`. Синтез выполняется локально. Сеть нужна только один раз
для установки инструмента и модели; во время игры внешние TTS API не
вызываются.

## Исходный сценарий

Положите `VAIBIK_VOICE_SCRIPT.txt` (поддерживается и исходное имя
`VAIBIK_REPLIQUES.txt`) в корень проекта. Для каждой реплики
должен присутствовать ID из manifest и текст после него:

```text
lab.intro.greet
«Текст из утверждённого сценария»
```

Допустима запись в одну строку:

```text
lab.intro.greet: «Текст из утверждённого сценария»
```

Если хотя бы одного текста нет, генератор останавливается и печатает ID. Он
не выдумывает отсутствующие реплики и не создаёт частичный пакет.

## Как добавить реплику

1. Добавьте `new.line.id` и путь `/audio/vaibik/new.line.id.mp3` в manifest.
2. Добавьте тот же ID и утверждённый текст в `VAIBIK_VOICE_SCRIPT.txt`.
3. Запустите `npm run voice:generate`.
4. Запустите `npm run voice:check`.
5. В квесте вызывайте `vaibikAudioManager.playVoice(id, LINE_TEXT[id])`.

Текст передаётся из существующего `LINE_TEXT`, поэтому AudioManager не
создаёт второй источник сценария. Субтитр удаляется по событию `ended`.

## Динамические варианты

Используйте готовые методы, а не склеивайте пути в компонентах:

```ts
vaibikAudioManager.playLabActionPrompt(theme, subtitle);
vaibikAudioManager.playLabDone(theme, action, subtitle);
vaibikAudioManager.playIterationPlay(item, subtitle);
```

Новый вариант сначала добавляется в типы и manifest, затем — в сценарий.
`voice:check` проверяет все комбинации `theme × action` и варианты предметов.

## AudioManager и интерфейс

AudioManager хранит один экземпляр `HTMLAudioElement`. Новая реплика
останавливает предыдущую. Поддерживаются play, stop, pause, resume, mute,
volume, проверка состояния и точечный preload. Ошибка файла или блокировка
autoplay не ломает квест.

`VaibikVoiceControls` хранит mute и громкость в `localStorage` под ключами
`vaibik_voice_muted` и `vaibik_voice_volume`. `VaibikSubtitle` показывает
переданный текст только во время реплики. Хук `useVaibikVoice` отдаёт
`characterState: "talking" | "idle"` для минимальной связи с анимацией.

## Как поменять голос

Замените модель и ссылки в `scripts/vaibik-voice/setup.sh`, удалите
`.voice-cache/piper` и повторите генерацию. Параметры темпа и пауз находятся
в `scripts/vaibik-voice/generate.py`. Музыка и звуковые эффекты в голосовые
файлы не добавляются.

Короткие MP3 должны храниться в обычном Git. Каталог `public/audio` не
исключён через `.gitignore`; Git LFS для такого пакета не требуется, пока
общий размер остаётся небольшим.
