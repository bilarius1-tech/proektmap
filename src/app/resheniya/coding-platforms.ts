/**
 * Стек AI-платформ для кодинга: Cursor (основной), Reasonix (DeepSeek/CN), OpenCode.
 * Данные для шага «Где работать» — UI только рендерит.
 */

export type CodingPlatform = {
  id: "cursor" | "reasonix" | "opencode";
  name: string;
  tagline: string;
  /** Короткий стек / из чего состоит */
  stack: string[];
  /** Для кого / когда брать */
  bestFor: string;
  recommend: "primary" | "alt" | "alt-open";
  recommendLabel: string;
  website: string;
  websiteLabel: string;
  arsenalHref?: string;
  pros: string[];
  cons: string[];
  /** Оплата / VPN кратко */
  payVpn: string;
};

export const CODING_PLATFORMS: CodingPlatform[] = [
  {
    id: "cursor",
    name: "Cursor",
    tagline: "AI-редактор: основной путь ProektMap",
    stack: [
      "IDE на базе VS Code",
      "Встроенный Agent / Chat",
      "Rules, Skills, AGENTS.md",
      "Модели: Claude / GPT / свои через настройки",
      "Оплата: зарубежная карта (Плати по миру)",
    ],
    bestFor: "Маршруты /resheniya, вайбкодинг с визуальным редактором, новичок после оплаты",
    recommend: "primary",
    recommendLabel: "Рекомендуем",
    website: "https://cursor.com",
    websiteLabel: "cursor.com",
    arsenalHref: "/ai-tools/cursor",
    pros: [
      "Удобный UI: файлы, diff, Agent в одном окне",
      "Лучше всего стыкуется с Skills и маршрутами ProektMap",
      "Sign in with GitHub — один аккаунт на код и биллинг",
      "Много готовых гайдов и примеров под Windows",
    ],
    cons: [
      "Подписка Pro платная (~$20/мес)",
      "Из РФ нужна карта вроде Плати по миру",
      "Закрытый продукт: меньше контроля, чем у open-source агентов",
    ],
    payVpn: "Оплата зарубежной картой. VPN для сайта обычно не нужен.",
  },
  {
    id: "reasonix",
    name: "Reasonix",
    tagline: "Open-source агент под экосистему DeepSeek (китайский стек)",
    stack: [
      "Локальный движок (CLI / desktop / редактор)",
      "DeepSeek API (свой ключ) — native под prefix-cache",
      "Plan mode, права, checkpoint сессий",
      "MCP и долгие автономные прогоны",
      "MIT, код открыт (reasonix.io)",
    ],
    bestFor: "Кто хочет дешёвые длинные сессии на DeepSeek и open-source вместо западной IDE",
    recommend: "alt",
    recommendLabel: "Альтернатива · DeepSeek",
    website: "https://reasonix.io",
    websiteLabel: "reasonix.io",
    arsenalHref: "/arsenal/tools/reasonix",
    pros: [
      "Заточен под DeepSeek: долгие сессии дешевле за счёт cache",
      "Код и ключ у вас: движок локально, MIT",
      "Терминал + desktop + редактор — один движок",
      "Хороший запасной путь, если Cursor дорог или недоступен",
    ],
    cons: [
      "Меньше «IDE из коробки», чем Cursor — больше настройка",
      "Нужен API-ключ DeepSeek и понимание терминала/конфига",
      "Маршруты ProektMap описаны в первую очередь под Cursor",
      "Документация частично на EN/CN — новичку тяжелее",
    ],
    payVpn: "DeepSeek API оплачивается отдельно. Установка open-source — без подписки Cursor.",
  },
  {
    id: "opencode",
    name: "OpenCode",
    tagline: "Открытый кодинг-агент: терминал, desktop, IDE",
    stack: [
      "TUI / desktop / расширение редактора",
      "Любые модели через провайдеров (75+)",
      "LSP, мультисессии, privacy-first",
      "Установка: opencode.ai / scoop / npm",
      "Свободный open-source агент",
    ],
    bestFor: "Кто хочет open-source агента с выбором моделей и работой из терминала",
    recommend: "alt-open",
    recommendLabel: "Альтернатива · Open-source",
    website: "https://opencode.ai",
    websiteLabel: "opencode.ai",
    arsenalHref: "/arsenal/tools/opencode",
    pros: [
      "Полностью открытый агент, большой community",
      "Подключаете почти любую модель / провайдера",
      "Не хранит ваш код у себя — удобно для чувствительных проектов",
      "Есть в Нейро каталоге ProektMap (/arsenal)",
    ],
    cons: [
      "UX ближе к терминалу/агенту, не к привычной IDE Cursor",
      "На Windows часто рекомендуют WSL — порог выше",
      "Качество сильно зависит от выбранной модели и настройки",
      "Меньше готовых «кнопочных» маршрутов под /resheniya",
    ],
    payVpn: "Сам агент бесплатный; платите за модели провайдера. VPN зависит от выбранного API.",
  },
];
