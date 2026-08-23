import type { GuidedReference, GuidedSolution } from "./guided-data";

const ref = (
  kind: GuidedReference["kind"],
  label: string,
  href: string,
  description: string,
): GuidedReference => ({ kind, label, href, description });

const cursorRef = ref("Инструмент", "Cursor", "/ai-tools/cursor", "AI-редактор для выполнения маршрута");
const grammyRef = ref("Инструмент", "grammY", "/ai-tools/grammy", "TypeScript-фреймворк для Telegram Bot API");
const botFatherRef = ref("Инструмент", "BotFather", "/ai-tools/botfather", "Официальный бот Telegram для регистрации ботов");
const modelsRef = ref("Модель", "Рейтинг AI-моделей", "/models?sort=code", "Актуальные модели для кода и проверки");
const skillsRef = ref("Skill", "Skills ProektMap", "/skills", "Готовые процедуры для AI-агента");
const patternsRef = ref("Паттерн", "Паттерны сборки", "/patterns", "Проверенные инженерные решения");
const promptsRef = ref("Промпты", "Библиотека промптов", "/prompts", "Готовые промпты для разработки");
const glossaryRef = ref("Термин", "Глоссарий Telegram-разработки", "/glossary", "Bot API, polling, токены и другие термины");

export const guidedTelegramSolution: GuidedSolution = {
  slug: "telegram-bot",
  title: "Запустить Telegram-бота",
  subtitle: "Готовый маршрут до работающей команды /start",
  result: "Публичный Telegram-бот работает на VPS: отвечает на /start и /help, переживает перезапуск сервера, а токен не попадает в Git.",
  duration: "1–3 дня",
  defaultStack: [
    "Cursor",
    "Node.js + TypeScript",
    "grammY",
    "long polling",
    "dotenv",
    "GitHub",
    "VPS + PM2",
  ],
  steps: [
    {
      slug: "workspace",
      shortTitle: "Рабочее место",
      title: "Проверяем рабочее место",
      duration: "10–20 минут",
      goal: "Cursor, Node.js, npm, Git и GitHub CLI готовы к созданию бота.",
      recommendation: {
        title: "Собираем бота локально в Cursor",
        why: "Так проще увидеть ошибки, проверить команды и только после рабочего ответа переносить проект на сервер.",
        link: cursorRef,
      },
      explanation: "На этом шаге ничего не проектируем. Проверяем инструменты и один раз авторизуем GitHub CLI, чтобы следующая команда создала приватный репозиторий.",
      instructions: [
        {
          title: "Откройте терминал Cursor",
          text: "Откройте пустую рабочую папку и запустите встроенный терминал.",
        },
        {
          title: "Проверьте установку",
          text: "Команда должна вывести версии Node.js, npm, Git и GitHub CLI без ошибок.",
          command: "node --version && npm --version && git --version && gh --version",
        },
        {
          title: "Установите GitHub CLI, если команда gh не найдена",
          text: "Для основного маршрута Windows 11 используйте winget, затем перезапустите терминал Cursor.",
          command: "winget install --id GitHub.cli",
        },
        {
          title: "Авторизуйте GitHub CLI",
          text: "Выберите GitHub.com → HTTPS → Login with a web browser и завершите вход.",
          command: "gh auth login && gh auth status",
        },
      ],
      success: [
        "Node.js, npm, Git и gh выводят номера версий",
        "gh auth status подтверждает вход в GitHub",
        "Cursor открыт в отдельной пустой папке",
      ],
      artifact: "Готовое локальное окружение",
      terms: ["Cursor", "Node.js", "npm", "Git", "GitHub CLI", "терминал"],
      references: [cursorRef, glossaryRef],
    },
    {
      slug: "models",
      shortTitle: "AI-модели",
      title: "Подключаем модели для кода и проверки",
      duration: "10–15 минут",
      goal: "В Cursor доступны основная coding-модель и отдельная reasoning-модель для проверки.",
      recommendation: {
        title: "Разделяем написание кода и инженерную проверку",
        why: "Одна модель быстро собирает проект, другая независимо ищет ошибки в токенах, обработчиках и деплое.",
        link: modelsRef,
      },
      explanation: "Названия моделей меняются, поэтому ProektMap показывает актуальные рекомендации из живого рейтинга, а роли остаются постоянными.",
      instructions: [
        {
          title: "Подключите coding-модель",
          text: "Откройте настройки Models в Cursor и включите первую модель из рекомендации ниже.",
        },
        {
          title: "Подключите проверяющую модель",
          text: "Добавьте reasoning-модель и используйте её перед деплоем.",
        },
      ],
      prompt: {
        title: "Правило для AI-агента",
        body: `Работаем над Telegram-ботом на Node.js, TypeScript и grammY.
Основной режим — long polling, один процесс PM2.
Секреты читаем только из переменных окружения.
Не выводи BOT_TOKEN в код, логи, ответы или Git.
После изменений запускай typecheck и указывай точную команду проверки.`,
      },
      success: [
        "В Cursor включена модель для написания кода",
        "Доступна отдельная модель для архитектуры и проверки",
      ],
      artifact: "Готовый набор AI-моделей",
      terms: ["AI-модель", "coding-модель", "reasoning-модель", "контекст"],
      references: [modelsRef, cursorRef, skillsRef],
    },
    {
      slug: "github",
      shortTitle: "GitHub",
      title: "Создаём приватный репозиторий",
      duration: "10–20 минут",
      goal: "На компьютере создана папка проекта, связанная с приватным GitHub-репозиторием.",
      recommendation: {
        title: "Храним код в приватном GitHub",
        why: "GitHub даёт историю изменений и позволяет безопасно забрать проект на VPS. Токен бота при этом остаётся только в .env.",
      },
      explanation: "Создаём готовое место для кода. Команда ниже сразу создаст приватный репозиторий и скачает его.",
      instructions: [
        {
          title: "Создайте репозиторий",
          text: "Используйте готовое имя my-telegram-bot — оно понадобится в команде деплоя.",
          command: "gh repo create my-telegram-bot --private --clone && cd my-telegram-bot",
        },
        {
          title: "Закройте секреты от Git",
          text: "Сразу добавьте .env в .gitignore до получения токена.",
          command: "printf \".env\\nnode_modules\\ndist\\n\" > .gitignore",
        },
      ],
      success: [
        "Репозиторий отображается на GitHub как Private",
        "В локальной папке есть .gitignore со строкой .env",
      ],
      artifact: "Приватный репозиторий Telegram-бота",
      terms: ["GitHub", "репозиторий", "Git", ".gitignore", ".env"],
      references: [glossaryRef, cursorRef],
    },
    {
      slug: "botfather",
      shortTitle: "BotFather",
      title: "Регистрируем бота в Telegram",
      duration: "10–15 минут",
      goal: "BotFather создал публичный @username и выдал BOT_TOKEN, сохранённый только локально.",
      recommendation: {
        title: "Используем официальный @BotFather",
        why: "Только BotFather регистрирует Telegram-ботов и выдаёт токен доступа к Bot API.",
        link: botFatherRef,
      },
      explanation: "Токен работает как пароль. Не отправляйте его AI-модели, не вставляйте в код и не публикуйте в GitHub.",
      instructions: [
        {
          title: "Создайте бота",
          text: "Откройте @BotFather, отправьте /newbot, задайте отображаемое имя и уникальный username с окончанием bot.",
        },
        {
          title: "Подготовьте файл окружения",
          text: "Создайте безопасный локальный файл из шаблона, затем вставьте токен после BOT_TOKEN=.",
          command: "printf \"BOT_TOKEN=\\n\" > .env.example && cp .env.example .env",
        },
      ],
      prompt: {
        title: "Проверка хранения секрета",
        body: `Проверь проект как security reviewer.
Убедись, что .env добавлен в .gitignore до первого commit.
BOT_TOKEN должен читаться через process.env.BOT_TOKEN.
Не показывай и не повторяй значение токена.
Верни только список найденных рисков и точные безопасные исправления.`,
      },
      success: [
        "Ссылка t.me/<username> открывает карточку нового бота",
        "В .env есть BOT_TOKEN, а в .env.example — только пустое значение",
        "git status не показывает .env",
      ],
      artifact: "Зарегистрированный бот и безопасный BOT_TOKEN",
      terms: ["BotFather", "BOT_TOKEN", "Bot API", "переменные окружения", "секрет"],
      references: [botFatherRef, glossaryRef, patternsRef],
    },
    {
      slug: "project",
      shortTitle: "Проект",
      title: "Создаём TypeScript-проект с grammY",
      duration: "15–25 минут",
      goal: "Установлены grammY, TypeScript, tsx и dotenv; проект готов к первому обработчику.",
      recommendation: {
        title: "Используем Node.js, TypeScript и grammY",
        why: "Этот стек компактный, хорошо типизирован и подходит для одного надёжного процесса без лишней инфраструктуры.",
        link: grammyRef,
      },
      explanation: "grammY подключает проект к Telegram Bot API, dotenv загружает токен, а tsx запускает TypeScript без отдельной ручной сборки во время разработки.",
      instructions: [
        {
          title: "Установите зависимости",
          text: "Выполните одну команду внутри папки репозитория.",
          command: "npm init -y && npm install grammy dotenv && npm install -D typescript tsx @types/node && npx tsc --init",
        },
        {
          title: "Создайте папку исходников",
          text: "Весь код бота будет находиться в src.",
          command: "mkdir -p src",
        },
      ],
      prompt: {
        title: "Настройка package.json",
        body: `Настрой этот Node.js + TypeScript проект для Telegram-бота на grammY.
Добавь в package.json:
- "dev": "tsx watch src/index.ts"
- "start": "tsx src/index.ts"
- "typecheck": "tsc --noEmit"
Не добавляй новые библиотеки.
Проверь, что tsconfig совместим с Node.js 20.
После изменений выполни npm run typecheck.`,
      },
      success: [
        "В package.json есть grammy и dotenv",
        "Команда npm run typecheck завершается без ошибок",
        "Создана папка src",
      ],
      artifact: "Готовый каркас grammY-проекта",
      terms: ["TypeScript", "grammY", "dotenv", "tsx", "Bot API"],
      references: [grammyRef, cursorRef, promptsRef],
    },
    {
      slug: "start-command",
      shortTitle: "Команда /start",
      title: "Собираем рабочую команду /start",
      duration: "20–40 минут",
      goal: "Бот запускается и отвечает приветствием на команды /start и /help.",
      recommendation: {
        title: "Начинаем с двух простых команд",
        why: "Рабочие /start и /help доказывают весь технический путь: токен, Bot API, обработчик и ответ пользователю.",
        link: grammyRef,
      },
      explanation: "AI-агент получает готовый контракт и создаёт минимальный код без базы данных, платежей и лишних функций.",
      instructions: [
        {
          title: "Передайте промпт Cursor",
          text: "Попросите агента создать src/index.ts строго по готовому контракту ниже.",
        },
        {
          title: "Проверьте типы",
          text: "До запуска код должен пройти TypeScript-проверку.",
          command: "npm run typecheck",
        },
      ],
      prompt: {
        title: "Готовый обработчик /start и /help",
        body: `Создай src/index.ts для Telegram-бота на grammY.

Требования:
1. В первой строке загрузи dotenv/config.
2. Прочитай BOT_TOKEN из process.env и заверши процесс с понятной ошибкой, если токена нет.
3. Создай Bot из grammY.
4. Команда /start отвечает: «Привет! Бот работает. Команда /help покажет доступные действия.»
5. Команда /help отвечает: «Доступные команды: /start — проверить бота, /help — помощь.»
6. Добавь bot.catch с безопасным console.error без токена и содержимого env.
7. Запусти bot.start() и выведи «Бот запущен».
8. Обработай SIGINT и SIGTERM через bot.stop().

Не добавляй базу данных, webhook, AI API и лишние зависимости.
После создания выполни npm run typecheck и исправь ошибки.`,
      },
      success: [
        "Создан src/index.ts с обработчиками /start и /help",
        "BOT_TOKEN читается только из process.env",
        "npm run typecheck проходит без ошибок",
      ],
      artifact: "Рабочий код команд /start и /help",
      terms: ["обработчик команды", "Bot API", "SIGINT", "SIGTERM", "long polling"],
      references: [grammyRef, promptsRef, skillsRef],
    },
    {
      slug: "local-test",
      shortTitle: "Проверка",
      title: "Проверяем бота в реальном Telegram",
      duration: "10–20 минут",
      goal: "Локально запущенный бот отвечает на /start и /help с телефона или desktop-клиента Telegram.",
      recommendation: {
        title: "Проверяем настоящий диалог, а не только код",
        why: "Успешный typecheck не подтверждает связь с Telegram. Нужен реальный ответ Bot API.",
      },
      explanation: "Запускаем long polling и отправляем команды новому боту. Терминал должен оставаться открытым до конца проверки.",
      instructions: [
        {
          title: "Запустите бота",
          text: "Команда должна вывести «Бот запущен» и продолжить работать.",
          command: "npm run start",
        },
        {
          title: "Отправьте две команды",
          text: "Откройте ссылку бота, нажмите Start, затем отправьте /help.",
        },
      ],
      prompt: {
        title: "Диагностика, если ответа нет",
        body: `Telegram-бот на grammY не отвечает локально.
Проверь по порядку: загрузку dotenv, наличие BOT_TOKEN, создание Bot, регистрацию command handlers до bot.start(), конфликт второго polling-процесса и содержимое bot.catch.
Не проси показать токен.
Дай одну проверочную команду за раз и ожидаемый безопасный результат.`,
      },
      success: [
        "На /start приходит приветствие «Привет! Бот работает…»",
        "На /help приходит список двух команд",
        "В терминале нет необработанных ошибок",
      ],
      artifact: "Первый реальный диалог с ботом",
      terms: ["long polling", "Telegram", "Bot API", "лог", "процесс"],
      references: [grammyRef, glossaryRef],
    },
    {
      slug: "reliability",
      shortTitle: "Надёжность",
      title: "Готовим проект к безопасному запуску",
      duration: "15–30 минут",
      goal: "Проект проходит typecheck, секреты исключены из Git, изменения сохранены в commit.",
      recommendation: {
        title: "Проверяем секреты до первого push",
        why: "Утечка BOT_TOKEN позволяет постороннему управлять ботом. Проверка до публикации дешевле перевыпуска токена.",
      },
      explanation: "Фиксируем только код и пустой шаблон окружения. Реальный .env остаётся на компьютере.",
      instructions: [
        {
          title: "Запустите техническую проверку",
          text: "TypeScript должен завершиться без ошибок, а .env не должен появиться в списке Git.",
          command: "npm run typecheck && git status --short",
        },
        {
          title: "Сохраните рабочую версию",
          text: "В commit попадут код, package-файлы, .gitignore и пустой .env.example.",
          command: "git add . && git commit -m \"add working Telegram bot commands\" && git push",
        },
        {
          title: "Остановите локального бота",
          text: "Вернитесь в терминал с npm run start и нажмите Ctrl+C. До запуска VPS должен остаться только один будущий polling-процесс.",
        },
      ],
      prompt: {
        title: "Проверка перед push",
        body: `Проведи pre-deploy review Telegram-бота.
Проверь: секреты и .env не отслеживаются Git; BOT_TOKEN не захардкожен; /start и /help зарегистрированы; bot.catch не печатает секреты; SIGINT и SIGTERM останавливают бота; typecheck проходит.
Не меняй стек и не добавляй функции.
Если есть критическая ошибка — исправь и повтори npm run typecheck.`,
      },
      success: [
        "npm run typecheck проходит",
        "git status не содержит .env",
        "Commit отправлен в приватный GitHub",
        "Локальный процесс остановлен через Ctrl+C",
      ],
      artifact: "Проверенный commit без секретов",
      terms: ["commit", "push", "секрет", "typecheck", ".gitignore"],
      references: [patternsRef, skillsRef, glossaryRef],
    },
    {
      slug: "deploy",
      shortTitle: "Deploy",
      title: "Запускаем бота на VPS через PM2",
      duration: "60–90 минут",
      goal: "Чистый Ubuntu VPS подготовлен, а PM2 держит единственный процесс Telegram-бота online.",
      recommendation: {
        title: "Один процесс PM2 и long polling",
        why: "Для первого бота это самый короткий надёжный production-путь без домена, nginx и webhook.",
      },
      explanation: "Готовим чистый Ubuntu VPS, выдаём ему read-only доступ к приватному репозиторию, создаём локальный .env и запускаем npm start под PM2.",
      instructions: [
        {
          title: "Установите Node.js, Git и PM2",
          text: "Команда рассчитана на Ubuntu VPS и в конце должна вывести версии всех инструментов.",
          command: "sudo apt-get update && sudo apt-get install -y git curl && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs && sudo npm install -g pm2 && node --version && npm --version && git --version && pm2 --version",
        },
        {
          title: "Создайте SSH-ключ сервера",
          text: "Команда создаст отдельный ключ и покажет только безопасную публичную часть.",
          command: "ssh-keygen -t ed25519 -C \"telegram-bot-vps\" -f ~/.ssh/id_ed25519 -N \"\" && cat ~/.ssh/id_ed25519.pub",
        },
        {
          title: "Разрешите VPS читать репозиторий",
          text: "В GitHub откройте my-telegram-bot → Settings → Deploy keys → Add deploy key. Вставьте показанный публичный ключ и не включайте Allow write access.",
        },
        {
          title: "Скачайте проект",
          text: "Замените YOUR_GITHUB на имя аккаунта. GitHub может один раз попросить подтвердить fingerprint словом yes.",
          command: "git clone \"git@github.com:YOUR_GITHUB/my-telegram-bot.git\" telegram-bot && cd telegram-bot && npm ci && cp .env.example .env",
        },
        {
          title: "Безопасно добавьте BOT_TOKEN",
          text: "Введите токен в скрытом приглашении терминала. Значение не попадёт в историю команд и не будет показано на экране.",
          command: "read -s -p \"BOT_TOKEN: \" BOT_TOKEN && printf \"\\nBOT_TOKEN=%s\\n\" \"$BOT_TOKEN\" > .env && unset BOT_TOKEN",
        },
        {
          title: "Запустите единственный процесс PM2",
          text: "Команда сначала убеждается, что процесса ещё нет, затем запускает бота.",
          command: "pm2 delete telegram-bot 2>/dev/null || true; pm2 start npm --name telegram-bot -- start && pm2 status telegram-bot",
        },
        {
          title: "Включите автозапуск PM2",
          text: "Выполните pm2 startup, затем скопируйте и выполните sudo-команду, которую напечатает PM2. После этого сохраните список процессов.",
          command: "pm2 startup",
        },
        {
          title: "Сохраните процесс",
          text: "Выполняйте после sudo-команды из предыдущего пункта.",
          command: "pm2 save && pm2 status telegram-bot",
        },
      ],
      prompt: {
        title: "Проверка production-процесса",
        body: `Проверь деплой Telegram-бота на VPS с PM2.
Ожидаемый процесс: один экземпляр, status online, npm start запускает tsx src/index.ts, BOT_TOKEN находится только в .env.
Не предлагай webhook, Docker, nginx или второй процесс.
Дай команды проверки PM2 и последние 50 строк логов без вывода переменных окружения.`,
      },
      success: [
        "pm2 status telegram-bot показывает online",
        "После закрытия SSH бот продолжает отвечать на /start",
        "На VPS работает только один экземпляр polling-процесса",
        "pm2 startup настроен, а список процессов сохранён через pm2 save",
      ],
      artifact: "Telegram-бот online под PM2",
      terms: ["Deploy", "VPS", "SSH", "PM2", "long polling", "production"],
      references: [ref("Термин", "PM2", "/glossary/pm2", "Менеджер production-процессов Node.js"), patternsRef, skillsRef],
    },
    {
      slug: "production",
      shortTitle: "Production",
      title: "Проверяем бота после reboot VPS",
      duration: "20–30 минут",
      goal: "Публичный бот автоматически вернулся online и отвечает на /start и /help после reboot VPS.",
      recommendation: {
        title: "Финишируем внешним сигналом",
        why: "Маршрут завершён не тогда, когда PM2 написал online, а когда бот самостоятельно восстановился после перезапуска сервера и ответил реальному пользователю.",
      },
      explanation: "Перезагружаем VPS целиком, подключаемся снова и проверяем автозапуск PM2, единственный polling-процесс и обе команды.",
      instructions: [
        {
          title: "Перезагрузите VPS",
          text: "SSH-соединение закроется. Подождите около минуты и подключитесь к серверу снова.",
          command: "sudo reboot",
        },
        {
          title: "Проверьте восстановление",
          text: "После нового SSH-подключения процесс должен быть online без ручного pm2 start.",
          command: "pm2 status telegram-bot && pm2 logs telegram-bot --lines 50 --nostream",
        },
        {
          title: "Проведите финальный smoke-тест",
          text: "Откройте публичный @username и отправьте /start, затем /help.",
        },
      ],
      prompt: {
        title: "Финальный production-аудит",
        body: `Проведи финальный smoke-аудит Telegram-бота.
Проверь только обязательный контракт:
- VPS действительно прошёл reboot;
- PM2 process автоматически вернулся online без ручного start;
- /start возвращает приветствие;
- /help возвращает список команд;
- в логах нет повторяющейся ошибки;
- .env и BOT_TOKEN не находятся в Git.
Верни PASS или FAIL. При FAIL укажи одну точную причину и следующий безопасный шаг.`,
      },
      success: [
        "VPS был перезагружен командой sudo reboot",
        "PM2 автоматически вернул telegram-bot в статус online",
        "Внешний Telegram-аккаунт получил ответ на /start",
        "Команда /help вернула список действий",
        "BOT_TOKEN отсутствует в GitHub",
      ],
      artifact: "Публичный работающий Telegram-бот",
      terms: ["production", "smoke-тест", "PM2", "лог", "rollback"],
      references: [grammyRef, ref("Термин", "PM2", "/glossary/pm2", "Контроль и перезапуск Node.js-процесса"), skillsRef],
    },
  ],
};
