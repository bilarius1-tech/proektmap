import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function update() {
  const refs = [
    { service: "reg.ru", label: "reg.ru", url: "https://reg.ru", description: "Регистратор доменов" },
    { service: "Beget", label: "Beget", url: "https://beget.com", description: "VPS хостинг" },
    { service: "VS Code", label: "VS Code", url: "https://code.visualstudio.com", description: "Редактор кода" },
    { service: "SourceCraft", label: "SourceCraft", url: "https://sourcecraft.dev", description: "AI-редактор Яндекса" },
    { service: "OpenRouter", label: "OpenRouter", url: "https://openrouter.ai", description: "API для AI-моделей" },
  ];
  for (const r of refs) {
    await p.referralLink.upsert({ where: { service: r.service }, create: r, update: { url: r.url } });
  }
  console.log("Refs:", refs.length);

  const stage = await p.stage.findUnique({ where: { slug: "tools" } });
  if (!stage) { console.log("No stage"); await p.$disconnect(); return; }

  const newCards = [
    {
      stageId: stage.id, title: "Выбрать AI-редактор", slug: "choose-ai-editor",
      problem: "Вайбкодеру нужен редактор с AI. Какой выбрать из десятков?",
      why: "AI-редактор ускоряет код в 2-3 раза. Автокомплит, объяснение ошибок.",
      recommended: "VS Code + SourceCraft (бесплатно). Cursor — если готов платить $20/мес.",
      content: "SourceCraft — бесплатный AI-редактор Яндекса. Встраивается в VS Code. Понимает русский. Cursor — лучший AI но $20/мес. OpenCode — open-source.",
      tradeoffs: "SourceCraft бесплатно, русский. Cursor лучший AI, платный. OpenCode сложнее.",
      mistakes: "Использовать обычный блокнот. Ставить все AI-расширения сразу.",
      xpReward: 15, timeEstimate: "20 мин", sortOrder: 5,
      promptTemplate: "Сравни SourceCraft, Cursor и OpenCode. Что выбрать новичку? Бюджет 0, русский язык.",
    },
    {
      stageId: stage.id, title: "Подключить OpenRouter", slug: "setup-openrouter",
      problem: "Нужен доступ к разным AI-моделям. Отдельные подписки — дорого.",
      why: "OpenRouter — единый ключ для 200+ моделей. Платишь за использование.",
      recommended: "openrouter.ai → ключ → пополнить на 300 руб → готово.",
      content: "1. openrouter.ai → Sign Up. 2. Create API Key. 3. Пополни на 300 руб. 4. Используй ключ в проекте.",
      tradeoffs: "OpenRouter удобно — один ключ. Прямой API DeepSeek дешевле. Но OpenRouter даёт доступ ко всем.",
      mistakes: "Пополнять сразу много. Забыть про лимиты.",
      xpReward: 15, timeEstimate: "15 мин", sortOrder: 6,
      promptTemplate: "Помоги настроить OpenRouter API для Next.js. Нужен код для запроса к DeepSeek.",
    },
    {
      stageId: stage.id, title: "Установить Git", slug: "setup-git",
      problem: "Код меняется каждый день. Как сохранять версии?",
      why: "Git сохраняет историю изменений. Можно откатиться если что-то сломалось.",
      recommended: "Git + GitHub Desktop (визуально, без терминала).",
      content: "1. git-scm.com. 2. desktop.github.com. 3. Войти в GitHub. 4. Создать репозиторий.",
      tradeoffs: "GitHub Desktop визуально. Git CLI быстрее но сложнее.",
      mistakes: "Не использовать Git. Commit-ить всё без описания.",
      xpReward: 15, timeEstimate: "20 мин", sortOrder: 7,
      promptTemplate: "Объясни новичку как пользоваться Git и GitHub Desktop.",
    },
  ];

  for (const c of newCards) {
    await p.decision.create({ data: c });
  }
  console.log("Cards:", newCards.length);

  const bp = await p.blueprint.findUnique({ where: { slug: "corporate-website" } });
  if (bp) {
    const totalDecs = await p.decision.count();
    const totalXp = await p.decision.aggregate({ _sum: { xpReward: true } });
    await p.blueprint.update({ where: { id: bp.id }, data: { totalDecisions: totalDecs, totalXp: totalXp._sum.xpReward || 0 } });
    console.log("Total:", totalDecs, "decisions,", totalXp._sum.xpReward, "XP");
  }
  await p.$disconnect();
}
update().catch(e => { console.error(e.message); process.exit(1); });
