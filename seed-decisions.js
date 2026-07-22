const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

async function seed() {
  const decisions = [
    // Phase 0
    { stage: "phase-0-intro", title: "Что такое AI-разработка", slug: "ai-intro", problem: "Как AI меняет процесс. Это не замена, а усиление.", why: "Понимание парадигмы экономит недели.", recommended: "Прочитайте и задайте первый вопрос AI.", difficulty: "easy", xp: 5 },
    { stage: "phase-0-intro", title: "Как общаться с AI", slug: "ai-comm", problem: "Правила промптов: контекст, ограничения, примеры.", why: "80% новичков сливают токены.", recommended: "Роль → Задача → Контекст → Ограничения → Формат.", difficulty: "easy", xp: 5 },
    { stage: "phase-0-tools", title: "Сравнение инструментов", slug: "tools-compare", problem: "Vibecraft, Cursor, Reasonix — что выбрать?", why: "Ошибка = потерянные недели.", recommended: "Новичкам: Vibecraft. Разработчикам: Cursor.", difficulty: "easy", xp: 10 },
    { stage: "phase-0-tools", title: "Первый запуск", slug: "tools-first", problem: "Установка, авторизация, первый проект.", why: "Первый запуск — психологический барьер.", recommended: "Скачать → открыть → написать AI.", difficulty: "easy", xp: 10 },
    { stage: "phase-0-workplace", title: "VS Code + расширения", slug: "vscode-setup", problem: "Редактор, Prettier, ESLint, GitLens.", why: "VS Code — стандарт индустрии.", recommended: "5 обязательных расширений.", difficulty: "easy", xp: 10 },
    { stage: "phase-0-workplace", title: "Node.js и терминал", slug: "nodejs-setup", problem: "5 команд закрывают 90% задач.", why: "cd, ls, npm — это база.", recommended: "Установите LTS → node -v → npm -v.", difficulty: "easy", xp: 10 },
    // Phase 1
    { stage: "phase-1-domain", title: "Выбор домена", slug: "domain-choice", problem: "Короткий, без дефисов. .ru vs .com.", why: "Домен — лицо проекта на годы.", recommended: "3 варианта → reg.ru → лучший.", difficulty: "easy", xp: 10 },
    { stage: "phase-1-domain", title: "Выбор хостинга", slug: "hosting-choice", problem: "Vercel vs Beget vs Yandex Cloud.", why: "Новичку — Vercel. Растущему — VPS.", recommended: "Старт: Vercel (бесплатно).", difficulty: "easy", xp: 10 },
    { stage: "phase-1-git", title: "Git + первый коммит", slug: "git-first", problem: "git init, add, commit. Зачем.", why: "Без Git потеряете код.", recommended: "init → add . → commit -m Start.", difficulty: "easy", xp: 10 },
    { stage: "phase-1-ssl", title: "SSL и переменные", slug: "ssl-env", problem: "HTTPS + .env для секретов.", why: "Браузеры блокируют HTTP.", recommended: "Vercel: авто-SSL. .env → .gitignore.", difficulty: "easy", xp: 10 },
    // Phase 2
    { stage: "phase-2-entities", title: "Проектирование БД", slug: "db-design", problem: "Сущности, поля, связи. User → Orders.", why: "Ошибка в БД = переписывание.", recommended: "Бумага → Prisma-схема.", difficulty: "medium", xp: 15 },
    { stage: "phase-2-entities", title: "Prisma-схема", slug: "prisma-new", problem: "model User, Product, связи.", why: "Prisma — лучший ORM для старта.", recommended: "3 модели → db push → Studio.", difficulty: "medium", xp: 15 },
    { stage: "phase-2-admin", title: "Админка ДО страниц", slug: "admin-first", problem: "Prisma + NextAuth + CRUD. Почему первой.", why: "Без админки вы — горлышко.", recommended: "Схема → Auth → CRUD → панель.", difficulty: "medium", xp: 20 },
    { stage: "phase-2-admin", title: "CRUD за 30 минут", slug: "crud-fast", problem: "Create, Read, Update, Delete.", why: "CRUD = 80% любой админки.", recommended: "API-роуты → форма → таблица.", difficulty: "medium", xp: 20 },
    { stage: "phase-2-auth", title: "Яндекс OAuth", slug: "yandex-oauth2", problem: "clientId, redirect. Почему Яндекс.", why: "Главный провайдер в РФ.", recommended: "Приложение → ключи → callback.", difficulty: "medium", xp: 15 },
    { stage: "phase-2-auth", title: "Роли и middleware", slug: "roles-auth2", problem: "user vs admin. Защита.", why: "Без ролей удалят всё.", recommended: "role в User → middleware.", difficulty: "medium", xp: 15 },
    // Phase 3
    { stage: "phase-3-design", title: "CSS-токены", slug: "css-tokens2", problem: "Цвета, отступы в переменных.", why: "Одна правка → весь сайт.", recommended: "tokens.css → отступы + цвета.", difficulty: "easy", xp: 15 },
    { stage: "phase-3-design", title: "Тёмная тема", slug: "dark-theme2", problem: "Переключение через CSS.", why: "Must-have 2026.", recommended: "data-theme=dark → переменные.", difficulty: "easy", xp: 10 },
    { stage: "phase-3-ui", title: "Библиотека компонентов", slug: "ui-lib", problem: "Button, Input, Card, Modal.", why: "Экономия недель.", recommended: "5 базовых → везде.", difficulty: "medium", xp: 20 },
    { stage: "phase-3-ui", title: "Адаптивная вёрстка", slug: "responsive2", problem: "70% с телефонов.", why: "Штраф поисковиков.", recommended: "Mobile-first CSS.", difficulty: "medium", xp: 15 },
    { stage: "phase-3-pages", title: "Next.js роутинг", slug: "routing2", problem: "App Router: layout/page/loading.", why: "Структура = скорость.", recommended: "app/ → layout → page → [slug].", difficulty: "easy", xp: 15 },
    { stage: "phase-3-pages", title: "Главная + каталог", slug: "pages-main2", problem: "3 страницы = 90% бизнеса.", why: "Главная → Каталог → Детальная.", recommended: "Сверстать по макету.", difficulty: "medium", xp: 20 },
    { stage: "phase-3-api", title: "Route Handlers", slug: "routes2", problem: "GET/POST/PATCH/DELETE + Zod.", why: "API = инструмент.", recommended: "api/items → GET + POST.", difficulty: "medium", xp: 15 },
    { stage: "phase-3-api", title: "Бизнес-логика", slug: "biz-logic", problem: "Server Actions или API.", why: "Правильно = масштабируемость.", recommended: "Actions для форм.", difficulty: "medium", xp: 20 },
    // Phase 4
    { stage: "phase-4-mcp", title: "Что такое MCP", slug: "mcp-intro2", problem: "Model Context Protocol — USB для AI.", why: "Суперсила для моделей.", recommended: "Выбрать 1-2 сервера.", difficulty: "easy", xp: 10 },
    { stage: "phase-4-mcp", title: "MCP для стека", slug: "mcp-stack", problem: "Какие нужны именно вам.", why: "Правильный = недели экономии.", recommended: "/mcp → фильтр → установка.", difficulty: "medium", xp: 15 },
    { stage: "phase-4-telegram", title: "Telegram-бот", slug: "tg-bot", problem: "BotFather → токен → webhook.", why: "Главный канал в РФ.", recommended: "BotFather → /newbot.", difficulty: "easy", xp: 15 },
    { stage: "phase-4-telegram", title: "Уведомления", slug: "notif", problem: "Заказы/ошибки в Telegram.", why: "Без уведомлений — слепота.", recommended: "Webhook → шаблон → отправка.", difficulty: "easy", xp: 10 },
    { stage: "phase-4-payments", title: "ЮKassa", slug: "yookassa2", problem: "Магазин, ключи, webhook.", why: "Платежи = бизнес.", recommended: "shopId + secretKey.", difficulty: "medium", xp: 20 },
    { stage: "phase-4-payments", title: "Подписка", slug: "subscr", problem: "Free/Pro/Business модель.", why: "Подписка = предсказуемость.", recommended: "Тарифы → проверка → /billing.", difficulty: "medium", xp: 20 },
    // Phase 5
    { stage: "phase-5-seo", title: "Метатеги и OG", slug: "meta2", problem: "Title, Description, OG-image.", why: "Без метатегов — невидимость.", recommended: "Каждая страница: title + desc.", difficulty: "easy", xp: 10 },
    { stage: "phase-5-seo", title: "Sitemap и Schema", slug: "sitemap2", problem: "sitemap.xml, robots.txt, JSON-LD.", why: "Карта для поисковиков.", recommended: "sitemap.ts → schema.org.", difficulty: "easy", xp: 10 },
    { stage: "phase-5-legal", title: "Документы", slug: "legal2", problem: "Политика, оферта, возврат.", why: "ЮKassa не подключит без них.", recommended: "Шаблон → ИНН → футер.", difficulty: "easy", xp: 15 },
    { stage: "phase-5-monitoring", title: "Яндекс.Метрика", slug: "metrika2", problem: "Счётчик, цели, вебвизор.", why: "Без метрики — слепота.", recommended: "Счётчик → layout → проверка.", difficulty: "easy", xp: 10 },
    { stage: "phase-5-monitoring", title: "Логи и алерты", slug: "logs2", problem: "Ошибки без логов = темнота.", why: "pm2 logs → Sentry → Telegram.", recommended: "Алерты на критические ошибки.", difficulty: "easy", xp: 10 },
  ];

  for (const d of decisions) {
    const stage = await p.stage.findUnique({ where: { slug: d.stage } });
    if (!stage) { console.log("Stage not found:", d.stage); continue; }
    const count = await p.decision.count({ where: { stageId: stage.id } });
    await p.decision.upsert({
      where: { slug: d.slug },
      update: { stageId: stage.id, title: d.title, problem: d.problem, why: d.why, recommended: d.recommended, difficulty: d.difficulty, xpReward: d.xp, timeEstimate: d.xp + " мин", sortOrder: count },
      create: { stageId: stage.id, slug: d.slug, title: d.title, problem: d.problem, why: d.why, recommended: d.recommended, difficulty: d.difficulty, xpReward: d.xp, timeEstimate: d.xp + " мин", sortOrder: count }
    });
  }
  console.log("Seeded", decisions.length, "decisions");
  await p.$disconnect();
}
seed();
