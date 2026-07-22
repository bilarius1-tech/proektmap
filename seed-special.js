const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

async function seed() {
  const steps = [
    { slug: "game-design", title: "🎮 Геймдизайн", desc: "Механика, сюжет, уровни, баланс", sortOrder: 25, bp: "game-dev", decisions: [
      { title: "Игровая механика", slug: "game-mechanics", problem: "Жанр, core loop, правила.", why: "Механика = душа игры.", recommended: "Опишите core loop: действие → награда → прогресс.", xp: 15 },
      { title: "Сюжет и уровни", slug: "game-story", problem: "Нарратив, прогрессия сложности.", why: "Без сюжета игра — просто механика.", recommended: "3 акта: обучение → развитие → финал.", xp: 15 },
    ]},
    { slug: "game-graphics", title: "🎨 Графика и логотип", desc: "Спрайты, анимация, интерфейс игры", sortOrder: 26, bp: "game-dev", decisions: [
      { title: "Спрайты и анимация", slug: "game-sprites", problem: "Персонажи, фоны, эффекты.", why: "Визуал продаёт игру.", recommended: "Aseprite или Photoshop → sprite sheet.", xp: 20 },
      { title: "Логотип игры", slug: "game-logo", problem: "Название + шрифт + иконка.", why: "Логотип — первое что видят.", recommended: "Крупный шрифт, яркий цвет.", xp: 10 },
    ]},
    { slug: "game-monetization", title: "💰 Монетизация игры", desc: "Яндекс.Игры, реклама, встроенные покупки", sortOrder: 45, bp: "game-dev", decisions: [
      { title: "Яндекс.Игры", slug: "yandex-games", problem: "Публикация и монетизация на платформе.", why: "Яндекс.Игры — главная площадка РФ.", recommended: "SDK Яндекс.Игр → реклама → публикация.", xp: 20, impact: "Монетизация,Трафик" },
      { title: "Внутриигровые покупки", slug: "game-iap", problem: "Скины, бустеры, валюта.", why: "IAP = основной доход мобильных игр.", recommended: "Не влияет на геймплей — косметика.", xp: 15, impact: "Монетизация" },
    ]},
    { slug: "bot-setup", title: "🤖 Регистрация бота", desc: "BotFather, токен, webhook, первые команды", sortOrder: 35, bp: "corporate-website", decisions: [
      { title: "Создание бота", slug: "botfather-setup", problem: "BotFather → токен → webhook.", why: "Первый шаг к автоматизации.", recommended: "/newbot → имя → токен → webhook.", xp: 10 },
      { title: "Webhook на сервере", slug: "bot-webhook", problem: "Приём сообщений от Telegram.", why: "Webhook быстрее polling.", recommended: "Vercel/Beget → URL → setWebhook.", xp: 15 },
    ]},
    { slug: "bot-commands", title: "📋 Обработчик команд", desc: "/start, /help, /menu — структура команд", sortOrder: 36, bp: "corporate-website", decisions: [
      { title: "Система команд", slug: "bot-cmd-system", problem: "/start, /help, /menu.", why: "Структура команд = UX бота.", recommended: "composer.command() для каждой.", xp: 15 },
      { title: "Клавиатуры и кнопки", slug: "bot-keyboard", problem: "Inline vs Reply клавиатуры.", why: "Кнопки увеличивают конверсию.", recommended: "Inline для действий, Reply для навигации.", xp: 10 },
    ]},
    { slug: "bot-inline", title: "⚡ Инлайн-режим", desc: "Быстрые ответы без команд", sortOrder: 37, bp: "corporate-website", decisions: [
      { title: "Инлайн-режим", slug: "bot-inline-mode", problem: "Быстрые ответы через @bot.", why: "Пользователи не должны писать команды.", recommended: "Включить inline mode в BotFather.", xp: 15 },
      { title: "Инлайн-результаты", slug: "bot-inline-results", problem: "Статьи, фото, видео в ответ.", why: "Богатый контент = engagement.", recommended: "IncomingInlineQuery → answerInlineQuery.", xp: 15 },
    ]},
  ];

  for (const s of steps) {
    const stage = await p.stage.upsert({
      where: { slug: s.slug },
      update: { title: s.title, description: s.desc, sortOrder: s.sortOrder },
      create: { slug: s.slug, title: s.title, description: s.desc, sortOrder: s.sortOrder }
    });
    const bp = await p.blueprint.findUnique({ where: { slug: s.bp } });
    if (bp) await p.blueprintStage.upsert({
      where: { blueprintId_stageId: { blueprintId: bp.id, stageId: stage.id } },
      update: {}, create: { blueprintId: bp.id, stageId: stage.id }
    });
    for (const d of s.decisions) {
      const count = await p.decision.count({ where: { stageId: stage.id } });
      await p.decision.upsert({
        where: { slug: d.slug },
        update: { stageId: stage.id, title: d.title, problem: d.problem, why: d.why, recommended: d.recommended, difficulty: "medium", xpReward: d.xp, timeEstimate: d.xp + " мин", sortOrder: count, impact: d.impact || "" },
        create: { stageId: stage.id, slug: d.slug, title: d.title, problem: d.problem, why: d.why, recommended: d.recommended, difficulty: "medium", xpReward: d.xp, timeEstimate: d.xp + " мин", sortOrder: count, impact: d.impact || "" }
      });
    }
    console.log("✅", s.slug, "→", s.bp, "(", s.decisions.length, "decisions )");
  }
  console.log("Done: 6 specialized stages + 12 decisions");
  await p.$disconnect();
}
seed();
