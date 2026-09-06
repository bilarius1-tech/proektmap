import type { GuidedReference, GuidedSolution } from "./guided-data";
import { withResheniyaOnboardingFirst } from "./workspace-setup";

const ref = (
  kind: GuidedReference["kind"],
  label: string,
  href: string,
  description: string,
): GuidedReference => ({ kind, label, href, description });

const cursorRef = ref("Инструмент", "Cursor", "/ai-tools/cursor", "AI-редактор для сборки шаблона");
const aiSkillsRef = ref("Skill", "AI Engineering Skills", "/ai-skills", "Усилители агента: Design-кластер и Recipe");
const designSystemRef = ref("Паттерн", "Дизайн-система", "/sandbox/design-system", "Токены и язык продукта");
const uiPatternsRef = ref("Паттерн", "UI-Атлас", "/ui-patterns", "Готовые секции после характера экрана");
const designMdRef = ref("Skill", "Шаблон DESIGN.md", "/ai-skills#design-md", "Правила визуала, которые читает агент");
const recipeRef = ref("Skill", "Recipe SaaS UI", "/ai-skills#recipe", "Порядок Skills: сборка → вкус → нормы → polish");
const rfStackRef = ref("Инструмент", "AI без VPN", "/ai-without-vpn", "Как работать из РФ без западных сервисов");
const vibeCoderRef = ref("Инструмент", "Нейро каталог: вайбкодер", "/arsenal/vibe-coder", "Стек агента-кодера под миссию");

/**
 * Готовое решение: первый премиум-шаблон сайта без «AI-скуфа».
 * Даже на простых/слабых моделях — за счёт Skills, DESIGN.md и жёстких запретов.
 */
export const guidedPremiumLandingSolution: GuidedSolution = {
  slug: "premium-landing",
  title: "Премиум-шаблон без AI-скуфа",
  subtitle: "Маршрут вайбкодера: характерный лендинг на Next.js",
  result:
    "На localhost (и по желанию на VPS/хостинге в РФ) открывается адаптивный одностраничный шаблон: сильная типографика, один визуальный якорь, без Inter/фиолетового градиента/карточной сетки. Есть DESIGN.md и чеклист «не AI-шно».",
  duration: "1–2 дня",
  defaultStack: [
    "Плати по миру → оплата Cursor из РФ",
    "Локально в Cursor (SSH — на финише/хостинге)",
    "Cursor (Agent)",
    "Next.js App Router + TypeScript",
    "CSS-переменные / токены (без обязательного Tailwind)",
    "next/font (характерный display + body)",
    "AI Skills: Frontend Design → taste-skill → web-design-guidelines → Impeccable",
    "DESIGN.md в корне",
    "Проверка из РФ: без VPN для сборки; деплой Beget / Timeweb / свой VPS",
  ],
  steps: withResheniyaOnboardingFirst([
    {
      slug: "direction",
      shortTitle: "Направление",
      title: "Фиксируем эстетическое направление",
      duration: "15–25 минут",
      goal: "В BRIEF.md записаны продукт, аудитория и одно направление (editorial). Запреты AI-скуфа подтверждены.",
      recommendation: {
        title: "Направление editorial (бренд-лендинг)",
        why: "Для первого премиум-шаблона editorial даёт сильную типографику и характер без копирования чужого SaaS-дашборда. ProektMap выбирает его за вас — не нужно «угадывать стиль».",
        link: aiSkillsRef,
      },
      explanation:
        "Слабая модель без направления всегда выдаёт AI-скуф: Inter, фиолетовый градиент, три одинаковые карточки. Направление + запреты сильнее «сделай красиво». Оплату Cursor уже закрыли на шаге «Оплата из РФ».",
      instructions: [
        {
          title: "Откройте Cursor",
          text: "Создайте пустую папку проекта (например premium-landing) и откройте её в Cursor.",
        },
        {
          title: "Скопируйте промпт BRIEF",
          text: "В Agent mode вставьте готовый промпт ниже. Не меняйте направление editorial без причины.",
        },
        {
          title: "Проверьте BRIEF.md",
          text: "В файле должны быть: продукт, аудитория, направление editorial, список запретов.",
        },
      ],
      prompt: {
        title: "Создать BRIEF.md",
        body: `Создай файл BRIEF.md в корне.

Продукт: лендинг услуг AI-инженера / вайбкодера (можно заменить название услуги в одном месте).
Аудитория: предприниматели и специалисты из России, которым нужен сайт «не как у всех».
Направление (зафиксировано ProektMap): editorial.
Режим: brand (маркетинг), не product-dashboard.

Запреты (anti-slop):
- Inter, Roboto, Arial, Space Grotesk
- фиолетовый / indigo градиент на белом
- hero из 3–4 одинаковых feature-карточек
- emoji-иконки в кружках над каждым заголовком секции
- «Get Started» без характера
- серый текст на цветном фоне

Плохо (не делай так в BRIEF):
«Сделай красивый современный сайт в стиле AI».

Хорошо (эталон формулировки):
«Editorial brand landing: тёмный фон, один display-шрифт с характером, один акцентный цвет, full-bleed hero, один якорь, мобильная адаптация с первой версии».

Пока не пиши код. Только BRIEF.md. Покажи файл.`,
      },
      success: [
        "Файл BRIEF.md существует",
        "Направление = editorial",
        "В файле есть явный список запретов anti-slop",
      ],
      artifact: "BRIEF.md с направлением editorial",
      terms: ["вайбкодинг", "лендинг", "типографика"],
      references: [cursorRef, aiSkillsRef, designSystemRef],
    },
    {
      slug: "design-md",
      shortTitle: "DESIGN.md",
      title: "Пишем язык продукта для агента",
      duration: "20–35 минут",
      goal: "В корне лежит DESIGN.md с токенами, шрифтами и запретами. Агент будет читать его на каждом шаге.",
      recommendation: {
        title: "Сначала DESIGN.md, потом Skills и код",
        why: "Skills без правил продукта усиливают случайность. DESIGN.md — якорь даже для слабой модели: она не выдумывает палитру и шрифты.",
        link: designMdRef,
      },
      explanation:
        "Скопируйте шаблон с /ai-skills#design-md и заполните под BRIEF. Плохо: пустой DESIGN.md «потом». Хорошо: 1 страница токенов до первого JSX.",
      instructions: [
        {
          title: "Откройте шаблон DESIGN.md",
          text: "На ProektMap: /ai-skills#design-md — кнопка Copy DESIGN.md.",
        },
        {
          title: "Создайте файл в проекте",
          text: "Вставьте шаблон в DESIGN.md и допишите конкретные токены под editorial (тёмный фон, один акцент).",
          command: "test -f DESIGN.md && wc -l DESIGN.md",
        },
        {
          title: "Сверьте с BRIEF",
          text: "Направление и запреты в DESIGN.md совпадают с BRIEF.md.",
        },
      ],
      prompt: {
        title: "Дописать DESIGN.md по BRIEF",
        body: `Прочитай BRIEF.md.

Создай или обнови DESIGN.md по правилам ProektMap:
- токены цвета (bg, text, accent, border) — конкретные hex
- display + body шрифты (не Inter/Roboto/Arial/Space Grotesk)
- отступы xs–xl
- запреты anti-slop из BRIEF
- правило: «агент не выдумывает hex вне токенов»

Плохо:
«Используй современную палитру и красивые шрифты».

Хорошо:
«bg #0c0f0e, text #f3f1ea, accent #c4a574; display: Fraunces; body: Source Serif 4; запрещены Inter и фиолетовый градиент».

Не пиши страницы. Только DESIGN.md. Покажи итог.`,
      },
      success: [
        "DESIGN.md содержит конкретные hex и имена шрифтов",
        "Запреты anti-slop перечислены",
        "Нет Inter/Roboto в списке разрешённых шрифтов",
      ],
      artifact: "DESIGN.md — язык продукта",
      terms: ["дизайн-токены", "типографика"],
      references: [designMdRef, designSystemRef, aiSkillsRef],
    },
    {
      slug: "skills",
      shortTitle: "Skills",
      title: "Ставим Premium Landing Stack",
      duration: "15–30 минут",
      goal: "В агенте доступны Frontend Design, taste-skill, web-design-guidelines и Impeccable. Скопирован Recipe-порядок.",
      recommendation: {
        title: "Стек из /ai-skills: Premium Landing Stack",
        why: "Четыре Skill закрывают роли: направление → вкус → нормы → polish. Это сильнее одной просьбы «сделай не AI-шно», особенно на простых моделях.",
        link: recipeRef,
      },
      explanation:
        "Плохо: «поставь все Skills с GitHub». Хорошо: только Design-кластер и порядок из Recipe. Источники: Anthropic frontend-design, Leonxlnx/taste-skill, vercel-labs web-design-guidelines, pbakaus/impeccable.",
      instructions: [
        {
          title: "Откройте карточку стека",
          text: "https://proektmap.ru/ai-skills — блок Premium Landing Stack и Recipe.",
        },
        {
          title: "Установите Skills",
          text: "По очереди выполните install с карточек (или skills CLI). Перед community-skill прочитайте SKILL.md.",
          command:
            "npx skills add anthropics/skills --skill frontend-design\n# затем taste-skill, web-design-guidelines, impeccable — см. карточки /ai-skills",
        },
        {
          title: "Скопируйте Recipe prompt",
          text: "Сохраните route prompt из /ai-skills#recipe в NOTES.md — порядок шагов не меняйте.",
        },
      ],
      prompt: {
        title: "Проверка: агент видит Skills",
        body: `Перечисли, какие design Skills доступны в этой сессии.
Подтверди порядок ProektMap Recipe:
1) Frontend Design
2) taste-skill
3) web-design-guidelines
4) Impeccable

Плохо: «Буду импровизировать стиль».
Хорошо: «Работаю по Recipe; DESIGN.md — источник правды».

Код страниц пока не пиши.`,
      },
      success: [
        "Хотя бы Frontend Design и Impeccable установлены или подключены",
        "Понятен порядок Recipe",
        "Есть NOTES.md или аналог с route prompt",
      ],
      artifact: "Установленный Premium Landing Stack",
      terms: ["Skill", "AI-агент"],
      references: [aiSkillsRef, recipeRef, vibeCoderRef],
    },
    {
      slug: "scaffold",
      shortTitle: "Каркас",
      title: "Создаём Next.js и подключаем шрифты",
      duration: "25–40 минут",
      goal: "Next.js запускается на localhost; шрифты из DESIGN.md подключены через next/font; токены в CSS.",
      recommendation: {
        title: "Next.js App Router + next/font + CSS-переменные",
        why: "Один стек без лишних UI-kit. next/font гарантирует характерную типографику; CSS-переменные совпадают с DESIGN.md. Tailwind не обязателен — меньше «шаблонного» вида.",
        link: cursorRef,
      },
      explanation:
        "Плохо: create-next-app с дефолтным Inter и фиолетовой темой. Хорошо: сразу токены и шрифты из DESIGN.md, пустой hero-placeholder.",
      instructions: [
        {
          title: "Создайте приложение",
          text: "В корне проекта (если ещё нет Next.js):",
          command:
            "npx create-next-app@latest . --ts --eslint --app --src-dir --use-npm --no-tailwind --yes",
        },
        {
          title: "Запустите dev-сервер",
          text: "Откройте http://localhost:3000",
          command: "npm run dev",
        },
        {
          title: "Передайте промпт каркаса",
          text: "Скопируйте промпт ниже в Agent — пусть подключит шрифты и токены без секций-фич.",
        },
      ],
      prompt: {
        title: "Каркас + шрифты + токены",
        body: `Прочитай DESIGN.md и BRIEF.md.

Собери каркас Next.js App Router:
1) Подключи display и body через next/font (имена из DESIGN.md). Не используй Inter/Roboto/Arial/Space Grotesk.
2) Вынеси CSS-переменные токенов в globals.css.
3) page.tsx: минимальный full-bleed hero-placeholder (заголовок + одна строка + один CTA). Без сетки из 3 карточек. Без фиолетового градиента.
4) Адаптив: на 375px нет горизонтального скролла, CTA ≥ 52px по высоте.

Плохо: дефолтный шаблон create-next-app «как есть».
Хорошо: сразу видно editorial-направление и токены.

Покажи diff и как проверить на localhost:3000.`,
      },
      success: [
        "localhost:3000 открывается",
        "В DevTools шрифты не Inter/Roboto",
        "На узкой ширине нет горизонтального overflow",
      ],
      artifact: "Работающий каркас Next.js с токенами",
      terms: ["Next.js", "типографика", "адаптивная вёрстка"],
      references: [cursorRef, designSystemRef, designMdRef],
    },
    {
      slug: "compose",
      shortTitle: "Сборка UI",
      title: "Собираем секции по Frontend Design + taste",
      duration: "40–90 минут",
      goal: "Есть hero, одна смысловая секция и футер с характером. Нет AI-скуф паттернов из запретов.",
      recommendation: {
        title: "Сначала Frontend Design, затем taste-skill",
        why: "Frontend Design задаёт реализацию направления; taste усиливает иерархию без новых секций. Не смешивайте audit/polish на этом шаге.",
        link: ref("Skill", "Frontend Design", "/ai-skills/frontend-design", "Базовый Skill Anthropic"),
      },
      explanation:
        "Плохо: «Сделай лендинг с преимуществами, отзывами и тарифами сразу». Хорошо: один якорь → одна секция доказательства → футер. Меньше секций — больше премиум.",
      instructions: [
        {
          title: "Вызовите Frontend Design",
          text: "Скопируйте invoke с /ai-skills/frontend-design и промпт ниже.",
        },
        {
          title: "Усильте вкусом",
          text: "Отдельным сообщением подключите taste-skill только к текущему hero (без новых секций).",
        },
        {
          title: "Сверьте запреты",
          text: "Визуально: нет 3 одинаковых карточек в hero, нет фиолетового градиента, один CTA-акцент.",
        },
      ],
      prompt: {
        title: "Сборка editorial landing",
        body: `Подключи Skill Frontend Design (Anthropic), затем при необходимости taste-skill.

Читай DESIGN.md и BRIEF.md. Не выдумывай токены.

Задача: одностраничный brand landing.
Секции только:
1) full-bleed hero (один якорь, display-заголовок, одна поддержка, один primary CTA)
2) одна секция «как это работает» (не 3 одинаковые карточки — другая композиция)
3) футер с контактами

Плохо:
«Добавь стандартный блок features + testimonials + pricing как у всех SaaS».

Хорошо:
«Hero с одним якорем и сильной типографикой; вторая секция — горизонтальный сценарий из 3 шагов с разным весом текста; без карточек-в-карточках».

Стек: текущий Next.js. Сначала 5 буллетов плана, потом код.
После: кратко before→after.`,
      },
      success: [
        "На странице ≤3 основных блока + футер",
        "Hero не состоит из сетки одинаковых карточек",
        "Есть заметная иерархия заголовков",
      ],
      artifact: "Черновик премиум-лендинга",
      terms: ["композиция", "иерархия", "CTA"],
      references: [
        ref("Skill", "Frontend Design", "/ai-skills/frontend-design", "Реализация направления"),
        ref("Skill", "taste-skill", "/ai-skills/taste-skill", "Вкус и композиция"),
        uiPatternsRef,
      ],
    },
    {
      slug: "polish",
      shortTitle: "Polish",
      title: "Нормы и доводка Impeccable",
      duration: "30–50 минут",
      goal: "Пройден audit web-design-guidelines; выполнен Impeccable polish в brand mode; антипаттерны сняты.",
      recommendation: {
        title: "Сначала guidelines (audit), потом Impeccable polish",
        why: "Audit ловит a11y/контраст; Impeccable снимает craft-антипаттерны. Порядок Recipe нельзя переставлять местами с «перерисуй всё».",
        link: ref("Skill", "Impeccable", "/ai-skills/impeccable", "Финальный polish"),
      },
      explanation:
        "Плохо: «Сделай impeccable и перерисуй сайт». Хорошо: список findings → минимальные фиксы → /impeccable polish в brand, токены не трогать.",
      instructions: [
        {
          title: "Audit guidelines",
          text: "Скопируйте invoke с /ai-skills/web-design-guidelines для page.tsx.",
        },
        {
          title: "Закройте critical/high",
          text: "Только точечные патчи. Без смены направления.",
        },
        {
          title: "Impeccable polish",
          text: "Режим brand. Команда polish. DESIGN.md обязателен.",
        },
      ],
      prompt: {
        title: "Audit → polish",
        body: `Шаг A — подключи web-design-guidelines (Vercel).
Проверь src/app/page.tsx (и layout).
Выдай findings: severity · где · как исправить.
Сначала critical a11y. Код — только после списка. Токены DESIGN.md сохрани.

Шаг B — подключи Impeccable, режим brand.
/impeccable polish по лендингу.
Не меняй продуктовую логику и не подменяй палитру.

Плохо: «Улучши дизайн как хочешь».
Хорошо: «Audit → минимальные фиксы → polish в brand на токенах».

В конце: 5 пунктов «что стало менее AI-шно».`,
      },
      success: [
        "Есть список findings или явное «критичных нет»",
        "Контраст текста/кнопок приемлемый",
        "Визуально меньше «AI-шума», чем до polish",
      ],
      artifact: "Полированный шаблон + заметки audit",
      terms: ["a11y", "контраст"],
      references: [
        ref("Skill", "Web Design Guidelines", "/ai-skills/web-design-guidelines", "Quality gate"),
        ref("Skill", "Impeccable", "/ai-skills/impeccable", "Craft polish"),
        recipeRef,
      ],
    },
    {
      slug: "rf-check",
      shortTitle: "Проверка из РФ",
      title: "Чеклист «проверено из РФ» и anti-slop",
      duration: "20–40 минут",
      goal: "Заполнен CHECKLIST.md: mobile 375, anti-slop, сборка без VPN, план деплоя на РФ-хостинг.",
      recommendation: {
        title: "Деплой: Beget / Timeweb / свой VPS в РФ",
        why: "Маршрут должен работать у вайбкодера в России: сборка локально, публикация без обязательной инокарты и VPN. Vercel не запрещён как опция, но основной путь — РФ-хостинг.",
        link: rfStackRef,
      },
      explanation:
        "Доверие ProektMap: не «красиво на макете», а «собрал из РФ и проверил сам». Плохо: только desktop-скрин. Хорошо: 375px + чеклист + команда build.",
      instructions: [
        {
          title: "Соберите проект",
          text: "Убедитесь, что production-build проходит.",
          command: "npm run build",
        },
        {
          title: "Проверьте mobile",
          text: "В DevTools ширина 375px: нет горизонтального скролла, CTA читаемы.",
        },
        {
          title: "Заполните CHECKLIST.md",
          text: "Скопируйте промпт — агент создаст чеклист, вы отметите факты.",
        },
      ],
      prompt: {
        title: "CHECKLIST.md — проверено из РФ",
        body: `Создай CHECKLIST.md со статусами [ ] / [x] (пока все [ ], я отмечу сам):

## Anti-slop
- [ ] Нет Inter/Roboto/Arial/Space Grotesk в UI
- [ ] Нет фиолетового/indigo градиента «из коробки»
- [ ] Hero не из 3–4 одинаковых feature-карточек
- [ ] Один визуальный якорь на первый экран
- [ ] Характерная типографика читается за 3 секунды

## Качество
- [ ] npm run build проходит
- [ ] 375px без horizontal overflow
- [ ] Primary CTA ≥ 52px высота
- [ ] Контраст текста достаточный

## Из РФ
- [ ] Сборка и превью без VPN
- [ ] План публикации: Beget / Timeweb / VPS (указать какой)
- [ ] Нет обязательной оплаты только иностранной картой для базового деплоя

Плохо: чеклист без mobile и без РФ.
Хорошо: факты, которые можно проверить глазами и командой.`,
      },
      success: [
        "npm run build успешен",
        "CHECKLIST.md создан",
        "Вы лично отметили anti-slop и mobile пункты",
      ],
      artifact: "CHECKLIST.md + успешный build",
      terms: ["VPS", "деплой"],
      references: [rfStackRef, designSystemRef, aiSkillsRef],
    },
    {
      slug: "ship",
      shortTitle: "Финиш",
      title: "Публикуем и фиксируем результат",
      duration: "30–60 минут",
      goal: "Шаблон доступен по URL (или стабильный localhost-демо + архив). Есть before→after и ссылка на маршрут ProektMap.",
      recommendation: {
        title: "Залейте static/Node на Beget или VPS + nginx",
        why: "Финиш маршрута — наблюдаемый URL или воспроизводимый превью-пакет. Для РФ основной путь без привязки к западному PaaS.",
        link: rfStackRef,
      },
      explanation:
        "Плохо: «почти готово, завтра выложу». Хорошо: URL или чёткий пакет + скрин 375/1280 + 5 строк before→after.",
      instructions: [
        {
          title: "Задеплойте или упакуйте",
          text: "Либо выложите на хостинг, либо сохраните git tag v1-premium-template и запишите URL превью.",
        },
        {
          title: "Сделайте before→after",
          text: "В RESULT.md: 5 пунктов «было как AI-скуф / стало как editorial».",
        },
        {
          title: "Сохраните стек Skills",
          text: "В RESULT.md укажите ссылку https://proektmap.ru/ai-skills и порядок Recipe.",
        },
      ],
      prompt: {
        title: "RESULT.md финиша",
        body: `Создай RESULT.md:

# Премиум-шаблон без AI-скуфа

URL или способ превью: […]
Стек: Next.js + DESIGN.md + Premium Landing Stack
Направление: editorial

## Before → After
1) …
2) …
(минимум 5 пунктов)

## Подтверждение
- [x] Не выглядит как дефолтный AI-лендинг
- [x] Адаптив 375
- [x] Собрано с маршрутом ProektMap /resheniya/premium-landing

Плохо: «сайт готов».
Хорошо: URL + before/after + чеклист.`,
      },
      success: [
        "Есть RESULT.md с before→after",
        "Есть URL или воспроизводимый превью-пакет",
        "Вы готовы показать шаблон как «не AI-шный»",
      ],
      artifact: "Опубликованный/упакованный премиум-шаблон",
      terms: ["лендинг", "деплой"],
      references: [aiSkillsRef, uiPatternsRef, rfStackRef, vibeCoderRef],
    },
  ], { includeDocker: false })
};
