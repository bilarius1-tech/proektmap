// seed-telegram-ecosystem.js
// Создаёт Telegram-экосистему: Blueprint, AI Tools, Glossary, Skills, Solutions, Prompts
require('dotenv').config({ path: '/var/www/www-root/data/www/proektmap.ru/.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const crypto = require('crypto');

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

function uid() { return crypto.randomUUID(); }
const NOW = new Date();

async function main() {
  console.log('=== Telegram Ecosystem Seed ===');
  const c = { blueprints:0, stages:0, decisions:0, aiTools:0, glossary:0, skills:0, solutions:0, prompts:0, relations:0 };

  // 1. STAGES
  const stageData = [
    { title:'Архитектура бота', slug:'telegram-arch', description:'Webhook или Polling? aiogram или grammy? Выбираем фундамент.', icon:'GitBranch', sortOrder:1 },
    { title:'База данных', slug:'telegram-db', description:'SQLite или PostgreSQL? Схема данных для пользователей и платежей.', icon:'Database', sortOrder:2 },
    { title:'Платежи и монетизация', slug:'telegram-payments', description:'ЮKassa, Telegram Stars, подписки — как принимать деньги.', icon:'CreditCard', sortOrder:3 },
    { title:'AI-интеграция', slug:'telegram-ai', description:'GPT, RAG, ассистенты — делаем бота умным.', icon:'Brain', sortOrder:4 },
    { title:'Mini App', slug:'telegram-miniapp', description:'React + Telegram Web App API — веб-интерфейс внутри Telegram.', icon:'Smartphone', sortOrder:5 },
    { title:'Запуск и продвижение', slug:'telegram-launch', description:'Хостинг, мониторинг, аналитика, реклама.', icon:'Rocket', sortOrder:6 },
  ];
  const stages = {};
  for (const s of stageData) {
    const ex = await db.stage.findUnique({ where:{slug:s.slug} });
    if (ex) { stages[s.slug]=ex; continue; }
    stages[s.slug] = await db.stage.create({ data:{ id:uid(), ...s, createdAt:NOW } });
    c.stages++;
  }
  console.log('Stages:', c.stages);

  // 2. BLUEPRINT
  const bpSlug = 'telegram-bot';
  let bp = await db.blueprint.findUnique({ where:{slug:bpSlug} });
  if (!bp) {
    bp = await db.blueprint.create({ data:{
      id:uid(), title:'Telegram Бот', slug:bpSlug,
      description:'От идеи до работающего Telegram-бота с платежами, базой данных и AI. 6 этапов, 24 инженерных решения.',
      icon:'Bot', difficulty:'medium', totalXp:520, totalDecisions:24,
      goal:'Создать Telegram-бота с платежами, базой данных и AI-функциями',
      entities:'["User","Product","Order","Payment","Dialog"]',
      checklist:'["Выбрать фреймворк","Настроить БД","Подключить платежи","Интегрировать AI","Запустить Mini App","Опубликовать"]',
      targetAudience:'Начинающие и средние разработчики, предприниматели',
      timeToComplete:'2–3 недели', isPublished:true, sortOrder:10, createdAt:NOW,
    }});
    c.blueprints++;
    let ord = 0;
    for (const s of stageData) {
      await db.blueprintStage.create({ data:{ id:uid(), blueprintId:bp.id, stageId:stages[s.slug].id, sortOrder:ord++ }});
    }
  }
  console.log('Blueprint:', c.blueprints);

  // 3. DECISIONS (24)
  const decs = [
    { stage:'telegram-arch', title:'Webhook или Polling?', slug:'tg-webhook-vs-polling',
      problem:'Как бот будет получать сообщения: постоянно спрашивать сервер (polling) или ждать уведомлений (webhook)?',
      why:'От этого зависит скорость ответа, нагрузка на сервер и стоимость хостинга.',
      recommended:'Webhook для production, Polling для разработки и тестов.',
      content:'**Polling:** Бот каждые N секунд спрашивает Telegram: «Есть новые сообщения?»\n**Webhook:** Telegram сам присылает обновления на твой URL.\nPolling проще в настройке, но создаёт постоянную нагрузку. Webhook требует HTTPS и домен, зато мгновенный.',
      tradeoffs:'Polling: +простота -нагрузка. Webhook: +скорость -сложность.',
      whenNotUse:'Не используй Polling если >100 пользователей.',
      mistakes:'Новички оставляют Polling в production.',
      difficulty:'easy',xpReward:15,timeEstimate:'20 мин',sortOrder:1,
      promptTitle:'Объясни разницу Webhook и Polling для Telegram бота',
      promptTemplate:'Я создаю Telegram бота на {framework}. Объясни разницу между Webhook и Long Polling. Что выбрать для проекта с {users} пользователями?',
    },
    { stage:'telegram-arch', title:'aiogram или grammy?', slug:'tg-aiogram-vs-grammy',
      problem:'Какой фреймворк выбрать для разработки бота?',
      recommended:'aiogram 3.x для Python, grammy для JS/TS.',
      content:'**aiogram** — Python, асинхронный, самая большая экосистема в РФ.\n**grammy** — TypeScript/JS, middleware-архитектура.',
      tradeoffs:'aiogram: +экосистема РФ +документация. grammy: +TypeScript +middleware.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:2,
      promptTitle:'Сравни aiogram и grammy',
      promptTemplate:'Я выбираю фреймворк для Telegram бота. Сравни aiogram 3.x и grammy. Я пишу на {language}.',
    },
    { stage:'telegram-arch', title:'Монолит или микросервисы?', slug:'tg-monolith-vs-micro',
      problem:'Вся логика в одном процессе или разнести на сервисы?',
      recommended:'Начинай с монолита. Выноси в микросервисы при росте.',
      difficulty:'medium',xpReward:20,timeEstimate:'20 мин',sortOrder:3,
      promptTitle:'Монолит или микросервисы для Telegram бота',
      promptTemplate:'Я проектирую бота с функциями: {features}. Монолит или микросервисы?',
    },
    { stage:'telegram-arch', title:'Где хранить состояния пользователей?', slug:'tg-user-state',
      problem:'FSM, Redis или переменные? Как отслеживать шаг пользователя?',
      recommended:'Redis для production, dict в памяти для прототипа.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:4,
      promptTitle:'Хранение состояний в Telegram боте',
      promptTemplate:'Как хранить FSM-состояния в боте ({framework})? Redis или память?',
    },
    // Stage 2
    { stage:'telegram-db', title:'SQLite или PostgreSQL?', slug:'tg-sqlite-vs-pg',
      problem:'Какую БД выбрать для Telegram бота?',
      recommended:'SQLite для <1000 пользователей, PostgreSQL для серьёзных проектов.',
      content:'**SQLite:** файл-база, не требует сервера.\n**PostgreSQL:** сервер БД, конкурентные запросы, репликация.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:1,
      promptTitle:'SQLite или PostgreSQL для бота',
      promptTemplate:'Бот на {users} пользователей. Хранить профили, заказы, диалоги. SQLite или PG?',
    },
    { stage:'telegram-db', title:'ORM или raw SQL?', slug:'tg-orm-vs-raw',
      problem:'Prisma/SQLAlchemy или SQL вручную?',
      recommended:'SQLAlchemy+asyncpg для Python, Prisma для Node.js.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:2,
      promptTitle:'ORM или raw SQL для бота',
      promptTemplate:'Пишу бота на {framework}. ORM или raw SQL? Пример запроса заказов.',
    },
    { stage:'telegram-db', title:'Схема данных для пользователей', slug:'tg-user-schema',
      problem:'Какие поля нужны в таблице users?',
      recommended:'telegram_id, username, created_at. Расширенно: +name, phone, balance, role.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:3,
      promptTitle:'Схема users для Telegram бота',
      promptTemplate:'Спроектируй схему users для бота-магазина. SQL и Prisma-модель.',
    },
    { stage:'telegram-db', title:'Миграции и бэкапы', slug:'tg-migrations-backup',
      problem:'Как обновлять БД без потери данных?',
      recommended:'Alembic для Python, Prisma Migrate для Node.js. pg_dump по крону.',
      difficulty:'medium',xpReward:20,timeEstimate:'25 мин',sortOrder:4,
      promptTitle:'Миграции и бэкапы БД',
      promptTemplate:'Как настроить миграции БД ({framework}) и ежедневные бэкапы?',
    },
    // Stage 3
    { stage:'telegram-payments', title:'ЮKassa или Telegram Stars?', slug:'tg-yookassa-vs-stars',
      problem:'Через что принимать платежи в боте?',
      recommended:'ЮKassa для РФ (карты, СБП). Telegram Stars для digital-товаров.',
      content:'**ЮKassa:** карты, СБП, ЮMoney. Комиссия 3.5%. Нужен договор.\n**Telegram Stars:** внутренняя валюта Telegram. Комиссия ~30% (Apple/Google).',
      difficulty:'medium',xpReward:20,timeEstimate:'25 мин',sortOrder:1,
      promptTitle:'ЮKassa vs Telegram Stars',
      promptTemplate:'Монетизирую бота: {productType}. ЮKassa или Stars? Комиссия, интеграция.',
    },
    { stage:'telegram-payments', title:'Подписка или разовые платежи?', slug:'tg-subscription-vs-onetime',
      problem:'Брать разово или ежемесячную подписку?',
      recommended:'Подписка для AI и контента. Разовые для товаров и услуг.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:2,
      promptTitle:'Подписка или разовые платежи',
      promptTemplate:'Бот делает: {features}. Подписка или разовые? Как через ЮKassa?',
    },
    { stage:'telegram-payments', title:'Чеки и возвраты', slug:'tg-receipts-refunds',
      problem:'Как отправлять чеки по 54-ФЗ и обрабатывать возвраты?',
      recommended:'ЮKassa авто-чеки (нужен ИП/ООО). API refund для возвратов.',
      difficulty:'hard',xpReward:25,timeEstimate:'30 мин',sortOrder:3,
      promptTitle:'Чеки и возвраты в боте',
      promptTemplate:'Принимаю платежи через ЮKassa. Как чеки 54-ФЗ и возвраты?',
    },
    { stage:'telegram-payments', title:'Защита от мошенничества', slug:'tg-antifraud',
      problem:'Как защитить бота от накруток и спама?',
      recommended:'Проверка telegram_id, лимиты, верификация.',
      difficulty:'medium',xpReward:20,timeEstimate:'20 мин',sortOrder:4,
      promptTitle:'Антифрод в Telegram боте',
      promptTemplate:'Как защитить бота от накруток и фейковых платежей?',
    },
    // Stage 4
    { stage:'telegram-ai', title:'GPT-4o или YandexGPT?', slug:'tg-gpt-vs-yandexgpt',
      problem:'Какую AI-модель использовать в боте?',
      recommended:'YandexGPT для доступности без VPN. GPT-4o через прокси для качества.',
      content:'**GPT-4o:** лучшая модель, нужен VPN+карта.\n**YandexGPT:** РФ без VPN, рубли. Качество ниже, но 80% задач решает.\n**GigaChat:** от Сбера, тоже РФ.',
      difficulty:'medium',xpReward:20,timeEstimate:'20 мин',sortOrder:1,
      promptTitle:'GPT-4o vs YandexGPT',
      promptTemplate:'Добавляю AI в бота для: {useCase}. GPT-4o или YandexGPT? Качество, цена, доступность РФ.',
    },
    { stage:'telegram-ai', title:'RAG или fine-tuning?', slug:'tg-rag-vs-finetune',
      problem:'Как научить бота отвечать по моей базе знаний?',
      recommended:'RAG для 90% случаев. Fine-tuning если >1000 пар вопрос-ответ.',
      difficulty:'hard',xpReward:25,timeEstimate:'30 мин',sortOrder:2,
      promptTitle:'RAG или fine-tuning для бота',
      promptTemplate:'База знаний из {count} документов. RAG или fine-tuning? Архитектура.',
    },
    { stage:'telegram-ai', title:'Контекст диалога', slug:'tg-dialog-context',
      problem:'Как AI помнит о чём говорили?',
      recommended:'Redis для краткосрочной памяти, PG для долгосрочной. Суммаризация.',
      difficulty:'medium',xpReward:20,timeEstimate:'25 мин',sortOrder:3,
      promptTitle:'Контекст диалога с AI',
      promptTemplate:'Бот с AI. Как хранить историю? Как ограничить токены? Redis + суммаризация.',
    },
    { stage:'telegram-ai', title:'Ограничение токенов и бюджета', slug:'tg-token-budget',
      problem:'AI-запросы стоят денег. Как не разориться?',
      recommended:'Дневные лимиты на пользователя, кэш, бесплатный лимит → платно.',
      difficulty:'medium',xpReward:20,timeEstimate:'20 мин',sortOrder:4,
      promptTitle:'Бюджетирование AI в боте',
      promptTemplate:'AI в боте, бюджет {budget} руб/мес. Как лимитировать расходы?',
    },
    // Stage 5
    { stage:'telegram-miniapp', title:'React или Vanilla JS?', slug:'tg-react-vs-vanilla',
      problem:'На чём писать Mini App: React или чистый JS?',
      recommended:'React+Vite для сложных. Vanilla JS для простых форм.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:1,
      promptTitle:'React или Vanilla JS для Mini App',
      promptTemplate:'Mini App: {features}. React или Vanilla JS? Структура проекта.',
    },
    { stage:'telegram-miniapp', title:'Авторизация через Telegram', slug:'tg-miniapp-auth',
      problem:'Как понять кто пользователь без повторного входа?',
      recommended:'Проверять hash от initData через HMAC-SHA256 с bot_token.',
      difficulty:'medium',xpReward:20,timeEstimate:'25 мин',sortOrder:2,
      promptTitle:'Авторизация Mini App',
      promptTemplate:'Как проверить initData на бэкенде ({framework})? Код валидации hash.',
    },
    { stage:'telegram-miniapp', title:'Навигация и UI', slug:'tg-miniapp-ui',
      problem:'Как сделать интерфейс похожим на Telegram?',
      recommended:'Telegram UI Kit (tgui), ThemeParams, MainButton/BackButton.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:3,
      promptTitle:'UI/UX Mini App',
      promptTemplate:'Как сделать Mini App нативным? Цвета ThemeParams, MainButton, BackButton.',
    },
    { stage:'telegram-miniapp', title:'Отправка данных в бота', slug:'tg-miniapp-send-data',
      problem:'Как передать данные из Mini App обратно в чат?',
      recommended:'Telegram.WebApp.sendData() + обработка web_app_data.',
      difficulty:'medium',xpReward:20,timeEstimate:'20 мин',sortOrder:4,
      promptTitle:'Mini App → Бот данные',
      promptTemplate:'Форма заказа в Mini App. Как передать данные в бота через sendData?',
    },
    // Stage 6
    { stage:'telegram-launch', title:'Где хостить бота?', slug:'tg-hosting',
      problem:'Beget, TimeWeb, VDS или serverless?',
      recommended:'Beget/TimeWeb VDS для старта (400-800 руб/мес). VPS для роста.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:1,
      promptTitle:'Хостинг для бота в РФ',
      promptTemplate:'Бот ({framework}) для {users} пользователей. Сравни хостинги РФ: цена, аптайм.',
    },
    { stage:'telegram-launch', title:'Мониторинг и алерты', slug:'tg-monitoring',
      problem:'Как узнать что бот упал ДО жалоб пользователей?',
      recommended:'Health-check + Telegram-уведомление админу.',
      difficulty:'medium',xpReward:20,timeEstimate:'20 мин',sortOrder:2,
      promptTitle:'Мониторинг бота',
      promptTemplate:'Как настроить health-check и алерты в Telegram при падении бота?',
    },
    { stage:'telegram-launch', title:'Продвижение бота', slug:'tg-promotion',
      problem:'Как привлечь первых пользователей?',
      recommended:'Каталоги ботов, Telegram Ads, тематические чаты, SEO.',
      difficulty:'easy',xpReward:15,timeEstimate:'15 мин',sortOrder:3,
      promptTitle:'Продвижение Telegram бота',
      promptTemplate:'Запустил бота: {description}. Как привлечь 1000 пользователей?',
    },
    { stage:'telegram-launch', title:'Аналитика и метрики', slug:'tg-analytics',
      problem:'Как понять что бот полезен?',
      recommended:'Bot API статистика. Amplitude/PostHog через Mini App.',
      difficulty:'medium',xpReward:20,timeEstimate:'20 мин',sortOrder:4,
      promptTitle:'Аналитика бота',
      promptTemplate:'Какие метрики отслеживать? DAU, retention, конверсия. Amplitude бесплатно?',
    },
  ];

  for (const d of decs) {
    const ex = await db.decision.findUnique({ where:{slug:d.slug} });
    if (ex) continue;
    await db.decision.create({ data:{
      id:uid(), stageId:stages[d.stage].id,
      title:d.title, slug:d.slug,
      problem:d.problem, why:d.why||'', recommended:d.recommended||'',
      content:d.content||'', tradeoffs:d.tradeoffs||'',
      whenNotUse:d.whenNotUse||'', mistakes:d.mistakes||'',
      difficulty:d.difficulty, xpReward:d.xpReward, timeEstimate:d.timeEstimate,
      promptTitle:d.promptTitle||'', promptTemplate:d.promptTemplate||'',
      impact:'', goal:'', entities:'[]', videos:'[]',
      sortOrder:d.sortOrder, createdAt:NOW,
    }});
    c.decisions++;
  }
  console.log('Decisions:', c.decisions);

  // 4. AI TOOLS
  const aiTools = [
    { name:'aiogram', slug:'aiogram', provider:'Open Source', type:'ide',
      description:'Самый популярный в РФ Python-фреймворк для Telegram ботов. Асинхронный, FSM, Middleware.',
      pros:'["Лучшая документация на русском","FSM из коробки","Асинхронный","Огромное сообщество РФ"]',
      cons:'["Только Python","Крутая кривая обучения FSM"]',
      pricing:'Бесплатно', pricingAmount:'Бесплатно', url:'https://aiogram.dev',
      russianUi:true, russianSupport:true, requiresVpn:false, requiresForeignCard:false,
      bestFor:'telegram боты, Python, aiogram', rating:9, sortOrder:50, isActive:true, createdAt:NOW,
    },
    { name:'grammy', slug:'grammy', provider:'Open Source', type:'ide',
      description:'TypeScript/JS фреймворк для Telegram ботов. Middleware-архитектура, плагины.',
      pros:'["TypeScript из коробки","Middleware как у Express","Плагины"]',
      cons:'["Меньше русскоязычных примеров","Моложе aiogram"]',
      pricing:'Бесплатно', pricingAmount:'Бесплатно', url:'https://grammy.dev',
      russianUi:false, russianSupport:false, requiresVpn:false, requiresForeignCard:false,
      bestFor:'telegram боты, TypeScript, Node.js', rating:8, sortOrder:51, isActive:true, createdAt:NOW,
    },
    { name:'python-telegram-bot', slug:'python-telegram-bot', provider:'Open Source', type:'ide',
      description:'Старейший Python-фреймворк для Telegram Bot API. 20K+ звёзд GitHub.',
      pros:'["Стабильный API","20K+ звёзд","Callback-подход прост для новичков"]',
      cons:'["Меньше фич чем aiogram","Только Python"]',
      pricing:'Бесплатно', pricingAmount:'Бесплатно', url:'https://python-telegram-bot.org',
      russianUi:false, russianSupport:false, requiresVpn:false, requiresForeignCard:false,
      bestFor:'telegram боты, Python новички', rating:7, sortOrder:52, isActive:true, createdAt:NOW,
    },
    { name:'Telethon', slug:'telethon', provider:'Open Source', type:'ide',
      description:'Python-библиотека для Telegram Client API (MTProto). Автоматизация аккаунтов, парсинг.',
      pros:'["Client API","Автоматизация","Парсинг чатов"]',
      cons:'["Не для ботов","Может нарушать ToS"]',
      pricing:'Бесплатно', pricingAmount:'Бесплатно', url:'https://telethon.dev',
      russianUi:false, russianSupport:false, requiresVpn:false, requiresForeignCard:false,
      bestFor:'telegram автоматизация, парсинг', rating:7, sortOrder:53, isActive:true, createdAt:NOW,
    },
    { name:'BotFather', slug:'botfather', provider:'Telegram', type:'no-code',
      description:'Официальный инструмент Telegram для создания ботов. @BotFather в Telegram.',
      pros:'["Официальный","Создание за 1 минуту","Управление токенами"]',
      cons:'["Только создание (не код)"]',
      pricing:'Бесплатно', pricingAmount:'Бесплатно', url:'https://t.me/botfather',
      russianUi:false, russianSupport:false, requiresVpn:false, requiresForeignCard:false,
      bestFor:'telegram боты, создание', rating:10, sortOrder:54, isActive:true, createdAt:NOW,
    },
  ];
  for (const t of aiTools) {
    const ex = await db.aITool.findUnique({ where:{slug:t.slug} });
    if (ex) continue;
    await db.aITool.create({ data:{ id:uid(), ...t } });
    c.aiTools++;
  }
  console.log('AI Tools:', c.aiTools);

  // 5. GLOSSARY
  const glossary = [
    { term:'aiogram', slug:'aiogram', definition:'Асинхронный Python-фреймворк для Telegram ботов. Самый популярный в России.', simpleExplanation:'Библиотека Python для создания Telegram-ботов.', level:'medium', category:'Telegram', sortOrder:200, isPublished:true },
    { term:'grammy', slug:'grammy-gloss', definition:'TypeScript/JS фреймворк для Telegram Bot API с middleware-архитектурой.', simpleExplanation:'То же что aiogram, но на JavaScript/TypeScript.', level:'medium', category:'Telegram', sortOrder:201, isPublished:true },
    { term:'Polling', slug:'polling-gloss', definition:'Метод получения обновлений: бот периодически опрашивает сервер Telegram.', simpleExplanation:'Бот спрашивает Telegram: «Мне написали?» Простой но неэффективный способ.', level:'survival', category:'Telegram', sortOrder:202, isPublished:true },
    { term:'Telegram Bot API', slug:'telegram-bot-api', definition:'HTTP-интерфейс для управления ботами. Отправка сообщений, кнопок, платежей.', simpleExplanation:'Набор команд для управления ботом.', level:'survival', category:'Telegram', sortOrder:203, isPublished:true },
    { term:'Inline Keyboard', slug:'inline-keyboard', definition:'Кнопки под сообщением бота. При нажатии отправляют callback-запрос.', simpleExplanation:'Кнопки под сообщением. Как меню в приложении.', level:'survival', category:'Telegram', sortOrder:204, isPublished:true },
    { term:'Telegram Stars', slug:'telegram-stars', definition:'Внутренняя валюта Telegram для оплаты цифровых товаров в ботах и Mini Apps.', simpleExplanation:'Деньги внутри Telegram для покупок в ботах.', level:'medium', category:'Telegram', sortOrder:205, isPublished:true },
    { term:'Mini App', slug:'mini-app', definition:'Веб-приложение внутри Telegram. Использует Telegram Web App API.', simpleExplanation:'Маленький сайт внутри Telegram.', level:'medium', category:'Telegram', sortOrder:206, isPublished:true },
    { term:'Callback Query', slug:'callback-query', definition:'Запрос от Telegram при нажатии Inline Keyboard. Содержит заданный тобой data.', simpleExplanation:'Сигнал «кнопку нажали» от Telegram к боту.', level:'survival', category:'Telegram', sortOrder:207, isPublished:true },
    { term:'FSM (Finite State Machine)', slug:'fsm-telegram', definition:'Паттерн управления состояниями. Позволяет вести пользователя по шагам диалога.', simpleExplanation:'Машина состояний: анкета шаг 1 → шаг 2 → шаг 3.', level:'medium', category:'Telegram', sortOrder:208, isPublished:true },
    { term:'Long Polling', slug:'long-polling-gloss', definition:'Разновидность Polling: соединение держится открытым пока нет обновлений.', simpleExplanation:'Бот ждёт сообщений с открытым соединением. Быстрее обычного Polling.', level:'survival', category:'Telegram', sortOrder:209, isPublished:true },
    { term:'Middleware', slug:'middleware-telegram', definition:'Промежуточный обработчик. Перехватывает сообщение до основного обработчика.', simpleExplanation:'Проверка на входе: зарегистрирован? не забанен?', level:'medium', category:'Telegram', sortOrder:210, isPublished:true },
  ];
  for (const g of glossary) {
    const ex = await db.glossaryTerm.findUnique({ where:{slug:g.slug} });
    if (ex) continue;
    await db.glossaryTerm.create({ data:{ id:uid(), ...g, createdAt:NOW } });
    c.glossary++;
  }
  console.log('Glossary:', c.glossary);

  // 6. SKILLS
  const skills = [
    { title:'Создание Telegram бота на aiogram', slug:'telegram-bot-aiogram',
      description:'Научись создавать Telegram ботов на Python с aiogram 3.x: от echo-бота до магазина с платежами.',
      skillMd:'# Telegram Bot на aiogram\n\n## Установка\npip install aiogram\n\n## Echo-бот\nfrom aiogram import Bot, Dispatcher, types\n\nbot = Bot(token="TOKEN")\ndp = Dispatcher()\n\n@dp.message()\nasync def echo(message: types.Message):\n    await message.answer(message.text)',
      difficulty:'medium', xpReward:30, timeEstimate:'45 мин', isPublished:true, sortOrder:30, createdAt:NOW,
    },
    { title:'Telegram Mini App на React', slug:'telegram-miniapp-react',
      description:'Создание веб-приложений внутри Telegram: React, Web App API, авторизация.',
      skillMd:'# Mini App на React\n\nnpm create vite@latest mini -- --template react-ts\nnpm install @twa-dev/sdk\n\nimport WebApp from "@twa-dev/sdk";\nWebApp.ready();',
      difficulty:'hard', xpReward:40, timeEstimate:'60 мин', isPublished:true, sortOrder:31, createdAt:NOW,
    },
    { title:'Платежи в Telegram боте', slug:'telegram-payments-skill',
      description:'ЮKassa и Telegram Stars: интеграция, чеки 54-ФЗ, подписки, возвраты.',
      skillMd:'# Платежи\n\n## ЮKassa\nshopId + секретный ключ → API платёж\n\n## Telegram Stars\nbot.send_invoice(currency="XTR", prices=[...])',
      difficulty:'hard', xpReward:40, timeEstimate:'60 мин', isPublished:true, sortOrder:32, createdAt:NOW,
    },
  ];
  for (const s of skills) {
    const ex = await db.skill.findUnique({ where:{slug:s.slug} });
    if (ex) continue;
    await db.skill.create({ data:{ id:uid(), ...s } });
    c.skills++;
  }
  console.log('Skills:', c.skills);

  // 7. SOLUTIONS
  const solutions = [
    { title:'Бот-магазин с Mini App', slug:'tg-shop-bot',
      description:'Готовое решение интернет-магазина в Telegram: каталог, корзина, ЮKassa, Mini App.',
      productType:'E-commerce', complexity:7, mvpDays:'5-7 дней',
      monetization:'Продажа товаров, комиссия',
      costDev:'150000-300000', costAi:'3000-7000', costServer:'500-1500/мес',
      summary:'Полноценный магазин внутри Telegram. Каталог, корзина, оплата, уведомления.',
      stack:'aiogram + FastAPI + React + PostgreSQL + ЮKassa',
      entities:'["User","Product","Cart","Order","Payment"]', isPublished:true, createdAt:NOW,
    },
    { title:'AI-консультант с RAG', slug:'tg-ai-consultant',
      description:'Бот отвечает на вопросы по вашей базе знаний: RAG + LangChain + YandexGPT.',
      productType:'SaaS', complexity:6, mvpDays:'3-5 дней',
      monetization:'Подписка 500-3000/мес',
      costDev:'100000-200000', costAi:'2000-5000', costServer:'800-2000/мес',
      summary:'Загрузите документы — бот отвечает 24/7. RAG, история диалогов, эскалация.',
      stack:'aiogram + LangChain + Qdrant + PostgreSQL + YandexGPT',
      isPublished:true, createdAt:NOW,
    },
    { title:'Бот для приёма заказов', slug:'tg-order-bot',
      description:'Приём заказов через Telegram: каталог, запись, уведомления, Google Sheets.',
      productType:'Service', complexity:4, mvpDays:'2-3 дня',
      monetization:'Экономия на CRM 5000-15000/мес',
      costDev:'60000-120000', costAi:'1000-3000', costServer:'400-800/мес',
      summary:'Бот для малого бизнеса: услуги → время → оплата. Уведомления админу.',
      stack:'aiogram + SQLite + Google Sheets API',
      isPublished:true, createdAt:NOW,
    },
  ];
  for (const s of solutions) {
    const ex = await db.solution.findUnique({ where:{slug:s.slug} });
    if (ex) continue;
    await db.solution.create({ data:{ id:uid(), ...s, authorId:'', authorName:'', votes:0, usageCount:0 } });
    c.solutions++;
  }
  console.log('Solutions:', c.solutions);

  // 8. PROMPTS
  const prompts = [
    { title:'Системный промпт: Архитектор Telegram ботов', slug:'system-architect-tg-bot',
      category:'System', description:'AI-ассистент для проектирования архитектуры Telegram ботов.',
      content:'Ты — AI-Архитектор Telegram ботов.\n1. Спрашивай про ожидаемых пользователей\n2. Предлагай стек под задачу\n3. Учитывай РФ: ЮKassa, YandexGPT, российские хостинги\n4. Давай цифры: стоимость, сроки\n5. Показывай trade-offs',
      tags:'telegram, бот, архитектура', isActive:true, createdAt:NOW,
    },
    { title:'Генератор Telegram бота на aiogram', slug:'tg-bot-generator-aiogram',
      category:'Codegen', description:'Генерирует код бота на aiogram 3.x по описанию.',
      content:'Сгенерируй код Telegram бота (aiogram 3.x):\nОписание: {{description}}\nФункции: {{features}}\nБД: {{database}}\n\nТребования: aiogram 3.x async/await, FSM, обработка ошибок, комментарии на русском, .env для токенов.',
      tags:'telegram, бот, aiogram, код', isActive:true, createdAt:NOW,
    },
    { title:'Генератор Telegram Mini App', slug:'tg-miniapp-generator',
      category:'Codegen', description:'Генерирует код Mini App на React + TypeScript.',
      content:'Сгенерируй Mini App (React+TS):\nФункции: {{features}}\nТип: {{appType}}\n\nТребования: React+TS+Vite, @twa-dev/sdk, Telegram UI стиль, MainButton/BackButton, initData авторизация, sendData.',
      tags:'telegram, mini app, react', isActive:true, createdAt:NOW,
    },
    { title:'System Prompt: Telegram Bot Assistant', slug:'system-tg-bot-assistant',
      category:'System', description:'AI-ассистент для общения с пользователями внутри бота.',
      content:'Ты — AI-ассистент в боте {{botName}}.\n1. Отвечай кратко (до 4000 символов)\n2. MarkdownV2\n3. По теме\n4. Без вредных советов\n5. База знаний: {{knowledgeBase}}\nПользователь: {{userName}} ({{userRole}})',
      tags:'telegram, бот, assistant', isActive:true, createdAt:NOW,
    },
  ];
  for (const p of prompts) {
    const ex = await db.prompt.findUnique({ where:{slug:p.slug} });
    if (ex) continue;
    await db.prompt.create({ data:{ id:uid(), ...p, useCount:0 } });
    c.prompts++;
  }
  console.log('Prompts:', c.prompts);

  // 9. RELATIONS: link everything to blueprint
  for (const g of glossary) {
    await db.relation.create({ data:{ id:uid(), sourceType:'blueprint', sourceSlug:bpSlug, targetType:'glossary', targetSlug:g.slug, weight:5, relType:'explains' } }).catch(()=>{});
    c.relations++;
  }
  for (const s of skills) {
    await db.relation.create({ data:{ id:uid(), sourceType:'blueprint', sourceSlug:bpSlug, targetType:'skill', targetSlug:s.slug, weight:5, relType:'requires' } }).catch(()=>{});
    c.relations++;
  }
  for (const s of solutions) {
    await db.relation.create({ data:{ id:uid(), sourceType:'blueprint', sourceSlug:bpSlug, targetType:'solution', targetSlug:s.slug, weight:4, relType:'example' } }).catch(()=>{});
    c.relations++;
  }
  for (const t of aiTools) {
    await db.relation.create({ data:{ id:uid(), sourceType:'blueprint', sourceSlug:bpSlug, targetType:'aitool', targetSlug:t.slug, weight:4, relType:'uses' } }).catch(()=>{});
    c.relations++;
  }
  for (const p of prompts) {
    await db.relation.create({ data:{ id:uid(), sourceType:'blueprint', sourceSlug:bpSlug, targetType:'prompt', targetSlug:p.slug, weight:3, relType:'uses' } }).catch(()=>{});
    c.relations++;
  }
  console.log('Relations:', c.relations);
  console.log('=== DONE ===');
  console.log(JSON.stringify(c));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
