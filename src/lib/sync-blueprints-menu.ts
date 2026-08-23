import { getDb } from "@/lib/db";

const BLUEPRINTS_PARENT_ID = "blueprints-mega-menu";

// Sync all published Blueprints to menu_items
// Called after Blueprint create/update/delete
export async function syncBlueprintsToMenu() {
  const db = await getDb();

  // Ensure parent menu item exists
  let parent = await db.menuItem.findUnique({ where: { id: BLUEPRINTS_PARENT_ID } });
  if (!parent) {
    parent = await db.menuItem.create({
      data: {
        id: BLUEPRINTS_PARENT_ID,
        label: "🗺️ Карта роста",
        href: "/blueprints",
        location: "header",
        sortOrder: 2,
        isActive: true,
      },
    });
  }

  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, slug: true, icon: true, sortOrder: true },
  });

  // Get existing blueprint-linked menu items
  const existingItems = await db.menuItem.findMany({
    where: { sourceType: "blueprint" },
    select: { id: true, sourceId: true },
  });
  const existingMap = new Map(existingItems.map(i => [i.sourceId!, i.id]));

  for (const bp of blueprints) {
    const href = `/blueprints/${bp.slug}`;
    const emoji = iconToEmoji(bp.icon);

    if (existingMap.has(bp.id)) {
      // Update existing
      await db.menuItem.update({
        where: { id: existingMap.get(bp.id)! },
        data: {
          label: bp.title,
          href,
          sortOrder: bp.sortOrder,
          parentId: BLUEPRINTS_PARENT_ID,
          isActive: true,
          emoji,
        },
      });
      existingMap.delete(bp.id);
    } else {
      // Create new
      await db.menuItem.create({
        data: {
          label: bp.title,
          href,
          sortOrder: bp.sortOrder,
          parentId: BLUEPRINTS_PARENT_ID,
          location: "header",
          isActive: true,
          sourceType: "blueprint",
          sourceId: bp.id,
          emoji,
        },
      });
    }
  }

  // Delete menu items for unpublished/deleted Blueprints
  for (const [sourceId, menuId] of existingMap) {
    await db.menuItem.delete({ where: { id: menuId } }).catch(() => {});
  }

  return { created: blueprints.length, updated: 0, deleted: existingMap.size };
}

function iconToEmoji(icon: string): string {
  const map: Record<string, string> = {
    Globe: "🌐", Bot: "🤖", Users: "👥", Store: "🛒", ShoppingBag: "🛍️",
    Gamepad2: "🎮", Rocket: "🚀", MessageSquare: "💬", Brain: "🧠",
    Database: "🗄️", Package: "📦", ShoppingCart: "🛒", CreditCard: "💳",
    CheckCircle: "✅", Bell: "🔔", Shield: "🛡️", Home: "🏠", LayoutGrid: "📋",
    User: "👤", UserPlus: "👥", Kanban: "📊", Contact: "📇", CheckSquare: "☑️",
    FileText: "📄", BrainCircuit: "⚡", Banknote: "💵",
  };
  return map[icon] || "📄";
}
