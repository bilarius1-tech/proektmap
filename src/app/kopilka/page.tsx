import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import KopilkaClient from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Копилка дизайна — фишки для сайтов",
  description:
    "Кураторская полка дизайн-ресурсов: анимации, секции, кнопки, фоны, дашборды и CodePen — с коротким описанием на русском.",
  alternates: { canonical: "https://proektmap.ru/kopilka" },
};

export default async function KopilkaPage() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";
  const db = await getDb();

  const [categories, items] = await Promise.all([
    db.designBankCategory.findMany({
      where: isAdmin ? undefined : { isPublished: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.designBankItem.findMany({
      where: isAdmin ? undefined : { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: { select: { id: true, title: true, slug: true, emoji: true } } },
    }),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-primary, #fff)", color: "var(--color-text-primary, #111)" }}>
      <header
        style={{
          padding: "56px 20px 36px",
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(15,184,128,0.18), transparent 50%), radial-gradient(ellipse at 90% 20%, rgba(99,102,241,0.12), transparent 45%), linear-gradient(180deg, #0b1220 0%, #121a2b 100%)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(15,184,128,0.2)",
              color: "#6ee7b7",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 14,
              letterSpacing: "0.02em",
            }}
          >
            Копилка вайбкодинга · дизайн
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading, Inter, sans-serif)",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
              lineHeight: 1.1,
            }}
          >
            Копилка дизайна
          </h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", maxWidth: 560, marginInline: "auto" }}>
            Анимации, секции, кнопки, фоны, дашборды и CodePen — вставил ссылку, получил короткую строку с русским описанием.
          </p>
        </div>
      </header>

      <div style={{ marginTop: -12, paddingTop: 28 }}>
        <KopilkaClient categories={categories} items={items} isAdmin={!!isAdmin} />
      </div>
    </div>
  );
}
