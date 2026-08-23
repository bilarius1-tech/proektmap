import { getDb } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Как создать интернет-магазин с нуля — пошаговый план с AI",
  description: "Пошаговая инструкция: как создать интернет-магазин с нуля. Выбор платформы, каталог товаров, корзина, оплата через ЮKassa, SEO и запуск. Готовый Blueprint с AI-помощником.",
  openGraph: {
    title: "Как создать интернет-магазин с нуля — пошаговый план с AI",
    description: "Каталог, корзина, оплата, SEO — полный путь от идеи до работающего магазина.",
    images: [{ url: "https://proektmap.ru/api/og?title=Как+создать+интернет-магазин&category=ProektMap&author=Пошаговый+Blueprint", width: 1200, height: 630 }],
  },
};

export default async function CreateStorePage() {
  const db = await getDb();
  const bp = await db.blueprint.findUnique({ where: { slug: "online-store" }, select: { title: true, slug: true, description: true, goal: true, totalDecisions: true, timeToComplete: true } });
  const tools = await db.aITool.findMany({ where: { isActive: true, OR: [{ name: { contains: "V0", mode: "insensitive" as const } }, { name: { contains: "Vercel", mode: "insensitive" as const } }] }, take: 3, select: { name: true, slug: true } });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600, marginBottom: "var(--space-s)" }}>📖 Гайд</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 var(--space-m)" }}>
        Как создать интернет-магазин с нуля
      </h1>
      <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
        Полный путь: от идеи до работающего магазина с каталогом, корзиной, онлайн-оплатой и SEO. 
        С готовым Blueprint'ом и AI-помощником, который ведёт тебя по шагам.
      </p>

      {/* Blueprint CTA */}
      {bp && (
        <div style={{ background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)", borderRadius: "var(--radius-l)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-s)" }}>Готовый Blueprint</div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: "0 0 var(--space-s)" }}>{bp.title}</h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>{bp.goal || bp.description}</p>
          <div style={{ display: "flex", gap: "var(--space-m)", flexWrap: "wrap", marginBottom: "var(--space-m)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>⏱ {bp.timeToComplete || "4 недели"}</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>📋 {bp.totalDecisions} решений</span>
          </div>
          <Link href={`/blueprints/${bp.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)" }}>
            Пройти Blueprint →
          </Link>
        </div>
      )}

      {/* Steps */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-xl)" }}>Что нужно сделать</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)", marginTop: "var(--space-m)" }}>
        {[
          { step: 1, title: "Выбрать платформу", desc: "Next.js — бесплатно, быстро, SEO. Не нужен конструктор за 5000 ₽/мес." },
          { step: 2, title: "Создать каталог товаров", desc: "Карточки с фото, описанием, ценой. Категории и фильтры." },
          { step: 3, title: "Добавить корзину и заказы", desc: "Покупатель выбирает товары → оформляет заказ. Данные сохраняются в базу." },
          { step: 4, title: "Подключить оплату", desc: "ЮKassa — принимает карты, SberPay, ЮMoney. Комиссия 3.5%." },
          { step: 5, title: "Настроить уведомления", desc: "Telegram-бот сообщает о новом заказе. Email — резервная копия." },
          { step: 6, title: "Опубликовать и продвигать", desc: "Vercel (бесплатно), SEO-оптимизация, Яндекс.Метрика, sitemap." },
        ].map(s => (
          <div key={s.step} style={{ display: "flex", gap: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-m)" }}>
            <div style={{ width: 32, height: 32, background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", flexShrink: 0 }}>{s.step}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tools */}
      {tools.length > 0 && (
        <>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-xl)" }}>Инструменты для магазина</h2>
          <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginTop: "var(--space-m)" }}>
            {tools.map(t => (
              <Link key={t.slug} href={`/ai-tools/${t.slug}`} style={{ padding: "8px 16px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "var(--color-text-primary)", fontSize: "var(--text-xs)", fontWeight: 600, borderRadius: "var(--radius-m)" }}>
                {t.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <div style={{ marginTop: "var(--space-xl)", textAlign: "center", padding: "var(--space-xl)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)" }}>Готов начать?</h2>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>Пройди Blueprint «Интернет-магазин» — AI-помощник проведёт тебя по каждому шагу.</p>
        <Link href="/blueprints/online-store" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)" }}>
          Начать бесплатно →
        </Link>
      </div>
    </div>
  );
}
