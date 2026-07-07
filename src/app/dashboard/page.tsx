import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, Zap, Target } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  
  const userId = (session.user as any).id;
  const db = await getDb();
  
  const [projects, totalDecisions] = await Promise.all([
    db.project.findMany({ where: { userId }, include: { blueprint: true, decisions: { include: { decision: true } } }, orderBy: { createdAt: "desc" } }),
    db.decision.count(),
  ]);

  const totalDone = projects.reduce((s, p) => s + p.decisions.filter(d => d.status === "done").length, 0);
  const totalXp = projects.reduce((s, p) => s + p.decisions.filter(d => d.status === "done").reduce((ss, d) => ss + d.decision.xpReward, 0), 0);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-secondary)", minHeight: "100dvh" }}>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>Личный кабинет</h1>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)", fontSize: "var(--text-s)" }}>
          Добро пожаловать, {session.user?.name || "AI Инженер"}!
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "var(--space-s)", marginBottom: "var(--space-xl)" }}>
          {[
            { label: "Проектов", value: projects.length, icon: <Target size={18} /> },
            { label: "Решений", value: totalDone + " / " + totalDecisions, icon: <BarChart3 size={18} /> },
            { label: "XP", value: totalXp, icon: <Zap size={18} /> },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: "center" }}>
              <div style={{ color: "var(--color-accent)", marginBottom: "var(--space-xs)" }}>{s.icon}</div>
              <div style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Мои проекты</h2>
        {projects.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
            <p style={{ color: "var(--color-text-tertiary)", marginBottom: "var(--space-m)" }}>У вас пока нет проектов</p>
            <Link href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>Выбрать шаблон</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {projects.map(p => (
              <Link key={p.id} href={`/${p.blueprint.slug}`} className="card card-hover" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "var(--space-m)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Target size={20} color="var(--color-accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.blueprint.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    {p.decisions.filter(d => d.status === "done").length} из {totalDecisions} решений
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--color-accent)" }}>
                  {Math.round((p.decisions.filter(d => d.status === "done").length / Math.max(1, totalDecisions)) * 100)}%
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
