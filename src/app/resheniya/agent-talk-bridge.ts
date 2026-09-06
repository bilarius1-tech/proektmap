/**
 * Мост /resheniya → /agent-engineering:
 * как общаться с агентом через Harness → Loop → Graph (без дубля всего трека).
 */

export type AgentTalkPillar = {
  id: "harness" | "loop" | "graph";
  order: 1 | 2 | 3;
  title: string;
  plain: string;
  howToTalk: string;
  bad: string;
  good: string;
  why: string;
  href: string;
};

export const AGENT_TALK_BRIDGE = {
  title: "Как общаться с агентом",
  lead: "Сначала выбрали инструмент и место работы. Теперь — как писать агенту. Три опоры ProektMap: Harness → Loop → Graph. Это мост в трек «Инженерия агентов», не весь курс.",
  trackHref: "/agent-engineering",
  trackLabel: "Полный трек: Инженерия агентов",
  pillars: [
    {
      id: "harness",
      order: 1,
      title: "Harness",
      plain: "Каркас: правила проекта, Skills, права, папка. Агент не угадывает «как у нас принято».",
      howToTalk:
        "Ссылайтесь на закон проекта: AGENTS.md, запреты, стек. Дайте роль и границы — не просите «сделай красиво».",
      bad: "«Сделай нормальный SaaS, ты же умный»",
      good: "«Следуй AGENTS.md. Добавь страницу X. Не трогай .env. Не коммить. После правки скажи URL проверки.»",
      why: "Без каркаса модель болтает; с каркасом выполняет миссию в ваших правилах.",
      href: "/agent-engineering/harness",
    },
    {
      id: "loop",
      order: 2,
      title: "Loop",
      plain: "Цикл: сделать → проверить → исправить, пока Definition of Done. Не один ответ «и ушёл».",
      howToTalk:
        "Задайте наблюдаемый DoD и лимит попыток. Просите проверить (localhost, curl, build), а не «кажется ок».",
      bad: "«Доделай, пока не станет идеально»",
      good: "«Сделай /demo/hello. Открой URL. Если не 200 — исправь. Максимум 3 попытки. Потом отчёт.»",
      why: "Качество = повтор с проверкой, а не красивая первая фраза.",
      href: "/agent-engineering/loop",
    },
    {
      id: "graph",
      order: 3,
      title: "Graph",
      plain: "Карта связей: что от чего зависит. Не пихать весь проект в один промпт.",
      howToTalk:
        "Просите сначала найти связанные файлы/маршруты, потом править. Self-rewrite skills — только с вашего «да».",
      bad: "«Вот весь репозиторий, разберись сам и перепиши что надо»",
      good: "«Найди, что зависит от страницы X (sitemap, меню, API). Покажи список. Меняй только согласованное. Skills не переписывай без моего «да».»",
      why: "Граф снижает галлюцинации и случайные поломки соседних частей.",
      href: "/agent-engineering/graph",
    },
  ] satisfies AgentTalkPillar[],
} as const;
