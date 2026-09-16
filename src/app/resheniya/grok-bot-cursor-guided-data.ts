import type { GuidedReference, GuidedSolution } from "./guided-data";
import { withResheniyaOnboardingFirst } from "./workspace-setup";
import { TEMPLATES } from "@/lib/agent-engineering/grok-bot-data";

const ref = (
  kind: GuidedReference["kind"],
  label: string,
  href: string,
  description: string,
): GuidedReference => ({ kind, label, href, description });

const grokManualRef = ref(
  "Паттерн",
  "Мануал Grok Bot",
  "/agent-engineering/grok-bot",
  "Русский мануал: устав, skills, routines, лестница доверия",
);
const harnessRef = ref("Паттерн", "Harness", "/agent-engineering/harness", "Каркас: закон проекта, skills, права");
const loopRef = ref("Паттерн", "Loop", "/agent-engineering/loop", "Цикл с проверкой и Definition of Done");
const graphRef = ref("Паттерн", "Graph", "/agent-engineering/graph", "Узкие роли и карта связей, не флот без владельца");
const cursorRef = ref("Инструмент", "Cursor", "/ai-tools/cursor", "Внутренний контур: код, diff, PR");
const vibeRef = ref("Инструмент", "Агент-кодер", "/arsenal/vibe-coder", "Стек вайбкодинга в Нейро каталоге");
const mcpRef = ref("Инструмент", "Агенты и скиллы", "/arsenal/mcp-agents", "Skills, MCP, рабочий контур");
const skillsRef = ref("Skill", "AI Skills", "/ai-skills", "Skills Cursor, которые часто подхватывает Grok Bot");
const noVpnRef = ref("Инструмент", "AI без VPN", "/ai-without-vpn", "Оплата и доступ из РФ без серых схем");
const glossaryRef = ref("Термин", "Глоссарий", "/glossary", "Термины: агент, skill, harness");

const PRODUCER_CHARTER = `Имя: Продюсер
Должность: Брифы для Cursor Cloud Agent
Описание:
Владею результатом: бриф для Cursor (цель, файлы, Definition of Done, запреты, список непроверенного).
Источники только: этот чат и то, что человек явно указал. Если источника нет — пишу «нет данных», не подставляю память.
Формат выхода: Цель / Не делать / Файлы / DoD / Как проверить / Не проверил.
Всегда: ссылка или пометка «не проверил».
Никогда: письма людям, покупки, удаление, публикация, прод, PR, обещание цены, код в репозитории.
Стоп и эскалация мне: отправка наружу, деньги, прод, удаление, открытие PR.
Не создаю routine, пока человек не подтвердил, что формат брифа верный.
Код сам не пишу.`;

export const GROK_CURSOR_HOW_TO_WRITE = [
  {
    title: "Роли контура",
    bad: "Grok Bot, сделай фичу в репозитории, заодно разбери почту и опубликуй пост.",
    good: `Ты внешний продюсер. Собери бриф: цель, файлы, Definition of Done, запреты (.env, prisma db push --force-reset). Код не пиши. PR не открывай. Покажи бриф мне.`,
    why: "Без границы бот и пишет людям, и пушит в прод из грязного контекста.",
  },
  {
    title: "Передача в Cursor",
    bad: "Вот Slack и Notion, сам разберись и сразу открой PR.",
    good: `Собери промпт для Cursor Cloud Agent: цель одним абзацем, файлы, запреты, DoD, как проверить. Покажи мне. После ОК отдай Cursor. Код сам не пиши. PR без моего «да» не открывай.`,
    why: "Грязный контекст разведки не должен попадать в кодер до чистого заказа.",
  },
] as const;

const taskTemplate = TEMPLATES.find((t) => t.id === "task")!.text;
const skillTemplate = TEMPLATES.find((t) => t.id === "skill")!.text;
const outerLoopTemplate = TEMPLATES.find((t) => t.id === "outer-loop")!.text;
const routineTemplate = TEMPLATES.find((t) => t.id === "routine")!.text;

export const guidedGrokBotCursorSolution: GuidedSolution = {
  slug: "grok-bot-cursor",
  title: "Собрать контур Grok Bot → Cursor",
  subtitle: "Внешний продюсер собирает бриф, внутренний агент пишет код",
  result:
    "В Cursor открыт Grok Bot-продюсер с уставом. Он один раз собрал бриф на конкретную правку, сохранил метод как skill и отдал готовый промпт Cursor Cloud Agent. Код и PR без вашего ОК не уходят. В чате бота лежит артефакт: бриф со ссылками и список того, что не проверено.",
  duration: "2–4 часа",
  defaultStack: [
    "Плати по миру → оплата Cursor из РФ",
    "Cursor локально (Grok Bot внутри приложения)",
    "Grok Bot — внешний контур: почта, Notion, Slack, бриф",
    "Cursor Cloud Agent — внутренний контур: репозиторий, diff, тесты",
    "Один skill «Бриф для Cursor» + стоп на PR",
    "Мануал /agent-engineering/grok-bot",
  ],
  steps: withResheniyaOnboardingFirst(
    [
      {
        slug: "split-loops",
        shortTitle: "Два контура",
        title: "Разделяем внешний и внутренний контур",
        duration: "10–15 минут",
        goal: "Зафиксировано: Grok Bot собирает бриф, Cursor меняет репозиторий. Один бот не делает всё сразу.",
        recommendation: {
          title: "Grok Bot снаружи, Cursor внутри",
          why: "Если один агент и читает Slack, и сразу правит код, в кодер попадает грязный контекст. Официальный рабочий приём: внешний контур готовит заказ, внутренний выполняет его в репозитории.",
          link: grokManualRef,
        },
        explanation:
          "Grok Bot — не чат Grok и не Grok Build. Это коллега с облачным компьютером. Cursor-агент видит ваш код. Смешать их в одну простыню — типичная ошибка вайбкодера.",
        instructions: [
          {
            title: "Откройте мануал",
            text: "Прочитайте блоки «Не путать продукты» и схему внешнего/внутреннего контура.",
          },
          {
            title: "Назовите роли вслух",
            text: "Продюсер: источники и бриф. Кодер: файлы, diff, проверка. Продюсер не пушит. Кодер не ходит в почту.",
          },
          {
            title: "Запомните лестницу",
            text: "Сначала один ручной прогон, потом skill, потом routine. Второй бот — только если нужен другой контур прав.",
          },
        ],
        prompt: {
          title: "Плохо → хорошо (роли)",
          body: `Плохо:
«Grok Bot, сделай фичу в репозитории, заодно разбери почту и опубликуй пост.»

Хорошо:
«Ты внешний продюсер. Собери бриф: цель, файлы, Definition of Done, запреты (.env, prisma db push --force-reset). Код не пиши. PR не открывай. Покажи бриф мне.»

Почему: без границы бот и пишет людям, и пушит в прод из грязного контекста.`,
        },
        success: [
          "Названа разница Grok Bot / Cursor / чат / Grok Build",
          "Понятно, что код пишет внутренний контур",
          "Лестница задача → skill → routine известна до автоматизации",
        ],
        artifact: "Правило двух контуров в голове (и в следующем уставе бота)",
        terms: ["Grok Bot", "Cursor", "внешний контур", "внутренний контур", "skill"],
        references: [grokManualRef, harnessRef, loopRef, cursorRef],
      },
      {
        slug: "grok-access",
        shortTitle: "Доступ",
        title: "Проверяем, что Grok Bot открывается в Cursor",
        duration: "10–20 минут",
        goal: "В приложении Cursor открыт Grok Bot. Если пункта нет — маршрут останавливается честно, без обходов.",
        recommendation: {
          title: "Ищем Grok Bot внутри оплаченного Cursor",
          why: "Отдельной подписки «только Grok Bot» обычно нет. Это не чат grok.com. Тарифы меняются — смотрите свой аккаунт. xAI может ограничивать Россию: серые схемы на ProektMap не входят в маршрут.",
          link: noVpnRef,
        },
        explanation:
          "Оплата Cursor из РФ — на шаге «Плати по миру». Здесь только проверка: бот есть или нет. Нет бота — не выдумывайте VPN и чужие карты, вернитесь к мануалу как к теории.",
        instructions: [
          {
            title: "Откройте Cursor",
            text: "Тот же аккаунт, которым оплачивали Pro. Ищите Grok Bot / Bots в боковой панели приложения, не на grok.com.",
          },
          {
            title: "Создайте бота или откройте существующего",
            text: "New → Create new agent / Bot. Имя пока любое — устав зададим на следующем шаге.",
          },
          {
            title: "Если пункта нет",
            text: "Остановитесь. Запишите «Grok Bot в аккаунте недоступен». Дальше по этому маршруту не идите и не ищите обход.",
          },
        ],
        prompt: {
          title: "Первое сообщение боту",
          body: `Не выполняй работу. Ответь тремя строками:
1) Ты Grok Bot с облачным компьютером, не чат grok.com.
2) Код репозитория сам не пишешь, пока я не отдам задачу Cursor.
3) Ждёшь устав на следующем шаге.

Если ты другой продукт — так и скажи.`,
        },
        success: [
          "Grok Bot открыт в Cursor либо зафиксирован отказ доступа",
          "Понятно, что это не grok.com",
          "Серые схемы доступа не используются",
        ],
        artifact: "Открытый Grok Bot или честная остановка",
        terms: ["Cursor Pro", "Grok Bot", "SuperGrok"],
        references: [cursorRef, noVpnRef, grokManualRef],
      },
      {
        slug: "charter",
        shortTitle: "Устав",
        title: "Пишем устав продюсера",
        duration: "15–25 минут",
        goal: "В описании бота лежит закон: один контур, формат брифа, запрет писем/покупок/PR.",
        recommendation: {
          title: "Описание бота = Harness, сообщение = текущая задача",
          why: "Расплывчатый «помощник» начинает помогать везде. Устав держит роль между сессиями. Сообщение не заменяет описание.",
          link: harnessRef,
        },
        explanation:
          "Три поля: имя, должность, описание. Имя короткое. Должность — один контур. Описание — всегда / никогда / стоп.",
        instructions: [
          {
            title: "Имя и должность",
            text: "Имя: Продюсер. Должность: Брифы для Cursor Cloud Agent.",
          },
          {
            title: "Вставьте устав в описание",
            text: "Скопируйте шаблон ниже. Квадратные скобки замените только если контур другой; для этого маршрута оставьте бриф → Cursor.",
          },
          {
            title: "Проверьте стоп",
            text: "В описании явно: не писать людям, не покупать, не пушить, не открывать PR без ОК.",
          },
        ],
        prompt: {
          title: "Устав бота-продюсера",
          body: PRODUCER_CHARTER,
        },
        success: [
          "В профиле бота заполнены имя, должность, описание",
          "Есть запрет отправки наружу, денег и PR",
          "Понятно, какой артефакт бот всегда возвращает",
        ],
        artifact: "Сохранённый профиль Grok Bot-продюсера",
        terms: ["Harness", "устав бота", "allow/deny"],
        references: [grokManualRef, harnessRef, skillsRef, glossaryRef],
      },
      {
        slug: "first-task",
        shortTitle: "Один прогон",
        title: "Собираем бриф руками, без skill и routine",
        duration: "20–40 минут",
        goal: "В чате бота лежит бриф на страницу FAQ: цель, файлы, DoD, запреты, список непроверенного. Код ещё не писали.",
        recommendation: {
          title: "Одна конкретная правка: страница FAQ",
          why: "«Наведи порядок в проекте» не имеет конца. FAQ из трёх вопросов видно глазами. Автоматизацию ставим только после удачного формата.",
          link: loopRef,
        },
        explanation:
          "Задача по умолчанию для этого маршрута: бриф на страницу FAQ с тремя вопросами на существующем сайте в Cursor. Если репозитория ещё нет — бот всё равно собирает бриф, а код подождёт шага передачи.",
        instructions: [
          {
            title: "Вставьте контракт задачи",
            text: "Одним сообщением, без просьбы сохранить skill.",
          },
          {
            title: "Дождитесь артефакта",
            text: "Бриф: цель, что не делать, файлы, Definition of Done, как проверить. Каждое утверждение — со ссылкой или пометкой «не проверил».",
          },
          {
            title: "Поправьте формат",
            text: "Если бот полез в код или пообещал публикацию — верните к уставу и повторите один раз.",
          },
        ],
        prompt: {
          title: "Контракт задачи: бриф на FAQ",
          body: `${taskTemplate}

Конкретная задача этого шага:
Собери бриф для Cursor Cloud Agent на страницу FAQ из трёх вопросов (что такое маршрут, сколько занимает, как проверить).
Сайт: текущий репозиторий, который откроет Cursor.
Не пиши код. Не создавай skill. Не ставь routine. Не открывай PR.
Верни бриф и список того, чего не видел своими глазами.`,
        },
        success: [
          "Бриф лежит в чате бота",
          "В брифе есть DoD и запреты",
          "Код и PR на этом шаге не появлялись",
        ],
        artifact: "Бриф на FAQ в чате Grok Bot",
        terms: ["Definition of Done", "артефакт", "Loop"],
        references: [loopRef, grokManualRef, vibeRef],
      },
      {
        slug: "save-skill",
        shortTitle: "Skill",
        title: "Сохраняем метод как skill",
        duration: "10–20 минут",
        goal: "Есть skill «Бриф для Cursor»: когда включать, входы, шаги, проверка, стоп на PR.",
        recommendation: {
          title: "Skill после удачного прогона, не вместо него",
          why: "«Запомни, как мы делали» — снова расплывчатый промпт. Skill называет триггер, формат и запреты. Его можно вызвать через /.",
          link: skillsRef,
        },
        explanation:
          "Плагин (Gmail, Notion, GitHub) — куда ходить. Skill — как работать. Cursor skills часто подхватываются Grok Bot без переписывания.",
        instructions: [
          {
            title: "Вставьте компилятор skill",
            text: "В тот же чат, где получился бриф.",
          },
          {
            title: "Проверьте черновик",
            text: "В skill есть: когда включать, входы, шаги, как проверить, что требует ОК. Нет права публиковать и пушить.",
          },
          {
            title: "Вызовите через /",
            text: "В новом сообщении наберите / и убедитесь, что skill виден. Если нет — Settings → Plugins → Yours, включите для этого бота.",
          },
        ],
        prompt: {
          title: "Компилятор skill",
          body: `${skillTemplate}

Название: Бриф для Cursor.
Когда включать: человек просит фичу, правку или страницу, но код ещё не писали.
Стоп: не писать код, не открывать PR, не слать письма, не покупать.`,
        },
        success: [
          "Skill «Бриф для Cursor» сохранён",
          "Его можно выбрать через /",
          "В тексте skill есть стоп на PR",
        ],
        artifact: "Skill «Бриф для Cursor»",
        terms: ["skill", "плагин", "Teach a task"],
        references: [skillsRef, mcpRef, grokManualRef],
      },
      {
        slug: "handoff",
        shortTitle: "Передача",
        title: "Отдаём чистый промпт Cursor Cloud Agent",
        duration: "20–40 минут",
        goal: "Cursor получил бриф, внёс правку FAQ или показал diff. PR без вашего ОК не открыт.",
        recommendation: {
          title: "Продюсер готовит промпт, кодер исполняет",
          why: "Так грязный контекст разведки не попадает в репозиторий. Вы видите заказ целиком до того, как агент трогает файлы.",
          link: cursorRef,
        },
        explanation:
          "Сначала покажите промпт себе. После ОК — запуск Cursor Cloud Agent. Локальный агент в чате Cursor тоже подходит, если Cloud Agent недоступен: тот же бриф, те же запреты.",
        instructions: [
          {
            title: "Попросите продюсера собрать промпт для кодера",
            text: "Используйте шаблон внешнего контура. Не разрешайте боту самому коммитить.",
          },
          {
            title: "Прочитайте промпт",
            text: "Должны быть цель, файлы, запрет .env и force-reset, DoD, «не коммитить без ОК».",
          },
          {
            title: "Отдайте Cursor",
            text: "Cloud Agent или агент в репозитории. Проверьте diff. PR и push — только после вашего явного «да».",
          },
        ],
        prompt: {
          title: "Внешний контур → Cursor",
          body: `${outerLoopTemplate}

Дополнительно для FAQ:
- три вопроса и короткие ответы на русском;
- страница в маршруте сайта, не сирота;
- после правки назвать URL для проверки.`,
        },
        success: [
          "Промпт для Cursor показан до запуска кодера",
          "Есть diff или страница FAQ",
          "PR/push не ушли без вашего ОК",
        ],
        artifact: "Diff или страница FAQ + запрет несанкционированного PR",
        terms: ["Cursor Cloud Agent", "diff", "PR"],
        references: [cursorRef, vibeRef, loopRef, grokManualRef],
      },
      {
        slug: "freeze-or-routine",
        shortTitle: "Стоп",
        title: "Замораживаем метод. Routine — только после теста",
        duration: "10–15 минут",
        goal: "Решение: либо оставляем skill по запросу, либо ставим узкую routine после Test run. Второго бота нет «на всякий случай».",
        recommendation: {
          title: "Не ставьте расписание, пока формат брифа не зелёный",
          why: "Routine делает реальную работу. Широкий слушатель «каждое сообщение» жрёт лимит и действует вхолостую. Второй бот нужен только при другом источнике или другом контуре прав.",
          link: graphRef,
        },
        explanation:
          "Финиш маршрута — не флот из пяти ботов. Финиш: продюсер с уставом, skill, один успешный handoff в Cursor, явное решение про routine.",
        instructions: [
          {
            title: "Если формат ещё плавает",
            text: "Не создавайте routine. Вызывайте skill вручную через /.",
          },
          {
            title: "Если формат стабилен",
            text: "Одна узкая routine: например будни 10:00, только skill «Бриф для Cursor», результат в этот чат, без писем и PR. Сначала Test run.",
          },
          {
            title: "Не плодите ботов",
            text: "Второй бот — только критик или другой источник. Все боты аккаунта делят один компьютер: логин не сейф.",
          },
        ],
        prompt: {
          title: "Компилятор routine (только если skill стабилен)",
          body: routineTemplate,
        },
        success: [
          "Принято решение: ручной skill или одна узкая routine",
          "Нет флота ботов без владельца этапа",
          "Понятно, что все боты делят один компьютер",
        ],
        artifact: "Рабочий контур: устав + skill + handoff в Cursor (+ опционально routine после теста)",
        terms: ["routine", "общий компьютер", "Graph"],
        references: [graphRef, grokManualRef, mcpRef],
      },
    ],
    { includeDocker: false },
  ),
};
