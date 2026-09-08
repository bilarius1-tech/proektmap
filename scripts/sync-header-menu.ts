import { getDb } from "../src/lib/db/index";

/** Стабильные ID ключевых пунктов — чтобы агенты и сиды не плодили дубли. */
const ESSENTIAL_HEADER = [
  { id: "header-resheniya", label: "Готовые решения", href: "/resheniya", sortOrder: 0 },
  { id: "header-arsenal", label: "Нейро каталог", href: "/arsenal", sortOrder: 1 },
  { id: "header-avito", label: "Авито", href: "/avito", sortOrder: 2 },
  { id: "header-sitemap", label: "Карта сайта", href: "/sitemap", sortOrder: 3 },
] as const;

async function main() {
  const db = await getDb();

  for (const item of ESSENTIAL_HEADER) {
    await db.menuItem.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        location: "header",
        isActive: true,
        parentId: null,
      },
      update: {
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        location: "header",
        isActive: true,
        parentId: null,
      },
    });
    console.log("upsert", item.id, item.href);
  }

  // Деактивируем дубли тех же URL (другие id)
  const essentialHrefs = ESSENTIAL_HEADER.map((i) => i.href);
  const essentialIds = ESSENTIAL_HEADER.map((i) => i.id);
  const dupes = await db.menuItem.findMany({
    where: {
      location: "header",
      parentId: null,
      href: { in: [...essentialHrefs] },
      id: { notIn: [...essentialIds] },
    },
  });
  for (const d of dupes) {
    await db.menuItem.update({ where: { id: d.id }, data: { isActive: false } });
    console.log("deactivate duplicate", d.id, d.label, d.href);
  }

  // Legacy Blueprint в шапке — скрыть
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

  // Инженерия агентов — отдельный образовательный трек (не essential-core, но стабильный id)
  await db.menuItem.upsert({
    where: { id: "header-agent-engineering" },
    create: {
      id: "header-agent-engineering",
      label: "Инженерия агентов",
      href: "/agent-engineering",
      sortOrder: 4,
      location: "header",
      isActive: true,
      parentId: null,
    },
    update: {
      label: "Инженерия агентов",
      href: "/agent-engineering",
      location: "header",
      isActive: true,
      parentId: null,
    },
  });
  console.log("upsert header-agent-engineering /agent-engineering");

  await db.menuItem.upsert({
    where: { id: "header-ai-skills" },
    create: {
      id: "header-ai-skills",
      label: "AI Skills",
      href: "/ai-skills",
      sortOrder: 5,
      location: "header",
      isActive: true,
      parentId: null,
    },
    update: {
      label: "AI Skills",
      href: "/ai-skills",
      location: "header",
      isActive: true,
      parentId: null,
    },
  });
  console.log("upsert header-ai-skills /ai-skills");

  await db.menuItem.upsert({
    where: { id: "header-project-vault" },
    create: {
      id: "header-project-vault",
      label: "Project Vault",
      href: "/project-vault",
      sortOrder: 5,
      location: "header",
      isActive: true,
      parentId: null,
    },
    update: {
      label: "Project Vault",
      href: "/project-vault",
      location: "header",
      isActive: true,
      parentId: null,
    },
  });
  console.log("upsert header-project-vault /project-vault");

  await db.menuItem.upsert({
    where: { id: "header-project-vault-reverans" },
    create: {
      id: "header-project-vault-reverans",
      label: "Реверанс",
      href: "/project-vault/reverans",
      sortOrder: 0,
      location: "header",
      isActive: true,
      parentId: "header-project-vault",
    },
    update: {
      label: "Реверанс",
      href: "/project-vault/reverans",
      location: "header",
      isActive: true,
      parentId: "header-project-vault",
    },
  });
  console.log("upsert header-project-vault-reverans");

  await db.menuItem.upsert({
    where: { id: "header-video" },
    create: {
      id: "header-video",
      label: "Видео",
      href: "/video",
      sortOrder: 6,
      location: "header",
      isActive: true,
      parentId: null,
    },
    update: {
      label: "Видео",
      href: "/video",
      location: "header",
      isActive: true,
      parentId: null,
    },
  });
  console.log("upsert header-video /video");

  // Предпочтительный порядок корней шапки по href (остальные — после)
  const preferredHrefs = [
    "/resheniya",
    "/agent-engineering",
    "/ai-skills",
    "/project-vault",
    "/video",
    "/arsenal",
    "/avito",
    "/sitemap",
    "/blog",
    "/ai-tools",
    "/sandbox",
    "/ai-workshop",
  ];
  const roots = await db.menuItem.findMany({
    where: { location: "header", parentId: null, isActive: true },
  });
  const remaining = [...roots];
  const ordered: typeof roots = [];
  for (const href of preferredHrefs) {
    const idx = remaining.findIndex((r) => r.href === href);
    if (idx >= 0) ordered.push(...remaining.splice(idx, 1));
  }
  ordered.push(...remaining.sort((a, b) => a.sortOrder - b.sortOrder));
  for (let i = 0; i < ordered.length; i++) {
    await db.menuItem.update({ where: { id: ordered[i].id }, data: { sortOrder: i } });
  }

  const header = await db.menuItem.findMany({
    where: { location: "header", parentId: null, isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, label: true, href: true, sortOrder: true },
  });
  console.log("active header roots:", JSON.stringify(header, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
