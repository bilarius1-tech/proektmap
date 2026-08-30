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
      { title: "Главная", href: "/", description: "Центр ProektMap и быстрый вход в готовые решения" },
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
          { title: "Создать корпоративный сайт", status: "planned" },
          { title: "Создать CRM-систему", status: "planned" },
          { title: "Запустить интернет-магазин", status: "planned" },
        ],
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
        ],
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
      { title: "AI-модели", href: "/models" },
      { title: "Промпты", href: "/prompts" },
      { title: "Skills", href: "/skills" },
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
          { title: "Уникализатор фото для Авито", href: "/services/avito-photo-uniquizer" },
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
