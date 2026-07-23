const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

const path = [
  {
    questId: "beginner-path",
    stage: 1, sortOrder: 1,
    title: "Подготовка инструментов",
    description: "Установи программы, которые нужны для AI-разработки. Все бесплатные.",
    context: "Для работы тебе нужны: 1) Cursor — редактор кода со встроенным ИИ (установи с cursor.com), 2) Node.js — движок для запуска JavaScript (с nodejs.org, версия LTS), 3) GitHub-аккаунт — облако для хранения кода (github.com).",
    question: "Всё установлено?",
    options: JSON.stringify([
      { id: "done", text: "✅ Да, Cursor, Node.js и GitHub-аккаунт готовы", consequence: "Отлично! Двигаемся к созданию первого сайта." },
      { id: "help", text: "Нужна помощь с установкой", consequence: "Windows: скачай Cursor с cursor.com, Node.js с nodejs.org (LTS). Mac: brew install node. GitHub: регистрация на github.com (нужен email)." },
    ]),
    aiModeratorPrompt: "Помоги новичку установить инструменты для AI-разработки. Объясни зачем нужен Cursor (VS Code + AI), Node.js (запускает JavaScript), GitHub (хранилище кода). Если пользователь на Windows — дай команды для PowerShell. Отвечай на русском, дружелюбно.",
  },
  {
    questId: "beginner-path",
    stage: 2, sortOrder: 2,
    title: "Первый сайт — не пишем код руками",
    description: "Ты создашь работающий сайт за 10 минут. ИИ напишет код по твоему описанию.",
    context: 'Открой Cursor. Нажми Ctrl+I (Mac: Cmd+I) — откроется AI-чат. Скопируй и вставь этот промпт:\n\n"Действуй как frontend-разработчик. Создай проект Next.js с Tailwind. Сделай одностраничный сайт-визитку для Мастерской по ремонту телефонов. Структура: шапка с названием и телефоном, секция Услуги с 3 карточками (Замена экрана 2500₽, Замена батареи 1500₽, Диагностика бесплатно), форма заявки (Имя, Телефон, кнопка Отправить), подвал. Тёмный дизайн. Напиши команды для терминала чтобы запустить."',
    question: "Сайт открылся в браузере?",
    options: JSON.stringify([
      { id: "works", text: "✅ Да, вижу сайт на localhost:3000", consequence: "Поздравляю! Ты только что создал сайт с помощью AI, не написав ни строчки кода." },
      { id: "error", text: "❌ Что-то не работает — ошибка", consequence: "Проверь: 1) Node.js установлен? (команда node -v) 2) Ты выполнил npm install и npm run dev? 3) Порт 3000 не занят? Скопируй текст ошибки и спроси ИИ в Cursor — он поможет." },
    ]),
    aiModeratorPrompt: "Помоги новичку запустить первый Next.js проект. Напомни команды: npx create-next-app, npm run dev. Объясни что он увидит на localhost:3000. Если ошибка — помоги диагностировать. Отвечай на русском, коротко.",
  },
  {
    questId: "beginner-path",
    stage: 3, sortOrder: 3,
    title: "Правки и улучшения",
    description: "Научись менять сайт через ИИ — не переписывай код вручную.",
    context: 'В том же чате Cursor напиши новый промпт:\n\n"Сайт работает. Улучши его: 1) В секции Услуги сделай hover-эффект — при наведении карточка увеличивается. 2) В форму заявки добавь проверку: поле Телефон обязательно. Покажи какие файлы изменил и объясни простыми словами."\n\nОбнови страницу в браузере (F5) и проверь изменения.',
    question: "Изменения работают?",
    options: JSON.stringify([
      { id: "works", text: "✅ Да, при наведении карточка увеличивается, телефон обязателен", consequence: "Ты понял главный принцип: не переписывай код руками — проси ИИ изменить конкретную часть." },
      { id: "not_sure", text: "Изменений не вижу", consequence: "Проверь: 1) Ты обновил страницу (F5)? 2) ИИ мог изменить файлы в другой папке — посмотри что он ответил. 3) Попроси ИИ: 'Изменения не применились, проверь ещё раз'." },
    ]),
    aiModeratorPrompt: "Объясни новичку как правильно формулировать промпты для правок: указывай конкретный элемент, конкретное изменение. Пример хорошего промпта: 'В карточке Услуги добавь тень при наведении'. Плохого: 'Сделай красивее'. Отвечай на русском.",
  },
  {
    questId: "beginner-path",
    stage: 4, sortOrder: 4,
    title: "Сохранить код",
    description: "Git — это Ctrl+Z для всего проекта. GitHub — облачное хранилище.",
    context: 'Создай новый репозиторий на GitHub (кнопка New → название my-ai-website → Create). Скопируй ссылку репозитория. Спроси ИИ в Cursor:\n\n"Я новичок. Дай 3-4 команды для терминала: инициализировать Git, сохранить все файлы, отправить на GitHub. Ссылка: [вставь свою]. Объясни каждую команду."\n\nВыполни команды в терминале Cursor (Ctrl+`)',
    question: "Код на GitHub?",
    options: JSON.stringify([
      { id: "done", text: "✅ Да, вижу файлы в репозитории на GitHub", consequence: "Отлично! Теперь твой код в безопасности. Даже если компьютер сломается — проект не пропадёт." },
      { id: "help", text: "Не получается — ошибка при git push", consequence: "Частые ошибки: 1) Не настроен git config (git config --global user.email 'ваш@email'). 2) Не авторизован в GitHub (нужен токен или GitHub CLI). Спроси ИИ — он поможет." },
    ]),
    aiModeratorPrompt: "Объясни новичку Git простыми словами: git init (создать историю), git add . (подготовить файлы), git commit -m (сохранить версию), git push (отправить на GitHub). Дай точные команды. Отвечай на русском.",
  },
  {
    questId: "beginner-path",
    stage: 5, sortOrder: 5,
    title: "Сайт в интернете",
    description: "Опубликуй сайт чтобы он был доступен всем. Vercel — бесплатный хостинг.",
    context: 'Зайди на vercel.com → войди через GitHub. Нажми Import Repository → выбери my-ai-website → Deploy. Через 1-2 минуты сайт будет доступен по ссылке вида my-ai-website.vercel.app. Открой ссылку с телефона — сайт работает!',
    question: "Сайт в интернете?",
    options: JSON.stringify([
      { id: "live", text: "🎉 Да! Сайт открывается по ссылке vercel.app", consequence: "Поздравляю! Ты прошёл полный цикл: установка → создание → правки → сохранение → деплой. Ты — AI-разработчик!" },
      { id: "stuck", text: "Что-то пошло не так", consequence: "Проверь: 1) Репозиторий точно на GitHub? 2) Vercel подключён к GitHub? 3) В настройках проекта Framework = Next.js. Если ошибка — скопируй её и спроси ИИ." },
    ]),
    aiModeratorPrompt: "Помоги новичку задеплоить Next.js на Vercel. Шаги: GitHub → Vercel → Import → Deploy. Объясни что Vercel автоматически собирает и публикует сайт. Расскажи про бесплатный домен .vercel.app. Отвечай на русском, празднично.",
  },
];

async function seed() {
  await p.questNode.deleteMany({ where: { questId: "beginner-path" } });
  for (const n of path) {
    await p.questNode.create({ data: { ...n, isPublished: true } });
  }
  console.log("Seeded", path.length, "beginner path nodes");
  await p.$disconnect();
}
seed();
