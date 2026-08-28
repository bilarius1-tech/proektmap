export type CapabilityDomainId = "ship" | "product" | "ai" | "arch" | "ui";

export interface CapabilityDomain {
  id: CapabilityDomainId;
  name: string;
  nameEn: string;
  shortDesc: string;
  color: string;
  score: number; // 0-100 strength representation
  skillsCount: number;
  masteredCount: number;
}

export interface SkillLevelInfo {
  level: "L1" | "L2" | "L3";
  name: string;
  summary: string;
  criteria: string[];
}

export interface SkillGlossaryLink {
  term: string;
  english?: string;
  slug?: string;
  explanation: string;
}

export interface SkillPromptTemplate {
  title: string;
  description: string;
  prompt: string;
}

export interface CapabilitySkill {
  id: string;
  slug: string;
  title: string;
  domainId: CapabilityDomainId;
  domainName: string;
  level: "L1" | "L2" | "L3";
  levelName: string;
  status: "mastered" | "in_focus" | "recommended" | "base";
  power: string; // В чем сила создателя
  fullDescription: string;
  levels: SkillLevelInfo[];
  glossaryTerms: SkillGlossaryLink[];
  prompts?: SkillPromptTemplate[];
  commands?: string[];
  proofOfWork?: {
    projectName: string;
    projectUrl: string;
    artifact: string;
    verifiedAt: string;
  };
  neededFor?: {
    solutionName: string;
    solutionUrl: string;
    reason: string;
  };
  tools: string[];
}

export const CAPABILITY_DOMAINS: Record<CapabilityDomainId, CapabilityDomain> = {
  product: {
    id: "product",
    name: "Продукт & Смысл",
    nameEn: "PRODUCT",
    shortDesc: "Фрейминг проблемы, User Flow, монетизация и scope v1 без лишнего кода",
    color: "#3B82F6",
    score: 72,
    skillsCount: 3,
    masteredCount: 2,
  },
  ai: {
    id: "ai",
    name: "AI & Агенты",
    nameEn: "AI & AGENTS",
    shortDesc: "Промпт-инжиниринг, системные роли, MCP-инструменты и оркестрация воркеров",
    color: "#8B5CF6",
    score: 64,
    skillsCount: 4,
    masteredCount: 2,
  },
  arch: {
    id: "arch",
    name: "Архитектура & БД",
    nameEn: "ARCHITECTURE",
    shortDesc: "Модели данных, схемы Prisma/Postgres, сессии, роли и серверные API",
    color: "#0FB880",
    score: 78,
    skillsCount: 3,
    masteredCount: 2,
  },
  ui: {
    id: "ui",
    name: "Интерфейс & UX",
    nameEn: "INTERFACE",
    shortDesc: "Компонентная архитектура, адаптивная верстка, микрокопии и состояния ошибок",
    color: "#EC4899",
    score: 81,
    skillsCount: 3,
    masteredCount: 3,
  },
  ship: {
    id: "ship",
    name: "Запуск & Ops",
    nameEn: "SHIP & OPS",
    shortDesc: "Среда разработки, VPS, Nginx, SSL, вебхуки ЮKassa и мониторинг",
    color: "#F59E0B",
    score: 58,
    skillsCount: 4,
    masteredCount: 2,
  },
};

export const CAPABILITY_SKILLS: CapabilitySkill[] = [
  // ─── 0. Ship & Ops ───
  {
    id: "env-runtime",
    slug: "env-runtime",
    title: "Среда и рантайм создателя",
    domainId: "ship",
    domainName: "Запуск & Ops",
    level: "L1",
    levelName: "Базовый",
    status: "mastered",
    power: "Умеешь настраивать Node.js, Git-ветки, терминал, SSH-ключи и Cursor без ступора на первой ошибке.",
    fullDescription: "Фундаментальный навык любого создателя цифровых продуктов. Позволяет уверенно управлять локальной разработкой, переменными окружения (.env), пакетными менеджерами (npm/pnpm) и версионированием без страха сломать репозиторий.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Локальный запуск и управление кодовой базой",
        criteria: [
          "Установка Node.js LTS, npm и Git в системе",
          "Работа с ветками main и master без конфликтов",
          "Безопасная настройка .env и .gitignore без утечки секретов",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Автоматизация и интеграция с AI-агентами",
        criteria: [
          "Настройка правил .cursor/rules и AGENTS.md для контекста AI",
          "Работа с SSH-ключами для защищенного доступа к GitHub и VPS",
          "Автоматическая сборка TypeScript и скрипты проверки качества",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Изолированные окружения и мульти-репозитории",
        criteria: [
          "Конфигурация Docker/DevContainers для воспроизводимой среды",
          "Настройка Turbopack, монорепозиториев и локальных воркеров",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Runtime (Рантайм)",
        english: "Runtime Environment",
        slug: "runtime",
        explanation: "Среда выполнения, в которой запускается ваш код (например, Node.js на сервере или браузер у пользователя).",
      },
      {
        term: ".env (Секреты)",
        english: "Environment Variables",
        slug: "env",
        explanation: "Файл с ключами API и паролями БД, который никогда не должен попадать в публичный репозиторий Git.",
      },
      {
        term: "SSH-ключи",
        english: "Secure Shell Keys",
        slug: "ssh",
        explanation: "Пара криптографических ключей (открытый и закрытый) для защищенного входа на сервер без ввода пароля.",
      },
    ],
    prompts: [
      {
        title: "Промпт аудита среды проекта",
        description: "Для проверки чистоты репозитория и зависимостей в Cursor",
        prompt: "Проверь структуру проекта, наличие .gitignore, отсутствие закоммиченных .env файлов и корректность package.json scripts.",
      },
    ],
    commands: [
      "node -v && npm -v",
      "git status && git branch",
      "npm run build",
    ],
    proofOfWork: {
      projectName: "SaaS Starter",
      projectUrl: "/resheniya/saas-product",
      artifact: "Настроен рабочий репозиторий, единая ветка main/master и переменные окружения .env",
      verifiedAt: "Август 2026",
    },
    tools: ["Git", "Node.js 20+", "Cursor", "Bash"],
  },

  {
    id: "server-deploy",
    slug: "server-deploy",
    title: "Сервер, Nginx и PM2",
    domainId: "ship",
    domainName: "Запуск & Ops",
    level: "L2",
    levelName: "Рабочий",
    status: "in_focus",
    power: "Разворачиваешь production-приложения на Linux VPS с реверс-прокси Nginx, SSL-сертификатами и фоновым перезапуском.",
    fullDescription: "Способность выводить продукты из локального компьютера в реальный интернет. Настройка веб-сервера Nginx, процесс-менеджера PM2 для фоновой работы 24/7 и автоматического выпуска бесплатных SSL-сертификатов Let's Encrypt.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Запуск на виртуальном сервере",
        criteria: [
          "Подключение к VPS через SSH и базовая настройка Ubuntu",
          "Клонирование репозитория и установка production-зависимостей",
          "Запуск через PM2 с автостартом при перезагрузке сервера",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Маршрутизация Nginx и защита SSL",
        criteria: [
          "Настройка конфигурации Nginx reverse proxy на порт 3030",
          "Установка Certbot и выпуск HTTPS-сертификата",
          "Настройка gzip-сжатия и безопасных HTTP-заголовков",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Zero-Downtime деплой и балансировка",
        criteria: [
          "Развертывание кластерного режима PM2 без простоя при обновлениях",
          "Настройка автоматического вебхука деплоя по пушу в Git",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "VPS (Сервер)",
        english: "Virtual Private Server",
        slug: "vps",
        explanation: "Виртуальный выделенный сервер в дата-центре с собственным IP-адресом и ОС Linux.",
      },
      {
        term: "Nginx (Реверс-прокси)",
        english: "Reverse Proxy",
        slug: "nginx",
        explanation: "Высокоскоростной веб-сервер, который принимает запросы из интернета на 80/443 портах и перенаправляет их в ваше Next.js приложение.",
      },
      {
        term: "PM2 (Процесс-менеджер)",
        english: "Process Manager",
        slug: "pm2",
        explanation: "Утилита, удерживающая Node.js приложение в памяти, перезапускающая его при сбоях и ведущая логи.",
      },
      {
        term: "SSL / HTTPS",
        english: "Secure Sockets Layer",
        slug: "ssl",
        explanation: "Протокол шифрования трафика между браузером и сайтом (замочек в адресной строке).",
      },
    ],
    prompts: [
      {
        title: "Конфигурация Nginx для Next.js",
        description: "Готовый шаблон виртуального хоста Nginx для проксирования Next.js с поддержкой WebSockets",
        prompt: "Сгенерируй чистый конфиг Nginx для домена example.com, проксирующий трафик на http://localhost:3030 с заголовками X-Real-IP, X-Forwarded-For и Upgrade.",
      },
    ],
    commands: [
      "pm2 status && pm2 logs",
      "sudo nginx -t && sudo systemctl reload nginx",
      "sudo certbot --nginx -d yourdomain.ru",
    ],
    neededFor: {
      solutionName: "Маршрут SaaS",
      solutionUrl: "/resheniya/saas-product",
      reason: "Требуется на шаге 7 для публикации сервиса в интернет с собственным доменом.",
    },
    tools: ["Ubuntu VPS", "Nginx", "PM2", "Certbot SSL"],
  },

  {
    id: "billing-webhooks",
    slug: "billing-webhooks",
    title: "Платежи и идемпотентные вебхуки",
    domainId: "ship",
    domainName: "Запуск & Ops",
    level: "L2",
    levelName: "Рабочий",
    status: "recommended",
    power: "Подключаешь ЮKassa с проверкой подписи, повторными попытками и защитой от двойного списания.",
    fullDescription: "Превращает код в бизнес. Вы учитесь безопасно принимать рубли и валюту, обрабатывать асинхронные уведомления от банков (Webhooks) и сохранять подписки пользователей в базе данных без риска двойных начислений.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Создание платежной ссылки",
        criteria: [
          "Интеграция с API ЮKassa для генерации счета и редиректа на оплату",
          "Фиксация статуса 'pending' в таблице заказов",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Идемпотентные вебхуки и фискализация",
        criteria: [
          "Обработка POST webhook /api/billing/webhook с проверкой IP и подписи",
          "Атомарное переключение роли пользователя в 'PRO' через Prisma Transaction",
          "Защита от дубликатов запросов через уникальный paymentId",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Рекуррентные подписки и автосписания",
        criteria: [
          "Сохранение payment_method_id для автопродления подписок раз в месяц",
          "Обработка сбоев списания и отправка напоминаний в Telegram",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Webhook (Вебхук)",
        english: "Webhook Notification",
        slug: "webhook",
        explanation: "Автоматическое HTTP-сообщение от банка вашему серверу в момент, когда пользователь успешно оплатил счет.",
      },
      {
        term: "Идемпотентность",
        english: "Idempotency",
        slug: "idempotency",
        explanation: "Свойство операции: сколько бы раз банк ни прислал один и тот же вебхук, подписка активируется ровно один раз.",
      },
      {
        term: "HMAC / Signature",
        english: "Hash-based Message Authentication",
        slug: "hmac",
        explanation: "Криптографическая подпись запроса, гарантирующая, что вебхук пришел именно от банка, а не от злоумышленника.",
      },
    ],
    prompts: [
      {
        title: "Обработчик вебхука ЮKassa",
        description: "Безопасный Server Action / Route Handler для Next.js с Prisma",
        prompt: "Напиши POST route handler для /api/billing/webhook: валидация события payment.succeeded, поиск пользователя по metadata.userId, обновление роли в транзакции с логированием.",
      },
    ],
    neededFor: {
      solutionName: "Платный Telegram-бот",
      solutionUrl: "/resheniya/telegram-bot",
      reason: "Позволяет принимать подписки и разовые платежи с авто-активацией доступа.",
    },
    tools: ["ЮKassa API", "Webhooks", "Crypto HMAC", "Prisma Transactions"],
  },

  {
    id: "monitoring-logs",
    slug: "monitoring-logs",
    title: "Логирование и мониторинг сбоев",
    domainId: "ship",
    domainName: "Запуск & Ops",
    level: "L2",
    levelName: "Рабочий",
    status: "base",
    power: "Настраиваешь сбор ошибок, отслеживание 500-х статусов и алерты в Telegram до того, как пользователи напишут в поддержку.",
    fullDescription: "Гарантирует спокойный сон создателя. Система сама сообщает в Telegram о падении базы данных, переполнении диска или ошибках в платежных запросах.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Логи PM2 и ротация файлов",
        criteria: [
          "Просмотр и фильтрация логов через pm2 logs proektmap --lines 100",
          "Настройка pm2-logrotate для предотвращения переполнения диска",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Мгновенные алерты в Telegram",
        criteria: [
          "Отправка критических исключений в закрытый Telegram-чат через Bot API",
          "Мониторинг HTTP 500 и uncaughtException",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Трассировка и Sentry",
        criteria: [
          "Подключение Sentry SDK для захвата стека вызовов на клиенте и сервере",
          "Дашборд доступности (Uptime Kuma / BetterStack)",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Error Boundary",
        english: "Предохранитель ошибок React",
        slug: "error-boundary",
        explanation: "Компонент React, который перехватывает сбой в UI и показывает вежливое сообщение вместо белого экрана смерти.",
      },
      {
        term: "Log Rotation",
        english: "Ротация логов",
        slug: "log-rotation",
        explanation: "Автоматическое архивирование старых логов, чтобы файлы записей не забили всё свободное место на диске сервера.",
      },
    ],
    tools: ["PM2 Logs", "Telegram Alerts", "Sentry"],
  },

  // ─── 1. Product & Framing ───
  {
    id: "problem-framing",
    slug: "problem-framing",
    title: "Фрейминг проблемы и Scope v1",
    domainId: "product",
    domainName: "Продукт & Смысл",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Умеешь отрезать 80% лишних фичей и формулировать одну острую проблему клиента с проверяемым обещанием результата.",
    fullDescription: "Главное отличие сильного создателя от вечного студента. Вместо попытки построить «все фичи сразу» вы выделяете одно ключевое действие, дающее пользователю результат за 60 секунд.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Формулирование ценности и JTBD",
        criteria: [
          "Формулировка задачи клиента: 'Когда [ситуация], я хочу [действие], чтобы [результат]'",
          "Отсечение вторичных функций до релиза первой рабочей версии",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Definition of Done и артефактная цепочка",
        criteria: [
          "Фиксация критериев готовности (Definition of Done) для каждого этапа",
          "Проектирование продукта от конечного артефакта к шагам (Inverted Design)",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Юнит-экономика и ценообразование",
        criteria: [
          "Расчет стоимости AI-токенов на пользователя против цены подписки",
          "A/B тестирование оффера и ценностного предложения",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "JTBD",
        english: "Jobs to Be Done",
        slug: "jtbd",
        explanation: "Фреймворк, объясняющий, какую реальную 'работу' нанимает выполнить ваш продукт в жизни клиента.",
      },
      {
        term: "Scope v1 (Скоуп)",
        english: "Minimum Viable Scope",
        slug: "scope",
        explanation: "Строго ограниченный список функций первой версии продукта, достаточный для решения главной боли.",
      },
      {
        term: "Definition of Done (DoD)",
        english: "Критерий готовности",
        slug: "dod",
        explanation: "Четкий чек-лист, по которому можно однозначно сказать: 'Эта фича полностью готова и работает'.",
      },
    ],
    proofOfWork: {
      projectName: "SaaS Starter",
      projectUrl: "/resheniya/saas-product",
      artifact: "Сформирован паспорт ценности продукта v1 и зафиксирован список критериев готовности",
      verifiedAt: "Август 2026",
    },
    tools: ["JTBD", "Lean Scope", "Definition of Done"],
  },

  {
    id: "feature-flow",
    slug: "feature-flow",
    title: "Архитектура фичей и User Flow",
    domainId: "product",
    domainName: "Продукт & Смысл",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Проектируешь сквозной путь пользователя: вход → первое действие → вау-эффект → фиксация пользы.",
    fullDescription: "Создание логичного и бесшовного пути, где пользователь ни на одном экране не задается вопросом «А что мне нажимать дальше?».",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Карта экранов и переходов",
        criteria: [
          "Создание пошаговой схемы переходов от лендинга до личного кабинета",
          "Исключение тупиковых состояний и пустых экранов",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Онбординг и быстрый результат",
        criteria: [
          "Проектирование пути первого успеха (Time-to-Value < 2 минут)",
          "Сквозные хлебные крошки и сохранение черновиков",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Адаптивные сценарии под сегменты",
        criteria: [
          "Разделение потоков для новичков и опытных специалистов",
          "Умные подсказки на основе предыдущих действий",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "User Flow",
        english: "Пользовательский маршрут",
        slug: "user-flow",
        explanation: "Последовательность шагов, экранов и действий, которые совершает человек для достижения цели в приложении.",
      },
      {
        term: "Time-to-Value (TTV)",
        english: "Время до первой пользы",
        slug: "ttv",
        explanation: "Количество секунд или минут от открытия сайта до момента, когда пользователь получил первый реальный результат.",
      },
    ],
    proofOfWork: {
      projectName: "Telegram Bot",
      projectUrl: "/resheniya/telegram-bot",
      artifact: "Построен 4-шаговый сценарий онбординга без единого тупикового экрана",
      verifiedAt: "Август 2026",
    },
    tools: ["User Story Mapping", "Figma Flow", "Wireframing"],
  },

  {
    id: "product-metrics",
    slug: "product-metrics",
    title: "Продуктовые метрики и воронка",
    domainId: "product",
    domainName: "Продукт & Смысл",
    level: "L1",
    levelName: "Базовый",
    status: "recommended",
    power: "Внедряешь трекинг ключевых событий без нарушения приватности и видишь, где пользователи спотыкаются.",
    fullDescription: "Переход от догадок к твердым цифрам. Вы видите реальную конверсию из посетителя в регистрацию и оплату, отслеживая точки отвала в воронке.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "События и базовая аналитика",
        criteria: [
          "Настройка отправки кастомных событий (event tracking) на ключевые CTA",
          "Интеграция Яндекс.Метрики и PostHog с защитой от блокировщиков",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Когортный анализ и воронка оплат",
        criteria: [
          "Построение воронки: Визит → Клик на решение → Шаг 1 → Оплата",
          "Отслеживание Retention (возвращаемости) по дням и неделям",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Продуктовый дашборд в реальном времени",
        criteria: [
          "Сбор метрик в PostgreSQL и вывод на собственный внутренний админ-дашборд",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Funnel (Воронка)",
        english: "Conversion Funnel",
        slug: "funnel",
        explanation: "Этапы, которые проходит клиент от первого клика до покупки, с процентом дошедших до каждого шага.",
      },
      {
        term: "Retention (Удержание)",
        english: "User Retention",
        slug: "retention",
        explanation: "Процент пользователей, которые возвращаются в ваш продукт через 1, 7 и 30 дней после регистрации.",
      },
    ],
    tools: ["PostHog", "Яндекс.Метрика", "Custom Event Logger"],
  },

  // ─── 2. AI & Agents ───
  {
    id: "prompt-engineering",
    slug: "prompt-engineering",
    title: "Системные роли и промпт-инжиниринг",
    domainId: "ai",
    domainName: "AI & Агенты",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Пишешь детерминированные системные промпты с жесткими контрактами ответа, XML-тегами и защитой от галлюцинаций.",
    fullDescription: "Фундаментальный навык управления современными большими языковыми моделями (LLM). Вместо детских промптов «напиши красивый текст» вы создаете строгие системные инструкции с разделением контекста, ролей и формата JSON/XML.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Структурированные системные промпты",
        criteria: [
          "Четкое разделение роли, контекста, инструкций и ограничений",
          "Использование XML-тегов (<context>, <rules>, <output_format>)",
          "Предотвращение базовых галлюцинаций через 'Если не знаешь — скажи прямо'",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Few-Shot примеры и JSON Schema",
        criteria: [
          "Внедрение эталонных примеров (Few-Shot) в промпт",
          "Принудительный вывод в строгий JSON с валидацией через Zod",
          "Контроль температуры (temperature: 0.2) для повторяемости кода",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Chain-of-Thought и оптимизация токенов",
        criteria: [
          "Скрытое рассуждение перед ответом (Thinking protocols)",
          "Кэширование промптов (Prompt Caching в Anthropic/DeepSeek) для экономии 90% стоимости",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "LLM (Языковая модель)",
        english: "Large Language Model",
        slug: "llm",
        explanation: "Нейросеть (Claude, GPT, DeepSeek), обученная понимать запросы и генерировать текст, код и команды.",
      },
      {
        term: "System Prompt (Системный промпт)",
        english: "System Prompt",
        slug: "system-prompt",
        explanation: "Скрытая главная инструкция для модели, определяющая её характер, роль, правила безопасности и формат ответа.",
      },
      {
        term: "Few-Shot Learning",
        english: "Обучение на примерах",
        slug: "few-shot",
        explanation: "Техника, при которой в промпт вставляется 2–3 готовых примера 'вход → идеальный ответ'.",
      },
      {
        term: "Prompt Caching",
        english: "Кэширование промптов",
        slug: "prompt-caching",
        explanation: "Механизм, сохраняющий системный промпт в памяти провайдера, снижая цену и время ответа в 5–10 раз.",
      },
    ],
    prompts: [
      {
        title: "Эталонный системный контракт AI-эксперта",
        description: "Универсальный шаблон для создания детерминированного AI-помощника",
        prompt: `Ты — Senior AI Architect в ProektMap.
<role_and_constraints>
1. Отвечай на русском языке строго по существу.
2. Не давай общих советов — только проверяемый код и готовые команды.
3. Формат ответа: краткий вывод, затем блок кода, затем критерий проверки.
</role_and_constraints>
<context>
Стек: Next.js 16 + TypeScript + Prisma + PostgreSQL.
</context>`,
      },
    ],
    proofOfWork: {
      projectName: "ProektMap Architect",
      projectUrl: "/resheniya/saas-product",
      artifact: "Создан системный промпт консультанта с передачей проектного контекста и ограничением скоупа",
      verifiedAt: "Август 2026",
    },
    tools: ["Claude 3.7", "DeepSeek-V3", "OpenRouter", "XML Contracts"],
  },

  {
    id: "mcp-tools",
    slug: "mcp-tools",
    title: "MCP-протокол и вызовы инструментов",
    domainId: "ai",
    domainName: "AI & Агенты",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Подключаешь к AI-моделям живые базы данных, файловую систему и внешние API через Model Context Protocol.",
    fullDescription: "Превращает чат-бота в исполнителя. Модель перестает быть просто генератором текста и получает 'руки': может выполнять SQL-запросы, читать файлы проекта, вызывать API и взаимодействовать с браузером через единый стандарт Anthropic MCP.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Подключение готовых MCP-серверов",
        criteria: [
          "Конфигурация mcpServers в Cursor и Claude Desktop",
          "Использование filesystem и postgres MCP-инструментов",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Создание собственного кастомного MCP-сервера",
        criteria: [
          "Написание TypeScript MCP-сервера на @modelcontextprotocol/sdk",
          "Объявление схемы инструментов через Zod (tools declaration)",
          "Безопасная обработка вызовов CallTool и чтение ресурсов",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "SSE и удаленные MCP-шлюзы",
        criteria: [
          "Развертывание защищенных MCP-серверов по HTTP+SSE протоколу",
          "Авторизация и rate-limiting для агентных вызовов",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "MCP (Model Context Protocol)",
        english: "Model Context Protocol",
        slug: "mcp-glossary",
        explanation: "Открытый стандарт от Anthropic (USB для AI), позволяющий подключать модели к базам данных, коду и API.",
      },
      {
        term: "Tool Calling (Вызов инструментов)",
        english: "Function Calling",
        slug: "tool-calling",
        explanation: "Способность модели вернуть структурированный JSON с аргументами для запуска реальной функции на вашем сервере.",
      },
      {
        term: "Stdio Transport",
        english: "Стандартный ввод-вывод",
        slug: "stdio",
        explanation: "Механизм прямого локального взаимодействия программы и AI-агента через стандартные потоки терминала.",
      },
    ],
    proofOfWork: {
      projectName: "Cursor Agent Integration",
      projectUrl: "/resheniya/saas-product",
      artifact: "Настроен локальный MCP-сервер для прямого чтения схемы Prisma и документации проекта",
      verifiedAt: "Август 2026",
    },
    tools: ["MCP SDK", "JSON-RPC", "Cursor Tools", "Stdio Transport"],
  },

  {
    id: "agent-pipelines",
    slug: "agent-pipelines",
    title: "Автономные воркеры и цепочки задач",
    domainId: "ai",
    domainName: "AI & Агенты",
    level: "L2",
    levelName: "Рабочий",
    status: "in_focus",
    power: "Организуешь разделение ролей между агентами: автор пишет код, валидатор проверяет, аудитор дает допуск к деплою.",
    fullDescription: "Переход к фабрике разработки. Вместо одного агента, который пытается сделать всё и ошибается, вы строите пайплайн из специализированных ролей: Автор → Валидатор → Аудитор.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Последовательные агентные шаги",
        criteria: [
          "Запуск под-агентов (Subagents) для изолированных задач",
          "Передача артефактов между шагами пайплайна",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Контроль качества (Auditor/Validator loops)",
        criteria: [
          "Автоматический запуск тестов и линтеров перед коммитом",
          "Блокировка публикации при непрохождении валидатора",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Автономные самовосстанавливающиеся воркеры",
        criteria: [
          "Паттерн Reflection & Self-Correction: агент сам читает ошибку сборки, исправляет код и повторяет билд",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Subagent (Под-агент)",
        english: "Specialized Subagent",
        slug: "subagent",
        explanation: "Изолированный дочерний процесс AI с ограниченным контекстом и узкой специализированной задачей.",
      },
      {
        term: "Reflection (Самокоррекция)",
        english: "Agentic Reflection",
        slug: "reflection",
        explanation: "Паттерн, при котором агент проверяет результат своей работы перед отдачей и сам исправляет неточности.",
      },
    ],
    neededFor: {
      solutionName: "Конвейер AI-решений",
      solutionUrl: "/resheniya",
      reason: "Исключает попадание сломанного кода в production за счет автоматического аудита.",
    },
    tools: ["Subagents", "Validator Scripts", "Autonomous Loops"],
  },

  {
    id: "rag-context",
    slug: "rag-context",
    title: "RAG и контекстные базы знаний",
    domainId: "ai",
    domainName: "AI & Агенты",
    level: "L1",
    levelName: "Базовый",
    status: "recommended",
    power: "Создаешь векторные индексы по документации и кодовой базе для точных ответов без превышения лимитов контекста.",
    fullDescription: "Подключение вашей собственной базы знаний к AI-модели. Позволяет боту отвечать строго по вашим регламентам, инструкциям и схемам без выдумок.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Векторизация текста и семантический поиск",
        criteria: [
          "Генерация embeddings для текстовых фрагментов через OpenAI/Voyage API",
          "Поиск ближайших соседей (cosine similarity) по векторной базе",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "pgvector в PostgreSQL и гибридный поиск",
        criteria: [
          "Хранение векторов прямо в PostgreSQL через расширение pgvector",
          "Гибридный поиск: точные ключевые слова + семантический контекст",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Reranking и многоэтапный RAG",
        criteria: [
          "Внедрение кросс-энкодера (Cohere Rerank) для точной сортировки топ-3 источников",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "RAG",
        english: "Retrieval-Augmented Generation",
        slug: "rag",
        explanation: "Метод, при котором AI сначала находит нужные факты в вашей базе, а затем пишет ответ на их основе.",
      },
      {
        term: "Embeddings (Векторы)",
        english: "Vector Embeddings",
        slug: "embeddings",
        explanation: "Превращение текста в массив чисел, отражающих его глубинный смысл для математического сравнения схожести.",
      },
      {
        term: "Vector DB (Векторная БД)",
        english: "Vector Database",
        slug: "vector-db",
        explanation: "База данных (pgvector, Qdrant), оптимизированная под быстрый поиск похожих векторов среди миллионов документов.",
      },
    ],
    tools: ["Vector Embeddings", "pgvector", "Chunking Strategies"],
  },

  // ─── 3. Architecture & Data ───
  {
    id: "data-modeling",
    slug: "data-modeling",
    title: "Моделирование данных и Prisma",
    domainId: "arch",
    domainName: "Архитектура & БД",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Проектируешь реляционные структуры данных, связи 1-to-many, каскадные правила и индексы без потери целостности.",
    fullDescription: "Основа любого долговечного продукта. Вы учитесь проектировать таблицы, внешние ключи (Foreign Keys), индексы для ускорения выборок и безопасные миграции в Prisma ORM.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Схемы и базовые связи",
        criteria: [
          "Проектирование моделей User, Order, Project в schema.prisma",
          "Связи один-ко-многим (@relation) и каскадные удаления (onDelete: Cascade)",
          "Генерация Prisma Client и базовые CRUD-запросы",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Транзакции, индексы и сиды",
        criteria: [
          "Создание индексов (@@index) для полей поиска и внешних ключей",
          "Использование $transaction для атомарных финансовых операций",
          "Написание файла seed.ts для мгновенного восстановления тестовых данных",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Миграции на проде и аудит производительности",
        criteria: [
          "Безопасные миграции prisma migrate deploy на боевой базе данных",
          "Оптимизация N+1 запросов с помощью правильных include / select",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "ORM",
        english: "Object-Relational Mapping",
        slug: "orm",
        explanation: "Инструмент (Prisma), позволяющий работать с базой данных как с обычными JavaScript-объектами без сырого SQL.",
      },
      {
        term: "Prisma",
        english: "Next-gen Node.js ORM",
        slug: "prisma",
        explanation: "Современная типизированная ORM для TypeScript с автогенерацией типов и декларативной схемой.",
      },
      {
        term: "Database Index (Индекс)",
        english: "Database Index",
        slug: "index",
        explanation: "Специальная структура данных в БД, ускоряющая поиск записей в 100 раз ценой небольшого места на диске.",
      },
    ],
    proofOfWork: {
      projectName: "SaaS Starter v1",
      projectUrl: "/resheniya/saas-product",
      artifact: "Разработана схема на 7 моделей (User, Subscription, Project, Step, Artifact, Log) с миграциями",
      verifiedAt: "Август 2026",
    },
    tools: ["Prisma ORM", "PostgreSQL", "Database Migrations"],
  },

  {
    id: "auth-sessions",
    slug: "auth-sessions",
    title: "Авторизация, сессии и роли",
    domainId: "arch",
    domainName: "Архитектура & БД",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Настраиваешь безопасный OAuth (Яндекс/Google), защищенные cookie-сессии и ролевую модель (Admin / Pro / User).",
    fullDescription: "Безопасность пользователей и защита приватных данных. Настройка OAuth-провайдеров, шифрованных JWT-кук и ролевой модели доступа к закрытым разделам.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "OAuth вход и сессия",
        criteria: [
          "Настройка NextAuth.js с провайдерами Яндекс и Google",
          "Чтение текущей сессии на сервере через getServerSession()",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Роли и защита роутов",
        criteria: [
          "Добавление поля role (ADMIN, PRO, USER) в JWT токен и сессию",
          "Защита приватных страниц через Next.js Middleware",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Multi-tenant изоляция",
        criteria: [
          "Изоляция данных на уровне организации (Workspace ID)",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "OAuth 2.0",
        english: "Open Authorization",
        slug: "oauth",
        explanation: "Протокол входа через сторонние сервисы (Яндекс, Google, GitHub) без необходимости передавать сайту пароль.",
      },
      {
        term: "JWT (JSON Web Token)",
        english: "JSON Web Token",
        slug: "jwt",
        explanation: "Криптографически подписанная строка, хранящая ID пользователя и его роль прямо в защищенной куке браузера.",
      },
      {
        term: "Middleware",
        english: "Промежуточный обработчик",
        slug: "middleware",
        explanation: "Код, выполняющийся до отображения страницы, проверяющий права пользователя и делающий редирект на /login при необходимости.",
      },
    ],
    proofOfWork: {
      projectName: "ProektMap Auth",
      projectUrl: "/resheniya/saas-product",
      artifact: "Реализован гибридный вход по OAuth + Email с middleware защитой приватных роутов",
      verifiedAt: "Август 2026",
    },
    tools: ["NextAuth.js", "OAuth 2.0", "JWT / Database Sessions", "Middleware"],
  },

  {
    id: "api-integrations",
    slug: "api-integrations",
    title: "Server Actions и интеграционные API",
    domainId: "arch",
    domainName: "Архитектура & БД",
    level: "L2",
    levelName: "Рабочий",
    status: "base",
    power: "Создаешь типизированные серверные функции, валидируешь входные данные через Zod и безопасно вызываешь сторонние сервисы.",
    fullDescription: "Связка клиентского интерфейса с сервером и внешними API. Использование современных Server Actions в Next.js без лишнего бойлерплейта и валидация данных.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Server Actions и мутации",
        criteria: [
          "Создание асинхронных серверных функций с директивой 'use server'",
          "Валидация входящих полей формы через схему Zod",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Интеграции с внешними REST API",
        criteria: [
          "Безопасные вызовы сторонних API с таймаутами и обработкой ошибок",
          "Кэширование ответов через Next.js revalidatePath",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Очереди и фоновые задачи",
        criteria: [
          "Асинхронная обработка тяжелых задач через очереди (BullMQ / Inngest)",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Server Actions",
        english: "Серверные функции React",
        slug: "server-actions",
        explanation: "Функции, которые вызываются прямо из формы React, но выполняются исключительно на сервере в защищенной среде.",
      },
      {
        term: "Zod (Схема валидации)",
        english: "TypeScript Schema Validation",
        slug: "zod",
        explanation: "Библиотека для строгой проверки типов входных данных во время выполнения (runtime validation).",
      },
    ],
    tools: ["Next.js Server Actions", "Zod", "REST API", "Fetch Interceptors"],
  },

  // ─── 4. Interface & UX ───
  {
    id: "component-arch",
    slug: "component-arch",
    title: "Компонентная архитектура React",
    domainId: "ui",
    domainName: "Интерфейс & UX",
    level: "L3",
    levelName: "Продвинутый",
    status: "mastered",
    power: "Разделяешь серверные и клиентские компоненты, создаешь переиспользуемые модули без спагетти-кода и утечек рендеринга.",
    fullDescription: "Чистый, масштабируемый фронтенд. Грамотное разделение Server Components (для быстрой загрузки и SEO) и Client Components (для интерактивности) в React 19 / Next.js.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Декомпозиция на кирпичики",
        criteria: [
          "Выделение повторяющихся блоков в переиспользуемые компоненты",
          "Типизация props через TypeScript interfaces",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Server & Client Components",
        criteria: [
          "Минимизация использования 'use client' на листьях дерева компонентов",
          "Оптимизация рендеринга и предотвращение лишних перерисовок",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "UI Kit и полиморфные компоненты",
        criteria: [
          "Создание дизайн-системы на CSS Variables без привязки к тяжелым библиотекам",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "RSC (Server Components)",
        english: "React Server Components",
        slug: "rsc",
        explanation: "Компоненты React, которые рендерятся на сервере в чистый HTML без отправки лишнего JavaScript клиенту.",
      },
      {
        term: "Props (Пропсы)",
        english: "Component Properties",
        slug: "props",
        explanation: "Входные параметры, которые передаются в React-компонент для настройки его данных и внешнего вида.",
      },
    ],
    proofOfWork: {
      projectName: "ProektMap Shell",
      projectUrl: "/resheniya/saas-product",
      artifact: "Собрана библиотека из 24 переиспользуемых UI-компонентов с поддержкой тем",
      verifiedAt: "Август 2026",
    },
    tools: ["React 19", "Next.js App Router", "Server Components", "Lucide Icons"],
  },

  {
    id: "responsive-design",
    slug: "responsive-design",
    title: "Адаптивность и мобильный UX (375px)",
    domainId: "ui",
    domainName: "Интерфейс & UX",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Верстаешь интерфейсы, которые идеально выглядят на смартфоне (375px) без горизонтального скролла и микроскопических кнопок.",
    fullDescription: "Mobile-first подход. Создание продуктов, которые одинаково удобно открывать как на широком мониторе разработчика, так и на экране iPhone на ходу.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Отсутствие overflow и читаемость",
        criteria: [
          "Верстка без горизонтального скролла на ширине 375px",
          "Размер шрифта не менее 14px для комфортного чтения",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Touch Targets и адаптивная сетка",
        criteria: [
          "Размер кликабельных кнопок не менее 48px (Touch Target)",
          "Перестроение многоколоночных сеток в стек на мобильных экранах",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Жесты и Safe Area",
        criteria: [
          "Учет отступов Safe Area для экранов с вырезами (iPhone notch/island)",
          "Свайп-меню и адаптивные модальные окна-шторки (Bottom Sheets)",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Mobile-first",
        english: "Мобильно-ориентированный подход",
        slug: "mobile-first",
        explanation: "Принцип разработки, при котором интерфейс сначала проектируется для маленького экрана смартфона, а затем расширяется.",
      },
      {
        term: "Touch Target (Зона тапа)",
        english: "Touch Target Size",
        slug: "touch-target",
        explanation: "Физический размер интерактивного элемента (не менее 44x44px), чтобы в него было легко попасть пальцем.",
      },
    ],
    proofOfWork: {
      projectName: "Workspace Mobile",
      projectUrl: "/resheniya/saas-product",
      artifact: "Все экраны пошагового прохождения адаптированы под мобильные тапы ≥48px",
      verifiedAt: "Август 2026",
    },
    tools: ["Mobile-first CSS", "Touch Targets", "CSS Variables", "Flex/Grid"],
  },

  {
    id: "ui-microcopy",
    slug: "ui-microcopy",
    title: "Микрокопии и состояния интерфейса",
    domainId: "ui",
    domainName: "Интерфейс & UX",
    level: "L2",
    levelName: "Рабочий",
    status: "mastered",
    power: "Продумываешь каждый скелетон загрузки, состояние пустого списка (empty state) и понятные человеческие тексты ошибок.",
    fullDescription: "Внимание к деталям, отличающее любительскую поделку от профессионального сервиса. Человеческий язык подсказок, информативные ошибки с кнопкой 'Попробовать снова' и скелетоны загрузки.",
    levels: [
      {
        level: "L1",
        name: "Базовый",
        summary: "Четкие тексты кнопок и подсказок",
        criteria: [
          "Глаголы действия на кнопках вместо абстрактного 'ОК' ('Создать проект', 'Оплатить 300₽')",
          "Понятные подсказки в полях ввода (Placeholders)",
        ],
      },
      {
        level: "L2",
        name: "Рабочий",
        summary: "Empty, Loading и Error States",
        criteria: [
          "Красивые пустые состояния (Empty states) с призывом к первому действию",
          "Индикаторы загрузки (Skeletons/Spinners) для длительных AI-запросов",
          "Человеческие сообщения об ошибках без технического жаргона",
        ],
      },
      {
        level: "L3",
        name: "Продвинутый",
        summary: "Оптимистичные обновления UI",
        criteria: [
          "Optimistic UI: мгновенное отображение изменений в интерфейсе до завершения ответа сервера",
        ],
      },
    ],
    glossaryTerms: [
      {
        term: "Empty State (Пустое состояние)",
        english: "Empty State",
        slug: "empty-state",
        explanation: "Экран, который видит пользователь, когда у него ещё нет данных (например, нет созданных проектов), с подсказкой первого шага.",
      },
      {
        term: "Skeleton Loading",
        english: "Скелетон загрузки",
        slug: "skeleton",
        explanation: "Светло-серые анимированные очертания блоков, показывающие структуру контента до его полной загрузки.",
      },
    ],
    proofOfWork: {
      projectName: "ProektMap UX Audit",
      projectUrl: "/resheniya/saas-product",
      artifact: "Устранены тупиковые экраны ошибок, добавлены подсказки и копирование команд в 1 клик",
      verifiedAt: "Август 2026",
    },
    tools: ["Microcopy", "Empty States", "Error Boundaries", "Loading Spinners"],
  },
];
