export type GuidedReference = {
  kind: "Термин" | "Инструмент" | "Модель" | "Skill" | "Паттерн" | "Промпты";
  label: string;
  href: string;
  description: string;
};

export type GuidedInstruction = {
  title: string;
  text: string;
  command?: string;
};

export type GuidedStep = {
  slug: string;
  shortTitle: string;
  title: string;
  duration: string;
  goal: string;
  recommendation: {
    title: string;
    why: string;
    link?: GuidedReference;
  };
  explanation: string;
  instructions: GuidedInstruction[];
  prompt?: {
    title: string;
    body: string;
  };
  success: string[];
  artifact: string;
  terms: string[];
  references: GuidedReference[];
};

export type GuidedSolution = {
  slug: string;
  title: string;
  subtitle: string;
  result: string;
  duration: string;
  defaultStack: string[];
  steps: GuidedStep[];
};

const ref = (
  kind: GuidedReference["kind"],
  label: string,
  href: string,
  description: string,
): GuidedReference => ({ kind, label, href, description });

const cursorRef = ref("Инструмент", "Cursor", "/ai-tools/cursor", "AI-редактор, в котором выполняется основной маршрут");
const modelsRef = ref("Модель", "Рейтинг AI-моделей", "/models?sort=code", "Актуальный рейтинг моделей для кода и рассуждений");
const glossaryRef = (label: string, slug: string, description: string) =>
  ref("Термин", label, `/glossary/${slug}`, description);
const skillsRef = ref("Skill", "Skills ProektMap", "/skills", "Готовые инструкции для AI-агента");
const patternsRef = ref("Паттерн", "Паттерны сборки", "/patterns", "Проверенные архитектурные решения");
const promptsRef = ref("Промпты", "Библиотека промптов", "/prompts", "Готовые инженерные промпты ProektMap");

export const guidedSaasSolution: GuidedSolution = {
  slug: "saas-product",
  title: "Создание SaaS",
  subtitle: "Готовый инженерный маршрут ProektMap",
  result: "SaaS работает в интернете: пользователь регистрируется, входит в кабинет, выполняет AI-сценарий и проходит тестовую оплату.",
  duration: "4–8 недель",
  defaultStack: [
    "Cursor",
    "Next.js + TypeScript",
    "PostgreSQL + Prisma",
    "Auth.js",
    "OpenRouter / совместимый AI API",
    "ЮKassa",
    "GitHub",
    "VPS + PM2 + nginx",
  ],
  steps: [
    {
      slug: "workspace",
      shortTitle: "Рабочее место",
      title: "Настраиваем рабочее место",
      duration: "20–40 минут",
      goal: "На компьютере установлены Cursor, Git, Node.js LTS и Docker Desktop",
      recommendation: {
        title: "Работаем локально в Cursor",
        why: "Локальная разработка быстрее и безопаснее: файлы видны на компьютере, приложение проверяется до сервера, а AI-агент Cursor умеет читать проект, применять Rules и Skills.",
        link: cursorRef,
      },
      explanation: "До первого рабочего сценария не подключаемся к серверу по SSH. Сервер понадобится на шаге Deploy. Сейчас создаём предсказуемое локальное окружение.",
      instructions: [
        { title: "Установите Cursor", text: "Скачайте Cursor с официального сайта, запустите установщик и войдите в аккаунт." },
        { title: "Установите Node.js LTS", text: "Используйте LTS-версию Node.js. После установки перезапустите терминал.", command: "node --version && npm --version" },
        { title: "Установите Git", text: "Git будет сохранять каждое устойчивое состояние проекта.", command: "git --version" },
        { title: "Установите Docker Desktop", text: "Docker запустит PostgreSQL одинаково на любом компьютере.", command: "docker --version" },
      ],
      success: [
        "Cursor открывается",
        "Команды node, npm, git и docker возвращают версии",
        "Docker Desktop запущен",
      ],
      artifact: "Готовое локальное окружение",
      terms: ["Cursor", "Git", "Node.js", "Docker", "локальная разработка", "SSH"],
      references: [
        cursorRef,
        glossaryRef("Git", "git-glossary", "Система контроля версий"),
        glossaryRef("Docker", "docker", "Изолированное окружение сервисов"),
      ],
    },
    {
      slug: "models",
      shortTitle: "AI-модели",
      title: "Подключаем набор AI-моделей",
      duration: "10–20 минут",
      goal: "В Cursor выбраны основная coding-модель и отдельная модель для архитектуры и проверки",
      recommendation: {
        title: "Используем несколько моделей по ролям",
        why: "Одна сильная coding-модель пишет код, рассуждающая проверяет архитектуру и безопасность, а быстрая недорогая выполняет простые правки. Так маршрут устойчивее, чем работа одной моделью.",
        link: modelsRef,
      },
      explanation: "ProektMap показывает актуальные рекомендации из внутреннего рейтинга. Конкретные названия меняются вместе с рынком, роли остаются постоянными.",
      instructions: [
        { title: "Откройте настройки Models в Cursor", text: "Включите рекомендуемую coding-модель с максимальной оценкой «Код»." },
        { title: "Добавьте модель-проверяющего", text: "Выберите сильную reasoning-модель для архитектуры, security-review и сложных ошибок." },
        { title: "Оставьте быструю модель", text: "Она пригодится для переименований, текстов, небольших CSS-правок и документации." },
      ],
      prompt: {
        title: "Первое правило для Cursor",
        body: `Создай файл AGENTS.md в корне проекта.

Зафиксируй правила:
- весь интерфейс и документация на русском;
- сначала план и проверяемый результат, потом код;
- после каждого изменения запускать lint и build;
- не менять архитектуру без объяснения причины;
- не хранить токены и пароли в коде;
- каждое устойчивое состояние сохранять в Git.

Пока не создавай приложение. Покажи содержимое AGENTS.md и объясни каждое правило.`,
      },
      success: [
        "В Cursor доступны минимум две модели разных ролей",
        "Понятно, какая модель пишет код, а какая проверяет",
        "Подготовлен первый системный промпт",
      ],
      artifact: "Набор моделей и AGENTS.md",
      terms: ["AI-модель", "coding-модель", "reasoning", "AGENTS.md", "контекст"],
      references: [modelsRef, cursorRef, skillsRef],
    },
    {
      slug: "github",
      shortTitle: "GitHub",
      title: "Создаём GitHub-репозиторий",
      duration: "15–30 минут",
      goal: "Создан приватный репозиторий proektmap-saas-starter и локальная папка проекта",
      recommendation: {
        title: "Храним проект в приватном GitHub-репозитории",
        why: "GitHub даёт резервную копию кода, историю изменений и понятный способ перенести проект на сервер. Приватный режим не публикует исходники.",
        link: glossaryRef("Git", "git-glossary", "История и сохранение проекта"),
      },
      explanation: "Git сохраняет версии локально, GitHub хранит их удалённо. Мы используем оба: Git после каждого шага, GitHub как резервную копию и источник для deploy.",
      instructions: [
        { title: "Установите GitHub CLI", text: "Скачайте GitHub CLI, затем войдите в свой аккаунт.", command: "gh auth login" },
        { title: "Создайте и клонируйте репозиторий", text: "Команда сама создаст приватный репозиторий с готовым именем.", command: "gh repo create proektmap-saas-starter --private --clone" },
        { title: "Откройте папку в Cursor", text: "Перейдите в созданную папку и откройте её.", command: "cd proektmap-saas-starter && cursor ." },
      ],
      success: [
        "На GitHub виден приватный репозиторий proektmap-saas-starter",
        "Папка проекта открыта в Cursor",
        "Команда git status выполняется без ошибки",
      ],
      artifact: "Приватный GitHub-репозиторий",
      terms: ["Git", "GitHub", "репозиторий", "commit", "ветка"],
      references: [glossaryRef("Git", "git-glossary", "Система контроля версий"), cursorRef],
    },
    {
      slug: "project",
      shortTitle: "Создание проекта",
      title: "Создаём основу SaaS и PROJECT.md",
      duration: "20–40 минут",
      goal: "Next.js запускается на localhost:3000, а архитектура маршрута записана в PROJECT.md",
      recommendation: {
        title: "Next.js + TypeScript",
        why: "Один проект содержит интерфейс и серверные endpoints, TypeScript снижает число ошибок, а стек хорошо поддерживается AI-инструментами и подходит для дальнейшего deploy на VPS.",
        link: glossaryRef("Next.js", "nextjs", "Full-stack framework для React"),
      },
      explanation: "PROJECT.md не является анкетой. ProektMap уже выбрал состав базового SaaS и даёт Cursor готовое техническое задание.",
      instructions: [
        { title: "Создайте приложение", text: "Запустите команду в терминале открытой папки.", command: "npx create-next-app@latest . --ts --eslint --app --src-dir --use-npm --no-tailwind --yes" },
        { title: "Запустите локальный сервер", text: "Оставьте терминал открытым и перейдите на localhost:3000.", command: "npm run dev" },
        { title: "Передайте Cursor готовую спецификацию", text: "Скопируйте промпт ниже в Agent mode." },
      ],
      prompt: {
        title: "Создать готовый PROJECT.md",
        body: `Создай файл PROJECT.md со следующей спецификацией:

# ProektMap SaaS Starter

Тип: AI SaaS
Frontend и Backend: Next.js App Router + TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: Auth.js, email и пароль
AI: совместимый с OpenAI API провайдер через серверный endpoint
Payments: ЮKassa
Deployment: VPS, PM2, nginx, SSL
Source control: Git + приватный GitHub

Главный сценарий:
1. Пользователь открывает landing.
2. Регистрируется и входит.
3. Переходит в dashboard.
4. Отправляет текст в AI-форму.
5. Получает и сохраняет результат.
6. Видит бесплатный лимит и может перейти к оплате.

Обязательные требования:
- mobile-first;
- состояния loading, empty и error;
- изоляция данных пользователей;
- secrets только через .env;
- логирование ошибок;
- README с локальным запуском и deploy.

После создания PROJECT.md выполни npm run lint. Не реализуй функции следующих шагов.`,
      },
      success: [
        "Открывается http://localhost:3000",
        "В корне есть package.json, src/app и PROJECT.md",
        "npm run lint завершается успешно",
      ],
      artifact: "Рабочий Next.js и PROJECT.md",
      terms: ["Next.js", "TypeScript", "localhost", "Frontend", "Backend", "endpoint"],
      references: [
        glossaryRef("Next.js", "nextjs", "Full-stack framework"),
        glossaryRef("SaaS", "saas", "Программный продукт по подписке"),
        patternsRef,
        promptsRef,
      ],
    },
    {
      slug: "architecture",
      shortTitle: "Архитектура",
      title: "Создаём готовую архитектуру",
      duration: "30–60 минут",
      goal: "В проекте зафиксированы слои, сущности, API и правила безопасности",
      recommendation: {
        title: "Модульный монолит",
        why: "Для первого SaaS микросервисы добавят сложность без пользы. Модульный монолит проще разрабатывать, тестировать и разворачивать одним приложением.",
        link: patternsRef,
      },
      explanation: "ProektMap уже определил основной сквозной сценарий и набор сущностей. Cursor должен перенести их в понятную структуру проекта, не добавляя лишних сервисов.",
      instructions: [
        { title: "Откройте Agent mode", text: "Используйте сильную reasoning-модель из шага 02." },
        { title: "Скопируйте архитектурный промпт", text: "Cursor создаст документ и структуру, но пока не подключит базу." },
        { title: "Проверьте build", text: "После изменений приложение должно собираться.", command: "npm run build" },
      ],
      prompt: {
        title: "Создать Architecture Pack",
        body: `Прочитай PROJECT.md и создай docs/ARCHITECTURE.md.

Используй модульный монолит Next.js со слоями:
- src/app — страницы и route handlers;
- src/components — интерфейс;
- src/features — auth, ai, billing;
- src/lib — db, env, security, logging;
- prisma — schema и migrations.

Сущности: User, Session, AiRequest, SavedResult, Subscription, Payment.

Опиши:
1. связи сущностей;
2. основной API-сценарий;
3. границы доступа пользователя;
4. обработку ошибок и rate limit;
5. переменные окружения;
6. путь local → staging → production.

Создай только безопасный каркас папок и документы. Не выдумывай микросервисы. Запусти npm run build.`,
      },
      success: [
        "Создан docs/ARCHITECTURE.md",
        "Папки соответствуют описанной структуре",
        "npm run build проходит успешно",
      ],
      artifact: "docs/ARCHITECTURE.md",
      terms: ["архитектура", "модульный монолит", "API", "rate limit", "переменные окружения"],
      references: [patternsRef, skillsRef, glossaryRef("API", "api", "Интерфейс между частями системы")],
    },
    {
      slug: "interface",
      shortTitle: "Интерфейс",
      title: "Собираем интерфейс основного сценария",
      duration: "1–2 часа",
      goal: "Landing, регистрация, dashboard и AI-форма доступны на мобильном и desktop",
      recommendation: {
        title: "Один сквозной пользовательский путь",
        why: "Первой версии не нужен универсальный dashboard. Интерфейс строится вокруг одного действия: отправить данные и получить AI-результат.",
        link: patternsRef,
      },
      explanation: "Сначала интерфейс работает на тестовых данных. База, авторизация и AI подключаются следующими шагами, поэтому визуальную логику можно проверить без инфраструктуры.",
      instructions: [
        { title: "Передайте Cursor UI-промпт", text: "Используйте coding-модель." },
        { title: "Откройте localhost:3000", text: "Проверьте landing и dashboard на ширине 375px." },
        { title: "Запустите lint и build", text: "Ошибок быть не должно.", command: "npm run lint && npm run build" },
      ],
      prompt: {
        title: "Создать mobile-first интерфейс",
        body: `Прочитай PROJECT.md и docs/ARCHITECTURE.md.

Создай mobile-first интерфейс:
- landing с одним обещанием и CTA «Начать»;
- страницы регистрации и входа;
- dashboard с одной AI-формой;
- блок сохранённых результатов;
- индикатор бесплатного лимита;
- состояния empty, loading, success и error.

Пока используй локальные тестовые данные. На каждом экране одно главное действие. Не добавляй графики и административную панель. Проверь ширину 375px, accessibility, lint и build.`,
      },
      success: [
        "Landing ведёт в регистрацию",
        "Dashboard показывает AI-форму и все состояния",
        "На 375px нет горизонтальной прокрутки",
        "lint и build успешны",
      ],
      artifact: "Кликабельный интерфейс SaaS",
      terms: ["mobile-first", "dashboard", "empty state", "loading", "accessibility"],
      references: [patternsRef, cursorRef, promptsRef],
    },
    {
      slug: "database",
      shortTitle: "База данных",
      title: "Подключаем PostgreSQL и Prisma",
      duration: "40–90 минут",
      goal: "PostgreSQL запущен в Docker, миграция применена, Prisma видит шесть сущностей",
      recommendation: {
        title: "PostgreSQL + Prisma",
        why: "PostgreSQL надёжен для пользователей, платежей и AI-результатов. Prisma даёт типизированную схему и воспроизводимые миграции.",
        link: glossaryRef("Prisma", "prisma", "ORM и система миграций"),
      },
      explanation: "База запускается локально через Docker. Это повторяемое окружение; данные production появятся только на сервере и не смешаются с локальными.",
      instructions: [
        { title: "Скопируйте промпт", text: "Cursor создаст Docker Compose, Prisma schema и безопасный db client." },
        { title: "Запустите PostgreSQL", text: "Docker создаст локальный volume.", command: "docker compose up -d" },
        { title: "Примените первую миграцию", text: "Схема станет реальной структурой базы.", command: "npx prisma migrate dev --name init" },
      ],
      prompt: {
        title: "Подключить базу",
        body: `Прочитай PROJECT.md и docs/ARCHITECTURE.md.

Подключи PostgreSQL через docker-compose.yml и Prisma.
Создай модели User, Session, AiRequest, SavedResult, Subscription, Payment с корректными связями, индексами и createdAt/updatedAt.

Требования:
- DATABASE_URL только в .env и .env.example без секрета;
- один Prisma client в src/lib/db;
- миграции хранятся в Git;
- seed создаёт только безопасные демонстрационные данные;
- данные разных пользователей изолируются на уровне запросов.

Обнови README точными командами запуска. После изменений выполни prisma validate, lint и build.`,
      },
      success: [
        "docker compose ps показывает работающий postgres",
        "npx prisma validate завершается успешно",
        "В prisma/migrations есть init-миграция",
        "lint и build успешны",
      ],
      artifact: "PostgreSQL, Prisma schema и миграция",
      terms: ["PostgreSQL", "Prisma", "ORM", "миграция", "Docker", "DATABASE_URL"],
      references: [
        glossaryRef("База данных", "database", "Хранилище данных продукта"),
        glossaryRef("Prisma", "prisma", "ORM и миграции"),
        glossaryRef("Docker", "docker", "Контейнер локальной базы"),
        skillsRef,
      ],
    },
    {
      slug: "auth",
      shortTitle: "Авторизация",
      title: "Добавляем регистрацию и авторизацию",
      duration: "1–3 часа",
      goal: "Пользователь регистрируется, входит, выходит и не видит чужие данные",
      recommendation: {
        title: "Auth.js + email и пароль",
        why: "Самостоятельно размещённая авторизация не зависит от зарубежного SaaS. Пароли хешируются, сессии хранятся в PostgreSQL.",
        link: glossaryRef("OAuth", "oauth", "Стандарт делегированной авторизации"),
      },
      explanation: "На этом шаге интерфейс регистрации подключается к реальной базе. Cursor обязан реализовать защиту маршрутов и проверку владельца каждой записи.",
      instructions: [
        { title: "Скопируйте security-промпт", text: "Для проверки используйте reasoning-модель." },
        { title: "Создайте тестовых пользователей", text: "Зарегистрируйте два разных аккаунта через интерфейс." },
        { title: "Проверьте изоляцию", text: "Результаты первого аккаунта не должны быть видны второму." },
      ],
      prompt: {
        title: "Реализовать безопасную авторизацию",
        body: `Добавь Auth.js с регистрацией по email и паролю.

Требования:
- пароль хешируется Argon2;
- минимальная длина и серверная валидация;
- httpOnly secure cookie в production;
- CSRF-защита средствами Auth.js;
- защищённый /dashboard;
- все запросы SavedResult и AiRequest фильтруются по session.user.id;
- понятные ошибки без раскрытия существования email;
- logout и истечение сессии;
- rate limit регистрации и входа.

Добавь интеграционные проверки для двух пользователей. Не сохраняй пароль, токены или AUTH_SECRET в Git. Обнови .env.example и README. Запусти lint, tests и build.`,
      },
      success: [
        "Регистрация, вход и выход работают",
        "Неавторизованный пользователь не открывает dashboard",
        "Два пользователя не видят данные друг друга",
        "Секреты отсутствуют в Git",
      ],
      artifact: "Рабочая безопасная авторизация",
      terms: ["авторизация", "аутентификация", "сессия", "cookie", "OAuth", "Argon2"],
      references: [glossaryRef("OAuth", "oauth", "Стандарт авторизации"), patternsRef, skillsRef],
    },
    {
      slug: "ai",
      shortTitle: "AI",
      title: "Подключаем AI-сценарий",
      duration: "1–3 часа",
      goal: "Авторизованный пользователь отправляет текст, получает AI-ответ и сохраняет его",
      recommendation: {
        title: "Совместимый API и сменная модель",
        why: "Приложение не должно зависеть от одной модели. Провайдер и model id задаются переменными окружения, а сервер контролирует лимиты и ошибки.",
        link: modelsRef,
      },
      explanation: "AI вызывается только с сервера: API-ключ никогда не попадает в браузер. Бесплатный лимит защищает бюджет и одновременно готовит продукт к тарифам.",
      instructions: [
        { title: "Получите API-ключ выбранного провайдера", text: "Сохраните его только в локальном .env." },
        { title: "Скопируйте AI-промпт", text: "Cursor реализует endpoint и интерфейсный сценарий." },
        { title: "Проверьте три состояния", text: "Успех, ошибка провайдера и превышение бесплатного лимита." },
      ],
      prompt: {
        title: "Реализовать AI vertical slice",
        body: `Подключи AI-сценарий через серверный route handler.

Используй переменные AI_API_KEY, AI_BASE_URL и AI_MODEL.
Требования:
- ключ недоступен клиенту;
- вход валидируется и ограничен по длине;
- timeout и понятный fallback;
- дневной бесплатный лимит на пользователя;
- запрос и результат сохраняются в AiRequest и SavedResult;
- структурные логи без персонального текста;
- loading, retry и error в интерфейсе;
- возможность заменить модель без изменения кода.

Добавь smoke-тест успешного ответа и ошибки провайдера. Обнови .env.example и README. Запусти lint, tests и build.`,
      },
      success: [
        "AI-форма возвращает результат",
        "Результат сохраняется и виден только владельцу",
        "Ошибка API не ломает страницу",
        "После лимита новый запрос блокируется",
      ],
      artifact: "Рабочий AI-сценарий",
      terms: ["API key", "AI-модель", "endpoint", "timeout", "rate limit", "fallback"],
      references: [
        modelsRef,
        glossaryRef("API-ключ", "api-key", "Секрет для доступа к AI"),
        glossaryRef("API", "api", "Интерфейс программного вызова"),
        ref("Инструмент", "AI без VPN", "/ai-without-vpn", "Провайдеры и способы оплаты из России"),
      ],
    },
    {
      slug: "billing",
      shortTitle: "Оплата",
      title: "Подключаем тариф и ЮKassa",
      duration: "2–4 часа",
      goal: "Тестовый платёж меняет подписку ровно один раз, отмена и ошибка обработаны",
      recommendation: {
        title: "Один платный тариф через ЮKassa",
        why: "Для первой версии достаточно бесплатного лимита и одного понятного тарифа. ЮKassa принимает рубли и поддерживает webhook.",
        link: glossaryRef("Webhook", "webhook-gloss", "Серверное уведомление о событии"),
      },
      explanation: "Статус подписки меняется только после проверенного webhook, а не после возврата пользователя на сайт. Повтор webhook не должен создавать вторую оплату.",
      instructions: [
        { title: "Создайте тестовый магазин ЮKassa", text: "Используйте тестовый режим до production." },
        { title: "Добавьте тестовые ключи в .env", text: "Никогда не вставляйте ключи в промпт или Git." },
        { title: "Скопируйте payment-промпт", text: "Cursor создаст платёж и идемпотентный webhook." },
      ],
      prompt: {
        title: "Реализовать test payment",
        body: `Подключи тестовую оплату ЮKassa для одного тарифа.

Требования:
- создание платежа только на сервере;
- idempotence key для каждого намерения;
- Payment со статусами pending, succeeded, canceled;
- проверка webhook и защита от повторной обработки;
- Subscription меняется только после succeeded webhook;
- success, cancel и failed страницы;
- журнал payment id без секретов;
- пользователь не может изменить сумму с клиента.

Добавь тесты повторного webhook и неуспешной оплаты. Обнови README. Запусти lint, tests и build.`,
      },
      success: [
        "Тестовый платёж создаётся",
        "Webhook переводит подписку в активное состояние",
        "Повтор webhook не создаёт дубль",
        "Ошибка оплаты не открывает платный доступ",
      ],
      artifact: "Payment-ready SaaS",
      terms: ["ЮKassa", "webhook", "идемпотентность", "подписка", "тариф"],
      references: [glossaryRef("Webhook", "webhook-gloss", "Уведомление платёжной системы"), patternsRef, skillsRef],
    },
    {
      slug: "deploy",
      shortTitle: "Deploy",
      title: "Разворачиваем staging на VPS",
      duration: "1–3 часа",
      goal: "Проект доступен по временному HTTPS-адресу, PM2 и nginx работают",
      recommendation: {
        title: "VPS + PM2 + nginx",
        why: "Этот путь даёт контроль над данными, PostgreSQL и оплатой, работает из России и совпадает с инфраструктурой ProektMap.",
        link: glossaryRef("Deploy", "deploy-glossary", "Публикация приложения на сервере"),
      },
      explanation: "Только теперь переходим к SSH. Код уже работает локально и хранится в GitHub, поэтому сервер используется для повторяемого deploy, а не для первой разработки.",
      instructions: [
        { title: "Подключитесь к VPS", text: "Используйте отдельного пользователя и SSH-ключ, не root-пароль.", command: "ssh deploy@SERVER_IP" },
        { title: "Клонируйте проект", text: "На сервере код приходит из GitHub.", command: "git clone REPOSITORY_URL && cd proektmap-saas-starter" },
        { title: "Передайте Cursor deploy-промпт", text: "Промпт создаст инструкцию, PM2 config и nginx template." },
      ],
      prompt: {
        title: "Подготовить безопасный deploy",
        body: `Подготовь production-like deploy для Ubuntu VPS.

Создай:
- ecosystem.config.js для PM2;
- docs/DEPLOY.md с Node.js LTS, PostgreSQL, migrations и rollback;
- nginx-конфигурацию reverse proxy;
- health endpoint;
- .env.production.example без секретов;
- скрипт последовательности install → migrate → build → restart.

Требования:
- приложение не запускается от root;
- порт приложения закрыт снаружи;
- HTTPS через Let's Encrypt;
- миграции без force reset;
- backup перед миграцией;
- smoke-тест после restart.

Не выполняй команды на сервере автоматически. Сначала покажи план и файлы. Запусти локальный build.`,
      },
      success: [
        "npm run build успешен на VPS",
        "PM2 показывает приложение online",
        "nginx отдаёт приложение по HTTPS",
        "health endpoint возвращает успешный статус",
      ],
      artifact: "Рабочий staging URL",
      terms: ["Deploy", "VPS", "SSH", "PM2", "nginx", "SSL", "reverse proxy"],
      references: [
        glossaryRef("Deploy", "deploy-glossary", "Публикация приложения"),
        ref("Инструмент", "Российский AI-стек", "/russian-ai-stack", "Инфраструктура без зарубежных ограничений"),
        ref("Инструмент", "AI без VPN", "/ai-without-vpn", "Работающие из России сервисы"),
      ],
    },
    {
      slug: "production",
      shortTitle: "Production",
      title: "Запускаем SaaS в интернете",
      duration: "1–3 дня",
      goal: "Production URL пройден новым пользователем от регистрации до тестовой оплаты",
      recommendation: {
        title: "Запускаем после smoke-теста и резервной копии",
        why: "Production считается готовым не после deploy, а после полного прохождения сценария новым аккаунтом и проверки наблюдаемости.",
        link: ref("Паттерн", "AI Цех", "/ai-workshop", "Примеры реально запущенных AI-продуктов"),
      },
      explanation: "Финальный шаг связывает домен, SSL, production secrets, monitoring и первый внешний сигнал. Маршрут заканчивается работающим продуктом, а не документом.",
      instructions: [
        { title: "Подключите домен и production secrets", text: "Разделите staging и production окружения." },
        { title: "Выполните release-последовательность", text: "Перед миграцией создайте backup.", command: "npm ci && npx prisma migrate deploy && npm run build && pm2 restart ecosystem.config.js" },
        { title: "Пройдите сценарий с нового аккаунта", text: "Регистрация → AI-запрос → сохранение → тестовая оплата." },
        { title: "Пригласите первых пользователей", text: "Зафиксируйте первый завершённый сценарий или оплату." },
      ],
      prompt: {
        title: "Провести production-аудит",
        body: `Проведи read-only production readiness review по PROJECT.md, ARCHITECTURE.md и DEPLOY.md.

Проверь:
- secrets и публичные переменные;
- авторизацию и изоляцию данных;
- rate limits и AI-бюджет;
- идемпотентность платежей;
- backup и rollback;
- HTTPS, headers и health endpoint;
- логи без персональных данных;
- smoke-сценарий нового пользователя.

Сначала выдай P0/P1/P2 список. Ничего не меняй без подтверждения. После исправлений сформируй docs/LAUNCH-CHECKLIST.md с командами и ожидаемыми результатами.`,
      },
      success: [
        "Production URL открывается по HTTPS",
        "Новый аккаунт проходит основной сценарий",
        "AI и оплата работают в production-контуре",
        "Ошибки видны в логах",
        "Получен первый внешний сигнал",
      ],
      artifact: "Публичный работающий SaaS",
      terms: ["production", "staging", "smoke-тест", "monitoring", "backup", "rollback"],
      references: [
        ref("Паттерн", "AI Цех", "/ai-workshop", "Запущенные AI-проекты"),
        patternsRef,
        skillsRef,
      ],
    },
  ],
};
