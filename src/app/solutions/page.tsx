import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { Lightbulb, Clock, Star, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Библиотека решений — Карта роста", description: "Готовые архитектурные решения от сообщества. CRM, SaaS, Telegram Mini App, AI-консультанты." };

export default async function SolutionsPage() {
  const db: any = await getDb();
  const solutions = await db.solution.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
      <div style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "60px 20px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Библиотека решений
        </h1>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", maxWidth: 500, margin: "0 auto" }}>
          Готовые архитектуры от AI-Архитектора и сообщества. Сохрани своё решение — помоги другим.
        </p>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-m)" }}>
          {solutions.map((s: any) => (
            <Link key={s.id} href={`/solutions/${s.slug}`} style={{ textDecoration: "none", color: "inherit", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-l)", borderRadius: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.productType || "Проект"}</div>
              <div style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-s)", lineHeight: 1.4 }}>{s.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-m)", flex: 1 }}>{s.summary?.slice(0, 120)}{(s.summary?.length || 0) > 120 ? "..." : ""}</div>
              <div style={{ display: "flex", gap: "var(--space-m)", fontSize: 11, color: "var(--color-text-tertiary)", marginTop: "auto" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {s.mvpDays}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} /> {s.complexity}/10</span>
                <span style={{ marginLeft: "auto", color: "var(--color-accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><ArrowRight size={12} /></span>
              </div>
            </Link>
          ))}
        </div>
        {solutions.length === 0 && <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>Пока нет решений. <Link href="/architect" style={{ color: "var(--color-accent)" }}>Создайте первое →</Link></div>}
      </div>
    </div>
  );
}
