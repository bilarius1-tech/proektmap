import { getDb } from "@/lib/db";
import Link from "next/link";
import { GitBranch, Users, FileText, DollarSign, TrendingUp, Clock, MessageCircle, AlertTriangle, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await getDb();

  const [blueprints, users, posts, russianAI, tools] = await Promise.all([
    db.blueprint.count(),
    db.user.count(),
    db.blogPost.count(),
    db.russianAIProject.count({ where: { isPublished: true } }),
    db.aITool.count({ where: { isActive: true } }),
  ]);

  // Today's stats
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const newUsersToday = await db.user.count({ where: { createdAt: { gte: today } } });
  const newPostsToday = await db.blogPost.count({ where: { createdAt: { gte: today } } });

  // Last 7 days for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return { start: d, end: next, label: d.toLocaleDateString("ru", { weekday: "short" }) };
  }).reverse();

  const userChart: { label: string; count: number }[] = [];
  for (const day of last7Days) {
    const count = await db.user.count({ where: { createdAt: { gte: day.start, lt: day.end } } });
    userChart.push({ label: day.label, count });
  }
  const maxUsers = Math.max(...userChart.map(d => d.count), 1);

  // Pro users
  const proUsers = await db.user.count({ where: { subscription: "pro" } });
  
  // Payments total
  const payments = await db.payment.aggregate({ where: { status: "completed" }, _sum: { amount: true } });
  const revenue = (payments._sum.amount || 0) / 100;

  // Recent users
  const recentUsers = await db.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true, avatar: true } });

  // Recent posts
  const recentPosts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true }, where: { status: "published" } });

  return (
    <div style={{ padding: "var(--space-xl)", maxWidth: 1100 }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, margin: "0 0 var(--space-xs)" }}>📊 Дашборд проекта</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>
          Сегодня: {newUsersToday} новых пользователей · {newPostsToday} новых постов
        </p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        <StatCard icon={<Users size={20} />} label="Пользователи" value={users} sub={`+${newUsersToday} сегодня`} href="/admin/users" color="#3B82F6" />
        <StatCard icon={<GitBranch size={20} />} label="Blueprint'ы" value={blueprints} sub="готовых проектов" href="/admin/blueprints" color="#0FB880" />
        <StatCard icon={<FileText size={20} />} label="Посты" value={posts} sub={`+${newPostsToday} сегодня`} href="/admin/blog" color="#8B5CF6" />
        <StatCard icon={<DollarSign size={20} />} label="Выручка" value={`${revenue} ₽`} sub={`${proUsers} Pro`} href="/admin/billing" color="#F59E0B" />
        <StatCard icon={<AlertTriangle size={20} />} label="Инструменты" value={tools} sub="AI Tools" href="/admin/ai-tools" color="#EF4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        {/* CHART: Users per day */}
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "var(--space-xl)" }}>
          <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-l)" }}>📈 Новые пользователи (7 дней)</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
            {userChart.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)" }}>{d.count || ""}</span>
                <div style={{
                  width: "100%", maxWidth: 40,
                  height: `${Math.max((d.count / maxUsers) * 140, 4)}px`,
                  background: d.count > 0 ? "var(--color-accent)" : "var(--color-border-light)",
                  borderRadius: "var(--radius-s) var(--radius-s) 0 0",
                  transition: "height 0.3s",
                  minHeight: 4,
                }} />
                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT USERS */}
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700 }}>👥 Новые пользователи</h2>
            <Link href="/admin/users" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>Все →</Link>
          </div>
          {recentUsers.map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-s) 0", borderBottom: "1px solid var(--color-border-light)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {u.name?.[0] || u.email[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>{u.name || u.email.split("@")[0]}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{new Date(u.createdAt).toLocaleDateString("ru")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK LINKS + RECENT POSTS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--space-xl)" }}>
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "var(--space-xl)" }}>
          <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>⚡ Быстрые действия</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Управление Blueprint'ами", href: "/admin/blueprints", emoji: "🗺️" },
              { label: "Биллинг и подписки", href: "/admin/billing", emoji: "💳" },
              { label: "Российский AI — каталог", href: "/admin/russian-ai", emoji: "🇷🇺" },
              { label: "Редактор меню", href: "/admin/menu", emoji: "🧭" },
              { label: "Пользователи", href: "/admin/users", emoji: "👥" },
              { label: "Блог — фиды и посты", href: "/admin/blog", emoji: "📝" },
              { label: "Настройки сайта", href: "/admin/settings", emoji: "⚙️" },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)",
                textDecoration: "none", color: "var(--color-text-primary)", fontSize: "var(--text-xs)", fontWeight: 500,
              }}>
                <span>{item.emoji}</span> {item.label} <ArrowRight size={12} style={{ marginLeft: "auto", color: "var(--color-text-tertiary)" }} />
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700 }}>📝 Последние посты</h2>
            <Link href="/admin/blog" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>Все →</Link>
          </div>
          {recentPosts.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-s) 0", borderBottom: "1px solid var(--color-border-light)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{new Date(p.createdAt).toLocaleDateString("ru")} · {p.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, href, color }: { icon: any; label: string; value: any; sub: string; href: string; color: string }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: "var(--space-m)", padding: "var(--space-l)",
      background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-l)", textDecoration: "none", color: "inherit",
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, fontFamily: "var(--font-heading)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{label}</div>
        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{sub}</div>
      </div>
    </Link>
  );
}
