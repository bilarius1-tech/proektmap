"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown, Zap, Shield, FileText, BookOpen, Users, Edit, Eye,
  TrendingUp, Award, Star, ArrowRight, Plus, MessageCircle, Globe,
} from "lucide-react";
import EditProfileForm from "./edit-profile";

const STATUS_ICONS: Record<string, string> = { junior: "🌱", middle: "⚡", senior: "🔥", architect: "👑" };

export default function DashboardClient({ user, posts, blueprints, completedIds, stats, isAdmin, isPro }: any) {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-xl)", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: user.avatar ? `url(${user.avatar}) center/cover` : "var(--color-accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 22, fontWeight: 800, flexShrink: 0,
          }}>
            {!user.avatar && (user.name || user.email).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: 2 }}>
              {user.name || user.email?.split("@")[0]} {STATUS_ICONS[user.status || "junior"]}
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>
              {user.email}
              {isAdmin && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 99, background: "var(--color-accent)", color: "white", fontSize: 10, fontWeight: 700 }}>АДМИН</span>}
              {isPro && !isAdmin && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 99, background: "var(--color-warning-light)", color: "var(--color-warning)", fontSize: 10, fontWeight: 700 }}>PRO</span>}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!isPro && (
            <button onClick={() => router.push("/dashboard/billing")} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: "var(--radius-m)",
              background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer",
            }}><Crown size={14} /> Pro за 300₽</button>
          )}
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        <StatCard icon={<Zap size={18} style={{ color: "var(--color-warning)" }} />} value={user.xp} label="XP" />
        <StatCard icon={<Award size={18} style={{ color: "var(--color-accent)" }} />} value={user.level || "junior"} label="Уровень" />
        <StatCard icon={<FileText size={18} style={{ color: "#6c63ff" }} />} value={posts.length} label="Статей" />
        <StatCard icon={<Star size={18} style={{ color: "#f59e0b" }} />} value={completedIds.length} label="Решений" />
        {user.streak > 0 && <StatCard icon={<TrendingUp size={18} style={{ color: "#e53e3e" }} />} value={`${user.streak} дн.`} label="Streak" />}
      </div>

      {/* SUBSCRIPTION STATUS */}
      <div style={{
        display: "flex", gap: "var(--space-m)", marginBottom: "var(--space-xl)", flexWrap: "wrap",
      }}>
        <div style={{
          flex: 1, minWidth: 260, padding: "var(--space-l)", borderRadius: "var(--radius-l)",
          border: "1px solid " + (isPro ? "var(--color-accent)" : "var(--color-border)"),
          background: isPro ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {isPro ? <Crown size={20} style={{ color: "var(--color-accent)" }} /> : <BookOpen size={20} style={{ color: "var(--color-text-tertiary)" }} />}
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{isPro ? "Pro подписка" : "Бесплатный доступ"}</div>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            {isPro
              ? "Полный доступ: AI-консультант, все Blueprint'ы, все этапы."
              : "Открыты первые 3 этапа каждого Blueprint'а. AI-консультант недоступен."}
          </div>
        </div>
      </div>

      {/* MY BLUEPRINTS */}
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📘 Мои Blueprint'ы</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        {blueprints.map((bp: any) => {
          const bpDone = bp._count?.stages || 0;
          const total = bp.totalDecisions || 1;
          const progress = Math.round((completedIds.length / Math.max(total, 1)) * 100);
          return (
            <Link key={bp.id} href={`/${bp.slug}`} style={{
              padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)",
              border: "1px solid var(--color-border-light)", textDecoration: "none", color: "inherit",
            }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 8 }}>{bp.title}</div>
              <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2, transition: "width 0.4s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                <span>{bp.totalDecisions} решений</span>
                <span>{bp.totalXp} XP</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* MY BLOG */}
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📝 Мои статьи</h2>
      {posts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginBottom: "var(--space-xl)" }}>
          {posts.map((p: any) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/blog/${p.slug}`} style={{ fontWeight: 600, fontSize: "var(--text-s)", color: "inherit", textDecoration: "none" }}>{p.title}</Link>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                  {p.category?.name} · {new Date(p.publishedAt || p.createdAt).toLocaleDateString("ru")}
                  {p.status !== "published" && <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 99, background: "var(--color-warning-light)", color: "var(--color-warning)", fontSize: 9 }}>{p.status}</span>}
                </div>
              </div>
              <Link href={`/blog/${p.slug}`} style={{ color: "var(--color-text-tertiary)", padding: 4 }}><Eye size={14} /></Link>
              <a href={`/admin/blog?edit=${p.id}`} style={{ color: "var(--color-text-tertiary)", padding: 4 }}><Edit size={14} /></a>
            </div>
          ))}
          <Link href="/blog" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>Все статьи →</Link>
        </div>
      ) : (
        <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", textAlign: "center", marginBottom: "var(--space-xl)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          У вас пока нет статей. <Link href="/admin/blog" style={{ color: "var(--color-accent)" }}>Написать первую →</Link>
        </div>
      )}

      {/* ADMIN PANEL */}
      {isAdmin && (
        <>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>🛡️ Админ-панель</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
            {[
              { label: "Blueprints", href: "/admin/blueprints" },
              { label: "Блог", href: "/admin/blog" },
              { label: "Пользователи", href: "/admin/users" },
              { label: "Промпты", href: "/admin/prompts" },
              { label: "Глоссарий", href: "/admin/glossary" },
              { label: "Меню", href: "/admin/menu" },
              { label: "AI Radar", href: "/admin/ai-radar" },
              { label: "Настройки", href: "/admin/settings" },
            ].map(item => (
              <a key={item.href} href={item.href} style={{
                padding: "6px 14px", borderRadius: "var(--radius-s)", background: "white",
                border: "1px solid var(--color-accent)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, textDecoration: "none",
              }}>{item.label}</a>
            ))}
          </div>

          {/* Global stats */}
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📊 Статистика проекта</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
            <StatCard icon={<Users size={18} style={{ color: "var(--color-accent)" }} />} value={stats.totalUsers} label="Пользователей" />
            <StatCard icon={<FileText size={18} style={{ color: "#6c63ff" }} />} value={stats.totalPosts} label="Постов" />
            <StatCard icon={<BookOpen size={18} style={{ color: "#0fb880" }} />} value={stats.totalDecisions} label="Решений" />
            <StatCard icon={<Globe size={18} style={{ color: "#f59e0b" }} />} value={blueprints.length} label="Blueprint'ов" />
          </div>
        </>
      )}

      {/* PROFILE EDIT */}
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>👤 Публичный профиль</h2>
      <div style={{ padding: "var(--space-l)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)", background: "white", marginBottom: "var(--space-xl)" }}>
        <EditProfileForm user={user} />
      </div>

      {/* QUICK LINKS */}
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>🔗 Быстрые ссылки</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: "📘 Blueprints", href: "/corporate-website" },
          { label: "📝 Блог", href: "/blog" },
          { label: "📖 Глоссарий", href: "/glossary" },
          { label: "👥 Специалисты", href: "/specialists" },
          { label: "📚 Промпты", href: "/prompts" },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", fontSize: "var(--text-s)",
          }}>{item.label}</Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: any; value: any; label: string }) {
  return (
    <div style={{ padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", textAlign: "center" }}>
      <div style={{ marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: "var(--text-xl)", fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{label}</div>
    </div>
  );
}
