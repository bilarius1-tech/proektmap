import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const STAGES = [
  { title: "Фундамент", slug: "foundation", icon: "Compass", desc: "Определяем цель, аудиторию, карту страниц", cards: [
    { title: "Определить цель сайта", content: "Какую задачу решает сайт? Продажи, информирование, сбор заявок?", xp: 15, time: "20 мин", ai: "Помоги определить цель сайта для бизнеса." },
    { title: "Определить целевую аудиторию", content: "Кто будет пользоваться сайтом? Возраст, профессия, боли.", xp: 15, time: "20 мин", ai: "Помоги составить портрет целевой аудитории." },
    { title: "Составить карту страниц", content: "Главная, О компании, Услуги, Контакты. Какие страницы нужны?", xp: 20, time: "30 мин", ai: "Помоги составить карту страниц." },
    { title: "Подготовить структуру блоков", content: "Шапка, hero, преимущества, кейсы, CTA, футер.", xp: 20, time: "30 мин", ai: "Помоги продумать структуру блоков." },
    { title: "Определить интеграции", content: "Форма связи, Telegram бот, CRM, аналитика, платежи.", xp: 15, time: "15 мин", ai: "Какие интеграции нужны сайту?" },
  ]},
  { title: "Контент", slug: "content", icon: "FileText", desc: "Структура и наполнение сайта", cards: [
    { title: "Написать тексты для страниц", content: "Главная, О компании, Услуги. Текст должен отвечать на вопросы клиента.", xp: 25, time: "2 часа", ai: "Помоги написать текст для страницы." },
    { title: "Подготовить изображения", content: "Фото команды, офиса, продукции. WebP, lazy load.", xp: 15, time: "1 час", ai: "Как оптимизировать изображения для сайта?" },
    { title: "Собрать контакты и реквизиты", content: "Телефон, email, адрес, ИНН/ОГРН.", xp: 10, time: "15 мин", ai: "Какие реквизиты должны быть на сайте?" },
  ]},
  { title: "Design System", slug: "design-system", icon: "Palette", desc: "Создаём дизайн-токены и основу интерфейса", cards: [
    { title: "Создать Design Tokens", content: "Цвета, шрифты, отступы, радиусы в CSS-переменных.", xp: 20, time: "30 мин", ai: "Объясни что такое дизайн-токены." },
    { title: "Выбрать шрифты", content: "Inter основной, JetBrains Mono для кода. Подключить локально.", xp: 15, time: "15 мин", ai: "Какие шрифты выбрать для сайта?" },
    { title: "Определить цветовую схему", content: "Основной, акцентный, фон, текст. Светлая и тёмная темы.", xp: 15, time: "20 мин", ai: "Помоги выбрать цветовую схему." },
  ]},
  { title: "UI Kit", slug: "ui-kit", icon: "Layout", desc: "Компоненты и макеты", cards: [
    { title: "Создать компонент Button", content: "Primary, Secondary, Ghost. Размеры, состояния, иконки.", xp: 15, time: "30 мин", ai: "Как сделать компонент кнопки в React?" },
    { title: "Создать компонент Card", content: "Заголовок, описание, картинка, CTA. Адаптивная сетка.", xp: 15, time: "30 мин", ai: "Как сделать адаптивную карточку?" },
    { title: "Создать Header и Footer", content: "Навигация, логотип, меню. Мобильный гамбургер.", xp: 20, time: "45 мин", ai: "Как сделать адаптивный header?" },
  ]},
  { title: "Frontend", slug: "frontend", icon: "Code", desc: "Генерация и настройка проекта", cards: [
    { title: "Выбрать фреймворк", content: "Next.js vs Vue vs Laravel. Сравнение для вашего проекта.", xp: 25, time: "30 мин", ai: "Сравни Next.js и Vue. Что выбрать?" },
    { title: "Настроить проект", content: "create-next-app, TypeScript, Tailwind, ESLint, Prettier.", xp: 20, time: "30 мин", ai: "Пошаговая настройка Next.js проекта." },
    { title: "Сверстать главную страницу", content: "Hero, преимущества, кейсы, CTA из компонентов UI Kit.", xp: 30, time: "2 часа", ai: "Помоги сверстать главную страницу." },
  ]},
  { title: "Backend", slug: "backend", icon: "Database", desc: "База данных, API, авторизация", cards: [
    { title: "Нужен ли backend?", content: "Только формы — можно без. Блог/каталог — нужен.", xp: 20, time: "20 мин", ai: "Нужен ли backend для сайта? Когда да, когда нет." },
    { title: "Выбрать базу данных", content: "SQLite (просто) vs PostgreSQL (мощно).", xp: 20, time: "20 мин", ai: "SQLite или PostgreSQL? Сравни." },
    { title: "Настроить авторизацию", content: "NextAuth + Яндекс ID. Просто и безопасно.", xp: 25, time: "1 час", ai: "Как настроить Яндекс-авторизацию?" },
  ]},
  { title: "SEO", slug: "seo", icon: "Search", desc: "Мета-теги, sitemap, robots.txt", cards: [
    { title: "Meta-теги", content: "Title, Description, Keywords для каждой страницы.", xp: 15, time: "30 мин", ai: "Как заполнить Title и Description для SEO?" },
    { title: "Sitemap и robots.txt", content: "Создать и отправить в Яндекс.Вебмастер.", xp: 15, time: "15 мин", ai: "Как создать sitemap.xml?" },
    { title: "Метрика и Вебмастер", content: "Подключить счётчики, подтвердить права.", xp: 15, time: "20 мин", ai: "Как подключить Яндекс.Метрику?" },
  ]},
  { title: "Deploy", slug: "deploy", icon: "Rocket", desc: "Домен, SSL, хостинг, запуск", cards: [
    { title: "Купить домен", content: "Где купить, как выбрать имя, DNS-записи.", xp: 15, time: "30 мин", ai: "Как выбрать и купить домен?" },
    { title: "Настроить SSL", content: "Let's Encrypt через ISPmanager. Бесплатно.", xp: 15, time: "15 мин", ai: "Как получить SSL-сертификат?" },
    { title: "Задеплоить на сервер", content: "Nginx, PM2, CI/CD. Автодеплой из Git.", xp: 30, time: "1 час", ai: "Пошаговый деплой Next.js на VPS." },
  ]},
  { title: "Поддержка", slug: "support", icon: "Heart", desc: "Мониторинг, обновления, бэкапы", cards: [
    { title: "Настроить мониторинг", content: "Uptime, логи ошибок, уведомления в Telegram.", xp: 15, time: "20 мин", ai: "Как настроить мониторинг сайта?" },
    { title: "Настроить бэкапы", content: "Автоматические бэкапы БД и файлов.", xp: 15, time: "15 мин", ai: "Как настроить бэкапы?" },
    { title: "План обновлений", content: "Раз в месяц: обновление зависимостей, проверка безопасности.", xp: 10, time: "10 мин", ai: "Как часто обновлять зависимости?" },
  ]},
];

async function seed() {
  await p.cardProgress.deleteMany();
  await p.project.deleteMany();
  await p.blueprintStage.deleteMany();
  await p.card.deleteMany();
  await p.stage.deleteMany();
  await p.blueprint.deleteMany();

  const bp = await p.blueprint.create({
    data: { title: "Корпоративный сайт", slug: "corporate-website", description: "Создание сайта компании с нуля", icon: "Globe", difficulty: "easy", isPublished: true, sortOrder: 1 }
  });
  console.log("Blueprint:", bp.title);

  let totalXp = 0, totalCards = 0;

  for (let i = 0; i < STAGES.length; i++) {
    const s = STAGES[i];
    const stage = await p.stage.create({ data: { title: s.title, slug: s.slug, icon: s.icon, description: s.desc, sortOrder: i + 1 } });
    await p.blueprintStage.create({ data: { blueprintId: bp.id, stageId: stage.id, sortOrder: i + 1 } });

    for (let j = 0; j < s.cards.length; j++) {
      const c = s.cards[j];
      await p.card.create({ data: { stageId: stage.id, title: c.title, content: c.content, xpReward: c.xp, timeEstimate: c.time, aiPrompt: c.ai, sortOrder: j + 1 } });
      totalXp += c.xp;
      totalCards++;
    }
  }

  await p.blueprint.update({ where: { id: bp.id }, data: { totalXp, totalCards } });
  console.log("Stages:", STAGES.length, "Cards:", totalCards, "XP:", totalXp);
  await p.$disconnect();
}

seed().catch(e => { console.error(e.message); process.exit(1); });
