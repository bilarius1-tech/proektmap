import { getDb } from "@/lib/db";

export default async function AdminDashboard() {
  const db = await getDb();
  const [blueprints, stages, decisions, users] = await Promise.all([
    db.blueprint.count(),
    db.stage.count(),
    db.decision.count(),
    db.user.count(),
  ]);

  const stats = [
    { label: "Blueprints", value: blueprints, href: "/admin/blueprints" },
    { label: "Этапы", value: stages, href: "/admin/stages" },
    { label: "Решения", value: decisions, href: "/admin/decisions" },
    { label: "Пользователи", value: users, href: "#" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-xxl)", marginBottom: "var(--space-xs)" }}>Админ-панель</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>Управление Blueprint'ами, этапами и решениями</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "var(--space-m)" }}>
        {stats.map(s => (
          <a key={s.label} href={s.href} className="card card-hover" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            <div style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginTop: "var(--space-xs)" }}>{s.value}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
