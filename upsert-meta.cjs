const { PrismaClient } = require("@prisma/client");
const data = require("./tools-meta.json");
const db = new PrismaClient();
async function main() {
  await db.aITool.updateMany({
    where: { slug: "cursor" },
    data: {
      creator: "Anysphere Inc",
      foundedYear: 2023,
      lastUpdate: "Еженедельно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "AI-редактор кода на базе VS Code с лучшим в индустрии автодополнением и встроенным агентом.",
    }
  });
  console.log("OK: cursor");
  await db.aITool.updateMany({
    where: { slug: "reasonix" },
    data: {
      creator: "Reasonix Community",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Open-source сообщество",
      shortDescription: "Open-source AI-агент для терминала: пишет код, работает с файлами, сам находит и исправляет ошибки.",
    }
  });
  console.log("OK: reasonix");
  await db.aITool.updateMany({
    where: { slug: "vibecraft" },
    data: {
      creator: "Яндекс",
      foundedYear: 2025,
      lastUpdate: "Активно",
      headquarters: "Москва, Россия",
      shortDescription: "Российский no-code конструктор сайтов. Пишешь идею на русском — получаешь готовый сайт. Бесплатно.",
    }
  });
  console.log("OK: vibecraft");
  await db.aITool.updateMany({
    where: { slug: "vs-code-copilot" },
    data: {
      creator: "Microsoft / GitHub",
      foundedYear: 2021,
      lastUpdate: "Ежемесячно",
      headquarters: "Редмонд, США",
      shortDescription: "Стандарт индустрии: бесплатный редактор кода + AI-помощник Copilot за 10/мес. 150M+ пользователей.",
    }
  });
  console.log("OK: vs-code-copilot");
  await db.aITool.updateMany({
    where: { slug: "bolt-new" },
    data: {
      creator: "StackBlitz",
      foundedYear: 2024,
      lastUpdate: "Еженедельно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "Браузерная full-stack IDE с WebContainer. Node.js, npm, git — всё прямо в браузере. Мгновенный старт.",
    }
  });
  console.log("OK: bolt-new");
  await db.aITool.updateMany({
    where: { slug: "lovable" },
    data: {
      creator: "Lovable",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Стокгольм, Швеция",
      shortDescription: "No-code платформа для full-stack приложений. Описываешь идею текстом — получаешь работающий продукт с базой данных.",
    }
  });
  console.log("OK: lovable");
  await db.aITool.updateMany({
    where: { slug: "sourcecraft" },
    data: {
      creator: "Яндекс",
      foundedYear: 2025,
      lastUpdate: "Активно",
      headquarters: "Москва, Россия",
      shortDescription: "Профессиональная AI-среда разработки от Яндекса. GitHub-интеграция, Yandex ID, русский интерфейс.",
    }
  });
  console.log("OK: sourcecraft");
  await db.aITool.updateMany({
    where: { slug: "claude-code" },
    data: {
      creator: "Anthropic",
      foundedYear: 2025,
      lastUpdate: "Еженедельно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "AI-агент от создателей Claude. Понимает архитектуру проекта, рефакторит код, объясняет решения. Терминал + IDE.",
    }
  });
  console.log("OK: claude-code");
  await db.aITool.updateMany({
    where: { slug: "windsurf" },
    data: {
      creator: "Cognition AI",
      foundedYear: 2024,
      lastUpdate: "Еженедельно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "AI-IDE с потоковым агентом. Теперь часть экосистемы Devin Desktop с ACP-протоколом.",
    }
  });
  console.log("OK: windsurf");
  await db.aITool.updateMany({
    where: { slug: "github-copilot-agent" },
    data: {
      creator: "GitHub / Microsoft",
      foundedYear: 2025,
      lastUpdate: "Ежемесячно",
      headquarters: "Редмонд, США",
      shortDescription: "Автономный агент от GitHub: сам планирует задачи, пишет код, создаёт PR. Режим Agent в Copilot Chat.",
    }
  });
  console.log("OK: github-copilot-agent");
  await db.aITool.updateMany({
    where: { slug: "replit-agent" },
    data: {
      creator: "Replit",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "AI-агент внутри браузерной IDE Replit. Понимает запросы на естественном языке и строит приложения с нуля.",
    }
  });
  console.log("OK: replit-agent");
  await db.aITool.updateMany({
    where: { slug: "v0" },
    data: {
      creator: "Vercel",
      foundedYear: 2024,
      lastUpdate: "Еженедельно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "Генератор UI от Vercel. Описываешь интерфейс словами → получаешь React-код с Tailwind. Копируешь в проект.",
    }
  });
  console.log("OK: v0");
  await db.aITool.updateMany({
    where: { slug: "cursor-agent" },
    data: {
      creator: "Anysphere Inc",
      foundedYear: 2025,
      lastUpdate: "Еженедельно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "Автономный агент внутри Cursor: сам ищет файлы, пишет код, запускает терминал, исправляет ошибки. Режим YOLO.",
    }
  });
  console.log("OK: cursor-agent");
  await db.aITool.updateMany({
    where: { slug: "gigacode" },
    data: {
      creator: "Сбер",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Москва, Россия",
      shortDescription: "Российский AI-помощник от Сбера. Плагины для VS Code и JetBrains. Бесплатно для граждан РФ.",
    }
  });
  console.log("OK: gigacode");
  await db.aITool.updateMany({
    where: { slug: "yandex-code-assistant" },
    data: {
      creator: "Яндекс",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Москва, Россия",
      shortDescription: "AI-помощник от Яндекса на базе YandexGPT. Встроен в Яндекс.Облако. Для корпоративных клиентов.",
    }
  });
  console.log("OK: yandex-code-assistant");
  await db.aITool.updateMany({
    where: { slug: "aider" },
    data: {
      creator: "Paul Gauthier",
      foundedYear: 2023,
      lastUpdate: "Еженедельно",
      headquarters: "Open-source сообщество",
      shortDescription: "Терминальный AI-напарник. 44K GitHub stars. Git-интеграция: сам коммитит с понятными сообщениями. 88% кода пишет AI.",
    }
  });
  console.log("OK: aider");
  await db.aITool.updateMany({
    where: { slug: "augment-code" },
    data: {
      creator: "Augment Inc",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "Платформа-оркестратор Cosmos: управляет командой специализированных AI-агентов.",
    }
  });
  console.log("OK: augment-code");
  await db.aITool.updateMany({
    where: { slug: "tabnine" },
    data: {
      creator: "Tabnine",
      foundedYear: 2018,
      lastUpdate: "Ежемесячно",
      headquarters: "Тель-Авив, Израиль",
      shortDescription: "Старейший AI-ассистент для кода (с 2018). Enterprise Context Engine. Air-gapped режим.",
    }
  });
  console.log("OK: tabnine");
  await db.aITool.updateMany({
    where: { slug: "huawei-codearts-snap" },
    data: {
      creator: "Huawei",
      foundedYear: 2025,
      lastUpdate: "Активно",
      headquarters: "Шэньчжэнь, Китай",
      shortDescription: "Китайский AI-ассистент с мульти-агентной архитектурой. Глубокая поддержка HarmonyOS. Sandbox-изоляция.",
    }
  });
  console.log("OK: huawei-codearts-snap");
  await db.aITool.updateMany({
    where: { slug: "poolside" },
    data: {
      creator: "Poolside",
      foundedYear: 2023,
      lastUpdate: "Активно",
      headquarters: "Париж, Франция",
      shortDescription: "Европейские open-weight модели для кода: Laguna 33B и 118B. Работают без облака.",
    }
  });
  console.log("OK: poolside");
  await db.aITool.updateMany({
    where: { slug: "sweep" },
    data: {
      creator: "Sweep AI",
      foundedYear: 2023,
      lastUpdate: "Активно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "AI-плагин No1 для JetBrains (4.9★, 40K+ установок). Свои LLM-модели.",
    }
  });
  console.log("OK: sweep");
  await db.aITool.updateMany({
    where: { slug: "tongyi-lingma" },
    data: {
      creator: "Alibaba Cloud",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Ханчжоу, Китай",
      shortDescription: "Первый китайский инструмент в Gartner Magic Quadrant. Агентный режим, 200+ языков.",
    }
  });
  console.log("OK: tongyi-lingma");
  await db.aITool.updateMany({
    where: { slug: "codegeex" },
    data: {
      creator: "Zhipu.AI / Tsinghua",
      foundedYear: 2023,
      lastUpdate: "Периодически",
      headquarters: "Пекин, Китай",
      shortDescription: "Open-source модель на 13B параметров. Уникальная фича: перевод кода между языками.",
    }
  });
  console.log("OK: codegeex");
  await db.aITool.updateMany({
    where: { slug: "cody-sourcegraph" },
    data: {
      creator: "Sourcegraph",
      foundedYear: 2023,
      lastUpdate: "Активно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "AI-ассистент с самым глубоким пониманием кодовой базы через Sourcegraph Code Graph.",
    }
  });
  console.log("OK: cody-sourcegraph");
  await db.aITool.updateMany({
    where: { slug: "pearai" },
    data: {
      creator: "PearAI (YC S24)",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "YC-стартап с AI-роутером: автоматически выбирает лучшую модель под задачу.",
    }
  });
  console.log("OK: pearai");
  await db.aITool.updateMany({
    where: { slug: "melty-conductor" },
    data: {
      creator: "Melty",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "Оркестратор параллельных AI-агентов. Запускает Claude Code, Codex, Cursor одновременно.",
    }
  });
  console.log("OK: melty-conductor");
  await db.aITool.updateMany({
    where: { slug: "openhands" },
    data: {
      creator: "All Hands AI",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Open-source сообщество",
      shortDescription: "Платформа для AI-агентов: GUI + CLI + SDK. MIT лицензия.",
    }
  });
  console.log("OK: openhands");
  await db.aITool.updateMany({
    where: { slug: "deepseek-coder" },
    data: {
      creator: "DeepSeek",
      foundedYear: 2023,
      lastUpdate: "Активно",
      headquarters: "Ханчжоу, Китай",
      shortDescription: "Лучшая open-weight модель для кода по соотношению цена/качество. MIT лицензия.",
    }
  });
  console.log("OK: deepseek-coder");
  await db.aITool.updateMany({
    where: { slug: "jetbrains-ai" },
    data: {
      creator: "JetBrains",
      foundedYear: 2024,
      lastUpdate: "Ежемесячно",
      headquarters: "Прага, Чехия",
      shortDescription: "AI-ассистент, встроенный во все IDE JetBrains. On-premises для enterprise.",
    }
  });
  console.log("OK: jetbrains-ai");
  await db.aITool.updateMany({
    where: { slug: "devin-desktop" },
    data: {
      creator: "Cognition AI",
      foundedYear: 2024,
      lastUpdate: "Еженедельно",
      headquarters: "Сан-Франциско, США",
      shortDescription: "Первый AI-разработчик в новостях. Мульти-агентная IDE: Kanban-доска агентов, ACP-протокол.",
    }
  });
  console.log("OK: devin-desktop");
  await db.aITool.updateMany({
    where: { slug: "opencode-desktop" },
    data: {
      creator: "OpenCode Community",
      foundedYear: 2024,
      lastUpdate: "Активно",
      headquarters: "Open-source сообщество",
      shortDescription: "Open-source десктопный AI-редактор. Модель-агностик. Бесплатно навсегда.",
    }
  });
  console.log("OK: opencode-desktop");
  await db.$disconnect();
}
main();
