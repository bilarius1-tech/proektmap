import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const db = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL || "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public",
  }),
});

async function main() {
  console.log("🌱 Начинаем посев...");

  // 1. Admin
  console.log("  👤 Admin");
  const pw = await hash("bilariuss111111", 10);
  await db.user.upsert({
    where: { email: "bilariuss@yandex.ru" },
    update: { role: "admin", subscription: "pro" },
    create: { email: "bilariuss@yandex.ru", name: "Алексей", role: "admin", subscription: "pro", passwordHash: pw, xp: 9999, level: "grandmaster" },
  });

  // 2. Blueprint
  console.log("  📘 Blueprint");
  await db.favorite.deleteMany();
  await db.projectDecision.deleteMany();
  await db.project.deleteMany();
  await db.decision.deleteMany();
  await db.blueprintStage.deleteMany();
  await db.stage.deleteMany();
  await db.blueprint.deleteMany();

  const bp = await db.blueprint.create({
    data: { title: "Корпоративный сайт", slug: "corporate-website", description: "От покупки домена до запуска сайта. 12 этапов, 40 решений.", totalXp: 710, totalDecisions: 40 },
  });

  // 3. Stages + Decisions
  const stagesData = [
    {
      title: "Философия общения с AI", slug: "ai-philosophy", icon: "message-square",
      description: "Как правильно общаться с AI. Не промпт-инжиниринг — AI-коммуникация.",
      decisions: [
        { title: "ИИ — не поисковик", slug: "ai-not-search", xpReward: 10,
          problem: "Задаёшь вопрос как в Google. AI отвечает общими фразами.",
          why: "AI — младший партнёр, не калькулятор. Чем точнее контекст — тем точнее ответ.",
          recommended: "Давай контекст: что за проект, какой стек, что уже пробовал, куда хочешь прийти.",
          content: "Плохо: «Сделай сайт». Хорошо: «Сделай лендинг стоматологии на Next.js. 4 блока: шапка, услуги, отзывы, контакты. Синий и белый.»",
          mistakes: "Задавать вопросы как в Google. Не давать контекст.",
          promptTemplate: "Помоги с проектом {{project}} на {{stack}}.",
          context: "Ты — AI-ассистент, который помогает создавать сайты. Отвечай как опытный full-stack разработчик.", constraints: "Не используй устаревшие версии библиотек. Не предлагай jQuery.", validation: "Ответ должен содержать конкретный код, а не общие слова.", iteration: "Если ответ не подходит — уточни что именно нужно изменить." },
        { title: "ИИ любит контекст", slug: "ai-loves-context", xpReward: 10,
          problem: "AI даёт правильный но бесполезный ответ.",
          why: "Без контекста AI угадывает. С контекстом — решает.",
          recommended: "Перед вопросом опиши: 1) проект, 2) стек, 3) что пробовал, 4) куда хочешь.",
          content: "Всегда начинай с контекста. Это экономит 3-4 раунда уточнений. Пиши как коллеге: «Я делаю сайт стоматологии на Next.js. Мне нужна форма записи с выбором врача и времени. Уже пробовал react-hook-form — не могу настроить валидацию телефона.»",
          mistakes: "Думать что AI читает мысли. Пропускать контекст.",
          promptTemplate: "Контекст: {{project}}, стек {{stack}}. Задача: {{task}}." },
        { title: "ИИ — сотрудник, а не маг", slug: "ai-is-coworker", xpReward: 10,
          problem: "Ждёшь что AI сделает всё сам. А он ждёт инструкций.",
          why: "AI — джун с энциклопедическими знаниями но без контекста твоего проекта.",
          recommended: "Дай чёткое ТЗ → проверь результат → попроси исправить.",
          content: "Паттерн: Задача → Результат → Критика → Исправление. Как с живым разработчиком. Не принимай первый ответ за истину — проверяй, тестируй, проси исправить.",
          mistakes: "Принимать первый ответ за истину. Не проверять код перед запуском.",
          promptTemplate: "Проверь этот код на ошибки: {{code}}." },
      ],
    },
    {
      title: "Инструменты", slug: "tools", icon: "wrench",
      description: "Домен, хостинг, VS Code, SourceCraft, OpenRouter, Git. Базовый набор AI-инженера.",
      decisions: [
        { title: "Купить домен", slug: "buy-domain", xpReward: 15,
          problem: "Нет домена — нет сайта. Домен = адрес в интернете.",
          why: "Домен — это лицо проекта. Хороший домен запоминается и вызывает доверие.",
          recommended: "reg.ru или Beget. Зона .ru (600-900 ₽/год). Проверить историю домена перед покупкой через whois.",
          content: "1) Придумать 3-5 вариантов. 2) Проверить занятость на reg.ru. 3) Выбрать зону (.ru, .рф). 4) Купить на 1 год. 5) Не покупать домены с плохой историей (проверить через whois).",
          tradeoffs: "reg.ru (удобный интерфейс, дороже) vs Beget (дешевле в связке с хостингом).",
          mistakes: "Покупать домен с плохой историей (санкции поисковиков). Брать слишком длинный или сложный домен.",
          promptTemplate: "Помоги выбрать домен для {{project}}. Ниша: {{niche}}." },
        { title: "Выбрать хостинг", slug: "choose-hosting", xpReward: 15,
          problem: "Код есть — сайта нет. Нужен сервер в интернете.",
          why: "Хостинг = компьютер который всегда включен и доступен из интернета.",
          recommended: "Beget или TimeWeb. Тариф на год (скидка 20-30%). Сервер в РФ.",
          content: "1) Выбрать тариф (от 150 ₽/мес). 2) Оплатить на год. 3) Привязать домен. 4) Настроить SSL через ISPmanager.",
          tradeoffs: "VPS (полный контроль, сложнее) vs Shared-хостинг (проще, меньше контроля).",
          mistakes: "Брать хостинг за пределами РФ (медленно, санкции). Экономить на тарифе." },
        { title: "Установить VS Code", slug: "install-vscode", xpReward: 10,
          problem: "На чём писать код? Нужен удобный редактор.",
          why: "VS Code — бесплатный стандарт индустрии. Тысячи расширений.",
          recommended: "VS Code + расширения: Prettier, ESLint, Tailwind CSS IntelliSense, GitHub Copilot (если есть доступ).",
          content: "1) Скачать с code.visualstudio.com. 2) Установить. 3) Поставить расширения: Prettier (форматирование), ESLint (проверка кода), Tailwind CSS IntelliSense (подсказки классов).",
          tradeoffs: "VS Code (бесплатно, расширяемо) vs WebStorm (платно, мощнее из коробки).",
          mistakes: "Не ставить Prettier и ESLint. Игнорировать авто-форматирование." },
        { title: "SourceCraft и OpenRouter", slug: "sourcecraft", xpReward: 15,
          problem: "VS Code есть — а AI-помощник внутри?",
          why: "SourceCraft (Яндекс) — бесплатный AI в VS Code. OpenRouter — доступ к 100+ моделям через одно API.",
          recommended: "SourceCraft для повседневной работы. OpenRouter для доступа к Claude/GPT/DeepSeek.",
          content: "SourceCraft: установить расширение → авторизоваться через Яндекс ID. OpenRouter: создать ключ на openrouter.ai → добавить в .env → использовать через API.",
          tradeoffs: "SourceCraft (бесплатно, РФ) vs Copilot ($10/мес, западный). OpenRouter (одно API для всех моделей) vs отдельные ключи (дешевле).",
          mistakes: "Использовать только одну модель. Не сравнивать результаты разных моделей.",
          promptTemplate: "Сравни SourceCraft, Copilot и OpenRouter для {{stack}}. Что выбрать?" },
      ],
    },
    {
      title: "Дизайн-система", slug: "design-system", icon: "palette",
      description: "Токены, шрифты, цвета, 20 принципов дизайна из huashu-design.",
      decisions: [
        { title: "Создать дизайн-токены", slug: "design-tokens", xpReward: 15,
          problem: "Каждый раз выбираешь цвета и отступы заново. Нет системы.",
          why: "Токены = единый источник правды. Меняешь в одном месте — меняется везде.",
          recommended: "CSS custom properties в tokens.css. 4 уровня отступов, 2 цвета, 1 шрифт.",
          content: "Файл tokens.css: --color-primary, --color-accent, --color-bg, --color-text, --space-xs/s/m/l/xl, --radius-s/m/l, --shadow-s/l.",
          mistakes: "Не использовать переменные (хардкод цветов в каждом компоненте)." },
        { title: "20 принципов дизайна", slug: "design-philosophies", xpReward: 30,
          problem: "Открыл Figma и не знаешь с чего начать.",
          why: "20 принципов из huashu-design (22k ⭐ на GitHub). Не правила — линзы для оценки дизайна.",
          recommended: "Начни с топ-7: иерархия, воздух, консистентность, контраст, близость, выравнивание, ограничение.",
          content: "Все 20: иерархия, воздух, консистентность, контраст, близость, выравнивание, ограничение, ритм, баланс, масштаб, цвет, типографика, сетка, иконки, изображения, анимация, доступность, адаптив, производительность, эмоция.",
          mistakes: "Использовать все 20 сразу (анализ-паралич). Игнорировать «воздух» — самая частая ошибка новичков." },
        { title: "5D-оценка дизайна", slug: "design-5d-review", xpReward: 25,
          problem: "Сделал дизайн. Красиво или нет? Объективных критериев нет.",
          why: "5D-рубрикатор: эстетика, доступность, производительность, масштабируемость, консистентность.",
          recommended: "Оценка 1-5 по каждому измерению. Цель: 20+/25. Ниже 15 — переделывай.",
          content: "Чек-лист: Эстетика (цвета, шрифты, иконки), Доступность (контраст 4.5:1, alt у картинок), Производительность (нет гигантских PNG, Lighthouse > 90), Масштабируемость (добавить блок без перевёрстки), Консистентность (одинаковые отступы, одна система иконок).",
          mistakes: "Пропустить доступность (дальтоники, скринридеры). Гнаться за эстетикой в ущерб скорости." },
        { title: "AI-ревью дизайна", slug: "ai-design-review", xpReward: 20,
          problem: "Сомневаешься в дизайне. Нужен свежий взгляд.",
          why: "AI может оценить дизайн по 20 принципам + 5D за 10 секунд.",
          recommended: "Сделай скриншот → загрузи в Claude/GPT: «Оцени дизайн по 7 принципам + 5D. Дай оценку 1-5 и конкретные исправления.»",
          content: "Промпт для AI-ревью: «Ты — дизайн-ревьюер. Оцени макет по: иерархия, воздух, консистентность, контраст, близость, выравнивание, ограничение. Плюс 5D: эстетика, доступность, производительность, масштабируемость, консистентность. Оценка 1-5. Конкретные исправления.»",
          mistakes: "Верить AI на 100% в вопросах вкуса. Не показывать референсы." },
      ],
    },
    {
      title: "Вёрстка", slug: "layout", icon: "layout",
      description: "UI Kit: Header, Footer, кнопки, карточки, формы. Компоненты которые есть на каждом сайте.",
      decisions: [
        { title: "Header и навигация", slug: "header", xpReward: 20, problem: "Без шапки сайт незакончен.", why: "Header — первое что видит посетитель.", recommended: "Логотип слева, меню справа. 56px высота, position: sticky.", content: "Компонент: логотип + навигация + кнопка Войти. Мобильное меню — гамбургер." },
        { title: "Footer", slug: "footer", xpReward: 15, problem: "Без подвала сайт брошенный.", why: "Footer = доверие. Реквизиты, ссылки, копирайт.", recommended: "3-4 колонки. Ссылки на privacy/terms/offer. © 2026.", content: "Колонки: О проекте, Документы, Контакты. ИНН и реквизиты." },
        { title: "Кнопки и Card", slug: "buttons-cards", xpReward: 20, problem: "Кнопки разные на каждой странице.", why: "UI Kit = консистентность всего сайта.", recommended: "btn-primary, btn-secondary, btn-ghost. Card: padding + border.", content: "Компоненты: Button (3 варианта), Card (заголовок+текст+кнопка), Input, Badge." },
        { title: "Формы и валидация", slug: "forms", xpReward: 25, problem: "Форма без валидации = спам.", why: "Валидация на клиенте и сервере.", recommended: "react-hook-form + zod.", content: "Форма: имя, телефон, email. Валидация: телефон +7, email формат, имя > 2 символов." },
      ],
    },
    {
      title: "Next.js", slug: "nextjs", icon: "code",
      description: "Создание и настройка проекта. Страницы, роутинг, Server/Client компоненты.",
      decisions: [
        { title: "Создать проект", slug: "create-next-app", xpReward: 25, problem: "С чего начать.", why: "create-next-app — стандарт.", recommended: "npx create-next-app@latest с TypeScript + Tailwind + App Router.", content: "Структура: /app, /components, /lib, /styles. Команды: npm run dev, npm run build." },
        { title: "Страницы и роутинг", slug: "pages-routing", xpReward: 20, problem: "Как добавить страницу.", why: "App Router: папка = маршрут.", recommended: "/page.tsx для каждой страницы. layout.tsx для общих частей.", content: "app/page.tsx → /. app/about/page.tsx → /about. app/blog/[slug]/page.tsx → /blog/hello. Каждая папка = маршрут." },
        { title: "Server vs Client", slug: "server-client", xpReward: 25, problem: "Ошибки гидрации.", why: "По умолчанию Server. use client — для интерактива.", recommended: "Данные на сервере, интерактив на клиенте.", content: "Server: БД, fs, env. Client: useState, useEffect, onClick, localStorage." },
      ],
    },
    {
      title: "Домен и хостинг", slug: "deploy-hosting", icon: "rocket",
      description: "DNS, SSL, деплой на сервер, Git и откат изменений.",
      decisions: [
        { title: "DNS и A-запись", slug: "dns", xpReward: 15, problem: "Домен есть, сайта нет.", why: "DNS связывает домен с IP сервера.", recommended: "A-запись domain.ru → IP. TTL 3600.", content: "Две A-записи: @ → IP и www → IP. Ждать 1-24 часа." },
        { title: "SSL-сертификат", slug: "ssl", xpReward: 15, problem: "HTTP — небезопасно.", why: "SSL = HTTPS = доверие.", recommended: "Let's Encrypt через ISPmanager.", content: "ISPmanager → SSL → Let's Encrypt → выбрать домен → выпустить. Автообновление каждые 90 дней." },
        { title: "Запуск на сервере", slug: "deploy", xpReward: 25, problem: "Код на компе, сайта нет.", why: "PM2 + nginx = продакшен.", recommended: "git clone → npm build → pm2 start → nginx proxy.", content: "Node.js → клонировать репо → npm install → npm run build → pm2 start → настроить nginx proxy_pass." },
        { title: "Git и откат", slug: "git", xpReward: 20, problem: "Потерял код.", why: "Git = страховка.", recommended: "git init → git add → git commit → git push.", content: "Каждый день: git add -A && git commit -m ''описание'' && git push. Откат: git revert ХЭШ." },
      ],
    },
    {
      title: "SEO", slug: "seo", icon: "search",
      description: "Метатеги, sitemap, Schema.org, llms.txt для AI-поиска.",
      decisions: [
        { title: "Метатеги", slug: "meta", xpReward: 15, problem: "Сайта нет в поиске.", why: "Title и description — первое что видит поисковик.", recommended: "Title 50-70 символов, ключевик в начале. Description 150-160.", content: "Каждой странице — уникальные title/description через export const metadata в Next.js." },
        { title: "Sitemap.xml", slug: "sitemap", xpReward: 15, problem: "Поисковик не знает о страницах.", why: "Sitemap = карта сайта для роботов.", recommended: "next-sitemap или ручной sitemap.ts.", content: "app/sitemap.ts → возвращает массив URL с приоритетами. robots.txt → ссылка на sitemap." },
        { title: "Schema.org", slug: "schema", xpReward: 20, problem: "Сайт не выделяется в выдаче.", why: "Schema.org = звёзды, цены, FAQ в поиске.", recommended: "JSON-LD Organization для главной.", content: "<script type='application/ld+json'> с типом Organization или LocalBusiness." },
        { title: "llms.txt для AI", slug: "llms-txt", xpReward: 15, problem: "AI не понимает структуру сайта.", why: "llms.txt — sitemap для ChatGPT и Claude.", recommended: "Создать public/llms.txt с описанием проекта и всеми страницами.", content: "Формат: название проекта + стек + список страниц с описаниями. Помогает AI-агентам понимать сайт." },
      ],
    },
    {
      title: "Аналитика", slug: "analytics", icon: "chart",
      description: "Яндекс.Метрика, Вебмастер, оптимизация скорости загрузки.",
      decisions: [
        { title: "Яндекс.Метрика", slug: "metrika", xpReward: 15, problem: "Не знаешь сколько посетителей.", why: "Метрика = трафик, источники, конверсии.", recommended: "Создать счётчик → вставить код через next/script.", content: "next/script с strategy='afterInteractive'. Не блокирует загрузку." },
        { title: "Яндекс.Вебмастер", slug: "webmaster", xpReward: 15, problem: "Не видно ошибок индексации.", why: "Вебмастер = индексация, запросы, ошибки.", recommended: "Добавить сайт → подтвердить через DNS.", content: "Проверить: индексацию, поисковые запросы, sitemap, ошибки сканирования." },
        { title: "Оптимизация скорости", slug: "speed", xpReward: 20, problem: "Сайт медленный.", why: "Скорость = SEO + конверсия.", recommended: "WebP, lazy load, font optimization.", content: "next/image для авто-оптимизации. Lighthouse > 90." },
      ],
    },
    {
      title: "Право", slug: "legal", icon: "shield",
      description: "Политика конфиденциальности (152-ФЗ), соглашение, cookie-баннер, реквизиты.",
      decisions: [
        { title: "Политика конфиденциальности", slug: "privacy-policy", xpReward: 25, problem: "Штраф до 100 000 ₽ по 152-ФЗ.", why: "Ты собираешь данные — ты обязан объяснить зачем.", recommended: "Страница /privacy: кто собирает, какие данные, зачем, где хранятся, как удалить.", content: "Разделы: оператор (ИП ...), данные, цели, хранение (РФ), удаление (email), cookies. Не копировать чужие!" },
        { title: "Пользовательское соглашение", slug: "terms", xpReward: 20, problem: "Нет защиты контента.", why: "Правила использования сайта.", recommended: "/terms: права на контент, ограничение ответственности, право РФ.", content: "Контент принадлежит владельцу. Копирование запрещено. Споры по законам РФ." },
        { title: "Cookie-баннер", slug: "cookie", xpReward: 15, problem: "Используешь cookies без предупреждения.", why: "Закон требует согласия.", recommended: "react-cookie-consent или свой компонент.", content: "Баннер снизу: «Используем cookies» + кнопка Принять + ссылка на /privacy." },
        { title: "Реквизиты", slug: "requisites", xpReward: 15, problem: "Клиент не может проверить бизнес.", why: "Реквизиты = доверие.", recommended: "В футере: ИП ФИО, ИНН, email, телефон.", content: "Футер: © 2026 Название. ИП Иванов И.И., ИНН 123. Email, телефон." },
      ],
    },
    {
      title: "Telegram", slug: "telegram", icon: "send",
      description: "Бот для уведомлений о заявках. Мгновенная связь с клиентами.",
      decisions: [
        { title: "Создать бота", slug: "create-bot", xpReward: 15, problem: "Клиент оставил заявку — ты узнал через час.", why: "Telegram бот = мгновенные уведомления.", recommended: "@BotFather → /newbot → имя → username_bot → скопировать токен.", content: "Токен = пароль от бота. Хранить в .env. Никому не показывать." },
        { title: "Webhook для заявок", slug: "webhook", xpReward: 25, problem: "Бот есть, но не отправляет заявки.", why: "Нужен API-роут который шлёт сообщения через Telegram API.", recommended: "API-роут: форма → fetch к api.telegram.org → sendMessage.", content: "POST /api/contact → fetch к Telegram Bot API с chat_id и текстом заявки." },
        { title: "Узнать Chat ID", slug: "chat-id", xpReward: 5, problem: "Бот не знает КОМУ отправлять.", why: "@getmyid_bot → /start → число.", recommended: "", content: "Найти @getmyid_bot, нажать /start, скопировать число." },
      ],
    },
    {
      title: "Поддержка", slug: "support", icon: "heart",
      description: "Блог, обновление контента, бэкапы, мониторинг доступности.",
      decisions: [
        { title: "Вести блог", slug: "blog", xpReward: 20, problem: "Сайт мёртвый для Яндекса.", why: "Регулярные статьи = сигнал что сайт живой.", recommended: "1 статья в неделю. Темы: кейсы, ответы клиентам, инструкции.", content: "Структура: H1 с ключевиком → введение → H2/H3 → вывод + призыв. Не копировать." },
        { title: "Мониторинг доступности", slug: "monitoring", xpReward: 10, problem: "Сайт упал в 3 ночи.", why: "Мониторинг = уведомление в Telegram.", recommended: "UptimeRobot бесплатно.", content: "Создать HTTP-монитор → интервал 5 минут → уведомление в Telegram." },
      ],
    },
    {
      title: "Граф знаний", slug: "knowledge-graph", icon: "git-graph",
      description: "Как AI видит твой код. Blast-radius, экономия токенов. Методология code-review-graph.",
      decisions: [
        { title: "Что такое граф знаний", slug: "what-is-kg", xpReward: 20, problem: "AI читает ВЕСЬ проект каждый раз.", why: "Граф = карта кода. 528x экономия токенов на FastAPI.", recommended: "AST → узлы (функции) + рёбра (вызовы).", content: "AI читает не весь код, а только blast-radius изменений. 82x медианная экономия." },
        { title: "Blast-radius", slug: "blast-radius", xpReward: 25, problem: "Изменил функцию — что сломалось?", why: "Blast-radius = все кто вызывает + их тесты.", recommended: "Перед коммитом спрашивай AI: «Что затронет это изменение?»", content: "Изменил login() → все роуты → их тесты → миграции. Граф считает за миллисекунды." },
      ],
    },
  ];

  let totalXp = 0, totalDecs = 0;
  for (const s of stagesData) {
    const stage = await db.stage.create({
      data: { title: s.title, slug: s.slug, icon: s.icon, description: s.description },
    });
    await db.blueprintStage.create({
      data: { blueprintId: bp.id, stageId: stage.id, sortOrder: stagesData.indexOf(s) * 10 },
    });
    for (const d of s.decisions) {
      await db.decision.create({
        data: {
          ...d, stageId: stage.id, sortOrder: s.decisions.indexOf(d),
          timeEstimate: "15 мин", context: d.context || "", constraints: d.constraints || "",
          validation: d.validation || "", iteration: d.iteration || "",
          tradeoffs: (d as any).tradeoffs || "", mistakes: (d as any).mistakes || "",
          promptTemplate: (d as any).promptTemplate || "", promptTitle: d.title,
        },
      });
      totalXp += d.xpReward;
      totalDecs++;
    }
  }
  await db.blueprint.update({ where: { id: bp.id }, data: { totalXp, totalDecisions: totalDecs } });
  console.log(`  ✅ ${stagesData.length} этапов, ${totalDecs} решений, ${totalXp} XP`);

  // 4. Prompts
  console.log("  📚 Prompts");
  await db.prompt.deleteMany();
  const prompts = [
    { title: "Создать страницу Next.js", category: "Код", description: "Генерация страницы с серверными данными", tags: "next.js,страница", content: "Создай страницу для Next.js 16 (App Router). Маршрут: {{path}}. Данные из {{source}}. Макет: {{layout}}. TypeScript, Tailwind, tokens.css." },
    { title: "Починить баг", category: "Код", description: "Системный подход к отладке", tags: "debug,ошибка", content: "Проект {{project}}. Стек: {{stack}}. Ошибка: {{error}}. Пробовал: {{tried}}. Контекст: {{context}}. Предложи 3 гипотезы и проверку." },
    { title: "Написать API-роут", category: "Код", description: "Endpoint в Next.js", tags: "api,next.js", content: "POST {{path}}. Вход: {{input}}. Делает: {{action}}. Выход: {{output}}. Zod + обработка ошибок." },
    { title: "Рефакторинг компонента", category: "Код", description: "Улучшение кода", tags: "рефакторинг,typescript", content: "Отрефактори: {{code}}. Критерии: TypeScript strict, читаемость, производительность, <150 строк." },
    { title: "Валидация формы", category: "Код", description: "zod + react-hook-form", tags: "форма,валидация", content: "Форма {{formName}}. Поля: {{fields}}. Zod + react-hook-form. Ошибки под полями." },
    { title: "Деплой на VPS", category: "Деплой", description: "Git → продакшен", tags: "деплой,vps", content: "Деплой {{project}} на VPS (Ubuntu). Стек: {{stack}}. Node.js → клон → .env → билд → PM2 → nginx + SSL." },
    { title: "CI/CD", category: "Деплой", description: "GitHub Actions", tags: "ci/cd,github", content: "Workflow для {{project}}. Push в main → билд → деплой на {{server}} → перезапуск PM2." },
    { title: "SSL-сертификат", category: "Деплой", description: "Let's Encrypt", tags: "ssl,nginx", content: "SSL для {{domain}}. Certbot + автообновление через cron + редирект HTTP→HTTPS." },
    { title: "Дизайн-токены", category: "Дизайн", description: "CSS-переменные", tags: "дизайн,токены", content: "Создай tokens.css для {{project}}. Цвета, шрифты, отступы (4 уровня), тени, радиусы." },
    { title: "Адаптивная вёрстка", category: "Дизайн", description: "Мобильная версия", tags: "адаптив,tailwind", content: "Адаптив для: {{component}}. Десктоп/планшет/телефон. Tailwind брейкпоинты. Touch ≥44px." },
    { title: "SEO-оптимизация", category: "SEO", description: "Метатеги, структура", tags: "seo,метатеги", content: "SEO для {{page}}. Title 50-70, Description 150-160, H1 один, alt у картинок, ЧПУ." },
    { title: "Schema.org разметка", category: "SEO", description: "JSON-LD", tags: "schema.org", content: "Schema.org {{type}} для {{project}}. JSON-LD, все обязательные поля." },
    { title: "Политика конфиденциальности", category: "Право", description: "152-ФЗ", tags: "право,152-фз", content: "Политика для {{project}}. Оператор: {{company}}. Сбор: имя, телефон, email. 152-ФЗ." },
    { title: "Системный промпт агента", category: "AI", description: "Настройка AI", tags: "ai,промпт", content: "Ты — AI для {{project}}. Роль: {{role}}. Знаешь: {{context}}. НЕ делаешь: {{restrictions}}. Стиль: {{style}}." },
    { title: "Мета-промпт", category: "AI", description: "Промпт для генерации", tags: "ai,мета", content: "Напиши промпт для: {{task}}. Уточни вход/выход/ограничения. 2 варианта: краткий и подробный." },
  ];
  for (const pr of prompts) {
    const slug = pr.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-");
    await db.prompt.create({ data: { ...pr, slug } });
  }
  console.log(`  ✅ ${prompts.length} промптов`);

  // 5. Categories
  console.log("  📁 Categories");
  await db.promptCategory.deleteMany();
  const cats = [
    { name: "Код", slug: "code", icon: "code" },
    { name: "Деплой", slug: "deploy", icon: "rocket" },
    { name: "Дизайн", slug: "design", icon: "palette" },
    { name: "SEO", slug: "seo", icon: "search" },
    { name: "Право", slug: "legal", icon: "shield" },
    { name: "AI", slug: "ai", icon: "sparkles" },
  ];
  for (let i = 0; i < cats.length; i++) {
    await db.promptCategory.create({ data: { ...cats[i], sortOrder: i + 1 } });
  }
  console.log(`  ✅ ${cats.length} категорий`);

  // 6. AI Models
  console.log("  🤖 AI Models");
  await db.aIModel.deleteMany();
  const models = [
    { name: "Claude Opus 4.5", provider: "Anthropic", category: "reasoning", codeRating: 10, siteRating: 10, agentRating: 10, speedRating: 7, pricePerMillion: 15000, contextWindow: 200000, bestFor: "Сложная логика, архитектура, ревью кода", notFor: "Простые задачи, экономия бюджета", sortOrder: 1 },
    { name: "GPT-5.5", provider: "OpenAI", category: "coding", codeRating: 10, siteRating: 9, agentRating: 10, speedRating: 7, pricePerMillion: 15000, contextWindow: 256000, bestFor: "Full-stack разработка, SaaS", notFor: "Бюджетные проекты", sortOrder: 2 },
    { name: "Gemini 3 Pro", provider: "Google", category: "coding", codeRating: 8, siteRating: 8, agentRating: 8, speedRating: 10, pricePerMillion: 2500, contextWindow: 2000000, bestFor: "Скорость, большой контекст, мультимодальность", notFor: "Тонкая архитектура", sortOrder: 3 },
    { name: "DeepSeek V3", provider: "DeepSeek", category: "coding", codeRating: 8, siteRating: 7, agentRating: 7, speedRating: 9, pricePerMillion: 500, contextWindow: 128000, bestFor: "Экономия бюджета, быстрые итерации", notFor: "Сверхсложная логика", sortOrder: 4 },
    { name: "DeepSeek R1", provider: "DeepSeek", category: "reasoning", codeRating: 7, siteRating: 6, agentRating: 7, speedRating: 5, pricePerMillion: 2000, contextWindow: 128000, bestFor: "Математика, логика, цепочки рассуждений", notFor: "Скорость, простые задачи", sortOrder: 5 },
    { name: "Qwen 3", provider: "Alibaba", category: "coding", codeRating: 8, siteRating: 7, agentRating: 7, speedRating: 9, pricePerMillion: 300, contextWindow: 128000, bestFor: "Open-source, бюджетная замена GPT", notFor: "Критичные продакшен-задачи", sortOrder: 6 },
    { name: "Grok 4", provider: "xAI", category: "coding", codeRating: 8, siteRating: 7, agentRating: 7, speedRating: 9, pricePerMillion: 3000, contextWindow: 1000000, bestFor: "Быстрые ответы, большие файлы", notFor: "", sortOrder: 7 },
  ];
  for (const m of models) await db.aIModel.create({ data: m });
  console.log(`  ✅ ${models.length} моделей`);

  // 7. Variables
  console.log("  🔤 Variables");
  await db.promptVariable.deleteMany();
  const vars = [
    { name: "project", label: "Название проекта", description: "Подставьте название проекта.", example: "Сайт стоматологии ДентаЛюкс", category: "общее", sortOrder: 1 },
    { name: "stack", label: "Стек", description: "Технологии проекта.", example: "Next.js + TypeScript + Tailwind", category: "код", sortOrder: 2 },
    { name: "path", label: "URL", description: "Маршрут страницы.", example: "/catalog", category: "код", sortOrder: 3 },
    { name: "error", label: "Ошибка", description: "Текст ошибки из консоли.", example: "TypeError: ...", category: "код", sortOrder: 4 },
    { name: "code", label: "Код", description: "Фрагмент для улучшения.", example: "function App() {...}", category: "код", sortOrder: 5 },
    { name: "domain", label: "Домен", description: "Домен без https://.", example: "site.ru", category: "деплой", sortOrder: 6 },
    { name: "server", label: "IP сервера", description: "IP-адрес VPS.", example: "109.196.165.106", category: "деплой", sortOrder: 7 },
    { name: "company", label: "Компания", description: "Юридическое название.", example: "ИП Иванов И.И.", category: "право", sortOrder: 8 },
    { name: "inn", label: "ИНН", description: "ИНН предпринимателя.", example: "123456789012", category: "право", sortOrder: 9 },
    { name: "role", label: "Роль AI", description: "Кем является AI.", example: "Продавец-консультант", category: "ai", sortOrder: 10 },
    { name: "restrictions", label: "Ограничения", description: "Что AI НЕ должен делать.", example: "Не давать медсоветов", category: "ai", sortOrder: 11 },
    { name: "task", label: "Задача", description: "Что нужно сделать.", example: "Написать API для email", category: "общее", sortOrder: 12 },
  ];
  for (const v of vars) await db.promptVariable.create({ data: v });
  console.log(`  ✅ ${vars.length} переменных`);

  console.log("\n🎉 Посев завершён!");
  console.log(`   ${stagesData.length} этапов · ${totalDecs} решений · ${totalXp} XP`);
  console.log(`   ${prompts.length} промптов · ${cats.length} категорий · ${models.length} моделей · ${vars.length} переменных`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
