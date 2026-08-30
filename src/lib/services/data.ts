export interface MicroserviceItem {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "avito" | "media" | "ai-prompts" | "dev";
  icon: string; // Lucide icon name
  coverImage?: string;
  gradient?: string;
  badges: string[];
  status: "active" | "coming_soon";
  isPro?: boolean;
  isFeatured?: boolean;
  features: string[];
  howToUse: { step: number; title: string; desc: string }[];
  faq: { q: string; a: string }[];
  relatedRoutes?: { label: string; href: string }[];
}

export interface MicroserviceCategory {
  id: "all" | "avito" | "media" | "ai-prompts" | "dev";
  name: string;
  count?: number;
}

export const MICROSERVICE_CATEGORIES: MicroserviceCategory[] = [
  { id: "all", name: "Все сервисы" },
  { id: "avito", name: "Для Авито" },
  { id: "media", name: "Фото и Медиа" },
  { id: "ai-prompts", name: "AI & Промпты" },
  { id: "dev", name: "Разработка" },
];

export const MICROSERVICES: MicroserviceItem[] = [
  {
    slug: "avito-photo-uniquizer",
    title: "Уникализатор фото для Авито",
    shortDescription: "Пакетная очистка метаданных (EXIF), микро-трансформация пикселей, незаметный шум и наложение невидимых меток для обхода алгоритмов дубликатов Авито.",
    fullDescription: "Инженерный микросервис для продавцов и авитологов. Полностью в браузере (без отправки ваших фото на сервер) удаляет следы камеры, геолокацию, накладывает микро-сдвиг цветовых каналов, субпиксельный поворот и генерирует уникальный цифровой хеш для каждого изображения. Позволяет публиковать повторные объявления без риска склейки или блокировки фото.",
    category: "avito",
    icon: "Image",
    gradient: "linear-gradient(135deg, rgba(235, 27, 36, 0.15) 0%, rgba(0, 169, 224, 0.15) 100%)",
    badges: ["Авито", "Бесплатно", "В браузере", "Пакетно"],
    status: "active",
    isFeatured: true,
    features: [
      "100% клиентская обработка — ваши фото не уходят в сеть и не хранятся на сервере",
      "Полная зачистка метаданных: EXIF, GPS координаты, дата съёмки, модель устройства",
      "Субпиксельные микро-трансформации (микро-поворот 0.1-0.2°, изменение масштаба)",
      "Умный цветовой сдвиг и фильтрация цветовых каналов",
      "Генерация нового MD5 / SHA-256 цифрового отпечатка",
      "Пакетная обработка и выгрузка в ZIP в один клик"
    ],
    howToUse: [
      {
        step: 1,
        title: "Загрузите фотографии",
        desc: "Перетащите одно или сразу пачку фото (до 50 шт) в рабочую область."
      },
      {
        step: 2,
        title: "Выберите уровень уникализации",
        desc: "Используйте быстрый пресет (Мягкий, Оптимальный для Авито, Глубокий) или настройте параметры вручную."
      },
      {
        step: 3,
        title: "Скачайте уникальные фото",
        desc: "Нажмите «Обработать» и получите готовые файлы по отдельности или единым ZIP-архивом."
      }
    ],
    faq: [
      {
        q: "Зачем уникализировать фотографии для Авито?",
        a: "Авито анализирует загружаемые фото на дубликаты. Если алгоритм обнаруживает одинаковый цифровой отпечаток или EXIF в разных объявлениях одного аккаунта (или между аккаунтами), объявление может быть отклонено или потерять позиции в выдаче."
      },
      {
        q: "Ухудшается ли визуальное качество фото?",
        a: "Нет. Микросервис использует микроскопические изменения (шум 0.5-1%, поворот 0.15°), которые совершенно незаметны человеческому глазу, но кардинально меняют цифровой отпечаток изображения."
      },
      {
        q: "Безопасно ли загружать сюда свои фото?",
        a: "Абсолютно. Вся обработка происходит локально на вашем компьютере/телефоне через HTML5 Canvas в оперативной памяти браузера."
      }
    ],
    relatedRoutes: [
      { label: "Готовое решение: Запустить AI-магазин на Авито", href: "/resheniya/avito-business" },
      { label: "Лаборатория Авито (80+ сервисов)", href: "/avito" },
      { label: "Каталог микросервисов", href: "/services" },
      { label: "Готовые решения AI", href: "/resheniya" }
    ]
  },
  {
    slug: "prompt-token-counter",
    title: "Калькулятор токенов и стоимости LLM",
    shortDescription: "Точный подсчёт токенов (tiktoken, Claude, DeepSeek), расчёт стоимости запросов и оптимизация промптов для экономии API-бюджета.",
    fullDescription: "Быстрый анализ текста и промптов на количество токенов для разных семейств моделей (OpenAI GPT-4o, Anthropic Claude 3.5, DeepSeek V3/R1). Показывает стоимость одного запроса и 1000 запусков.",
    category: "ai-prompts",
    icon: "Calculator",
    gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
    badges: ["AI & LLM", "Бесплатно", "Токены"],
    status: "coming_soon",
    features: [
      "Поддержка токенизаторов OpenAI BPE, Claude, DeepSeek",
      "Расчёт входящих (input) и исходящих (output) токенов",
      "Сравнение стоимости в рублях и долларах",
      "Подсветка самых «тяжёлых» фрагментов промпта"
    ],
    howToUse: [
      { step: 1, title: "Вставьте промпт", desc: "Вставьте системный или пользовательский промпт в текстовое поле." },
      { step: 2, title: "Выберите модель", desc: "Укажите целевую модель для точного расчёта токенов." },
      { step: 3, title: "Получите смету", desc: "Смотрите количество токенов и рекомендации по сокращению." }
    ],
    faq: [
      { q: "Почему токенизация отличается у разных моделей?", a: "Каждая архитектура использует свой словарь токенов (BPE, SentencePiece), поэтому один и тот же русский текст может занимать разное число токенов." }
    ],
    relatedRoutes: [
      { label: "Каталог моделей", href: "/models" },
      { label: "Промпты", href: "/prompts" }
    ]
  },
  {
    slug: "svg-to-react-optimizer",
    title: "SVG в React / Tailwind оптимизатор",
    shortDescription: "Очистка SVG от мусора Figma/Illustrator, автоматическая конвертация в чистые React-компоненты с currentColor и настройками размера.",
    fullDescription: "Инструмент для фронтенд-разработчиков и вайбкодеров. Преобразует грязные SVG-исходники в лёгкие, адаптивные компоненты React / Next.js с поддержкой Tailwind CSS и тёмной темы.",
    category: "dev",
    icon: "Code2",
    gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)",
    badges: ["Dev", "React", "SVG"],
    status: "coming_soon",
    features: [
      "Удаление лишних метаданных, defs и неиспользуемых атрибутов",
      "Автоматическая замена жестких цветов на currentColor",
      "Форматирование в TSX / JSX",
      "Копирование компонента в буфер в 1 клик"
    ],
    howToUse: [
      { step: 1, title: "Вставьте SVG код", desc: "Скопируйте исходный SVG из Figma или файла." },
      { step: 2, title: "Выберите опции", desc: "Укажите нужный формат (TypeScript, Tailwind, Inline styles)." },
      { step: 3, title: "Скопируйте компонент", desc: "Используйте готовый код в проекте." }
    ],
    faq: [
      { q: "Поддерживается ли React 19 / Next.js?", a: "Да, генерируемый код на 100% совместим с современным стеком Next.js и React." }
    ],
    relatedRoutes: [
      { label: "UI-Паттерны", href: "/ui-patterns" },
      { label: "Сборка продуктов", href: "/patterns" }
    ]
  }
];

export function getMicroserviceBySlug(slug: string): MicroserviceItem | undefined {
  return MICROSERVICES.find((s) => s.slug === slug);
}

export function normalizeMediaUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/uploads/")) {
    return url.replace("/uploads/", "/api/media/");
  }
  return url;
}
