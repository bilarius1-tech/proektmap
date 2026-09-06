import type { GuidedReference, GuidedStep } from "./guided-data";

/**
 * Публичная реф-ссылка без кода в UI.
 * Схема Плати по миру: вы делитесь ссылкой → друг открыл карту → выплаты.
 * У нас делятся только https://proektmap.ru/go/platipomiru —
 * сервер подставляет ?code=… из .env.
 */
export const PLATIPOMIRU = {
  brand: "Плати по миру",
  /** Относительный путь на сайте */
  siteUrl: "/go/platipomiru",
  /** Абсолютная ссылка для копирования / шаринга / команд */
  publicUrl: "https://proektmap.ru/go/platipomiru",
  tagline: "Зарубежная виртуальная карта с пополнением в рублях через СБП",
} as const;

const siteRef: GuidedReference = {
  kind: "Инструмент",
  label: "Плати по миру (гайд из РФ)",
  href: "/ai-without-vpn",
  description: "Контекст оплаты западных AI из России; карта — по кнопке ProektMap в шаге",
};

const cursorRef: GuidedReference = {
  kind: "Инструмент",
  label: "Cursor",
  href: "/ai-tools/cursor",
  description: "AI-редактор: вход через GitHub, оплата картой Плати по миру",
};

const rfRef: GuidedReference = {
  kind: "Инструмент",
  label: "AI без VPN",
  href: "/ai-without-vpn",
  description: "Контекст работы с западными AI-сервисами из России",
};

/**
 * Обязательный шаг №1 всех готовых решений: оплата AI-агентов из РФ.
 */
export function makePlatipomiruStep(): GuidedStep {
  return {
    slug: "pay-from-russia",
    shortTitle: "Оплата из РФ",
    title: "Открываем оплату AI-агентов из России",
    duration: "15–25 минут",
    goal: "Есть карта «Плати по миру», Cursor привязан к вашему GitHub, подписка оплачена этой картой.",
    recommendation: {
      title: "Плати по миру + Cursor через свой GitHub",
      why: "Из РФ российская карта часто не проходит в Cursor. «Плати по миру» даёт зарубежную виртуальную карту с пополнением через СБП. Вход в Cursor лучше сразу через свой GitHub: один аккаунт для IDE, репозиториев и биллинга — меньше путаницы с «чужими» / временными почтами.",
      link: siteRef,
    },
    explanation:
      "Этот шаг стоит первым во всех маршрутах /resheniya. Воспользуйтесь удобным сервисом «Плати по миру» по ссылке ниже: выпустите карту, пополните через СБП, затем войдите в Cursor через GitHub и оплатите Pro этой картой.",
    instructions: [
      {
        title: "Воспользуйтесь удобным сервисом Плати по миру",
        text: "По ссылке откроется сервис: регистрация, карта «Для подписок» и дальше при необходимости Telegram-бот. Просто нажмите зелёную кнопку.",
        command: PLATIPOMIRU.publicUrl,
      },
      {
        title: "Зарегистрируйтесь и выпустите карту для подписок",
        text: "Создайте аккаунт, выберите карту «Для подписок» (USD). Пополнение — в рублях через СБП.",
      },
      {
        title: "Пополните баланс под первую оплату Cursor",
        text: "Заложите запас с учётом курса и комиссии транзакции (~$0.25). Для старта Cursor Pro обычно достаточно эквивалента $20–40.",
      },
      {
        title: "Войдите в Cursor через свой GitHub",
        text: "На cursor.com или в приложении Cursor выберите Sign in with GitHub. Используйте свой основной GitHub — так проще восстановить доступ и не потерять подписку.",
        command: "https://cursor.com",
      },
      {
        title: "Оплатите Cursor картой Плати по миру",
        text: "В Cursor: Settings → Account / Billing (или cursor.com → Pricing → Upgrade). Выберите Pro. Введите данные карты из «Плати по миру»: номер, срок, CVC. Подтвердите 3D Secure, если банк запросит.",
      },
      {
        title: "Проверьте доступ агента",
        text: "Откройте Cursor под тем же GitHub-аккаунтом. Убедитесь, что план Pro активен и Agent отвечает без ошибки billing.",
      },
    ],
    prompt: {
      title: "Плохо → хорошо (Cursor + оплата)",
      body: `Плохо:
«Как-нибудь потом оплачу Cursor» — Agent не заработает.

Хорошо:
1) Открыл Плати по миру по кнопке → карта «Для подписок» → СБП
2) Cursor: Sign in with GitHub (свой аккаунт)
3) Billing → Pro → карта из Плати по миру → 3D Secure
4) Agent отвечает без ошибки оплаты

Почему: сначала удобная оплата из РФ, потом спокойная работа с AI.`,
    },
    success: [
      "Открыли Плати по миру и создали карту для подписок",
      "Баланс пополнен через СБП",
      "Cursor открыт через ваш GitHub",
      "Подписка оплачена, Agent без ошибки billing",
    ],
    artifact: "Карта Плати по миру + Cursor на вашем GitHub с оплаченным Pro",
    terms: ["Cursor", "GitHub", "СБП", "виртуальная карта", "3D Secure"],
    references: [siteRef, cursorRef, rfRef],
  };
}

/** Вставляет шаг оплаты первым, без дублей. */
export function withPayFromRussiaFirst(steps: GuidedStep[]): GuidedStep[] {
  if (steps[0]?.slug === "pay-from-russia") return steps;
  return [makePlatipomiruStep(), ...steps.filter((s) => s.slug !== "pay-from-russia")];
}
