import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function seed() {
  const bp = await p.blueprint.create({ data: {
    title: "Сайт компании", slug: "corporate-website",
    description: "От покупки домена до запуска сайта",
    icon: "Globe", difficulty: "easy", isPublished: true, sortOrder: 1,
  }});

  const stagesData = [
    { title:"Инструменты", slug:"tools", icon:"Wrench", desc:"Что купить и установить", decisions:[
      { title:"Купить домен", slug:"buy-domain", problem:"Где и как купить домен", why:"Без домена сайт не будет доступен", recommended:"reg.ru или nic.ru", content:"Домен — это адрес сайта. Выбирайте короткий, запоминающийся.", tradeoffs:".ru дешевле, .com международный", whenNotUse:"Если сайт на конструкторе", mistakes:"Покупать у перекупщиков", difficulty:"easy", xp:15, time:"20 мин", pt:"Помоги выбрать домен", pp:"Я создаю сайт компании. Помоги выбрать доменное имя. Предложи 5 вариантов." },
      { title:"Выбрать хостинг", slug:"choose-hosting", problem:"Где разместить сайт", why:"Хостинг — компьютер где живёт сайт", recommended:"VPS от Beget или Timeweb", content:"Для сайта нужен VPS. Даёт полный контроль. От 400₽/мес.", tradeoffs:"Shared дешевле но медленнее", whenNotUse:"На Tilda хостинг не нужен", mistakes:"Покупать самый дешёвый", difficulty:"easy", xp:15, time:"20 мин", pt:"Какой хостинг выбрать", pp:"Нужен хостинг для Next.js сайта. Посоветуй российский VPS до 1000₽/мес." },
      { title:"Установить VS Code", slug:"install-vscode", problem:"В чём писать код", why:"VS Code — бесплатный редактор", recommended:"VS Code + Prettier + ESLint", content:"Скачайте code.visualstudio.com", tradeoffs:"WebStorm мощнее но платный", whenNotUse:"На конструкторе", mistakes:"Не ставить расширения", difficulty:"easy", xp:10, time:"10 мин", pt:"Настроить VS Code", pp:"Я начинающий. Помоги настроить VS Code. Какие расширения?" },
      { title:"Установить Node.js", slug:"install-nodejs", problem:"Среда для JavaScript", why:"Без Node.js Next.js не работает", recommended:"Node.js 20 LTS", content:"nodejs.org → LTS", tradeoffs:"Bun быстрее но нестабилен", whenNotUse:"PHP/HTML проекты", mistakes:"Ставить самую новую", difficulty:"easy", xp:10, time:"10 мин", pt:"Установить Node.js", pp:"Помоги установить Node.js на Windows для Next.js." },
    ]},
    { title:"Дизайн-система", slug:"design-system", icon:"Palette", desc:"Цвета, шрифты, отступы", decisions:[
      { title:"Создать Design Tokens", slug:"design-tokens", problem:"Как хранить цвета и шрифты", why:"Токены — переменные дизайна", recommended:"CSS-переменные в :root", content:"Создайте tokens.css с --color-primary, --font-sans.", tradeoffs:"Tailwind-конфиг если уже на Tailwind", whenNotUse:"На сайте из 2 страниц", mistakes:"Хардкодить цвета", difficulty:"easy", xp:20, time:"30 мин", pt:"Создать дизайн-токены", pp:"Помоги создать CSS-переменные для сайта. Нужны: цвет, фон, текст, шрифты, отступы." },
      { title:"Выбрать шрифт", slug:"choose-font", problem:"Какой шрифт использовать", why:"Шрифт создаёт впечатление", recommended:"Inter — универсальный, бесплатный", content:"next/font/google с Inter.", tradeoffs:"Локальный шрифт быстрее", whenNotUse:"Есть брендовый шрифт", mistakes:"Подключать 5 шрифтов", difficulty:"easy", xp:15, time:"15 мин", pt:"Выбрать шрифт", pp:"Посоветуй русский шрифт из Google Fonts для сайта компании." },
    ]},
    { title:"Вёрстка", slug:"layout", icon:"Layout", desc:"HTML и CSS страниц", decisions:[
      { title:"Сверстать Header", slug:"build-header", problem:"Шапка сайта", why:"Header на каждой странице", recommended:"Flexbox: лого слева, меню справа", content:"<header> с position: sticky.", tradeoffs:"fixed всегда виден но скрывает контент", whenNotUse:"На лендинге без навигации", mistakes:"Слишком высокий на мобильных", difficulty:"medium", xp:25, time:"30 мин", pt:"Сверстать Header", pp:"Напиши HTML/CSS для header. Логотип, меню, кнопка CTA. Адаптивный." },
      { title:"Сверстать Hero", slug:"build-hero", problem:"Первый экран", why:"Hero — 80% решения клиента", recommended:"Заголовок 40-60px + кнопка", content:"h1 с сообщением, p с описанием, кнопка CTA.", tradeoffs:"Видео-фон круто но тяжело", whenNotUse:"На внутренних страницах", mistakes:"Длинный текст", difficulty:"medium", xp:25, time:"30 мин", pt:"Сверстать Hero", pp:"Напиши HTML/CSS для Hero-блока. Заголовок, описание, CTA. Адаптивный." },
    ]},
    { title:"Next.js", slug:"nextjs", icon:"Code", desc:"Создание проекта", decisions:[
      { title:"Создать Next.js проект", slug:"create-next-app", problem:"С чего начать код", why:"Next.js — лучший в 2026", recommended:"create-next-app + TS + Tailwind", content:"npx create-next-app@latest --typescript --tailwind --app", tradeoffs:"Vue/Nuxt если знаешь Vue", whenNotUse:"1-страничный лендинг", mistakes:"Пропустить TypeScript", difficulty:"medium", xp:30, time:"30 мин", pt:"Создать Next.js проект", pp:"Помоги создать Next.js проект. TypeScript, Tailwind, App Router." },
      { title:"Сделать страницы", slug:"build-pages", problem:"Организация страниц", why:"Каждая страница — файл в app/", recommended:"App Router: page.tsx", content:"app/page.tsx, app/about/page.tsx, app/contacts/page.tsx", tradeoffs:"Pages Router старее", whenNotUse:"Одностраничный сайт", mistakes:"Копировать код", difficulty:"medium", xp:25, time:"1 час", pt:"Создать страницы", pp:"Помоги создать страницы: Главная, О компании, Услуги, Контакты. App Router." },
    ]},
    { title:"Домен и хостинг", slug:"deploy", icon:"Rocket", desc:"Домен, SSL, запуск", decisions:[
      { title:"Настроить DNS", slug:"setup-dns", problem:"Связать домен с сервером", why:"Без DNS сайт не откроется", recommended:"A-запись на IP сервера", content:"В панели регистратора: A-запись → IP.", tradeoffs:"CNAME для поддоменов", whenNotUse:"На конструкторе авто", mistakes:"Забыть www", difficulty:"easy", xp:15, time:"15 мин", pt:"Настроить DNS", pp:"Помоги настроить DNS для домена. A-запись. Инструкция для reg.ru." },
      { title:"Выпустить SSL", slug:"setup-ssl", problem:"HTTPS обязателен", why:"Без SSL — Небезопасно", recommended:"Let's Encrypt через ISPmanager", content:"ISPmanager → SSL → Let's Encrypt.", tradeoffs:"Платный SSL для гарантии", whenNotUse:"На localhost", mistakes:"Забыть продлить", difficulty:"easy", xp:15, time:"15 мин", pt:"Получить SSL", pp:"Помоги получить SSL-сертификат через ISPmanager. Пошагово." },
      { title:"Запустить сайт", slug:"launch-site", problem:"Выложить в интернет", why:"localhost видит только разработчик", recommended:"PM2 + Nginx + GitHub", content:"npm run build → pm2 start → nginx.", tradeoffs:"Vercel проще но дороже", whenNotUse:"На этапе разработки", mistakes:"Забыть .env на сервере", difficulty:"hard", xp:40, time:"1 час", pt:"Задеплоить сайт", pp:"Помоги задеплоить Next.js на VPS. PM2, Nginx, SSL." },
    ]},
    { title:"SEO", slug:"seo", icon:"Search", desc:"Мета-теги, карта сайта", decisions:[
      { title:"Заполнить Meta-теги", slug:"meta-tags", problem:"Как выглядит в поиске", why:"Title и Description — лицо в Яндексе", recommended:"Title 50-70, Description 120-160", content:"export const metadata = { title, description }", tradeoffs:"react-helmet для CSR", whenNotUse:"Закрытый сайт", mistakes:"Одинаковый Title", difficulty:"easy", xp:15, time:"20 мин", pt:"Заполнить Meta-теги", pp:"Напиши Title и Description для 5 страниц сайта компании." },
      { title:"Создать Sitemap", slug:"create-sitemap", problem:"Карта для поисковиков", why:"Sitemap ускоряет индексацию", recommended:"next-sitemap пакет", content:"npm i next-sitemap → конфиг → build", tradeoffs:"Ручной sitemap.xml", whenNotUse:"1 страница", mistakes:"Не добавить в robots.txt", difficulty:"easy", xp:15, time:"15 мин", pt:"Создать Sitemap", pp:"Помоги создать sitemap.xml для Next.js. С кодом." },
    ]},
    { title:"Аналитика", slug:"analytics", icon:"BarChart", desc:"Метрика, Вебмастер", decisions:[
      { title:"Подключить Метрику", slug:"yandex-metrika", problem:"Сколько людей на сайте", why:"Метрика — посещаемость, источники", recommended:"Скрипт в layout.tsx", content:"metrika.yandex.ru → код → <Script>", tradeoffs:"Google Analytics", whenNotUse:"Не для клиентов", mistakes:"Забыть вебвизор", difficulty:"easy", xp:15, time:"15 мин", pt:"Подключить Метрику", pp:"Помоги подключить Яндекс.Метрику к Next.js. Код для layout.tsx." },
      { title:"Добавить в Вебмастер", slug:"yandex-webmaster", problem:"Яндекс должен знать о сайте", why:"Вебмастер — диагностика индексации", recommended:"Подтвердить через DNS", content:"webmaster.yandex.ru → Добавить → Подтвердить", tradeoffs:"Google Search Console", whenNotUse:"На разработке", mistakes:"Не подтвердить права", difficulty:"easy", xp:15, time:"15 мин", pt:"Добавить в Вебмастер", pp:"Помоги добавить сайт в Яндекс.Вебмастер." },
    ]},
    { title:"Право", slug:"legal", icon:"Shield", desc:"Политика, куки", decisions:[
      { title:"Политика конфиденциальности", slug:"privacy-policy", problem:"152-ФЗ о персональных данных", why:"Обязательный документ", recommended:"Шаблон + адаптация", content:"Страница /privacy. Кто, какие данные, зачем.", tradeoffs:"Юрист проверит лучше", whenNotUse:"Без форм и сбора", mistakes:"Копировать чужую", difficulty:"medium", xp:20, time:"30 мин", pt:"Политика конфиденциальности", pp:"Напиши Политику конфиденциальности для сайта. Шаблон на русском." },
      { title:"Cookie-баннер", slug:"cookie-banner", problem:"Предупредить о cookies", why:"Закон + хороший тон", recommended:"react-cookie-consent", content:"npm i react-cookie-consent → компонент", tradeoffs:"Свой баннер", whenNotUse:"Без cookies", mistakes:"Блокировать сайт", difficulty:"easy", xp:10, time:"10 мин", pt:"Cookie-баннер", pp:"Помоги добавить cookie-баннер на Next.js. Простой, ненавязчивый." },
    ]},
    { title:"Telegram", slug:"telegram", icon:"Send", desc:"Бот и связь", decisions:[
      { title:"Создать бота", slug:"create-bot", problem:"Клиенты → компания", why:"Telegram — главный мессенджер РФ", recommended:"@BotFather → /newbot", content:"Напишите @BotFather. /newbot → имя → токен.", tradeoffs:"WhatsApp API", whenNotUse:"Достаточно формы", mistakes:"Потерять токен", difficulty:"easy", xp:15, time:"15 мин", pt:"Создать бота", pp:"Помоги создать Telegram бота. Пошаговая инструкция." },
    ]},
    { title:"Поддержка", slug:"support", icon:"Heart", desc:"Обновления, бэкапы", decisions:[
      { title:"План обновлений", slug:"update-plan", problem:"Сайт устаревает", why:"Зависимости, контент, безопасность", recommended:"1-е число: npm update", content:"Календарь: ежемесячно — npm, еженедельно — бэкап.", tradeoffs:"Dependabot на GitHub", whenNotUse:"Статичный сайт", mistakes:"Обновлять всё без теста", difficulty:"easy", xp:10, time:"10 мин", pt:"План обновлений", pp:"Помоги составить план обновлений сайта." },
    ]},
  ];

  let totalDecisions = 0;
  for (let i = 0; i < stagesData.length; i++) {
    const s = stagesData[i];
    const stage = await p.stage.create({ data: { title: s.title, slug: s.slug, icon: s.icon, emoji: s.emoji, description: s.desc, sortOrder: i + 1 } });
    await p.blueprintStage.create({ data: { blueprintId: bp.id, stageId: stage.id, sortOrder: i + 1 } });
    for (let j = 0; j < s.decisions.length; j++) {
      const d = s.decisions[j];
      await p.decision.create({ data: { stageId: stage.id, title: d.title, slug: d.slug, problem: d.problem, why: d.why, recommended: d.recommended, content: d.content, tradeoffs: d.tradeoffs, whenNotUse: d.whenNotUse, mistakes: d.mistakes, difficulty: d.difficulty, xpReward: d.xp, timeEstimate: d.time, promptTitle: d.pt, promptTemplate: d.pp, sortOrder: j + 1 } });
      totalDecisions++;
    }
  }

  const totalXp = stagesData.reduce((s, st) => s + st.decisions.reduce((ss, d) => ss + d.xp, 0), 0);
  await p.blueprint.update({ where: { id: bp.id }, data: { totalXp, totalDecisions } });
  console.log("Seeded:", stagesData.length, "stages,", totalDecisions, "decisions,", totalXp, "XP");
  await p.$disconnect();
}

seed().catch(e => { console.error(e.message); process.exit(1); });
