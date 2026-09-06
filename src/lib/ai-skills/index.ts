import type {
  AiSkill,
  GraphEdge,
  GraphNode,
  SkillRecipe,
  SkillStack,
} from "./types";

export const AI_SKILLS: AiSkill[] = [
  {
    slug: "frontend-design",
    title: "Frontend Design",
    author: "Anthropic",
    repository: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
    category: "design",
    typeLabels: ["Frontend", "Design"],
    summary:
      "Базовый Skill: заставляет агента выбрать эстетическое направление до кода и уйти от «AI-slop» интерфейса.",
    does:
      "Перед вёрсткой агент фиксирует визуальное направление (editorial, brutalist, product-minimal и т.д.), типографику и якорь экрана. Снимает дефолты вроде Inter/Roboto, фиолетовых градиентов и сетки из одинаковых карточек.",
    whenToUse: [
      "Landing и маркетинговые страницы",
      "SaaS marketing site",
      "Первый экран продукта",
      "Любой UI «с нуля», где важен характер, а не только layout",
    ],
    install: `# Claude Code / skills CLI
npx skills add anthropics/skills --skill frontend-design

# Cursor: Skills → Add from repo anthropics/skills → frontend-design
# либо скопируйте папку skill в .cursor/skills/frontend-design/`,
    invoke: `Сначала подключи Skill Frontend Design (Anthropic).

Задача: [опиши экран]
Контекст продукта: [для кого / что продаём]
Эстетическое направление: [выбери одно: editorial / product-minimal / bold-marketing / …]
Ограничения: без Inter/Roboto/Arial; один визуальный якорь; без сетки «4 одинаковые карточки» как hero.
Стек: [Next.js / React / …]
Дизайн-система: читай DESIGN.md (если есть). Соблюдай токены проекта — не выдумывай цвета/радиусы/шрифты вне токенов.

Сначала зафиксируй направление и типографику в 5 буллетах, потом код.`,
    howToWrite: [
      {
        bad: "Сделай красивый лендинг",
        good:
          "Сделай лендинг SaaS для AI-инженеров. Направление: editorial, тёмный фон, один акцентный цвет, full-bleed hero. Без Inter и без фиолетового градиента. Используй токены из DESIGN.md.",
        why: "«Красивый» агент заменит средним вкусом из обучения. Направление + запреты + токены = управляемый результат.",
      },
      {
        bad: "Нарисуй дашборд как у Linear",
        good:
          "Собери product UI: боковая навигация, таблица задач, спокойная плотность. Направление product-minimal. Не копируй чужой бренд — возьми принципы плотности и иерархии. Цвета только из токенов дизайн-системы.",
        why: "Копирование бренда даёт шум. Принципы + токены + роль экрана дают повторяемый результат.",
      },
    ],
    example: {
      before:
        "Hero с Inter, фиолетовый градиент, 3 feature-карточки, кнопка Get Started — типичный AI-шаблон.",
      after:
        "Одно выбранное направление, сильная типографика, один якорь (фото/диаграмма/продукт), иерархия CTA без «карточного склада».",
    },
    result:
      "Интерфейс с явным характером: видно, что направление выбрано до кода, а не «как получилось».",
    limits: [
      "Не заменяет дизайн-систему продукта",
      "На внутренних admin/dashboard может быть слишком «маркетинговым» — тогда держите product-minimal",
      "Не аудитит a11y сам по себе — для этого web-design-guidelines",
    ],
    agents: ["Claude Code", "Cursor", "Codex", "Gemini CLI"],
    tags: ["frontend", "design", "anthropic", "baseline", "anti-slop"],
    relatedSlugs: ["taste-skill", "web-design-guidelines", "impeccable"],
    trust: "verified",
    graphRole: "IMPLEMENTATION — собрать UI по выбранному направлению",
  },
  {
    slug: "taste-skill",
    title: "taste-skill",
    author: "Leonxlnx / community",
    repository: "https://github.com/Leonxlnx/taste-skill",
    category: "design",
    typeLabels: ["Design", "Taste"],
    summary:
      "Слой вкуса: композиция, типографика, плотность, «anti-slop» как инженерная задача, а не vibes.",
    does:
      "Даёт агенту словарь вкуса и настраиваемые «ручки» (variance, motion, density). Ближе к art direction: помогает сделать интерфейс характерным, а не только «аккуратным».",
    whenToUse: [
      "Когда UI «правильный», но безличный",
      "Маркетинг, портфолио, вайб-лендинги",
      "Нужна более смелая визуальная личность",
      "После Frontend Design — усилить характер",
    ],
    install: `# skills CLI
npx skills add Leonxlnx/taste-skill

# Cursor: добавьте skill из репозитория Leonxlnx/taste-skill
# Перед установкой прочитайте SKILL.md — community skill`,
    invoke: `Подключи taste-skill.

Экран: [url или файл]
Цель вкуса: [смелее / тише / плотнее / воздуха больше]
Ограничения бренда: [цвета / шрифты / что нельзя]
Что сохранить: [структуру / копирайт / компоненты]

Дай 5 конкретных правок композиции и типографики, затем внеси их в код.
Не ломай токены дизайн-системы / DESIGN.md — усиливай иерархию внутри существующих правил.`,
    howToWrite: [
      {
        bad: "Сделай вкуснее",
        good:
          "Подними визуальную плотность: крупнее display-заголовок, меньше серых подписей, один сильный акцент. Не добавляй новые секции — только иерархия текущего hero. Цвета и радиусы только из DESIGN.md.",
        why: "«Вкуснее» неизмеримо. Плотность, акцент, токены и запрет расползания scope дают проверяемый diff.",
      },
      {
        bad: "Примени taste-skill ко всему сайту",
        good:
          "Примени taste-skill только к /pricing: variance средняя, motion низкая. Остальные страницы не трогай. Не вводи новые hex вне токенов.",
        why: "Skill без scope размазывает стиль. Указывайте экран, «ручки» и границу системы.",
      },
    ],
    example: {
      before: "Ровная сетка, одинаковый вес текста, «всё важно» → ничего не читается.",
      after: "Ясная иерархия: один display, один акцент, воздух вокруг CTA, характер без хаоса.",
    },
    result: "Интерфейс с читаемым характером: специалист видит, куда смотреть и что нажимать.",
    limits: [
      "Community skill — читайте SKILL.md до установки",
      "Может спорить с строгой корпоративной дизайн-системой",
      "Не заменяет a11y/performance audit",
    ],
    agents: ["Claude Code", "Cursor", "Codex"],
    tags: ["taste", "composition", "typography", "anti-slop"],
    relatedSlugs: ["frontend-design", "web-design-guidelines", "impeccable"],
    trust: "community",
    graphRole: "ВКУС — задать визуальные критерии и характер",
  },
  {
    slug: "web-design-guidelines",
    title: "Web Design Guidelines",
    author: "Vercel",
    repository: "https://github.com/vercel-labs/agent-skills",
    category: "design",
    typeLabels: ["Design", "Audit"],
    summary:
      "Quality gate: проверка UI по Web Interface Guidelines (a11y, UX, performance) — не генератор дизайна.",
    does:
      "Аудирует разметку и паттерны интерфейса против правил Vercel (доступность, UX, perf). Хорошо ставит «вторую пару глаз» после генерации Skill'ами вкуса и frontend-design.",
    whenToUse: [
      "Перед релизом страницы",
      "После крупного UI-рефакторинга",
      "Когда нужно формальное «что сломано»",
      "Пара к Frontend Design / Impeccable",
    ],
    install: `# skills CLI (пакет vercel-labs/agent-skills)
npx skills add vercel-labs/agent-skills --skill web-design-guidelines

# Cursor: Skills из vercel-labs/agent-skills → web-design-guidelines`,
    invoke: `Подключи web-design-guidelines (Vercel).

Проверь: [путь к странице / компоненту]
Стек: [Next.js App Router / …]
Фокус аудита: accessibility + UX + очевидные perf-ловушки.

Выдай список findings: severity · правило · где · как исправить.
Сначала критичные a11y, потом UX. Код правь только после списка.
При фиксах не ломай токены дизайн-системы / DESIGN.md.`,
    howToWrite: [
      {
        bad: "Проверь дизайн",
        good:
          "Прогони web-design-guidelines по src/app/pricing/page.tsx. Нужен чеклист findings с severity. Не рефакторь визуальный стиль — только нарушения guidelines. Токены DESIGN.md сохрани.",
        why: "Без scope агент начнёт «улучшать вкус». Guidelines — про нормы, не про art direction.",
      },
      {
        bad: "Сделай как в гайдлайнах Vercel и перерисуй всё",
        good:
          "Только audit. Для каждого critical/high — минимальный патч. Visual polish оставь Impeccable. Не вводи новые цвета вне токенов.",
        why: "Разделяйте роли Skills: audit ≠ redesign.",
      },
    ],
    example: {
      before: "Красивый UI, но кнопка без имени, низкий контраст, фокус невидим.",
      after: "Список нарушений + точечные фиксы; визуальный характер сохранён.",
    },
    result: "Понятный список проблем по правилам, а не расплывчатое «мне не нравится».",
    limits: [
      "Не проектирует эстетику",
      "Не заменяет ручной UX-ревью продукта",
      "Правила общие — доменные кейсы всё равно на специалисте",
    ],
    agents: ["Claude Code", "Cursor", "Codex"],
    tags: ["vercel", "a11y", "ux", "audit", "guidelines"],
    relatedSlugs: ["frontend-design", "taste-skill", "impeccable"],
    trust: "verified",
    graphRole: "НОРМЫ — проверить best practices до/после сборки",
  },
  {
    slug: "impeccable",
    title: "Impeccable",
    author: "Paul Bakaus",
    repository: "https://github.com/pbakaus/impeccable",
    category: "design",
    typeLabels: ["Frontend", "Polish"],
    summary:
      "Craft-слой: команды audit/polish/critique и антипаттерны. Доводит UI до production-качества поверх baseline.",
    does:
      "Расширяет Frontend Design командами вроде polish, audit, critique; разделяет brand vs product mode; ловит типовые anti-patterns (вложенные карточки, серый текст на цвете, дефолтные шрифты).",
    whenToUse: [
      "Финальный polish перед коммитом",
      "Когда UI уже есть, но «чуть-чуть AI»",
      "Нужен общий язык с агентом: quieter / bolder / distill",
      "Landing (brand) или app UI (product) — разные режимы",
    ],
    install: `# skills CLI
npx skills add pbakaus/impeccable

# Рекомендуется: заведите DESIGN.md / PRODUCT.md в корне проекта
# с палитрой, шрифтами и tone of voice — Impeccable читает ваши правила`,
    invoke: `Подключи Impeccable. Режим: [brand | product].

Контекст: читай DESIGN.md (если есть).
Экран: [путь]
Команда: /impeccable polish
(альтернативы: audit → normalize → polish)

Не меняй продуктовую логику. Только визуальная доводка и антипаттерны.
Соблюдай токены и правила из DESIGN.md / дизайн-системы — не подменяй палитру «на вкус Skill».
После правок кратко перечисли, что изменил.`,
    howToWrite: [
      {
        bad: "Сделай impeccable",
        good:
          "Режим product. /impeccable audit по dashboard layout, затем /impeccable polish. Сохрани наши токены из DESIGN.md. Не трогай API-слой.",
        why: "Нужны режим, команда и граница scope. Иначе Skill утащит маркетинг в админку.",
      },
      {
        bad: "Полируй всё подряд",
        good:
          "Только компонент PricingTable. Quieter: меньше теней и бордеров. Bolder — только на primary CTA. Цвета только из токенов.",
        why: "Команды Impeccable работают как рычаги — называйте их явно и держите систему.",
      },
    ],
    example: {
      before: "После генерации: карточки в карточках, плоский type scale, слабый CTA.",
      after: "Антипаттерны сняты, иерархия и контраст выровнены, character сохранён.",
    },
    result: "UI выглядит «собранным»: меньше AI-шума, больше дисциплины craft.",
    limits: [
      "Тяжелее по контексту, чем один frontend-design",
      "Без DESIGN.md может навязать чужой вкус — зафиксируйте свой",
      "Не заменяет продуктовые решения и копирайт",
    ],
    agents: ["Claude Code", "Cursor", "Codex", "Gemini CLI"],
    tags: ["impeccable", "polish", "craft", "anti-patterns"],
    relatedSlugs: ["frontend-design", "taste-skill", "web-design-guidelines"],
    trust: "community",
    graphRole: "POLISH — финальная доводка качества",
  },
];

export const AI_SKILL_STACK: SkillStack = {
  slug: "premium-landing-stack",
  title: "Premium Landing Stack",
  summary:
    "Комплект из четырёх Design Skills: направление → вкус → нормы → polish. Один набор под сильный landing/SaaS UI.",
  skillSlugs: [
    "frontend-design",
    "taste-skill",
    "web-design-guidelines",
    "impeccable",
  ],
  recipeSlug: "quality-saas-ui",
};

export const AI_SKILL_RECIPE: SkillRecipe = {
  slug: "quality-saas-ui",
  title: "Создать качественный SaaS-интерфейс",
  goal:
    "Экран или лендинг с характером, без AI-slop, прошедший norms-check и финальный polish.",
  stackSlug: "premium-landing-stack",
  steps: [
    {
      skillSlug: "frontend-design",
      role: "Направление и сборка",
      note: "Зафиксировать эстетику, затем сверстать каркас.",
    },
    {
      skillSlug: "taste-skill",
      role: "Вкус и композиция",
      note: "Усилить иерархию и характер без новых секций.",
    },
    {
      skillSlug: "web-design-guidelines",
      role: "Нормы",
      note: "Audit findings → точечные фиксы a11y/UX.",
    },
    {
      skillSlug: "impeccable",
      role: "Polish",
      note: "Режим brand или product → audit → polish.",
    },
  ],
  routePrompt: `Ты работаешь по AI Engineering Route ProektMap (Premium Landing Stack).

Задача: [SaaS экран / лендинг — опиши]
Стек: [Next.js / …]
Дизайн-система: читай DESIGN.md. Соблюдай токены — не выдумывай цвета/радиусы/шрифты вне системы.

Порядок (не перескакивай):
0) Если DESIGN.md нет — сначала предложи минимальный черновик токенов (не полный редизайн).
1) Frontend Design (Anthropic) — выбери направление, запрети Inter/фиолетовый градиент/карточный hero, собери UI на токенах.
2) taste-skill — усили вкус и композицию текущего экрана, без новых секций, внутри токенов.
3) web-design-guidelines (Vercel) — только audit + минимальные фиксы критичных findings.
4) Impeccable — режим [brand|product], /impeccable polish, без смены продуктовой логики и без подмены палитры.

После каждого шага: 3 буллета «что сделал» и что проверять глазами.
В конце: короткий before→after по визуальному качеству.`,
};

/** Педагогический граф ролей (не путать с порядком Recipe). */
export const DESIGN_SKILL_GRAPH_NODES: GraphNode[] = [
  { id: "phase-web", label: "WEB DESIGN", kind: "phase" },
  { id: "taste-skill", label: "taste-skill", kind: "skill", skillSlug: "taste-skill" },
  {
    id: "web-design-guidelines",
    label: "Guidelines",
    kind: "skill",
    skillSlug: "web-design-guidelines",
  },
  {
    id: "frontend-design",
    label: "Frontend Design",
    kind: "skill",
    skillSlug: "frontend-design",
  },
  { id: "phase-impl", label: "IMPLEMENTATION", kind: "phase" },
  { id: "impeccable", label: "Impeccable", kind: "skill", skillSlug: "impeccable" },
  { id: "phase-polish", label: "POLISH", kind: "phase" },
];

export const DESIGN_SKILL_GRAPH_EDGES: GraphEdge[] = [
  { from: "phase-web", to: "taste-skill" },
  { from: "phase-web", to: "web-design-guidelines" },
  { from: "taste-skill", to: "frontend-design" },
  { from: "web-design-guidelines", to: "frontend-design" },
  { from: "frontend-design", to: "phase-impl" },
  { from: "phase-impl", to: "impeccable" },
  { from: "impeccable", to: "phase-polish" },
];

export const WRITE_WELL_PILLARS = [
  {
    title: "Сначала язык продукта",
    text: "Токены и DESIGN.md важнее Skill. Усилитель без правил = красивый хаос.",
  },
  {
    title: "Назовите Skill и роль",
    text: "Не «улучши UI». А: «Подключи Frontend Design → зафиксируй направление → потом код».",
  },
  {
    title: "Дайте scope",
    text: "Экран, файл, маршрут. Без границы агент перепишет весь продукт.",
  },
  {
    title: "Зафиксируйте запреты",
    text: "Inter, фиолетовый градиент, карточки-в-карточках — явный stop-list сильнее «сделай красиво».",
  },
  {
    title: "Разделите шаги маршрута",
    text: "Сборка ≠ вкус ≠ audit ≠ polish. Один Skill — одна работа за проход.",
  },
] as const;

/** Полный контур AI-дизайна: система → Skills → паттерн. */
export const AI_DESIGN_CONTOUR = [
  {
    step: "0",
    title: "Дизайн-система / DESIGN.md",
    href: "/sandbox/design-system",
    role: "Язык продукта",
    note: "Токены, запреты, компоненты. Без этого Skills усиливают случайность.",
  },
  {
    step: "1",
    title: "Frontend Design",
    href: "/ai-skills/frontend-design",
    role: "Направление",
    note: "Выбрать эстетику и собрать каркас на токенах.",
  },
  {
    step: "2",
    title: "taste-skill",
    href: "/ai-skills/taste-skill",
    role: "Вкус",
    note: "Иерархия и характер внутри существующих правил.",
  },
  {
    step: "3",
    title: "Web Design Guidelines",
    href: "/ai-skills/web-design-guidelines",
    role: "Нормы",
    note: "Audit a11y/UX — точечные фиксы.",
  },
  {
    step: "4",
    title: "Impeccable",
    href: "/ai-skills/impeccable",
    role: "Polish",
    note: "Доводка craft; DESIGN.md не переписывать.",
  },
  {
    step: "5",
    title: "UI-Атлас (по желанию)",
    href: "/ui-patterns",
    role: "Паттерн экрана",
    note: "Готовый паттерн секции, если нужен конкретный блок.",
  },
] as const;

/** Минимальный DESIGN.md, который агент реально читает. */
export const DESIGN_MD_TEMPLATE = `# DESIGN.md — правила визуала для AI-агента

## Продукт
- Название: [имя]
- Для кого: [аудитория]
- Тип экранов: brand (маркетинг) | product (приложение) | оба

## Направление
- Эстетика: [editorial / product-minimal / bold-marketing / …]
- Характер в одном предложении: […]

## Токены (источник правды)
- Цвета: accent […], bg […], text […], border […]
- Шрифты: display […], body […] — запрещены: Inter, Roboto, Arial, Space Grotesk
- Отступы: xs/s/m/l/xl как в CSS-переменных проекта
- Радиусы: […]
- Файл токенов в коде: [например globals.css / tokens.css]

## Компоненты
- Использовать существующие: [Button, Card, Input, …]
- Не плодить новые атомы без причины

## Запреты (anti-slop)
- Нет фиолетового градиента «из коробки»
- Нет сетки из 4 одинаковых feature-карточек как hero
- Нет серого текста на цветном фоне
- Нет карточек внутри карточек без нужды
- Один визуальный якорь на экран

## Как агенту работать
1. Прочитай этот файл до кода.
2. Не выдумывай hex вне токенов.
3. Сначала план (5 буллетов), потом реализация.
4. Skills (Frontend Design / taste / guidelines / Impeccable) усиливают процесс, но не отменяют эти правила.
`;

export function getAiSkill(slug: string): AiSkill | undefined {
  return AI_SKILLS.find((s) => s.slug === slug);
}

export function getRelatedSkills(skill: AiSkill): AiSkill[] {
  return skill.relatedSlugs
    .map((slug) => getAiSkill(slug))
    .filter((s): s is AiSkill => Boolean(s));
}
