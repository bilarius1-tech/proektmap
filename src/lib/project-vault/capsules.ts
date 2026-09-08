import type { VaultCapsule, VaultTrackMeta } from "./types";

export const VAULT: VaultTrackMeta = {
  title: "Project Vault",
  href: "/project-vault",
  tagline: "DNA + Snapshot",
  valueProp:
    "Инженерные капсулы живых продуктов: переносимая AI-инженерия (rules, harness, loop, graph, DoD) плюс снимок артефактов без секретов. Не Behance и не готовый маршрут «собери с нуля».",
  afterTrack: [
    "Какой harness/loop/graph уже доказан в проде",
    "Что скопировать первым делом в проект #2",
    "Где Client Boundary и какие секреты завести по именам",
    "Как устроен deploy на VPS без Vercel",
  ],
};

export const CAPSULES: VaultCapsule[] = [
  {
    slug: "reverans",
    name: "Реверанс",
    tagline:
      "Платформа студии художественной гимнастики: лендинг, ЛК родителя, админка, договоры, ТБанк",
    sourceUrl: "https://reverans.online",
    dnaVersion: "1.0.0",
    derivedFrom: null,
    stackLabels: [
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "TBank",
      "PM2+Nginx",
    ],
    aiFlags: { harness: true, loop: true, graph: true },
    status: "published",
    accent: "#7DD3D3",
    seoTitle: "Реверанс — инженерная капсула | Project Vault",
    seoDescription:
      "Project DNA и Snapshot студии «Реверанс»: Cursor rules, Harness/Loop/Graph, DoD, VPS deploy, schema-only БД — без секретов и PII.",
    longSummary: [
      "Живой продукт на VPS: родительский кабинет, админка, договоры, эквайринг ТБанк.",
      "DNA #1: AGENTS.md, .cursor/rules, harness healthcheck, 15m Loop, Dev Graph D1–D10.",
      "Deploy: rsync (без uploads) → build → pm2 restart → harness green.",
      "Секреты только именами; DB — schema-only; Client Boundary подписан.",
      "Arsenal candidates отмечены, без авто-публикации.",
    ],
    dnaSections: [
      {
        id: "law",
        title: "Закон агента",
        summary: "START_HERE → DEVLOG «Сейчас» → HANDOFF → AGENTS → rules.",
        paths: ["ai/START_HERE.md", "ai/AGENTS.md", "docs/PHILOSOPHY.md", "docs/DEVELOPMENT.md"],
      },
      {
        id: "rules",
        title: "Cursor rules",
        summary: "Always-on: start-here, harness, day-close, dev-graph, product.",
        paths: ["ai/.cursor/rules/"],
      },
      {
        id: "harness",
        title: "Harness / Loop / Graph",
        summary: "check-service.sh, LOOP 15m, Dev Graph DoD по дням.",
        paths: [
          "ai/harness/LOOP.md",
          "infrastructure/harness/check-service.sh",
          "ai/.cursor/rules/dev-graph.mdc",
        ],
      },
      {
        id: "prompts",
        title: "Промпты и решения",
        summary: "Day-close, harness tick, QA; ADR про VPS и TBank secret file.",
        paths: ["ai/prompts/", "ai/decisions/", "ai/COPY-FIRST.md"],
      },
    ],
    snapshotHighlights: [
      "source/source-code.tar.gz — код без .env, node_modules, uploads",
      "database/schema.prisma + schema-only SQL",
      "infrastructure/nginx|pm2|deploy|ssl (ключ SSL не включён)",
      "docs/.env.example + SECRETS.md (имена)",
    ],
    reusablePatterns: [
      "vps-pm2-nginx-next",
      "day-close-devlog",
      "harness-healthcheck",
      "dev-graph-dod",
      "tbank-secret-file",
      "rsync-exclude-uploads",
    ],
    arsenalCandidates: [
      {
        title: "VPS + PM2 + Nginx Next.js deploy",
        reason: "Повторяемый деплой студии/SaaS без Vercel",
      },
      {
        title: "Shell harness + 15m Loop",
        reason: "Контракт здоровья, видимый агенту",
      },
      {
        title: "Day-close DEVLOG ritual",
        reason: "Приоритет «Сейчас» между чатами",
      },
    ],
    packageRoot: "content/project-vault/reverans",
    manifestPath: "content/project-vault/reverans/manifest.json",
    links: {
      agentEngineering: "/agent-engineering",
      aiSkills: "/ai-skills",
      arsenal: "/arsenal",
      decisions: "/project-vault/reverans#decisions",
    },
  },
];

export function getCapsule(slug: string): VaultCapsule | undefined {
  return CAPSULES.find((c) => c.slug === slug);
}

export function getPublishedCapsules(): VaultCapsule[] {
  return CAPSULES.filter((c) => c.status === "published");
}

export function getCapsuleSlugs(): string[] {
  return CAPSULES.map((c) => c.slug);
}
