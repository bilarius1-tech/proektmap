const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

async function seed() {
  const updates = {
    "ai-intro": { timeEstimate: "10 мин", content: "Я начинаю изучать AI-разработку. Объясни мне простыми словами, что такое AI-инжиниринг и как AI помогает создавать сайты и приложения. Я новичок, у меня Windows 11." },
    "ai-comm": { timeEstimate: "15 мин", content: "Ты — AI-ассистент. Твоя роль: помогать новичку создавать веб-приложения. Отвечай на русском, объясняй термины, давай пошаговые инструкции. Не используй жаргон без пояснений." },
    "tools-compare": { timeEstimate: "20 мин", content: "Я создаю веб-приложение. Какой AI-инструмент выбрать: Vibecraft (no-code), Cursor (AI-IDE), Reasonix (терминал)? Я в России, новичок, бюджет ограничен. Нужен русский язык.", impact: "Инструменты,Скорость,Бюджет" },
    "tools-first": { timeEstimate: "15 мин", content: "Я установил Cursor (или Vibecraft). Что мне сделать в первую очередь? Как открыть проект? Как задать первый вопрос AI? Дай пошаговую инструкцию для новичка." },
    "vscode-setup": { timeEstimate: "20 мин", content: "Я устанавливаю VS Code для веб-разработки. Какие расширения обязательны? Prettier, ESLint, GitLens — зачем каждое? Как настроить автоформатирование при сохранении?" },
    "nodejs-setup": { timeEstimate: "15 мин", content: "Я установил Node.js. Объясни что такое npm, как установить пакет, как запустить проект командой npm run dev. Я новичок, терминалом почти не пользовался." },
    "domain-choice": { timeEstimate: "15 мин", content: "Мне нужен домен для проекта. Какой выбрать: .ru или .com? Что лучше для российского бизнеса? Подбери 5 вариантов доменов. Проверь занятость на reg.ru.", impact: "Бюджет,SEO,Бренд" },
    "hosting-choice": { timeEstimate: "20 мин", content: "Мне нужен хостинг для Next.js приложения. Сравни Vercel, Beget и Yandex Cloud. Я в России, бюджет минимальный. Что выбрать для старта? Почему?", impact: "Бюджет,Деплой,Скорость" },
    "git-first": { timeEstimate: "15 мин", content: "Я создал проект и хочу сохранить его в Git. Объясни: git init, git add, git commit. Что писать в первом коммите? Дай точные команды для терминала." },
    "ssl-env": { timeEstimate: "15 мин", content: "Объясни что такое HTTPS и SSL-сертификат. Как получить бесплатный сертификат? Что такое .env и почему его нельзя пушить в GitHub? Дай пример .gitignore для Next.js." },
    "db-design": { timeEstimate: "30 мин", content: "Я проектирую базу данных. Помоги спроектировать сущности и связи между ними. Какие поля нужны каждой сущности? Нарисуй схему связей.", impact: "Архитектура,База данных,Масштабируемость" },
    "prisma-new": { timeEstimate: "30 мин", content: "Создай Prisma-схему для моего проекта. Нужны связи, индексы, дефолтные значения. Используй PostgreSQL. Добавь createdAt и updatedAt ко всем моделям." },
    "admin-first": { timeEstimate: "45 мин", content: "Я создаю админ-панель на Next.js + Prisma. Мне нужен CRUD для основной сущности. Создай: модель Prisma, API-роуты (GET/POST/PATCH/DELETE), страницу со списком и формой. Используй NextAuth для защиты.", impact: "Архитектура,Авторизация,CMS" },
    "crud-fast": { timeEstimate: "30 мин", content: "Создай шаблон CRUD для Next.js 16 App Router. Мне нужно: server action для create/update/delete, форма с валидацией (react-hook-form + zod), таблица со списком. Без лишних библиотек." },
    "yandex-oauth2": { timeEstimate: "30 мин", content: "Настрой вход через Яндекс на Next.js с NextAuth v4. Мне нужны: clientId, clientSecret, callback URL. Покажи как добавить кнопку «Войти через Яндекс» и обработать callback.", impact: "Авторизация,Безопасность" },
    "roles-auth2": { timeEstimate: "20 мин", content: "Добавь роли пользователей в Next.js проект. Две роли: user и admin. Админ видит админку, user — нет. Напиши middleware для защиты /admin маршрутов. Используй сессию NextAuth." },
    "css-tokens2": { timeEstimate: "20 мин", content: "Создай систему дизайн-токенов. Нужны: 2 акцентных цвета, 4 отступа (4/8/16/24px), шрифтовая пара (заголовок + текст). Всё в CSS-переменных в :root. Без Tailwind." },
    "dark-theme2": { timeEstimate: "15 мин", content: "Добавь тёмную тему в проект. Переключение через data-theme=dark на body. Все токены должны переопределяться. Добавь кнопку переключения темы в header." },
    "ui-lib": { timeEstimate: "45 мин", content: "Создай библиотеку UI-компонентов: Button (primary/secondary), Input (с лейблом и ошибкой), Card (с заголовком и тенью), Modal (с бэкдропом). Все на CSS-токенах, адаптивные, без библиотек." },
    "responsive2": { timeEstimate: "30 мин", content: "Сделай адаптивную вёрстку: страница должна хорошо выглядеть на телефоне (320px), планшете (768px) и десктопе (1200px). Используй CSS Grid и media queries. Mobile-first подход." },
    "routing2": { timeEstimate: "20 мин", content: "Создай структуру маршрутов Next.js App Router: / (главная), /items (каталог), /items/[slug] (детальная), /dashboard (личный кабинет). Добавь layout.tsx с шапкой и футером." },
    "pages-main2": { timeEstimate: "45 мин", content: "Сверстай три страницы: главная (hero + преимущества), каталог (сетка карточек), детальная (полное описание). Используй CSS Grid, без Tailwind. Данные из Prisma." },
    "routes2": { timeEstimate: "30 мин", content: "Создай API-роуты для основной сущности: GET /api/items (список), POST /api/items (создать), PATCH /api/items/[id] (обновить), DELETE /api/items/[id] (удалить). Добавь Zod-валидацию." },
    "biz-logic": { timeEstimate: "45 мин", content: "Организуй бизнес-логику проекта: вынеси в src/lib/services. Пример: userService.createUser() — валидация, хеш пароля, запись в БД. Используй server actions для форм, API для внешних запросов." },
    "mcp-intro2": { timeEstimate: "10 мин", content: "Объясни что такое MCP (Model Context Protocol) простыми словами. Как он работает? Зачем нужен? Приведи 3 примера: Filesystem, PostgreSQL, Brave Search. Я новичок." },
    "mcp-stack": { timeEstimate: "15 мин", content: "Для моего стека подбери нужные MCP-серверы. Какие дадут максимальную пользу? Как их установить и настроить в Cursor / Claude Desktop?", impact: "Интеграции,Скорость,Автоматизация" },
    "tg-bot": { timeEstimate: "30 мин", content: "Создай Telegram-бота. Нужно: регистрация через BotFather, webhook на Vercel, обработка команд /start и /help. Код на TypeScript, библиотека grammy или telegraf." },
    "notif": { timeEstimate: "20 мин", content: "Настрой уведомления в Telegram: новый заказ → сообщение владельцу, ошибка сервера → алерт админу. Используй Telegram Bot API. Шаблоны сообщений с переменными." },
    "yookassa2": { timeEstimate: "45 мин", content: "Подключи ЮKassa к Next.js проекту. Нужно: создание платежа, обработка webhook, проверка статуса. Код на TypeScript, секреты в .env. Интеграция с тарифами.", impact: "Монетизация,Безопасность" },
    "subscr": { timeEstimate: "30 мин", content: "Реализуй модель подписки: Free (бесплатно), Pro (300 руб/мес). При логине проверять статус подписки, скрывать Pro-функции для Free. Страница /billing с выбором тарифа." },
    "meta2": { timeEstimate: "15 мин", content: "Добавь SEO-метатеги на все страницы: title, description, og:image. Для Next.js используй generateMetadata. Каждая страница должна иметь уникальные метатеги." },
    "sitemap2": { timeEstimate: "15 мин", content: "Создай sitemap.xml и robots.txt для Next.js. Используй встроенный sitemap.ts. Добавь все статические страницы + динамические (блог, товары). Schema.org JSON-LD для главной." },
    "legal2": { timeEstimate: "20 мин", content: "Сгенерируй правовые документы: политика конфиденциальности, пользовательское соглашение, оферта. На русском языке, для ИП Тимофеев А.Г., ИНН 532002912418. Для сайта с платёжным модулем." },
    "metrika2": { timeEstimate: "15 мин", content: "Подключи Яндекс.Метрику к Next.js. Добавь скрипт в layout.tsx, настрой цели (просмотр страницы, клик по кнопке), включи вебвизор. Используй next/script с strategy=lazyOnload." },
    "logs2": { timeEstimate: "15 мин", content: "Настрой мониторинг ошибок: отправка критических ошибок в Telegram. Используй try/catch + fetch к Telegram API. Для продакшена добавь Sentry (опционально)." },
  };

  for (const [slug, data] of Object.entries(updates)) {
    await p.decision.updateMany({ where: { slug }, data });
  }
  console.log("Updated", Object.keys(updates).length, "decisions with full prompts");
  await p.$disconnect();
}
seed();
