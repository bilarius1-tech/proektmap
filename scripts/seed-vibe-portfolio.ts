import { getDb } from "../src/lib/db/index";

async function main() {
  const db = await getDb();
  const user = await db.user.findUnique({ where: { email: "bilariuss@yandex.ru" } });
  if (!user) {
    console.log("User bilariuss@yandex.ru not found");
    return;
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      publicProfile: true,
      name: "Алексей Тимофеев",
      headline: "AI-инженер & Создатель ProektMap",
      bio: "17 лет в digital-разработке. Создаю веб-сервисы, архитектуры и продукты нового поколения с помощью AI-ассистентов и агентов.",
      telegram: "bilarius",
      skills: "AI-инжиниринг, Next.js, Cursor, Vibe Coding, TypeScript, PostgreSQL, Claude 3.7",
      status: "architect",
      website: "https://proektmap.ru",
    },
  });

  const projectsData = [
    {
      title: "ProektMap — Карта роста AI-инженера",
      slug: "proektmap-platform",
      description: "Интерактивная образовательная платформа и навигатор готовых инженерных маршрутов для создания AI-продуктов и вайбкодинга.",
      url: "https://proektmap.ru",
      githubUrl: "",
      telegramUrl: "https://t.me/proektmap",
      techStack: "Next.js 16, TypeScript, Prisma, PostgreSQL, Turbo, Vibe Blocks",
      aiTools: "Cursor, Claude 3.7 Sonnet, DeepSeek V3",
      category: "SaaS",
      status: "Запущен",
      language: "ru",
      featured: true,
      authorName: "Алексей Тимофеев",
      authorAvatar: user.avatar || "/uploads/1783538388070-yhagwt.webp",
      authorUrl: `/profile/${user.id}`,
      userId: user.id,
      screenshot: "",
      screenshots: JSON.stringify([]),
      aiRecipe: "Полная разработка архитектуры и интерфейсов через Cursor IDE и автономных агентов. Готовые решения спроектированы по методологии Результат -> Рекомендация -> Промпты -> Проверка.",
      timeSpent: "2 недели",
      likesCount: 24,
      viewCount: 380,
    },
    {
      title: "Scroll Film — Интерактивный AI-кинолендинг",
      slug: "scroll-film-landing",
      description: "Кинематографический сайт-фильм с бесшовным сторителлингом, физикой частиц и аудиовизуальным погружением.",
      url: "https://proektmap.ru/demo/scroll-film",
      githubUrl: "",
      telegramUrl: "https://t.me/proektmap",
      techStack: "Next.js, Canvas, GSAP, Web Audio API, Framer Motion",
      aiTools: "Claude 3.7 Sonnet, Cursor IDE, Midjourney v6",
      category: "Веб-сервис",
      status: "Запущен",
      language: "ru",
      featured: true,
      authorName: "Алексей Тимофеев",
      authorAvatar: user.avatar || "/uploads/1783538388070-yhagwt.webp",
      authorUrl: `/profile/${user.id}`,
      userId: user.id,
      screenshot: "",
      screenshots: JSON.stringify([]),
      aiRecipe: "Генерация кинематографических кадров и бесшовная склейка скролла через физическую модель GSAP ScrollTrigger.",
      timeSpent: "3 дня",
      likesCount: 19,
      viewCount: 210,
    },
    {
      title: "Telegram AI Bot: Бот-консультант с памятью",
      slug: "telegram-ai-bot-consultant",
      description: "Многофункциональный Telegram-бот с контекстной памятью диалогов, интеграцией баз данных и подписками через ЮKassa.",
      url: "https://proektmap.ru/resheniya/telegram-bot",
      githubUrl: "",
      telegramUrl: "https://t.me/proektmap",
      techStack: "Node.js, Grammy / Telegraf, Prisma, PostgreSQL, OpenAI API",
      aiTools: "Cursor, GPT-4o, DeepSeek R1",
      category: "Бот",
      status: "Запущен",
      language: "ru",
      featured: true,
      authorName: "Алексей Тимофеев",
      authorAvatar: user.avatar || "/uploads/1783538388070-yhagwt.webp",
      authorUrl: `/profile/${user.id}`,
      userId: user.id,
      screenshot: "",
      screenshots: JSON.stringify([]),
      aiRecipe: "Спроектирован готовый маршрут развертывания бота за 10 шагов: от BotFather до вебхуков и базы данных.",
      timeSpent: "4 дня",
      likesCount: 15,
      viewCount: 190,
    },
  ];

  for (const p of projectsData) {
    await db.aiProject.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log("✅ Успешно обновлен профиль Алексея и добавлены работы в портфолио!");
}

main().catch(console.error);
