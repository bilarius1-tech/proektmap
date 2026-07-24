import Link from "next/link";
import { Check, Crown } from "lucide-react";

export const metadata = {
  title: "Тарифы — Карта роста",
  description: "Pro-тариф за 300 ₽/мес: AI-консультант DeepSeek, персональные промпты, безлимитный доступ. Бесплатный: все Blueprint, библиотека промптов.",
};

const fl: any = { color: "var(--color-text-tertiary)", textDecoration: "none", fontSize: "var(--text-xs)" };

export default function PricingPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-secondary)", minHeight: "100vh" }}>
      <div style={{ background: "var(--color-bg-primary)", padding: "var(--space-xl) var(--space-m)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "var(--space-s)" }}>Тарифы</h1>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", maxWidth: 500, margin: "0 auto" }}>Бесплатный доступ ко всем Blueprint. Pro открывает AI-консультанта и персональные промпты.</p>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-xl)", alignItems: "start" }}>
          {/* Free */}
          <div style={{ padding: "var(--space-xl)", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", borderRadius: 0 }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-heading)" }}>Бесплатный</div>
            <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "var(--font-heading)", marginBottom: "var(--space-s)" }}>0 ₽</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "var(--space-l)", fontSize: "var(--text-xs)" }}>
              {["Все Blueprint и этапы","Библиотека промптов","MCP-каталог","Глоссарий (94 термина)","Прогресс и XP","Блог и сообщество"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} /><span>{f}</span></div>
              ))}
            </div>
            <Link href="/corporate-website" style={{ display: "block", textAlign: "center", padding: "14px", border: "1px solid var(--color-accent)", color: "var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0 }}>Начать бесплатно</Link>
          </div>
          {/* Pro */}
          <div style={{ padding: "var(--space-xl)", border: "2px solid var(--color-accent)", background: "var(--color-accent-light)", borderRadius: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "6px 20px", background: "var(--color-accent)", color: "white", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0 }}>РЕКОМЕНДУЕМ</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-heading)" }}>Pro</span><Crown size={14} style={{ color: "var(--color-accent)" }} /></div>
            <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "var(--font-heading)", marginBottom: 4 }}>300 <span style={{ fontSize: "var(--text-m)", fontWeight: 500 }}>₽/мес</span></div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>Отмена в любой момент</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "var(--space-l)", fontSize: "var(--text-xs)" }}>
              {["Всё из бесплатного","AI-консультант DeepSeek","Персональные промпты","Prompt Playground без ограничений","Приоритетная поддержка"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: f === "Всё из бесплатного" ? 400 : 700 }}><Check size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} /><span>{f}</span></div>
              ))}
            </div>
            <Link href="/dashboard/billing" style={{ display: "block", textAlign: "center", padding: "14px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0 }}>Подключить Pro</Link>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", paddingBottom: "var(--space-xl)" }}><Link href="/" style={fl}>← На главную</Link></div>
    </div>
  );
}
