/** Креативная библиотека вайбкодера — контент MVP (без БД). */

export type CreativeDifficulty = "easy" | "medium" | "hard";
export type CreativeEntry = "code" | "nocode" | "mixed";
export type CreativeMobile = "ok" | "careful" | "desktop";
export type CreativeTier = 1 | 2 | 3;

export type CreativeTool = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  tasks: string[];
  difficulty: CreativeDifficulty;
  tier: CreativeTier;
  stack: string;
  price: string;
  mobile: CreativeMobile;
  designDNA: string;
  can: string[];
  cannot: string[];
  whenYes: string[];
  whenNo: string[];
  pairsWith: string[];
  alternatives: string[];
  mistakes: string[];
  agentPrompt: string;
  demos: { label: string; href: string }[];
  featured?: boolean;
  sortOrder: number;
};

export const TIER_META = {
  1: { label: "Tier 1 · Low-code MVP", short: "Tier 1", desc: "Делается за вечер. Минимум боли." },
  2: { label: "Tier 2 · Standard Vibe", short: "Tier 2", desc: "Золотой стандарт индустрии." },
  3: { label: "Tier 3 · Hardcore Awwwards", short: "Tier 3", desc: "Шейдеры, время, перформанс." },
} as const;

export const PERFORMANCE_KILLERS: { title: string; danger: string; doInstead: string }[] = [
  {
    title: "Three / p5 на мобиле без LOD",
    danger:
      "Полная сцена WebGL или тяжёлый draw-loop на телефоне → 10–20 fps, нагрев, закрытие вкладки.",
    doInstead:
      "Упрощённая сцена / статичный кадр на mobile, LOD, меньше полигонов, throttle requestAnimationFrame, отключение при reduced-motion.",
  },
  {
    title: "Lenis + тяжёлый RAF ест батарею",
    danger:
      "Smooth scroll крутит RAF каждый кадр вместе с ScrollTrigger и параллаксом — телефон греется, батарея тает.",
    doInstead:
      "На mobile оставь нативный скролл или лёгкий Lenis. Один RAF-цикл на всё. Pause при hidden tab (Page Visibility).",
  },
  {
    title: "Слишком много ScrollTrigger pin",
    danger:
      "5+ pinned секций подряд ломают скролл, адресную строку и gesture на iOS — пользователь «залипает».",
    doInstead:
      "1–2 pin на десктопе, на mobile — scrub без pin или короткие fade. Cleanup kill() при unmount.",
  },
  {
    title: "Vanta / tsParticles на весь экран телефона",
    danger:
      "Full-screen WebGL/particles на слабом GPU → лаги скролла и белый экран при уходе с вкладки.",
    doInstead:
      "Статичный градиент или CSS mesh на mobile. Particles только desktop / после idle. Меньше density.",
  },
  {
    title: "Gaussian Splatting / Curtains без fallback",
    danger:
      "Нейро-облака и шейдерные плоскости без fallback крашат Safari/старые Android или показывают чёрный квадрат.",
    doInstead:
      "Картинка/видео fallback, feature detect WebGL2, lazy-load после LCP, desktop-first для splats.",
  },
  {
    title: "Забыли prefers-reduced-motion",
    danger:
      "Автоплей, бесконечный motion и shake вызывают тошноту и недоступность — часть аудитории уйдёт сразу.",
    doInstead:
      "matchMedia('(prefers-reduced-motion: reduce)') → статичный layout, один fade, без scrub-оргии.",
  },
  {
    title: "requestAnimationFrame без дисциплины",
    danger:
      "Несколько независимых RAF, анимации в фоне вкладки, отсутствие cancelAnimationFrame → утечки и джитер.",
    doInstead:
      "Один shared ticker где возможно; cancel при unmount; pause при document.hidden; не анимируй то, что вне viewport.",
  },
  {
    title: "360° / карта на весь экран телефона",
    danger:
      "8K-панорамы и десятки маркеров без кластеризации → лаги жестов, белый экран WebGL, съеденный трафик.",
    doInstead:
      "Панорамы 2–4K, lazy соседних сцен, кластер маркеров, статичный fallback. Карту не анимируй на каждый scroll-тик.",
  },
];

export const TASK_FILTERS = [
  { id: "all", label: "Все задачи" },
  { id: "scroll", label: "Scroll-сайт" },
  { id: "ui", label: "UI-motion" },
  { id: "typography", label: "Типографика" },
  { id: "atmosphere", label: "Фон / атмосфера" },
  { id: "transitions", label: "Переходы страниц" },
  { id: "3d", label: "3D / AR" },
  { id: "game", label: "2D-игра" },
  { id: "illustration", label: "Иллюстрации" },
  { id: "generative", label: "Генератив" },
  { id: "sound", label: "Звук" },
  { id: "ai-interact", label: "AI / трекинг" },
  { id: "physics", label: "Физика" },
  { id: "gallery", label: "Вирт. галереи" },
  { id: "maps", label: "Карты" },
  { id: "tours", label: "Туры" },
] as const;

/** Стек-рецепт: задача → один рекомендованный стек + проще/сложнее. */
export type StackRecipe = {
  id: string;
  title: string;
  desc: string;
  /** Основной стек (порядок = роль в связке) */
  stack: string[];
  /** Почему именно эта связка */
  why: string;
  /** Проще альтернатива (Tier −1 по ощущению) */
  easier: { label: string; slugs: string[] };
  /** Сложнее / Awwwards */
  harder: { label: string; slugs: string[] };
  /** Короткое предупреждение по FPS / мобиле */
  fpsNote: string;
  /** Бриф для агента — скопировать и пойти */
  agentBrief: string;
};

export const STACK_RECIPES: StackRecipe[] = [
  {
    id: "hero-evening",
    title: "Hero за вечер",
    desc: "Атмосфера на первом экране без шейдеров и учёбы Three",
    stack: ["vanta", "autoanimate"],
    why: "Vanta даёт «вау»-фон за час, AutoAnimate — живые списки/карточки рядом. Tier 1, вечеринка без похмелья.",
    easier: { label: "Ещё проще", slugs: ["mesh-gradient"] },
    harder: { label: "Чуть богаче", slugs: ["tsparticles", "lottie"] },
    fpsNote: "На телефоне — статичный градиент или CSS mesh. Vanta/particles только desktop или после idle.",
    agentBrief: `Собери hero Tier 1: Vanta на один блок + AutoAnimate на списке/карточках.
Mobile: без WebGL — CSS mesh/градиент. prefers-reduced-motion → статика.
Не подключай Three/R3F. Один hero, без particles на весь экран.`,
  },
  {
    id: "scroll-film",
    title: "Сайт-фильм",
    desc: "Скролл = пульт камеры: pin, scrub, типографика",
    stack: ["lenis", "gsap", "gsap-scrolltrigger", "splittype"],
    why: "Золотой стандарт индустрии: мягкий скролл + ScrollTrigger + буквы. Один рецепт вместо десяти вкладок awesome-list.",
    easier: { label: "Легче (без film)", slugs: ["motion", "autoanimate"] },
    harder: { label: "Режиссура глубже", slugs: ["theatre", "curtains"] },
    fpsNote: "На mobile — нативный скролл или лёгкий Lenis. 1–2 pin, не оргия. Один RAF-цикл, pause при hidden tab.",
    agentBrief: `Собери scroll-фильм: Lenis + GSAP ScrollTrigger + SplitType на hero.
1–2 pinned секции на desktop, на mobile — scrub без pin / fade.
Уважай prefers-reduced-motion. Не вешай Three на каждую секцию.
Сверься с /demo/scroll-film как ориентиром ощущения.`,
  },
  {
    id: "kinetic-type",
    title: "Кинетическая типографика",
    desc: "Буквы живут: появление по символам, волны, акцент на заголовке",
    stack: ["splittype", "gsap"],
    why: "SplitType режет текст, GSAP анимирует. Не нужен Curtains, пока нет фото-искажения.",
    easier: { label: "Проще", slugs: ["anime", "motion"] },
    harder: { label: "С шейдером текста", slugs: ["curtains", "theatre"] },
    fpsNote: "Анимируй один hero-заголовок, не все h2 страницы. На mobile — короче, без бесконечного loop.",
    agentBrief: `Кинетика только на одном hero-заголовке: SplitType + GSAP.
Остальной текст — статичный или лёгкий fade. reduced-motion → без split-анимации.
Не подключай Curtains, пока нет задачи искажать фото под текстом.`,
  },
  {
    id: "react-ui",
    title: "Красивый UI в React",
    desc: "Кнопки, списки, модалки, микро-взаимодействия",
    stack: ["motion", "autoanimate"],
    why: "Motion — стандарт React UI; AutoAnimate — списки без ручных layout-анимаций. GSAP здесь избыточен.",
    easier: { label: "Минимум", slugs: ["autoanimate"] },
    harder: { label: "Сложные timelines", slugs: ["gsap", "anime"] },
    fpsNote: "Не анимируй всё подряд. Layout-анимации sparingly; reduced-motion — мгновенный UI.",
    agentBrief: `UI-motion в React/Next: Motion для кнопок/модалок, AutoAnimate для списков.
Без GSAP и без WebGL. prefers-reduced-motion → без spring/layout dance.`,
  },
  {
    id: "product-3d",
    title: "3D / AR товара",
    desc: "Модель на сайте и «посмотреть в комнате» — без R3F «на всякий случай»",
    stack: ["model-viewer"],
    why: "model-viewer закрывает 80% e-commerce 3D/AR. Spline/R3F — только если нужен кастомный мир.",
    easier: { label: "Без 3D", slugs: ["lottie"] },
    harder: { label: "Кастомный мир", slugs: ["spline", "r3f", "drei"] },
    fpsNote: "GLB lazy + poster. На слабых телефонах — картинка/видео fallback. Не грузи Gaussian Splatting в карточку товара.",
    agentBrief: `Встрой <model-viewer> с GLB, poster и loading="lazy".
AR где поддерживается. Fallback: статичный кадр.
Не ставь R3F/Three, пока нет задачи кастомной сцены.`,
  },
  {
    id: "page-transitions",
    title: "Мягкие переходы страниц",
    desc: "Без белой вспышки — как одно приложение",
    stack: ["view-transitions", "autoanimate"],
    why: "Нативный View Transitions + AutoAnimate внутри страницы. Barba — только SPA/legacy без Next App Router.",
    easier: { label: "Только внутри страницы", slugs: ["autoanimate"] },
    harder: { label: "Полный page takeover", slugs: ["barba"] },
    fpsNote: "Короткие transitions (200–400ms). Не комбинируй с тяжёлым Lenis+pin на тех же переходах.",
    agentBrief: `Переходы: View Transitions API (+ AutoAnimate на списках).
Если Next App Router — не тащи Barba без причины.
Короткие fade/morph, reduced-motion → мгновенно.`,
  },
  {
    id: "awwwards-hero",
    title: "Awwwards-hero (desktop)",
    desc: "Тяжёлый wow на первом экране — осознанно, с fallback",
    stack: ["r3f", "drei"],
    why: "Когда нужен кастомный 3D-мир в React. Не стартовая точка вайбкодера — апгрейд после Tier 1–2.",
    easier: { label: "Сначала так", slugs: ["spline", "model-viewer", "vanta"] },
    harder: { label: "Hardcore", slugs: ["curtains", "gaussian-splatting", "theatre"] },
    fpsNote: "Desktop-first. Mobile = статичный кадр / упрощённая сцена. dispose, resize, reduced-motion → стоп.",
    agentBrief: `R3F + Drei: одна минимальная hero-сцена, client component.
Mobile fallback (картинка/CSS). Feature detect WebGL. dispose при unmount.
Не добавляй splats/Curtains в тот же MVP.`,
  },
  {
    id: "virtual-gallery",
    title: "Виртуальная галерея",
    desc: "360° зал, выставка, прогулка по пространству без своего Matterport",
    stack: ["photo-sphere-viewer"],
    why: "Панорамы + хотспоты закрывают 80% «виртуальных туров» для портфолио, музея, шоурума. R3F-галерея — только если нужен свой 3D-мир.",
    easier: { label: "Ещё проще", slugs: ["model-viewer", "lottie"] },
    harder: { label: "Свой 3D-зал", slugs: ["spline", "r3f", "drei"] },
    fpsNote: "Тяжёлые equirectangular 8K убивают мобилу. 2–4K, lazy соседних сцен, не крути автоспин постоянно.",
    agentBrief: `Собери виртуальную галерею на Photo Sphere Viewer: 1–3 панорамы, маркеры/хотспоты к работам.
Мобилка: меньше разрешение, без автоспина. Fallback — статичный кадр + галерея фото.
Не строй R3F-музей в MVP, пока нет явной задачи кастомной архитектуры.`,
  },
  {
    id: "interactive-map",
    title: "Карта с точками",
    desc: "Локации, маршрут, «где мы» — для РФ без сюрпризов с тайлами",
    stack: ["yandex-maps"],
    why: "В России Яндекс.Карты — предсказуемый путь (тайлы, геокодер, мобилки). Leaflet+OSM — если нужен полностью бесплатный/opensource контур.",
    easier: { label: "Бесплатно / OSM", slugs: ["leaflet"] },
    harder: { label: "Свой стиль карты", slugs: ["maplibre", "gsap"] },
    fpsNote: "Не обновляй карту на каждый пиксель скролла. Кластеризуй маркеры. На mobile — меньше анимаций камеры.",
    agentBrief: `Встрой Яндекс.Карты: одна карта, маркеры точек, попап с текстом/ссылкой.
Ключ API из env, не в клиентский репозиторий публично без ограничений.
Если нужен opensource без ключа Яндекса — Leaflet + OSM. Не тащи Mapbox без причины для РФ-проекта.`,
  },
  {
    id: "product-tour",
    title: "Тур по продукту",
    desc: "Онбординг: подсветка шагов UI, «смотри сюда», без видеоурока",
    stack: ["driver-js", "autoanimate"],
    why: "Driver.js — лёгкий spotlight-тур. AutoAnimate смягчает появление подсказок. Не путать с 360-туром по залу.",
    easier: { label: "Только подсказки", slugs: ["autoanimate"] },
    harder: { label: "Нарратив / scroll-тур", slugs: ["gsap", "gsap-scrolltrigger", "lenis"] },
    fpsNote: "5–7 шагов максимум. Не запускай тур на каждом визите — один раз + «показать снова».",
    agentBrief: `Собери product tour на Driver.js: 5–7 шагов, spotlight, кнопка «пропустить».
Показ один раз (localStorage). AutoAnimate — опционально на списках рядом.
Не смешивай с 360-галереей и тяжёлым scroll-фильмом в одном MVP.`,
  },
];

/** @deprecated используй STACK_RECIPES — оставлен для совместимости */
export const SCENARIOS = STACK_RECIPES.map((r) => ({
  title: r.title,
  desc: r.desc,
  recommend: r.stack,
}));

export const CREATIVE_TOOLS: CreativeTool[] = [
  {
    slug: "gsap",
    name: "GSAP",
    tagline: "Движок плавной анимации для сайтов — от кнопок до scroll-фильмов",
    category: "Scroll / storytelling",
    tasks: ["scroll", "ui"],
    difficulty: "medium",
    tier: 2,
    stack: "HTML/CSS/JS, React, Next, Vue",
    price: "free (MIT)",
    mobile: "careful",
    designDNA:
      "Сайт ведёт себя как режиссёрская склейка: скролл = пульт камеры, не просто длинная страница.",
    can: [
      "Плавные анимации любых CSS/JS-свойств",
      "ScrollTrigger — pin, scrub, привязка к скроллу",
      "Timelines — сценарии «сначала A, потом B»",
      "Связка с Lenis / Three / Spline",
      "Можно заложить prefers-reduced-motion",
    ],
    cannot: [
      "Не рисует 3D-мир (нужен Three.js / Spline)",
      "Не заменяет композицию и типографику",
      "Не сделает «красиво» без раскадровки",
    ],
    whenYes: [
      "Нужен wow-лендинг или сайт-фильм",
      "Анимация синхронизирована со скроллом",
      "Есть Next/React и нужен сильный motion-слой",
    ],
    whenNo: [
      "Простой fade-in секций — хватит Motion или CSS",
      "Нужна полноценная игра — Phaser",
      "Нужен 3D-персонаж из редактора — Rive / Spline",
    ],
    pairsWith: ["Lenis", "ScrollTrigger", "SplitType", "Three.js / R3F", "Spline"],
    alternatives: ["Motion", "CSS scroll-driven", "Theatre.js"],
    mistakes: [
      "Анимировать всё подряд → шум и лаги",
      "Забыть mobile и reduced-motion",
      "Сказать агенту «сделай красиво на GSAP» без раскадровки",
      "Путать GSAP с Three.js",
      "Делать scroll-фильм без ScrollTrigger",
    ],
    agentPrompt: `Используй GSAP + ScrollTrigger в текущем проекте.

Цель: scroll-driven секция (сайт-фильм), не декоративный шум.

Сделай:
1) раскадровку 3–5 битов (что происходит на % скролла);
2) pin ключевой секции при необходимости;
3) scrub там, где движение привязано к скроллу;
4) уважение prefers-reduced-motion (отключить/упростить);
5) не ставь лишние библиотеки без нужды;
6) адаптируй под наш стек и существующие токены/компоненты.

Не копируй чужой код один в один — реализуй решение в архитектуре проекта.
Референс ProektMap: /demo/scroll-film и docs/SCROLL-FILM.md.
Для побуквенного текста см. также SplitType (карточка splittype).`,
    demos: [
      { label: "Демо ProektMap — scroll-film", href: "/demo/scroll-film" },
      { label: "gsap.com", href: "https://gsap.com" },
    ],
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "gsap-scrolltrigger",
    name: "GSAP ScrollTrigger",
    tagline: "Плагин GSAP, без которого не бывает scroll-фильма",
    category: "Scroll / storytelling",
    tasks: ["scroll"],
    difficulty: "medium",
    tier: 2,
    stack: "Любой JS + GSAP",
    price: "free (MIT, в составе GSAP)",
    mobile: "careful",
    designDNA: "Скролл = таймлайн. Каждая секция — кадр, а не просто блок текста.",
    can: ["pin / scrub / snap", "триггеры на % viewport", "батчи анимаций при скролле", "связка с Lenis"],
    cannot: ["Не заменяет дизайн композиции", "Без раскадровки получается хаос"],
    whenYes: ["Сайт-фильм", "Product reveal по скроллу", "Параллакс и кинематографичные секции"],
    whenNo: ["Только fade-in блоков → Motion / AutoAnimate", "Нужна игра → Phaser"],
    pairsWith: ["GSAP", "Lenis", "SplitType", "ScrollSmoother"],
    alternatives: ["CSS scroll-driven animations", "Intersection Observer + CSS"],
    mistakes: ["Слишком много pin на mobile", "Забыть kill()/cleanup", "Игнор reduced-motion"],
    agentPrompt: `В проекте уже есть или ставим GSAP. Сфокусируйся на ScrollTrigger.
Сделай 1–2 pinned секции + scrub анимацию.
Раскадровка обязательна. Mobile: меньше pin, упростить.
Cleanup при unmount. prefers-reduced-motion → статичный layout.
Референс: /demo/scroll-film.`,
    demos: [
      { label: "ScrollTrigger docs", href: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/" },
      { label: "Демо ProektMap", href: "/demo/scroll-film" },
    ],
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "lenis",
    name: "Lenis",
    tagline: "Мягкий «масляный» скролл — фундамент под GSAP и WebGL",
    category: "Scroll",
    tasks: ["scroll"],
    difficulty: "easy",
    tier: 2,
    stack: "Vanilla JS, React, Vue",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Скролл ощущается дорогим и непрерывным, без дёрганья браузера.",
    can: ["Smooth scroll", "Синхронизация с GSAP ScrollTrigger", "Параллакс и WebGL-сцены"],
    cannot: ["Не анимирует элементы сам по себе", "Не заменяет ScrollTrigger"],
    whenYes: ["Делаешь сайт-фильм", "Нужен премиальный скролл под GSAP"],
    whenNo: ["Обычный контентный сайт без motion"],
    pairsWith: ["GSAP", "ScrollTrigger", "ScrollSmoother", "Three.js", "R3F"],
    alternatives: ["Нативный скролл", "Locomotive Scroll (legacy)"],
    mistakes: ["Включить Lenis без нужды и сломать sticky", "Не связать с ScrollTrigger"],
    agentPrompt: `Подключи Lenis в текущем проекте как smooth scroll.
Свяжи с GSAP ScrollTrigger, если он уже есть или планируется.
Сохрани accessibility (якоря, sticky где возможно).
Не ломай нативный скролл без причины. Mobile: проверь плавность.`,
    demos: [{ label: "lenis.dev", href: "https://lenis.dev" }],
    sortOrder: 3,
  },
  {
    slug: "lenis-scrollsmoother",
    name: "Lenis + ScrollSmoother",
    tagline: "Связка мягкого скролла и GSAP-параллакса уровня Awwwards",
    category: "Scroll / параллакс",
    tasks: ["scroll", "ui"],
    difficulty: "hard",
    tier: 3,
    stack: "GSAP ScrollSmoother + Lenis",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Контент «плывёт» с разной скоростью слоёв — ощущение дорогой продакшн-студии.",
    can: ["Параллакс слоёв", "Замедление/инерция контента", "Синхрон с ScrollTrigger"],
    cannot: ["Оверкилл для простого лендинга", "Тяжело без чёткой композиции"],
    whenYes: ["Awwwards-уровень scroll", "Многослойный storytelling"],
    whenNo: ["MVP/SaaS UI", "Слабые телефоны без fallback"],
    pairsWith: ["GSAP", "ScrollTrigger", "SplitType"],
    alternatives: ["Только Lenis + ScrollTrigger", "CSS parallax"],
    mistakes: ["Двойной smooth без настройки → дёрганье", "Игнор mobile perf"],
    agentPrompt: `Оцени, нужна ли связка Lenis + GSAP ScrollSmoother.
Если да — минимальный setup с 2–3 parallax-слоями.
На mobile упрости до Lenis или нативного скролла.
Обязателен reduced-motion fallback.`,
    demos: [
      { label: "ScrollSmoother", href: "https://gsap.com/docs/v3/Plugins/ScrollSmoother/" },
      { label: "Lenis", href: "https://lenis.dev" },
    ],
    sortOrder: 4,
  },
  {
    slug: "motion",
    name: "Motion (Framer Motion)",
    tagline: "React-first анимации UI: layout, жесты, списки без боли",
    category: "UI motion",
    tasks: ["ui", "transitions"],
    difficulty: "easy",
    tier: 2,
    stack: "React, Next.js",
    price: "free (MIT) / Motion+",
    mobile: "ok",
    designDNA: "Интерфейс «дышит»: кнопки, модалки и списки двигаются так, будто их рисовали в Framer.",
    can: [
      "Declarative motion в JSX",
      "layout / shared layout transitions",
      "AnimatePresence для mount/unmount",
      "Жесты drag / hover / tap",
    ],
    cannot: [
      "Не scroll-оркестратор уровня GSAP ScrollTrigger",
      "Не замена WebGL / 3D",
    ],
    whenYes: [
      "React/Next и нужны микро-взаимодействия",
      "Модалки, табы, списки, page enter",
    ],
    whenNo: [
      "Сайт-фильм по скроллу → GSAP",
      "Vanilla HTML без React → Anime.js / CSS",
    ],
    pairsWith: ["AutoAnimate", "View Transitions", "GSAP (точечно)"],
    alternatives: ["GSAP", "Anime.js", "CSS transitions"],
    mistakes: [
      "Анимировать всё подряд → шум",
      "Путать с GSAP scroll-фильмом",
      "Забыть reduced-motion",
    ],
    agentPrompt: `Используй Motion (framer-motion) для UI в React/Next.
Точечные анимации: кнопки, списки, модалки, AnimatePresence.
Не тащи GSAP, если хватает Motion.
prefers-reduced-motion → мгновенные состояния без spring.
Сохрани существующие токены и компоненты проекта.`,
    demos: [
      { label: "motion.dev", href: "https://motion.dev" },
      { label: "Framer Motion docs", href: "https://www.framer.com/motion/" },
    ],
    sortOrder: 5,
  },
  {
    slug: "lottie",
    name: "Lottie / dotLottie",
    tagline: "Векторная анимация из дизайн-файла — лёгкая и чёткая",
    category: "Иллюстрации",
    tasks: ["illustration", "ui"],
    difficulty: "easy",
    tier: 1,
    stack: "Любой веб, React",
    price: "free runtime; контент — LottieFiles / AE",
    mobile: "ok",
    designDNA: "Иллюстрация живёт как премиальный motion-график, не как тяжёлый видеофайл.",
    can: ["Воспроизведение JSON/dotLottie", "Иконки, онбординг, empty states"],
    cannot: ["Сложная интерактивность как у Rive", "Не заменяет композицию лендинга"],
    whenYes: ["Нужна готовая векторная анимация", "Онбординг / empty state"],
    whenNo: ["Нужны state machine и реакция на клики → Rive"],
    pairsWith: ["LottieFiles", "React player"],
    alternatives: ["Rive", "GIF/WebM", "CSS"],
    mistakes: ["Тяжёлые файлы на mobile", "Автоплей без смысла"],
    agentPrompt: `Встрой Lottie/dotLottie в текущий проект.
Используй готовый файл или placeholder с понятным API загрузки.
Lazy-load, уважение reduced-motion (статичный кадр).
Не тащи тяжёлое видео вместо Lottie.`,
    demos: [{ label: "lottiefiles.com", href: "https://lottiefiles.com" }],
    sortOrder: 6,
  },
  {
    slug: "rive",
    name: "Rive",
    tagline: "Интерактивные иллюстрации со state machine",
    category: "Интерактив",
    tasks: ["illustration", "ui"],
    difficulty: "medium",
    tier: 2,
    stack: "Web runtime + Rive Editor",
    price: "freemium (editor)",
    mobile: "ok",
    designDNA: "Маскот и UI реагируют на действия пользователя, как мини-игра внутри интерфейса.",
    can: ["State machines", "Интерактивные кнопки/персонажи", "Малый вес runtime"],
    cannot: ["Не полноценный 3D", "Нужен редактор для контента"],
    whenYes: ["Маскот, онбординг, живые кнопки"],
    whenNo: ["Простой fade → Motion/Lottie", "3D-сцена → Spline"],
    pairsWith: ["React", "игровые UI"],
    alternatives: ["Lottie", "Spine"],
    mistakes: ["Слишком сложная state machine без нужды"],
    agentPrompt: `Подключи Rive runtime в проект и заложи место под .riv файл.
Опиши state machine простыми словами в комментарии/доке.
Fallback: статичное изображение при reduced-motion.`,
    demos: [{ label: "rive.app", href: "https://rive.app" }],
    sortOrder: 7,
  },
  {
    slug: "spline",
    name: "Spline",
    tagline: "3D в браузере без Blender — визуальный редактор + экспорт",
    category: "3D (вход)",
    tasks: ["3d"],
    difficulty: "easy",
    tier: 1,
    stack: "Web embed / React",
    price: "freemium",
    mobile: "careful",
    designDNA: "Премиальный 3D-объект на лендинге без ощущения «я изучал WebGL месяц».",
    can: ["Визуальный 3D-редактор", "Экспорт в веб", "Интерактив сцены"],
    cannot: ["Максимальный контроль как у Three.js", "Тяжёлые сцены убивают mobile"],
    whenYes: ["Hero с 3D-продуктом", "Быстрый эксперимент"],
    whenNo: ["Сложная кастомная сцена → Three/R3F"],
    pairsWith: ["GSAP", "Next.js"],
    alternatives: ["Three.js", "R3F", "model-viewer"],
    mistakes: ["Огромная сцена на телефоне без LOD/fallback"],
    agentPrompt: `Встрой Spline-сцену в текущий лендинг (embed или React).
Сделай лёгкий fallback на mobile (картинка/упрощённая сцена).
Не блокируй LCP: lazy-load 3D. Свяжи с UI-текстом и CTA.`,
    demos: [{ label: "spline.design", href: "https://spline.design" }],
    sortOrder: 8,
  },
  {
    slug: "three",
    name: "Three.js",
    tagline: "Стандарт WebGL — свой 3D-мир в браузере",
    category: "3D",
    tasks: ["3d"],
    difficulty: "hard",
    tier: 3,
    stack: "JavaScript",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Полный контроль над сценой, светом и камерой — как свой мини-движок.",
    can: ["Меши, свет, камера, шейдеры", "Игры и иммерсивные сайты"],
    cannot: ["Не no-code", "Высокий порог без агента/опыта"],
    whenYes: ["Нужен кастомный 3D", "Долгий продукт с 3D-ядром"],
    whenNo: ["Быстрый hero → Spline / model-viewer"],
    pairsWith: ["GSAP", "R3F", "Lenis", "drei"],
    alternatives: ["Spline", "Babylon.js", "R3F", "OGL"],
    mistakes: ["Сцена без оптимизации", "Игнор mobile GPU"],
    agentPrompt: `Собери минимальную Three.js сцену в нашем стеке.
Камера, свет, 1–2 объекта, resize, dispose при unmount.
Mobile fallback. Не тяни лишние эффекты. Документируй, что анимировать дальше.`,
    demos: [{ label: "threejs.org", href: "https://threejs.org" }],
    sortOrder: 9,
  },
  {
    slug: "r3f",
    name: "React Three Fiber",
    tagline: "Three.js декларативно в React",
    category: "3D",
    tasks: ["3d"],
    difficulty: "medium",
    tier: 3,
    stack: "React, Next.js",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "3D как компоненты React — ближе к привычному вайбкодингу на Next.",
    can: ["Declarative Canvas", "Экосистема drei", "Связка с React state"],
    cannot: ["Магия без понимания перформанса", "SSR осторожно (client only)"],
    whenYes: ["Уже на React/Next и нужен 3D"],
    whenNo: ["Один раз показать модель → Spline / model-viewer"],
    pairsWith: ["drei", "GSAP", "Lenis", "Theatre.js"],
    alternatives: ["Three.js vanilla", "Spline"],
    mistakes: ["Canvas на всём сайте без нужды", "Hydration ошибки"],
    agentPrompt: `Добавь React Three Fiber сцену (client component) в Next.js проект.
Используй @react-three/drei по минимуму.
SSR-safe. Mobile fallback. Не ломай существующий layout.`,
    demos: [{ label: "docs.pmnd.rs/react-three-fiber", href: "https://docs.pmnd.rs/react-three-fiber" }],
    sortOrder: 10,
  },
  {
    slug: "drei",
    name: "drei (@react-three/drei)",
    tagline: "Готовые хелперы для R3F: Environment, OrbitControls, Text, Float…",
    category: "3D / хелперы",
    tasks: ["3d"],
    difficulty: "medium",
    tier: 3,
    stack: "React Three Fiber",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "3D-сцена собирается из знакомых кубиков, а не с нуля каждый раз.",
    can: [
      "OrbitControls, Environment, ContactShadows",
      "Html overlay, Text, useGLTF",
      "Float, Sparkles, Stage — быстрый polish",
    ],
    cannot: ["Не работает без R3F/Three", "Не no-code редактор"],
    whenYes: ["Уже на R3F и нужно ускорить сцену", "Загрузка GLTF + окружение"],
    whenNo: ["Нет React → чистый Three / Spline", "Простой product viewer → model-viewer"],
    pairsWith: ["R3F", "Three.js", "GSAP"],
    alternatives: ["Писать хелперы вручную на Three", "Spline"],
    mistakes: ["Тащить весь drei ради одного контрола", "Игнор размера HDR/моделей"],
    agentPrompt: `В R3F-сцене используй @react-three/drei точечно:
Environment или Stage, OrbitControls, useGLTF для модели.
Не импортируй лишнее. Dispose/unload. Mobile: упростить тени и HDR.
SSR: только client component.`,
    demos: [{ label: "drei docs", href: "https://drei.docs.pmnd.rs" }],
    sortOrder: 11,
  },
  {
    slug: "phaser",
    name: "Phaser",
    tagline: "Фреймворк 2D HTML5-игр для браузера",
    category: "2D-игра",
    tasks: ["game"],
    difficulty: "medium",
    tier: 2,
    stack: "JavaScript / TypeScript",
    price: "free",
    mobile: "ok",
    designDNA: "Игра чувствуется как игра: сцены, спрайты, физика, цикл обновления.",
    can: ["Сцены, спрайты, input", "Arcade/Matter physics", "Квесты и аркады"],
    cannot: ["Не для обычного лендинга", "Не AAA 3D"],
    whenYes: ["Мини-игра, образовательный квест", "Вайбик-подобные опыты"],
    whenNo: ["Только анимация секции → GSAP"],
    pairsWith: ["Howler", "Matter.js", "Tone.js"],
    alternatives: ["PixiJS", "Kaboom", "Godot export"],
    mistakes: ["Смешать UI сайта и game loop без границ"],
    agentPrompt: `Создай минимальную Phaser 3/4 сцену в проекте (отдельный route/страница).
Игрок + простой interaction + win state.
Не ломай глобальные стили сайта. Mobile touch.`,
    demos: [
      { label: "phaser.io", href: "https://phaser.io" },
      { label: "Вайбик на ProektMap", href: "/vaibik" },
    ],
    sortOrder: 12,
  },
  {
    slug: "pixi",
    name: "PixiJS",
    tagline: "Быстрый 2D WebGL-рендер для эффектов и частиц",
    category: "2D-эффекты",
    tasks: ["game", "ui", "atmosphere"],
    difficulty: "medium",
    tier: 2,
    stack: "JavaScript",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Визуальные эффекты летают на 60fps — сайт ощущается «дорогим».",
    can: ["Sprites, particles", "2D сцены высокой производительности"],
    cannot: ["Не полноценный game framework как Phaser", "Не 3D"],
    whenYes: ["Частицы, эффекты, визуальный canvas-слой"],
    whenNo: ["Готовая игра с уровнями → Phaser"],
    pairsWith: ["GSAP", "Howler"],
    alternatives: ["Phaser", "Canvas API", "tsParticles", "Three.js"],
    mistakes: ["Эффект ради эффекта на всём viewport"],
    agentPrompt: `Добавь лёгкий PixiJS-слой для 2D-эффекта (particles/фон).
Ограничь FPS/частицы на mobile. Отключай при reduced-motion.`,
    demos: [{ label: "pixijs.com", href: "https://pixijs.com" }],
    sortOrder: 13,
  },
  {
    slug: "p5",
    name: "p5.js",
    tagline: "Креативный код: генератив, арт, обучение через скетчи",
    category: "Генератив",
    tasks: ["generative", "atmosphere"],
    difficulty: "easy",
    tier: 2,
    stack: "JavaScript",
    price: "free",
    mobile: "ok",
    designDNA: "Страница как живой скетч — уникальный визуал, которого нет в UI-kit.",
    can: ["Canvas-скетчи", "Генеративные паттерны", "Образовательные визуалы"],
    cannot: ["Не продакшен UI framework", "Не 3D AAA"],
    whenYes: ["Генеративный фон, арт, обучение"],
    whenNo: ["Кнопки и формы → обычный CSS/React"],
    pairsWith: ["Howler", "Tone.js", "простые лендинги"],
    alternatives: ["Three.js", "pure Canvas", "OGL"],
    mistakes: ["Тяжёлый draw loop без throttle", "Three/p5 на mobile без LOD"],
    agentPrompt: `Сделай p5.js скетч как визуальный блок страницы.
Пауза при reduced-motion. Не блокируй скролл. Адаптивный canvas.
На mobile упрости loop (меньше particles / ниже frameRate).`,
    demos: [{ label: "p5js.org", href: "https://p5js.org" }],
    sortOrder: 14,
  },
  {
    slug: "anime",
    name: "Anime.js",
    tagline: "Лёгкие timelines анимации без привязки к React",
    category: "UI motion",
    tasks: ["ui", "typography"],
    difficulty: "easy",
    tier: 1,
    stack: "Vanilla JS, любой фреймворк",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Точечный motion: элегантно и легковесно.",
    can: ["Timelines", "SVG/CSS/JS объекты", "Малый вес"],
    cannot: ["Не scroll-orchestrator уровня GSAP", "Не React-first как Motion"],
    whenYes: ["Небольшой сайт без React", "SVG-анимации"],
    whenNo: ["Сложный scroll-фильм → GSAP"],
    pairsWith: ["Vanilla HTML", "SVG", "SplitType"],
    alternatives: ["Motion", "GSAP", "CSS"],
    mistakes: ["Дублировать GSAP без причины"],
    agentPrompt: `Используй Anime.js для точечных UI/SVG анимаций.
Без лишних зависимостей. Reduced-motion: отключить.`,
    demos: [{ label: "animejs.com", href: "https://animejs.com" }],
    sortOrder: 15,
  },
  {
    slug: "theatre",
    name: "Theatre.js",
    tagline: "Визуальный timeline для сложных креативных сцен",
    category: "Креативный timeline",
    tasks: ["scroll", "3d", "ui"],
    difficulty: "hard",
    tier: 3,
    stack: "JS + Three/R3F часто",
    price: "free (core)",
    mobile: "careful",
    designDNA: "Анимация как в motion-design tool: ключи, кривые, режиссура.",
    can: ["Visual studio для анимации", "Связка с Three/R3F"],
    cannot: ["Оверкилл для простого UI"],
    whenYes: ["Сложная мультиобъектная сцена"],
    whenNo: ["Простой лендинг → GSAP/Motion"],
    pairsWith: ["R3F", "Three.js", "drei"],
    alternatives: ["GSAP timelines", "After Effects → Lottie"],
    mistakes: ["Внедрять Theatre «потому что круто»"],
    agentPrompt: `Оцени, нужен ли Theatre.js. Если да — минимальная сцена с timeline.
Иначе предложи GSAP. Документируй почему выбран Theatre.`,
    demos: [{ label: "theatrejs.com", href: "https://www.theatrejs.com" }],
    sortOrder: 16,
  },
  {
    slug: "howler",
    name: "Howler.js",
    tagline: "Звук и музыка в вебе без боли с браузерами",
    category: "Звук",
    tasks: ["sound", "game"],
    difficulty: "easy",
    tier: 1,
    stack: "JavaScript",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Сайт/игра звучат цельно: клики, атмосфера, без сюрпризов autoplay.",
    can: ["SFX/музыка", "Спрайты звука", "Кроссбраузерность"],
    cannot: ["Не визуальный движок", "Не синтез как Tone.js"],
    whenYes: ["Игра, квест, иммерсивный лендинг"],
    whenNo: ["Сайт без звука", "Нужен синтезатор → Tone.js"],
    pairsWith: ["Phaser", "Vaibik", "GSAP", "Tone.js"],
    alternatives: ["Web Audio API", "Tone.js"],
    mistakes: ["Autoplay без жеста пользователя", "Громкость без mute"],
    agentPrompt: `Подключи Howler.js для SFX/музыки.
Mute по умолчанию или только после клика.
Не ломай UX autoplay-политиками браузера.`,
    demos: [{ label: "howlerjs.com", href: "https://howlerjs.com" }],
    sortOrder: 17,
  },
  {
    slug: "matter",
    name: "Matter.js",
    tagline: "2D-физика: падения, коллизии, «живой» интерфейс",
    category: "Физика",
    tasks: ["physics", "game", "ui"],
    difficulty: "medium",
    tier: 2,
    stack: "JavaScript",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Объекты на экране подчиняются физике — вау без 3D.",
    can: ["Жёсткие тела, коллизии", "Интерактив мышью/тачем"],
    cannot: ["Не 3D-физика", "Не замена Phaser целиком"],
    whenYes: ["Физический UI-эксперимент", "Мини-игра"],
    whenNo: ["Обычный SaaS UI"],
    pairsWith: ["Phaser", "Pixi", "Howler"],
    alternatives: ["Phaser Arcade/Matter", "Rapier 2D"],
    mistakes: ["Физика на всём сайте → хаос и лаги"],
    agentPrompt: `Сделай изолированную Matter.js демо-сцену (отдельный блок/страница).
Пауза/destroy при уходе со страницы. Mobile: меньше тел.`,
    demos: [{ label: "brm.io/matter-js", href: "https://brm.io/matter-js/" }],
    sortOrder: 18,
  },
  {
    slug: "splittype",
    name: "SplitType",
    tagline: "Режет текст на буквы/слова/строки — топливо для GSAP-типографики",
    category: "Типографика",
    tasks: ["typography", "ui", "scroll"],
    difficulty: "easy",
    tier: 1,
    stack: "Vanilla JS + часто GSAP",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Буквы появляются по одной, волны и stagger — кинетическая типографика без After Effects.",
    can: [
      "split chars / words / lines",
      "Подготовка DOM под letter-анимации",
      "Связка с GSAP timelines / ScrollTrigger",
    ],
    cannot: [
      "Не анимирует сам — нужен GSAP/Anime/CSS",
      "Ломает SEO/выделение, если не аккуратно",
    ],
    whenYes: ["Hero с появлением по буквам", "Кинетическая типографика"],
    whenNo: ["Обычный абзац без motion", "Нужен платный GSAP SplitText как альтернатива"],
    pairsWith: ["GSAP", "ScrollTrigger", "Anime.js", "Curtains.js"],
    alternatives: ["GSAP SplitText (платный Club)", "Splitting.js"],
    mistakes: [
      "Сплит всего текста на странице",
      "Забыть aria / reduced-motion",
      "Путать с GSAP SplitText",
    ],
    agentPrompt: `Подключи SplitType для одного hero-заголовка.
Разбей на chars или words, анимируй через GSAP (stagger).
На mobile упрости. prefers-reduced-motion → показать текст сразу.
Не сплить весь контент страницы. Учти: альтернатива — GSAP SplitText (Club GreenSock).`,
    demos: [
      { label: "SplitType (GitHub)", href: "https://github.com/lukePeavey/SplitType" },
      { label: "GSAP SplitText", href: "https://gsap.com/docs/v3/Plugins/SplitText/" },
    ],
    sortOrder: 19,
  },
  {
    slug: "curtains",
    name: "Curtains.js",
    tagline: "HTML → WebGL-плоскости: шейдеры на div и картинках",
    category: "WebGL / шейдеры",
    tasks: ["atmosphere", "typography", "ui", "3d"],
    difficulty: "hard",
    tier: 3,
    stack: "JavaScript + WebGL",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Обычные блоки сайта становятся тканью с искажениями — Awwwards без полного Three-мира.",
    can: [
      "Plane из DOM-элемента/изображения",
      "Кастомные фрагментные шейдеры",
      "Эффекты на hero, галереях, тексте",
    ],
    cannot: ["Не полноценный 3D-движок", "Без fallback — чёрный квадрат на слабых устройствах"],
    whenYes: ["Шейдерный distortion на фото/тексте", "Креативный лендинг"],
    whenNo: ["Простой UI → CSS/Motion", "Сложная 3D-сцена → Three/R3F"],
    pairsWith: ["GSAP", "SplitType", "Lenis"],
    alternatives: ["Three.js", "OGL", "CSS filters"],
    mistakes: ["Curtains на всё без feature detect", "Забыть static fallback"],
    agentPrompt: `Сделай одну Curtains.js plane на hero-изображении или блоке.
Простой distortion-шейдер. Feature detect WebGL + картинка-fallback.
Mobile: отключить или сильно упростить. reduced-motion → статичное фото.
Dispose при unmount.`,
    demos: [{ label: "curtainsjs.com", href: "https://www.curtainsjs.com" }],
    sortOrder: 20,
  },
  {
    slug: "fluid-type",
    name: "Fluid type (CSS clamp)",
    tagline: "Жидкая типографика: clamp + fluid scale без JS-библиотек",
    category: "Типографика",
    tasks: ["typography", "ui"],
    difficulty: "easy",
    tier: 1,
    stack: "Чистый CSS (опционально Typeset/токены)",
    price: "free",
    mobile: "ok",
    designDNA: "Заголовки масштабируются с viewport плавно — как в дорогом дизайн-системе, без медиаточек-лесенки.",
    can: [
      "font-size: clamp(min, preferred, max)",
      "Fluid spacing через те же формулы",
      "Современная замена FlowType.js",
    ],
    cannot: [
      "Не анимация букв (нужен SplitType)",
      "FlowType — legacy-вдохновение, не ставь его в 2020-е",
    ],
    whenYes: ["Адаптивные заголовки без кучи breakpoints", "Дизайн-токены лендинга"],
    whenNo: ["Нужна кинетика букв → SplitType + GSAP"],
    pairsWith: ["Дизайн-токены", "GSAP", "Motion"],
    alternatives: ["Фиксированные rem + media queries", "Utopia fluid type calculator"],
    mistakes: [
      "Ставить FlowType.js вместо clamp",
      "clamp без ограничения min/max → микроскопический текст",
    ],
    agentPrompt: `Сделай fluid typography через CSS clamp (и при необходимости fluid spacing).
Не подключай FlowType.js — это legacy-вдохновение; современный путь = clamp + контейнерные запросы по желанию.
Задай шкалу для h1–body. Проверь читаемость на 320px и 1440px.
Сохрани существующие шрифты проекта.`,
    demos: [
      { label: "Utopia fluid type", href: "https://utopia.fyi/type/calculator/" },
      { label: "MDN clamp()", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp" },
    ],
    sortOrder: 21,
  },
  {
    slug: "vanta",
    name: "Vanta.js",
    tagline: "Готовые WebGL-фоны за пару строк — атмосфера без шейдеров с нуля",
    category: "Фон / атмосфера",
    tasks: ["atmosphere"],
    difficulty: "easy",
    tier: 1,
    stack: "Vanilla / React + Three (часть эффектов)",
    price: "free",
    mobile: "careful",
    designDNA: "Hero сразу «дорогой»: туман, волны, птицы — без изучения GLSL.",
    can: ["Готовые эффекты (waves, net, fog…)", "Быстрый atmospheric hero"],
    cannot: ["Кастомный контроль как у Three", "Тяжело full-screen на телефоне"],
    whenYes: ["Hero за вечер", "Нужна атмосфера без дизайнера-3D"],
    whenNo: ["SaaS-дашборд", "Слабые телефоны без fallback"],
    pairsWith: ["GSAP", "Mesh gradient (CSS)", "Motion"],
    alternatives: ["tsParticles", "CSS mesh-gradient", "Spline фон"],
    mistakes: ["Vanta full-screen на mobile", "Два WebGL-фона сразу"],
    agentPrompt: `Добавь Vanta-эффект на один hero-блок.
На mobile — CSS-градиент или статичный кадр вместо WebGL.
Lazy-init после load. Destroy при unmount. reduced-motion → без анимации.`,
    demos: [{ label: "vantajs.com", href: "https://www.vantajs.com" }],
    sortOrder: 22,
  },
  {
    slug: "tsparticles",
    name: "tsParticles",
    tagline: "Частицы, реагирующие на курсор — фон и микровзаимодействия",
    category: "Фон / атмосфера",
    tasks: ["atmosphere", "ui"],
    difficulty: "easy",
    tier: 2,
    stack: "JS / React / Vue",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Воздух на экране живой: частицы расступаются от курсора, сайт чувствуется интерактивным.",
    can: ["Particles, links, confetti", "Реакция на hover/click", "React-компонент"],
    cannot: ["Не 3D-сцена", "Перегруз density убивает FPS"],
    whenYes: ["Атмосферный фон с интерактом", "Celebration / confetti"],
    whenNo: ["Контентный блог без декора", "Mobile full-screen без лимитов"],
    pairsWith: ["Motion", "GSAP", "Vanta (не вместе!)"],
    alternatives: ["Vanta", "Pixi particles", "CSS"],
    mistakes: ["Слишком много particles на телефоне", "Вместе с Vanta на одном viewport"],
    agentPrompt: `Встрой tsParticles с умеренной density.
Реакция на курсор — ок на desktop; на mobile уменьши число и отключи interactivity при необходимости.
reduced-motion → статичный фон или 0 particles. Не комбинируй с Vanta на одном экране.`,
    demos: [{ label: "particles.js.org", href: "https://particles.js.org" }],
    sortOrder: 23,
  },
  {
    slug: "mesh-gradient",
    name: "Mesh / liquid gradients",
    tagline: "Анимированные mesh- и liquid-градиенты — тренд атмосферы без WebGL",
    category: "Фон / атмосфера",
    tasks: ["atmosphere", "ui"],
    difficulty: "easy",
    tier: 1,
    stack: "CSS / SVG / лёгкий JS",
    price: "free",
    mobile: "ok",
    designDNA: "Жидкий цвет перетекает как масло — современный hero без частиц и Three.",
    can: [
      "CSS/SVG mesh-подобные градиенты",
      "Мягкая анимация blobs / liquid",
      "Лёгкий mobile-friendly фон",
    ],
    cannot: ["Не фотореализм", "Не реакция на физику курсора уровня particles"],
    whenYes: ["Трендовый hero 2024–26", "Нужна атмосфера без GPU-боли"],
    whenNo: ["Нужен WebGL-эффект → Vanta/Curtains", "Строгий корпоративный flat"],
    pairsWith: ["Motion", "fluid-type", "View Transitions"],
    alternatives: ["Vanta", "Статичный CSS gradient", "Spline blur"],
    mistakes: ["Слишком кислотные цвета", "Анимация без reduced-motion"],
    agentPrompt: `Сделай animated mesh/liquid gradient фон на CSS/SVG (без тяжёлого WebGL).
Плавный loop, низкий CPU. Цвета из палитры проекта.
prefers-reduced-motion → статичный градиент. Не ставь Vanta «на всякий случай».`,
    demos: [
      { label: "CSS gradient tools", href: "https://cssgradient.io" },
      { label: "Mesh gradient inspiration", href: "https://www.mesher.app" },
    ],
    sortOrder: 24,
  },
  {
    slug: "barba",
    name: "Barba.js",
    tagline: "Переходы между страницами с ощущением SPA",
    category: "Переходы страниц",
    tasks: ["transitions"],
    difficulty: "medium",
    tier: 2,
    stack: "Vanilla / с любым MPA",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Кликнул ссылку — страница не «моргнула белым», а мягко перетекла в следующий экран.",
    can: ["PJAX-переходы", "Хуки leave/enter", "Связка с GSAP timelines"],
    cannot: ["Не замена Next.js App Router", "Сложнее отладка с тяжёлым SSR"],
    whenYes: ["Мультистраничный креативный сайт", "Нужен контроль leave/enter"],
    whenNo: ["Уже Next App Router + View Transitions", "Простой лендинг из одной страницы"],
    pairsWith: ["GSAP", "View Transitions API", "Lenis"],
    alternatives: ["Native View Transitions", "Next.js transitions", "Swup"],
    mistakes: ["Двойные инициализации скриптов после transition", "Игнор accessibility focus"],
    agentPrompt: `Оцени: нужен Barba или хватит View Transitions / Next.
Если Barba — минимальный leave/enter с GSAP, без поломки аналитики и скриптов.
Сохрани focus и reduced-motion. Документируй re-init компонентов после смены страницы.`,
    demos: [{ label: "barba.js.org", href: "https://barba.js.org" }],
    sortOrder: 25,
  },
  {
    slug: "view-transitions",
    name: "View Transitions API",
    tagline: "Нативные переходы страниц и DOM — без тяжёлой библиотеки",
    category: "Переходы страниц",
    tasks: ["transitions", "ui"],
    difficulty: "easy",
    tier: 1,
    stack: "Браузерный API + CSS; Next/React обёртки",
    price: "free (platform)",
    mobile: "ok",
    designDNA: "Переход выглядит «родным» для ОС: один документ плавно становится другим.",
    can: ["document.startViewTransition", "shared element-подобные имена", "MPA/SPA"],
    cannot: ["Не везде 100% поддержка — нужен fallback", "Не полный контроль как у Barba+GSAP"],
    whenYes: ["Современный Chrome/Edge/Safari", "Лёгкие page/UI transitions"],
    whenNo: ["Нужна сложная режиссура leave → Barba+GSAP"],
    pairsWith: ["Motion", "Next.js", "Barba (редко вместе)"],
    alternatives: ["Barba.js", "Motion AnimatePresence", "CSS only"],
    mistakes: ["Без fallback на старых браузерах", "Анимировать огромные деревья"],
    agentPrompt: `Реализуй переходы через View Transitions API (нативно).
CSS view-transition-name точечно. Fallback: мгновенная смена без ошибки.
reduced-motion → без анимации. В Next — официальный/простой паттерн, без Barba если не нужен.`,
    demos: [
      { label: "MDN View Transitions", href: "https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API" },
    ],
    sortOrder: 26,
  },
  {
    slug: "model-viewer",
    name: "model-viewer",
    tagline: "Google web component: 3D-модель + AR «в комнате»",
    category: "3D / AR",
    tasks: ["3d"],
    difficulty: "easy",
    tier: 1,
    stack: "Web Component (любой сайт)",
    price: "free (Apache-2.0)",
    mobile: "ok",
    designDNA: "Товар крутится на лендинге и открывается в AR — e-commerce вау без Three-кода.",
    can: ["GLB/GLTF viewer", "AR Quick Look / Scene Viewer", "Автоповорот, hotspots"],
    cannot: ["Не кастомный игровой мир", "Тяжёлые модели всё равно тормозят"],
    whenYes: ["Карточка товара, портфолио объекта", "Нужен AR на телефоне"],
    whenNo: ["Шейдерная арт-сцена → Three/R3F", "Редактор сцены → Spline"],
    pairsWith: ["Next.js", "Spline (контент)", "GSAP вокруг блока"],
    alternatives: ["Spline embed", "Three.js", "Babylon viewer"],
    mistakes: ["Огромный GLB без Draco/compression", "Без poster-картинки (LCP)"],
    agentPrompt: `Встрой <model-viewer> с GLB, poster и loading="lazy".
Включи AR где поддерживается. На слабых сетях — сжатая модель.
Не тащи R3F, если нужен только просмотр товара. Сохрани a11y (alt/poster).`,
    demos: [{ label: "modelviewer.dev", href: "https://modelviewer.dev" }],
    sortOrder: 27,
  },
  {
    slug: "gaussian-splatting",
    name: "Gaussian Splatting",
    tagline: "Фотореал нейро-облака точек в браузере",
    category: "3D / нейро",
    tasks: ["3d", "atmosphere"],
    difficulty: "hard",
    tier: 3,
    stack: "WebGL2 / Three / спец. viewers",
    price: "free viewers; контент — capture pipeline",
    mobile: "desktop",
    designDNA: "Реальное место или объект «оживает» как голограмма — не полигональный low-poly, а фотореализм.",
    can: ["Просмотр .splat / Planck / Spark-сцен", "Иммерсивные capture-туры"],
    cannot: ["Не лёгкий MVP на телефоне", "Нужен пайплайн съёмки/конвертации"],
    whenYes: ["Премиальный showcase пространства", "Desktop-first креатив"],
    whenNo: ["Мобильный лендинг", "Нет fallback-стратегии"],
    pairsWith: ["Three.js", "R3F", "статичный poster"],
    alternatives: ["Обычный GLTF", "видео 360", "Spline"],
    mistakes: ["Splat без fallback", "Запуск на mid-mobile без detect"],
    agentPrompt: `Если нужен Gaussian Splatting — desktop-first viewer + тяжёлый feature detect.
Обязателен poster/видео fallback на mobile.
Lazy-load после LCP. Документируй источник splat-файла и лимиты perf.
Не делай full-screen splat единственным контентом страницы.`,
    demos: [
      { label: "antimatter15/splat", href: "https://github.com/antimatter15/splat" },
      { label: "PlayCanvas supersplat", href: "https://playcanvas.com/supersplat" },
    ],
    sortOrder: 28,
  },
  {
    slug: "tone",
    name: "Tone.js",
    tagline: "Синтез и музыкальный Web Audio — дальше, чем Howler",
    category: "Звук",
    tasks: ["sound", "generative", "game"],
    difficulty: "medium",
    tier: 2,
    stack: "JavaScript (Web Audio)",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Сайт не просто «пикает» — он играет паттерны, синтез и генеративную музыку.",
    can: ["Синтезаторы, эффекты, Transport", "Генеративные партитуры", "Связка с визуалом"],
    cannot: ["Оверкилл для одного клик-SFX → Howler", "Autoplay всё ещё ограничен браузером"],
    whenYes: ["Генеративный звук, музыкальный UI, арт"],
    whenNo: ["Только mute/unmute mp3 → Howler"],
    pairsWith: ["p5", "Three", "Phaser", "Howler (для семплов)"],
    alternatives: ["Howler.js", "чистый Web Audio API"],
    mistakes: ["Старт звука без user gesture", "Два аудио-стека без нужды"],
    agentPrompt: `Используй Tone.js только если нужен синтез/паттерн, не простой SFX.
Старт после клика пользователя. Mute по умолчанию.
Для одного файла-эффекта предложи Howler вместо Tone.`,
    demos: [{ label: "tonejs.github.io", href: "https://tonejs.github.io" }],
    sortOrder: 29,
  },
  {
    slug: "mediapipe",
    name: "MediaPipe",
    tagline: "Трекинг рук, лица и позы в браузере — AI-вход в интерфейс",
    category: "AI / трекинг",
    tasks: ["ai-interact", "ui", "game"],
    difficulty: "hard",
    tier: 3,
    stack: "JS + WASM / TF.js solutions",
    price: "free (Apache-2.0)",
    mobile: "careful",
    designDNA: "Камера становится контроллером: жест руки листает сцену, лицо управляет UI.",
    can: ["Hands / Face / Pose landmarks", "Жесты как input", "Креативные инсталляции"],
    cannot: ["Без разрешения камеры бесполезен", "Тяжёлый CPU/GPU на слабых телефонах"],
    whenYes: ["Интерактивная инсталляция, demo AI UX"],
    whenNo: ["Обычный лендинг без камеры", "Нужна приватность без fallback"],
    pairsWith: ["Three.js", "p5", "Tone.js", "Phaser"],
    alternatives: ["TensorFlow.js models", "обычный pointer input"],
    mistakes: ["Включать камеру сразу на landinge", "Нет UI-отказа и fallback мыши"],
    agentPrompt: `Добавь MediaPipe (hands или face) как opt-in: кнопка «включить камеру».
Fallback на мышь/тач. На mobile предупреди о нагрузке и дай выключить.
Не делай камеру обязательной для контента. Соблюдай privacy copy.`,
    demos: [
      { label: "MediaPipe tasks", href: "https://ai.google.dev/edge/mediapipe/solutions/guide" },
    ],
    sortOrder: 30,
  },
  {
    slug: "autoanimate",
    name: "AutoAnimate (FormKit)",
    tagline: "Анимация списков одной строкой — без ручных layout-расчётов",
    category: "UI motion",
    tasks: ["ui", "transitions"],
    difficulty: "easy",
    tier: 1,
    stack: "React / Vue / Solid / Vanilla",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Элементы списка сами перестраиваются мягко — UI кажется «живым» без Motion-конфигов.",
    can: ["auto-animate parent", "add/remove/reorder", "Минимальный API"],
    cannot: ["Не сложные timelines", "Не scroll-фильм"],
    whenYes: ["Тосты, todo, фильтры, FAQ accordion"],
    whenNo: ["Нужен полный контроль spring → Motion", "Сайт-фильм → GSAP"],
    pairsWith: ["Motion", "React", "View Transitions"],
    alternatives: ["Motion layout", "FLIP вручную"],
    mistakes: ["Вешать на весь document", "Дублировать с тяжёлым Motion layout"],
    agentPrompt: `Подключи FormKit AutoAnimate на контейнер списка/аккордеона.
Одна строка setup. Не анимируй весь layout страницы.
reduced-motion учитывается библиотекой — проверь. Не тащи GSAP для простого списка.`,
    demos: [{ label: "auto-animate.formkit.com", href: "https://auto-animate.formkit.com" }],
    sortOrder: 31,
  },
  {
    slug: "ogl",
    name: "OGL",
    tagline: "Крошечная альтернатива Three — один шейдер без жира",
    category: "WebGL",
    tasks: ["3d", "atmosphere", "generative"],
    difficulty: "hard",
    tier: 3,
    stack: "JavaScript (минимальный WebGL)",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Один точный визуальный жест: полноэкранный шейдер или меш — без экосистемы Three.",
    can: ["Малый бандл", "Кастомные шейдеры", "Простые меши/текстуры"],
    cannot: ["Нет огромной экосистемы как у Three/R3F", "Не no-code"],
    whenYes: ["Один эффект/шейдер на лендинг", "Важен размер бандла"],
    whenNo: ["Большая 3D-продуктовая сцена → Three/R3F", "Нужны готовые хелперы → drei"],
    pairsWith: ["GSAP", "Lenis", "Curtains (схожий дух)"],
    alternatives: ["Three.js", "Curtains.js", "raw WebGL"],
    mistakes: ["Писать «свой Three» на OGL без нужды", "Без fallback"],
    agentPrompt: `Если нужен один шейдер/эффект — рассмотри OGL вместо полного Three.
Минимальная сцена, resize, dispose. Mobile fallback (CSS/картинка).
reduced-motion → стоп. Не подключай R3F «на всякий случай».`,
    demos: [{ label: "OGL GitHub", href: "https://github.com/oframe/ogl" }],
    sortOrder: 32,
  },
  {
    slug: "photo-sphere-viewer",
    name: "Photo Sphere Viewer",
    tagline: "360° виртуальные галереи и туры по панорамам с хотспотами",
    category: "Вирт. пространство",
    tasks: ["gallery", "tours", "3d"],
    difficulty: "medium",
    tier: 2,
    stack: "JS / React / Vue / vanilla",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Посетитель «стоит в зале»: крутит головой, кликает на работу — без строительства своего Matterport.",
    can: [
      "Equirectangular / cubemap панорамы",
      "Хотспоты, галереи сцен, переходы между залами",
      "Маркеры с описанием экспонатов",
      "Плагины: галерея, компас, гироскоп",
    ],
    cannot: [
      "Не полноценный 3D-движок с мебелью и физикой",
      "Не заменяет съёмку/подготовку панорам",
      "Не AR «в комнате» как model-viewer",
    ],
    whenYes: [
      "Портфолио, музей, шоурум, недвижимость «посмотри зал»",
      "Нужен тур по пространству за дни, не месяцы",
    ],
    whenNo: [
      "Нужен кастомный 3D-мир → Spline / R3F",
      "Одна модель товара → model-viewer",
      "Просто сетка фото → обычная галерея",
    ],
    pairsWith: ["GSAP (переходы UI)", "model-viewer (деталь рядом)", "Driver.js (онбординг)"],
    alternatives: ["Pannellum", "A-Frame", "Spline room", "Matterport embed"],
    mistakes: [
      "8K на мобиле",
      "Автоспин без остановки",
      "Десять сцен сразу без lazy",
    ],
    agentPrompt: `Встрой Photo Sphere Viewer: одна стартовая панорама, 2–5 хотспотов, опционально соседние сцены lazy.
Mobile: меньше разрешение, без автоспина. Fallback — JPEG + список работ.
Не строй R3F-музей в этом MVP.`,
    demos: [
      { label: "photo-sphere-viewer.js.org", href: "https://photo-sphere-viewer.js.org" },
    ],
    featured: true,
    sortOrder: 33,
  },
  {
    slug: "yandex-maps",
    name: "Яндекс.Карты API",
    tagline: "Карты, метки, маршруты — основной выбор для проектов из России",
    category: "Карты",
    tasks: ["maps", "tours"],
    difficulty: "easy",
    tier: 1,
    stack: "JS / React (обёртки), Next",
    price: "freemium (лимиты API)",
    mobile: "ok",
    designDNA: "Доверие к месту: «вот мы на карте», точки филиалов, маршрут доставки — без борьбы с тайлами.",
    can: [
      "Карта, метки, кластеры, попапы",
      "Геокодер, маршруты, поиск",
      "Кастомный стиль (в рамках API)",
      "Хорошо работает на РФ-мобилках",
    ],
    cannot: [
      "Не opensource-ядро как Leaflet",
      "Не «рисовалка» Awwwards-карт с шейдерами",
      "Нужен ключ и учёт квот",
    ],
    whenYes: [
      "Сайт из России: контакты, филиалы, доставка, ивенты",
      "Нужен предсказуемый геокодер по РФ-адресам",
    ],
    whenNo: [
      "Полностью opensource / без ключей → Leaflet + OSM",
      "Глобальный продукт со своим векторным стилем → MapLibre",
    ],
    pairsWith: ["Driver.js (тур «найди нас»)", "GSAP (story-map)", "AutoAnimate (список точек)"],
    alternatives: ["Leaflet", "MapLibre", "2GIS API"],
    mistakes: [
      "Ключ в публичном репо без ограничений",
      "Сотни меток без кластера",
      "Анимация камеры на каждый скролл",
    ],
    agentPrompt: `Встрой Яндекс.Карты: контейнер, центр, зум, маркеры из данных, балун с текстом.
API-ключ из env, ограничь по HTTP Referrer. Mobile — жесты карты ок, без лишних анимаций.
Если заказчик хочет без Яндекса — предложи Leaflet как альтернативу, не молча ставь Mapbox.`,
    demos: [
      { label: "developer.tech.yandex.ru/maps", href: "https://developer.tech.yandex.ru/maps" },
    ],
    featured: true,
    sortOrder: 34,
  },
  {
    slug: "leaflet",
    name: "Leaflet",
    tagline: "Лёгкие интерактивные карты на OSM — классика opensource",
    category: "Карты",
    tasks: ["maps"],
    difficulty: "easy",
    tier: 1,
    stack: "JS / React-Leaflet",
    price: "free (BSD) + тайлы OSM/свои",
    mobile: "ok",
    designDNA: "Карта как спокойный UI-слой: точки, полигоны, без vendor lock-in.",
    can: ["Метки, попапы, GeoJSON", "Плагины (кластеры, heat)", "Малый вес", "Свои тайлы"],
    cannot: ["Не «красивый 3D-глобус» из коробки", "Качество тайлов зависит от провайдера"],
    whenYes: ["Нужна бесплатная карта без ключа Яндекса/Google", "Простой MVP локаций"],
    whenNo: ["РФ-адреса и маршруты «из коробки» → Яндекс.Карты", "Векторный кастомный стиль → MapLibre"],
    pairsWith: ["GSAP", "Driver.js", "AutoAnimate"],
    alternatives: ["Яндекс.Карты", "MapLibre", "OpenLayers"],
    mistakes: ["Забыть attribution OSM", "Тысячи DOM-маркеров без кластера"],
    agentPrompt: `Собери карту на Leaflet + OSM (или указанный tile layer): маркеры, попапы, fitBounds.
Укажи attribution. Кластер если точек много. Не подключай Яндекс и Leaflet одновременно «на всякий случай».`,
    demos: [{ label: "leafletjs.com", href: "https://leafletjs.com" }],
    sortOrder: 35,
  },
  {
    slug: "maplibre",
    name: "MapLibre GL",
    tagline: "Векторные карты со своим стилем — наследник open Mapbox GL",
    category: "Карты",
    tasks: ["maps", "atmosphere"],
    difficulty: "medium",
    tier: 2,
    stack: "JS / maplibre-gl / react-map-gl",
    price: "free (BSD) + свои/облачные тайлы",
    mobile: "careful",
    designDNA: "Карта как часть бренда: тёмный стиль, акцент на маршруте, story-map под скролл.",
    can: ["Векторные стили", "Камера, pitch, bearing", "GeoJSON слои", "Связка со scroll-story"],
    cannot: ["Нужен источник тайлов/стиль", "Тяжелее Leaflet на слабых телефонах"],
    whenYes: ["Нужен брендовый вид карты", "Story-map / дата-журналистика"],
    whenNo: ["Простые 3 точки на сайте → Leaflet или Яндекс", "Нет бюджета на тайлы/стиль"],
    pairsWith: ["GSAP ScrollTrigger", "Lenis", "Theatre"],
    alternatives: ["Leaflet", "Яндекс.Карты", "Mapbox GL (платно)"],
    mistakes: ["Красивый стиль + 60fps scroll без throttle", "WebGL-карта на весь mobile hero"],
    agentPrompt: `Если нужен кастомный стиль — MapLibre GL, один стиль, несколько слоёв GeoJSON.
На mobile упрости pitch/анимации камеры. Не дублируй Яндекс+MapLibre в одном экране.`,
    demos: [{ label: "maplibre.org", href: "https://maplibre.org" }],
    sortOrder: 36,
  },
  {
    slug: "driver-js",
    name: "Driver.js",
    tagline: "Тур по интерфейсу: spotlight, шаги, «смотри сюда»",
    category: "Туры / онбординг",
    tasks: ["tours", "ui"],
    difficulty: "easy",
    tier: 1,
    stack: "JS / React / Vue / vanilla",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Продукт сам показывает дорогу: один луч внимания, короткие шаги, без видео на 20 минут.",
    can: [
      "Подсветка элементов DOM",
      "Пошаговый тур с кнопками",
      "Прогресс, overlay, кастомный UI шага",
      "Лёгкий вес, быстрый старт",
    ],
    cannot: [
      "Не 360° тур по залу (это Photo Sphere)",
      "Не заменяет хороший UX (тур — костыль к сложности)",
      "Не scroll-фильм",
    ],
    whenYes: ["Онбординг SaaS, админки, нового раздела", "«Покажи где кнопка» после релиза"],
    whenNo: ["Пространственный тур → Photo Sphere / Spline", "Длинная история → scroll-film"],
    pairsWith: ["AutoAnimate", "Motion", "Яндекс.Карты (тур «найди точку»)"],
    alternatives: ["Shepherd.js", "Intro.js", "React Joyride"],
    mistakes: [
      "Тур на каждом заходе",
      "15+ шагов",
      "Подсветка элементов, которых нет на mobile layout",
    ],
    agentPrompt: `Собери Driver.js tour: 5–7 шагов, skip, показать один раз (localStorage).
Селекторы устойчивые. На mobile проверь, что элементы видны.
Не путай с виртуальной 360-галереей.`,
    demos: [{ label: "driverjs.com", href: "https://driverjs.com" }],
    featured: true,
    sortOrder: 37,
  },
];

export function getCreativeTool(slug: string) {
  return CREATIVE_TOOLS.find((t) => t.slug === slug);
}

export function difficultyLabel(d: CreativeDifficulty) {
  if (d === "easy") return "Легко с AI";
  if (d === "medium") return "Средне";
  return "Тяжело";
}

export function mobileLabel(m: CreativeMobile) {
  if (m === "ok") return "Ок на мобиле";
  if (m === "careful") return "Осторожно на мобиле";
  return "Desktop-first";
}

export function tierLabel(t: CreativeTier) {
  return TIER_META[t].short;
}
