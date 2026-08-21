export type AvitoTool = {
  slug: string;
  name: string;
  types: string[];
  categories: string[];
  description: string;
  price: string;
  website: string;
  status: "active" | "changed" | "dead";
  lastChecked: string;
  /** official = работает через официальный Avito API; unofficial = сторонний доступ; none = не относится */
  api: "official" | "unofficial" | "none";
  /** серая зона правил Авито (парсинг, автодействия, мультиаккаунт) */
  risk: boolean;
  /** премиальная витрина наверху каталога */
  featured?: boolean;
  /** короткий слоган для featured-блока */
  highlight?: string;
  /** дополнительные ссылки внутри одной карточки (набор инструментов) */
  links?: { label: string; url: string }[];
};

export type AvitoCategory = {
  slug: string;
  name: string;
  icon: string;
  description: string;
};

export const avitoCategories: AvitoCategory[] = [
  { slug: "analytics", name: "Аналитика", icon: "📊", description: "Спрос, ниши, ключевые слова, конкуренты" },
  { slug: "parsing", name: "Парсинг", icon: "🕷", description: "Сбор объявлений, продавцов, контактов" },
  { slug: "autoposting", name: "Автопостинг", icon: "🚀", description: "Массовое размещение и обновление" },
  { slug: "ai", name: "AI", icon: "🤖", description: "Тексты, заголовки, ответы, обработка фото" },
  { slug: "extensions", name: "Расширения", icon: "🧩", description: "Chrome / Яндекс Браузер" },
  { slug: "crm", name: "CRM и чаты", icon: "💬", description: "Лиды, заказы, автоответы" },
  { slug: "design", name: "Дизайн", icon: "🎨", description: "Карточки, инфографика, фото" },
  { slug: "promotion", name: "Продвижение", icon: "📈", description: "Ставки, реклама, эффективность" },
  { slug: "integrations", name: "Интеграции", icon: "🔌", description: "API, CRM, 1С, МойСклад" },
  { slug: "avitolog", name: "Для авитолога", icon: "🛠", description: "Профессиональные инструменты" },
];

export const avitoTools: AvitoTool[] = [
  // ── Премиум-партнёр ───────────────────────────────────────
  {
    slug: "bananlab",
    name: "BananLab",
    types: ["SaaS"],
    categories: ["autoposting", "avitolog", "analytics", "design"],
    description:
      "Автозагрузка и републикация объявлений, уникализация фото и текста, статистика по клиентам, чат Авито в Telegram. Для авитологов и компаний.",
    price: "от 500 ₽ / аккаунт · 14 дней бесплатно",
    website: "https://bananlab.ru/",
    status: "active",
    lastChecked: "2026-08-21",
    api: "unofficial",
    risk: true,
    featured: true,
    highlight: "Профессиональная автозагрузка для авитологов — премиум в каталоге ProektMap",
  },

  // ── Аналитика ──────────────────────────────────────────────
  {
    slug: "yandex-wordstat",
    name: "Яндекс Вордстат",
    types: ["Web"],
    categories: ["analytics"],
    description: "Спрос и ключевые запросы по нишам Авито — с чего начинать поиск ниши.",
    price: "Бесплатно",
    website: "https://wordstat.yandex.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "google-trends",
    name: "Google Trends",
    types: ["Web"],
    categories: ["analytics"],
    description: "Тренды спроса и сезонность по категориям товаров.",
    price: "Бесплатно",
    website: "https://trends.google.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "keys-so",
    name: "Keys.so",
    types: ["SaaS"],
    categories: ["analytics"],
    description: "Семантика и подбор ключевых слов для карточек объявлений.",
    price: "от 590 ₽/мес",
    website: "https://keys.so",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "mpstats",
    name: "MPStats",
    types: ["SaaS"],
    categories: ["analytics"],
    description: "Аналитика продавцов, товаров и ниш маркетплейсов.",
    price: "Freemium",
    website: "https://mpstats.io",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },

  // ── Парсинг (серая зона) ──────────────────────────────────
  {
    slug: "apify",
    name: "Apify",
    types: ["SaaS", "API"],
    categories: ["parsing", "integrations"],
    description: "Готовые парсеры и автоматизация сбора данных с площадок.",
    price: "Freemium",
    website: "https://apify.com",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: true,
  },
  {
    slug: "octoparse",
    name: "Octoparse",
    types: ["Desktop", "SaaS"],
    categories: ["parsing"],
    description: "Визуальный парсер сайтов без кода.",
    price: "Freemium",
    website: "https://octoparse.com",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: true,
  },

  // ── Автопостинг ───────────────────────────────────────────
  {
    slug: "avito-business-api",
    name: "Avito Business API",
    types: ["API"],
    categories: ["autoposting", "integrations"],
    description: "Официальный API Авито: объявления, сообщения, статистика, продвижение.",
    price: "по тарифам Авито",
    website: "https://developers.avito.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "official",
    risk: false,
  },

  // ── AI ────────────────────────────────────────────────────
  {
    slug: "gigachat",
    name: "GigaChat",
    types: ["AI"],
    categories: ["ai"],
    description: "Русскоязычные тексты: заголовки, описания, ответы клиентам.",
    price: "Freemium",
    website: "https://giga.chat",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "yandexgpt",
    name: "YandexGPT",
    types: ["AI"],
    categories: ["ai"],
    description: "Генерация текстов от Яндекса — описания и заголовки объявлений.",
    price: "Freemium",
    website: "https://aistudio.yandex.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "shedevrum",
    name: "Шедеврум",
    types: ["AI", "Mobile"],
    categories: ["ai", "design"],
    description: "Генерация изображений для карточек товаров.",
    price: "Бесплатно",
    website: "https://shedevrum.ai",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    types: ["AI"],
    categories: ["ai"],
    description: "Заголовки, описания и сценарии ответов клиентам.",
    price: "Freemium",
    website: "https://chatgpt.com",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },

  // ── Расширения ────────────────────────────────────────────
  {
    slug: "avtoolspro",
    name: "AvToolsPro",
    types: ["Расширение"],
    categories: ["extensions", "analytics", "avitolog"],
    description: "Аналитика объявлений, продавцов и поисковых запросов прямо в браузере на Авито.",
    price: "Freemium",
    website: "https://chromewebstore.google.com/detail/cnppacflkmijmiknhacgdllcakjpdhga",
    status: "active",
    lastChecked: "2026-08-21",
    api: "none",
    risk: false,
  },
  {
    slug: "likestats",
    name: "LikeStats",
    types: ["Расширение"],
    categories: ["extensions", "analytics"],
    description: "Анализ выдачи, спроса и конкурентов на Авито прямо на страницах площадки.",
    price: "Freemium",
    website: "https://chromewebstore.google.com/detail/efjdhfpogpilmdljhiinfmfhoppeklel",
    status: "active",
    lastChecked: "2026-08-21",
    api: "none",
    risk: false,
  },
  {
    slug: "avitolog-bez-prikras-kit",
    name: "Набор «Авитолог без прикрас»",
    types: ["Telegram", "Расширение", "Скрипт"],
    categories: ["crm", "extensions", "promotion", "avitolog"],
    description:
      "Четыре рабочих инструмента из канала: Telegram-бот ответов на Авито с автоответами по времени; браузерное приложение (выдача, конкуренты, «Могу сегодня», старые ×2); бесплатный бидер для оплаты за просмотр (до 3 объявлений); скрипт переименования файлов на Яндекс Диске под таблицу.",
    price: "Бесплатно · ИИ-продавец отдельно платно",
    website: "https://t.me/avitolog_bez_prikras",
    status: "active",
    lastChecked: "2026-08-21",
    api: "unofficial",
    risk: true,
    links: [
      { label: "1. Telegram-бот ответов + автоответы по времени", url: "https://t.me/avitolog_bez_prikras/710" },
      { label: "Результаты ИИ-продавца (платно)", url: "https://t.me/avitologi_help/18689" },
      { label: "2. Расширение: выдача, конкуренты, «Могу сегодня», ×2", url: "https://t.me/avitolog_bez_prikras/686" },
      { label: "3. Бесплатный бидер (до 3 объявлений)", url: "https://t.me/avitolog_bez_prikras/831" },
      { label: "4. Переименование файлов на Яндекс Диске", url: "https://t.me/avitolog_bez_prikras/360" },
    ],
  },

  // ── CRM и чаты ────────────────────────────────────────────
  {
    slug: "amocrm",
    name: "amoCRM",
    types: ["SaaS"],
    categories: ["crm"],
    description: "Лиды и сделки, интеграция с чатами Авито.",
    price: "от 499 ₽/мес",
    website: "https://amocrm.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "bitrix24",
    name: "Bitrix24",
    types: ["SaaS"],
    categories: ["crm"],
    description: "CRM, чаты и автоматизация в одном окне.",
    price: "Freemium",
    website: "https://bitrix24.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "retailcrm",
    name: "RetailCRM",
    types: ["SaaS"],
    categories: ["crm", "integrations"],
    description: "Управление заказами и клиентами из Авито.",
    price: "от 990 ₽/мес",
    website: "https://retailcrm.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },

  // ── Дизайн ────────────────────────────────────────────────
  {
    slug: "photoroom",
    name: "Photoroom",
    types: ["SaaS", "Mobile"],
    categories: ["design"],
    description: "Удаление фона и карточки товаров с AI.",
    price: "Freemium",
    website: "https://photoroom.com",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "canva",
    name: "Canva",
    types: ["SaaS"],
    categories: ["design"],
    description: "Дизайн карточек и инфографика по шаблонам.",
    price: "Freemium",
    website: "https://canva.com",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "remove-bg",
    name: "remove.bg",
    types: ["SaaS"],
    categories: ["design"],
    description: "Удаление фона с фото в один клик.",
    price: "Freemium",
    website: "https://remove.bg",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },

  // ── Продвижение ───────────────────────────────────────────
  {
    slug: "avito-promotion",
    name: "Авито Продвижение",
    types: ["Web"],
    categories: ["promotion"],
    description: "Встроенные инструменты продвижения объявлений Авито.",
    price: "по тарифам Авито",
    website: "https://avito.ru/pro",
    status: "active",
    lastChecked: "2026-08-18",
    api: "official",
    risk: false,
  },

  // ── Интеграции ────────────────────────────────────────────
  {
    slug: "albato",
    name: "Albato",
    types: ["SaaS"],
    categories: ["integrations"],
    description: "Связка сервисов и автоматизация без кода.",
    price: "Freemium",
    website: "https://albato.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },
  {
    slug: "n8n",
    name: "n8n",
    types: ["Open Source", "SaaS"],
    categories: ["integrations", "parsing"],
    description: "Автоматизация рабочих процессов с гибкими сценариями.",
    price: "Freemium",
    website: "https://n8n.io",
    status: "active",
    lastChecked: "2026-08-18",
    api: "none",
    risk: false,
  },

  // ── Для авитолога ─────────────────────────────────────────
  {
    slug: "avitolog",
    name: "Авитолог",
    types: ["SaaS", "AI"],
    categories: ["avitolog", "autoposting"],
    description: "Автоматизация работы с Авито: объявления, ответы, цены.",
    price: "по запросу",
    website: "https://avitolog.ru",
    status: "active",
    lastChecked: "2026-08-18",
    api: "unofficial",
    risk: false,
  },
];
