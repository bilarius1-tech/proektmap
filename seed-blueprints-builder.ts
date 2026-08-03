// Seed: 2 новых Blueprint'а — AI-конструктор сайтов + Конструктор сайтов (Tilda-подобный)
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

// ============================================================
// 1. AI-КОНСТРУКТОР САЙТОВ (Lovable-подобный)
// ============================================================
async function createAIBuilder() {
  let bp = await db.blueprint.findFirst({ where: { slug: "ai-website-builder" } });
  if (bp) { console.log("⏭️  AI-конструктор already exists, skipping..."); return; }

  bp = await db.blueprint.create({
    data: {
      title: "AI-конструктор сайтов",
      slug: "ai-website-builder",
      description: "Создай свой AI-конструктор сайтов как Lovable или Bolt.new. Пользователь описывает сайт словами, AI генерирует код, редактор позволяет править в реальном времени. Стек: Next.js + AI SDK + Sandpack.",
      icon: "Sparkles",
      difficulty: "hard",
      isPublished: true,
      sortOrder: 11,
      totalXp: 950,
      totalDecisions: 10,
      goal: "Ты создашь AI-конструктор сайтов: пользователь вводит описание на русском → AI генерирует React-компоненты с Tailwind → живой предпросмотр в браузере → редактор кода → деплой на Vercel одной кнопкой. Как Lovable.dev, но свой.",
      entities: JSON.stringify([
        "User — пользователи конструктора",
        "Project — проект сайта (название, описание, промпт)",
        "ProjectFile — сгенерированные файлы (tsx, css, config)",
        "ProjectVersion — версии проекта (история изменений)",
        "AIPrompt — история промптов пользователя",
        "Deployment — опубликованные проекты",
      ]),
      checklist: JSON.stringify([
        "Пользователь вводит описание сайта на русском",
        "AI генерирует рабочий React+Tailwind код",
        "Живой предпросмотр в iframe (Sandpack)",
        "Редактор кода с подсветкой (CodeMirror)",
        "Чат с AI для итеративных правок",
        "Сохранение версий (Undo/Redo)",
        "Деплой на Vercel одной кнопкой",
        "Адаптивный дизайн из коробки",
      ]),
      artifacts: JSON.stringify([
        "AI-конструктор сайтов на Vercel",
        "schema.prisma с 6 моделями",
        "AI-агент с системным промптом",
        "Sandpack-песочница с живым preview",
        "CodeMirror редактор кода",
      ]),
      targetAudience: "Стартапы, AI-энтузиасты, no-code платформы, разработчики",
      timeToComplete: "5 недель по 2-3 часа в день",
    },
  });

  // STAGE 1: Архитектура AI-конструктора
  const s1 = await db.stage.create({
    data: {
      title: "Архитектура AI-конструктора",
      slug: "ai-builder-arch",
      icon: "Brain",
      sortOrder: 1,
      description: "Проектирование архитектуры: как AI генерирует код, песочница, редактор, деплой",
      decisions: { create: [{
        title: "Проектирование AI-конструктора сайтов",
        slug: "ai-builder-architecture",
        problem: "Нужно спроектировать систему где: 1) пользователь пишет «сделай лендинг для доставки пиццы», 2) AI генерирует полный React+Tailwind код, 3) код сразу виден в браузере, 4) можно править и дополнять через чат с AI.",
        goal: "Спроектирована архитектура: UI (чат + редактор + preview), AI-слой (промпты + генерация), песочница (Sandpack), деплой (Vercel API).",
        recommended: "Next.js 14 (App Router) + Vercel AI SDK (стриминг ответов) + Sandpack (живой preview React-компонентов) + CodeMirror (редактор). AI: OpenRouter API с Claude/GPT-4o. Хранение: PostgreSQL + Vercel Blob для файлов.",
        why: "Vercel AI SDK даёт стриминг из коробки — пользователь видит как AI «пишет» код. Sandpack компилирует React в браузере — не нужен сервер для preview. CodeMirror — редактор как в VS Code.",
        xpReward: 50,
        timeEstimate: "1 час",
        sortOrder: 1,
        entities: JSON.stringify(["Project — модель сайта", "ProjectFile — файлы кода"]),
        promptTitle: "Спроектируй AI-конструктор сайтов",
        promptTemplate: 'Ты senior архитектор. Спроектируй AI-конструктор сайтов.\n\nПользовательский flow:\n1. Пользователь заходит на сайт конструктора\n2. Вводит описание: «Лендинг для доставки пиццы с меню и отзывами»\n3. AI генерирует React-компоненты с Tailwind\n4. Справа — живой preview (Sandpack)\n5. Слева — чат с AI для правок\n6. Кнопка «Опубликовать» → деплой на Vercel\n\nТехнический стек:\n- Next.js 14 App Router\n- Vercel AI SDK (useChat, streamText)\n- @codesandbox/sandpack-react (живой preview)\n- @codemirror/view (редактор кода)\n- OpenRouter API (Claude Sonnet / GPT-4o)\n- Prisma + PostgreSQL\n\nСоздай проект:\nnpx create-next-app@latest ai-builder --typescript --tailwind --app --src-dir\nnpm install ai @ai-sdk/openai @codesandbox/sandpack-react codemirror @codemirror/lang-javascript @codemirror/lang-html @codemirror/theme-one-dark',
        checks: { create: [
          { title: "Архитектурная схема нарисована (блокнот/Excalidraw)", sortOrder: 1 },
          { title: "Next.js проект создан и запущен", sortOrder: 2 },
          { title: "AI SDK и Sandpack установлены", sortOrder: 3 },
          { title: "Понимание flow: промпт → AI → код → preview → деплой", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "Архитектурная схема", description: "User flow + компоненты", sortOrder: 1 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s1.id, sortOrder: 1 } });

  // STAGE 2: AI-агент и промпт-инжиниринг
  const s2 = await db.stage.create({
    data: {
      title: "AI-агент и системный промпт",
      slug: "ai-builder-prompt",
      icon: "MessageSquare",
      sortOrder: 2,
      description: "Создание AI-агента который генерирует качественный React+Tailwind код",
      decisions: { create: [{
        title: "Системный промпт и AI-агент",
        slug: "ai-builder-agent",
        problem: "AI должен генерировать не просто код, а красивый, адаптивный, готовый к использованию сайт. Нужен системный промпт который научит AI создавать компоненты в едином стиле.",
        goal: "AI генерирует компоненты которые: 1) компилируются без ошибок, 2) выглядят профессионально, 3) используют Tailwind, 4) адаптивные, 5) следуют дизайн-системе.",
        recommended: "Системный промпт должен задавать: роль (senior React разработчик), стиль (современный минимализм), правила (только Tailwind, без внешних библиотек, мобильный-first). Добавь examples в промпт — покажи AI пример хорошего компонента.",
        why: "Качество промпта = качество генерации. Системный промпт с примерами даёт в 3 раза меньше ошибок и в 2 раза красивее результат чем «сгенерируй сайт».",
        xpReward: 60,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        entities: JSON.stringify(["AIPrompt — системный промпт", "ProjectVersion — история версий"]),
        promptTitle: "Создай системный промпт для AI-конструктора",
        promptTemplate: 'Ты AI-Prompt инженер. Создай системный промпт для AI-конструктора сайтов.\n\nТребования к генерируемому коду:\n- React 18+ с TypeScript\n- Tailwind CSS (без внешних библиотек)\n- Адаптивный дизайн (mobile-first)\n- Семантическая верстка (header, main, section, footer)\n- Доступность (aria-label, alt, role)\n- Производительность (next/image, lazy loading)\n- Компонентная архитектура (отдельные файлы)\n\nСтиль:\n- Современный минимализм\n- Белый фон, акцентный цвет — на выбор\n- Крупная типографика\n- Плавные анимации (fade-in, slide-up)\n- Закруглённые углы (8-12px)\n\nПример системного промпта:\n```\nТы — senior frontend разработчик. Твоя задача — создавать красивые, современные landing pages на React + Tailwind.\n\nПравила:\n1. Только Tailwind CSS, никаких сторонних библиотек\n2. Mobile-first: начинай с мобильной версии, добавляй md: и lg: брейкпоинты\n3. Каждый логический блок — отдельный компонент\n4. Используй семантические теги\n5. Добавляй микроанимации (hover, transition)\n6. Цветовая палитра: bg-white, text-gray-900, accent — indigo-600\n7. Типографика: заголовки — text-4xl/5xl font-bold, текст — text-lg text-gray-600\n8. Отступы: section — py-20, контент — max-w-7xl mx-auto px-4\n9. Изображения: unsplash placeholder с overlay\n10. Формы: красивые input с border, focus:ring, валидация\n\nНе используй:\n- Bootstrap, Material UI, Chakra\n- Inline styles\n- CSS modules (используй Tailwind)\n- jQuery, lodash (vanilla JS)\n```\n\nСоздай System Prompt на русском и английском.',
        checks: { create: [
          { title: "Системный промпт написан (русский + английский)", sortOrder: 1 },
          { title: "Промпт содержит правила генерации (стиль, адаптивность, компоненты)", sortOrder: 2 },
          { title: "Промпт содержит пример хорошего компонента (few-shot)", sortOrder: 3 },
          { title: "Протестирован на 3 тестовых запросах", sortOrder: 4 },
        ]},
        artifacts: { create: [
          { title: "system-prompt.md", description: "Системный промпт AI-агента", sortOrder: 1 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s2.id, sortOrder: 2 } });

  // STAGE 3: Чат-интерфейс и стриминг
  const s3 = await db.stage.create({
    data: {
      title: "Чат-интерфейс с AI",
      slug: "ai-builder-chat",
      icon: "MessageCircle",
      sortOrder: 3,
      description: "Чат где пользователь описывает сайт, AI отвечает с кодом в реальном времени",
      decisions: { create: [{
        title: "Потоковый чат с генерацией кода",
        slug: "ai-builder-chat-ui",
        problem: "Пользователь должен видеть как AI «думает» и пишет код посимвольно. Нужен чат-интерфейс как в ChatGPT: сообщения появляются потоком, код подсвечивается.",
        goal: "Чат работает: пользователь пишет запрос → AI стримит ответ с кодом → код появляется посимвольно → блоки кода подсвечены синтаксисом.",
        recommended: "Vercel AI SDK: useChat хук + maxTokens: 4096. API роут /api/chat передаёт системный промпт + историю. Для подсветки кода в чате используй react-syntax-highlighter.",
        why: "Стриминг критичен для UX — ожидание 30 секунд без фидбека убивает конверсию. Vercel AI SDK делает стриминг тривиальным.",
        xpReward: 55,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Создай чат с AI-стримингом",
        promptTemplate: 'Создай чат-интерфейс с AI через Vercel AI SDK.\n\n1. API роут app/api/chat/route.ts:\n```ts\nimport { createOpenAI } from "@ai-sdk/openai";\nimport { streamText } from "ai";\n\nconst openrouter = createOpenAI({\n  baseURL: "https://openrouter.ai/api/v1",\n  apiKey: process.env.OPENROUTER_API_KEY,\n});\n\nexport async function POST(req: Request) {\n  const { messages } = await req.json();\n  const result = streamText({\n    model: openrouter("anthropic/claude-sonnet"),\n    system: SYSTEM_PROMPT, // твой системный промпт\n    messages,\n    maxTokens: 4096,\n  });\n  return result.toDataStreamResponse();\n}\n```\n\n2. Клиентский компонент ChatPanel:\n- useChat() хук — отправка и получение\n- Область сообщений с авто-прокруткой\n- Поле ввода с кнопкой отправки\n- Индикатор загрузки (три точки)\n- Блоки кода с подсветкой (react-syntax-highlighter)\n- Кнопка «Применить код» → отправляет в Sandpack\n\n3. Обработка ошибок:\n- API key missing → показать сообщение\n- Rate limit → показать таймер\n- Пустой ответ → предложить переформулировать',
        checks: { create: [
          { title: "Сообщение отправляется — AI отвечает", sortOrder: 1 },
          { title: "Ответ приходит посимвольно (streaming)", sortOrder: 2 },
          { title: "Блоки кода подсвечены синтаксисом", sortOrder: 3 },
          { title: "Кнопка «Применить код» работает", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s3.id, sortOrder: 3 } });

  // STAGE 4: Живой Preview (Sandpack)
  const s4 = await db.stage.create({
    data: {
      title: "Живой предпросмотр (Sandpack)",
      slug: "ai-builder-preview",
      icon: "Eye",
      sortOrder: 4,
      description: "Preview скомпилированного React-кода прямо в браузере",
      decisions: { create: [{
        title: "Sandpack-песочница",
        slug: "ai-builder-sandpack",
        problem: "Сгенерированный код нужно показать пользователю как настоящий сайт — скомпилированный и работающий. Серверный рендеринг не подходит — каждый чих AI требует пересборки.",
        goal: "Код из чата → монтируется в Sandpack → пользователь видит живой сайт. Изменения в редакторе → мгновенное обновление preview (HMR).",
        recommended: "@codesandbox/sandpack-react — компилирует React в браузере через SWC. Создай Provider с файлами из ответа AI. При изменении кода в редакторе — обновляй файлы в Sandpack.",
        why: "Sandpack не требует сервера — всё в браузере. Мгновенный HMR. Поддерживает npm-зависимости. Идеально для AI-конструктора.",
        xpReward: 60,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Интегрируй Sandpack для живого preview",
        promptTemplate: 'Интегрируй @codesandbox/sandpack-react.\n\n1. Установка: npm install @codesandbox/sandpack-react\n\n2. Компонент LivePreview:\n```tsx\nimport { Sandpack, SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";\n\nexport function LivePreview({ files }: { files: Record<string, string> }) {\n  return (\n    <SandpackProvider template="react-ts" files={files}\n      customSetup={{ dependencies: { "tailwindcss": "^3.4.0", "autoprefixer": "^10.4.0", "postcss": "^8.4.0" } }}>\n      <SandpackPreview showNavigator showRefreshButton />\n    </SandpackProvider>\n  );\n}\n```\n\n3. Парсинг ответа AI:\n- Извлеки блоки кода из markdown (```tsx ... ```)\n- Создай объект files: { "/App.tsx": code, "/index.tsx": entry, "/tailwind.config.js": config }\n- Передай в Sandpack\n\n4. Добавь Tailwind в Sandpack:\n- Файл /tailwind.config.js\n- Файл /postcss.config.js\n- Импорт tailwind в /index.css\n\n5. Split-view: слева чат + код, справа preview.',
        checks: { create: [
          { title: "Sandpack рендерит React-компонент", sortOrder: 1 },
          { title: "Tailwind стили применяются", sortOrder: 2 },
          { title: "Изменение кода → мгновенное обновление preview", sortOrder: 3 },
          { title: "Split-view: редактор | preview", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s4.id, sortOrder: 4 } });

  // STAGE 5: Редактор кода
  const s5 = await db.stage.create({
    data: {
      title: "Редактор кода (CodeMirror)",
      slug: "ai-builder-editor",
      icon: "Code",
      sortOrder: 5,
      description: "Полноценный редактор кода с подсветкой и автодополнением",
      decisions: { create: [{
        title: "Редактор как в VS Code",
        slug: "ai-builder-codemirror",
        problem: "Пользователь должен иметь возможность править сгенерированный код в нормальном редакторе с подсветкой синтаксиса, номерами строк и автодополнением.",
        goal: "Редактор с подсветкой TypeScript/TSX, тёмной темой, номерами строк. Изменения в редакторе → мгновенно в Sandpack (без перезагрузки).",
        recommended: "CodeMirror 6 с расширениями: javascript, jsx, tsx языки, oneDark тема, autocompletion, linting. Свяжи onChange редактора с обновлением файлов в Sandpack.",
        why: "CodeMirror — легковесный (150 KB gzip), расширяемый, с отличной поддержкой JSX/TSX. Используется в Sandpack, CodeSandbox, StackBlitz.",
        xpReward: 50,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        promptTitle: "Добавь редактор кода",
        promptTemplate: 'Добавь CodeMirror 6 в конструктор.\n\n1. Установка:\nnpm install codemirror @codemirror/lang-javascript @codemirror/lang-html @codemirror/theme-one-dark @codemirror/autocomplete\n\n2. Компонент CodeEditor:\n```tsx\nimport { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";\nimport { EditorState } from "@codemirror/state";\nimport { javascript } from "@codemirror/lang-javascript";\nimport { oneDark } from "@codemirror/theme-one-dark";\nimport { defaultKeymap, history, historyKeymap } from "@codemirror/commands";\nimport { autocompletion } from "@codemirror/autocomplete";\nimport { useEffect, useRef } from "react";\n\nexport function CodeEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {\n  const ref = useRef<HTMLDivElement>(null);\n  const viewRef = useRef<EditorView>();\n\n  useEffect(() => {\n    if (!ref.current) return;\n    const state = EditorState.create({\n      doc: value,\n      extensions: [\n        lineNumbers(),\n        highlightActiveLine(),\n        javascript({ jsx: true, typescript: true }),\n        oneDark,\n        history(),\n        keymap.of([...defaultKeymap, ...historyKeymap]),\n        autocompletion(),\n        EditorView.updateListener.of(update => {\n          if (update.docChanged) onChange(update.state.doc.toString());\n        }),\n      ],\n    });\n    viewRef.current = new EditorView({ state, parent: ref.current });\n    return () => viewRef.current?.destroy();\n  }, []);\n\n  return <div ref={ref} style={{ height: "100%", overflow: "auto" }} />;\n}\n```\n\n3. Добавь вкладки для переключения между файлами (App.tsx, tailwind.config.js, index.css). При изменении кода — debounce 500ms → обновление Sandpack.',
        checks: { create: [
          { title: "CodeMirror рендерится с подсветкой TSX", sortOrder: 1 },
          { title: "Изменение кода → обновление Sandpack (debounce 500ms)", sortOrder: 2 },
          { title: "Вкладки для переключения файлов", sortOrder: 3 },
          { title: "Тёмная тема (oneDark)", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s5.id, sortOrder: 5 } });

  // STAGE 6: Сохранение и версионирование
  const s6 = await db.stage.create({
    data: {
      title: "Сохранение и история версий",
      slug: "ai-builder-versions",
      icon: "GitBranch",
      sortOrder: 6,
      description: "Сохранение проектов, версионирование, Undo/Redo",
      decisions: { create: [{
        title: "Версионирование проектов",
        slug: "ai-builder-versioning",
        problem: "AI может сгенерировать работающий сайт, а следующим запросом — сломать его. Нужна история версий чтобы можно было откатиться.",
        goal: "Каждое изменение кода создаёт новую версию. Пользователь может переключаться между версиями. Кнопка Undo — возврат к предыдущей.",
        recommended: "Модель ProjectVersion: id, projectId, files (JSON), prompt (что просил пользователь), createdAt. При каждом «Применить» — создавай новую версию. Храни последние 20 версий.",
        why: "История версий = пользователь не боится экспериментировать. Если AI сломал — всегда можно откатиться. Это ключевая фича любого конструктора.",
        xpReward: 45,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        entities: JSON.stringify(["ProjectVersion — версия со снепшотом кода"]),
        promptTitle: "Создай систему версионирования",
        promptTemplate: 'Создай версионирование проектов.\n\n1. Модель Prisma:\n```prisma\nmodel ProjectVersion {\n  id        String   @id @default(uuid())\n  projectId String\n  files     Json     // { "App.tsx": "...", "tailwind.config.js": "..." }\n  prompt    String   // какой запрос привёл к этой версии\n  createdAt DateTime @default(now())\n  project   Project  @relation(fields: [projectId], references: [id])\n}\n```\n\n2. API:\n- POST /api/projects/[id]/versions — создать версию\n- GET /api/projects/[id]/versions — список версий\n- POST /api/projects/[id]/restore — восстановить версию\n\n3. UI:\n- Выпадающий список версий с датой и промптом\n- Кнопка «Восстановить» для каждой версии\n- Undo/Redo кнопки в тулбаре (Ctrl+Z / Ctrl+Shift+Z)\n\n4. Авто-сохранение: каждые 30 секунд если есть изменения — сохраняем версию.',
        checks: { create: [
          { title: "Версия создаётся при изменении кода", sortOrder: 1 },
          { title: "Список версий отображается", sortOrder: 2 },
          { title: "Восстановление версии работает (код + preview)", sortOrder: 3 },
          { title: "Undo/Redo работают", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s6.id, sortOrder: 6 } });

  // STAGE 7: Деплой на Vercel
  const s7 = await db.stage.create({
    data: {
      title: "Деплой одной кнопкой",
      slug: "ai-builder-deploy",
      icon: "Rocket",
      sortOrder: 7,
      description: "Публикация сайта на Vercel одним кликом",
      decisions: { create: [{
        title: "Деплой на Vercel в один клик",
        slug: "ai-builder-vercel-deploy",
        problem: "Пользователь создал сайт в конструкторе. Теперь ему нужен публичный URL. Процесс должен быть: одна кнопка → сайт в интернете.",
        goal: "Кнопка «Опубликовать» → файлы собираются → деплой на Vercel → пользователь получает URL вида project-abc.vercel.app.",
        recommended: "Vercel REST API: создай проект через POST /v9/projects, загрузи файлы через POST /v2/now/files, создай деплой через POST /v13/deployments. Используй VERCEL_TOKEN из env.",
        why: "Vercel — бесплатный хостинг для статических сайтов. Авто-SSL, CDN, превью-ссылки. Идеально для конструктора.",
        xpReward: 55,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Настрой деплой на Vercel",
        promptTemplate: 'Настрой деплой на Vercel через API.\n\n1. Получи Vercel токен:\n- vercel.com/account/tokens → Create Token\n- Добавь VERCEL_TOKEN в .env\n\n2. API /api/deploy:\n```ts\n// 1. Создай проект (если нет)\nconst project = await fetch("https://api.vercel.com/v9/projects", {\n  method: "POST",\n  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },\n  body: JSON.stringify({ name: `proektmap-${projectId}`, framework: "nextjs" }),\n});\n\n// 2. Загрузи файлы\nfor (const [name, content] of Object.entries(files)) {\n  const upload = await fetch("https://api.vercel.com/v2/now/files", {\n    method: "POST",\n    headers: { Authorization: `Bearer ${token}` },\n    body: content,\n  });\n}\n\n// 3. Создай деплой\nconst deploy = await fetch("https://api.vercel.com/v13/deployments", {\n  method: "POST",\n  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },\n  body: JSON.stringify({\n    name: `proektmap-${projectId}`,\n    files: fileRefs,\n    projectSettings: { framework: "nextjs" },\n  }),\n});\n```\n\n3. UI:\n- Кнопка «Опубликовать» с иконкой ракеты\n- Индикатор загрузки (шаги: сборка → загрузка → деплой)\n- Готовый URL с кнопкой «Открыть сайт» и «Скопировать ссылку»\n\n4. Обновление существующего деплоя (re-deploy)',
        checks: { create: [
          { title: "Кнопка «Опубликовать» отправляет файлы", sortOrder: 1 },
          { title: "Vercel возвращает URL деплоя", sortOrder: 2 },
          { title: "Сайт открывается по URL", sortOrder: 3 },
          { title: "Re-deploy обновляет существующий сайт", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s7.id, sortOrder: 7 } });

  // STAGE 8: База данных и проекты
  const s8 = await db.stage.create({
    data: {
      title: "Управление проектами",
      slug: "ai-builder-projects",
      icon: "FolderOpen",
      sortOrder: 8,
      description: "Личный кабинет со списком проектов, Duplicate, Delete",
      decisions: { create: [{
        title: "CRUD проектов и файлов",
        slug: "ai-builder-project-crud",
        problem: "Пользователь создаёт несколько сайтов. Нужен личный кабинет где он видит все свои проекты, может открыть, дублировать, удалить.",
        goal: "Страница /projects — сетка карточек проектов. Карточка: скриншот preview, название, дата. Действия: открыть, дублировать, удалить.",
        recommended: "Prisma schema: User 1→M Project, Project 1→M ProjectFile, Project 1→M ProjectVersion. Для скриншотов — сохраняй thumbnail в Vercel Blob.",
        why: "Управление проектами = пользователь возвращается. Дашборд с историей создаёт привычку.",
        xpReward: 40,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        entities: JSON.stringify(["User", "Project", "ProjectFile", "ProjectVersion"]),
        promptTitle: "Создай управление проектами",
        promptTemplate: 'Создай систему управления проектами.\n\n1. Prisma модели (добавь в schema.prisma):\n- User: связь с проектами\n- Project: id, userId, title, description, createdAt\n- ProjectFile: id, projectId, filename, content\n- ProjectVersion: id, projectId, files (Json), prompt, createdAt\n\n2. Страницы:\n- /projects — список проектов (сетка карточек)\n- /projects/[id] — редактор (чат + preview + код)\n\n3. API:\n- GET/POST /api/projects\n- GET/PUT/DELETE /api/projects/[id]\n- POST /api/projects/[id]/duplicate\n\n4. Карточка проекта:\n- Миниатюра (скриншот preview)\n- Название и дата создания\n- Кнопки: Открыть, Дублировать, Удалить\n\n5. Создание нового проекта:\n- Кнопка «+ Новый проект»\n- Модалка: название + описание\n- Сразу переход в редактор',
        checks: { create: [
          { title: "Список проектов отображается", sortOrder: 1 },
          { title: "Создание нового проекта работает", sortOrder: 2 },
          { title: "Дублирование создаёт копию", sortOrder: 3 },
          { title: "Удаление с подтверждением", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s8.id, sortOrder: 8 } });

  // STAGE 9: Адаптивный preview и мобильная версия
  const s9 = await db.stage.create({
    data: {
      title: "Адаптивность и превью устройств",
      slug: "ai-builder-responsive",
      icon: "Smartphone",
      sortOrder: 9,
      description: "Переключение preview между десктопом, планшетом и телефоном",
      decisions: { create: [{
        title: "Preview для разных устройств",
        slug: "ai-builder-device-preview",
        problem: "Сайт должен хорошо выглядеть на всех устройствах. Пользователь хочет видеть как сайт выглядит на телефоне до публикации.",
        goal: "Переключатель в preview: Desktop (1440px) | Tablet (768px) | Mobile (375px). Sandpack отображает сайт в соответствующей ширине с рамкой устройства.",
        recommended: "Оберни SandpackPreview в div с изменяемой maxWidth. Добавь три кнопки с иконками устройств. При переключении — плавная анимация ширины.",
        why: "70% трафика — мобильные. Возможность посмотреть мобильную версию до публикации = must-have.",
        xpReward: 35,
        timeEstimate: "45 мин",
        sortOrder: 1,
        checks: { create: [
          { title: "Переключатель Desktop/Tablet/Mobile работает", sortOrder: 1 },
          { title: "Mobile (375px) — сайт выглядит адаптивно", sortOrder: 2 },
          { title: "Плавная анимация при переключении", sortOrder: 3 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s9.id, sortOrder: 9 } });

  // STAGE 10: Финальная проверка и запуск
  const s10 = await db.stage.create({
    data: {
      title: "Финальная проверка и запуск",
      slug: "ai-builder-final",
      icon: "CheckCircle",
      sortOrder: 10,
      description: "Тестирование полного цикла: от идеи до опубликованного сайта",
      decisions: { create: [{
        title: "Полное тестирование AI-конструктора",
        slug: "ai-builder-testing",
        problem: "Нужно проверить полный путь пользователя: регистрация → создание проекта → промпт → генерация → правки → деплой.",
        goal: "Все функции протестированы. AI генерирует рабочий код. Preview показывает сайт. Деплой публикует. История версий работает.",
        recommended: "Пройди полный цикл с тестовым проектом «Лендинг для кофейни». Проверь: чат, стриминг, Sandpack, редактор, версии, деплой, адаптивность, мобильную версию.",
        why: "AI-конструктор — сложный продукт. Каждый компонент зависит от других. Полный интеграционный тест обязателен.",
        xpReward: 25,
        timeEstimate: "1 час",
        sortOrder: 1,
        checks: { create: [
          { title: "Регистрация → создание проекта", sortOrder: 1 },
          { title: "Промпт → AI генерирует код (стриминг)", sortOrder: 2 },
          { title: "Preview показывает сгенерированный сайт", sortOrder: 3 },
          { title: "Редактор позволяет править код", sortOrder: 4 },
          { title: "История версий: создать → восстановить", sortOrder: 5 },
          { title: "Деплой: сайт открывается по URL", sortOrder: 6 },
          { title: "Адаптивность: mobile/tablet/desktop", sortOrder: 7 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s10.id, sortOrder: 10 } });

  console.log(`✅ AI-конструктор сайтов created with 10 stages!`);
}

// ============================================================
// 2. КОНСТРУКТОР САЙТОВ (Tilda-подобный / Nordic Builder)
// ============================================================
async function createSiteBuilder() {
  let bp = await db.blueprint.findFirst({ where: { slug: "site-builder" } });
  if (bp) { console.log("⏭️  Конструктор сайтов already exists, skipping..."); return; }

  bp = await db.blueprint.create({
    data: {
      title: "Конструктор сайтов",
      slug: "site-builder",
      description: "Создай свой конструктор сайтов как Tilda или Nordic Builder. Блочный редактор, библиотека готовых блоков, drag-and-drop, экспорт HTML, интеграция с AI для генерации контента.",
      icon: "Layout",
      difficulty: "hard",
      isPublished: true,
      sortOrder: 12,
      totalXp: 1050,
      totalDecisions: 10,
      goal: "Ты создашь конструктор сайтов с блочным редактором: библиотека из 15+ готовых блоков (hero, features, pricing, FAQ, footer), drag-and-drop перестановка, редактирование текста и фото на месте, экспорт в HTML/ZIP, AI-генерация контента через GigaChat.",
      entities: JSON.stringify([
        "User — пользователи конструктора",
        "Site — созданный сайт (название, домен, настройки)",
        "Page — страница сайта",
        "Block — блок на странице (hero, features, pricing...)",
        "BlockTemplate — шаблон блока в библиотеке",
        "SiteAsset — загруженные изображения и файлы",
        "SiteExport — экспортированные сайты",
      ]),
      checklist: JSON.stringify([
        "Библиотека из 15+ готовых блоков",
        "Drag-and-drop перестановка блоков",
        "Редактирование текста на месте (inline editing)",
        "Загрузка и замена изображений",
        "Настройка цветов, шрифтов, стилей",
        "Предпросмотр на десктопе и мобильном",
        "Экспорт в HTML/ZIP",
        "AI-генерация контента (GigaChat)",
        "Сохранение и автосохранение",
      ]),
      artifacts: JSON.stringify([
        "Конструктор сайтов на VPS",
        "Библиотека из 15+ блоков",
        "Drag-and-drop редактор",
        "Экспорт в ZIP",
        "AI-генератор контента",
      ]),
      targetAudience: "Малый бизнес, фрилансеры, веб-студии, маркетологи",
      timeToComplete: "6 недель по 2-3 часа в день",
    },
  });

  // STAGE 1: Архитектура
  const s1 = await db.stage.create({
    data: {
      title: "Архитектура конструктора",
      slug: "builder-arch",
      icon: "Layers",
      sortOrder: 1,
      description: "Проектирование архитектуры: блоки, страницы, редактор, экспорт",
      decisions: { create: [{
        title: "Проектирование конструктора сайтов",
        slug: "builder-architecture",
        problem: "Нужно спроектировать систему где пользователь собирает сайт из готовых блоков как в Tilda: выбирает блок → редактирует содержимое → перетаскивает → публикует.",
        goal: "Спроектирована архитектура: библиотека блоков (JSON-схемы), редактор (React + dnd-kit), рендеринг (React + Tailwind), экспорт (PHP/Node.js).",
        recommended: "Фронтенд: React 18 + TypeScript + Tailwind CSS + Vite. Drag-and-drop: @dnd-kit/core + @dnd-kit/sortable. Блоки: JSON-схема с полями (текст, фото, ссылки). Бэкенд: PHP (как на nordic-builder) или Next.js API. Хранение: PostgreSQL для данных, файловая система для экспорта.",
        why: "React + dnd-kit — лучший стек для блочного редактора. JSON-схемы делают блоки расширяемыми без изменения кода. Tailwind — мгновенная стилизация без CSS-файлов.",
        xpReward: 50,
        timeEstimate: "1 час",
        sortOrder: 1,
        entities: JSON.stringify(["Site", "Page", "Block", "BlockTemplate"]),
        promptTitle: "Спроектируй конструктор сайтов",
        promptTemplate: 'Ты senior fullstack разработчик. Спроектируй конструктор сайтов в стиле Tilda.\n\nАрхитектура:\n1. Библиотека блоков — каждый блок это JSON-схема:\n```json\n{\n  "id": "hero-classic",\n  "name": "Hero — Классический",\n  "category": "hero",\n  "fields": {\n    "title": { "type": "text", "default": "Заголовок" },\n    "subtitle": { "type": "text", "default": "Подзаголовок" },\n    "button": { "type": "text", "default": "Начать" },\n    "image": { "type": "image", "default": "/placeholder.jpg" }\n  },\n  "template": "blocks/hero-classic/Component.tsx"\n}\n```\n\n2. Редактор — холст где блоки собираются в страницу:\n- Слева: панель выбора блоков (по категориям)\n- Центр: холст с блоками (drag-and-drop)\n- Справа: панель настроек выбранного блока\n\n3. Рендеринг:\n- Preview: React-компоненты в реальном времени\n- Экспорт: сборка в статический HTML + CSS + JS\n\nТехнический стек:\n- React 18 + TypeScript + Vite\n- Tailwind CSS\n- @dnd-kit/core + @dnd-kit/sortable\n- PHP 8 для экспорта (как на nordic-builder.ru)\n- PostgreSQL\n\nСоздай проект:\nnpm create vite@latest site-builder -- --template react-ts',
        checks: { create: [
          { title: "Архитектура спроектирована (блоки, редактор, экспорт)", sortOrder: 1 },
          { title: "Vite проект создан и запущен", sortOrder: 2 },
          { title: "dnd-kit и Tailwind установлены", sortOrder: 3 },
          { title: "Структура папок: blocks-library/, editor/, preview/, export/", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s1.id, sortOrder: 1 } });

  // STAGE 2: Библиотека блоков
  const s2 = await db.stage.create({
    data: {
      title: "Библиотека блоков",
      slug: "builder-blocks",
      icon: "LayoutGrid",
      sortOrder: 2,
      description: "Создание 15+ готовых блоков: hero, features, pricing, FAQ, footer и другие",
      decisions: { create: [{
        title: "Создание библиотеки блоков",
        slug: "builder-block-library",
        problem: "Конструктору нужна библиотека готовых блоков — красивых, настраиваемых, в едином стиле. Как в Tilda: hero, преимущества, цены, FAQ, футер, галерея, отзывы.",
        goal: "Создано 15+ блоков в скандинавском стиле. Каждый блок: React-компонент + JSON-схема полей + preview-изображение. Все блоки адаптивные.",
        recommended: "Блоки: Hero Classic, Hero with Image, Features (3 колонки), Pricing (3 тарифа), FAQ (аккордеон), Footer (4 колонки), Gallery (сетка), Reviews (карусель), Team (сетка), Contact Form, Stats (цифры), CTA Banner, Logo Cloud, Timeline, Blog Grid. Стиль: скандинавский минимализм.",
        why: "15 блоков покрывают 90% потребностей бизнес-сайтов. Скандинавский стиль — чистый, светлый, профессиональный. JSON-схема позволяет редактировать блоки без кода.",
        xpReward: 80,
        timeEstimate: "4 часа",
        sortOrder: 1,
        promptTitle: "Создай библиотеку из 15 блоков",
        promptTemplate: 'Создай библиотеку блоков для конструктора сайтов.\n\nКатегории блоков:\n1. Hero-блоки (2 варианта):\n   - Classic: заголовок + подзаголовок + кнопка + фон\n   - With Image: текст слева, изображение справа\n\n2. Features (преимущества):\n   - 3 колонки с иконками, заголовками и описанием\n\n3. Pricing (цены):\n   - 3 тарифа: Basic, Pro, Enterprise. Карточки с ценой и списком фич.\n\n4. FAQ:\n   - Аккордеон: вопрос → раскрывается ответ\n\n5. Footer:\n   - 4 колонки: логотип, навигация, контакты, соцсети\n\n6. Gallery:\n   - Сетка изображений 3×N с лайтбоксом\n\n7. Reviews:\n   - Карусель отзывов с фото, именем и текстом\n\n8. Team:\n   - Сетка карточек сотрудников с фото и должностью\n\n9. Contact Form:\n   - Имя, email, сообщение, кнопка отправки\n\n10. Stats:\n    - 4 блока с крупными цифрами и подписями\n\n11. CTA Banner:\n    - Широкая плашка с заголовком и кнопкой\n\n12. Logo Cloud:\n    - Сетка логотипов компаний (grayscale → color на hover)\n\n13. Timeline:\n    - Вертикальная шкала с событиями\n\n14. Blog Grid:\n    - Сетка карточек статей с фото и датой\n\n15. Text + Image:\n    - Текст слева/справа, изображение напротив\n\nСтиль: скандинавский минимализм.\n- Цвета: bg-white, text-gray-900, акцент #0FB880\n- Типографика: Inter, заголовки жирные, текст тонкий\n- Отступы: щедрые (py-16/20/24)\n- Скругления: мягкие (rounded-lg/2xl)\n- Анимации: лёгкие (hover:scale-105, transition)\n\nКаждый блок:\n1. React-компонент с TypeScript\n2. JSON-схема полей (что можно редактировать)\n3. Адаптивный (mobile-first)\n4. Preview-изображение 600×400',
        checks: { create: [
          { title: "Создано 15+ блоков (все категории)", sortOrder: 1 },
          { title: "Каждый блок — React-компонент + JSON-схема", sortOrder: 2 },
          { title: "Все блоки адаптивные (mobile/desktop)", sortOrder: 3 },
          { title: "Единый скандинавский стиль", sortOrder: 4 },
          { title: "Preview-изображения для каждого блока", sortOrder: 5 },
        ]},
        artifacts: { create: [
          { title: "blocks-library/", description: "15+ React-компонентов блоков", sortOrder: 1 },
          { title: "block-schemas/", description: "JSON-схемы всех блоков", sortOrder: 2 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s2.id, sortOrder: 2 } });

  // STAGE 3: Drag-and-drop редактор
  const s3 = await db.stage.create({
    data: {
      title: "Drag-and-drop редактор",
      slug: "builder-dnd-editor",
      icon: "Move",
      sortOrder: 3,
      description: "Визуальный редактор: перетаскивание блоков, панель блоков, холст",
      decisions: { create: [{
        title: "Блочный редактор с перетаскиванием",
        slug: "builder-dnd",
        problem: "Нужен визуальный редактор где пользователь: 1) выбирает блок из библиотеки, 2) перетаскивает его на холст, 3) меняет порядок блоков перетаскиванием.",
        goal: "Трёхпанельный редактор: левая панель (библиотека блоков), центр (холст с блоками и drag-and-drop), правая панель (настройки выделенного блока).",
        recommended: "@dnd-kit/core + @dnd-kit/sortable для drag-and-drop. Левая панель: сетка карточек-блоков с preview. Холст: вертикальный список блоков с кнопками удаления/дублирования. Правая панель: форма с полями из JSON-схемы.",
        why: "dnd-kit — современная, доступная библиотека drag-and-drop для React. Трёхпанельный layout — стандарт конструкторов (Tilda, Webflow, Framer).",
        xpReward: 70,
        timeEstimate: "3 часа",
        sortOrder: 1,
        promptTitle: "Создай drag-and-drop редактор",
        promptTemplate: 'Создай блочный редактор с drag-and-drop.\n\n1. Установка:\nnpm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities\n\n2. Компонент Editor:\n```tsx\nimport { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";\nimport { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";\nimport { CSS } from "@dnd-kit/utilities";\n\nexport function Editor({ blocks, onReorder }) {\n  return (\n    <div className=\"flex h-screen\">\n      {/* Left: Block Library */}\n      <BlockLibrary onAddBlock={addBlock} />\n      \n      {/* Center: Canvas */}\n      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>\n        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>\n          {blocks.map(block => (\n            <SortableBlock key={block.id} block={block} />\n          ))}\n        </SortableContext>\n      </DndContext>\n      \n      {/* Right: Settings */}\n      <BlockSettings selectedBlock={selectedBlock} onChange={updateBlock} />\n    </div>\n  );\n}\n```\n\n3. SortableBlock:\n- Кнопки: drag handle, вверх/вниз, дублировать, удалить\n- Рендеринг React-компонента блока\n- Клик → выделение → показ настроек справа\n\n4. BlockLibrary:\n- Поиск по названию\n- Фильтр по категориям (Hero, Content, Pricing, etc.)\n- Карточка блока с preview и названием\n- Клик → добавление в конец холста\n\n5. Добавь визуальную обратную связь:\n- Drag: полупрозрачность + тень\n- Drop: плавная анимация (transition)\n- Placeholder: пустое место куда встанет блок',
        checks: { create: [
          { title: "Блоки перетаскиваются (drag-and-drop)", sortOrder: 1 },
          { title: "Добавление блока из библиотеки", sortOrder: 2 },
          { title: "Удаление и дублирование блоков", sortOrder: 3 },
          { title: "Правая панель настроек обновляется при выделении", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s3.id, sortOrder: 3 } });

  // STAGE 4: Inline-редактирование
  const s4 = await db.stage.create({
    data: {
      title: "Редактирование на месте",
      slug: "builder-inline-edit",
      icon: "Edit3",
      sortOrder: 4,
      description: "Редактирование текста и изображений прямо на холсте (contenteditable)",
      decisions: { create: [{
        title: "Inline editing текста и фото",
        slug: "builder-inline-editing",
        problem: "Пользователь хочет кликнуть на текст и сразу редактировать — как в Tilda. Не нужно открывать боковую панель для каждого изменения.",
        goal: "Клик на текст → появляется курсор, можно редактировать. Enter — сохранить. Клик на фото → открывается загрузчик. Изменения сразу видны.",
        recommended: "contentEditable для текстовых полей. При блюре — сохраняем в JSON-схему блока. Для фото: скрытый input[type=file] + превью. Все изменения автосохраняются через debounce 2 сек.",
        why: "Inline editing — ключевое преимущество перед кодом. Пользователь видит результат мгновенно. Конверсия в использование конструктора выше в 3 раза.",
        xpReward: 50,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        promptTitle: "Добавь inline-редактирование",
        promptTemplate: 'Добавь WYSIWYG-редактирование текста и замену изображений.\n\n1. InlineTextEditor:\n- Оберни текстовые поля в contentEditable div\n- При фокусе: покажи рамку\n- При блюре: сохрани значение в блок\n- Поддержка базового форматирования: жирный (Ctrl+B), курсив (Ctrl+I)\n\n2. InlineImageEditor:\n- Клик на изображение → overlay с кнопками «Заменить» и «Удалить»\n- Загрузка: input type=file или drag-and-drop\n- Превью сразу после выбора (FileReader)\n- Сжатие на клиенте (canvas resize до 1920px)\n\n3. Автосохранение:\n- Debounce 2 секунды после последнего изменения\n- Индикатор «Сохранено» / «Сохраняю...»\n- Сохранение в IndexedDB (localStorage для маленьких данных)\n\n4. Горячие клавиши в редакторе:\n- Delete — удалить выделенный блок\n- Ctrl+D — дублировать блок\n- Ctrl+Z / Ctrl+Shift+Z — undo/redo\n- Escape — снять выделение',
        checks: { create: [
          { title: "Текст редактируется по клику (contentEditable)", sortOrder: 1 },
          { title: "Изображение заменяется по клику", sortOrder: 2 },
          { title: "Автосохранение работает (debounce 2 сек)", sortOrder: 3 },
          { title: "Горячие клавиши работают", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s4.id, sortOrder: 4 } });

  // STAGE 5: Система стилей и тем
  const s5 = await db.stage.create({
    data: {
      title: "Стилизация и темы",
      slug: "builder-styles",
      icon: "Palette",
      sortOrder: 5,
      description: "Глобальные настройки: цвета, шрифты, отступы, радиусы скруглений",
      decisions: { create: [{
        title: "Глобальные настройки стилей",
        slug: "builder-global-styles",
        problem: "Пользователь хочет изменить цвета и шрифты всего сайта разом. Как в Tilda: Site Settings → Colors / Fonts. Не редактировать каждый блок отдельно.",
        goal: "Панель глобальных стилей: primary color, secondary color, font family (Google Fonts), border radius, button style. Изменение → мгновенно на всех блоках.",
        recommended: "CSS-переменные (Custom Properties) для глобальных стилей. При изменении — обновляем :root переменные через JS. Google Fonts API для загрузки шрифтов.",
        why: "Глобальные стили — то что делает конструктор профессиональным. Пользователь не думает о CSS — просто выбирает из пресетов.",
        xpReward: 40,
        timeEstimate: "1 час",
        sortOrder: 1,
        checks: { create: [
          { title: "Изменение primary color → обновляются все блоки", sortOrder: 1 },
          { title: "Выбор Google Fonts — применяется к заголовкам и тексту", sortOrder: 2 },
          { title: "Пресеты стилей (3-5 готовых тем)", sortOrder: 3 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s5.id, sortOrder: 5 } });

  // STAGE 6: Адаптивный предпросмотр
  const s6 = await db.stage.create({
    data: {
      title: "Предпросмотр на устройствах",
      slug: "builder-preview",
      icon: "Monitor",
      sortOrder: 6,
      description: "Переключение между десктопом и мобильным, проверка адаптивности",
      decisions: { create: [{
        title: "Preview Desktop / Tablet / Mobile",
        slug: "builder-device-preview",
        problem: "Сайт должен выглядеть хорошо на телефоне. Нужен предпросмотр в разных разрешениях чтобы проверить адаптивность.",
        goal: "Переключатель: Desktop (1440px) | Tablet (768px) | Mobile (375px). Динамическое изменение ширины холста. Фон с изображением устройства.",
        recommended: "Оберни холст в контейнер с динамической шириной. Добавь три кнопки-переключателя. При выборе Mobile — покажи рамку телефона.",
        why: "Адаптивный preview — must-have для конструктора. 70% пользователей будут смотреть мобильную версию.",
        xpReward: 35,
        timeEstimate: "45 мин",
        sortOrder: 1,
        checks: { create: [
          { title: "Переключатель Desktop → Tablet → Mobile", sortOrder: 1 },
          { title: "Mobile 375px — контент адаптируется", sortOrder: 2 },
          { title: "Рамка устройства для mobile/tablet", sortOrder: 3 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s6.id, sortOrder: 6 } });

  // STAGE 7: Экспорт в HTML/ZIP
  const s7 = await db.stage.create({
    data: {
      title: "Экспорт сайта",
      slug: "builder-export",
      icon: "Download",
      sortOrder: 7,
      description: "Экспорт готового сайта в HTML+CSS+JS, скачивание ZIP-архивом",
      decisions: { create: [{
        title: "Экспорт в HTML и ZIP",
        slug: "builder-html-export",
        problem: "Пользователь создал сайт. Теперь ему нужны исходные файлы чтобы загрузить на свой хостинг. Нужен экспорт в HTML + CSS + изображения.",
        goal: "Кнопка «Скачать сайт» → сервер собирает HTML из блоков → пакует в ZIP → отдаёт на скачивание. В архиве: index.html, style.css, папка images/.",
        recommended: "Серверный рендеринг блоков в HTML (PHP или Node.js). Сборка CSS из Tailwind (через PostCSS). Упаковка в ZIP через archiver (Node.js). Кнопка с индикатором прогресса.",
        why: "Экспорт = пользователь не привязан к платформе. Может уйти в любой момент — это создаёт доверие.",
        xpReward: 55,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Создай экспорт в ZIP",
        promptTemplate: 'Создай систему экспорта сайта.\n\n1. Серверный API /api/export:\n- Получает pageId\n- Для каждого блока рендерит HTML (server-side)\n- Собирает все стили в один CSS файл\n- Копирует изображения из /uploads/\n- Упаковывает в ZIP (npm install archiver)\n- Возвращает ZIP файл\n\n2. CSS сборка:\n- Сканируй использованные Tailwind классы\n- Генерируй минифицированный CSS (PurgeCSS)\n- Добавь кастомные стили из глобальных настроек\n\n3. HTML сборка:\n- Для каждого блока: рендери React-компонент в строку\n- renderToString из react-dom/server\n- Вставь в шаблон с <head> мета-тегами\n\n4. UI:\n- Кнопка «Скачать сайт» с иконкой загрузки\n- Модалка: прогресс-бар (HTML → CSS → Изображения → ZIP)\n- Кнопка «Скачать ZIP» после завершения',
        checks: { create: [
          { title: "Кнопка «Скачать» запускает экспорт", sortOrder: 1 },
          { title: "ZIP-архив содержит index.html и style.css", sortOrder: 2 },
          { title: "Сайт открывается локально из архива", sortOrder: 3 },
          { title: "Изображения сохранены в папке images/", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s7.id, sortOrder: 7 } });

  // STAGE 8: AI-генерация контента
  const s8 = await db.stage.create({
    data: {
      title: "AI-генерация контента",
      slug: "builder-ai-content",
      icon: "Wand",
      sortOrder: 8,
      description: "AI заполняет блоки текстом и подбирает изображения",
      decisions: { create: [{
        title: "AI-генератор контента для блоков",
        slug: "builder-ai-generator",
        problem: "Пустые блоки с Lorem Ipsum выглядят плохо. Нужен AI который заполнит сайт релевантным контентом: заголовки, описания, тексты преимуществ.",
        goal: "Кнопка «✨ Сгенерировать контент» → AI (GigaChat) получает тему сайта → генерирует текст для всех блоков → вставляет в поля.",
        recommended: "GigaChat API (российский, работает без VPN). Передавай тему сайта + контекст блока. Генерируй по одному блоку за раз чтобы не превысить лимит токенов.",
        why: "AI-генерация контента — killer feature. Пользователь получает готовый сайт за 5 минут а не за час.",
        xpReward: 55,
        timeEstimate: "2 часа",
        sortOrder: 1,
        promptTitle: "Интегрируй AI для генерации контента",
        promptTemplate: 'Интегрируй GigaChat для генерации контента.\n\n1. Получи доступ:\n- developers.sber.ru → GigaChat API → получи client_id и client_secret\n- Добавь GIGACHAT_CLIENT_ID и GIGACHAT_SECRET в .env\n\n2. API /api/ai/generate-content:\n- Принимает: { topic: "кофейня", blockType: "hero" }\n- Формирует промпт: «Создай заголовок и подзаголовок для hero-блока сайта кофейни. Заголовок — 3-5 слов, подзаголовок — 10-15 слов.»\n- Отправляет в GigaChat API\n- Возвращает заполненные поля\n\n3. UI:\n- Кнопка «✨ AI-контент» в тулбаре\n- Модалка: «О чём сайт?» → поле ввода темы\n- Кнопка «Сгенерировать всё»\n- Для каждого блока: показывать прогресс (3/15 блоков заполнено)\n\n4. Дополнительно:\n- Генерация FAQ (вопрос-ответ)\n- Генерация отзывов (имя + текст)\n- Генерация описаний услуг\n- Подбор цветовой схемы под тематику',
        checks: { create: [
          { title: "GigaChat API подключён", sortOrder: 1 },
          { title: "Кнопка «AI-контент» генерирует текст", sortOrder: 2 },
          { title: "Текст релевантный теме сайта", sortOrder: 3 },
          { title: "Прогресс-бар генерации", sortOrder: 4 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s8.id, sortOrder: 8 } });

  // STAGE 9: Сохранение и публикация
  const s9 = await db.stage.create({
    data: {
      title: "Сохранение и автосохранение",
      slug: "builder-autosave",
      icon: "Save",
      sortOrder: 9,
      description: "Автосохранение в базу, история изменений, восстановление",
      decisions: { create: [{
        title: "Автосохранение и восстановление",
        slug: "builder-save-system",
        problem: "Пользователь не должен терять работу. Нужно автосохранение каждые 30 секунд и возможность восстановить предыдущую версию.",
        goal: "Автосохранение в PostgreSQL (debounce 2 сек). История из 10 последних сохранений. Кнопка «Восстановить» для каждой версии.",
        recommended: "Сохраняй JSON страницы (список блоков с полями) в PostgreSQL. Используй IndexedDB для локального кеша (оффлайн-режим). При восстановлении связи — синхронизация.",
        why: "Автосохранение = пользователь не боится закрыть вкладку. История = можно экспериментировать без страха.",
        xpReward: 40,
        timeEstimate: "1.5 часа",
        sortOrder: 1,
        checks: { create: [
          { title: "Автосохранение каждые 30 сек", sortOrder: 1 },
          { title: "История версий отображается", sortOrder: 2 },
          { title: "Восстановление из истории работает", sortOrder: 3 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s9.id, sortOrder: 9 } });

  // STAGE 10: Финальная проверка
  const s10 = await db.stage.create({
    data: {
      title: "Финальная проверка и запуск",
      slug: "builder-final",
      icon: "CheckCircle",
      sortOrder: 10,
      description: "Тестирование полного цикла создания и экспорта сайта",
      decisions: { create: [{
        title: "Полное тестирование конструктора",
        slug: "builder-final-test",
        problem: "Перед запуском нужно проверить: создание сайта с нуля, редактирование блоков, AI-генерацию, экспорт, адаптивность.",
        goal: "Полный цикл протестирован: новый сайт → 10 блоков → inline-редактирование → AI-контент → preview → экспорт ZIP. ZIP открывается локально, сайт работает.",
        recommended: "Пройди путь создания сайта для «Студии дизайна». Добавь все 15 блоков, заполни через AI, проверь на мобильном, экспортируй и открой локально.",
        why: "Конструктор — сложная система. Каждый этап зависит от предыдущих. Интеграционное тестирование обязательно.",
        xpReward: 25,
        timeEstimate: "1 час",
        sortOrder: 1,
        checks: { create: [
          { title: "Создание сайта с 0 до 15 блоков", sortOrder: 1 },
          { title: "Inline-редактирование: текст, фото", sortOrder: 2 },
          { title: "AI-генерация контента для всех блоков", sortOrder: 3 },
          { title: "Preview: desktop + mobile", sortOrder: 4 },
          { title: "Экспорт ZIP → открывается локально", sortOrder: 5 },
          { title: "Автосохранение и восстановление", sortOrder: 6 },
        ]},
      }]},
    },
  });
  await db.blueprintStage.create({ data: { blueprintId: bp.id, stageId: s10.id, sortOrder: 10 } });

  console.log(`✅ Конструктор сайтов created with 10 stages!`);
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) { console.log("❌ Admin not found"); return; }

  console.log("🚀 Creating 2 detailed Blueprints...\n");

  await createAIBuilder();
  await createSiteBuilder();

  console.log("\n🎉 Both Blueprints created!");
}

main().catch(console.error).finally(() => db.$disconnect());
