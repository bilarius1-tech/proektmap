import { getDb } from "../src/lib/db/index";

/**
 * Шапка = 4 станции + Карта.
 * Новый раздел садится спицей под станцию, а не новым корнем.
 * См. .cursor/rules/menu.mdc
 */

type MenuSeed = {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  parentId: string | null;
};

const HEADER_ROOTS: MenuSeed[] = [
  { id: "header-resheniya", label: "Решения", href: "/resheniya", sortOrder: 0, parentId: null },
  { id: "header-station-build", label: "Собрать", href: "/ui-patterns", sortOrder: 1, parentId: null },
  { id: "header-station-tools", label: "Инструменты", href: "/arsenal", sortOrder: 2, parentId: null },
  { id: "header-station-learn", label: "Научиться", href: "/agent-engineering", sortOrder: 3, parentId: null },
  { id: "header-sitemap", label: "Карта", href: "/sitemap", sortOrder: 4, parentId: null },
];

const HEADER_SPOKES: MenuSeed[] = [
  // Решения
  { id: "header-resheniya-saas", label: "SaaS-продукт", href: "/resheniya/saas-product", sortOrder: 0, parentId: "header-resheniya" },
  { id: "header-resheniya-telegram", label: "Telegram-бот", href: "/resheniya/telegram-bot", sortOrder: 1, parentId: "header-resheniya" },
  { id: "header-resheniya-avito-business", label: "AI-магазин на Авито", href: "/resheniya/avito-business", sortOrder: 2, parentId: "header-resheniya" },
  { id: "header-resheniya-premium", label: "Премиум-шаблон", href: "/resheniya/premium-landing", sortOrder: 3, parentId: "header-resheniya" },
  { id: "header-resheniya-designer", label: "Агенты для дизайнера", href: "/resheniya/designer-agent", sortOrder: 4, parentId: "header-resheniya" },
  { id: "header-resheniya-grok", label: "Grok Bot → Cursor", href: "/resheniya/grok-bot-cursor", sortOrder: 5, parentId: "header-resheniya" },
  { id: "header-vaibik", label: "Вайбик", href: "/vaibik", sortOrder: 6, parentId: "header-resheniya" },

  // Собрать
  { id: "header-ui-patterns", label: "UI-паттерны", href: "/ui-patterns", sortOrder: 0, parentId: "header-station-build" },
  { id: "header-kopilka", label: "Копилка", href: "/kopilka", sortOrder: 1, parentId: "header-station-build" },
  { id: "header-architect", label: "AI-Архитектор", href: "/architect", sortOrder: 2, parentId: "header-station-build" },
  { id: "header-project-vault", label: "Project Vault", href: "/project-vault", sortOrder: 3, parentId: "header-station-build" },
  { id: "header-sandbox", label: "Песочница", href: "/sandbox", sortOrder: 4, parentId: "header-station-build" },
  { id: "header-project-vault-reverans", label: "Реверанс", href: "/project-vault/reverans", sortOrder: 0, parentId: "header-project-vault" },

  // Инструменты
  { id: "header-arsenal", label: "Нейро каталог", href: "/arsenal", sortOrder: 0, parentId: "header-station-tools" },
  { id: "header-services", label: "Микросервисы", href: "/services", sortOrder: 1, parentId: "header-station-tools" },
  { id: "header-avito", label: "Авито", href: "/avito", sortOrder: 2, parentId: "header-station-tools" },
  { id: "header-shpargalka", label: "Шпаргалка", href: "/shpargalka", sortOrder: 3, parentId: "header-station-tools" },

  // Научиться
  { id: "header-agent-engineering", label: "Инженерия агентов", href: "/agent-engineering", sortOrder: 0, parentId: "header-station-learn" },
  { id: "header-ai-skills", label: "AI Skills", href: "/ai-skills", sortOrder: 1, parentId: "header-station-learn" },
  { id: "header-video", label: "Видео", href: "/video", sortOrder: 2, parentId: "header-station-learn" },
  { id: "header-blog", label: "Блог", href: "/blog", sortOrder: 3, parentId: "header-station-learn" },
  { id: "header-glossary", label: "Глоссарий", href: "/glossary", sortOrder: 4, parentId: "header-station-learn" },
  { id: "header-agent-engineering-grok-bot", label: "Grok Bot", href: "/agent-engineering/grok-bot", sortOrder: 0, parentId: "header-agent-engineering" },
];

const KNOWN_IDS = new Set([...HEADER_ROOTS, ...HEADER_SPOKES].map((item) => item.id));

async function upsertItem(db: Awaited<ReturnType<typeof getDb>>, item: MenuSeed) {
  await db.menuItem.upsert({
    where: { id: item.id },
    create: {
      id: item.id,
      label: item.label,
      href: item.href,
      sortOrder: item.sortOrder,
      location: "header",
      isActive: true,
      parentId: item.parentId,
    },
    update: {
      label: item.label,
      href: item.href,
      sortOrder: item.sortOrder,
      location: "header",
      isActive: true,
      parentId: item.parentId,
    },
  });
  console.log("upsert", item.id, item.parentId ?? "ROOT", item.href);
}

async function main() {
  const db = await getDb();

  for (const item of HEADER_ROOTS) {
    await upsertItem(db, item);
  }
  for (const item of HEADER_SPOKES) {
    await upsertItem(db, item);
  }

  const extraRoots = await db.menuItem.findMany({
    where: {
      location: "header",
      parentId: null,
      isActive: true,
      id: { notIn: HEADER_ROOTS.map((item) => item.id) },
    },
  });
  for (const item of extraRoots) {
    await db.menuItem.update({ where: { id: item.id }, data: { isActive: false } });
    console.log("deactivate extra root", item.id, item.label, item.href);
  }

  const knownHrefs = new Set([...HEADER_ROOTS, ...HEADER_SPOKES].map((item) => item.href));
  const dupes = await db.menuItem.findMany({
    where: {
      location: "header",
      isActive: true,
      href: { in: [...knownHrefs] },
      id: { notIn: [...KNOWN_IDS] },
    },
  });
  for (const item of dupes) {
    await db.menuItem.update({ where: { id: item.id }, data: { isActive: false } });
    console.log("deactivate duplicate", item.id, item.label, item.href);
  }

  const legacy = await db.menuItem.findMany({
    where: {
      location: "header",
      OR: [
        { href: { startsWith: "/blueprints" } },
        { label: { contains: "Blueprint", mode: "insensitive" } },
        { label: { equals: "Готовые проекты", mode: "insensitive" } },
        { sourceType: "blueprint" },
      ],
    },
  });
  for (const item of legacy) {
    if (item.isActive) {
      await db.menuItem.update({ where: { id: item.id }, data: { isActive: false } });
      console.log("deactivate legacy", item.id, item.label, item.href);
    }
  }

  const header = await db.menuItem.findMany({
    where: { location: "header", parentId: null, isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      label: true,
      href: true,
      sortOrder: true,
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, label: true, href: true },
      },
    },
  });
  console.log("active header stations:", JSON.stringify(header, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
