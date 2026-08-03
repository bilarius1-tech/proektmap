import { getDb } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Как создать CRM-систему для малого бизнеса — пошаговый план",
  description: "Создай свою CRM: карточки клиентов, воронка продаж, задачи, уведомления в Telegram. Готовый Blueprint с AI-консультантом — от идеи до запуска за 3 недели.",
  openGraph: {
    title: "Как создать CRM-систему для малого бизнеса",
    description: "Карточки клиентов, канбан-воронка, задачи, уведомления — полный путь с AI.",
    images: [{ url: "https://proektmap.ru/api/og?title=Как+создать+CRM&category=ProektMap&author=Пошаговый+Blueprint", width: 1200, height: 630 }],
  },
};

export default async function CreateCRMPage() {
  const db = await getDb();
  const bp = await db.blueprint.findUnique({ where: { slug: "company-crm" }, select: { title: true, slug: true, description: true, goal: true, totalDecisions: true, timeToComplete: true } });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600, marginBottom: "var(--space-s)" }}>📖 Гайд</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 var(--space-m)" }}>
        Как создать CRM-систему для малого бизнеса
      </h1>
      <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
        Своя CRM за 3 недели. Без абонентской платы, без AmoCRM за 5000 ₽/мес. 
        Карточки клиентов, канбан-воронка, задачи с дедлайнами, Telegram-уведомления.
      </p>

      {/* Problem/Solution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        <div style={{ padding: "var(--space-l)", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius-m)" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-s)", color: "#dc2626" }}>❌ Проблема</div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: 0 }}>Менеджеры ведут клиентов в таблицах и чатах. Сделки теряются, задачи забываются. AmoCRM и Bitrix24 стоят от 5000 ₽/мес за сотрудника.</p>
        </div>
        <div style={{ padding: "var(--space-l)", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-m)" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-s)", color: "#16a34a" }}>✅ Решение</div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: 0 }}>Своя CRM на Next.js + PostgreSQL. Бесплатный хостинг на Vercel. Полный контроль над данными. Интеграция с Telegram для уведомлений.</p>
        </div>
      </div>

      {bp && (
        <div style={{ background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)", borderRadius: "var(--radius-l)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-s)" }}>Готовый Blueprint</div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: "0 0 var(--space-s)" }}>{bp.title}</h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>{bp.goal || bp.description}</p>
          <div style={{ display: "flex", gap: "var(--space-m)", flexWrap: "wrap", marginBottom: "var(--space-m)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>⏱ {bp.timeToComplete || "3 недели"}</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>📋 {bp.totalDecisions} решений</span>
          </div>
          <Link href={`/blueprints/${bp.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)" }}>
            Пройти Blueprint →
          </Link>
        </div>
      )}

      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-xl)" }}>Что будет в твоей CRM</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)", marginTop: "var(--space-m)" }}>
        {[
          { step: 1, title: "Карточки клиентов", desc: "Имя, компания, телефон, email, источник. Поиск и фильтрация. История взаимодействий: звонки, встречи, заметки." },
          { step: 2, title: "Канбан-воронка продаж", desc: "Сделки на доске: Лид → Контакт → Встреча → КП → Переговоры → Закрыто. Перетаскивай мышкой." },
          { step: 3, title: "Задачи с дедлайнами", desc: "Создавай задачи, привязывай к клиентам и сделкам. Просроченные подсвечиваются красным." },
          { step: 4, title: "Telegram-уведомления", desc: "Новая задача или смена этапа сделки → мгновенное сообщение в Telegram." },
          { step: 5, title: "Защита данных", desc: "Авторизация, роли (админ/менеджер). Все данные на твоём сервере." },
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

      <div style={{ marginTop: "var(--space-xl)", textAlign: "center", padding: "var(--space-xl)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)" }}>Создай свою CRM сегодня</h2>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>Бесплатный Blueprint + AI-помощник на каждом шаге.</p>
        <Link href="/blueprints/company-crm" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)" }}>
          Начать бесплатно →
        </Link>
      </div>
    </div>
  );
}
