/** Вайб-блоки — каталог UI-китов с промптами для агента (без БД). */

export type VibePrice = "free" | "freemium" | "paid";
export type VibeAgentMode = "prompt" | "mcp" | "cli" | "docs";
export type VibeFamily =
  | "animation"
  | "landing"
  | "foundation"
  | "agent-ui"
  | "design-system";

export type VibeKit = {
  slug: string;
  name: string;
  tagline: string;
  family: VibeFamily;
  price: VibePrice;
  stack: string;
  agentMode: VibeAgentMode[];
  tasks: string[];
  bestFor: string[];
  notFor: string[];
  strengths: string[];
  caveats: string[];
  examples: string[];
  agentPrompt: string;
  siteUrl: string;
  russiaNote: string;
  pairsWith: string[];
  alternatives: string[];
  featured?: boolean;
  sortOrder: number;
};

export type VibeScenario = {
  id: string;
  title: string;
  desc: string;
  why: string;
  kitSlugs: string[];
  easier: string[];
  harder: string[];
  agentBrief: string;
  tip: string;
};

export const FAMILY_META: Record<
  VibeFamily,
  { label: string; short: string; desc: string }
> = {
  animation: {
    label: "Анимация и эффекты",
    short: "Анимация",
    desc: "Текст, фон, motion, «вау» без сборки страницы с нуля.",
  },
  landing: {
    label: "Секции лендинга",
    short: "Лендинг",
    desc: "Hero, pricing, FAQ, CTA — готовые блоки страницы.",
  },
  foundation: {
    label: "База компонентов",
    short: "База",
    desc: "Кнопки, формы, диалоги — то, на чём держится UI.",
  },
  "agent-ui": {
    label: "UI для AI-приложений",
    short: "AI UI",
    desc: "Чат, стриминг, tool calls, артефакты агента.",
  },
  "design-system": {
    label: "Дизайн-системы",
    short: "Система",
    desc: "Токены, Figma, MCP, правила для агента.",
  },
};

export const PRICE_LABEL: Record<VibePrice, string> = {
  free: "Бесплатно",
  freemium: "Free + Pro",
  paid: "Платно",
};

export const AGENT_MODE_LABEL: Record<VibeAgentMode, string> = {
  prompt: "Copy prompt",
  mcp: "MCP",
  cli: "CLI / registry",
  docs: "Документация",
};

export const TASK_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Все задачи" },
  { id: "landing", label: "Лендинг" },
  { id: "motion", label: "Анимация" },
  { id: "ai-app", label: "AI-приложение" },
  { id: "agent", label: "Работа с агентом" },
  { id: "system", label: "Дизайн-система" },
];

export const VIBE_SCENARIOS: VibeScenario[] = [
  {
    id: "landing-evening",
    title: "Лендинг за вечер",
    desc: "Нужна страница: hero → фичи → цены → FAQ.",
    why: "Не собирай с нуля кнопки и секции. Возьми базу shadcn + готовые блоки, агенту дай 2–3 референса.",
    kitSlugs: ["shadcn-ui", "shadcn-blocks", "tailark"],
    easier: ["21st-dev"],
    harder: ["untitled-ui"],
    agentBrief: `Собери лендинг на Next.js + Tailwind.
База компонентов: shadcn/ui.
Секции возьми как референс со страниц:
- https://proektmap.ru/sandbox/vibe-blocks/shadcn-blocks
- https://proektmap.ru/sandbox/vibe-blocks/tailark
Структура: Hero, логотипы/доверие, Features (bento), Pricing, FAQ, CTA, Footer.
Без лишних карточек и фиолетовых градиентов. Один визуальный якорь в hero.
Код в репозитории, без npm-обёрток поверх shadcn.`,
    tip: "Сначала структура секций, потом polish. Не мешай 5 разных китов в одной странице.",
  },
  {
    id: "wow-motion",
    title: "Вау-анимации",
    desc: "Сайт выглядит «как с Dribbble», агент не умеет сам придумать motion.",
    why: "Покажи агенту конкретный эффект из OriginKit / Magic / Aceternity — он повторит паттерн, а не угадает.",
    kitSlugs: ["originkit", "magic-ui", "aceternity"],
    easier: ["motion-primitives"],
    harder: ["cult-ui"],
    agentBrief: `Нужен polished motion на лендинге (Next.js + Tailwind + Motion).
Референсы и промпты:
- https://proektmap.ru/sandbox/vibe-blocks/originkit
- https://proektmap.ru/sandbox/vibe-blocks/magic-ui
Сделай: animated hero text, лёгкий background effect, 1 marquee или bento с hover.
Обязательно: prefers-reduced-motion, на mobile упрости анимации, не убивай FPS.
Не ставь 5 WebGL-фонов сразу.`,
    tip: "Один «вау» на экран. Остальное — спокойная типографика.",
  },
  {
    id: "ai-chat-ui",
    title: "Интерфейс AI-чата",
    desc: "Нужны сообщения, стриминг, tool calls, статус агента.",
    why: "Обычные UI-киты плохо закрывают chat/streaming. Бери специализированные AI UI kits.",
    kitSlugs: ["vllnt-ui", "prompt-kit", "cult-ui"],
    easier: ["shadcn-ui"],
    harder: ["fragments-ui"],
    agentBrief: `Собери UI AI-чата на React + Tailwind.
Референсы:
- https://proektmap.ru/sandbox/vibe-blocks/vllnt-ui
- https://proektmap.ru/sandbox/vibe-blocks/prompt-kit
Нужны: список сообщений, streaming text, tool-call display, input composer, loading/empty states.
Доступность: клавиатура, aria-live для стрима.
Стили — нейтральные, без «AI-purple» клише.`,
    tip: "Сначала каркас чата, потом красивости. Streaming и scroll — самое хрупкое.",
  },
  {
    id: "agent-max",
    title: "Максимум для агента",
    desc: "Хочешь, чтобы Cursor/Claude сам находил компоненты, а не галлюцинировал props.",
    why: "MCP + machine-readable registry + CLAUDE.md/AGENT.md резко снижают ошибки агента.",
    kitSlugs: ["originkit", "fragments-ui", "untitled-ui", "21st-dev"],
    easier: ["shadcn-ui", "kibo-ui"],
    harder: [],
    agentBrief: `Работай только через указанные UI-реестры.
Карточки ProektMap:
- https://proektmap.ru/sandbox/vibe-blocks/originkit
- https://proektmap.ru/sandbox/vibe-blocks/fragments-ui
- https://proektmap.ru/sandbox/vibe-blocks/21st-dev
Сначала найди подходящий компонент (MCP / prompt / CLI), потом установи в проект.
Не выдумывай API props — читай registry/docs.
Стек: Next.js + Tailwind + TypeScript.`,
    tip: "Один источник правды на проект. Смешивать Untitled + Aceternity без правил = каша.",
  },
];

export const VIBE_KITS: VibeKit[] = [
  {
    slug: "originkit",
    name: "OriginKit",
    tagline: "Анимированные блоки + MCP и AI Prompt для агента.",
    family: "animation",
    price: "freemium",
    stack: "React / Next / Vite / Framer · CSS / Tailwind",
    agentMode: ["mcp", "prompt", "cli"],
    tasks: ["motion", "landing", "agent"],
    bestFor: [
      "Нужен конкретный эффект (текст, фон, курсор, hero) с превью",
      "Хочешь отдать агенту MCP/промпт, а не описывать анимацию словами",
      "Framer или React — один каталог",
    ],
    notFor: [
      "Нужна полная дизайн-система форм и таблиц",
      "Строгий enterprise UI без motion",
      "Проект без анимаций вообще",
    ],
    strengths: [
      "Превью эффектов (часто видео) — глаз сразу понимает результат",
      "MCP: list/search/get_component под стек",
      "Категории: hero, text, background, cursor, gallery…",
    ],
    caveats: [
      "Доставка исходников может требовать API key / квоту",
      "Не заменяет shadcn для форм и data UI",
      "Легко переборщить motion на одном экране",
    ],
    examples: ["Hero text unfold", "Background particles/mesh", "Cursor trails", "Image gallery motion"],
    agentPrompt: `Используй OriginKit как источник анимированных UI-блоков.
Сайт: https://www.originkit.dev
Карточка ProektMap: https://proektmap.ru/sandbox/vibe-blocks/originkit

Задача: добавь в мой Next.js + Tailwind проект 1–2 анимированных блока (hero text + лёгкий background).
1) Найди подходящие компоненты в OriginKit (MCP или каталог).
2) Установи/адаптируй под мой стек (React/Next, Tailwind).
3) Сохрани prefers-reduced-motion и упрощение на mobile.
4) Не копируй чужой бренд — подставь мой текст/цвета.
5) Не ставь тяжёлый WebGL без fallback.`,
    siteUrl: "https://www.originkit.dev",
    russiaNote: "Сайт и MCP снаружи РФ; для агента удобнее копировать промпт с карточки, если MCP недоступен.",
    pairsWith: ["shadcn/ui", "Magic UI", "Motion"],
    alternatives: ["Magic UI", "Aceternity UI", "Motion Primitives"],
    featured: true,
    sortOrder: 10,
  },
  {
    slug: "21st-dev",
    name: "21st.dev",
    tagline: "Огромный каталог: Copy prompt → вставь в Cursor / Claude / v0.",
    family: "landing",
    price: "freemium",
    stack: "React · Tailwind · shadcn-конвенции",
    agentMode: ["prompt", "cli"],
    tasks: ["landing", "motion", "agent"],
    bestFor: [
      "Нужно быстро найти визуальный референс и отдать агенту промпт",
      "Хочешь community-компоненты разных авторов",
      "Работаешь в Cursor / Claude Code / Lovable",
    ],
    notFor: [
      "Нужна единая строгая дизайн-система одного автора",
      "Боишься визуального шума и «сборной солянки»",
    ],
    strengths: [
      "У каждого компонента — Copy prompt",
      "Живые превью + shadcn CLI",
      "Шаблоны и темы, не только атомы",
    ],
    caveats: [
      "Качество разное — смотри автора и превью",
      "Легко смешать 5 эстетик на одной странице",
      "Часть контента платная",
    ],
    examples: ["Hero sections", "Bento grids", "Shaders / gradients", "Full templates"],
    agentPrompt: `Возьми компонент/секцию с 21st.dev как референс.
Сайт: https://21st.dev
Карточка: https://proektmap.ru/sandbox/vibe-blocks/21st-dev

Я вставлю ниже Copy prompt / название компонента.
Пересобери его в моём Next.js + Tailwind проекте:
- сохрани композицию и motion-идею;
- подгони цвета/шрифты под мой бренд;
- код в репозитории (copy-paste), без лишних зависимостей;
- mobile-first, без decor-only карточек.`,
    siteUrl: "https://21st.dev",
    russiaNote: "Каталог открывается из РФ обычно без проблем; оплата Pro — зарубежная карта/сервисы.",
    pairsWith: ["shadcn/ui", "Aceternity", "Magic UI"],
    alternatives: ["Shadcn Blocks", "Magic UI", "OriginKit"],
    featured: true,
    sortOrder: 20,
  },
  {
    slug: "magic-ui",
    name: "Magic UI",
    tagline: "Анимированный компаньон shadcn: marquee, shimmer, particles.",
    family: "animation",
    price: "freemium",
    stack: "React · Tailwind · Motion · shadcn CLI",
    agentMode: ["cli", "docs"],
    tasks: ["motion", "landing"],
    bestFor: [
      "Уже есть shadcn — нужно «оживить» лендинг",
      "Marquee, border beam, text reveal, globe",
      "Агенту проще ставить через shadcn add",
    ],
    notFor: [
      "Нужен полный набор форм/таблиц (это shadcn)",
      "Минималистичный сайт без анимаций",
    ],
    strengths: [
      "Отлично стыкуется с shadcn registry",
      "Много готовых эффектов под маркетинг",
      "Понятный copy-paste / CLI",
    ],
    caveats: [
      "Pro-шаблоны платные",
      "Агент должен знать Motion (framer-motion)",
      "На mobile урезай эффекты",
    ],
    examples: ["Marquee testimonials", "Shimmer button", "Animated beam", "Bento magic"],
    agentPrompt: `Добавь Magic UI эффекты в мой shadcn/Next.js проект.
Доки: https://magicui.design
Карточка: https://proektmap.ru/sandbox/vibe-blocks/magic-ui

Установи через shadcn CLI нужные компоненты (например marquee, blur-fade, shimmer-button).
Используй максимум 2–3 эффекта на hero/features.
Учти prefers-reduced-motion. Не ломай существующую дизайн-систему.`,
    siteUrl: "https://magicui.design",
    russiaNote: "Документация и GitHub доступны; Pro — зарубежная оплата.",
    pairsWith: ["shadcn/ui", "OriginKit", "Tailark"],
    alternatives: ["Aceternity UI", "Cult UI", "OriginKit"],
    sortOrder: 30,
  },
  {
    slug: "aceternity",
    name: "Aceternity UI",
    tagline: "Вау-секции лендингов: aurora, 3D cards, timelines, bento.",
    family: "animation",
    price: "freemium",
    stack: "React · Tailwind · Motion",
    agentMode: ["cli", "prompt", "docs"],
    tasks: ["motion", "landing"],
    bestFor: [
      "Нужен «дорогой» визуал секции, не микрокнопка",
      "Hero / features / backgrounds с сильным характером",
      "Референс для агента «сделай вот так»",
    ],
    notFor: [
      "Тяжёлая админка / data-dense UI",
      "Слабые устройства без fallback",
    ],
    strengths: [
      "Сильные готовые секции, не только атомы",
      "Есть на 21st.dev с Copy prompt",
      "shadcn-совместимый registry",
    ],
    caveats: [
      "Часть блоков All-Access (платно)",
      "Легко получить «каждый сайт как Aceternity»",
      "Следи за весом анимаций",
    ],
    examples: ["Aurora background", "3D card", "Timeline", "Sparkles hero"],
    agentPrompt: `Собери секцию в духе Aceternity UI.
Сайт: https://ui.aceternity.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/aceternity

Выбери один паттерн (aurora hero ИЛИ bento features ИЛИ timeline) — не всё сразу.
Реализуй на Next.js + Tailwind + Motion.
Адаптируй под мой контент и бренд. Mobile: упростить 3D/particles.`,
    siteUrl: "https://ui.aceternity.com",
    russiaNote: "Сайт обычно доступен; Pro — зарубежная оплата.",
    pairsWith: ["shadcn/ui", "21st.dev", "Magic UI"],
    alternatives: ["Magic UI", "OriginKit", "Cult UI"],
    sortOrder: 40,
  },
  {
    slug: "cult-ui",
    name: "Cult UI",
    tagline: "Анимации + блоки + AI SDK agent patterns.",
    family: "animation",
    price: "freemium",
    stack: "React · Tailwind · shadcn · AI SDK",
    agentMode: ["cli", "docs"],
    tasks: ["motion", "ai-app", "landing"],
    bestFor: [
      "Нужны и UI-эффекты, и заготовки AI-агентских флоу",
      "Next.js + shadcn + Vercel AI SDK",
      "Хочешь блоки Hero/Feature и agent patterns рядом",
    ],
    notFor: [
      "Только статичный маркетинг без AI",
      "Проект вне React/shadcn экосистемы",
    ],
    strengths: [
      "Мост между красивым UI и AI SDK",
      "Blocks + agent patterns",
      "shadcn-compatible install",
    ],
    caveats: [
      "Pro/AI patterns могут быть платными",
      "Не путать с полноценной дизайн-системой",
    ],
    examples: ["Shift cards", "Animated bento", "AI agent recipes", "Landing blocks"],
    agentPrompt: `Используй Cult UI как источник UI + AI SDK паттернов.
Сайт: https://www.cult-ui.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/cult-ui

Стек: Next.js + shadcn + AI SDK.
Собери: 1 анимированный UI-блок + 1 простой agent UI pattern (если нужно).
Код в проекте через registry/CLI. Без визуальной каши.`,
    siteUrl: "https://www.cult-ui.com",
    russiaNote: "Зависит от доступа к GitHub/npm; AI SDK ключи — отдельно.",
    pairsWith: ["shadcn/ui", "prompt-kit", "VLLNT UI"],
    alternatives: ["Magic UI", "VLLNT UI", "prompt-kit"],
    sortOrder: 50,
  },
  {
    slug: "motion-primitives",
    name: "Motion Primitives",
    tagline: "Аккуратные motion-примитивы без тяжёлого «вау-шума».",
    family: "animation",
    price: "free",
    stack: "React · Motion",
    agentMode: ["docs", "cli"],
    tasks: ["motion"],
    bestFor: [
      "Нужна вкусная микроанимация без цирка",
      "Текст, morph, reveal — точечно",
      "Учиться motion-паттернам",
    ],
    notFor: [
      "Нужны готовые целые секции лендинга",
      "Полный UI kit форм",
    ],
    strengths: [
      "Чистые примитивы",
      "Хороший вкус по умолчанию",
      "Легко объяснить агенту",
    ],
    caveats: [
      "Меньше «готовых страниц»",
      "Нужно самому собирать композицию",
    ],
    examples: ["Text morph", "Disclosure", "Toolbar morph", "Scroll reveals"],
    agentPrompt: `Добавь микроанимации в духе Motion Primitives.
Сайт: https://motion-primitives.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/motion-primitives

Только 2–3 точечных эффекта (заголовок, hover, reveal).
React + Motion. Учти reduced-motion. Не превращай страницу в шоу.`,
    siteUrl: "https://motion-primitives.com",
    russiaNote: "Обычно доступен; зависимости через npm.",
    pairsWith: ["shadcn/ui", "Magic UI"],
    alternatives: ["Magic UI", "OriginKit"],
    sortOrder: 60,
  },
  {
    slug: "shadcn-blocks",
    name: "Shadcn Blocks",
    tagline: "Тысячи готовых секций: hero, pricing, dashboard blocks.",
    family: "landing",
    price: "freemium",
    stack: "React · Next · shadcn · Tailwind",
    agentMode: ["cli", "docs"],
    tasks: ["landing"],
    bestFor: [
      "Нужна целая секция, а не кнопка",
      "Маркетинг + иногда dashboard",
      "Быстрый каркас лендинга",
    ],
    notFor: [
      "Уникальный art-direction с нуля",
      "Проект без Tailwind/shadcn",
    ],
    strengths: [
      "Огромный объём блоков",
      "Совместимость с shadcn",
      "Агент хорошо понимает паттерн",
    ],
    caveats: [
      "Много платного",
      "Риск «шаблонного» вида",
      "Выбирай 1 стиль и держись его",
    ],
    examples: ["Hero variants", "Pricing tables", "Feature grids", "CTA/FAQ"],
    agentPrompt: `Собери лендинг из готовых секций в духе Shadcn Blocks.
Сайт: https://www.shadcnblocks.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/shadcn-blocks

Секции: Hero, Features, Pricing, FAQ, CTA, Footer.
База — shadcn/ui. Единый визуальный язык. Мой контент и бренд.
Без смешения 10 разных авторов стиля.`,
    siteUrl: "https://www.shadcnblocks.com",
    russiaNote: "Каталог смотреть можно; покупка — зарубежная оплата.",
    pairsWith: ["shadcn/ui", "Tailark", "Magic UI"],
    alternatives: ["Tailark", "Tailwind Plus", "21st.dev"],
    sortOrder: 70,
  },
  {
    slug: "tailark",
    name: "Tailark",
    tagline: "Маркетинговые блоки на shadcn с упором на конверсию.",
    family: "landing",
    price: "freemium",
    stack: "React · shadcn · Tailwind",
    agentMode: ["cli", "docs"],
    tasks: ["landing"],
    bestFor: [
      "SaaS/агентский лендинг",
      "Красивые marketing sections без цирка",
      "Быстрый MVP сайта продукта",
    ],
    notFor: [
      "Админки и сложные data tables",
      "Экспериментальный art-site",
    ],
    strengths: [
      "Сильный вкус marketing UI",
      "shadcn ecosystem",
      "Хорошо ложится на vibe coding",
    ],
    caveats: [
      "Pro платный",
      "Меньше «безумных» эффектов чем Aceternity",
    ],
    examples: ["SaaS heroes", "Feature sections", "Pricing", "CTA"],
    agentPrompt: `Собери marketing-лендинг в духе Tailark (shadcn blocks).
Сайт: https://tailark.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/tailark

Фокус на ясности и конверсии, не на спецэффектах.
Next.js + Tailwind + shadcn. Структура: Hero, Features, Social proof, Pricing, FAQ, CTA.`,
    siteUrl: "https://tailark.com",
    russiaNote: "Доступ к сайту обычно ок; Pro — зарубежная оплата.",
    pairsWith: ["shadcn/ui", "Shadcn Blocks", "Magic UI"],
    alternatives: ["Shadcn Blocks", "Untitled UI", "21st.dev"],
    sortOrder: 80,
  },
  {
    slug: "shadcn-ui",
    name: "shadcn/ui",
    tagline: "Стандарт copy-paste UI. То, что агенты знают лучше всего.",
    family: "foundation",
    price: "free",
    stack: "React · Tailwind · Radix/Base UI",
    agentMode: ["cli", "mcp", "docs"],
    tasks: ["landing", "ai-app", "agent", "system"],
    bestFor: [
      "Любой новый React/Next проект",
      "Нужны формы, dialog, tabs, table",
      "Хочешь, чтобы агент меньше галлюцинировал",
    ],
    notFor: [
      "Готовые «вау»-секции из коробки (бери blocks/magic)",
      "Vue/Svelte без адаптеров",
    ],
    strengths: [
      "Де-факто стандарт для AI-агентов",
      "Код в репозитории — агент его видит",
      "Экосистема registry (Magic, Kibo, …)",
    ],
    caveats: [
      "Визуал минималистичный — «оживление» отдельно",
      "Нужен Tailwind",
    ],
    examples: ["Button/Form/Dialog", "Data table", "Sidebar", "Charts (ecosystem)"],
    agentPrompt: `Используй shadcn/ui как базу компонентов.
Сайт: https://ui.shadcn.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/shadcn-ui

Инициализируй/дополни shadcn в проекте. Ставь только нужные компоненты через CLI.
Не изобретай свои Button/Dialog, если есть shadcn.
Стили через CSS variables темы. Accessibility не ломать.`,
    siteUrl: "https://ui.shadcn.com",
    russiaNote: "Полностью open source; ставится через npm/GitHub.",
    pairsWith: ["Magic UI", "Kibo UI", "Tailark"],
    alternatives: ["HeroUI", "COSS UI", "Mantine"],
    featured: true,
    sortOrder: 5,
  },
  {
    slug: "kibo-ui",
    name: "Kibo UI",
    tagline: "Сложные блоки поверх shadcn: code, upload, compare, patterns.",
    family: "foundation",
    price: "free",
    stack: "React · shadcn · Tailwind",
    agentMode: ["cli", "mcp", "docs"],
    tasks: ["ai-app", "agent", "landing"],
    bestFor: [
      "Нужны сложные интерактивы, которые агент пишет криво с нуля",
      "Code block, file upload, image zoom, QR",
      "Расширение shadcn без ухода из экосистемы",
    ],
    notFor: [
      "Только маркетинг-лендинг без сложных виджетов",
    ],
    strengths: [
      "Закрывает «дыры» shadcn",
      "MCP / registry-friendly",
      "Много patterns",
    ],
    caveats: [
      "Не заменяет Magic/Aceternity для hero-шоу",
      "Следи за зависимостями каждого блока",
    ],
    examples: ["Code block", "Dropzone", "Comparison", "Mini calendar"],
    agentPrompt: `Если не хватает shadcn — бери Kibo UI.
Сайт: https://www.kibo-ui.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/kibo-ui

Найди нужный сложный компонент в Kibo и установи через registry/CLI.
Не пиши code highlighter / uploader с нуля. Сохрани стиль shadcn темы.`,
    siteUrl: "https://www.kibo-ui.com",
    russiaNote: "Open source; доступ через npm/GitHub.",
    pairsWith: ["shadcn/ui", "prompt-kit", "VLLNT UI"],
    alternatives: ["shadcn/ui", "Cult UI"],
    sortOrder: 90,
  },
  {
    slug: "untitled-ui",
    name: "Untitled UI",
    tagline: "Крупная дизайн+код система: Figma, React, MCP, AGENT.md.",
    family: "design-system",
    price: "freemium",
    stack: "React · Tailwind · React Aria · Figma",
    agentMode: ["mcp", "docs"],
    tasks: ["system", "landing", "agent"],
    bestFor: [
      "Нужен «взрослый» продукт с единым визуалом",
      "Есть Figma + код",
      "Хочешь MCP и AI instruction files",
    ],
    notFor: [
      "Одностраничный эксперимент на вечер",
      "Бюджет 0 и нужен только free минимум",
    ],
    strengths: [
      "Сильный дизайн по умолчанию",
      "MCP + CLAUDE/AGENT.md",
      "Много page examples",
    ],
    caveats: [
      "Полный доступ платный",
      "Тяжелее по объёму, чем shadcn starter",
    ],
    examples: ["Page examples", "Marketing sections", "App UI", "Icons"],
    agentPrompt: `Строй UI по правилам Untitled UI (если подключено в проекте).
Сайт: https://www.untitledui.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/untitled-ui

Следуй AGENT/CLAUDE правилам библиотеки. Не смешивай с Aceternity-эстетикой.
Используй готовые page patterns. React Aria accessibility сохранить.`,
    siteUrl: "https://www.untitledui.com",
    russiaNote: "Free часть есть; Pro — зарубежная оплата. Figma — отдельно.",
    pairsWith: ["Fragments UI", "shadcn/ui"],
    alternatives: ["AlignUI", "Fragments UI", "Tailwind Plus"],
    sortOrder: 100,
  },
  {
    slug: "fragments-ui",
    name: "Fragments UI",
    tagline: "Agent-first дизайн-система: MCP tools + metadata у компонентов.",
    family: "design-system",
    price: "free",
    stack: "React · Base UI · токены · MCP",
    agentMode: ["mcp", "docs"],
    tasks: ["system", "agent"],
    bestFor: [
      "Хочешь, чтобы агент читал контракты компонентов, а не HTML docs",
      "Команда строит свою DS с AI в процессе",
      "Нужны токены + composition hints",
    ],
    notFor: [
      "Нужен каталог «вау»-лендинг эффектов",
      "Быстрый one-off landing без DS",
    ],
    strengths: [
      "Сильный MCP для discovery/validation",
      ".fragment metadata для агентов",
      "Open source",
    ],
    caveats: [
      "Меньше «готовых красивых секций»",
      "Нужно привыкнуть к модели DS",
    ],
    examples: ["Token-driven components", "Composition patterns", "A11y audits via MCP"],
    agentPrompt: `Работай через Fragments UI registry/MCP.
Сайт: https://www.usefragments.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/fragments-ui

Сначала найди компонент и его контракт (props/composition), потом используй.
Не выдумывай API. Держи токены. Если MCP доступен — используй его tools.`,
    siteUrl: "https://www.usefragments.com",
    russiaNote: "Open source; MCP endpoint зависит от сети.",
    pairsWith: ["Untitled UI", "shadcn/ui"],
    alternatives: ["Untitled UI", "shadcn/ui"],
    sortOrder: 110,
  },
  {
    slug: "vllnt-ui",
    name: "VLLNT UI",
    tagline: "313 React-компонентов для AI-приложений + JSON registry для агентов.",
    family: "agent-ui",
    price: "free",
    stack: "React · AI chat/streaming/tools · MCP",
    agentMode: ["mcp", "docs"],
    tasks: ["ai-app", "agent"],
    bestFor: [
      "Чат, citations, tool calls, thinking blocks",
      "Агент должен читать machine-readable descriptors",
      "Продукт вокруг LLM/агентов",
    ],
    notFor: [
      "Обычный маркетинг-сайт без AI UI",
      "Не-React стек",
    ],
    strengths: [
      "Заточено под AI surfaces",
      "MCP search/get/list",
      "Open-source объём",
    ],
    caveats: [
      "Не заменяет marketing blocks",
      "Сверься с актуальной лицензией/версией",
    ],
    examples: ["AI chat input", "Streaming text", "Tool call display", "Citations"],
    agentPrompt: `Собери AI UI на базе VLLNT UI.
Сайт: https://ui.vllnt.ai
Карточка: https://proektmap.ru/sandbox/vibe-blocks/vllnt-ui

Нужны: message list, streaming, tool-call UI, composer.
Через MCP/registry найди компоненты, не выдумывай props.
Стили нейтральные, a11y для live regions.`,
    siteUrl: "https://ui.vllnt.ai",
    russiaNote: "Проверь доступ к сайту/MCP из своей сети.",
    pairsWith: ["prompt-kit", "Cult UI", "shadcn/ui"],
    alternatives: ["prompt-kit", "agents-kit", "Cult UI"],
    sortOrder: 120,
  },
  {
    slug: "prompt-kit",
    name: "prompt-kit",
    tagline: "Готовые куски chat UI: messages, markdown, code, stream.",
    family: "agent-ui",
    price: "free",
    stack: "React · chat UI primitives",
    agentMode: ["docs", "cli"],
    tasks: ["ai-app"],
    bestFor: [
      "Быстро собрать чат без изобретения велосипеда",
      "Markdown/code в ответах модели",
      "Прототип AI-продукта",
    ],
    notFor: [
      "Полная дизайн-система продукта",
      "Сложный multi-agent orchestrator UI (смотри agents-kit)",
    ],
    strengths: [
      "Узкий фокус — chat UX",
      "Понятные примитивы",
      "Хорошая база под кастом",
    ],
    caveats: [
      "Не marketing kit",
      "Для advanced agent panels может не хватить",
    ],
    examples: ["Chat messages", "Prompt input", "Code block", "Response stream"],
    agentPrompt: `Собери chat UI на prompt-kit.
Сайт: https://www.prompt-kit.com
Карточка: https://proektmap.ru/sandbox/vibe-blocks/prompt-kit

Компоненты: messages, prompt input, markdown/code, streaming.
Встрой в мой layout. Не усложняй. Сделай empty/loading/error состояния.`,
    siteUrl: "https://www.prompt-kit.com",
    russiaNote: "Обычно через GitHub/npm; сайт проверь в своей сети.",
    pairsWith: ["VLLNT UI", "shadcn/ui", "Kibo UI"],
    alternatives: ["VLLNT UI", "agents-kit", "Cult UI"],
    sortOrder: 130,
  },
];

export function getVibeKit(slug: string): VibeKit | undefined {
  return VIBE_KITS.find((k) => k.slug === slug);
}

export function familyLabel(family: VibeFamily): string {
  return FAMILY_META[family].label;
}

export function priceLabel(price: VibePrice): string {
  return PRICE_LABEL[price];
}
