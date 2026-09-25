export type HomeStation = {
  id: string;
  title: string;
  kicker: string;
  href: string;
  description: string;
  cta: string;
  primary?: boolean;
};

export type HomeLiveRoute = {
  href: string;
  title: string;
  result: string;
  duration: string;
};

export const HOME_STATIONS: HomeStation[] = [
  {
    id: "route",
    title: "Пройти готовый маршрут",
    kicker: "Главный вход",
    href: "/resheniya",
    description: "Стек, команды и проверки уже выбраны. Вы выполняете шаги до работающего продукта.",
    cta: "Открыть готовые решения",
    primary: true,
  },
  {
    id: "architect",
    title: "Спроектировать свою идею",
    kicker: "Если маршрута ещё нет",
    href: "/architect",
    description: "Опишите идею и получите сущности, стек, стоимость и план реализации.",
    cta: "Открыть AI-Архитектор",
  },
  {
    id: "tools",
    title: "Взять инструмент на задачу",
    kicker: "Стек и утилиты",
    href: "/arsenal",
    description: "Готовые стеки под миссию и онлайн-утилиты, если уже понятно, что строить.",
    cta: "Открыть нейро каталог",
  },
  {
    id: "learn",
    title: "Понять, как это устроено",
    kicker: "Методика",
    href: "/agent-engineering",
    description: "Каркас агента, цикл с проверкой и Skills — когда нужно понять систему, а не собрать продукт сегодня.",
    cta: "Открыть инженерию агентов",
  },
];

export const HOME_LIVE_ROUTES: HomeLiveRoute[] = [
  {
    href: "/resheniya/saas-product",
    title: "SaaS-продукт",
    result: "Пользователь входит в кабинет, проходит AI-сценарий и тестовую оплату.",
    duration: "4–8 недель",
  },
  {
    href: "/resheniya/telegram-bot",
    title: "Telegram-бот",
    result: "Публичный бот отвечает на /start, живёт на VPS, токен не попадает в Git.",
    duration: "1–3 дня",
  },
  {
    href: "/resheniya/avito-business",
    title: "AI-магазин на Авито",
    result: "Каталог из 20+ карточек через фид и AI-ассистент на входящие лиды.",
    duration: "2–4 дня",
  },
];

export const HOME_START_EXAMPLE = {
  bad: "Покажи все разделы и инструменты, я сам разберусь, что запускать.",
  good: "Открой готовый маршрут SaaS на /resheniya/saas-product и выполни первый этап до наблюдаемого результата.",
  why: "Каталог не говорит, что делать сейчас. Маршрут уже спроектирован — его нужно пройти.",
};

export const HOME_MORE_LAYERS = [
  { href: "/ui-patterns", label: "UI-паттерны" },
  { href: "/kopilka", label: "Копилка" },
  { href: "/services", label: "Микросервисы" },
  { href: "/video", label: "Видео" },
  { href: "/blog", label: "Блог" },
  { href: "/sitemap", label: "Полная карта" },
];

export type HomeHubDirectoryItem = {
  href: string;
  title: string;
  subtitle: string;
};

export type HomeHubDirectoryGroup = {
  station: string;
  items: HomeHubDirectoryItem[];
};

/** Сетка хаба на главной: название раздела + ссылка, по 4 станциям. */
export const HOME_HUB_DIRECTORY: HomeHubDirectoryGroup[] = [
  {
    station: "Решения",
    items: [
      { href: "/resheniya", title: "Готовые решения", subtitle: "Маршруты до работающего продукта" },
      { href: "/resheniya/saas-product", title: "SaaS-продукт", subtitle: "Кабинет, AI-сценарий, оплата" },
      { href: "/resheniya/telegram-bot", title: "Telegram-бот", subtitle: "Публичный бот на VPS" },
      { href: "/vaibik", title: "Вайбик", subtitle: "Игровой вход в вайбкодинг" },
    ],
  },
  {
    station: "Собрать",
    items: [
      { href: "/ui-patterns", title: "UI-паттерны", subtitle: "Атлас интерфейсов с промптами" },
      { href: "/kopilka", title: "Копилка", subtitle: "Референсы и капсулы дизайна" },
      { href: "/project-vault", title: "Project Vault", subtitle: "ДНК проектов и капсулы" },
      { href: "/architect", title: "AI-Архитектор", subtitle: "Идея → сущности и стек" },
    ],
  },
  {
    station: "Инструменты",
    items: [
      { href: "/arsenal", title: "Нейро каталог", subtitle: "Стеки и AI-инструменты" },
      { href: "/services", title: "Микросервисы", subtitle: "Утилиты прямо в браузере" },
      { href: "/avito", title: "Авито", subtitle: "Инструменты для продавцов" },
      { href: "/shpargalka", title: "Шпаргалка", subtitle: "Промпты по ролям" },
    ],
  },
  {
    station: "Научиться",
    items: [
      { href: "/agent-engineering", title: "Инженерия агентов", subtitle: "Каркас и цикл с проверкой" },
      { href: "/ai-skills", title: "AI Skills", subtitle: "Как писать skills для агента" },
      { href: "/blog", title: "Блог", subtitle: "Гайды и поисковые активы" },
      { href: "/video", title: "Видео", subtitle: "Уроки с VK Video" },
      { href: "/glossary", title: "Глоссарий", subtitle: "Термины AI простым языком" },
    ],
  },
];
