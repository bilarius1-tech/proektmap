const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

const nodes = [
  {
    questId: "services-site", stage: 1, sortOrder: 1, nodeType: "decision",
    title: "Canvas ограничений",
    description: "Прежде чем писать код, задаём «коробку», внутри которой будет работать ИИ. Это сэкономит 80% токенов на бесконечных правках.",
    context: "Ты — фрилансер. Клиент хочет сайт для автосервиса в небольшом городе. Бюджет 50 000 ₽, срок 2 недели. Клиент сам будет менять цены и услуги раз в месяц. У него нет технических знаний.",
    question: "Какой масштаб проекта мы закладываем?",
    options: JSON.stringify([
      { id: "opt_small", text: "Визитка на месяц — показать контакты и услуги", consequence: "Можно на чистом HTML. Быстро, но без масштабирования.", prompt: "Создай одностраничный сайт-визитку для автосервиса. Чистый HTML5 + CSS3. Разделы: шапка с логотипом, список услуг (статичный), контакты с картой, форма связи на email. Адаптивный дизайн. Код должен быть простым для редактирования клиентом.", next: "node_2a", xp: 30 },
      { id: "opt_growth", text: "Растущий бизнес на год — с CMS и админкой", consequence: "Next.js + headless CMS. Масштабируемо, но дольше в разработке.", prompt: "Создай архитектуру для сайта автосервиса на Next.js 14 (App Router). Требования: добавление услуг через CMS, форма заявки в Telegram, SEO-оптимизация, скорость < 2 секунд. Опиши структуру папок и список компонентов.", next: "node_2b", xp: 50 },
      { id: "opt_big", text: "Высоконагруженный сервис — много интеграций", consequence: "Нереалистично за 50к и 2 недели. Нужно увеличить бюджет или упростить.", prompt: "Клиент хочет сложный сервис, но бюджет 50к и 2 недели. Составь список MVP-функций, которые реально сделать, и что отложить на этап 2. Предложи реалистичный техстек.", next: "node_2c", xp: 40 },
    ]),
    aiModeratorPrompt: "Если пользователь выбрал «Высоконагруженный сервис» — предупреди о нереалистичности и спроси: «Готов ли клиент увеличить бюджет до 200к+ или упростить требования?»",
  },
  {
    questId: "services-site", stage: 1, sortOrder: 2, nodeType: "decision",
    title: "Выбор стека",
    description: "Для масштабируемого проекта нужен стек, который выдержит рост. Не переусложняем.",
    context: "Клиент планирует добавлять услуги и, возможно, запустить блог. Нужна админка, где он сам сможет менять контент.",
    question: "Какую CMS использовать для управления контентом?",
    options: JSON.stringify([
      { id: "opt_strapi", text: "Strapi — headless CMS, self-hosted", consequence: "Полный контроль, бесплатно, но нужно хостить отдельно. Сложнее для клиента.", prompt: "Настрой Strapi CMS. Создай типы контента: Service (название, цена, описание, фото), ContactForm (имя, телефон, сообщение). Настрой API. Интегрируй с Next.js через SWR для кэширования.", next: "node_3", xp: 70 },
      { id: "opt_sanity", text: "Sanity — headless CMS, облачная", consequence: "Проще для клиента, интерфейс как Google Docs. Платно при большом трафике.", prompt: "Настрой Sanity CMS. Создай схему Service и ContactForm. Настрой GROQ-запросы в Next.js. Добавь preview-режим чтобы клиент видел изменения до публикации.", next: "node_3", xp: 60 },
      { id: "opt_markdown", text: "Markdown-файлы в Git — для простого MVP", consequence: "Быстро и бесплатно, но клиент сам не сможет менять. Только для старта.", prompt: "Создай структуру /content/services/*.md с frontmatter (title, price, description). Напиши функцию парсинга Markdown в Next.js. Настрой SSG для статических страниц услуг.", next: "node_3", xp: 40 },
    ]),
    aiModeratorPrompt: "Проверь: если выбрали Markdown — напомни что клиент не сможет сам менять цены. Предложи Google Таблицы как компромисс.",
  },
  {
    questId: "services-site", stage: 2, sortOrder: 3, nodeType: "design",
    title: "Данные раньше UI",
    description: "Главное правило AI-инжиниринга: сначала спроектируй структуру данных, потом генерируй интерфейс. Это защитит от переписывания кода.",
    context: "Стек выбран. Теперь определяем сущности — из чего состоит сайт и как они связаны. Без этого ИИ сгенерирует красивый UI с хардкодом, который придётся переписывать.",
    question: "Какие сущности нужны для сайта автосервиса?",
    options: JSON.stringify([
      { id: "opt_basic", text: "Service + Category + ContactForm (базовый)", consequence: "Минимальная структура для старта. Легко расширить позже.", prompt: "Создай Prisma schema: Service (id, title, description, price, duration, categoryId, imageUrl), Category (id, name, slug), ContactForm (id, name, phone, message, serviceId, status, createdAt). Добавь связи между моделями.", next: "node_4", xp: 60 },
      { id: "opt_full", text: "+ TeamMember + Review (расширенный)", consequence: "Готовность к масштабированию. Больше сущностей = больше возможностей.", prompt: "Создай Prisma schema с моделями: Service, Category, ContactForm, TeamMember (id, name, position, photo, bio), Review (id, author, rating, text, serviceId). Добавь индексы для частых запросов и каскадное удаление.", next: "node_4", xp: 80 },
    ]),
    aiModeratorPrompt: "Проверь, добавил ли пользователь поле status в ContactForm. Без него нельзя сделать фильтр «Новые заявки» в админке. Если нет — предложи добавить.",
  },
  {
    questId: "services-site", stage: 3, sortOrder: 4, nodeType: "implementation",
    title: "Атомарная генерация",
    description: "Не проси ИИ «сделать главную страницу». Разбивай на атомарные компоненты. Это экономит токены и упрощает отладку.",
    context: "Схема данных готова. Теперь генерируем UI по кусочкам. Правило: один компонент = один промпт.",
    question: "С чего начать генерацию кода?",
    options: JSON.stringify([
      { id: "opt_components", text: "Сначала базовые UI-компоненты (Button, Card, Input)", consequence: "Правильный подход. Переиспользуемые компоненты экономят недели.", prompt: "Создай переиспользуемые компоненты на Next.js + Tailwind: Button (primary/secondary, sm/md/lg), Card (заголовок, описание, картинка), Input (с валидацией и лейблом). TypeScript. Без лишних библиотек.", next: "node_5", xp: 70 },
      { id: "opt_sections", text: "Сразу секции (Hero, Services, ContactForm)", consequence: "Быстрее, но больше дублирования. Придётся рефакторить позже.", prompt: "Создай секции главной страницы: Hero (заголовок, CTA), ServicesSection (сетка карточек из API), ContactForm (форма с отправкой). Tailwind. Обработай loading и error состояния.", next: "node_5", xp: 50 },
    ]),
  },
  {
    questId: "services-site", stage: 4, sortOrder: 5, nodeType: "checklist",
    title: "Pre-Flight проверка",
    description: "Перед деплоем проверяем что сайт готов к продакшену. Это не генерация нового кода, а модификация существующего.",
    context: "Код написан. Осталось проверить безопасность, SEO и производительность — три вещи, которые чаще всего забывают.",
    question: "Что проверяем перед запуском?",
    options: JSON.stringify([
      { id: "opt_seo", text: "SEO и метатеги — чтобы сайт находили", consequence: "Без этого сайт не попадёт в поиск.", prompt: "Добавь динамические meta-теги (title, description, OG) для всех страниц. Создай sitemap.xml и robots.txt. Добавь Schema.org LocalBusiness разметку. Проверь через Яндекс.Вебмастер.", next: "node_6", xp: 50 },
      { id: "opt_security", text: "Безопасность — защита от спама", consequence: "Форма без защиты = спам-боты завалят заявками.", prompt: "Добавь защиту формы: rate limiting (5 заявок/IP/час), Zod-валидацию на сервере, CSRF-токен. Настрой Telegram-уведомления о новых заявках и подозрительной активности.", next: "node_6", xp: 60 },
      { id: "opt_analytics", text: "Аналитика — знать что происходит", consequence: "Без аналитики вы не узнаете работает ли сайт.", prompt: "Подключи Яндекс.Метрику с вебвизором и целями. Добавь Sentry для отлова JS-ошибок. Настрой UptimeRobot для мониторинга доступности. Уведомления в Telegram при падении.", next: "node_6", xp: 50 },
    ]),
  },
  {
    questId: "services-site", stage: 4, sortOrder: 6, nodeType: "implementation",
    title: "Деплой и CI/CD",
    description: "Автоматизируй деплой чтобы не заливать файлы вручную. Правильный CI/CD = меньше человеческих ошибок.",
    context: "Всё проверено. Пора запускать в продакшен.",
    question: "Как настроить деплой?",
    options: JSON.stringify([
      { id: "opt_vercel", text: "Vercel + GitHub Actions (для Next.js)", consequence: "Стандарт индустрии. Бесплатно для небольших проектов. Авто-деплой при пуше.", prompt: "Настрой авто-деплой на Vercel через GitHub: создай vercel.json, настрой environment variables для production/preview, добавь protection rules для main ветки. Проверь что preview-деплои работают для PR.", next: "node_7", xp: 60 },
      { id: "opt_beget", text: "Beget VPS + PM2 (для российских проектов)", consequence: "Российский хостинг, полный контроль. Нужно настраивать вручную.", prompt: "Настрой деплой на Beget VPS: установи Node.js, настрой Nginx reverse proxy, запусти через PM2 с автоперезапуском. Настрой HTTPS через Let's Encrypt. Создай deploy.sh скрипт для автоматизации.", next: "node_7", xp: 70 },
    ]),
  },
  {
    questId: "services-site", stage: 4, sortOrder: 7, nodeType: "documentation",
    title: "Документация и передача",
    description: "Хорошая документация = меньше вопросов от клиента в будущем. Это часть профессиональной работы.",
    context: "Сайт запущен. Нужно передать его клиенту так, чтобы он мог сам управлять контентом.",
    question: "Что включить в документацию для клиента?",
    options: JSON.stringify([
      { id: "opt_full_doc", text: "README + видео-инструкция + FAQ", consequence: "Профессиональный подход. Клиент сможет сам менять контент без вас.", prompt: "Напиши README.md: описание, технологии, установка, деплой, структура. Сними 5-минутное видео: как добавить услугу, как посмотреть заявки. Создай FAQ из 10 частых вопросов с решениями.", next: null, xp: 70 },
      { id: "opt_min_doc", text: "Только README.md (минимум)", consequence: "Клиент будет звонить по каждому вопросу. Экономия сейчас = потеря времени потом.", prompt: "Напиши README.md: как запустить, где лежат переменные, куда писать при проблемах. Добавь раздел «Частые операции» с командами для типовых задач (добавить услугу, сменить цены).", next: null, xp: 40 },
    ]),
  },
];

const edges = [
  { questId: "services-site", sourceId: "node_1", targetId: "node_2a", condition: "opt_small" },
  { questId: "services-site", sourceId: "node_1", targetId: "node_2b", condition: "opt_growth" },
  { questId: "services-site", sourceId: "node_1", targetId: "node_2c", condition: "opt_big" },
  { questId: "services-site", sourceId: "node_2a", targetId: "node_3", condition: "" },
  { questId: "services-site", sourceId: "node_2b", targetId: "node_3", condition: "" },
  { questId: "services-site", sourceId: "node_2c", targetId: "node_3", condition: "" },
  { questId: "services-site", sourceId: "node_3", targetId: "node_4", condition: "" },
  { questId: "services-site", sourceId: "node_4", targetId: "node_5", condition: "" },
  { questId: "services-site", sourceId: "node_5", targetId: "node_6", condition: "" },
  { questId: "services-site", sourceId: "node_6", targetId: "node_7", condition: "" },
];

async function seed() {
  // Delete existing
  await p.questEdge.deleteMany({ where: { questId: "services-site" } });
  await p.questNode.deleteMany({ where: { questId: "services-site" } });

  // Create nodes
  for (const n of nodes) {
    await p.questNode.create({ data: { ...n, id: n.sortOrder === 1 ? "node_1" : n.sortOrder <= 2 ? `node_2${n.sortOrder === 2 ? "b" : String.fromCharCode(96 + n.sortOrder)}` : "node_" + n.sortOrder, isPublished: true } });
  }

  // Create edges
  for (const e of edges) {
    await p.questEdge.create({ data: e });
  }

  console.log("Seeded", nodes.length, "nodes and", edges.length, "edges");
  await p.$disconnect();
}
seed();
