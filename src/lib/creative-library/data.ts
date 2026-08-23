/** Креативная библиотека вайбкодера — контент MVP (без БД). */

export type CreativeDifficulty = "easy" | "medium" | "hard";
export type CreativeEntry = "code" | "nocode" | "mixed";
export type CreativeMobile = "ok" | "careful" | "desktop";

export type CreativeTool = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  tasks: string[];
  difficulty: CreativeDifficulty;
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

export const TASK_FILTERS = [
  { id: "all", label: "Все задачи" },
  { id: "scroll", label: "Scroll-сайт" },
  { id: "ui", label: "UI-motion" },
  { id: "3d", label: "3D" },
  { id: "game", label: "2D-игра" },
  { id: "illustration", label: "Иллюстрации" },
  { id: "generative", label: "Генератив" },
  { id: "sound", label: "Звук" },
  { id: "physics", label: "Физика" },
] as const;

export const SCENARIOS: { title: string; desc: string; recommend: string[] }[] = [
  {
    title: "Хочу сайт-фильм",
    desc: "Скролл как пульт камеры, не обычный лендинг",
    recommend: ["gsap", "lenis"],
  },
  {
    title: "Красивый UI в React",
    desc: "Кнопки, переходы, появление блоков",
    recommend: ["motion", "anime"],
  },
  {
    title: "3D на лендинге без боли",
    desc: "Сначала редактор, потом код",
    recommend: ["spline", "three", "r3f"],
  },
  {
    title: "Маскот / интерактив",
    desc: "Живая иллюстрация, не просто gif",
    recommend: ["rive", "lottie"],
  },
  {
    title: "Простая 2D-игра",
    desc: "Квест, аркада, мини-игра в браузере",
    recommend: ["phaser", "howler", "matter"],
  },
];

export const CREATIVE_TOOLS: CreativeTool[] = [
  {
    slug: "gsap",
    name: "GSAP",
    tagline: "Движок плавной анимации для сайтов — от кнопок до scroll-фильмов",
    category: "Scroll / storytelling",
    tasks: ["scroll", "ui"],
    difficulty: "medium",
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
    pairsWith: ["Lenis", "Three.js / R3F", "Spline", "SplitText"],
    alternatives: ["Motion", "CSS scroll-driven", "Theatre.js"],
    mistakes: [
      "Анимировать всё подряд → шум и лаги",
      "Забыть mobile и reduced-motion",
      "Сказать агенту «сделай красиво на GSAP» без раскадровки",
      "Путать GSAP с Three.js",
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
Референс ProektMap: /demo/scroll-film и docs/SCROLL-FILM.md.`,
    demos: [
      { label: "Демо ProektMap — scroll-film", href: "/demo/scroll-film" },
      { label: "gsap.com", href: "https://gsap.com" },
    ],
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "lenis",
    name: "Lenis",
    tagline: "Мягкий «масляный» скролл — фундамент под GSAP и WebGL",
    category: "Scroll",
    tasks: ["scroll"],
    difficulty: "easy",
    stack: "Vanilla JS, React, Vue",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Скролл ощущается дорогим и непрерывным, без дёрганья браузера.",
    can: ["Smooth scroll", "Синхронизация с GSAP ScrollTrigger", "Параллакс и WebGL-сцены"],
    cannot: ["Не анимирует элементы сам по себе", "Не заменяет ScrollTrigger"],
    whenYes: ["Делаешь сайт-фильм", "Нужен премиальный скролл под GSAP"],
    whenNo: ["Обычный контентный сайт без motion"],
    pairsWith: ["GSAP", "Three.js", "R3F"],
    alternatives: ["Нативный скролл", "Locomotive Scroll (legacy)"],
    mistakes: ["Включить Lenis без нужды и сломать sticky", "Не связать с ScrollTrigger"],
    agentPrompt: `Подключи Lenis в текущем проекте как smooth scroll.
Свяжи с GSAP ScrollTrigger, если он уже есть или планируется.
Сохрани accessibility (якоря, sticky где возможно).
Не ломай нативный скролл без причины. Mobile: проверь плавность.`,
    demos: [{ label: "lenis.dev", href: "https://lenis.dev" }],
    sortOrder: 2,
  },
  {
    slug: "motion",
    name: "Motion",
    tagline: "Анимации UI для React (бывший Framer Motion)",
    category: "UI motion",
    tasks: ["ui"],
    difficulty: "easy",
    stack: "React, Next.js",
    price: "free (core MIT)",
    mobile: "ok",
    designDNA: "Интерфейс дышит: переходы страниц и компонентов ощущаются собранными.",
    can: ["layout / presence анимации", "жесты, hover", "page transitions"],
    cannot: ["Не лучший выбор для сложного scroll-фильма", "Не 3D-движок"],
    whenYes: ["React-приложение, дашборд, SaaS UI", "Нужны лёгкие появления и переходы"],
    whenNo: ["Кинематографический scroll-лендинг → GSAP"],
    pairsWith: ["Next.js App Router", "дизайн-токены проекта"],
    alternatives: ["GSAP", "Anime.js", "CSS transitions"],
    mistakes: ["Анимировать всё → тормоза", "Игнор reduced-motion"],
    agentPrompt: `Используй Motion (framer-motion) для UI-анимаций в текущем React/Next проекте.
Только осмысленные переходы: появление секций, layout, модалки.
Уважай prefers-reduced-motion. Не ставь GSAP, если достаточно Motion.`,
    demos: [{ label: "motion.dev", href: "https://motion.dev" }],
    sortOrder: 3,
  },
  {
    slug: "lottie",
    name: "Lottie / dotLottie",
    tagline: "Векторная анимация из дизайн-файла — лёгкая и чёткая",
    category: "Иллюстрации",
    tasks: ["illustration", "ui"],
    difficulty: "easy",
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
    sortOrder: 4,
  },
  {
    slug: "rive",
    name: "Rive",
    tagline: "Интерактивные иллюстрации со state machine",
    category: "Интерактив",
    tasks: ["illustration", "ui"],
    difficulty: "medium",
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
    sortOrder: 5,
  },
  {
    slug: "spline",
    name: "Spline",
    tagline: "3D в браузере без Blender — визуальный редактор + экспорт",
    category: "3D (вход)",
    tasks: ["3d"],
    difficulty: "easy",
    stack: "Web embed / React",
    price: "freemium",
    mobile: "careful",
    designDNA: "Премиальный 3D-объект на лендинге без ощущения «я изучал WebGL месяц».",
    can: ["Визуальный 3D-редактор", "Экспорт в веб", "Интерактив сцены"],
    cannot: ["Максимальный контроль как у Three.js", "Тяжёлые сцены убивают mobile"],
    whenYes: ["Hero с 3D-продуктом", "Быстрый эксперимент"],
    whenNo: ["Сложная кастомная сцена → Three/R3F"],
    pairsWith: ["GSAP", "Next.js"],
    alternatives: ["Three.js", "R3F", "Babylon"],
    mistakes: ["Огромная сцена на телефоне без LOD/fallback"],
    agentPrompt: `Встрой Spline-сцену в текущий лендинг (embed или React).
Сделай лёгкий fallback на mobile (картинка/упрощённая сцена).
Не блокируй LCP: lazy-load 3D. Свяжи с UI-текстом и CTA.`,
    demos: [{ label: "spline.design", href: "https://spline.design" }],
    sortOrder: 6,
  },
  {
    slug: "three",
    name: "Three.js",
    tagline: "Стандарт WebGL — свой 3D-мир в браузере",
    category: "3D",
    tasks: ["3d"],
    difficulty: "hard",
    stack: "JavaScript",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Полный контроль над сценой, светом и камерой — как свой мини-движок.",
    can: ["Меши, свет, камера, шейдеры", "Игры и иммерсивные сайты"],
    cannot: ["Не no-code", "Высокий порог без агента/опыта"],
    whenYes: ["Нужен кастомный 3D", "Долгий продукт с 3D-ядром"],
    whenNo: ["Быстрый hero → Spline"],
    pairsWith: ["GSAP", "R3F", "Lenis"],
    alternatives: ["Spline", "Babylon.js", "R3F"],
    mistakes: ["Сцена без оптимизации", "Игнор mobile GPU"],
    agentPrompt: `Собери минимальную Three.js сцену в нашем стеке.
Камера, свет, 1–2 объекта, resize, dispose при unmount.
Mobile fallback. Не тяни лишние эффекты. Документируй, что анимировать дальше.`,
    demos: [{ label: "threejs.org", href: "https://threejs.org" }],
    sortOrder: 7,
  },
  {
    slug: "r3f",
    name: "React Three Fiber",
    tagline: "Three.js декларативно в React",
    category: "3D",
    tasks: ["3d"],
    difficulty: "medium",
    stack: "React, Next.js",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "3D как компоненты React — ближе к привычному вайбкодингу на Next.",
    can: ["Declarative Canvas", "Экосистема drei", "Связка с React state"],
    cannot: ["Магия без понимания перформанса", "SSR осторожно (client only)"],
    whenYes: ["Уже на React/Next и нужен 3D"],
    whenNo: ["Один раз показать модель → Spline"],
    pairsWith: ["drei", "GSAP", "Lenis"],
    alternatives: ["Three.js vanilla", "Spline"],
    mistakes: ["Canvas на всём сайте без нужды", "Hydration ошибки"],
    agentPrompt: `Добавь React Three Fiber сцену (client component) в Next.js проект.
Используй @react-three/drei по минимуму.
SSR-safe. Mobile fallback. Не ломай существующий layout.`,
    demos: [{ label: "docs.pmnd.rs/react-three-fiber", href: "https://docs.pmnd.rs/react-three-fiber" }],
    sortOrder: 8,
  },
  {
    slug: "phaser",
    name: "Phaser",
    tagline: "Фреймворк 2D HTML5-игр для браузера",
    category: "2D-игра",
    tasks: ["game"],
    difficulty: "medium",
    stack: "JavaScript / TypeScript",
    price: "free",
    mobile: "ok",
    designDNA: "Игра чувствуется как игра: сцены, спрайты, физика, цикл обновления.",
    can: ["Сцены, спрайты, input", "Arcade/Matter physics", "Квесты и аркады"],
    cannot: ["Не для обычного лендинга", "Не AAA 3D"],
    whenYes: ["Мини-игра, образовательный квест", "Вайбик-подобные опыты"],
    whenNo: ["Только анимация секции → GSAP"],
    pairsWith: ["Howler", "Matter.js"],
    alternatives: ["PixiJS", "Kaboom", "Godot export"],
    mistakes: ["Смешать UI сайта и game loop без границ"],
    agentPrompt: `Создай минимальную Phaser 3/4 сцену в проекте (отдельный route/страница).
Игрок + простой interaction + win state.
Не ломай глобальные стили сайта. Mobile touch.`,
    demos: [
      { label: "phaser.io", href: "https://phaser.io" },
      { label: "Вайбик на ProektMap", href: "/vaibik" },
    ],
    sortOrder: 9,
  },
  {
    slug: "pixi",
    name: "PixiJS",
    tagline: "Быстрый 2D WebGL-рендер для эффектов и частиц",
    category: "2D-эффекты",
    tasks: ["game", "ui"],
    difficulty: "medium",
    stack: "JavaScript",
    price: "free (MIT)",
    mobile: "careful",
    designDNA: "Визуальные эффекты летают на 60fps — сайт ощущается «дорогим».",
    can: ["Sprites, particles", "2D сцены высокой производительности"],
    cannot: ["Не полноценный game framework как Phaser", "Не 3D"],
    whenYes: ["Частицы, эффекты, визуальный canvas-слой"],
    whenNo: ["Готовая игра с уровнями → Phaser"],
    pairsWith: ["GSAP", "Howler"],
    alternatives: ["Phaser", "Canvas API", "Three.js"],
    mistakes: ["Эффект ради эффекта на всём viewport"],
    agentPrompt: `Добавь лёгкий PixiJS-слой для 2D-эффекта (particles/фон).
Ограничь FPS/частицы на mobile. Отключай при reduced-motion.`,
    demos: [{ label: "pixijs.com", href: "https://pixijs.com" }],
    sortOrder: 10,
  },
  {
    slug: "p5",
    name: "p5.js",
    tagline: "Креативный код: генератив, арт, обучение через скетчи",
    category: "Генератив",
    tasks: ["generative"],
    difficulty: "easy",
    stack: "JavaScript",
    price: "free",
    mobile: "ok",
    designDNA: "Страница как живой скетч — уникальный визуал, которого нет в UI-kit.",
    can: ["Canvas-скетчи", "Генеративные паттерны", "Образовательные визуалы"],
    cannot: ["Не продакшен UI framework", "Не 3D AAA"],
    whenYes: ["Генеративный фон, арт, обучение"],
    whenNo: ["Кнопки и формы → обычный CSS/React"],
    pairsWith: ["Howler", "простые лендинги"],
    alternatives: ["Three.js", "pure Canvas"],
    mistakes: ["Тяжёлый draw loop без throttle"],
    agentPrompt: `Сделай p5.js скетч как визуальный блок страницы.
Пауза при reduced-motion. Не блокируй скролл. Адаптивный canvas.`,
    demos: [{ label: "p5js.org", href: "https://p5js.org" }],
    sortOrder: 11,
  },
  {
    slug: "anime",
    name: "Anime.js",
    tagline: "Лёгкие timelines анимации без привязки к React",
    category: "UI motion",
    tasks: ["ui"],
    difficulty: "easy",
    stack: "Vanilla JS, любой фреймворк",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Точечный motion: элегантно и легковесно.",
    can: ["Timelines", "SVG/CSS/JS объекты", "Малый вес"],
    cannot: ["Не scroll-orchestrator уровня GSAP", "Не React-first как Motion"],
    whenYes: ["Небольшой сайт без React", "SVG-анимации"],
    whenNo: ["Сложный scroll-фильм → GSAP"],
    pairsWith: ["Vanilla HTML", "SVG"],
    alternatives: ["Motion", "GSAP", "CSS"],
    mistakes: ["Дублировать GSAP без причины"],
    agentPrompt: `Используй Anime.js для точечных UI/SVG анимаций.
Без лишних зависимостей. Reduced-motion: отключить.`,
    demos: [{ label: "animejs.com", href: "https://animejs.com" }],
    sortOrder: 12,
  },
  {
    slug: "theatre",
    name: "Theatre.js",
    tagline: "Визуальный timeline для сложных креативных сцен",
    category: "Креативный timeline",
    tasks: ["scroll", "3d", "ui"],
    difficulty: "hard",
    stack: "JS + Three/R3F часто",
    price: "free (core)",
    mobile: "careful",
    designDNA: "Анимация как в motion-design tool: ключи, кривые, режиссура.",
    can: ["Visual studio для анимации", "Связка с Three/R3F"],
    cannot: ["Оверкилл для простого UI"],
    whenYes: ["Сложная мультиобъектная сцена"],
    whenNo: ["Простой лендинг → GSAP/Motion"],
    pairsWith: ["R3F", "Three.js"],
    alternatives: ["GSAP timelines", "After Effects → Lottie"],
    mistakes: ["Внедрять Theatre «потому что круто»"],
    agentPrompt: `Оцени, нужен ли Theatre.js. Если да — минимальная сцена с timeline.
Иначе предложи GSAP. Документируй почему выбран Theatre.`,
    demos: [{ label: "theatrejs.com", href: "https://www.theatrejs.com" }],
    sortOrder: 13,
  },
  {
    slug: "howler",
    name: "Howler.js",
    tagline: "Звук и музыка в вебе без боли с браузерами",
    category: "Звук",
    tasks: ["sound", "game"],
    difficulty: "easy",
    stack: "JavaScript",
    price: "free (MIT)",
    mobile: "ok",
    designDNA: "Сайт/игра звучат цельно: клики, атмосфера, без сюрпризов autoplay.",
    can: ["SFX/музыка", "Спрайты звука", "Кроссбраузерность"],
    cannot: ["Не визуальный движок"],
    whenYes: ["Игра, квест, иммерсивный лендинг"],
    whenNo: ["Сайт без звука"],
    pairsWith: ["Phaser", "Vaibik", "GSAP"],
    alternatives: ["Web Audio API", "Howler alternatives"],
    mistakes: ["Autoplay без жеста пользователя", "Громкость без mute"],
    agentPrompt: `Подключи Howler.js для SFX/музыки.
Mute по умолчанию или только после клика.
Не ломай UX autoplay-политиками браузера.`,
    demos: [{ label: "howlerjs.com", href: "https://howlerjs.com" }],
    sortOrder: 14,
  },
  {
    slug: "matter",
    name: "Matter.js",
    tagline: "2D-физика: падения, коллизии, «живой» интерфейс",
    category: "Физика",
    tasks: ["physics", "game", "ui"],
    difficulty: "medium",
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
    sortOrder: 15,
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
