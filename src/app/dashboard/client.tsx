"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown, Zap, Shield, FileText, BookOpen, Users, Edit, Eye,
  TrendingUp, Award, Star, ArrowRight, Plus, MessageCircle, Globe,
  Layers, Flame, Clock, ExternalLink, Settings, User as UserIcon,
  Trash2, AlertCircle, Sparkles, CheckCircle, Send, Github
} from "lucide-react";
import EditProfileForm from "./edit-profile";

const STATUS_ICONS: Record<string, string> = {
  junior: "🌱",
  middle: "⚡",
  senior: "🔥",
  architect: "👑",
};

export default function DashboardClient({
  user,
  aiProjects = [],
  posts,
  blueprints,
  completedIds,
  stats,
  isAdmin,
  isPro,
}: any) {
  const router = useRouter();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [projectList, setProjectList] = useState(aiProjects);

  const totalLikes = projectList.reduce((acc: number, p: any) => acc + (p.likesCount || 0), 0);
  const totalViews = projectList.reduce((acc: number, p: any) => acc + (p.viewCount || 0), 0);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Удалить этот проект из вашего портфолио?")) return;
    const res = await fetch(`/api/ai-projects?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjectList(projectList.filter((p: any) => p.id !== id));
      router.refresh();
    }
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 20px 80px", fontFamily: "var(--font-body)" }}>
      
      {/* 1. TOP HERO CARD — User info & Quick Actions */}
      <div
        style={{
          background: "var(--color-surface, #fff)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-l)",
          padding: "32px",
          marginBottom: "var(--space-xl)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          
          {/* Avatar & Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: user.avatar ? `url(${user.avatar}) center/cover` : "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 26,
                fontWeight: 800,
                flexShrink: 0,
                border: "2px solid var(--color-border)",
              }}
            >
              {!user.avatar && (user.name || user.email).slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                <h1 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 800, margin: 0, fontFamily: "var(--font-heading)" }}>
                  {user.name || user.email?.split("@")[0]}
                </h1>
                <span>{STATUS_ICONS[user.status || "junior"]}</span>
                {isAdmin && (
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "var(--color-accent)", color: "white", fontSize: 10, fontWeight: 700 }}>
                    АДМИНИСТРАТОР
                  </span>
                )}
                {isPro && !isAdmin && (
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(15, 184, 128, 0.1)", color: "var(--color-accent)", fontSize: 10, fontWeight: 700 }}>
                    👑 PRO
                  </span>
                )}
              </div>

              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 700, marginBottom: 4 }}>
                {user.headline || "Вайбкодер & AI-инженер"}
              </div>

              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span>{user.email}</span>
                {user.telegram && <span>&middot; TG: @{user.telegram}</span>}
                {user.publicProfile ? (
                  <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>&middot; 🔓 Публичный профиль</span>
                ) : (
                  <span style={{ color: "var(--color-text-tertiary)" }}>&middot; 🔒 Приватный профиль</span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link
              href={`/profile/${user.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                borderRadius: 6,
                background: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Eye size={14} /> Моё публичное портфолио
            </Link>

            <button
              onClick={() => setShowEditProfile(!showEditProfile)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                borderRadius: 6,
                background: showEditProfile ? "var(--color-accent)" : "var(--color-bg-primary)",
                color: showEditProfile ? "#fff" : "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Settings size={14} /> {showEditProfile ? "Закрыть редактор" : "Настроить профиль"}
            </button>

            <Link
              href="/projects/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                borderRadius: 6,
                background: "var(--color-accent)",
                color: "#fff",
                border: "none",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Plus size={15} /> + Загрузить работу
            </Link>
          </div>
        </div>

        {/* Edit profile slide-down panel */}
        {showEditProfile && (
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--color-border)" }}>
            <EditProfileForm user={user} />
          </div>
        )}

        {/* Stats Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--color-border)" }}>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--color-accent)" }}>{user.xp}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>XP опыта</div>
          </div>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{projectList.length}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Работ в портфолио</div>
          </div>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-heading)", color: "#ef4444" }}>{totalLikes}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>🔥 Респектов</div>
          </div>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{totalViews}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Просмотров</div>
          </div>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{posts.length}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Статей в блоге</div>
          </div>
        </div>
      </div>

      {/* 2. MY PORTFOLIO SECTION (Behance for Vibe Coders) */}
      <div style={{ marginBottom: "var(--space-xxl)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-l)", fontWeight: 800, margin: "0 0 2px", fontFamily: "var(--font-heading)" }}>
              🎨 Моё портфолио вайбкодера
            </h2>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>
              Ваши опубликованные кейсы, AI-рецепты и продукты
            </p>
          </div>

          <Link
            href="/projects/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 6,
              background: "var(--color-accent)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
            }}
          >
            <Plus size={14} /> Добавить работу
          </Link>
        </div>

        {projectList.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", background: "var(--color-surface, #fff)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-l)" }}>
            <Layers size={36} color="var(--color-text-tertiary)" style={{ margin: "0 auto 10px" }} />
            <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: 4 }}>
              У вас пока нет загруженных работ в портфолио
            </h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", maxWidth: 440, margin: "0 auto 16px", lineHeight: 1.6 }}>
              Опубликуйте первый проект: Telegram-бота, SaaS или сайт, собранный с помощью нейросетей, и станьте частью сообщества вайбкодеров.
            </p>
            <Link
              href="/projects/new"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", borderRadius: 6, fontSize: "var(--text-xs)", fontWeight: 700 }}
            >
              <Plus size={14} /> Опубликовать работу (+150 XP)
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 20 }}>
            {projectList.map((proj: any) => (
              <div
                key={proj.id}
                style={{
                  background: "var(--color-surface, #fff)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-m)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Cover & Status */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/10",
                    background: proj.screenshot ? `url(${proj.screenshot}) center/cover` : "linear-gradient(135deg, #0f172a, #1e293b)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      background: "rgba(0,0,0,0.7)",
                      color: "#fff",
                    }}
                  >
                    {proj.category}
                  </span>

                  {/* Moderation status badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      background: proj.moderationStatus === "pending"
                        ? "rgba(245, 158, 11, 0.9)"
                        : proj.moderationStatus === "rejected"
                        ? "rgba(239, 68, 68, 0.9)"
                        : "rgba(15, 184, 128, 0.9)",
                      color: "#fff",
                    }}
                  >
                    {proj.moderationStatus === "pending"
                      ? "⏳ На модерации"
                      : proj.moderationStatus === "rejected"
                      ? "❌ Отклонен"
                      : "✅ Одобрен"}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "var(--text-s)", fontWeight: 700, margin: "0 0 4px", lineHeight: 1.3 }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 12px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {proj.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: 10, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span>🔥 {proj.likesCount || 0}</span>
                      <span>👁️ {proj.viewCount || 0}</span>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      {proj.slug && (
                        <Link
                          href={`/ai-workshop/${proj.slug}`}
                          title="Открыть кейс"
                          style={{ color: "var(--color-text-secondary)", padding: 4 }}
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        title="Удалить работу"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. ADMIN PANEL (if admin) */}
      {isAdmin && (
        <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-accent)", borderRadius: "var(--radius-l)", padding: "24px 28px", marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Shield size={20} color="var(--color-accent)" />
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: 0 }}>
              Панель администратора
            </h2>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { label: "🏭 Модерация AI Цеха", href: "/admin/ai-projects" },
              { label: "🛠️ AI-инструменты", href: "/admin/ai-tools" },
              { label: "👥 Пользователи", href: "/admin/users" },
              { label: "📝 Блог", href: "/admin/blog" },
              { label: "📘 Blueprints", href: "/admin/blueprints" },
              { label: "📖 Глоссарий", href: "/admin/glossary" },
              { label: "📋 Меню", href: "/admin/menu" },
              { label: "⚙️ Настройки", href: "/admin/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
            <StatCard icon={<Users size={16} style={{ color: "var(--color-accent)" }} />} value={stats.totalUsers} label="Пользователей" />
            <StatCard icon={<FileText size={16} style={{ color: "#6c63ff" }} />} value={stats.totalPosts} label="Постов" />
            <StatCard icon={<BookOpen size={16} style={{ color: "#0fb880" }} />} value={stats.totalDecisions} label="Решений" />
            <StatCard icon={<Globe size={16} style={{ color: "#f59e0b" }} />} value={blueprints.length} label="Blueprint'ов" />
          </div>
        </div>
      )}

      {/* 4. MY ARTICLES */}
      <div style={{ marginBottom: "var(--space-xxl)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 800, margin: 0, fontFamily: "var(--font-heading)" }}>
            📝 Мои публикации в блоге
          </h2>
          <button
            onClick={() => router.push("/admin/blog/new")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 6,
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✍️ Написать статью
          </button>
        </div>

        {posts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
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
          </div>
        ) : (
          <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
            У вас пока нет статей. <Link href="/admin/blog" style={{ color: "var(--color-accent)" }}>Написать первую →</Link>
          </div>
        )}
      </div>

    </div>
  );
}

function StatCard({ icon, value, label }: any) {
  return (
    <div style={{
      padding: "var(--space-m)", background: "var(--color-bg-primary)",
      borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {icon}
      <div>
        <div style={{ fontSize: "var(--text-m)", fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{label}</div>
      </div>
    </div>
  );
}
