export interface AICategory {
  id: string;
  emoji: string;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}

export const AI_CATEGORIES: AICategory[] = [
  {
    id: "llm-assistants",
    emoji: "💬",
    label: "LLM, Чаты и Ассистенты",
    shortLabel: "LLM & Чаты",
    description: "Большие языковые модели, диалоговые ассистенты и универсальные текстовые интерфейсы для решения повседневных задач.",
    color: "#0fb880",
    bg: "rgba(15, 184, 128, 0.08)",
    border: "rgba(15, 184, 128, 0.25)",
  },
  {
    id: "agents-skills",
    emoji: "🧩",
    label: "AI-агенты и Скиллы",
    shortLabel: "Агенты & Скиллы",
    description: "Автономные AI-агенты, готовые навыки (skills), MCP-серверы и фреймворки для автоматического выполнения многошаговых задач.",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.08)",
    border: "rgba(139, 92, 246, 0.25)",
  },
  {
    id: "local-models",
    emoji: "🖥",
    label: "Локальный AI и Модели",
    shortLabel: "Локальный AI",
    description: "Открытые веса (GGUF, Ollama, LM Studio), запуск нейросетей на своем ПК без облака, приватность и оптимизация под железо.",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.25)",
  },
  {
    id: "search-research",
    emoji: "🔍",
    label: "Поиск и Исследования",
    shortLabel: "Поиск & Ресёрч",
    description: "AI-поисковики, глубокий анализ источников, академический ресёрч, проверка фактов и сбор структурированных данных.",
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.08)",
    border: "rgba(2, 132, 199, 0.25)",
  },
  {
    id: "images-graphics",
    emoji: "🎨",
    label: "Изображения и Графика",
    shortLabel: "Арт & Графика",
    description: "Генерация артов и фото, апскейлеры, расширение границ (inpaint/outpaint), UI-иллюстрации и инструменты глубокого редактирования.",
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.08)",
    border: "rgba(236, 72, 153, 0.25)",
  },
  {
    id: "video-animation",
    emoji: "🎬",
    label: "Видео и Анимация",
    shortLabel: "Видео & Аватары",
    description: "Генерация роликов по тексту, создание реалистичных AI-аватаров, автоматический монтаж, эффекты и динамичный видеоряд.",
    color: "#f43f5e",
    bg: "rgba(244, 63, 94, 0.08)",
    border: "rgba(244, 63, 94, 0.25)",
  },
  {
    id: "voice-audio",
    emoji: "🎙",
    label: "Голос и Аудио",
    shortLabel: "Голос & Музыка",
    description: "Клонирование голоса, реалистичная озвучка текста, перевод с дубляжом, транскрибация звонков и генерация музыки.",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.08)",
    border: "rgba(217, 119, 6, 0.25)",
  },
  {
    id: "docs-slides",
    emoji: "📊",
    label: "Презентации и Документы",
    shortLabel: "Слайды & Документы",
    description: "AI-генерация слайдов, умная работа с PDF-файлами, анализ таблиц, подготовка отчетов и автоматизация офисной рутины.",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.25)",
  },
  {
    id: "coding-dev",
    emoji: "💻",
    label: "Кодинг и Разработка",
    shortLabel: "Кодинг & Вайб",
    description: "AI-редакторы, инструменты вайбкодинга, генераторы кода, no-code конструкторы приложений и профильные инженерные библиотеки.",
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.08)",
    border: "rgba(99, 102, 241, 0.25)",
  },
  {
    id: "marketing-seo",
    emoji: "📈",
    label: "Маркетинг, SEO и SMM",
    shortLabel: "Маркетинг & SEO",
    description: "Генерация конвертящего контента, аналитика трендов, оптимизация сайтов под поисковики, запуск рекламы и автопостинг.",
    color: "#ea580c",
    bg: "rgba(234, 88, 12, 0.08)",
    border: "rgba(234, 88, 12, 0.25)",
  },
  {
    id: "fintech-crypto",
    emoji: "₿",
    label: "FinTech и Крипта",
    shortLabel: "FinTech & Web3",
    description: "Финансовые AI-инструменты, ончейн-аналитика, анализ рыночных данных, торговые ассистенты и Web3-решения.",
    color: "#eab308",
    bg: "rgba(234, 179, 8, 0.08)",
    border: "rgba(234, 179, 8, 0.25)",
  },
  {
    id: "learning-guides",
    emoji: "🧠",
    label: "Обучение и Гайды",
    shortLabel: "Обучение & Гайды",
    description: "Интерактивные тренажеры, обучающие платформы, разборы реальных кейсов и пошаговые инструкции по работе с AI.",
    color: "#14b8a6",
    bg: "rgba(20, 184, 166, 0.08)",
    border: "rgba(20, 184, 166, 0.25)",
  },
  {
    id: "prompts-eng",
    emoji: "💬",
    label: "Промпты и Инжиниринг",
    shortLabel: "Промпты & Базы",
    description: "Готовые базы проверенных промптов, шаблоны системных инструкций и инструменты для тестирования и оптимизации запросов.",
    color: "#84cc16",
    bg: "rgba(132, 204, 22, 0.08)",
    border: "rgba(132, 204, 22, 0.25)",
  },
  {
    id: "misc-labs",
    emoji: "📁",
    label: "Разное и Лаборатория",
    shortLabel: "Разное & Labs",
    description: "Редкие находки, экспериментальные проекты, OS-level ассистенты, необычные концепты и полезный узкоспециализированный софт.",
    color: "#64748b",
    bg: "rgba(100, 116, 139, 0.08)",
    border: "rgba(100, 116, 139, 0.25)",
  },
];

export function getAICategory(id?: string | null): AICategory {
  if (!id) return AI_CATEGORIES.find((c) => c.id === "coding-dev") || AI_CATEGORIES[0];
  const found = AI_CATEGORIES.find((c) => c.id === id);
  return found || AI_CATEGORIES.find((c) => c.id === "coding-dev") || AI_CATEGORIES[0];
}
