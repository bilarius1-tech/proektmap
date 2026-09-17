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
