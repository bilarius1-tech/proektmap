/**
 * Стартовая карта колонки. Живое меню правится в /admin/menu.
 * Синк создаёт только отсутствующие строки и не затирает уже сохранённые.
 */
export const PROTECTED_MENU_IDS = [
  "header-resheniya",
  "header-station-build",
  "header-station-tools",
  "header-station-learn",
  "header-video",
  "header-blog",
  "header-community",
  "header-sitemap",
  "header-arsenal",
  "header-avito",
  "header-agent-engineering",
  "header-ai-skills",
  "header-shpargalka",
  "header-project-vault",
] as const;
export type SidebarSeed = {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  parentId: string | null;
  icon: string;
};

export const SIDEBAR_SEED: SidebarSeed[] = [
  { id: "header-resheniya", label: "Решения", href: "/resheniya", sortOrder: 0, parentId: null, icon: "Route" },
  { id: "header-station-build", label: "Собрать", href: "/ui-patterns", sortOrder: 1, parentId: null, icon: "LayoutGrid" },
  { id: "header-station-tools", label: "Инструменты", href: "/arsenal", sortOrder: 2, parentId: null, icon: "Wrench" },
  { id: "header-station-learn", label: "Научиться", href: "/agent-engineering", sortOrder: 3, parentId: null, icon: "GraduationCap" },
  { id: "header-video", label: "Видео", href: "/video", sortOrder: 4, parentId: null, icon: "Video" },
  { id: "header-blog", label: "Блог", href: "/blog", sortOrder: 5, parentId: null, icon: "Newspaper" },
  { id: "header-community", label: "Сообщество", href: "/specialists", sortOrder: 6, parentId: null, icon: "Users" },
  { id: "header-sitemap", label: "Карта", href: "/sitemap", sortOrder: 7, parentId: null, icon: "Map" },

  { id: "header-resheniya-saas", label: "SaaS-продукт", href: "/resheniya/saas-product", sortOrder: 0, parentId: "header-resheniya", icon: "AppWindow" },
  { id: "header-resheniya-telegram", label: "Telegram-бот", href: "/resheniya/telegram-bot", sortOrder: 1, parentId: "header-resheniya", icon: "Send" },
  { id: "header-resheniya-avito-business", label: "Магазин на Авито", href: "/resheniya/avito-business", sortOrder: 2, parentId: "header-resheniya", icon: "Store" },
  { id: "header-resheniya-premium", label: "Премиум-лендинг", href: "/resheniya/premium-landing", sortOrder: 3, parentId: "header-resheniya", icon: "PanelTop" },
  { id: "header-resheniya-designer", label: "Агенты для дизайнера", href: "/resheniya/designer-agent", sortOrder: 4, parentId: "header-resheniya", icon: "Palette" },
  { id: "header-resheniya-grok", label: "Grok Bot → Cursor", href: "/resheniya/grok-bot-cursor", sortOrder: 5, parentId: "header-resheniya", icon: "Bot" },
  { id: "header-vaibik", label: "Вайбик", href: "/vaibik", sortOrder: 6, parentId: "header-resheniya", icon: "Gamepad2" },

  { id: "header-community-people", label: "Люди", href: "/specialists", sortOrder: 0, parentId: "header-community", icon: "UserRound" },
  { id: "header-community-works", label: "Работы", href: "/ai-workshop", sortOrder: 1, parentId: "header-community", icon: "FolderKanban" },

  { id: "header-ui-patterns", label: "UI-паттерны", href: "/ui-patterns", sortOrder: 0, parentId: "header-station-build", icon: "LayoutTemplate" },
  { id: "header-ui-recipes", label: "Рецепты экранов", href: "/ui-patterns/recipes", sortOrder: 0, parentId: "header-ui-patterns", icon: "BookOpen" },
  { id: "header-kopilka", label: "Копилка", href: "/kopilka", sortOrder: 1, parentId: "header-station-build", icon: "Archive" },
  { id: "header-architect", label: "AI-Архитектор", href: "/architect", sortOrder: 2, parentId: "header-station-build", icon: "Compass" },
  { id: "header-project-vault", label: "Project Vault", href: "/project-vault", sortOrder: 3, parentId: "header-station-build", icon: "Box" },
  { id: "header-sandbox", label: "Песочница", href: "/sandbox", sortOrder: 4, parentId: "header-station-build", icon: "FlaskConical" },
  { id: "sandbox-l3-creative", label: "Креативная библиотека", href: "/sandbox/creative-library", sortOrder: 0, parentId: "header-sandbox", icon: "Library" },
  { id: "sandbox-l3-vibe-blocks", label: "Вайб-блоки", href: "/sandbox/vibe-blocks", sortOrder: 1, parentId: "header-sandbox", icon: "Blocks" },
  { id: "sandbox-l3-design-system", label: "Дизайн-система", href: "/sandbox/design-system", sortOrder: 2, parentId: "header-sandbox", icon: "Palette" },
  { id: "tools-l3-patterns", label: "Паттерны сборки", href: "/patterns", sortOrder: 5, parentId: "header-station-build", icon: "Blocks" },

  { id: "header-constructors", label: "Конструкторы", href: "/services", sortOrder: 0, parentId: "header-station-tools", icon: "Hammer" },
  { id: "header-ctor-voice", label: "Голосовой проводник", href: "/services/voice-guide-builder", sortOrder: 0, parentId: "header-constructors", icon: "AudioLines" },
  { id: "header-ctor-style", label: "Стиль сайта", href: "/services/site-style-builder", sortOrder: 1, parentId: "header-constructors", icon: "Paintbrush" },
  { id: "header-ctor-template", label: "Шаблон сайта", href: "/services/site-template", sortOrder: 2, parentId: "header-constructors", icon: "FileCode" },
  { id: "header-ctor-photo", label: "Фото для Авито", href: "/services/avito-photo-uniquizer", sortOrder: 3, parentId: "header-constructors", icon: "Image" },
  { id: "header-ctor-tokens", label: "Токены", href: "/services/prompt-token-counter", sortOrder: 4, parentId: "header-constructors", icon: "Calculator" },
  { id: "header-ctor-svg", label: "SVG в React", href: "/services/svg-to-react-optimizer", sortOrder: 5, parentId: "header-constructors", icon: "Shapes" },

  { id: "header-arsenal", label: "Нейро каталог", href: "/arsenal", sortOrder: 1, parentId: "header-station-tools", icon: "Boxes" },
  { id: "header-arsenal-local-ai-pc", label: "Локальный AI на ПК", href: "/arsenal/local-ai-pc", sortOrder: 0, parentId: "header-arsenal", icon: "Monitor" },
  { id: "header-arsenal-local-ai-mobile", label: "Локальный AI в кармане", href: "/arsenal/local-ai-mobile", sortOrder: 1, parentId: "header-arsenal", icon: "Smartphone" },
  { id: "header-arsenal-vibe-coder", label: "Агент-кодер", href: "/arsenal/vibe-coder", sortOrder: 2, parentId: "header-arsenal", icon: "Code" },
  { id: "header-arsenal-mcp-agents", label: "Агенты и скиллы", href: "/arsenal/mcp-agents", sortOrder: 3, parentId: "header-arsenal", icon: "Plug" },
  { id: "header-arsenal-voice-pipeline", label: "Голосовой конвейер", href: "/arsenal/voice-pipeline", sortOrder: 4, parentId: "header-arsenal", icon: "Mic" },
  { id: "header-arsenal-listing-photo", label: "Картинки для объявлений", href: "/arsenal/listing-photo", sortOrder: 5, parentId: "header-arsenal", icon: "ImagePlus" },
  { id: "header-arsenal-ethical-research", label: "Этичный ресёрч", href: "/arsenal/ethical-research", sortOrder: 6, parentId: "header-arsenal", icon: "Search" },
  { id: "header-arsenal-rf-stack", label: "РФ-набор", href: "/arsenal/rf-stack", sortOrder: 7, parentId: "header-arsenal", icon: "MapPin" },
  { id: "header-arsenal-seller-content", label: "Контент продавца", href: "/arsenal/seller-content", sortOrder: 8, parentId: "header-arsenal", icon: "Megaphone" },
  { id: "header-arsenal-short-video", label: "Короткие видео", href: "/arsenal/short-video", sortOrder: 9, parentId: "header-arsenal", icon: "Clapperboard" },
  { id: "header-arsenal-prompt-ops", label: "Промпт-операции", href: "/arsenal/prompt-ops", sortOrder: 10, parentId: "header-arsenal", icon: "MessageSquare" },
  { id: "header-arsenal-desktop-agent", label: "Агент на рабочем столе", href: "/arsenal/desktop-agent", sortOrder: 11, parentId: "header-arsenal", icon: "MonitorSmartphone" },

  { id: "header-avito", label: "Авито", href: "/avito", sortOrder: 2, parentId: "header-station-tools", icon: "Store" },
  { id: "header-shpargalka", label: "Шпаргалка", href: "/shpargalka", sortOrder: 3, parentId: "header-station-tools", icon: "ClipboardList" },
  { id: "header-shpargalka-developers", label: "Разработчик", href: "/shpargalka/developers", sortOrder: 0, parentId: "header-shpargalka", icon: "Code" },
  { id: "header-shpargalka-designers", label: "Дизайнер", href: "/shpargalka/designers", sortOrder: 1, parentId: "header-shpargalka", icon: "Palette" },
  { id: "header-shpargalka-marketers", label: "Маркетолог", href: "/shpargalka/marketers", sortOrder: 2, parentId: "header-shpargalka", icon: "Megaphone" },
  { id: "header-shpargalka-content", label: "Контент", href: "/shpargalka/content", sortOrder: 3, parentId: "header-shpargalka", icon: "PenLine" },
  { id: "header-shpargalka-excel", label: "Excel", href: "/shpargalka/excel", sortOrder: 4, parentId: "header-shpargalka", icon: "Table" },
  { id: "header-shpargalka-job", label: "Поиск работы", href: "/shpargalka/job-hunting", sortOrder: 5, parentId: "header-shpargalka", icon: "Briefcase" },
  { id: "header-shpargalka-education", label: "Образование", href: "/shpargalka/education", sortOrder: 6, parentId: "header-shpargalka", icon: "GraduationCap" },
  { id: "header-shpargalka-hr", label: "HR", href: "/shpargalka/hr", sortOrder: 7, parentId: "header-shpargalka", icon: "Users" },
  { id: "header-shpargalka-entrepreneurs", label: "Предприниматель", href: "/shpargalka/entrepreneurs", sortOrder: 8, parentId: "header-shpargalka", icon: "Rocket" },
  { id: "header-shpargalka-websites", label: "Сайты", href: "/shpargalka/websites", sortOrder: 9, parentId: "header-shpargalka", icon: "Globe" },
  { id: "header-shpargalka-lawyers", label: "Юрист", href: "/shpargalka/lawyers", sortOrder: 10, parentId: "header-shpargalka", icon: "Scale" },
  { id: "header-shpargalka-accountants", label: "Бухгалтер", href: "/shpargalka/accountants", sortOrder: 11, parentId: "header-shpargalka", icon: "Calculator" },
  { id: "header-shpargalka-journalists", label: "Журналист", href: "/shpargalka/journalists", sortOrder: 12, parentId: "header-shpargalka", icon: "Newspaper" },
  { id: "header-shpargalka-finance", label: "Финансы", href: "/shpargalka/finance", sortOrder: 13, parentId: "header-shpargalka", icon: "Landmark" },
  { id: "header-shpargalka-authors", label: "Книги", href: "/shpargalka/authors", sortOrder: 14, parentId: "header-shpargalka", icon: "Book" },
  { id: "header-shpargalka-coaches", label: "Коучи", href: "/shpargalka/coaches", sortOrder: 15, parentId: "header-shpargalka", icon: "HeartHandshake" },

  { id: "header-models", label: "Модели", href: "/models", sortOrder: 4, parentId: "header-station-tools", icon: "Cpu" },
  { id: "tools-l3-ai-tools", label: "Каталог AI-инструментов", href: "/ai-tools", sortOrder: 6, parentId: "header-station-tools", icon: "Library" },
  { id: "tools-l3-mcp", label: "MCP-серверы", href: "/mcp", sortOrder: 7, parentId: "header-station-tools", icon: "Cable" },
  { id: "tools-l3-prompts", label: "Промпты", href: "/prompts", sortOrder: 8, parentId: "header-station-tools", icon: "MessagesSquare" },
  { id: "tools-l3-skills", label: "Карта способностей", href: "/skills", sortOrder: 9, parentId: "header-station-tools", icon: "Network" },
  { id: "sandbox-l3-telegram", label: "Telegram-хаб", href: "/telegram", sortOrder: 10, parentId: "header-station-tools", icon: "MessageCircle" },
  { id: "header-russia", label: "Из России", href: "/ai-without-vpn", sortOrder: 5, parentId: "header-station-tools", icon: "Globe" },
  { id: "header-russian-ai", label: "Российский AI", href: "/russian-ai", sortOrder: 0, parentId: "header-russia", icon: "Sparkles" },
  { id: "header-russian-ai-stack", label: "Российский стек", href: "/russian-ai-stack", sortOrder: 1, parentId: "header-russia", icon: "Layers" },
  { id: "header-ai-without-vpn", label: "AI без VPN", href: "/ai-without-vpn", sortOrder: 2, parentId: "header-russia", icon: "Shield" },

  { id: "header-agent-engineering", label: "Инженерия агентов", href: "/agent-engineering", sortOrder: 0, parentId: "header-station-learn", icon: "Workflow" },
  { id: "header-agent-engineering-rules", label: "Правила разработки", href: "/agent-engineering/rules", sortOrder: 0, parentId: "header-agent-engineering", icon: "Scale" },
  { id: "header-ai-skills", label: "AI Skills", href: "/ai-skills", sortOrder: 1, parentId: "header-station-learn", icon: "Sparkles" },
  { id: "header-glossary", label: "Глоссарий", href: "/glossary", sortOrder: 2, parentId: "header-station-learn", icon: "BookOpen" },
  { id: "header-guides", label: "Гайды", href: "/kak-sozdat-telegram-bota", sortOrder: 3, parentId: "header-station-learn", icon: "BookMarked" },
  { id: "header-guide-bot", label: "Как создать Telegram-бота", href: "/kak-sozdat-telegram-bota", sortOrder: 0, parentId: "header-guides", icon: "Send" },
  { id: "header-guide-crm", label: "Как создать CRM", href: "/kak-sozdat-crm", sortOrder: 1, parentId: "header-guides", icon: "Building2" },
  { id: "header-guide-shop", label: "Как создать магазин", href: "/kak-sozdat-internet-magazin", sortOrder: 2, parentId: "header-guides", icon: "ShoppingBag" },
  { id: "sandbox-l3-vibecraft", label: "Vibe Coding", href: "/vibecraft", sortOrder: 4, parentId: "header-station-learn", icon: "Wand2" },
];
