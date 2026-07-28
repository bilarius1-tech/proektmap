import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Zap, Server, AlertTriangle, Database, Package, Star, ArrowLeft, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db: any = await getDb();
  const s = await db.solution.findUnique({ where: { slug } });
  if (!s) return notFound();

  const entities = JSON.parse(s.entities || "[]");
  const plan = JSON.parse(s.plan || "[]");
  const mistakes = JSON.parse(s.mistakes || "[]");
  const skills = JSON.parse(s.skills || "[]");

  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <Link href="/solutions" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginBottom: "var(--space-l)" }}><ArrowLeft size={14} /> Все решения</Link>
        
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", marginBottom: "var(--space-l)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s.productType}</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>{s.title}</h1>
          {s.summary && <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{s.summary}</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
          {[{ icon: Clock, label: "Сложность", value: s.complexity + "/10" },{ icon: Clock, label: "MVP", value: s.mvpDays },{ icon: DollarSign, label: "Монетизация", value: s.monetization },{ icon: Clock, label: "Разработка", value: s.costDev },{ icon: Zap, label: "AI", value: s.costAi },{ icon: Server, label: "Сервер", value: s.costServer }].map((m, i) => (
            <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><m.icon size={12} style={{ color: "var(--color-accent)" }} /><span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>{m.label}</span></div>
              <div style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{m.value}</div>
            </div>
          ))}
        </div>

        {entities.length > 0 && (
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-l)", marginBottom: "var(--space-s)" }}>
            <h2 style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-m)", display: "flex", alignItems: "center", gap: 6 }}><Database size={14} style={{ color: "var(--color-accent)" }} /> Сущности БД</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{entities.map((e: string, i: number) => (<span key={i} style={{ padding: "4px 10px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)" }}>{e}</span>))}</div>
          </div>
        )}

        {plan.length > 0 && (
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-l)", marginBottom: "var(--space-s)" }}>
            <h2 style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-m)" }}>План разработки</h2>
            {plan.map((p: string, i: number) => (<div key={i} style={{ display: "flex", gap: 10, padding: "4px 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}><span style={{ width: 22, height: 22, background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i+1}</span><span>{p}</span></div>))}
          </div>
        )}

        {mistakes.length > 0 && (
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-l)", marginBottom: "var(--space-s)" }}>
            <h2 style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-m)", display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={14} style={{ color: "#ef4444" }} /> Типичные ошибки</h2>
            {mistakes.map((m: string, i: number) => (<div key={i} style={{ display: "flex", gap: 8, padding: "3px 0", fontSize: "var(--text-xs)", color: "#991b1b" }}><span>❌</span><span>{m}</span></div>))}
          </div>
        )}

        {skills.length > 0 && (
          <div style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", marginBottom: "var(--space-s)" }}>
            <h2 style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-m)" }}>Навыки</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map((slug: string) => (<Link key={slug} href={`/glossary/${slug}`} style={{ padding: "4px 10px", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, textDecoration: "none" }}>{slug}</Link>))}</div>
          </div>
        )}
      </div>
    </div>
  );
}
