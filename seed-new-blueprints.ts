// Seed: 4 новых Blueprint'а — CRM, AI-ассистент, Интернет-магазин, Маркетплейс
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function createCRM() {
  let bp = await db.blueprint.findFirst({ where: { slug: "company-crm" } });
  if (bp) { console.log("⏭️  CRM already exists, skipping..."); return; }

  bp = await db.blueprint.create({
    data: {
      title: "CRM-система",
      slug: "company-crm",
      description: "Своя CRM для управления клиентами, сделками и задачами. Карточки клиентов, воронка продаж, уведомления о задачах.",
      icon: "Users",
      difficulty: "medium",
      isPublished: true,
      sortOrder: 6,
      totalXp: 640,
      totalDecisions: 8,
      goal: "Ты создашь полноценную CRM-систему: карточки клиентов с историей взаимодействий, канбан-доска сделок по этапам, система задач с дедлайнами и уведомлениями, дашборд со статистикой.",
      entities: JSON.stringify([
        "User — сотрудники CRM",
        "Client — клиенты и контакты",
        "Deal — сделки с этапами воронки",
        "Task — задачи с дедлайнами",
        "Activity — история взаимодействий (звонки, встречи, письма)",
        "Company — реквизиты компании",
      ]),
      checklist: JSON.stringify([
        "Карточки клиентов создаются и редактируются",
        "Сделки двигаются по этапам воронки",
        "Задачи создаются с дедлайнами",
        "Уведомления приходят в Telegram",
        "Дашборд показывает статистику",
        "Сайт опубликован с авторизацией",
      ]),
      artifacts: JSON.stringify([
        "CRM-система на Vercel",
        "schema.prisma с 6 моделями",
        "Канбан-доска сделок",
        "Дашборд со статистикой",
      ]),
      targetAudience: "Малый бизнес, менеджеры по продажам, фрилансеры",
      timeToComplete: "3 недели по 1-2 часа в день",
    },
  });

  // STAGE 1: Подготовка
  const s1 = await db.stage.create({
    data: {
      title: "Подготовка проекта",
      slug: "crm-setup",
      icon: "Rocket",
      sortOrder: 1,
      description: "Настройка окружения и выбор технологического стека",
      decisions: { create: [{
        title: "Выбор стека и создание проекта",
        slug: "crm-choose-stack",
        problem: "CRM — это внутренний инструмент, где важны скорость разработки, real-time обновления и удобный UI. Нужно выбрать стек, который покроет эти требования.",
        goal: "Создан Next.js проект с TypeScript, Tailwind, Prisma. Настроен проект на локальной машине.",
        recommended: "Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL. Для real-time обновлений — SWR или React Query. Авторизация через NextAuth.js.",
        why: "Next.js даёт серверные компоненты для быстрых страниц, Prisma — типобезопасные запросы к БД, Tailwind — готовые UI-компоненты. SWR обеспечит мгновенное обновление данных на канбан-доске.",
        xpReward: 25,
        timeEstimate: "30 мин",
        sortOrder: 1,
        entities: JSON.stringify(["Project — корневая папка с package.json"]),
        promptTitle: "Создай проект для CRM-системы",
        promptTemplate: 'Действуй как senior Next.js разработчик. Создай проект для CRM-системы.\n\nКоманды:\n1. npx create-next-app@latest crm-system --typescript --tailwind --eslint --app --src-dir\n2. cd crm-system\n3. npm install prisma @prisma/client next-auth swr\n4. npx prisma init\n\nПроверь что:\n- Проект запускается на localhost:3000\n- Папка src/app создана\n- prisma/schema.prisma создан\n- Tailwind работает\n\nОбъясни структуру папок и зачем нужен каждый пакет.',
        checks: { create: [
          { title: "Node.js установлен (node -v)", sortOrder: 1 },
          { title: "Проект создан через create-next-app", sortOrder: 2 },
          { title: "Prisma и зависимости установлены", sortOrder: 3 },
          { title: "npm run dev запускается без ошибок", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "package.json", description: "Зависимости проекта", sortOrder: 1 },
          { title: "prisma/schema.prisma", description: "Заготовка схемы БД", sortOrder: 2 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s1.id, sortOrder: 1 } });

  // STAGE 2: База данных
  const s2 = await db.stage.create({
    data: {
      title: "База данных",
      slug: "crm-database",
      icon: "Database",
      sortOrder: 2,
      description: "Проектирование схемы БД для клиентов, сделок и задач",
      decisions: { create: [{
        title: "Проектирование схемы БД CRM",
        slug: "crm-db-schema",
        problem: "Нужно спроектировать базу данных, которая хранит клиентов, сделки на разных этапах, задачи сотрудников и историю взаимодействий.",
        goal: "Создана схема Prisma с 6 моделями, связи настроены, миграция выполнена",
        recommended: "Модели: User (сотрудники с ролью), Client (компания/человек + контакты), Deal (сделка: этап, сумма, ответственный), Task (задача: заголовок, дедлайн, статус), Activity (история: тип, описание, дата). Связи: Client → Deals, Deal → Tasks, User → Deals/Tasks.",
        entities: JSON.stringify([
          "User { id, name, email, role, createdAt }",
          "Client { id, name, company, phone, email, source, createdAt }",
          "Deal { id, title, amount, stage, clientId, userId, createdAt }",
          "Task { id, title, description, deadline, status, userId, dealId, clientId }",
          "Activity { id, type, description, clientId, userId, createdAt }",
          "Company { id, name, phone, email }",
        ]),
        why: "Клиенты и сделки связаны 1:M — у одного клиента может быть несколько сделок. Задачи привязаны и к сделкам и к клиентам для гибкости. Activity — журнал всех действий менеджера.",
        xpReward: 40,
        timeEstimate: "45 мин",
        sortOrder: 1,
        promptTitle: "Спроектируй схему БД для CRM",
        promptTemplate: 'Действуй как backend-архитектор. Создай schema.prisma для CRM-системы.\n\nМодели:\n- User: id, name, email, password, role (enum: ADMIN, MANAGER), createdAt\n- Client: id, name, company?, phone, email?, source?, notes?, createdAt\n- Deal: id, title, amount?, stage (enum: LEAD, CONTACT, MEETING, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST), clientId, userId, createdAt\n- Task: id, title, description?, deadline, status (enum: TODO, IN_PROGRESS, DONE), priority (enum: LOW, MEDIUM, HIGH), userId, dealId?, clientId?, createdAt\n- Activity: id, type (enum: CALL, MEETING, EMAIL, NOTE), description, clientId, userId, createdAt\n\nСвязи:\n- Client 1→M Deal\n- Deal 1→M Task (опционально)\n- User 1→M Deal, User 1→M Task\n- Client 1→M Activity\n\nВыполни миграцию: npx prisma migrate dev --name init',
        checks: { create: [
          { title: "schema.prisma со всеми 6 моделями", sortOrder: 1 },
          { title: "Связи 1:M настроены корректно", sortOrder: 2 },
          { title: "npx prisma migrate dev выполнен", sortOrder: 3 },
          { title: "Prisma Studio открывается с моделями", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "schema.prisma", description: "Полная схема CRM", sortOrder: 1 },
          { title: "migrations/", description: "SQL-миграции", sortOrder: 2 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s2.id, sortOrder: 2 } });

  // STAGE 3: Карточки клиентов
  const s3 = await db.stage.create({
    data: {
      title: "Карточки клиентов",
      slug: "crm-clients",
      icon: "Contact",
      sortOrder: 3,
      description: "CRUD клиентов с историей взаимодействий и поиском",
      decisions: { create: [{
        title: "Создание карточек клиентов с историей",
        slug: "crm-client-cards",
        problem: "Менеджер должен быстро находить клиента, видеть всю историю взаимодействий и редактировать данные. Нужен удобный интерфейс со списком и карточкой.",
        goal: "Страница /clients со списком, поиском и карточкой клиента с историей активностей",
        recommended: "Список клиентов: таблица с поиском, сортировка по дате/названию. Карточка: данные клиента + лента Activity (звонки, встречи, заметки). Кнопка «Добавить активность» с выбором типа.",
        entities: JSON.stringify(["Client — данные клиента", "Activity — история взаимодействий"]),
        why: "Быстрый поиск клиента = менеджер за 2 секунды находит нужного. История активностей = контекст перед звонком. Это ядро CRM.",
        xpReward: 50,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Создай карточки клиентов для CRM",
        promptTemplate: 'Создай страницы для управления клиентами в Next.js.\n\n1. /clients — список клиентов:\n- Таблица: название, компания, телефон, email, дата создания\n- Поиск по названию и телефону\n- Кнопка «Добавить клиента» → модалка или страница\n\n2. /clients/[id] — карточка клиента:\n- Данные клиента (редактируемые поля)\n- Лента Activity: звонки 📞, встречи 🤝, письма ✉️, заметки 📝\n- Кнопка «Добавить активность»\n\n3. API:\n- GET/POST /api/clients\n- GET/PUT /api/clients/[id]\n- POST /api/clients/[id]/activities\n\nИспользуй серверные компоненты Next.js + Prisma.',
        checks: { create: [
          { title: "Страница /clients показывает список", sortOrder: 1 },
          { title: "Поиск по клиентам работает", sortOrder: 2 },
          { title: "Карточка клиента открывается по клику", sortOrder: 3 },
          { title: "Активности добавляются и отображаются", sortOrder: 4 },
          { title: "Редактирование данных клиента работает", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s3.id, sortOrder: 3 } });

  // STAGE 4: Воронка продаж
  const s4 = await db.stage.create({
    data: {
      title: "Воронка продаж",
      slug: "crm-pipeline",
      icon: "Kanban",
      sortOrder: 4,
      description: "Канбан-доска сделок по этапам воронки",
      decisions: { create: [{
        title: "Канбан-доска сделок",
        slug: "crm-kanban",
        problem: "Менеджер должен видеть все сделки на одном экране, двигать их по этапам воронки и понимать на какой стадии каждая.",
        goal: "Канбан-доска с колонками по этапам, drag-and-drop сделок, карточка сделки с задачами",
        recommended: "Колонки: Лид → Контакт → Встреча → КП → Переговоры → Закрыто (победа/проигрыш). Карточка сделки: название, сумма, клиент, ответственный. Drag-and-drop через HTML5 API или библиотеку (@hello-pangea/dnd).",
        entities: JSON.stringify(["Deal — сделки по этапам", "Client — клиент сделки"]),
        why: "Канбан — самый наглядный способ видеть воронку. Drag-and-drop = интуитивное движение сделок. Суммы по колонкам = прогноз выручки.",
        xpReward: 55,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Создай канбан-доску для сделок",
        promptTemplate: 'Создай канбан-доску сделок в Next.js.\n\nСтраница /deals:\n- Колонки по этапам: LEAD, CONTACT, MEETING, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST\n- Карточка сделки: название, сумма (формат: 50 000 ₽), название клиента, ответственный\n- Drag-and-drop: перетаскивание карточек между колонками\n- Вверху каждой колонки: количество сделок и сумма\n- Кнопка «+ Сделка» в каждой колонке\n\nAPI:\n- GET /api/deals — все сделки\n- POST /api/deals — создать сделку\n- PATCH /api/deals/[id] — обновить этап (stage)\n\nДля drag-and-drop используй @hello-pangea/dnd или нативный HTML5 Drag API.\nКлиентский компонент с SWR для real-time обновлений.',
        checks: { create: [
          { title: "Канбан-доска отображается с 7 колонками", sortOrder: 1 },
          { title: "Карточки сделок показывают название и сумму", sortOrder: 2 },
          { title: "Drag-and-drop двигает сделку в другую колонку", sortOrder: 3 },
          { title: "Сумма по колонкам считается корректно", sortOrder: 4 },
          { title: "Новая сделка создаётся через кнопку «+»", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s4.id, sortOrder: 4 } });

  // STAGE 5: Задачи
  const s5 = await db.stage.create({
    data: {
      title: "Задачи и напоминания",
      slug: "crm-tasks",
      icon: "CheckSquare",
      sortOrder: 5,
      description: "Система задач с дедлайнами, приоритетами и привязкой к клиентам",
      decisions: { create: [{
        title: "Система задач с дедлайнами",
        slug: "crm-task-system",
        problem: "Менеджер должен видеть свои задачи на сегодня, просроченные и будущие. Задачи должны быть привязаны к клиентам или сделкам.",
        goal: "Страница /tasks с фильтрами (сегодня, просроченные, все), создание задачи с дедлайном и приоритетом",
        recommended: "Три вкладки: «Сегодня» (задачи на текущую дату), «Просроченные» (красным), «Все». Карточка задачи: заголовок, дедлайн, приоритет (цветной индикатор), связанный клиент/сделка. Отметка о выполнении.",
        entities: JSON.stringify(["Task — задачи", "Client — связанный клиент", "Deal — связанная сделка"]),
        why: "Задачи с дедлайнами = менеджер ничего не забывает. Просроченные красным = сразу видно что горит. Привязка к клиенту = контекст задачи.",
        xpReward: 45,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Создай систему задач для CRM",
        promptTemplate: 'Создай систему задач в Next.js.\n\nСтраница /tasks:\n- Вкладки: «Сегодня» | «Просроченные» | «Все»\n- Карточка задачи: заголовок, дедлайн (дата+время), приоритет (🟢низкий 🟡средний 🔴высокий), клиент/сделка, чекбокс выполнения\n- Кнопка «+ Задача» — форма: заголовок, описание, дедлайн, приоритет, связать с клиентом/сделкой\n- Просроченные задачи выделены красной рамкой\n\nAPI:\n- GET /api/tasks?filter=today|overdue|all\n- POST /api/tasks\n- PATCH /api/tasks/[id] (статус: done)\n\nИспользуй Prisma для запросов с фильтрацией по дате.',
        checks: { create: [
          { title: "Страница /tasks с тремя вкладками", sortOrder: 1 },
          { title: "Вкладка «Сегодня» показывает актуальные задачи", sortOrder: 2 },
          { title: "Просроченные задачи выделены красным", sortOrder: 3 },
          { title: "Задача создаётся с дедлайном и приоритетом", sortOrder: 4 },
          { title: "Отметка «Выполнено» работает", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s5.id, sortOrder: 5 } });

  // STAGE 6: Уведомления
  const s6 = await db.stage.create({
    data: {
      title: "Уведомления",
      slug: "crm-notifications",
      icon: "Bell",
      sortOrder: 6,
      description: "Telegram-уведомления о новых задачах и сделках",
      decisions: { create: [{
        title: "Telegram-уведомления о задачах и сделках",
        slug: "crm-telegram-notify",
        problem: "Менеджер должен узнавать о новой задаче или изменении этапа сделки даже когда он не в CRM. Telegram — идеальный канал.",
        goal: "При создании задачи или смене этапа сделки — уведомление в Telegram ответственного менеджера",
        recommended: "Создай Telegram бота через @BotFather. В API создания задачи и обновления сделки добавь отправку сообщения в Telegram. У каждого User должен быть telegramChatId (получить через /start бота).",
        entities: JSON.stringify(["User.telegramChatId — ID чата менеджера"]),
        why: "Telegram — мгновенные уведомления на телефон. Менеджер видит задачу сразу, не заходя в CRM. Повышает дисциплину и скорость реакции.",
        xpReward: 35,
        timeEstimate: "1 час",
        sortOrder: 1,
        promptTitle: "Настрой Telegram-уведомления для CRM",
        promptTemplate: 'Настрой Telegram-уведомления для CRM.\n\n1. Создай бота:\n- @BotFather → /newbot → получаешь токен\n- Добавь TELEGRAM_BOT_TOKEN в .env\n\n2. Получение chatId менеджера:\n- В профиле пользователя (/profile) добавь кнопку «Подключить Telegram»\n- Создай API /api/telegram/webhook для приёма /start от бота\n- Сохраняй telegramChatId в User\n\n3. Отправка уведомлений:\n- Новая задача: «🔔 Новая задача: {title}\\n📅 Дедлайн: {deadline}\\n👤 Клиент: {client}»\n- Смена этапа сделки: «📊 Сделка «{title}» → {newStage}\\n💰 Сумма: {amount}₽»\n\nИспользуй fetch на api.telegram.org для отправки.',
        checks: { create: [
          { title: "Telegram бот создан, токен в .env", sortOrder: 1 },
          { title: "Пользователь может подключить Telegram", sortOrder: 2 },
          { title: "Уведомление о новой задаче приходит", sortOrder: 3 },
          { title: "Уведомление о смене этапа сделки приходит", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s6.id, sortOrder: 6 } });

  // STAGE 7: Деплой и защита
  const s7 = await db.stage.create({
    data: {
      title: "Деплой и безопасность",
      slug: "crm-deploy",
      icon: "Shield",
      sortOrder: 7,
      description: "Публикация CRM, настройка авторизации и защита данных",
      decisions: { create: [{
        title: "Деплой на Vercel и настройка авторизации",
        slug: "crm-deploy-auth",
        problem: "CRM содержит конфиденциальные данные клиентов. Нужно опубликовать систему с авторизацией и защитой от несанкционированного доступа.",
        goal: "CRM опубликована на Vercel, вход только по паролю, данные защищены",
        recommended: "1. NextAuth.js с провайдером Credentials (email + пароль). 2. Middleware для защиты всех страниц кроме /login. 3. Переменные окружения в Vercel: DATABASE_URL, NEXTAUTH_SECRET, TELEGRAM_BOT_TOKEN. 4. Добавь заголовки безопасности.",
        entities: JSON.stringify(["User — учётные записи сотрудников"]),
        why: "CRM без авторизации = данные клиентов доступны всем. NextAuth.js даёт готовую систему входа. Middleware блокирует неавторизованных на уровне запроса.",
        xpReward: 35,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        promptTitle: "Опубликуй CRM и настрой авторизацию",
        promptTemplate: 'Настрой авторизацию и опубликуй CRM.\n\n1. NextAuth.js:\n- Установи: npm install next-auth @auth/prisma-adapter bcryptjs\n- Создай app/api/auth/[...nextauth]/route.ts с провайдером Credentials\n- Страница /login с формой email+пароль\n\n2. Middleware:\n- Создай middleware.ts: проверка сессии, редирект на /login для неавторизованных\n- Кроме /login и /api/auth — всё защищено\n\n3. Деплой:\n- Свяжи GitHub репозиторий с Vercel\n- Добавь env: DATABASE_URL, NEXTAUTH_SECRET (сгенерируй: openssl rand -base64 32), TELEGRAM_BOT_TOKEN\n- Проверь работу на production URL\n\n4. Безопасность:\n- Добавь CSP-заголовки в next.config.js',
        checks: { create: [
          { title: "Страница /login с формой входа", sortOrder: 1 },
          { title: "Без авторизации — редирект на /login", sortOrder: 2 },
          { title: "После входа — доступ ко всем страницам", sortOrder: 3 },
          { title: "Сайт опубликован на Vercel", sortOrder: 4 },
          { title: "CSP-заголовки настроены", sortOrder: 5 },
        ]},
        artifacts: { create: [
          { title: "CRM на Vercel", description: "Опубликованная система", sortOrder: 1 },
          { title: "middleware.ts", description: "Защита маршрутов", sortOrder: 2 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s7.id, sortOrder: 7 } });

  // STAGE 8: Финальная проверка
  const s8 = await db.stage.create({
    data: {
      title: "Финальная проверка и запуск",
      slug: "crm-final",
      icon: "CheckCircle",
      sortOrder: 8,
      description: "Проверка всех функций CRM перед внедрением",
      decisions: { create: [{
        title: "Полное тестирование CRM",
        slug: "crm-testing",
        problem: "Перед тем как начинать работать в CRM, нужно проверить что всё функционирует: клиенты, сделки, задачи, уведомления, авторизация.",
        goal: "Все функции CRM протестированы, система готова к использованию",
        recommended: "Пройди полный цикл работы менеджера: создай клиента → добавь сделку → поставь задачу → проверь уведомление в Telegram → передвинь сделку по воронке → закрой задачу. Проверь защиту: попробуй открыть /clients без авторизации.",
        entities: JSON.stringify([]),
        why: "CRM — рабочий инструмент. Ошибка в сохранении сделки = потерянные деньги. Полный цикл тестирования гарантирует надёжность.",
        xpReward: 20,
        timeEstimate: "45 мин",
        sortOrder: 1,
        checks: { create: [
          { title: "Клиент создаётся и отображается в списке", sortOrder: 1 },
          { title: "Сделка создаётся и двигается по воронке", sortOrder: 2 },
          { title: "Задача создаётся с дедлайном", sortOrder: 3 },
          { title: "Telegram-уведомление получено", sortOrder: 4 },
          { title: "Без авторизации — редирект на /login", sortOrder: 5 },
          { title: "Мобильная версия проверена", sortOrder: 6 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s8.id, sortOrder: 8 } });

  console.log(`✅ CRM "${bp.title}" created with 8 stages!`);
}

// ============================================================
// 2. AI-АССИСТЕНТ
// ============================================================
async function createAIAssistant() {
  let bp = await db.blueprint.findFirst({ where: { slug: "ai-assistant" } });
  if (bp) { console.log("⏭️  AI-ассистент already exists, skipping..."); return; }

  bp = await db.blueprint.create({
    data: {
      title: "AI-ассистент",
      slug: "ai-assistant",
      description: "Персональный AI-ассистент с чатом, памятью и загрузкой документов. Отвечает на вопросы по твоей базе знаний через RAG.",
      icon: "Bot",
      difficulty: "hard",
      isPublished: true,
      sortOrder: 7,
      totalXp: 620,
      totalDecisions: 7,
      goal: "Ты создашь AI-ассистента с веб-интерфейсом: потоковый чат с памятью диалога, загрузка PDF/документов, поиск по базе знаний через RAG (Retrieval-Augmented Generation), история диалогов.",
      entities: JSON.stringify([
        "User — пользователи ассистента",
        "Chat — диалоги",
        "Message — сообщения в диалоге",
        "Document — загруженные файлы",
        "DocumentChunk — фрагменты документов с эмбеддингами",
      ]),
      checklist: JSON.stringify([
        "Чат с AI работает в реальном времени (streaming)",
        "Загрузка PDF и DOCX работает",
        "Поиск по документам через RAG",
        "История диалогов сохраняется",
        "Ассистент помнит контекст диалога",
        "Сайт опубликован",
      ]),
      artifacts: JSON.stringify([
        "AI-ассистент на Vercel",
        "schema.prisma с 5 моделями",
        "RAG-пайплайн с эмбеддингами",
        "Чат-интерфейс с потоковой генерацией",
      ]),
      targetAudience: "Владельцы бизнеса, поддержка клиентов, контент-менеджеры",
      timeToComplete: "3 недели по 2 часа в день",
    },
  });

  // STAGE 1: Подготовка
  const s1 = await db.stage.create({
    data: {
      title: "Подготовка и выбор AI-модели",
      slug: "ai-setup",
      icon: "Brain",
      sortOrder: 1,
      description: "Выбор AI-провайдера и настройка проекта",
      decisions: { create: [{
        title: "Выбор AI-модели и создание проекта",
        slug: "ai-choose-model",
        problem: "Нужно выбрать AI-модель для ассистента. Варианты: OpenAI (GPT-4o), Anthropic (Claude), OpenRouter (доступ к разным моделям), локальные модели. Критерии: цена, качество русского языка, скорость, доступность из РФ.",
        goal: "Выбрана AI-модель, получен API-ключ, создан Next.js проект",
        recommended: "OpenRouter API — единый доступ к GPT-4o, Claude и другим через один ключ. Работает из РФ без VPN, оплата криптой или картой. Бесплатные модели для тестов. Next.js + TypeScript + Tailwind + Prisma.",
        why: "OpenRouter решает проблему доступа из РФ и даёт гибкость: сегодня GPT-4o, завтра Claude — без смены кода. Бесплатные модели — тестируешь без затрат.",
        xpReward: 25,
        timeEstimate: "30 мин",
        sortOrder: 1,
        entities: JSON.stringify(["Project — проект Next.js с AI-зависимостями"]),
        promptTitle: "Выбери AI-модель и создай проект",
        promptTemplate: 'Действуй как AI-инженер. Настрой проект для AI-ассистента.\n\n1. Зарегистрируйся на openrouter.ai, получи API-ключ\n2. Создай проект:\n   npx create-next-app@latest ai-assistant --typescript --tailwind --eslint --app --src-dir\n3. Установи:\n   npm install ai openai @prisma/client prisma\n   (пакет ai от Vercel — универсальный SDK для AI-провайдеров)\n4. Добавь OPENROUTER_API_KEY в .env\n\nПакет ai поддерживает streaming из коробки, работает с OpenRouter через openai-совместимый endpoint.',
        checks: { create: [
          { title: "API-ключ OpenRouter получен", sortOrder: 1 },
          { title: "Проект Next.js создан и запущен", sortOrder: 2 },
          { title: "Пакет ai установлен", sortOrder: 3 },
          { title: "OPENROUTER_API_KEY в .env", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "package.json", description: "Проект с AI-зависимостями", sortOrder: 1 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s1.id, sortOrder: 1 } });

  // STAGE 2: База данных
  const s2 = await db.stage.create({
    data: {
      title: "База данных",
      slug: "ai-database",
      icon: "Database",
      sortOrder: 2,
      description: "Проектирование схемы для чатов, сообщений и документов",
      decisions: { create: [{
        title: "Схема БД для AI-ассистента",
        slug: "ai-db-schema",
        problem: "Нужно хранить диалоги, сообщения, загруженные документы и их векторные представления (эмбеддинги) для RAG-поиска.",
        goal: "Создана схема Prisma с моделями User, Chat, Message, Document, DocumentChunk",
        recommended: "Chat 1→M Message. Document 1→M DocumentChunk (куски текста с векторами). Для хранения векторов используй pgvector (расширение PostgreSQL) — поле embedding типа Unsupported('vector(1536)').",
        entities: JSON.stringify([
          "User { id, name, email, createdAt }",
          "Chat { id, title, userId, createdAt }",
          "Message { id, role (user|assistant), content, chatId, createdAt }",
          "Document { id, filename, content, userId, chatId, createdAt }",
          "DocumentChunk { id, text, embedding, documentId }",
        ]),
        why: "Отдельные модели для чатов и сообщений = у одного пользователя много диалогов. DocumentChunk с векторами = быстрый семантический поиск по документам.",
        xpReward: 40,
        timeEstimate: "45 мин",
        sortOrder: 1,
        promptTitle: "Создай схему БД для AI-ассистента",
        promptTemplate: 'Создай schema.prisma для AI-ассистента.\n\nМодели:\n- User: id, name, email, password, createdAt\n- Chat: id, title, userId, createdAt\n- Message: id, role (enum: USER, ASSISTANT), content (текст сообщения), chatId, createdAt\n- Document: id, filename, content (полный текст), userId, chatId, createdAt\n- DocumentChunk: id, text (кусок ~500 символов), embedding (vector(1536)), documentId, createdAt\n\nДля pgvector:\n- В datasource: extensions = [pgvector(map: \"vector\", schema: \"public\")]\n- npx prisma migrate dev --name init_ai\n\nПеред миграцией выполни на БД:\nCREATE EXTENSION IF NOT EXISTS vector;',
        checks: { create: [
          { title: "schema.prisma с 5 моделями создан", sortOrder: 1 },
          { title: "pgvector extension установлен", sortOrder: 2 },
          { title: "Миграция выполнена без ошибок", sortOrder: 3 },
          { title: "Prisma Studio показывает все модели", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "schema.prisma", description: "Схема AI-ассистента", sortOrder: 1 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s2.id, sortOrder: 2 } });

  // STAGE 3: Чат-интерфейс
  const s3 = await db.stage.create({
    data: {
      title: "Чат-интерфейс с AI",
      slug: "ai-chat",
      icon: "MessageSquare",
      sortOrder: 3,
      description: "Потоковый чат с AI, сохранение истории и переключение диалогов",
      decisions: { create: [{
        title: "Потоковый чат с AI",
        slug: "ai-chat-stream",
        problem: "Пользователь должен общаться с AI как в ChatGPT: сообщения появляются посимвольно (streaming), диалоги сохраняются, можно переключаться между ними.",
        goal: "Чат-интерфейс: потоковая генерация ответов, сохранение истории, создание/переключение диалогов",
        recommended: "Используй Vercel AI SDK (пакет ai): хук useChat для streaming, API-роут /api/chat с OpenAI-совместимым клиентом через OpenRouter. Интерфейс: список диалогов слева, область сообщений справа, поле ввода снизу.",
        entities: JSON.stringify(["Chat — диалоги", "Message — сообщения"]),
        why: "Vercel AI SDK даёт streaming из коробки — не нужно писать WebSocket или SSE вручную. useChat — React-хук с готовым состоянием загрузки и ошибок.",
        xpReward: 60,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Создай потоковый чат с AI",
        promptTemplate: 'Создай чат-интерфейс с AI через Vercel AI SDK.\n\n1. API роут app/api/chat/route.ts:\n```ts\nimport { createOpenAI } from \'@ai-sdk/openai\';\nimport { streamText } from \'ai\';\n\nconst openrouter = createOpenAI({\n  baseURL: \'https://openrouter.ai/api/v1\',\n  apiKey: process.env.OPENROUTER_API_KEY,\n});\n\nexport async function POST(req: Request) {\n  const { messages } = await req.json();\n  const result = streamText({\n    model: openrouter(\'openai/gpt-4o\'),\n    messages,\n  });\n  return result.toDataStreamResponse();\n}\n```\n\n2. Клиентский компонент:\n- useChat() хук для отправки и получения\n- Список сообщений с авто-прокруткой\n- Кнопка «Новый диалог»\n- Боковая панель со списком чатов\n\n3. Сохранение в БД:\n- После каждого ответа — сохраняй сообщения в Message через server action',
        checks: { create: [
          { title: "Сообщение отправляется и AI отвечает", sortOrder: 1 },
          { title: "Ответ появляется посимвольно (streaming)", sortOrder: 2 },
          { title: "Диалоги сохраняются в БД", sortOrder: 3 },
          { title: "Можно переключаться между диалогами", sortOrder: 4 },
          { title: "Новый диалог создаётся по кнопке", sortOrder: 5 },
        ]},
        artifacts: { create: [
          { title: "Чат-интерфейс", description: "Полноценный AI-чат", sortOrder: 1 },
          { title: "API /api/chat", description: "Потоковый AI-эндпоинт", sortOrder: 2 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s3.id, sortOrder: 3 } });

  // STAGE 4: RAG
  const s4 = await db.stage.create({
    data: {
      title: "RAG: Загрузка документов",
      slug: "ai-rag",
      icon: "FileText",
      sortOrder: 4,
      description: "Загрузка PDF/DOCX, создание эмбеддингов и семантический поиск",
      decisions: { create: [{
        title: "RAG-пайплайн: загрузка и поиск по документам",
        slug: "ai-rag-pipeline",
        problem: "AI-ассистент должен отвечать на вопросы по загруженным документам. Нужно: разбить документ на куски → создать эмбеддинги → при вопросе найти релевантные куски → передать в контекст AI.",
        goal: "Загрузка PDF/DOCX работает, документы разбиваются на куски, при вопросе AI использует контекст из документов",
        recommended: "1. Загрузка: react-dropzone на клиенте, загрузка в хранилище (Vercel Blob или локально). 2. Парсинг: pdf-parse для PDF, mammoth для DOCX. 3. Разбиение: langchain TextSplitter или свой splitter (~500 символов с перекрытием 100). 4. Эмбеддинги: OpenRouter embeddings API (модель openai/text-embedding-3-small). 5. Поиск: pgvector cosine similarity.",
        entities: JSON.stringify(["Document — файлы", "DocumentChunk — куски с векторами"]),
        why: "RAG — ключевая технология 2026. AI ищет ответ в документах, а не «придумывает». pgvector — бесплатно, быстро, в той же БД.",
        xpReward: 70,
        timeEstimate: "3 часа",
        sortOrder: 1,
        promptTitle: "Создай RAG-пайплайн для документов",
        promptTemplate: 'Создай RAG-систему для AI-ассистента.\n\n1. Загрузка документа:\n- Компонент FileUpload (react-dropzone) на странице чата\n- API POST /api/documents — принимает файл, парсит PDF/DOCX\n- Сохраняет полный текст в Document, разбивает на чанки в DocumentChunk\n\n2. Создание эмбеддингов:\n- Для каждого чанка: запрос к OpenRouter embeddings API\n- Сохранение вектора в DocumentChunk.embedding\n- npm install pdf-parse mammoth\n\n3. RAG-поиск при вопросе:\n- В /api/chat перед отправкой AI:\n  * Создай эмбеддинг вопроса\n  * Найди top-5 похожих чанков через pgvector: ORDER BY embedding <=> query_embedding LIMIT 5\n  * Добавь текст чанков в system prompt: «Отвечай используя эту информацию: ...»\n\n4. Разбиение текста:\n- Функция splitText(text, chunkSize=500, overlap=100)\n- Разбивает по предложениям, не разрывая слова',
        checks: { create: [
          { title: "PDF-файл загружается и парсится", sortOrder: 1 },
          { title: "Текст разбивается на чанки", sortOrder: 2 },
          { title: "Эмбеддинги создаются и сохраняются", sortOrder: 3 },
          { title: "При вопросе AI использует контекст из документа", sortOrder: 4 },
          { title: "Ответ основан на документе, а не выдуман", sortOrder: 5 },
        ]},
        artifacts: { create: [
          { title: "RAG-пайплайн", description: "Загрузка → эмбеддинги → поиск", sortOrder: 1 },
          { title: "FileUpload", description: "Компонент загрузки документов", sortOrder: 2 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s4.id, sortOrder: 4 } });

  // STAGE 5: Память и контекст
  const s5 = await db.stage.create({
    data: {
      title: "Память и контекст",
      slug: "ai-memory",
      icon: "BrainCircuit",
      sortOrder: 5,
      description: "Управление контекстным окном и памятью диалога",
      decisions: { create: [{
        title: "Контекстное окно и долговременная память",
        slug: "ai-context-memory",
        problem: "У AI-моделей ограниченное контекстное окно (GPT-4o: 128K токенов). При длинных диалогах старые сообщения нужно сжимать или суммировать, чтобы не выходить за лимит.",
        goal: "Диалоги любой длины работают без потери контекста: старые сообщения суммируются, важные факты сохраняются в память",
        recommended: "1. Суммаризация: когда сообщений > 20 — попроси AI создать краткое резюме диалога. 2. Память: выдели ключевые факты (имя пользователя, предпочтения) и сохраняй в отдельную модель Memory. Вставляй в system prompt. 3. Скользящее окно: последние 10 сообщений полностью + резюме предыдущих.",
        entities: JSON.stringify(["Memory — ключевые факты о пользователе"]),
        why: "Без управления контекстом на 30-м сообщении AI «забывает» начало диалога. Суммаризация сжимает историю в 10 раз. Memory хранит важное между сессиями.",
        xpReward: 50,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Реализуй память и управление контекстом",
        promptTemplate: 'Реализуй систему памяти для AI-ассистента.\n\n1. Модель Memory (добавь в schema.prisma):\n- Memory { id, userId, key (строка), value (строка), createdAt }\n\n2. Суммаризация диалога:\n- Когда сообщений в чате > 20:\n  * Вызови AI с промптом «Суммируй этот диалог в 3-5 предложений»\n  * Сохрани резюме в Chat.summary\n  * При следующих запросах вставляй резюме в system prompt\n\n3. Извлечение памяти:\n- Раз в 5 сообщений вызывай AI: «Выдели ключевые факты о пользователе из диалога»\n- Сохраняй факты в Memory\n- При каждом запросе добавляй в system prompt: «Информация о пользователе: {факты}»\n\n4. Сборка контекста в /api/chat:\n- Последние 10 сообщений (полный текст)\n- Резюме предыдущих\n- Факты о пользователе\n- Релевантные чанки документов (из RAG)',
        checks: { create: [
          { title: "При >20 сообщениях диалог суммируется", sortOrder: 1 },
          { title: "Факты о пользователе сохраняются в память", sortOrder: 2 },
          { title: "AI помнит имя пользователя между сессиями", sortOrder: 3 },
          { title: "Контекст не теряется на длинных диалогах", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s5.id, sortOrder: 5 } });

  // STAGE 6: Деплой
  const s6 = await db.stage.create({
    data: {
      title: "Деплой и мониторинг",
      slug: "ai-deploy",
      icon: "Rocket",
      sortOrder: 6,
      description: "Публикация AI-ассистента и контроль расходов на API",
      decisions: { create: [{
        title: "Деплой на Vercel и лимитирование запросов",
        slug: "ai-deploy-vercel",
        problem: "AI-ассистент использует платные API (OpenRouter). Нужно опубликовать и настроить лимиты чтобы не получить огромный счёт.",
        goal: "Сайт на Vercel, настроен rate-limiting, мониторинг расходов на API",
        recommended: "1. Vercel деплой с env переменными. 2. Rate-limiting: middleware проверяет количество запросов в минуту (сохраняй в БД или Redis). 3. Дневной лимит токенов на пользователя. 4. Страница счётчика использованных токенов в профиле.",
        entities: JSON.stringify(["User — лимиты токенов"]),
        why: "AI API стоит денег. Без лимитов один пользователь может потратить весь бюджет. Rate-limiting + дневной лимит = контроль расходов.",
        xpReward: 30,
        timeEstimate: "1 час",
        sortOrder: 1,
        promptTitle: "Опубликуй AI-ассистента и настрой лимиты",
        promptTemplate: 'Настрой деплой и защиту бюджета.\n\n1. Vercel:\n- Импортируй GitHub репозиторий\n- Env: DATABASE_URL, OPENROUTER_API_KEY, NEXTAUTH_SECRET\n\n2. Rate-limiting middleware:\n- В middleware.ts добавь проверку: максимум 10 запросов в минуту\n- Используй подсчёт в БД или Redis (если есть)\n- При превышении: 429 Too Many Requests с сообщением\n\n3. Лимит токенов:\n- Добавь в User поля: dailyTokensUsed, dailyTokensLimit (по умолчанию 50000)\n- В /api/chat после ответа обновляй dailyTokensUsed\n- Если превышен: возвращай ошибку\n- Сбрасывай счётчик раз в сутки (cron в Vercel или проверка по дате)\n\n4. Профиль:\n- Страница /profile: использовано токенов сегодня / лимит',
        checks: { create: [
          { title: "Сайт открывается на Vercel", sortOrder: 1 },
          { title: "Rate-limiting блокирует >10 запросов/мин", sortOrder: 2 },
          { title: "Дневной лимит токенов работает", sortOrder: 3 },
          { title: "Страница профиля показывает расход токенов", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s6.id, sortOrder: 6 } });

  // STAGE 7: Финальная проверка
  const s7 = await db.stage.create({
    data: {
      title: "Финальная проверка",
      slug: "ai-final",
      icon: "CheckCircle",
      sortOrder: 7,
      description: "Тестирование всех функций AI-ассистента",
      decisions: { create: [{
        title: "Полное тестирование AI-ассистента",
        slug: "ai-testing",
        problem: "Нужно проверить: чат, streaming, RAG-поиск, память, лимиты, загрузку документов.",
        goal: "Все функции протестированы, ассистент готов к использованию",
        recommended: "Проверь: 1) простой диалог, 2) загрузку PDF и вопрос по нему, 3) длинный диалог >20 сообщений, 4) переключение между чатами, 5) превышение лимита.",
        entities: JSON.stringify([]),
        why: "AI-ассистент — сложная система. Streaming, RAG, память — каждый компонент может сломаться. Полный тест гарантирует что всё работает вместе.",
        xpReward: 20,
        timeEstimate: "45 мин",
        sortOrder: 1,
        checks: { create: [
          { title: "AI отвечает на простые вопросы", sortOrder: 1 },
          { title: "PDF загружается, AI отвечает по содержанию", sortOrder: 2 },
          { title: "Длинный диалог работает без потери контекста", sortOrder: 3 },
          { title: "Переключение между чатами сохраняет историю", sortOrder: 4 },
          { title: "Лимит запросов блокирует превышение", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s7.id, sortOrder: 7 } });

  console.log(`✅ AI-ассистент "${bp.title}" created with 7 stages!`);
}

// ============================================================
// 3. ИНТЕРНЕТ-МАГАЗИН
// ============================================================
async function createOnlineStore() {
  let bp = await db.blueprint.findFirst({ where: { slug: "online-store" } });
  if (bp) { console.log("⏭️  Интернет-магазин already exists, skipping..."); return; }

  bp = await db.blueprint.create({
    data: {
      title: "Интернет-магазин",
      slug: "online-store",
      description: "Полноценный интернет-магазин с каталогом, корзиной, оплатой через ЮKassa и уведомлениями о заказах в Telegram.",
      icon: "Store",
      difficulty: "medium",
      isPublished: true,
      sortOrder: 8,
      totalXp: 720,
      totalDecisions: 8,
      goal: "Ты создашь интернет-магазин: каталог товаров с фильтрами и поиском, корзина, оформление заказа, оплата через ЮKassa, уведомления в Telegram, личный кабинет покупателя с историей заказов.",
      entities: JSON.stringify([
        "User — покупатели",
        "Product — товары",
        "Category — категории",
        "Cart — корзина",
        "CartItem — товары в корзине",
        "Order — заказы",
        "Payment — платежи",
        "Review — отзывы",
      ]),
      checklist: JSON.stringify([
        "Каталог с фильтрацией и поиском",
        "Корзина работает (добавить, изменить, удалить)",
        "Оформление заказа с формой",
        "Оплата через ЮKassa (тестовый режим)",
        "Уведомления в Telegram о заказе",
        "Личный кабинет с историей заказов",
        "Сайт опубликован с SEO",
      ]),
      artifacts: JSON.stringify([
        "Интернет-магазин на Vercel",
        "schema.prisma с 8 моделями",
        "Интеграция ЮKassa",
        "Telegram-бот для уведомлений",
      ]),
      targetAudience: "Предприниматели, розничные магазины, производители",
      timeToComplete: "4 недели по 1-2 часа в день",
    },
  });

  // STAGE 1
  const s1 = await db.stage.create({
    data: {
      title: "Подготовка проекта",
      slug: "store-setup",
      icon: "Rocket",
      sortOrder: 1,
      description: "Выбор стека и создание проекта интернет-магазина",
      decisions: { create: [{
        title: "Выбор стека и создание проекта",
        slug: "store-choose-stack",
        problem: "Интернет-магазин требует: SEO-оптимизации, быстрой загрузки страниц, интеграции с платёжными системами. Нужен стек, который это обеспечит.",
        goal: "Создан Next.js проект, установлены зависимости, настроен Prisma",
        recommended: "Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL. Next.js даёт SSR для SEO и быстрые страницы. Tailwind — адаптивная верстка. Prisma — работа с БД.",
        why: "Next.js — лучший выбор для e-commerce: серверный рендеринг для SEO, Image Optimization для фото товаров, API Routes для платёжных интеграций.",
        xpReward: 25,
        timeEstimate: "30 мин",
        sortOrder: 1,
        entities: JSON.stringify(["Project — корневая папка"]),
        promptTitle: "Создай проект интернет-магазина",
        promptTemplate: 'Действуй как senior e-commerce разработчик. Создай проект интернет-магазина.\n\n1. npx create-next-app@latest online-store --typescript --tailwind --eslint --app --src-dir\n2. cd online-store\n3. npm install prisma @prisma/client next-auth bcryptjs\n4. npx prisma init\n\nБудем использовать:\n- Next.js App Router для страниц каталога\n- Prisma + PostgreSQL для товаров и заказов\n- ЮKassa для приёма платежей\n- Telegram Bot API для уведомлений',
        checks: { create: [
          { title: "Проект создан, npm run dev работает", sortOrder: 1 },
          { title: "Prisma и зависимости установлены", sortOrder: 2 },
          { title: "Tailwind работает (проверь любой класс)", sortOrder: 3 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s1.id, sortOrder: 1 } });

  // STAGE 2
  const s2 = await db.stage.create({
    data: {
      title: "База данных",
      slug: "store-database",
      icon: "Database",
      sortOrder: 2,
      description: "Проектирование БД для товаров, заказов и платежей",
      decisions: { create: [{
        title: "Схема БД интернет-магазина",
        slug: "store-db-schema",
        problem: "Нужна схема для: товаров с вариантами (размер/цвет), корзины, заказов со статусами, платежей через ЮKassa, отзывов.",
        goal: "Создана схема Prisma с 8 моделями, миграция выполнена",
        recommended: "Модели: User, Category, Product (с вариантами через JSON или отдельную таблицу Variant), Cart/CartItem, Order/OrderItem, Payment (платёж с status и transactionId), Review.",
        entities: JSON.stringify([
          "User { id, name, email, phone, address, createdAt }",
          "Category { id, name, slug, image, parentId }",
          "Product { id, name, slug, description, price, oldPrice?, images, categoryId, inStock, variants }",
          "Cart { id, userId, sessionId?, createdAt }",
          "CartItem { id, cartId, productId, quantity, variant }",
          "Order { id, userId, status, total, address, comment, createdAt }",
          "OrderItem { id, orderId, productId, quantity, price }",
          "Payment { id, orderId, method, status, transactionId, amount, createdAt }",
          "Review { id, productId, userId, rating, text, createdAt }",
        ]),
        why: "Отдельные OrderItem сохраняют цену на момент заказа (даже если цена товара изменится). Payment — для учёта и сверки с ЮKassa. Review — социальное доказательство.",
        xpReward: 45,
        timeEstimate: "1 час",
        sortOrder: 1,
        promptTitle: "Создай схему БД для интернет-магазина",
        promptTemplate: 'Создай schema.prisma для интернет-магазина.\n\nМодели как в entities выше. Важные детали:\n- Product.variants: Json (массив объектов типа {size, color, price})\n- Order.status: enum (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED)\n- Payment.status: enum (PENDING, SUCCEEDED, CANCELED)\n- Review.rating: Int от 1 до 5\n- Cart привязывается либо к User (авторизован), либо по sessionId (гость)\n\nИндексы:\n- Product.slug — уникальный\n- Category.slug — уникальный\n\nВыполни миграцию: npx prisma migrate dev --name store_init',
        checks: { create: [
          { title: "schema.prisma со всеми моделями", sortOrder: 1 },
          { title: "Связи 1:M настроены", sortOrder: 2 },
          { title: "Миграция выполнена", sortOrder: 3 },
          { title: "Prisma Studio открывается", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "schema.prisma", description: "Схема магазина", sortOrder: 1 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s2.id, sortOrder: 2 } });

  // STAGE 3
  const s3 = await db.stage.create({
    data: {
      title: "Каталог товаров",
      slug: "store-catalog",
      icon: "LayoutGrid",
      sortOrder: 3,
      description: "Каталог с фильтрацией, поиском и карточкой товара",
      decisions: { create: [{
        title: "Каталог и карточка товара",
        slug: "store-catalog-page",
        problem: "Покупатель должен быстро найти товар: по категории, цене, названию. Карточка товара должна показывать фото, описание, цену, варианты, отзывы и кнопку «В корзину».",
        goal: "Страницы /catalog, /catalog/[category] и /product/[slug] с фильтрами и корзиной",
        recommended: "Каталог: серверный fetch с пагинацией, фильтры (категория, цена min/max), сортировка (по цене, новизне). Карточка товара: галерея фото, описание, выбор варианта, отзывы, похожие товары. Кнопка «В корзину» с указанием количества.",
        entities: JSON.stringify(["Product", "Category", "Review"]),
        why: "Фильтрация + поиск = конверсия выше в 2 раза. Карточка с отзывами = доверие. Выбор варианта на карточке = не уходит со страницы.",
        xpReward: 55,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Создай каталог товаров",
        promptTemplate: 'Создай каталог для интернет-магазина.\n\n1. /catalog — все товары:\n- Сетка карточек (4 в ряд на десктопе)\n- Фильтры: категория (select), цена (range slider)\n- Сортировка: по цене ↑↓, по новизне\n- Пагинация\n\n2. /catalog/[category] — товары категории\n\n3. /product/[slug] — карточка:\n- Галерея фото (основное + миниатюры)\n- Название, цена (старая цена зачёркнута)\n- Выбор варианта (размер/цвет)\n- Количество (+/-)\n- Кнопка «В корзину»\n- Описание (поддержи markdown или HTML)\n- Отзывы (рейтинг звёздами, текст)\n- Похожие товары\n\nИспользуй Next.js Image для оптимизации фото.',
        checks: { create: [
          { title: "Каталог показывает товары", sortOrder: 1 },
          { title: "Фильтр по категории работает", sortOrder: 2 },
          { title: "Карточка товара открывается", sortOrder: 3 },
          { title: "Варианты товара выбираются", sortOrder: 4 },
          { title: "Кнопка «В корзину» работает", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s3.id, sortOrder: 3 } });

  // STAGE 4
  const s4 = await db.stage.create({
    data: {
      title: "Корзина и оформление заказа",
      slug: "store-cart",
      icon: "ShoppingCart",
      sortOrder: 4,
      description: "Корзина, страница оформления заказа, валидация",
      decisions: { create: [{
        title: "Корзина и оформление заказа",
        slug: "store-cart-checkout",
        problem: "Корзина должна работать для гостей (localStorage) и авторизованных (БД). Оформление: контакты, адрес доставки, способ оплаты.",
        goal: "Страница /cart (корзина) и /checkout (оформление), заказ сохраняется в БД",
        recommended: "Корзина: CartContext (React Context) + localStorage для гостей. При логине — синхронизация с БД. Checkout: форма (имя, телефон, email, адрес, комментарий), выбор способа оплаты (ЮKassa), просмотр состава заказа перед подтверждением.",
        entities: JSON.stringify(["Cart", "CartItem", "Order", "OrderItem"]),
        why: "Корзина в localStorage = гость добавляет товары без регистрации. Минимум полей в оформлении = выше конверсия в заказ.",
        xpReward: 55,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Создай корзину и оформление заказа",
        promptTemplate: 'Создай корзину и оформление.\n\n1. Корзина (CartContext + localStorage):\n- Страница /cart: список товаров, количество, сумма\n- Изменение количества (+/-), удаление\n- Промокод (опционально)\n- Кнопка «Оформить заказ»\n\n2. Оформление /checkout:\n- Форма: имя*, телефон*, email, адрес доставки, комментарий\n- Состав заказа (read-only)\n- Итоговая сумма\n- Кнопка «Подтвердить и оплатить»\n\n3. API:\n- POST /api/orders — создаёт заказ из корзины, очищает корзину\n- Возвращает orderId для перехода к оплате\n\n4. После создания заказа:\n- Отправь уведомление в Telegram (подготовь, интеграция в Stage 5)',
        checks: { create: [
          { title: "Товар добавляется в корзину", sortOrder: 1 },
          { title: "Страница /cart показывает товары", sortOrder: 2 },
          { title: "Количество меняется, товар удаляется", sortOrder: 3 },
          { title: "Форма оформления валидируется", sortOrder: 4 },
          { title: "Заказ сохраняется в БД", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s4.id, sortOrder: 4 } });

  // STAGE 5
  const s5 = await db.stage.create({
    data: {
      title: "Платежи ЮKassa",
      slug: "store-payments",
      icon: "CreditCard",
      sortOrder: 5,
      description: "Интеграция ЮKassa для приёма онлайн-платежей",
      decisions: { create: [{
        title: "Интеграция оплаты через ЮKassa",
        slug: "store-yookassa",
        problem: "Нужно принимать платежи от покупателей. ЮKassa — самый популярный платёжный провайдер в РФ: карты, SberPay, ЮMoney, рассрочка.",
        goal: "Оплата через ЮKassa работает: покупатель платит → заказ получает статус PAID → магазин видит оплаченный заказ",
        recommended: "1. Регистрация в ЮKassa, получение shopId + секретный ключ. 2. SDK: npm install yookassa. 3. API /api/payment/create: создаёт платёж, возвращает confirmation_url для редиректа. 4. Webhook для приёма уведомлений об оплате.",
        entities: JSON.stringify(["Payment — запись о платеже"]),
        why: "ЮKassa покрывает 95% способов оплаты в РФ. Тестовый режим = отлаживаешь без реальных денег. Webhook гарантирует что статус заказа обновится даже если покупатель закрыл окно.",
        xpReward: 50,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Интегрируй ЮKassa в интернет-магазин",
        promptTemplate: 'Интегрируй оплату через ЮKassa.\n\n1. Регистрация:\n- yookassa.ru → регистрация → тестовый магазин\n- Получи shopId и секретный ключ\n- Добавь YOOKASSA_SHOP_ID и YOOKASSA_SECRET в .env\n\n2. Создание платежа:\n- API POST /api/payment:\n```ts\nimport YooKassa from \'yookassa\';\nconst yookassa = new YooKassa({ shopId, secretKey });\n\nconst payment = await yookassa.createPayment({\n  amount: { value: total, currency: \'RUB\' },\n  confirmation: { type: \'redirect\', return_url: \'https://site.ru/order/success\' },\n  description: `Заказ #${orderId}`,\n});\n// Сохрани payment.id в БД, верни payment.confirmation.confirmation_url\n```\n\n3. Webhook:\n- API POST /api/payment/webhook — принимает уведомления от ЮKassa\n- Проверяет подпись, обновляет Payment.status и Order.status\n\n4. После оплаты: редирект на /order/success?orderId=XXX',
        checks: { create: [
          { title: "ЮKassa магазин зарегистрирован", sortOrder: 1 },
          { title: "Тестовый платёж проходит", sortOrder: 2 },
          { title: "После оплаты заказ получает статус PAID", sortOrder: 3 },
          { title: "Webhook обновляет статус", sortOrder: 4 },
          { title: "Страница успешной оплаты показывается", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s5.id, sortOrder: 5 } });

  // STAGE 6
  const s6 = await db.stage.create({
    data: {
      title: "Личный кабинет и уведомления",
      slug: "store-account",
      icon: "User",
      sortOrder: 6,
      description: "Личный кабинет покупателя и Telegram-уведомления",
      decisions: { create: [{
        title: "Личный кабинет и Telegram-уведомления",
        slug: "store-account-notify",
        problem: "Покупателю нужен личный кабинет с историей заказов и статусами. Магазину — уведомления о новых заказах в Telegram.",
        goal: "Страницы /account/orders (история) и /account/orders/[id] (детали заказа). Telegram-уведомления о каждом новом заказе.",
        recommended: "Личный кабинет: список заказов с датой, суммой и статусом. Детали заказа: состав, адрес доставки, статус оплаты. Telegram бот: сообщение с номером заказа, суммой, контактами покупателя, ссылкой на заказ в админке.",
        entities: JSON.stringify(["User", "Order", "OrderItem"]),
        why: "Личный кабинет = покупатель возвращается проверить статус. Telegram-уведомления = мгновенная реакция на заказ.",
        xpReward: 40,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        promptTitle: "Создай личный кабинет и Telegram-уведомления",
        promptTemplate: 'Создай личный кабинет и уведомления.\n\n1. /account/orders — история заказов:\n- Таблица: номер заказа, дата, сумма, статус (с цветным индикатором)\n- Фильтр по статусу\n- Клик → /account/orders/[id]\n\n2. /account/orders/[id] — детали:\n- Номер и дата заказа\n- Список товаров (название, кол-во, цена)\n- Адрес доставки, способ оплаты\n- Статус заказа и оплаты\n- Кнопка «Повторить заказ»\n\n3. Telegram-уведомления:\n- Бот через @BotFather\n- TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env\n- После создания заказа: fetch к api.telegram.org\n- Формат: «🛍 Новый заказ #123\\n💰 Сумма: 5 000 ₽\\n👤 Имя\\n📞 Телефон\\n📍 Адрес»',
        checks: { create: [
          { title: "Страница /account/orders показывает заказы", sortOrder: 1 },
          { title: "Детали заказа отображаются", sortOrder: 2 },
          { title: "Telegram-уведомление о заказе приходит", sortOrder: 3 },
          { title: "Статус заказа обновляется", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s6.id, sortOrder: 6 } });

  // STAGE 7
  const s7 = await db.stage.create({
    data: {
      title: "Деплой и SEO",
      slug: "store-deploy",
      icon: "Globe",
      sortOrder: 7,
      description: "Публикация магазина и поисковая оптимизация",
      decisions: { create: [{
        title: "Деплой на Vercel и SEO для товаров",
        slug: "store-deploy-seo",
        problem: "Магазин должен находиться в поиске Яндекса и Google. Каждый товар и категория — отдельная SEO-страница.",
        goal: "Сайт на Vercel, SEO-оптимизация всех страниц, sitemap с товарами, Метрика",
        recommended: "1. Vercel — деплой с env переменными. 2. generateMetadata для каждого товара (title = название, description = описание). 3. sitemap.ts — генерирует URL всех товаров и категорий. 4. Schema.org Product structured data. 5. Яндекс.Метрика.",
        entities: JSON.stringify(["Product", "Category — для sitemap"]),
        why: "E-commerce SEO = каждый товар как отдельная страница в поиске. Schema.org Product = расширенные сниппеты (цена, наличие, рейтинг). Sitemap ускоряет индексацию.",
        xpReward: 35,
        timeEstimate: "1 час",
        sortOrder: 1,
        promptTitle: "Опубликуй магазин и настрой SEO",
        promptTemplate: 'Опубликуй и настрой SEO.\n\n1. Vercel деплой:\n- GitHub → Vercel, env переменные\n\n2. SEO для товара (generateMetadata в /product/[slug]/page.tsx):\n- title: "{product.name} — купить в интернет-магазине"\n- description: product.description (первые 160 символов)\n- openGraph: фото товара, цена\n\n3. Schema.org Product:\n- Добавь JSON-LD в карточку товара с name, price, availability, image\n\n4. sitemap.ts:\n- Генерируй URL для /, /catalog, всех категорий, всех товаров\n\n5. Яндекс.Метрика:\n- metrika.yandex.ru → добавить счётчик\n- <Script> в layout.tsx',
        checks: { create: [
          { title: "Сайт открывается на Vercel", sortOrder: 1 },
          { title: "meta-теги заполнены на странице товара", sortOrder: 2 },
          { title: "sitemap.xml содержит товары", sortOrder: 3 },
          { title: "Schema.org Product на карточке", sortOrder: 4 },
          { title: "Яндекс.Метрика установлена", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s7.id, sortOrder: 7 } });

  // STAGE 8
  const s8 = await db.stage.create({
    data: {
      title: "Финальная проверка и запуск",
      slug: "store-final",
      icon: "CheckCircle",
      sortOrder: 8,
      description: "Тестирование полного цикла покупки",
      decisions: { create: [{
        title: "Полное тестирование магазина",
        slug: "store-testing",
        problem: "Перед запуском магазина нужно проверить полный путь покупателя: от захода на сайт до оплаты заказа и уведомления.",
        goal: "Все функции магазина протестированы, магазин готов к приёму реальных заказов",
        recommended: "Пройди путь покупателя: главная → каталог → карточка товара → корзина → оформление → оплата (тестовый платёж) → страница успеха → проверка Telegram и email → личный кабинет.",
        entities: JSON.stringify([]),
        why: "Баги в оформлении заказа = потерянные продажи. Тестовый платёж через ЮKassa гарантирует что реальные платежи тоже пройдут.",
        xpReward: 20,
        timeEstimate: "1 час",
        sortOrder: 1,
        checks: { create: [
          { title: "Главная → каталог → товар — работает", sortOrder: 1 },
          { title: "Корзина: CRUD товаров", sortOrder: 2 },
          { title: "Оформление заказа: форма отправляется", sortOrder: 3 },
          { title: "Тестовый платёж ЮKassa проходит", sortOrder: 4 },
          { title: "Telegram-уведомление получено", sortOrder: 5 },
          { title: "Личный кабинет: заказ виден", sortOrder: 6 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s8.id, sortOrder: 8 } });

  console.log(`✅ Интернет-магазин "${bp.title}" created with 8 stages!`);
}

// ============================================================
// 4. МАРКЕТПЛЕЙС
// ============================================================
async function createMarketplace() {
  let bp = await db.blueprint.findFirst({ where: { slug: "marketplace" } });
  if (bp) { console.log("⏭️  Маркетплейс already exists, skipping..."); return; }

  bp = await db.blueprint.create({
    data: {
      title: "Маркетплейс",
      slug: "marketplace",
      description: "Двусторонний маркетплейс: продавцы регистрируются, выставляют товары, покупатели заказывают. Система комиссий, рейтинги, отзывы, выплаты продавцам.",
      icon: "ShoppingBag",
      difficulty: "hard",
      isPublished: true,
      sortOrder: 9,
      totalXp: 820,
      totalDecisions: 8,
      goal: "Ты создашь полноценный маркетплейс: регистрация продавцов с верификацией, добавление товаров, общий каталог, корзина и заказы, система комиссий платформы, рейтинги продавцов, выплаты через ЮKassa.",
      entities: JSON.stringify([
        "User — общая учётка (роль: buyer, seller, admin)",
        "Seller — профиль продавца: магазин, реквизиты, рейтинг",
        "Product — товары с sellerId",
        "Category — категории товаров",
        "Order — заказы с sellerId для комиссии",
        "OrderItem — позиции заказа",
        "Payment — платежи покупателей",
        "Payout — выплаты продавцам",
        "Review — отзывы о товарах и продавцах",
      ]),
      checklist: JSON.stringify([
        "Регистрация продавца с верификацией",
        "Продавец добавляет и управляет товарами",
        "Общий каталог всех товаров",
        "Заказы с распределением по продавцам",
        "Расчёт комиссии платформы",
        "Выплаты продавцам",
        "Рейтинги и отзывы работают",
        "Сайт опубликован",
      ]),
      artifacts: JSON.stringify([
        "Маркетплейс на Vercel",
        "schema.prisma с 9 моделями",
        "Система комиссий",
        "Личный кабинет продавца",
        "Выплаты через ЮKassa",
      ]),
      targetAudience: "Стартапы, предприниматели, агрегаторы услуг",
      timeToComplete: "4 недели по 2 часа в день",
    },
  });

  // STAGE 1
  const s1 = await db.stage.create({
    data: {
      title: "Подготовка и архитектура",
      slug: "marketplace-setup",
      icon: "Rocket",
      sortOrder: 1,
      description: "Проектирование архитектуры мульти-тенантного маркетплейса",
      decisions: { create: [{
        title: "Архитектура маркетплейса и создание проекта",
        slug: "marketplace-architecture",
        problem: "Маркетплейс сложнее магазина: несколько продавцов, распределение заказов, комиссии, выплаты. Нужна правильная архитектура с самого начала.",
        goal: "Спроектирована архитектура с ролями пользователей, создан Next.js проект",
        recommended: "Роли: User.role = BUYER | SELLER | ADMIN. Один User может быть и покупателем и продавцом. Seller — отдельная модель с профилем магазина. Product привязан к Seller. Order привязан к Seller для расчёта комиссии. Payments — от покупателей, Payouts — продавцам.",
        why: "Разделение User/Seller позволяет одному человеку покупать и продавать. Order.sellerId определяет кому идёт оплата. Commission настраивается на уровне платформы (процент от заказа).",
        xpReward: 30,
        timeEstimate: "45 мин",
        sortOrder: 1,
        entities: JSON.stringify(["User (buyer+seller)", "Seller", "Platform"]),
        promptTitle: "Спроектируй архитектуру маркетплейса",
        promptTemplate: 'Спроектируй архитектуру маркетплейса.\n\n1. Создай проект:\n   npx create-next-app@latest marketplace --typescript --tailwind --eslint --app --src-dir\n2. Установи: npm install prisma @prisma/client next-auth yookassa\n\n3. Архитектура ролей:\n- User.role enum: BUYER, SELLER, ADMIN\n- При регистрации как продавец — создаётся Seller с полями: storeName, description, logo, requisites, rating, totalSales, commissionPercent\n\n4. Ключевые принципы:\n- Product.sellerId — какой продавец продаёт\n- Order.sellerId — какому продавцу заказ\n- Platform.commissionPercent — процент платформы (по умолчанию 10%)\n- Payment — платёж покупателя (полная сумма)\n- Payout — выплата продавцу (сумма за вычетом комиссии)',
        checks: { create: [
          { title: "Проект создан и запущен", sortOrder: 1 },
          { title: "Архитектура ролей спроектирована", sortOrder: 2 },
          { title: "Зависимости установлены", sortOrder: 3 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s1.id, sortOrder: 1 } });

  // STAGE 2
  const s2 = await db.stage.create({
    data: {
      title: "База данных",
      slug: "marketplace-database",
      icon: "Database",
      sortOrder: 2,
      description: "Схема БД для продавцов, товаров, заказов и выплат",
      decisions: { create: [{
        title: "Схема БД маркетплейса",
        slug: "marketplace-db-schema",
        problem: "Нужна схема поддерживающая несколько продавцов, их товары, заказы и систему комиссий.",
        goal: "Создана схема Prisma с 9 моделями, связи настроены, миграция выполнена",
        recommended: "Модели: User, Seller, Category, Product, Order, OrderItem, Payment, Payout, Review. Связи: Seller 1→M Product, Seller 1→M Order, Order 1→M OrderItem, Order 1→M Payment, Seller 1→M Payout.",
        entities: JSON.stringify([
          "User { id, name, email, role (BUYER|SELLER|ADMIN), createdAt }",
          "Seller { id, userId, storeName, description, logo, requisites, rating, totalSales, commissionPercent }",
          "Category { id, name, slug, image }",
          "Product { id, sellerId, categoryId, name, slug, description, price, images, inStock }",
          "Order { id, userId, sellerId, status, total, commission, address, createdAt }",
          "OrderItem { id, orderId, productId, quantity, price }",
          "Payment { id, orderId, method, status, transactionId, amount }",
          "Payout { id, sellerId, amount, commission, status, period, paidAt }",
          "Review { id, productId, userId, sellerId, rating, text }",
        ]),
        why: "Seller.commissionPercent — индивидуальная комиссия для продавца (можно менять). Payout — учёт выплат с периодами. Review привязан и к товару и к продавцу для рейтинга.",
        xpReward: 50,
        timeEstimate: "1 час",
        sortOrder: 1,
        promptTitle: "Создай схему БД для маркетплейса",
        promptTemplate: 'Создай schema.prisma для маркетплейса по моделям из entities.\n\nВажные детали:\n- User.role: enum BUYER, SELLER, ADMIN\n- Seller.commissionPercent: Float (по умолчанию 10.0 — процент платформы)\n- Order.status: enum (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED)\n- Order.commission: Float — сумма комиссии в рублях (рассчитывается при создании)\n- Payment.status: enum (PENDING, SUCCEEDED, CANCELED)\n- Payout.status: enum (PENDING, PROCESSING, PAID)\n- Seller.totalSales: Int — количество проданных товаров (обновлять при заказе)\n\nСвязи:\n- Seller 1→M Product\n- Seller 1→M Order\n- Order 1→M OrderItem\n- OrderItem → Product\n- Payout → Seller\n\nВыполни миграцию.',
        checks: { create: [
          { title: "9 моделей созданы в schema.prisma", sortOrder: 1 },
          { title: "Связи Seller→Product, Seller→Order", sortOrder: 2 },
          { title: "Миграция выполнена без ошибок", sortOrder: 3 },
          { title: "Prisma Studio открывается", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "schema.prisma", description: "Схема маркетплейса", sortOrder: 1 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s2.id, sortOrder: 2 } });

  // STAGE 3
  const s3 = await db.stage.create({
    data: {
      title: "Регистрация продавцов",
      slug: "marketplace-sellers",
      icon: "UserPlus",
      sortOrder: 3,
      description: "Регистрация продавцов, верификация, личный кабинет",
      decisions: { create: [{
        title: "Онбординг продавца и управление товарами",
        slug: "marketplace-seller-onboarding",
        problem: "Продавец должен зарегистрироваться, заполнить профиль магазина и добавлять товары. Нужна модерация или автоматическая верификация.",
        goal: "Продавец регистрируется, заполняет магазин, добавляет/редактирует товары в личном кабинете",
        recommended: "Регистрация: форма (email, пароль, название магазина). После регистрации — личный кабинет продавца /seller/dashboard с управлением товарами (CRUD), статистикой продаж и заказами.",
        entities: JSON.stringify(["User", "Seller", "Product"]),
        why: "Простой онбординг = больше продавцов. Панель управления товарами = продавец самостоятелен. Проверка на дубликаты slug и валидация цены = качественный каталог.",
        xpReward: 55,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Создай онбординг продавца",
        promptTemplate: 'Создай систему регистрации продавцов.\n\n1. Регистрация:\n- /register — форма: email, пароль, название магазина\n- При сабмите: создаётся User (role=SELLER) + Seller\n- Редирект на /seller/dashboard\n\n2. Личный кабинет продавца /seller/dashboard:\n- Статистика: всего товаров, продаж, рейтинг\n- Вкладки: «Товары», «Заказы», «Выплаты», «Настройки»\n\n3. Управление товарами /seller/products:\n- Список товаров продавца (таблица)\n- Кнопка «Добавить товар» → форма: название, описание, цена, категория, фото\n- Редактирование и удаление\n- Проверка: уникальный slug, цена > 0\n\n4. API:\n- GET/POST /api/seller/products\n- PUT/DELETE /api/seller/products/[id]\n\nПроверяй что пользователь — продавец и товар принадлежит ему.',
        checks: { create: [
          { title: "Регистрация продавца работает", sortOrder: 1 },
          { title: "Продавец видит свой dashboard", sortOrder: 2 },
          { title: "Товар создаётся и отображается в списке", sortOrder: 3 },
          { title: "Редактирование товара работает", sortOrder: 4 },
          { title: "Продавец не может редактировать чужие товары", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s3.id, sortOrder: 3 } });

  // STAGE 4
  const s4 = await db.stage.create({
    data: {
      title: "Общий каталог",
      slug: "marketplace-catalog",
      icon: "LayoutGrid",
      sortOrder: 4,
      description: "Каталог всех товаров со всех продавцов",
      decisions: { create: [{
        title: "Общий каталог маркетплейса",
        slug: "marketplace-catalog-page",
        problem: "Покупатель должен видеть товары всех продавцов в одном каталоге, фильтровать по категориям и цене, искать, видеть магазин продавца.",
        goal: "Страница /catalog с товарами всех продавцов, фильтры, сортировка, карточка товара с информацией о магазине",
        recommended: "Каталог: те же фильтры что в интернет-магазине + фильтр по продавцу. Карточка товара: фото, название, цена, название магазина, рейтинг продавца. Страница товара /product/[slug] с полной информацией и кнопкой «В корзину».",
        entities: JSON.stringify(["Product", "Seller", "Category", "Review"]),
        why: "Общий каталог = конкуренция продавцов = ниже цены. Фильтр по продавцу = покупатель выбирает любимый магазин. Рейтинг на карточке = доверие.",
        xpReward: 55,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Создай общий каталог маркетплейса",
        promptTemplate: 'Создай каталог маркетплейса.\n\n1. /catalog — все товары:\n- Сетка карточек с фото, названием, ценой, названием магазина, рейтингом (★)\n- Фильтры: категория, цена min/max, продавец\n- Сортировка: цена, рейтинг, новизна\n- Поиск по названию\n\n2. /product/[slug] — карточка товара:\n- Фото, название, цена\n- Информация о магазине: название, рейтинг, ссылка на магазин\n- Кнопка «В корзину»\n- Описание товара\n- Отзывы\n- Другие товары этого продавца\n\n3. /seller/[slug] — страница магазина:\n- Название, логотип, описание\n- Все товары продавца\n- Рейтинг и отзывы о продавце\n\nИспользуй Prisma include для загрузки seller и reviews.',
        checks: { create: [
          { title: "Каталог показывает товары всех продавцов", sortOrder: 1 },
          { title: "Фильтры работают", sortOrder: 2 },
          { title: "Карточка товара с магазином", sortOrder: 3 },
          { title: "Страница магазина /seller/[slug]", sortOrder: 4 },
          { title: "Рейтинг отображается", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s4.id, sortOrder: 4 } });

  // STAGE 5
  const s5 = await db.stage.create({
    data: {
      title: "Заказы и комиссии",
      slug: "marketplace-orders",
      icon: "Banknote",
      sortOrder: 5,
      description: "Корзина, оформление заказа, расчёт комиссии платформы",
      decisions: { create: [{
        title: "Система заказов с комиссией",
        slug: "marketplace-order-commission",
        problem: "При заказе у нескольких продавцов нужно: разбить заказ по продавцам, рассчитать комиссию платформы, уведомить каждого продавца о его части заказа.",
        goal: "Заказ создаётся, комиссия рассчитывается, продавцы видят свои заказы в панели",
        recommended: "Один Order = один продавец (упрощение: если в корзине товары разных продавцов — создаётся отдельный Order для каждого). Commission = order.total * seller.commissionPercent / 100. Сохраняется в Order.commission.",
        entities: JSON.stringify(["Order", "OrderItem", "Seller.commissionPercent"]),
        why: "Разбивка заказа по продавцам упрощает логистику: каждый продавец отвечает за свою часть. Комиссия считается при создании заказа и фиксируется (не меняется при изменении процента продавца).",
        xpReward: 60,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Создай систему заказов с комиссией",
        promptTemplate: 'Создай систему заказов и комиссий.\n\n1. Корзина (как в интернет-магазине):\n- Добавление товаров от разных продавцов\n\n2. При оформлении заказа:\n- Сгруппируй товары по sellerId\n- Для каждой группы создай отдельный Order:\n```ts\nconst seller = await db.seller.findUnique({ where: { userId: sellerId } });\nconst commission = subtotal * seller.commissionPercent / 100;\nconst order = await db.order.create({\n  data: {\n    userId, sellerId, total: subtotal,\n    commission, status: \'PENDING\',\n    items: { create: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })) }\n  }\n});\n```\n\n3. В панели продавца /seller/orders:\n- Список заказов с суммой и комиссией\n- Детали заказа: товары, адрес, сумма к выплате (total - commission)\n\n4. Уведомление продавца в Telegram о новом заказе',
        checks: { create: [
          { title: "Заказ создаётся с распределением по продавцам", sortOrder: 1 },
          { title: "Комиссия рассчитывается корректно", sortOrder: 2 },
          { title: "Продавец видит свои заказы", sortOrder: 3 },
          { title: "Сумма к выплате = total - commission", sortOrder: 4 },
          { title: "Telegram-уведомление продавцу", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s5.id, sortOrder: 5 } });

  // STAGE 6
  const s6 = await db.stage.create({
    data: {
      title: "Платежи и выплаты",
      slug: "marketplace-payments",
      icon: "CreditCard",
      sortOrder: 6,
      description: "Приём платежей от покупателей и выплаты продавцам",
      decisions: { create: [{
        title: "Платёжная система: приём и выплаты",
        slug: "marketplace-payment-system",
        problem: "Покупатель платит полную сумму маркетплейсу. Маркетплейс удерживает комиссию и выплачивает остаток продавцу. Нужна схема с холдированием или ручными выплатами.",
        goal: "Покупатель оплачивает заказ, деньги поступают на счёт маркетплейса. Продавец запрашивает выплату, деньги уходят на его ЮKassa-кошелёк.",
        recommended: "Схема: 1) Покупатель платит через ЮKassa → деньги на счёт маркетплейса. 2) Order.status = PAID. 3) Раз в период продавец запрашивает выплату → создаётся Payout. 4) Админ подтверждает выплату через ЮKassa Payouts API.",
        entities: JSON.stringify(["Payment", "Payout", "Seller"]),
        why: "Холдирование на счёте маркетплейса — стандартная модель (Ozon, Wildberries). Выплаты по запросу дают контроль над финансами и возвратами.",
        xpReward: 55,
        timeEstimate: "2.5 часа",
        sortOrder: 1,
        promptTitle: "Настрой платёжную систему маркетплейса",
        promptTemplate: 'Настрой приём платежей и выплаты.\n\n1. Приём оплаты (как в интернет-магазине):\n- ЮKassa, создание платежа на полную сумму заказа\n- Webhook подтверждения\n- После оплаты: Order.status = PAID, обновление Seller.totalSales\n\n2. Запрос выплаты продавцом:\n- В панели /seller/payouts: кнопка «Запросить выплату»\n- Автоматически собирает все PAID заказы без выплат\n- Создаёт Payout: сумма total - commission по всем невыплаченным заказам\n\n3. Админ-панель выплат:\n- /admin/payouts: список запросов на выплату\n- Кнопка «Выплатить» → ЮKassa Payouts API (требует отдельный токен)\n- Payout.status = PAID\n\n4. API:\n- GET/POST /api/seller/payouts\n- PATCH /api/admin/payouts/[id] (подтверждение)\n\nПримечание: для реальных выплат через ЮKassa нужен статус ИП/ООО и подключение услуги «Выплаты».',
        checks: { create: [
          { title: "Платёж покупателя проходит", sortOrder: 1 },
          { title: "Заказ получает статус PAID", sortOrder: 2 },
          { title: "Продавец запрашивает выплату", sortOrder: 3 },
          { title: "Payout создаётся с правильной суммой", sortOrder: 4 },
          { title: "Админ видит запросы на выплату", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s6.id, sortOrder: 6 } });

  // STAGE 7
  const s7 = await db.stage.create({
    data: {
      title: "Деплой",
      slug: "marketplace-deploy",
      icon: "Rocket",
      sortOrder: 7,
      description: "Публикация маркетплейса и настройка безопасности",
      decisions: { create: [{
        title: "Деплой и защита маркетплейса",
        slug: "marketplace-deploy-auth",
        problem: "Маркетплейс обрабатывает деньги — нужна максимальная безопасность. Защита от мошеннических продавцов, защита платежей, авторизация.",
        goal: "Сайт на Vercel, авторизация с ролями, модерация продавцов, безопасные платежи",
        recommended: "1. NextAuth.js с ролями (JWT). 2. Middleware: /seller/* и /admin/* только для соответствующих ролей. 3. Модерация: Seller.isVerified (админ подтверждает). 4. Все переменные окружения в Vercel. 5. HTTPS + CSP.",
        entities: JSON.stringify(["User — с ролями BUYER, SELLER, ADMIN"]),
        why: "Маркетплейс с деньгами = цель для атак. Middleware по ролям блокирует доступ. Верификация продавцов предотвращает спам. HTTPS и CSP защищают данные.",
        xpReward: 35,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        promptTitle: "Опубликуй и защити маркетплейс",
        promptTemplate: 'Опубликуй маркетплейс и настрой защиту.\n\n1. NextAuth.js с JWT и ролями:\n- В JWT callback добавь role\n- В session callback передавай role на клиент\n\n2. Middleware защита маршрутов:\n- /seller/* → role = SELLER или ADMIN\n- /admin/* → role = ADMIN\n- Остальное — публично\n\n3. Верификация продавцов:\n- Seller.isVerified: Boolean (по умолчанию false)\n- Админ в /admin/sellers видит список и подтверждает\n- Товары неверифицированных продавцов скрыты из каталога\n\n4. Vercel деплой:\n- GitHub → Vercel\n- Env: DATABASE_URL, YOOKASSA_SHOP_ID, YOOKASSA_SECRET, NEXTAUTH_SECRET, TELEGRAM_BOT_TOKEN\n\n5. CSP-заголовки в next.config.js',
        checks: { create: [
          { title: "Сайт на Vercel", sortOrder: 1 },
          { title: "Роли в JWT: пользователь видит свою роль", sortOrder: 2 },
          { title: "Middleware блокирует /seller/* для BUYER", sortOrder: 3 },
          { title: "Товары неверифицированных скрыты", sortOrder: 4 },
          { title: "CSP-заголовки работают", sortOrder: 5 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s7.id, sortOrder: 7 } });

  // STAGE 8
  const s8 = await db.stage.create({
    data: {
      title: "Финальная проверка",
      slug: "marketplace-final",
      icon: "CheckCircle",
      sortOrder: 8,
      description: "Полное тестирование маркетплейса",
      decisions: { create: [{
        title: "Тестирование маркетплейса",
        slug: "marketplace-testing",
        problem: "Маркетплейс — самая сложная система. Нужно протестировать все роли: покупатель, продавец, админ.",
        goal: "Все функции работают, маркетплейс готов к запуску",
        recommended: "Протестируй три пути: 1) Покупатель: регистрация → каталог → товар → корзина → заказ → оплата. 2) Продавец: регистрация → заполнение магазина → добавление товаров → получение заказов → запрос выплаты. 3) Админ: верификация продавца → просмотр заказов → подтверждение выплаты.",
        entities: JSON.stringify([]),
        why: "Три роли = три разных пути. Баг у продавца = потеря товаров, баг у покупателя = потеря денег. Полное тестирование всех ролей обязательно.",
        xpReward: 25,
        timeEstimate: "1 час",
        sortOrder: 1,
        checks: { create: [
          { title: "Покупатель: регистрация → заказ → оплата", sortOrder: 1 },
          { title: "Продавец: регистрация → товары → заказы", sortOrder: 2 },
          { title: "Админ: верификация → выплаты", sortOrder: 3 },
          { title: "Комиссия считается правильно", sortOrder: 4 },
          { title: "Рейтинги и отзывы работают", sortOrder: 5 },
          { title: "Мобильная версия проверена", sortOrder: 6 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s8.id, sortOrder: 8 } });

  console.log(`✅ Маркетплейс "${bp.title}" created with 8 stages!`);
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) { console.log("❌ Admin not found — create an admin user first."); return; }

  console.log("🚀 Creating 4 new Blueprints...\n");

  await createCRM();
  await createAIAssistant();
  await createOnlineStore();
  await createMarketplace();

  console.log("\n🎉 All 4 Blueprints created successfully!");
}

main().catch(console.error).finally(() => db.$disconnect());
