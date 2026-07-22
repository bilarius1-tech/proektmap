const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

async function seed() {
  // Update existing 3 patterns with category
  await p.buildPattern.updateMany({ where: { slug: "ai-seo-auditor" }, data: { category: "SaaS и сервисы", isFeatured: true } });
  await p.buildPattern.updateMany({ where: { slug: "ai-consultant" }, data: { category: "Сайты и лендинги", isFeatured: true } });
  await p.buildPattern.updateMany({ where: { slug: "telegram-support-bot" }, data: { category: "Боты и автоматизация" } });
  console.log("Updated 3 existing patterns");

  // 4 new patterns
  const newPatterns = [
    {
      title: "Продающий лендинг с AI", slug: "ai-landing",
      category: "Сайты и лендинги",
      description: "Одностраничный сайт с AI-консультантом, формой захвата и CRM в Telegram. Конвертирует посетителей в заявки.",
      difficulty: "beginner", timeToBuild: "2 дня",
      outcome: JSON.stringify({ revenuePotential: 79, launchTime: "2 дня", complexity: 3, maintenance: "2 часа/неделю" }),
      entities: JSON.stringify([
        { name: "Страница", fields: ["id","блоки","настройки"], relations: "содержит блоки" },
        { name: "Заявка", fields: ["id","имя","телефон","статус"], relations: "создаётся посетителем" },
        { name: "Владелец", fields: ["id","telegramId"], relations: "получает заявки" },
      ]),
      stack: JSON.stringify([
        { tool: "Next.js", why: "Статическая генерация для быстрой загрузки", whyNot: "Чистый HTML — неудобно править", alternatives: ["HTML+CSS","Tilda"] },
        { tool: "OpenAI", why: "AI отвечает на вопросы посетителей", whyNot: "DeepSeek — дешевле, но хуже знает продающие тексты", alternatives: ["DeepSeek"] },
        { tool: "Telegram Bot API", why: "Заявки сразу в телефон владельцу" },
        { tool: "Supabase", why: "Хранение заявок + авторизация владельца" },
      ]),
      architecture: JSON.stringify([
        { phase: "MVP", steps: ["Главный экран с оффером","AI-консультант снизу","Форма захвата","Отправка в Telegram"] },
        { phase: "v2", steps: ["Аналитика конверсии","A/B-тесты заголовков","Мульти-лендинг"] },
      ]),
      evolution: JSON.stringify([
        { version: "v1", desc: "Лендинг + AI-консультант", adds: "Базовая воронка" },
        { version: "v2", desc: "Аналитика + A/B", adds: "Оптимизация конверсии" },
        { version: "v3", desc: "Конструктор лендингов", adds: "Клиенты создают сами" },
      ]),
      mistakes: JSON.stringify([{ title: "Сложный оффер", desc: "Посетитель не понимает что предлагают за 3 секунды", lesson: "Один экран — одна мысль" }]),
      isPublished: true, sortOrder: 4,
    },
    {
      title: "AI Генератор контента", slug: "ai-content-generator",
      category: "SaaS и сервисы",
      description: "Сервис генерации статей, постов и описаний товаров через AI. Настроил тему — получил 10 вариантов.",
      difficulty: "intermediate", timeToBuild: "5 дней",
      outcome: JSON.stringify({ revenuePotential: 149, launchTime: "5 дней", complexity: 5, maintenance: "3 часа/неделю" }),
      entities: JSON.stringify([
        { name: "Пользователь", fields: ["id","email","тариф"], relations: "имеет проекты" },
        { name: "Проект", fields: ["id","userId","тема","ключевые слова"], relations: "содержит генерации" },
        { name: "Генерация", fields: ["id","projectId","тип","текст","статус"], relations: "принадлежит проекту" },
      ]),
      stack: JSON.stringify([
        { tool: "Next.js", why: "App Router + Server Actions для сохранения" },
        { tool: "OpenAI", why: "Генерация текста на русском высокого качества", whyNot: "DeepSeek — дешевле для массовой генерации", alternatives: ["DeepSeek","Claude"] },
        { tool: "Supabase", why: "PostgreSQL для хранения проектов, Realtime для стриминга генерации" },
        { tool: "Stripe/ЮKassa", why: "Подписка: бесплатно 5 генераций, Pro — безлимит" },
      ]),
      architecture: JSON.stringify([
        { phase: "MVP", steps: ["Форма: тема + ключевые слова","AI генерация текста","Сохранение в библиотеку","Экспорт в DOCX"] },
        { phase: "v2", steps: ["Шаблоны: статья, пост, описание товара","История генераций","SEO-анализ текста"] },
      ]),
      evolution: JSON.stringify([
        { version: "v1", desc: "Базовая генерация", adds: "Один тип контента" },
        { version: "v2", desc: "Библиотека + шаблоны", adds: "Разные форматы" },
        { version: "v3", desc: "AI-редактор", adds: "Правка текста в реальном времени" },
      ]),
      mistakes: JSON.stringify([{ title: "Слабый AI", desc: "Первая версия генерировала шаблонный текст", lesson: "Настроить system prompt под нишу клиента" }]),
      isPublished: true, sortOrder: 5,
    },
    {
      title: "Приём заказов через Telegram", slug: "telegram-orders",
      category: "Боты и автоматизация",
      description: "Бот для приёма заказов: каталог товаров, корзина, оплата через ЮKassa. Без сайта — только Telegram.",
      difficulty: "beginner", timeToBuild: "3 дня",
      outcome: JSON.stringify({ revenuePotential: 49, launchTime: "3 дня", complexity: 3, maintenance: "1 час/неделю" }),
      entities: JSON.stringify([
        { name: "Товар", fields: ["id","название","цена","фото","категория"], relations: "в корзинах" },
        { name: "Заказ", fields: ["id","userId","товары","статус","адрес"], relations: "принадлежит пользователю" },
        { name: "Пользователь", fields: ["id","telegramId","имя","адрес"], relations: "делает заказы" },
      ]),
      stack: JSON.stringify([
        { tool: "Node.js + Grammy", why: "Лучшая библиотека для Telegram ботов на JS" },
        { tool: "Supabase", why: "Хранение товаров, заказов, пользователей" },
        { tool: "ЮKassa", why: "Приём платежей прямо в Telegram", whyNot: "Stripe — не работает с российскими картами", alternatives: ["Stripe","CloudPayments"] },
      ]),
      architecture: JSON.stringify([
        { phase: "MVP", steps: ["Команды: /start, /catalog, /cart","Инлайн-клавиатура каталога","Корзина + оформление","Оплата через ЮKassa"] },
        { phase: "v2", steps: ["Админка: добавить товар","Статистика заказов","Уведомления владельцу"] },
      ]),
      evolution: JSON.stringify([
        { version: "v1", desc: "Каталог + заказы", adds: "Базовая торговля" },
        { version: "v2", desc: "Админка + аналитика", adds: "Управление без кода" },
        { version: "v3", desc: "Мини-приложение", adds: "Web App внутри Telegram" },
      ]),
      mistakes: JSON.stringify([{ title: "Слишком много кнопок", desc: "Пользователи терялись в меню", lesson: "Не больше 3-4 кнопок в ряд" }]),
      isPublished: true, sortOrder: 6,
    },
    {
      title: "Дашборд для бизнеса", slug: "business-dashboard",
      category: "SaaS и сервисы",
      description: "Аналитическая панель: графики продаж, воронка клиентов, прогноз. Подключается к базе данных и строит отчёты.",
      difficulty: "advanced", timeToBuild: "14 дней",
      outcome: JSON.stringify({ revenuePotential: 299, launchTime: "14 дней", complexity: 8, maintenance: "6 часов/неделю" }),
      entities: JSON.stringify([
        { name: "Источник данных", fields: ["id","тип","настройки подключения"], relations: "принадлежит проекту" },
        { name: "Дашборд", fields: ["id","название","виджеты"], relations: "содержит виджеты" },
        { name: "Виджет", fields: ["id","тип","настройки","данные"], relations: "принадлежит дашборду" },
        { name: "Пользователь", fields: ["id","email","роль"], relations: "имеет доступ к дашбордам" },
      ]),
      stack: JSON.stringify([
        { tool: "Next.js", why: "SSR для быстрой загрузки данных" },
        { tool: "Prisma + PostgreSQL", why: "Сложные SQL-запросы, агрегации" },
        { tool: "Recharts", why: "Бесплатные графики для React" },
        { tool: "NextAuth + Яндекс OAuth", why: "Авторизация для российских клиентов" },
      ]),
      architecture: JSON.stringify([
        { phase: "MVP", steps: ["Подключение к БД клиента","Авто-построение графиков","Сохранение дашборда","Шаринг по ссылке"] },
        { phase: "v2", steps: ["Конструктор виджетов","Экспорт в PDF","Уведомления при аномалиях"] },
      ]),
      evolution: JSON.stringify([
        { version: "v1", desc: "Подключил БД → дашборд", adds: "Базовая аналитика" },
        { version: "v2", desc: "Конструктор + PDF", adds: "Кастомизация" },
        { version: "v3", desc: "AI-аналитик", adds: "Авто-выводы и рекомендации" },
      ]),
      mistakes: JSON.stringify([{ title: "Медленные запросы", desc: "Прямые SQL на больших данных тормозили", lesson: "Использовать materialized views" }]),
      isPublished: true, sortOrder: 7,
    },
  ];

  for (const pt of newPatterns) {
    await p.buildPattern.upsert({ where: { slug: pt.slug }, update: pt, create: pt }).catch(e => console.log("Skip:", pt.slug));
  }
  console.log("Seeded", newPatterns.length, "new patterns");
  await p.$disconnect();
}
seed();
