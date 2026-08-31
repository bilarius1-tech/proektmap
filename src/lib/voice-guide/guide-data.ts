/**
 * Единый реестр Голосового проводника ProektMap (Voice Guide).
 * Включает текст для пользователя (rawScript), фонетически нормализованный скрипт
 * для синтезатора речи (voiceScript) и быстрые действия (nextActions).
 */

export interface VoiceGuideAction {
  label: string;
  href: string;
  primary?: boolean;
}

export interface VoiceGuideItem {
  id: string;
  route: string;
  title: string;
  badge?: string;
  durationSec: number;
  rawScript: string;
  voiceScript?: string;
  audioSrc: string;
  nextActions: VoiceGuideAction[];
}

/**
 * Словарь фонетической нормализации IT-терминов для естественного звучания в TTS
 */
export const IT_VOICE_DICTIONARY: Record<string, string> = {
  "ProektMap": "ПроектМэ́п",
  "ProektMap.ru": "ПроектМэ́п то́чка ру",
  "SaaS": "са́ас-сервиса",
  "SaaS-продукта": "са́ас-продукта",
  "AI": "эй-а́й",
  "AI-решений": "эй-а́й решений",
  "AI-решения": "эй-а́й решения",
  "AI-инжинирингу": "эй-а́й инжинирингу",
  "AI-инженер": "эй-а́й инженер",
  "AI-ассистент": "эй-а́й ассистент",
  "API": "эй-пи-а́й",
  "MCP": "эм-си-пи́",
  "MCP-серверы": "эм-си-пи́ серверы",
  "Next.js": "Некст джи-э́с",
  "Prisma": "При́зма",
  "GitHub": "Гитха́б",
  "Docker": "До́кер",
  "TypeScript": "Тайпскри́пт",
  "PostgreSQL": "По́стгрес",
  "Tailwind": "Тейлви́нд",
  "Cursor": "Кёрсор",
  "Claude": "Клод",
  "ChatGPT": "Чат Джи-пи-ти́",
  "DeepSeek": "ДипСи́к",
  "CRM": "си-эр-э́м",
  "XML": "икс-эм-э́ль",
  "CSV": "си-эс-вэ́",
  "EXIF": "э́гзиф",
  "MVP": "эм-ви-пи́",
  "UI": "ю-а́й",
  "UX": "ю-и́кс",
  "SEO": "се́о",
};

/**
 * Функция автоматической замены терминов на их фонетические аналоги
 */
export function normalizeForSpeech(text: string): string {
  let result = text;
  // Сортируем ключи по убыванию длины, чтобы длинные фразы заменялись раньше коротких
  const keys = Object.keys(IT_VOICE_DICTIONARY).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const replacement = IT_VOICE_DICTIONARY[key];
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "g");
    result = result.replace(regex, replacement);
  }
  return result;
}

export const VOICE_GUIDES: Record<string, VoiceGuideItem> = {
  "/": {
    id: "home",
    route: "/",
    title: "Главная страница ProektMap",
    badge: "Карта экосистемы",
    durationSec: 32,
    rawScript:
      "Добро пожаловать в ProektMap. Это интерактивная карта создания цифровых продуктов. Здесь вы можете пройти путь от идеи до работающего проекта: выбрать готовый AI-маршрут, изучить архитектуру, подобрать стек технологий и запустить собственный SaaS или Telegram-сервис.",
    voiceScript:
      "Добро пожаловать в ПроектМэ́п. Это интерактивная карта создания цифровых продуктов. Здесь вы можете пройти путь от идеи до работающего проекта: выбрать готовый эй-а́й маршрут, изучить архитектуру, подобрать стек технологий и запустить собственный са́ас или Телегра́м сервис.",
    audioSrc: "/audio/guides/home.mp3",
    nextActions: [
      { label: "Готовые решения", href: "/resheniya", primary: true },
      { label: "Автоматизация Авито", href: "/avito" },
      { label: "Микросервисы", href: "/services" },
    ],
  },
  "/resheniya": {
    id: "resheniya",
    route: "/resheniya",
    title: "Готовые решения AI",
    badge: "Маршруты и артефакты",
    durationSec: 34,
    rawScript:
      "Это раздел готовых решений ProektMap. Здесь собраны пошаговые инженерные маршруты: от бизнес-задачи до работающего артефакта с проверкой качества. Выберите нужное направление, изучайте этапы и собирайте рабочий проект с помощью AI-ассистентов.",
    voiceScript:
      "Это раздел готовых решений ПроектМэ́п. Здесь собраны пошаговые инженерные маршруты: от бизнес-задачи до работающего артефакта с проверкой качества. Выберите нужное направление, изучайте этапы и собирайте рабочий проект с помощью эй-а́й ассистентов.",
    audioSrc: "/audio/guides/resheniya.mp3",
    nextActions: [
      { label: "SaaS MVP маршрут", href: "/resheniya/saas-mvp", primary: true },
      { label: "AI-магазин на Авито", href: "/resheniya/avito-business" },
      { label: "Telegram Mini App", href: "/resheniya/telegram-mini-app" },
    ],
  },
  "/avito": {
    id: "avito",
    route: "/avito",
    title: "Автоматизация Авито",
    badge: "Инструменты и фиды",
    durationSec: 33,
    rawScript:
      "Раздел посвящён автоматизации работы с Авито. Здесь собраны практические инструменты для селлерских команд: пакетная уникализация фотографий, генерация описаний, автосборка XML-фидов и подключение AI-автоответов для моментальной обработки лидов.",
    voiceScript:
      "Раздел посвящён автоматизации работы с Ави́то. Здесь собраны практические инструменты для се́ллерских команд: пакетная уникализация фотографий, генерация описаний, автосборка икс-эм-э́ль фидов и подключение эй-а́й автоответов для моментальной обработки лидов.",
    audioSrc: "/audio/guides/avito.mp3",
    nextActions: [
      { label: "Avito Photo Lab", href: "/services/avito-photo-uniquizer", primary: true },
      { label: "AI-магазин на Авито", href: "/resheniya/avito-business" },
      { label: "Промпты для объявлений", href: "/prompts" },
    ],
  },
  "/skills": {
    id: "skills",
    route: "/skills",
    title: "Библиотека Skills",
    badge: "Навыки для агентов",
    durationSec: 31,
    rawScript:
      "Перед вами каталог Skills — готовых модулей расширения для AI-агентов в Cursor и Claude Code. Каждый Skill добавляет агенту специализированные навыки: аудит кода, работу с базой данных, верстку интерфейсов или генерацию контента.",
    voiceScript:
      "Перед вами каталог Скилло́в — готовых модулей расширения для эй-а́й агентов в Кёрсоре и Клод Ко́де. Каждый Скилл добавляет агенту специализированные навыки: аудит кода, работу с базой данных, вёрстку интерфейсов или генерацию контента.",
    audioSrc: "/audio/guides/skills.mp3",
    nextActions: [
      { label: "Изучить каталог Skills", href: "/skills", primary: true },
      { label: "Арсенал инструментов", href: "/arsenal" },
    ],
  },
  "/arsenal": {
    id: "arsenal",
    route: "/arsenal",
    title: "Арсенал инструментов",
    badge: "Стек и сервисы",
    durationSec: 29,
    rawScript:
      "Арсенал — это проверенная подборка инструментов, библиотек и AI-моделей для современного инженера. Здесь собрано всё необходимое для эффективной разработки: от редакторов кода и MCP-серверов до систем деплоя и аналитики.",
    voiceScript:
      "Арсенал — это проверенная подборка инструментов, библиотек и эй-а́й моделей для современного инженера. Здесь собрано всё необходимое для эффективной разработки: от редакторов кода и эм-си-пи́ серверов до систем депло́я и аналитики.",
    audioSrc: "/audio/guides/arsenal.mp3",
    nextActions: [
      { label: "Смотреть Арсенал", href: "/arsenal", primary: true },
      { label: "Библиотека промптов", href: "/prompts" },
    ],
  },
  "/prompts": {
    id: "prompts",
    route: "/prompts",
    title: "Библиотека промптов",
    badge: "Инженерные инструкции",
    durationSec: 30,
    rawScript:
      "В библиотеке промптов собраны точные инженерные инструкции для работы с нейросетями. Каждый промпт протестирован на практике, содержит чёткие контекстные ограничения и гарантирует предсказуемый результат при генерации кода или текста.",
    voiceScript:
      "В библиотеке промптов собраны точные инженерные инструкции для работы с нейросетями. Каждый промпт протестирован на практике, содержит чёткие контекстные ограничения и гарантирует предсказуемый результат при генерации кода или текста.",
    audioSrc: "/audio/guides/prompts.mp3",
    nextActions: [
      { label: "Каталог промптов", href: "/prompts", primary: true },
      { label: "Готовые решения", href: "/resheniya" },
    ],
  },
  "/vaibik": {
    id: "vaibik",
    route: "/vaibik",
    title: "Вайбик — AI-тренажёр",
    badge: "Интерактивная практика",
    durationSec: 32,
    rawScript:
      "Вайбик — это интерактивный игровой тренажёр для освоения вайбкодинга. Здесь вы учитесь правильно формулировать задачи для искусственного интеллекта, исправлять ошибки и собирать работающие прототипы в увлекательном формате миссий.",
    voiceScript:
      "Ва́йбик — это интерактивный игровой тренажёр для освоения вайбко́динга. Здесь вы учитесь правильно формулировать задачи для искусственного интеллекта, исправлять ошибки и собирать работающие прототипы в увлекательном формате миссий.",
    audioSrc: "/audio/guides/vaibik.mp3",
    nextActions: [
      { label: "Начать миссию", href: "/vaibik", primary: true },
      { label: "Каталог решений", href: "/resheniya" },
    ],
  },
  "/services": {
    id: "services",
    route: "/services",
    title: "Хаб микросервисов",
    badge: "Утилиты и инструменты",
    durationSec: 30,
    rawScript:
      "Хаб микросервисов ProektMap объединяет автономные прикладные утилиты для решения конкретных задач: обработка медиа, валидация данных, экспорт фидов и автоматизация рутинных процессов без необходимости писать код с нуля.",
    voiceScript:
      "Хаб микросервисов ПроектМэ́п объединяет автономные прикладные утилиты для решения конкретных задач: обработка медиа, валидация данных, экспорт фидов и автоматизация рутинных процессов без необходимости писать код с нуля.",
    audioSrc: "/audio/guides/services.mp3",
    nextActions: [
      { label: "Avito Photo Lab", href: "/services/avito-photo-uniquizer", primary: true },
      { label: "Все микросервисы", href: "/services" },
    ],
  },
};

/**
 * Получить данные голосового гида по текущему пути (pathname)
 */
export function getVoiceGuideByPath(pathname: string): VoiceGuideItem | null {
  if (!pathname) return null;
  // Прямое совпадение
  if (VOICE_GUIDES[pathname]) return VOICE_GUIDES[pathname];
  
  // Совпадение без завершающего слэша
  const clean = pathname !== "/" ? pathname.replace(/\/$/, "") : "/";
  if (VOICE_GUIDES[clean]) return VOICE_GUIDES[clean];

  return null;
}
