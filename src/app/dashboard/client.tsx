"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Crown, Zap, Shield, LogOut, Lock, ArrowRight } from "lucide-react";

interface User { name: string | null; email: string; role: string; subscription: string; xp: number; level: string; streak: number; }

export default function DashboardClient({ user, isAdmin, isPro }: { user: User; isAdmin: boolean; isPro: boolean }) {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-xl)", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: 4 }}>
            {user.name || user.email}
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>
            {user.email}
            {isAdmin && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 99, background: "var(--color-accent)", color: "white", fontSize: 10, fontWeight: 700 }}>АДМИН</span>}
          </p>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", background: "white", cursor: "pointer", fontSize: "var(--text-xs)" }}>
          <LogOut size={14} /> Выйти
        </button>
      </div>

      {/* Статус подписки */}
      <div style={{
        display: "flex", gap: "var(--space-m)", marginBottom: "var(--space-xl)", flexWrap: "wrap",
      }}>
        <div style={{
          flex: 1, minWidth: 220, padding: "var(--space-l)",
          borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)",
          background: isPro ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
          borderColor: isPro ? "var(--color-accent)" : "var(--color-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {isPro ? <Crown size={20} style={{ color: "var(--color-accent)" }} /> : <Lock size={20} style={{ color: "var(--color-text-tertiary)" }} />}
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>
              {isPro ? "Pro подписка активна" : "Бесплатный доступ"}
            </div>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 12, lineHeight: 1.6 }}>
            {isPro
              ? "Полный доступ: AI-консультант, все Blueprint'ы, библиотека промптов."
              : "Ограниченный доступ. AI-консультант недоступен. Оформите Pro для полного доступа."}
          </div>
          {!isPro && (
            <button onClick={() => router.push("/dashboard/billing")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
              Оформить Pro <ArrowRight size={14} />
            </button>
          )}
          {isAdmin && (
            <div style={{ marginTop: 8, fontSize: 10, color: "var(--color-accent)", fontWeight: 600 }}>
              Админ — доступ ко всем функциям без оплаты
            </div>
          )}
        </div>

        <div style={{
          flex: 1, minWidth: 200, padding: "var(--space-l)",
          borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Zap size={20} style={{ color: "var(--color-warning)" }} />
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{user.xp} XP</div>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            Уровень: <b>{user.level}</b> · Streak: {user.streak} дн.
          </div>
        </div>
      </div>

      {/* Админка */}
      {isAdmin && (
        <div style={{ padding: "var(--space-l)", borderRadius: "var(--radius-l)", border: "2px solid var(--color-accent)", background: "var(--color-accent-light)", marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Shield size={18} style={{ color: "var(--color-accent)" }} />
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>Админ-панель</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Blueprints", href: "/admin/blueprints" },
              { label: "Пользователи", href: "/admin/users" },
              { label: "Промпты", href: "/admin/prompts" },
              { label: "Категории", href: "/admin/prompt-cats" },
              { label: "Переменные", href: "/admin/prompt-vars" },
              { label: "Меню", href: "/admin/menu" },
              { label: "Рефералы", href: "/admin/referrals" },
              { label: "AI Radar", href: "/admin/ai-radar" },
              { label: "Настройки", href: "/admin/settings" },
                <button onClick={async () => { if (!confirm("Перезасеять БД? Все данные заменятся.")) return; const res = await fetch("/api/admin/reseed", { method: "POST" }); alert(res.ok ? "✅ БД перезасеяна!" : "❌ Ошибка: см. консоль"); }} style={{ padding: "6px 14px", borderRadius: "var(--radius-s)", background: "var(--color-error)", color: "white", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>🔄 Перезасеять БД</button>
            ].map(item => (
              <a key={item.href} href={item.href}
                style={{ padding: "6px 14px", borderRadius: "var(--radius-s)", background: "white", border: "1px solid var(--color-accent)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, textDecoration: "none" }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Быстрые ссылки */}
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Мои проекты</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        <a href="/corporate-website" style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--space-m)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", background: "white", textDecoration: "none", color: "inherit" }}>
          <span style={{ fontWeight: 700, fontSize: "var(--text-s)", flex: 1 }}>🏢 Корпоративный сайт</span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>11 этапов · 940 XP</span>
          <ArrowRight size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
        </a>
      </div>
    </div>
  );
}
