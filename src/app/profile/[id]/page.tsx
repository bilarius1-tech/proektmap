import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Award, Zap, Globe, Mail, CheckCircle } from "lucide-react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const db = await getDb();
  const user = await db.user.findFirst({
    where: { OR: [{ id }, { email: id?.includes("@") ? id : undefined }] },
    select: { name: true, email: true, bio: true, publicProfile: true },
  });
  if (!user || !user.publicProfile) return { title: "Профиль не найден" };
  return {
    title: `${user.name || user.email} — профиль на ProektMap`,
    description: user.bio || `Профиль ${user.name || user.email} на ProektMap`,
  };
}

const STATUS_LABELS: Record<string, string> = {
  junior: "🟢 Junior", middle: "🟡 Middle", senior: "🔴 Senior", lead: "💼 Lead",
};
const LEVEL_LABELS: Record<string, string> = {
  novice: "Новичок", builder: "Строитель", architect: "Архитектор", master: "Мастер",
};

export default async function ProfilePage({ params }: any) {
  const { id } = await params;
  const db = await getDb();
  const user = await db.user.findFirst({
    where: { OR: [{ id }, { email: id?.includes("@") ? id : undefined }] },
    include: {
      _count: { select: { projects: true, posts: true } },
      subscriptions: { where: { status: "active" }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!user) notFound();

  const projCount = user._count?.projects || 0;
  const postCount = user._count?.posts || 0;
  const sub = user.subscriptions?.[0];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", gap: "var(--space-xl)", alignItems: "flex-start", marginBottom: "var(--space-xl)" }}>
        <div style={{ width: 96, height: 96, borderRadius: "var(--radius-full)", background: user.avatar ? `url(${user.avatar}) center/cover` : "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0, border: "2px solid var(--color-border)" }}>
          {!user.avatar && (user.name?.[0] || user.email[0]).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 800, margin: "0 0 var(--space-xs)" }}>
            {user.name || user.email.split("@")[0]}
            {user.emailVerified && <span style={{ color: "var(--color-accent)", marginLeft: 8 }} title="Email подтверждён"><CheckCircle size={18} style={{ color: "var(--color-accent)", verticalAlign: "middle" }} /></span>}
          </h1>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
            {user.publicProfile && user.email && (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                <Mail size={12} /> {user.email}
              </span>
            )}
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                <Globe size={12} /> {user.website.replace("https://", "")}
              </a>
            )}
          </div>
          {user.bio && <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{user.bio}</p>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", textAlign: "center" }}>
          <div style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{user.xp}</div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>XP</div>
        </div>
        <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", textAlign: "center" }}>
          <div style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{projCount}</div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Проектов</div>
        </div>
        <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", textAlign: "center" }}>
          <div style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{postCount}</div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Постов</div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
        <span style={{ padding: "6px 14px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
          {STATUS_LABELS[user.status] || user.status}
        </span>
        <span style={{ padding: "6px 14px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
          📊 {LEVEL_LABELS[user.level] || user.level}
        </span>
        {sub && (
          <span style={{ padding: "6px 14px", background: "var(--color-accent-light)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-accent)" }}>
            👑 Pro {sub.expiresAt ? `до ${new Date(sub.expiresAt).toLocaleDateString("ru")}` : ""}
          </span>
        )}
        {user.publicProfile && (
          <span style={{ padding: "6px 14px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
            🔓 Публичный профиль
          </span>
        )}
      </div>

      {user.skills && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-s)" }}>Навыки</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {user.skills.split(",").filter(Boolean).map((s: string, i: number) => (
              <span key={i} style={{ padding: "4px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)" }}>
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {projCount > 0 && (
        <div style={{ paddingTop: "var(--space-l)", borderTop: "1px solid var(--color-border)" }}>
          <Link href={`/profile/${user.id}/projects`} style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>
            Проекты пользователя →
          </Link>
        </div>
      )}
    </div>
  );
}
