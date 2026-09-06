import type { GuidedReference, GuidedStep } from "./guided-data";
import { makePlatipomiruStep } from "./platipomiru";

const cursorRef: GuidedReference = {
  kind: "Инструмент",
  label: "Cursor",
  href: "/ai-tools/cursor",
  description: "AI-редактор: основной путь ProektMap",
};

const reasonixRef: GuidedReference = {
  kind: "Инструмент",
  label: "Reasonix",
  href: "/arsenal/tools/reasonix",
  description: "Open-source агент под DeepSeek в Нейро каталоге",
};

const opencodeRef: GuidedReference = {
  kind: "Инструмент",
  label: "OpenCode",
  href: "/arsenal/tools/opencode",
  description: "Открытый кодинг-агент в Нейро каталоге",
};

const agentEngRef: GuidedReference = {
  kind: "Паттерн",
  label: "Инженерия агентов",
  href: "/agent-engineering",
  description: "Harness → Loop → Graph: как строить окружение и общение с агентом",
};

const rfRef: GuidedReference = {
  kind: "Инструмент",
  label: "AI без VPN",
  href: "/ai-without-vpn",
  description: "Что доступно из РФ без VPN и как оплачивать западные сервисы",
};

const hostingRef: GuidedReference = {
  kind: "Инструмент",
  label: "Российский хостинг",
  href: "/ai-without-vpn",
  description: "VPS/хостинг в РФ: когда нужен SSH и что ставить на сервер",
};

export type WorkspaceSetupOptions = {
  /** Docker нужен для локальной PostgreSQL (SaaS). Для лендинга/бота можно false. */
  includeDocker?: boolean;
};

export type LocalVsSshMode = {
  pros: string[];
  cons: string[];
};

/** Сравнение режимов на каждом этапе маршрута /resheniya */
export type LocalVsSshStage = {
  id: string;
  stage: string;
  when: string;
  recommend: "local" | "ssh" | "both";
  recommendLabel: string;
  local: LocalVsSshMode;
  ssh: LocalVsSshMode;
};

export const LOCAL_VS_SSH_STAGES: LocalVsSshStage[] = [
  {
    id: "learn-setup",
    stage: "Старт и установка",
    when: "Оплата Cursor, установка Node/Git, первые настройки",
    recommend: "local",
    recommendLabel: "Только локально",
    local: {
      pros: [
        "Всё видно на своём экране: установщики, папки, ошибки",
        "Cursor Agent читает файлы на диске целиком",
        "Нет риска сломать чужой/боевой сервер",
      ],
      cons: [
        "Нужен свой ПК (Windows 11) и место на диске",
        "Docker Desktop иногда тяжёлый для слабых ноутбуков",
      ],
    },
    ssh: {
      pros: ["Сервер уже «в интернете» — кажется, что быстрее до сайта"],
      cons: [
        "Новичок путает терминал сервера и свой ПК",
        "Сложнее ставить Cursor/смотреть UI на localhost",
        "Ошибка установки может оставить сервер в полумёртвом виде",
      ],
    },
  },
  {
    id: "build",
    stage: "Сборка проекта с AI",
    when: "Пишете код, Skills, AGENTS.md, правки Agent",
    recommend: "local",
    recommendLabel: "Только локально",
    local: {
      pros: [
        "Быстрый цикл: правка → сохранить → увидеть результат",
        "Git-история под рукой, легко откатиться",
        "Секреты (.env) остаются на компьютере, не на «голом» VPS",
      ],
      cons: [
        "Сайт пока виден только вам (localhost)",
        "Нужен интернет для моделей Cursor",
      ],
    },
    ssh: {
      pros: ["Можно править файлы прямо на сервере одной командой"],
      cons: [
        "Agent хуже «видит» проект через тонкий SSH без нормальной папки",
        "Легко затереть рабочий код без локальной копии",
        "Медленнее и дороже по нервам при каждой ошибке",
      ],
    },
  },
  {
    id: "check",
    stage: "Проверка результата",
    when: "localhost, формы, бот локально, смоук-тесты до публикации",
    recommend: "local",
    recommendLabel: "Только локально",
    local: {
      pros: [
        "http://localhost — мгновенная проверка без домена",
        "Ломаете только свою копию, живой сайт цел",
        "Удобно показывать другу экран / скрин, пока не купили VPS",
      ],
      cons: [
        "Друг из другого города не откроет ваш localhost без туннеля",
        "Прод-окружение (HTTPS, домен) ещё не проверено",
      ],
    },
    ssh: {
      pros: ["Сразу проверяете на реальном IP/домене"],
      cons: [
        "Каждый баг виден «в бою» или на полупустом сервере",
        "Нет спокойного черновика — правки сразу на удалённой машине",
      ],
    },
  },
  {
    id: "deploy",
    stage: "Публикация (Deploy)",
    when: "Выкладка на VPS: Nginx, PM2, домен, HTTPS",
    recommend: "both",
    recommendLabel: "Локально собрали → SSH выложили",
    local: {
      pros: [
        "Перед выкладкой уже есть работающий билд и Git",
        "Можно повторно собрать и проверить, если деплой упал",
      ],
      cons: [
        "Одного localhost мало — сайт ещё не в интернете",
        "Нужен отдельный шаг: купить VPS и настроить сервер",
      ],
    },
    ssh: {
      pros: [
        "Именно здесь SSH нужен: залить код, nginx, pm2, сертификат",
        "Сайт получают по ссылке с любого устройства",
      ],
      cons: [
        "Без локальной проверки легко выкатить сломанную версию",
        "Нужны IP, пользователь, ключ/пароль и аккуратность с root",
      ],
    },
  },
  {
    id: "maintain",
    stage: "Поддержка живого сайта",
    when: "Правки после запуска, логи, рестарт, мелкие hotfix",
    recommend: "both",
    recommendLabel: "Крупное — локально, срочное — SSH",
    local: {
      pros: [
        "Большие фичи снова делаете на ПК, потом деплой",
        "Меньше шансов «починить прод вслепую»",
      ],
      cons: [
        "На каждую мелочь нужен полный цикл commit → deploy",
        "Без доступа к серверу не увидите прод-логи",
      ],
    },
    ssh: {
      pros: [
        "Быстрый взгляд в логи, pm2 restart, проверка места на диске",
        "Срочный hotfix, когда сайт лежит прямо сейчас",
      ],
      cons: [
        "Править прод руками без бэкапа — риск потерять сайт",
        "Легко забыть, что меняли на сервере, и разъехаться с Git",
      ],
    },
  },
];

/**
 * Шаг №2 всех маршрутов: где работать (локально vs SSH), установка, VPN/риски.
 * Идёт сразу после «Оплата из РФ» — до первой проектной команды.
 */
export function makeBeginnerWorkspaceStep(options: WorkspaceSetupOptions = {}): GuidedStep {
  const includeDocker = options.includeDocker ?? true;

  const installInstructions: GuidedStep["instructions"] = [
    {
      title: "Убедитесь, что оплата Cursor уже закрыта",
      text: "Шаг «Оплата из РФ» должен быть пройден: карта Плати по миру, вход в Cursor через свой GitHub, Pro в Billing. До этого не запускайте Agent и не копируйте команды проекта — агент упрётся в billing.",
    },
    {
      title: "Сверьтесь с таблицами: инструмент, локально/SSH, как писать агенту",
      text: "На карточке шага три блока. 1) Cursor / Reasonix / OpenCode. 2) Локально или SSH по этапам. 3) Мост Harness → Loop → Graph — как общаться с агентом (плохо→хорошо) со ссылкой на /agent-engineering.",
    },
    {
      title: "Скачайте и установите Cursor (основной путь)",
      text: "Откройте cursor.com → Download для Windows. Установите .exe. Войдите Sign in with GitHub (тот же аккаунт, что на шаге оплаты). VPN обычно не нужен. Не ставьте «крякнутый» Cursor.",
      command: "https://cursor.com",
    },
    {
      title: "По желанию: Reasonix (DeepSeek) или OpenCode",
      text: "Если смотрите альтернативы из таблицы: Reasonix — open-source агент под DeepSeek (reasonix.io). OpenCode — открытый агент (opencode.ai; на Windows удобнее WSL или scoop). Маршруты /resheniya всё равно описаны под Cursor — альтернативы берите осознанно.",
      command: "https://reasonix.io",
    },
    {
      title: "Установите Node.js LTS",
      text: "Скачайте LTS с nodejs.org (кнопка зелёная LTS). VPN не нужен. После установки закройте и снова откройте Cursor (чтобы терминал увидел node).",
      command: "https://nodejs.org",
    },
    {
      title: "Установите Git",
      text: "Скачайте Git for Windows с git-scm.com. В установщике можно оставить галочки по умолчанию. VPN не нужен. GitHub.com из РФ работает без VPN.",
      command: "https://git-scm.com/download/win",
    },
  ];

  if (includeDocker) {
    installInstructions.push({
      title: "Установите Docker Desktop (для локальной базы)",
      text: "Нужен, чтобы PostgreSQL крутился одинаково на любом ПК. Скачайте Docker Desktop for Windows, дождитесь статуса Running. Если пока сложно — вернитесь на шаге «База данных».",
      command: "https://www.docker.com/products/docker-desktop/",
    });
  }

  installInstructions.push(
    {
      title: "Проверьте окружение в терминале",
      text: "В Cursor (или своём терминале): Ctrl+`. Команды должны показать версии без «не является внутренней или внешней командой».",
      command: includeDocker
        ? "node --version && npm --version && git --version && docker --version"
        : "node --version && npm --version && git --version",
    },
    {
      title: "Подготовьтесь к SSH заранее — но не подключайтесь сейчас",
      text: "Когда дойдёте до Deploy, понадобятся: VPS (Beget/Timeweb), IP, пользователь, пароль или ключ, команда ssh user@IP. Сейчас достаточно проверить, что клиент есть (ssh -V).",
      command: "ssh -V",
    },
  );

  const success = [
    "Понятны Cursor / Reasonix / OpenCode и локально vs SSH",
    "Понятны Harness → Loop → Graph как способ писать агенту",
    "Выбран основной инструмент (рекомендуем Cursor) и он установлен",
    "В терминале видны версии node, npm и git",
  ];
  if (includeDocker) {
    success.push("Docker Desktop запущен или отложен осознанно до шага с БД");
  } else {
    success.push("Понятно, что сервер/SSH не нужны до публикации");
  }

  return {
    slug: "workspace",
    shortTitle: "Где работать",
    title: "Где работать с AI и как подготовить компьютер",
    duration: includeDocker ? "30–45 минут" : "25–40 минут",
    goal: "Понятны инструмент, режим локально/SSH и мост Harness→Loop→Graph; базовые программы установлены.",
    recommendation: {
      title: "Cursor локально + общение через Harness → Loop → Graph",
      why: "Сначала место и инструмент, затем язык общения с агентом. Полный трек — на /agent-engineering; здесь только мост с примерами плохо/хорошо.",
      link: agentEngRef,
    },
    explanation:
      "Сравните платформы и режим работы, прочитайте мост «как писать агенту», затем поставьте стек на ПК. Оплата Cursor — на предыдущем шаге через Плати по миру.",
    instructions: installInstructions,
    prompt: {
      title: "Плохо → хорошо (инструмент + общение)",
      body: `Плохо:
«Поставлю всё и напишу агенту: сделай нормально» — нет рамки, нет проверки, нет границ.

Хорошо:
1) Cursor (или осознанная альтернатива) локально
2) Harness: ссылка на AGENTS.md и запреты
3) Loop: DoD + лимит попыток + проверка
4) Graph: сначала связи, потом правки; skills не переписывать без «да»
5) Node + Git установлены; SSH — на Deploy

Почему: инструмент без языка общения с агентом = хаос; мост в /agent-engineering даёт опоры.`,
    },
    success,
    artifact: "Выбранная платформа + карта локально/SSH + мост Harness/Loop/Graph",
    terms: ["Cursor", "Reasonix", "OpenCode", "Harness", "Loop", "Graph", "AGENTS.md", "SSH", "Deploy"],
    references: [cursorRef, reasonixRef, opencodeRef, agentEngRef, rfRef, hostingRef],
  };
}

const ONBOARDING_REPLACE_SLUGS = new Set(["pay-from-russia", "workspace"]);

/**
 * Вставляет шаг оплаты и шаг «Где работать» первыми; старый тонкий workspace заменяется.
 */
export function withResheniyaOnboardingFirst(
  steps: GuidedStep[],
  options: WorkspaceSetupOptions = {},
): GuidedStep[] {
  const rest = steps.filter((s) => !ONBOARDING_REPLACE_SLUGS.has(s.slug));
  return [makePlatipomiruStep(), makeBeginnerWorkspaceStep(options), ...rest];
}
