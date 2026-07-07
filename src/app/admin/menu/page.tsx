import { getDb } from "@/lib/db";

export default async function AdminMenuPage() {
  const db = await getDb();
  const items = await db.menuItem.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Меню</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>Управление пунктами навигации</p>
        </div>
      </div>

      <div className="card" style={{ padding: "var(--space-l)" }}>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)", marginBottom: "var(--space-m)" }}>
          Сейчас меню управляется через базу данных. Чтобы добавить пункт — используйте API или отредактируйте seed.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          {items.map(item => (
            <div key={item.id} style={{ padding: "var(--space-s)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-m)" }}>
              <div style={{ fontWeight: 600 }}>{item.label} → {item.href}</div>
              {item.children.length > 0 && (
                <div style={{ marginTop: "var(--space-xs)", paddingLeft: "var(--space-m)", display: "flex", flexDirection: "column", gap: 2 }}>
                  {item.children.map(child => (
                    <div key={child.id} style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>
                      ↳ {child.label} → {child.href}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
