export type SiteTreeStatus = "available" | "planned" | "legacy";

export type SiteTreeItem = {
  title: string;
  href?: string;
  description?: string;
  status?: SiteTreeStatus;
  children?: SiteTreeItem[];
};

export type SiteTreeGroup = {
  id: string;
  title: string;
  description: string;
  items: SiteTreeItem[];
};

export const SITE_TREE: SiteTreeGroup[] = [
  {
    id: "start",
    title: "Начать",
    description: "Главные точки входа и поиск по проекту",
    items: [
      { title: "Главная", href: "/", description: "Четыре станции входа и живые маршруты /resheniya" },
      {
        title: "Готовые решения AI",
        href: "/resheniya",
        description: "Маршруты от цели до проверенного продукта",
        children: [
          { title: "Запустить AI-магазин на Авито", href: "/resheniya/avito-business" },
          { title: "Рабочая зона AI-магазина на Авито", href: "/resheniya/avito-business/workspace" },
          { title: "Запустить SaaS-продукт", href: "/resheniya/saas-product" },
          { title: "Рабочая зона SaaS", href: "/resheniya/saas-product/workspace" },
          { title: "Запустить Telegram-бота", href: "/resheniya/telegram-bot" },
          { title: "Рабочая зона Telegram-бота", href: "/resheniya/telegram-bot/workspace" },
          { title: "Премиум-шаблон без AI-скуфа", href: "/resheniya/premium-landing" },
          { title: "Рабочая зона премиум-шаблона", href: "/resheniya/premium-landing/workspace" },
          { title: "AI-агенты для дизайнера", href: "/resheniya/designer-agent" },
          { title: "Рабочая зона дизайнера", href: "/resheniya/designer-agent/workspace" },
          { title: "Собрать контур Grok Bot → Cursor", href: "/resheniya/grok-bot-cursor" },
          { title: "Рабочая зона Grok Bot → Cursor", href: "/resheniya/grok-bot-cursor/workspace" },
          { title: "Создать корпоративный сайт", status: "planned" },
          { title: "Создать CRM-систему", status: "planned" },
          { title: "Запустить интернет-магазин", status: "planned" },
        ],
      },
      {
        title: "Инженерия агентов",
        href: "/agent-engineering",
        description: "Harness → Loop → Graph: окружение агента важнее промпта",
        children: [
          { title: "Harness — каркас вокруг модели", href: "/agent-engineering/harness" },
          { title: "Loop — цикл с проверкой", href: "/agent-engineering/loop" },
          { title: "Graph — карта системы", href: "/agent-engineering/graph" },
          { title: "Правила разработки", href: "/agent-engineering/rules" },
          { title: "Конструктор шаблона сайта", href: "/services/site-template" },
          { title: "Grok Bot — мануал для вайбкодера", href: "/agent-engineering/grok-bot", description: "Коллега с облачным компьютером: skills, плагины, routines" },
        ],
      },
      {
        title: "AI Engineering Skills",
        href: "/ai-skills",
        description: "Skills для усиления агента: Design-кластер, Graph, Recipe и Stack",
        children: [
          { title: "Frontend Design", href: "/ai-skills/frontend-design" },
          { title: "taste-skill", href: "/ai-skills/taste-skill" },
          { title: "Web Design Guidelines", href: "/ai-skills/web-design-guidelines" },
          { title: "Impeccable", href: "/ai-skills/impeccable" },
        ],
      },
      {
        title: "Project Vault",
        href: "/project-vault",
        description: "Инженерные капсулы: DNA + Snapshot без секретов",
        children: [{ title: "Реверанс", href: "/project-vault/reverans" }],
      },
      { title: "Поиск", href: "/search", description: "Поиск по знаниям, инструментам и материалам" },
      { title: "Карта сайта", href: "/sitemap", description: "Полное дерево публичных разделов" },
      { title: "Тарифы", href: "/pricing" },
    ],
  },
  {
    id: "design",
    title: "Спроектировать и собрать",
    description: "Методология, архитектура и готовые строительные блоки",
    items: [
      { title: "AI-Архитектор", href: "/architect", description: "Сущности, стек, стоимость и план из описания идеи" },
      { title: "Методология решений", href: "/decisions" },
      { title: "Паттерны сборки", href: "/patterns", description: "Проверенные архитектуры продуктов" },
      {
        title: "Готовые секции и виджеты",
        href: "/ui-patterns",
        description: "Визуальные UI-паттерны, анатомия и готовые промпты для AI",
        children: [
          { title: "Дизайн-Рецепты экранов", href: "/ui-patterns/recipes" },
          { title: "Конструктор стиля сайта для агента", href: "/services/site-style-builder" },
          { title: "Конструктор шаблона сайта", href: "/services/site-template" },
        ],
      },
      {
        title: "Копилка дизайна",
        href: "/kopilka",
        description: "Кураторская полка: анимации, секции, кнопки, фоны, CodePen — с русским описанием",
      },
      { title: "Решения сообщества", href: "/solutions", description: "Библиотека архитектур, не путать с готовыми маршрутами" },
      { title: "Карта архитектуры", href: "/architecture" },
      {
        title: "Практические пути",
        children: [
          { title: "Новичок: первый проект", href: "/quest/beginner" },
          {
            title: "Вайбик: Миссия №1",
            href: "/vaibik",
            children: [
              { title: "О Вайбике", href: "/vaibik/about" },
              { title: "Квест Вайбика", href: "/vaibik/quest" },
              { title: "Контакты Вайбика", href: "/vaibik/contacts" },
            ],
          },
          { title: "AI Land", href: "/quest/ai-land" },
          { title: "Сайт услуг", href: "/quest/services-site" },
          { title: "Vibe Coding", href: "/vibecraft" },
        ],
      },
    ],
  },
  {
    id: "tools",
    title: "AI-инструменты и интеграции",
    description: "Модели, промпты, Skills и сервисы для выполнения этапов",
    items: [
      { title: "Каталог AI-инструментов", href: "/ai-tools" },
      {
        title: "Нейро каталог",
        href: "/arsenal",
        description: "Стеки AI-инструментов под миссию: порядок, DoD и мост к готовым решениям",
        children: [
          { title: "Локальный AI на ПК", href: "/arsenal/local-ai-pc" },
          { title: "Локальный AI в кармане", href: "/arsenal/local-ai-mobile" },
          { title: "Агент-кодер / вайбкодинг", href: "/arsenal/vibe-coder" },
          { title: "Агенты, скиллы и рабочий контур", href: "/arsenal/mcp-agents" },
          { title: "Голосовой конвейер", href: "/arsenal/voice-pipeline" },
          { title: "Картинки для объявлений", href: "/arsenal/listing-photo" },
          { title: "Этичный ресёрч и мониторинг", href: "/arsenal/ethical-research" },
          { title: "РФ-дружелюбный рабочий набор", href: "/arsenal/rf-stack" },
          { title: "Контент продавца", href: "/arsenal/seller-content" },
          { title: "Короткие видео", href: "/arsenal/short-video" },
          { title: "Промпт-операции", href: "/arsenal/prompt-ops" },
          { title: "Агент на рабочем столе", href: "/arsenal/desktop-agent" },
        ],
      },
      { title: "AI-модели", href: "/models" },
      {
        title: "Шпаргалка промптов",
        href: "/shpargalka",
        description: "Русские шаблоны ChatGPT по профессиям: скопировали и адаптировали",
        children: [
          { title: "Разработчик", href: "/shpargalka/developers" },
          { title: "Дизайнер", href: "/shpargalka/designers" },
          { title: "Маркетолог", href: "/shpargalka/marketers" },
          { title: "Контент", href: "/shpargalka/content" },
          { title: "Excel", href: "/shpargalka/excel" },
          { title: "Поиск работы", href: "/shpargalka/job-hunting" },
          { title: "Образование", href: "/shpargalka/education" },
          { title: "HR", href: "/shpargalka/hr" },
          { title: "Предприниматель", href: "/shpargalka/entrepreneurs" },
          { title: "Сайты", href: "/shpargalka/websites" },
          { title: "Юрист", href: "/shpargalka/lawyers" },
          { title: "Бухгалтер", href: "/shpargalka/accountants" },
          { title: "Журналист", href: "/shpargalka/journalists" },
          { title: "Финансы", href: "/shpargalka/finance" },
          { title: "Книги", href: "/shpargalka/authors" },
          { title: "Коучи", href: "/shpargalka/coaches" },
        ],
      },
      { title: "Промпты", href: "/prompts" },
      { title: "Карта способностей", href: "/skills" },
      { title: "MCP-серверы", href: "/mcp" },
      {
        title: "Песочница",
        href: "/sandbox",
        children: [
          { title: "Креативная библиотека", href: "/sandbox/creative-library" },
          { title: "Вайб-блоки", href: "/sandbox/vibe-blocks" },
          { title: "Дизайн-система", href: "/sandbox/design-system" },
          { title: "Telegram-хаб", href: "/telegram" },
        ],
      },
      {
        title: "Лаборатория Авито",
        href: "/avito",
        description: "Каталог сервисов, расширений и инструментов для продавцов на Авито",
      },
      {
        title: "Микросервисы",
        href: "/services",
        description: "Онлайн-утилиты для работы с медиа, Авито, кодом и промптами",
        children: [
          { title: "Конструктор голосового проводника", href: "/services/voice-guide-builder" },
          { title: "Уникализатор фото для Авито", href: "/services/avito-photo-uniquizer" },
          { title: "Конструктор стиля сайта для агента", href: "/services/site-style-builder" },
          { title: "Конструктор шаблона сайта", href: "/services/site-template" },
          { title: "Калькулятор токенов и стоимости LLM", href: "/services/prompt-token-counter" },
          { title: "SVG в React / Tailwind оптимизатор", href: "/services/svg-to-react-optimizer" },
        ],
      },
    ],
  },
  {
    id: "russia",
    title: "Работа из России",
    description: "Сервисы, инфраструктура и способы работы без зарубежных ограничений",
    items: [
      { title: "Российский AI", href: "/russian-ai" },
      { title: "Российский AI-стек", href: "/russian-ai-stack" },
      { title: "AI без VPN", href: "/ai-without-vpn" },
    ],
  },
  {
    id: "knowledge",
    title: "Знания, новости и примеры",
    description: "Справочники, публикации и реальные AI-проекты",
    items: [
      { title: "Глоссарий", href: "/glossary" },
      {
        title: "Блог",
        href: "/blog",
        children: [
          { title: "Теги", href: "/blog/tags" },
          { title: "Предложить материал", href: "/blog/suggest" },
          { title: "RSS", href: "/blog/rss.xml" },
        ],
      },
      {
        title: "Видеоуроки",
        href: "/video",
        description: "Уроки с VK Video: Craftum Design и практика вайбкодинга",
      },
      {
        title: "AI Цех",
        href: "/ai-workshop",
        description: "Проекты, созданные с помощью AI",
        children: [
          { title: "Добавить работу в портфолио", href: "/projects/new" },
        ],
      },
      { title: "Специалисты", href: "/specialists" },
      {
        title: "Экспериментальные визуализации",
        children: [
          { title: "Граф связей", href: "/graph" },
          { title: "Вселенная проекта", href: "/universe" },
          { title: "Сайт-фильм (Scroll Film)", href: "/demo/scroll-film" },
          { title: "Демо Windows 98", href: "/demo/win98" },
          { title: "Демо Swiss", href: "/demo/swiss" },
        ],
      },
      {
        title: "Практические гайды",
        children: [
          { title: "Как создать Telegram-бота", href: "/kak-sozdat-telegram-bota" },
          { title: "Как создать CRM", href: "/kak-sozdat-crm" },
          { title: "Как создать интернет-магазин", href: "/kak-sozdat-internet-magazin" },
        ],
      },
    ],
  },
  {
    id: "account",
    title: "Аккаунт и личные материалы",
    description: "Вход, профиль, проекты и сохранённые материалы",
    items: [
      { title: "Войти или зарегистрироваться", href: "/auth" },
      {
        title: "Личный кабинет",
        href: "/dashboard",
        children: [
          { title: "Подписка и оплата", href: "/dashboard/billing" },
          { title: "Моя коллекция", href: "/dashboard/collection" },
          { title: "Избранное", href: "/dashboard/favorites" },
          { title: "Закладки блога", href: "/blog/bookmarks" },
        ],
      },
      { title: "Проверка email", href: "/verify" },
    ],
  },
  {
    id: "service",
    title: "Документы и служебные страницы",
    description: "Правовая информация и технические форматы",
    items: [
      { title: "Контакты", href: "/contacts" },
      { title: "Пользовательское соглашение", href: "/terms" },
      { title: "Политика конфиденциальности", href: "/privacy" },
      { title: "Оферта", href: "/offer" },
      { title: "Возврат", href: "/refund" },
      { title: "XML Sitemap", href: "/sitemap.xml" },
      { title: "LLMs.txt", href: "/llms.txt" },
    ],
  },
  {
    id: "legacy",
    title: "Архивные маршруты",
    description: "Старые Blueprint сохранены для пользователей и поисковых ссылок",
    items: [
      { title: "Каталог Blueprint", href: "/blueprints", status: "legacy" },
      { title: "Blueprint Premium", href: "/blueprints-premium", status: "legacy" },
      { title: "Корпоративный сайт", href: "/corporate-website", status: "legacy" },
      { title: "SaaS-проект", href: "/saas-project", status: "legacy" },
      { title: "Разработка игры", href: "/game-dev", status: "legacy" },
    ],
  },
];

function flattenItems(items: SiteTreeItem[]): SiteTreeItem[] {
  return items.flatMap((item) => [item, ...flattenItems(item.children || [])]);
}

export const AVAILABLE_SITE_ROUTES = SITE_TREE.flatMap((group) => flattenItems(group.items))
  .filter((item) => item.href && item.status !== "planned")
  .map((item) => item.href as string);

const XML_EXCLUDE = new Set([
  "/dashboard",
  "/dashboard/billing",
  "/dashboard/collection",
  "/dashboard/favorites",
  "/blog/bookmarks",
  "/projects/new",
  "/verify",
  "/sitemap.xml",
]);

export const PUBLIC_SEO_ROUTES = [...new Set(AVAILABLE_SITE_ROUTES)].filter(
  (href) => !XML_EXCLUDE.has(href) && !href.startsWith("/dashboard"),
);

export type SiteTaskHint = {
  id: string;
  label: string;
  query: string;
  keywords: string[];
  href: string;
};

export const SITE_TASK_HINTS: SiteTaskHint[] = [
  {
    id: "avito",
    label: "Запустить магазин",
    query: "магазин авито",
    keywords: ["магазин", "авито", "продаж", "объявлен", "фид"],
    href: "/resheniya/avito-business",
  },
  {
    id: "saas",
    label: "Собрать SaaS",
    query: "saas сервис",
    keywords: ["saas", "саас", "подписк", "кабинет", "оплат"],
    href: "/resheniya/saas-product",
  },
  {
    id: "bot",
    label: "Сделать бота",
    query: "telegram бот",
    keywords: ["бот", "telegram", "телеграм"],
    href: "/resheniya/telegram-bot",
  },
  {
    id: "stack",
    label: "Подобрать стек",
    query: "нейро каталог стек",
    keywords: ["стек", "инструмент", "арсенал", "модел"],
    href: "/arsenal",
  },
  {
    id: "design",
    label: "Собрать экран",
    query: "ui паттерн секция",
    keywords: ["экран", "ui", "секц", "кнопк", "дизайн"],
    href: "/ui-patterns",
  },
  {
    id: "site-style",
    label: "Снять стиль сайта",
    query: "стиль сайта промпт design",
    keywords: ["стиль", "design.md", "токен", "шрифт", "промпт для дизайна"],
    href: "/services/site-style-builder",
  },
  {
    id: "site-template",
    label: "Собрать шаблон сайта",
    query: "шаблон сайта бриф zip cursor",
    keywords: ["шаблон сайта", "бриф сайта", "html шаблон", "среда сайта"],
    href: "/services/site-template",
  },
];

export const BEGINNER_HIDDEN_GROUPS = new Set(["legacy"]);

const BEGINNER_HIDDEN_HREFS = new Set([
  "/graph",
  "/universe",
  "/demo/scroll-film",
  "/demo/win98",
  "/demo/swiss",
]);

export function isBeginnerHiddenItem(item: SiteTreeItem): boolean {
  if (item.status === "planned" || item.status === "legacy") return true;
  if (item.title === "Экспериментальные визуализации") return true;
  if (item.href && (BEGINNER_HIDDEN_HREFS.has(item.href) || item.href.startsWith("/demo/"))) return true;
  return false;
}

export function filterBeginnerItems(items: SiteTreeItem[]): SiteTreeItem[] {
  return items.flatMap((item) => {
    if (isBeginnerHiddenItem(item)) return [];
    const children = filterBeginnerItems(item.children || []);
    return [{ ...item, children }];
  });
}

export function matchTaskHints(query: string): SiteTaskHint[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return SITE_TASK_HINTS.filter(
    (hint) =>
      hint.keywords.some((keyword) => normalized.includes(keyword) || keyword.includes(normalized)) ||
      hint.label.toLowerCase().includes(normalized) ||
      hint.query.includes(normalized),
  );
}
