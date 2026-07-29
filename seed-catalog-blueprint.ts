// Seed: Эталонный Blueprint «Сайт компании с каталогом и заказом через Telegram и почту»
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) { console.log("Admin not found"); return; }

  // Find or create Blueprint
  let bp = await db.blueprint.findFirst({ where: { slug: "company-catalog" } });
  if (bp) {
    console.log("Blueprint exists, skipping...");
    return;
  }

  bp = await db.blueprint.create({
    data: {
      title: "Сайт компании с каталогом и заказом",
      slug: "company-catalog",
      description: "Корпоративный сайт с каталогом товаров, корзиной и оформлением заказа через Telegram и email. Полный цикл от идеи до запуска.",
      icon: "Globe",
      difficulty: "medium",
      isPublished: true,
      sortOrder: 1,
      totalXp: 620,
      totalDecisions: 8,
      goal: "Ты создашь полноценный сайт компании: главная страница, каталог товаров с фильтрами, корзина, оформление заказа. Заказ приходит в Telegram и на email. Сайт опубликован, настроен SEO.",
      entities: JSON.stringify([
        "User — пользователи сайта",
        "Product — товары в каталоге",
        "Category — категории товаров",
        "Cart — корзина",
        "CartItem — товары в корзине",
        "Order — заказы",
        "Company — реквизиты компании",
      ]),
      checklist: JSON.stringify([
        "Главная страница с описанием компании",
        "Каталог товаров с фильтрацией",
        "Корзина работает",
        "Заказ уходит в Telegram и email",
        "Сайт опубликован на Vercel",
        "SEO: meta-теги, sitemap, robots.txt",
      ]),
      artifacts: JSON.stringify([
        "GitHub репозиторий",
        "Сайт на Vercel",
        "schema.prisma с 7 моделями",
        "Telegram бот для уведомлений",
      ]),
      targetAudience: "Малый бизнес, производители, оптовые компании",
      timeToComplete: "3 недели по 1-2 часа в день",
    },
  });

  // ====== STAGE 1: Подготовка ======
  const s1 = await db.stage.create({
    data: {
      title: "Подготовка проекта",
      slug: "catalog-setup",
      icon: "Rocket",
      sortOrder: 1,
      description: "Настройка окружения и первый запуск проекта",
      decisions: {
        create: [
          {
            title: "Выбор стека и создание проекта",
            slug: "catalog-choose-stack",
            problem: "Нужно выбрать правильный стек технологий для сайта компании. От этого зависит скорость разработки и стоимость поддержки.",
            goal: "Создан проект Next.js с TypeScript и Tailwind, запущен локально",
            recommended: "Используй Next.js (App Router) + TypeScript + Tailwind CSS. Это даст: серверный рендеринг для SEO, типизацию, быструю верстку и удобный деплой на Vercel.",
            entities: JSON.stringify(["Project — корневая папка с package.json"]),
            why: "Next.js — индустриальный стандарт для коммерческих сайтов. TypeScript ловит ошибки до запуска. Tailwind ускоряет верстку в 3 раза.",
            xpReward: 25,
            timeEstimate: "30 мин",
            sortOrder: 1,
            promptTitle: "Создай проект Next.js для сайта компании",
            promptTemplate: 'Действуй как senior Next.js разработчик. Создай проект Next.js 14 с App Router, TypeScript и Tailwind CSS.\n\nКоманды:\n1. npx create-next-app@latest company-site --typescript --tailwind --eslint --app --src-dir\n2. cd company-site && npm run dev\n\nПроверь что:\n- Проект запускается на http://localhost:3000\n- Tailwind работает\n- TypeScript не выдает ошибок\n\nОбъясни структуру папок простыми словами.',
            checks: { create: [
              { title: "Node.js установлен (node -v)", sortOrder: 1 },
              { title: "Проект создан через create-next-app", sortOrder: 2 },
              { title: "npm run dev запускается без ошибок", sortOrder: 3 },
              { title: "Страница открывается на localhost:3000", sortOrder: 4 },
            ]},
            artifacts: { create: [
              { title: "package.json", description: "Конфигурация проекта и зависимости", sortOrder: 1 },
              { title: "tailwind.config.ts", description: "Настройка Tailwind", sortOrder: 2 },
            ]},
          },
        ],
      },
    },
  });

  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s1.id, sortOrder: 1 } });

  // ====== STAGE 2: База данных ======
  const s2 = await db.stage.create({
    data: {
      title: "База данных",
      slug: "catalog-database",
      icon: "Database",
      sortOrder: 2,
      description: "Проектирование и создание базы данных",
      decisions: {
        create: [
          {
            title: "Проектирование схемы БД",
            slug: "catalog-db-schema",
            problem: "Нужно спроектировать базу данных для каталога, корзины и заказов.",
            goal: "Создана схема Prisma с 7 моделями, база синхронизирована",
            recommended: "Используй PostgreSQL + Prisma. Создай модели: User, Company, Category, Product, Cart, CartItem, Order. Связи: Product → Category (многие-к-одному), CartItem → Product и Cart, Order → User.",
            entities: JSON.stringify([
              "User { id, name, email, phone, createdAt }",
              "Company { id, name, phone, email, telegramChatId, address }",
              "Category { id, name, slug, image }",
              "Product { id, name, slug, description, price, images, categoryId, inStock }",
              "Cart { id, userId, createdAt }",
              "CartItem { id, cartId, productId, quantity }",
              "Order { id, userId, items, total, status, createdAt }",
            ]),
            why: "Prisma даёт типобезопасность и автогенерацию миграций. PostgreSQL — бесплатно, быстро, масштабируемо.",
            xpReward: 40,
            timeEstimate: "45 мин",
            sortOrder: 1,
            promptTitle: "Создай схему Prisma для сайта компании",
            promptTemplate: 'Действуй как backend-архитектор. Создай schema.prisma для сайта компании с каталогом и заказами.\n\nМодели:\n- User: id, name, email, phone, createdAt\n- Company: id, name, phone, email, telegramChatId, address\n- Category: id, name, slug, image\n- Product: id, name, slug, description, price, images (Json), categoryId, inStock\n- Cart: id, userId, createdAt\n- CartItem: id, cartId, productId, quantity\n- Order: id, userId, items (Json), total, status, createdAt\n\nИспользуй PostgreSQL. Добавь связи: Product→Category, CartItem→Product, Order→User.\n\nНапиши команды для миграции.',
            checks: { create: [
              { title: "schema.prisma создан со всеми моделями", sortOrder: 1 },
              { title: "npx prisma migrate dev выполнен без ошибок", sortOrder: 2 },
              { title: "npx prisma studio открывается", sortOrder: 3 },
              { title: "Все связи между моделями корректны", sortOrder: 4 },
            ]},
            artifacts: { create: [
              { title: "schema.prisma", description: "Схема базы данных", sortOrder: 1 },
              { title: "migrations/", description: "Файлы миграций", sortOrder: 2 },
            ]},
          },
        ],
      },
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s2.id, sortOrder: 2 } });

  // ====== STAGE 3: Главная страница ======
  const s3 = await db.stage.create({
    data: {
      title: "Главная страница",
      slug: "catalog-homepage",
      icon: "Home",
      sortOrder: 3,
      description: "Верстка главной страницы с hero, преимуществами и каталогом",
      decisions: {
        create: [
          {
            title: "Верстка главной страницы",
            slug: "catalog-homepage-layout",
            problem: "Главная страница — лицо компании. Нужен современный дизайн с hero-секцией, каталогом товаров и контактами.",
            goal: "Главная страница с hero, преимуществами, популярными товарами и контактами",
            recommended: "Создай layout с компонентами: Hero (заголовок, описание, CTA), Features (3 преимущества), PopularProducts (сетка из 6 товаров из БД), Contacts (адрес, телефон, форма связи).",
            entities: JSON.stringify(["Company — реквизиты для контактов", "Product — популярные товары для сетки"]),
            why: "Главная страница должна за 5 секунд объяснить что за компания и какие товары. Hero + преимущества + товары = посетитель понимает и идёт в каталог.",
            xpReward: 35,
            timeEstimate: "1 час",
            sortOrder: 1,
            promptTitle: "Сверстай главную страницу сайта компании",
            promptTemplate: 'Ты frontend-разработчик. Сверстай главную страницу сайта компании на Next.js + Tailwind.\n\nКомпоненты:\n1. Hero — заголовок компании, описание, кнопка «Смотреть каталог»\n2. Features — 3 карточки преимуществ (качество, доставка, поддержка)\n3. PopularProducts — запрос к БД, сетка из 6 товаров\n4. Contacts — телефон, email, кнопка Telegram\n\nДизайн: светлый, чистый, акцентный зелёный #0FB880. Используй серверные компоненты Next.js.',
            checks: { create: [
              { title: "Hero-секция с заголовком и CTA", sortOrder: 1 },
              { title: "3 карточки преимуществ", sortOrder: 2 },
              { title: "Сетка из 6 товаров из БД", sortOrder: 3 },
              { title: "Блок контактов с Telegram-кнопкой", sortOrder: 4 },
            ]},
          },
        ],
      },
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s3.id, sortOrder: 3 } });

  // ====== STAGE 4: Каталог ======
  const s4 = await db.stage.create({
    data: {
      title: "Каталог товаров",
      slug: "catalog-products",
      icon: "Package",
      sortOrder: 4,
      description: "Страница каталога с фильтрацией и поиском",
      decisions: {
        create: [
          {
            title: "Каталог с фильтрацией и карточкой товара",
            slug: "catalog-product-list",
            problem: "Нужен каталог где покупатель может фильтровать товары по категории, цене и искать по названию.",
            goal: "Страница каталога с фильтрами по категории и поиском, страница товара с описанием и кнопкой «В корзину»",
            recommended: "Создай /catalog/page.tsx с серверным fetch товаров. Фильтры: категория (select), поиск (input). Карточка товара: фото, название, цена, кнопка «В корзину». Страница товара /catalog/[slug] с детальным описанием.",
            entities: JSON.stringify(["Product — товары с полями name, price, images, description"]),
            why: "Фильтрация + поиск = покупатель находит нужный товар за 10 секунд. Карточка товара с фото и ценой = решение о покупке.",
            xpReward: 45,
            timeEstimate: "1.5 часа",
            sortOrder: 1,
            promptTitle: "Создай каталог товаров с фильтрацией",
            promptTemplate: 'Создай каталог товаров для Next.js сайта компании.\n\nСтраницы:\n1. /catalog — список товаров с фильтрацией по категории\n2. /catalog/[slug] — детальная страница товара\n\nКомпоненты:\n- ProductGrid — сетка карточек\n- ProductCard — фото, название, цена, кнопка «В корзину»\n- CategoryFilter — выпадающий список категорий\n- SearchInput — поиск по названию\n\nИспользуй Prisma для запросов к БД. Серверные компоненты для SEO.',
            checks: { create: [
              { title: "Страница /catalog отображает товары", sortOrder: 1 },
              { title: "Фильтр по категории работает", sortOrder: 2 },
              { title: "Поиск по названию работает", sortOrder: 3 },
              { title: "Страница товара открывается по slug", sortOrder: 4 },
              { title: "Кнопка «В корзину» на карточке товара", sortOrder: 5 },
            ]},
          },
        ],
      },
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s4.id, sortOrder: 4 } });

  // ====== STAGE 5: Корзина ======
  const s5 = await db.stage.create({
    data: {
      title: "Корзина и оформление заказа",
      slug: "catalog-cart-checkout",
      icon: "ShoppingCart",
      sortOrder: 5,
      description: "Корзина покупок и форма оформления заказа",
      decisions: {
        create: [
          {
            title: "Корзина и оформление заказа",
            slug: "catalog-cart-order",
            problem: "Покупатель выбрал товары. Нужна корзина где можно изменить количество, и форма заказа с отправкой в Telegram и email.",
            goal: "Работающая корзина с изменением количества и форма заказа с отправкой уведомлений",
            recommended: "Храни корзину в localStorage для гостей и в БД для авторизованных. Форма заказа: имя, телефон, email. После отправки — запись в БД, уведомление в Telegram бот и email компании.",
            entities: JSON.stringify(["Cart — корзина пользователя", "CartItem — товары в корзине", "Order — оформленный заказ"]),
            why: "Корзина в localStorage = работает без регистрации. Уведомления в Telegram и email = менеджер мгновенно видит заказ.",
            xpReward: 50,
            timeEstimate: "2 часа",
            sortOrder: 1,
            promptTitle: "Создай корзину и форму заказа",
            promptTemplate: 'Создай систему корзины и заказов для Next.js.\n\n1. Корзина:\n- Контекст CartContext для состояния\n- localStorage для хранения\n- Страница /cart — таблица товаров, изменение кол-ва, удаление\n- Итого сумма заказа\n\n2. Оформление:\n- Форма: имя, телефон, email, комментарий\n- POST /api/orders — сохраняет заказ в БД\n- Отправка в Telegram через Bot API (используй переменную TELEGRAM_BOT_TOKEN)\n- Отправка email через Resend или Nodemailer\n\nИспользуй Prisma для сохранения заказа.',
            checks: { create: [
              { title: "Кнопка «В корзину» добавляет товар", sortOrder: 1 },
              { title: "Страница /cart показывает все товары", sortOrder: 2 },
              { title: "Количество можно изменить", sortOrder: 3 },
              { title: "Форма заказа отправляется", sortOrder: 4 },
              { title: "Уведомление приходит в Telegram", sortOrder: 5 },
            ]},
          },
        ],
      },
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s5.id, sortOrder: 5 } });

  // ====== STAGE 6: Telegram и Email ======
  const s6 = await db.stage.create({
    data: {
      title: "Уведомления: Telegram + Email",
      slug: "catalog-notifications",
      icon: "Bell",
      sortOrder: 6,
      description: "Настройка Telegram-бота и email-уведомлений о заказах",
      decisions: {
        create: [
          {
            title: "Telegram бот и Email уведомления",
            slug: "catalog-telegram-email",
            problem: "Менеджер должен мгновенно узнавать о новых заказах. Нужен Telegram бот для уведомлений и email-дубль.",
            goal: "При новом заказе: сообщение в Telegram с деталями + письмо на email компании",
            recommended: "1. Telegram: создай бота через @BotFather, получи токен. В API /api/orders после сохранения заказа отправляй POST на api.telegram.org с форматированным сообщением. 2. Email: используй Resend (бесплатно 100 писем/день) или Nodemailer с SMTP.",
            entities: JSON.stringify(["Company.telegramChatId — ID чата для уведомлений", "Company.email — email для заказов"]),
            why: "Telegram — мгновенная доставка, менеджер видит заказ в телефоне. Email — резервная копия и юридическая значимость.",
            xpReward: 35,
            timeEstimate: "1 час",
            sortOrder: 1,
            promptTitle: "Настрой Telegram бота и email для заказов",
            promptTemplate: 'Настрой уведомления о заказах.\n\nTelegram:\n1. Создай бота через @BotFather, получи токен\n2. Добавь TELEGRAM_BOT_TOKEN в .env\n3. В API /api/orders после создания заказа:\n   - Форматируй сообщение: «Новый заказ #123\\nИмя: ...\\nТелефон: ...\\nСумма: ...»\n   - Отправляй fetch на https://api.telegram.org/bot{TOKEN}/sendMessage\n\nEmail:\n1. Установи resend: npm install resend\n2. Добавь RESEND_API_KEY в .env\n3. Отправляй email с деталями заказа',
            checks: { create: [
              { title: "Telegram бот создан через @BotFather", sortOrder: 1 },
              { title: "TELEGRAM_BOT_TOKEN в .env", sortOrder: 2 },
              { title: "Сообщение приходит в Telegram при заказе", sortOrder: 3 },
              { title: "Email приходит при заказе", sortOrder: 4 },
            ]},
          },
        ],
      },
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s6.id, sortOrder: 6 } });

  // ====== STAGE 7: Деплой и SEO ======
  const s7 = await db.stage.create({
    data: {
      title: "Деплой и SEO",
      slug: "catalog-deploy-seo",
      icon: "Globe",
      sortOrder: 7,
      description: "Публикация сайта и настройка поисковой оптимизации",
      decisions: {
        create: [
          {
            title: "Деплой на Vercel и SEO-оптимизация",
            slug: "catalog-deploy",
            problem: "Сайт работает локально. Нужно опубликовать в интернет и сделать так чтобы Яндекс и Google его находили.",
            goal: "Сайт опубликован на Vercel, настроены meta-теги, sitemap.xml, robots.txt, Яндекс.Метрика",
            recommended: "1. Vercel: свяжи GitHub репозиторий → автоматический деплой. 2. SEO: динамические meta-теги через generateMetadata, sitemap.ts с товарами, robots.txt. 3. Аналитика: Яндекс.Метрика через next/script.",
            entities: JSON.stringify(["Product — для sitemap товаров"]),
            why: "Vercel = бесплатный хостинг с авто-деплоем из GitHub. SEO без meta-тегов = сайта нет в поиске. Метрика = ты видишь посетителей.",
            xpReward: 30,
            timeEstimate: "1 час",
            sortOrder: 1,
            promptTitle: "Опубликуй сайт и настрой SEO",
            promptTemplate: 'Опубликуй сайт и настрой SEO.\n\n1. Vercel:\n- Импортируй GitHub репозиторий на vercel.com\n- Добавь env переменные (DATABASE_URL, TELEGRAM_BOT_TOKEN, RESEND_API_KEY)\n- Deploy\n\n2. SEO:\n- В layout.tsx: export const metadata с title, description, keywords\n- В /catalog/[slug]: generateMetadata для каждого товара\n- Создай app/sitemap.ts с товарами и категориями\n- Создай public/robots.txt\n\n3. Яндекс.Метрика:\n- Зарегистрируй сайт на metrika.yandex.ru\n- Добавь ID в .env\n- Вставь код через <Script> в layout.tsx',
            checks: { create: [
              { title: "Сайт открывается по URL Vercel", sortOrder: 1 },
              { title: "meta-теги заполнены на всех страницах", sortOrder: 2 },
              { title: "sitemap.xml отображает товары", sortOrder: 3 },
              { title: "robots.txt доступен", sortOrder: 4 },
              { title: "Яндекс.Метрика установлена", sortOrder: 5 },
            ]},
          },
        ],
      },
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s7.id, sortOrder: 7 } });

  // ====== STAGE 8: Финальная проверка ======
  const s8 = await db.stage.create({
    data: {
      title: "Финальная проверка и запуск",
      slug: "catalog-final",
      icon: "CheckCircle",
      sortOrder: 8,
      description: "Проверка всего функционала перед передачей клиенту",
      decisions: {
        create: [
          {
            title: "Полное тестирование и запуск",
            slug: "catalog-testing",
            problem: "Перед тем как отдать сайт клиенту нужно проверить что всё работает: каталог, корзина, заказы, уведомления, мобильная версия.",
            goal: "Все функции протестированы, сайт готов к передаче клиенту",
            recommended: "Пройди по всему пользовательскому пути: открыл главную → посмотрел каталог → добавил в корзину → оформил заказ → проверил Telegram и email. Проверь мобильную версию на телефоне. Исправь найденные ошибки.",
            entities: JSON.stringify([]),
            why: "Одна ошибка в оформлении заказа = потерянный клиент. Полный цикл тестирования = уверенность что всё работает.",
            xpReward: 20,
            timeEstimate: "45 мин",
            sortOrder: 1,
            checks: { create: [
              { title: "Главная страница открывается", sortOrder: 1 },
              { title: "Каталог и фильтры работают", sortOrder: 2 },
              { title: "Корзина: добавить, изменить, удалить", sortOrder: 3 },
              { title: "Заказ: форма отправляется", sortOrder: 4 },
              { title: "Уведомления: Telegram + email получены", sortOrder: 5 },
              { title: "Мобильная версия проверена", sortOrder: 6 },
            ]},
          },
        ],
      },
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s8.id, sortOrder: 8 } });

  console.log(`✅ Blueprint "${bp.title}" created with 8 stages!`);
}

main().catch(console.error).finally(() => db.$disconnect());
