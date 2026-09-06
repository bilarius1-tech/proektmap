/**
 * Упрощение мега-меню: плоские L2 → колонки (L2 группа + L3 ссылки).
 * Идемпотентно: по стабильным id.
 */
import { getDb } from "../src/lib/db/index";

const SANDBOX_PARENT = "Песочница";
const TOOLS_PARENT = "Инструменты";

type GroupDef = {
  id: string;
  label: string;
  href: string;
  emoji?: string;
  links: { id: string; label: string; href: string; emoji?: string }[];
};

const SANDBOX_GROUPS: GroupDef[] = [
  {
    id: "sandbox-group-design",
    label: "Дизайн",
    href: "/sandbox/design-system",
    emoji: "🎨",
    links: [
      { id: "sandbox-l3-design-system", label: "Дизайн-система", href: "/sandbox/design-system" },
      { id: "sandbox-l3-ui-patterns", label: "UI-Атлас", href: "/ui-patterns" },
      { id: "sandbox-l3-creative", label: "Креативная библиотека", href: "/sandbox/creative-library" },
      { id: "sandbox-l3-vibe-blocks", label: "Вайб-блоки", href: "/sandbox/vibe-blocks" },
    ],
  },
  {
    id: "sandbox-group-rf",
    label: "AI в РФ",
    href: "/russian-ai-stack",
    emoji: "🇷🇺",
    links: [
      { id: "sandbox-l3-no-vpn", label: "AI без VPN", href: "/ai-without-vpn" },
      { id: "sandbox-l3-rf-stack", label: "Российский AI-стек", href: "/russian-ai-stack" },
      { id: "sandbox-l3-russian-ai", label: "Российский AI", href: "/russian-ai" },
    ],
  },
  {
    id: "sandbox-group-practice",
    label: "Практика",
    href: "/sandbox",
    emoji: "⚡",
    links: [
      { id: "sandbox-l3-telegram", label: "Telegram-хаб", href: "/telegram" },
      { id: "sandbox-l3-workshop", label: "AI цех", href: "/ai-workshop" },
      { id: "sandbox-l3-vibecraft", label: "Vibe Coding", href: "/vibecraft" },
    ],
  },
];

const TOOLS_GROUPS: GroupDef[] = [
  {
    id: "tools-group-catalog",
    label: "Каталоги",
    href: "/ai-tools",
    links: [
      { id: "tools-l3-ai-tools", label: "AI-инструменты", href: "/ai-tools" },
      { id: "tools-l3-mcp", label: "MCP", href: "/mcp" },
      { id: "tools-l3-models", label: "AI-модели", href: "/models" },
      { id: "tools-l3-services", label: "Микросервисы", href: "/services" },
    ],
  },
  {
    id: "tools-group-knowledge",
    label: "Знания",
    href: "/skills",
    links: [
      { id: "tools-l3-skills", label: "Карта способностей", href: "/skills" },
      { id: "tools-l3-glossary", label: "Глоссарий", href: "/glossary" },
      { id: "tools-l3-prompts", label: "Промпты", href: "/prompts" },
      { id: "tools-l3-patterns", label: "Паттерны", href: "/patterns" },
    ],
  },
];

async function restructure(parentLabel: string, groups: GroupDef[]) {
  const db = await getDb();
  const parent = await db.menuItem.findFirst({
    where: { location: "header", parentId: null, label: parentLabel, isActive: true },
  });
  if (!parent) {
    console.log("skip: no parent", parentLabel);
    return;
  }

  // Deactivate old flat L2 children (keep history, avoid duplicates)
  const oldKids = await db.menuItem.findMany({ where: { parentId: parent.id } });
  for (const kid of oldKids) {
    if (groups.some((g) => g.id === kid.id)) continue;
    // If kid is becoming an L3 under a group id we know — deactivate flat copy
    const isMigratedHref = groups.some((g) => g.links.some((l) => l.href === kid.href));
    if (isMigratedHref || !groups.some((g) => g.id === kid.id)) {
      if (!groups.some((g) => g.id === kid.id)) {
        await db.menuItem.update({ where: { id: kid.id }, data: { isActive: false } });
        console.log("deactivate flat L2", kid.label, kid.href);
      }
    }
  }

  let sort = 0;
  for (const group of groups) {
    await db.menuItem.upsert({
      where: { id: group.id },
      create: {
        id: group.id,
        label: group.label,
        href: group.href,
        parentId: parent.id,
        sortOrder: sort,
        location: "header",
        isActive: true,
        emoji: group.emoji || null,
      },
      update: {
        label: group.label,
        href: group.href,
        parentId: parent.id,
        sortOrder: sort,
        location: "header",
        isActive: true,
        emoji: group.emoji || null,
      },
    });
    console.log("upsert group", group.label);

    let linkSort = 0;
    for (const link of group.links) {
      await db.menuItem.upsert({
        where: { id: link.id },
        create: {
          id: link.id,
          label: link.label,
          href: link.href,
          parentId: group.id,
          sortOrder: linkSort,
          location: "header",
          isActive: true,
          emoji: link.emoji || null,
        },
        update: {
          label: link.label,
          href: link.href,
          parentId: group.id,
          sortOrder: linkSort,
          location: "header",
          isActive: true,
          emoji: link.emoji || null,
        },
      });
      linkSort += 1;
    }
    sort += 1;
  }
}

async function main() {
  await restructure(SANDBOX_PARENT, SANDBOX_GROUPS);
  await restructure(TOOLS_PARENT, TOOLS_GROUPS);
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
