import type { AgentModule, AgentModuleSlug, TrackMeta } from "./types";

export const TRACK: TrackMeta = {
  title: "Инженерия агентов",
  href: "/agent-engineering",
  tagline: "Harness → Loop → Graph",
  valueProp:
    "Промпт — тонкий вход. Настоящее ремесло — окружение агента: закон проекта, цикл с проверкой и карта связей. Этот трек учит собрать машину работы, а не «написать красивую фразу».",
  afterTrack: [
    "Где закон проекта и почему ChatGPT в браузере — ещё не harness",
    "Что запускает действие агента и что ловит ошибку",
    "Как задать Definition of Done, бюджет циклов и критика",
    "Зачем граф связей вместо «запихнуть весь проект в контекст»",
    "Почему self-rewrite только с вашего разрешения",
  ],
};

export const MODULES: AgentModule[] = [
  {
    slug: "harness",
    order: 1,
    enLabel: "Harness Engineering",
    title: "Harness — каркас вокруг модели",
    shortTitle: "Harness",
    summary:
      "Сбруя и кнопки: инструкции, skills, хуки, права, папка. Модель умная — без каркаса она болтает, с каркасом выполняет миссию в ваших правилах.",
    heroLead:
      "Соберите окружение, в котором агент не угадывает, а следует закону проекта.",
    accent: "#0fb880",
    whatItIs: [
      "Harness (сбруя) — это каркас вокруг модели: правила, сценарии, автоматика до/после действия и границы прав.",
      "Промпт говорит «что сделать сейчас». Harness отвечает «как у нас принято всегда» — и не даёт сломать проект одной фразой.",
      "В Cursor / ProektMap harness живёт в AGENTS.md, .cursor/rules, skills, hooks и структуре папок.",
    ],
    driveCatchTitle: "Что ведёт действие и что его ловит",
    driveCatch: [
      {
        drive: "Запрос человека → совпадение skill → правило в AGENTS → план → инструмент / сабагент",
        catch: "Хук после правки → линтер / validate → аудитор → запрет (например, prisma force-reset)",
        example:
          "«Добавь решение» → skill resheniya-author. Создана страница → чеклист ловит: нет в SITE_TREE → стоп или автофикс.",
      },
    ],
    parts: [
      { name: "Инструкции (AGENTS.md, rules)", role: "Закон проекта: что всегда / никогда" },
      { name: "Skills", role: "Готовые сценарии: «когда задача X — делай так»" },
      { name: "Сабагенты", role: "Специалисты: один копает, другой пишет, третий проверяет" },
      { name: "Хуки", role: "Автоматика до/после действия: формат, тест, запрет" },
      { name: "Права", role: "Что можно трогать: файлы, сеть, git, secrets" },
      { name: "Папка проекта", role: "Карта мира: код, доки, скиллы, запретные зоны" },
      { name: "Инструменты", role: "Руки агента: Read, Shell, Browser…" },
      { name: "Память / граф (graphify)", role: "Не гадать — спросить карту связей" },
    ],
    checklist: [
      { label: "Есть AGENTS.md или эквивалент «закона»", hint: "Всегда / никогда без двусмысленности" },
      { label: "Папка .cursor/rules и skills на месте", hint: "Сценарии под повторяющиеся задачи" },
      { label: "Права: .env и force-reset закрыты", hint: "Секреты и разрушительные команды" },
      { label: "Понятная структура папок", hint: "src/, docs/, scripts/ — агент не блуждает" },
      { label: "Хук или чеклист после ключевой правки", hint: "sitemap, lint, build — что-то ловит" },
      { label: "Один skill под вашу частую миссию", hint: "Хотя бы черновик с полями и DoD" },
    ],
    prompts: [
      {
        level: "новичок",
        title: "Работа внутри готового harness",
        prompt: `Задача: добавить карточку инструмента в Нейро каталог.
Следуй AGENTS.md. Не коммить. После правки скажи URL для проверки.`,
      },
      {
        level: "средний вайбкодер",
        title: "Собрать harness под раздел",
        prompt: `Собери harness для раздела /arsenal:
1) rule: любой новый tool → sitemap + tracker
2) skill: arsenal-tool-author (поля slug, category, urls)
3) hook после Write в src/lib/arsenal/** → npm run validate:sitemap
4) права: нельзя .env и prisma force-reset
Покажи дерево папок и что ведёт / что ловит.`,
      },
    ],
    definitionOfDone: [
      "Есть краткий AGENTS (или rules) с «всегда / никогда»",
      "Описан один skill под вашу задачу",
      "Список прав: что агенту можно и нельзя",
      "Чеклист «что ловит» после правки (хотя бы вручную)",
    ],
    artifact: "Рабочий каркас: закон + 1 skill + права + папка (можно черновик в docs/)",
    afterTrackAnswers: [
      "Где закон проекта?",
      "Что запускает работу?",
      "Что останавливает ошибку?",
      "Где лежат skills / rules / hooks?",
      "Почему «просто ChatGPT в браузере» ≠ harness?",
    ],
    arsenalLinks: [
      { label: "Агент-кодер / вайбкодинг", href: "/arsenal/vibe-coder", note: "Cursor и контур кодинга" },
      { label: "Агенты, скиллы и рабочий контур", href: "/arsenal/mcp-agents", note: "Skills + MCP" },
      { label: "Агент на рабочем столе", href: "/arsenal/desktop-agent" },
    ],
    nextSlug: "loop",
    seoTitle: "Harness Engineering — каркас агента в Cursor | ProektMap",
    seoDescription:
      "Что такое harness engineering: инструкции, skills, хуки, права и папка проекта. Промпты для новичка и вайбкодера. Окружение важнее фразы.",
  },
  {
    slug: "loop",
    order: 2,
    enLabel: "Loop Engineering",
    title: "Loop — цикл с проверкой",
    shortTitle: "Loop",
    summary:
      "Не один ответ, а цикл: сделать → увидеть → исправить → снова, пока Definition of Done. Качество = повтор с наблюдаемостью, а не «красивый промпт».",
    heroLead:
      "Научите агента доводить до проверяемого результата — с бюджетом циклов и стопом.",
    accent: "#3b82f6",
    whatItIs: [
      "Loop — окружение повтора: цель, проверка, память итераций и выход (успех или эскалация человеку).",
      "Без loop агент «ответил и ушёл». С loop он крутит работу, пока критерий готовности не зелёный — или пока не исчерпан бюджет.",
      "На ProektMap зачатки loop уже есть: автор → аудитор, validate:sitemap, smoke HTTP 200 после деплоя.",
    ],
    driveCatchTitle: "Что ведёт итерацию и что её останавливает",
    driveCatch: [
      {
        drive: "«Ещё не зелёный тест / не 200 / не выполнен DoD» → следующая итерация",
        catch: "Лимит N циклов → стоп + отчёт человеку; хук «build failed» → не пушить",
        example:
          "Страница /demo/hello: открыть URL → не 200 → правка → снова. Максимум 3 попытки.",
      },
    ],
    parts: [
      { name: "Цель / DoD", role: "Что считать готовым — наблюдаемо, без «кажется ок»" },
      { name: "Наблюдаемость", role: "Лог, тест, скрин, HTTP 200, валидатор" },
      { name: "Бюджет", role: "Макс. N итераций / времени / денег" },
      { name: "Критик", role: "Другой агент или чеклист — не тот же, кто писал" },
      { name: "Память итерации", role: "Что уже пробовали — не крутить одно и то же" },
      { name: "Выход", role: "Успех или эскалация человеку с отчётом" },
    ],
    checklist: [
      { label: "DoD записан одной фразой + критерий проверки", hint: "Например: HTTP 200 на URL" },
      { label: "Способ увидеть результат", hint: "curl, браузер, скрипт, лог" },
      { label: "Лимит циклов", hint: "3–5 для MVP — иначе бесконечный спин" },
      { label: "Роль критика", hint: "Отдельный чеклист или skill-аудитор" },
      { label: "Журнал попыток", hint: "Что пробовали и почему не сработало" },
      { label: "Правило стопа", hint: "Когда звать человека, а не «ещё раз»" },
    ],
    prompts: [
      {
        level: "новичок",
        title: "Простой цикл с лимитом",
        prompt: `Сделай страницу /demo/hello. Потом открой URL. Если не 200 — исправь и проверь снова. Максимум 3 попытки.`,
      },
      {
        level: "средний вайбкодер",
        title: "Loop под баг с критиком",
        prompt: `Loop для бага «блог authorId FK»:
Цикл: гипотеза → правка → воспроизведение → лог.
Критик: отдельный чеклист (сессия Yandex ≠ userId в БД).
Стоп: 200 на create post ИЛИ 3 итерации + отчёт.
Не трогай force-reset.`,
      },
    ],
    definitionOfDone: [
      "Сценарий loop на бумаге: DoD + N циклов + критик + стоп",
      "Один прогон на реальной мелкой задаче с журналом попыток",
      "Понятно, когда агент эскалирует вам",
    ],
    artifact: "Сценарий цикла (markdown): цель, проверки, бюджет, критик, стоп",
    afterTrackAnswers: [
      "Чем loop отличается от одного промпта?",
      "Что такое наблюдаемый DoD?",
      "Зачем лимит циклов?",
      "Почему критик не должен быть тем же автором?",
    ],
    arsenalLinks: [
      { label: "Промпт-операции", href: "/arsenal/prompt-ops", note: "Повтор и качество промптов" },
      { label: "Агент-кодер / вайбкодинг", href: "/arsenal/vibe-coder" },
      { label: "Готовые решения AI", href: "/resheniya", note: "Маршруты с проверкой результата" },
    ],
    nextSlug: "graph",
    seoTitle: "Loop Engineering — цикл агента с проверкой | ProektMap",
    seoDescription:
      "Loop engineering: Definition of Done, бюджет итераций, критик и стоп. Как агент доводит задачу до проверяемого результата в Cursor.",
  },
  {
    slug: "graph",
    order: 3,
    enLabel: "Graph Engineering",
    title: "Graph — карта системы",
    shortTitle: "Graph",
    summary:
      "Работа не с плоским чатом, а с графом сущностей и связей. Агент читает карту, планирует по рёбрам, меняет код и обновляет граф. Self-rewrite — только с разрешения.",
    heroLead:
      "Контекст конечен. Проект больше окна. Нужен индекс связей — не портянка текста.",
    accent: "#d97706",
    whatItIs: [
      "Graph engineering — агент опирается на карту: что от чего зависит, куда идти в коде и в доках.",
      "Промпты и «весь контекст в окно» устаревают как единственная стратегия: окно конечно, проект растёт.",
      "Верхний слой — осторожный self-modifying harness: агент предлагает патч к своим skills/rules, но применяет только после вашего «да». Без разрешения — не «улучшает» себе права на .env.",
    ],
    driveCatchTitle: "Уровни графа: от чтения до осторожного self-rewrite",
    driveCatch: [
      {
        drive: "graphify query / path / explain → план по рёбрам → правка кода/доков → graphify update",
        catch: "Если граф врёт — сначала починить граф, потом фичу; self-rewrite skills только после явного «да»",
        example:
          "Новый мост /resheniya ↔ /arsenal: path → bridge в данных → update → аудитор видит мост.",
      },
    ],
    parts: [
      { name: "Чтение графа", role: "query / path / explain — что связано с чем" },
      { name: "План по рёбрам", role: "Идти по зависимостям, не наугад по файлам" },
      { name: "Изменение системы", role: "Код, доки, данные мостов" },
      { name: "Обновление графа", role: "graphify update после правок (AST, без API-стоимости)" },
      { name: "Self-rewrite (опция)", role: "Патч skill/rule только с разрешения человека" },
      { name: "Этика границ", role: "Не расширять права на secrets «для удобства»" },
    ],
    checklist: [
      { label: "Есть способ спросить карту связей", hint: "graphify или аналог индекса" },
      { label: "Правило: сначала граф, потом широкий grep", hint: "Ориентация до исследования" },
      { label: "После правок — обновление графа", hint: "Иначе карта устаревает" },
      { label: "Self-rewrite только с «да»", hint: "Diff инструкций на утверждение" },
      { label: "Запрет саморасширения прав", hint: "Особенно .env и разрушительные команды" },
      { label: "Песочница для экспериментов с rules", hint: "Не прод-права с первой попытки" },
    ],
    prompts: [
      {
        level: "новичок",
        title: "Только чтение графа",
        prompt: `Спроси graphify: «как блог связан с автором». По ответу графа объясни баг authorId простыми словами. Код не меняй.`,
      },
      {
        level: "средний вайбкодер",
        title: "Граф-задача с update",
        prompt: `Граф-задача: новый мост /resheniya/X ↔ /arsenal.
1) graphify path между решением и arsenal
2) добавь bridge в данные
3) graphify update
4) проверь, что аудитор видит мост
Если граф врёт — сначала почини граф, потом фичу.`,
      },
    ],
    definitionOfDone: [
      "Одна задача решена через graphify (или аналог) + update",
      "Понимаете разницу: читать граф ≠ переписывать свои права",
      "(Опционально) Черновик патча skill с явным запросом «да»",
    ],
    artifact: "Отчёт: вопрос к графу → путь → правка → update (+ опц. diff skill на утверждение)",
    afterTrackAnswers: [
      "Почему нельзя полагаться только на контекстное окно?",
      "Что делает graphify update?",
      "Чем опасен «дикий» self-rewrite?",
      "Когда править skill, а когда — только код?",
    ],
    arsenalLinks: [
      { label: "Агенты, скиллы и рабочий контур", href: "/arsenal/mcp-agents" },
      { label: "Агент-кодер / вайбкодинг", href: "/arsenal/vibe-coder" },
      { label: "Skills ProektMap", href: "/skills", note: "Каталог сценариев" },
    ],
    nextSlug: null,
    seoTitle: "Graph Engineering — карта связей и агент | ProektMap",
    seoDescription:
      "Graph engineering: граф зависимостей, graphify, update и осторожный self-rewrite skills только с разрешения. Окружение агента вместо портянки контекста.",
  },
];

export function getModule(slug: string): AgentModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getModuleSlugs(): string[] {
  return MODULES.map((m) => m.slug);
}

export function getNextModule(slug: AgentModuleSlug): AgentModule | null {
  const current = getModule(slug);
  if (!current?.nextSlug) return null;
  return getModule(current.nextSlug) ?? null;
}
