import { getDb } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Как создать Telegram-бота — пошаговое руководство с AI",
  description: "Создай Telegram-бота с нуля: команды, меню, база данных, админка. Готовый Blueprint с AI-консультантом — от идеи до работающего бота за 2 недели.",
  openGraph: {
    title: "Как создать Telegram-бота — пошаговое руководство",
    description: "Команды, меню, база данных, админка — полный путь с AI-помощником.",
    images: [{ url: "https://proektmap.ru/api/og?title=Как+создать+Telegram+бота&category=ProektMap&author=Пошаговый+Blueprint", width: 1200, height: 630 }],
  },
};

export default async function CreateTelegramBotPage() {
  const db = await getDb();
  const bp = await db.blueprint.findUnique({ where: { slug: "telegram-bot" }, select: { title: true, slug: true, description: true, goal: true, totalDecisions: true, timeToComplete: true } });
  const tools = await db.aITool.findMany({ where: { isActive: true, OR: [{ name: { contains: "aiogram", mode: "insensitive" as const } }, { name: { contains: "grammy", mode: "insensitive" as const } }, { name: { contains: "BotFather", mode: "insensitive" as const } }] }, take: 3, select: { name: true, slug: true } });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600, marginBottom: "var(--space-s)" }}>📖 Гайд</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 var(--space-m)" }}>
        Как создать Telegram-бота с нуля
      </h1>
      <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
        Полный путь: от регистрации бота в @BotFather до работающего помощника с командами, меню, базой данных и админкой. 
        С готовым Blueprint'ом и AI-консультантом на каждом шаге.
      </p>

      {bp && (
        <div style={{ background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)", borderRadius: "var(--radius-l)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-s)" }}>Готовый Blueprint</div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: "0 0 var(--space-s)" }}>{bp.title}</h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>{bp.goal || bp.description}</p>
          <div style={{ display: "flex", gap: "var(--space-m)", flexWrap: "wrap", marginBottom: "var(--space-m)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>⏱ {bp.timeToComplete || "2 недели"}</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>📋 {bp.totalDecisions} решений</span>
          </div>
          <Link href={`/blueprints/${bp.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)" }}>
            Пройти Blueprint →
          </Link>
        </div>
      )}

      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-xl)" }}>Что нужно сделать</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)", marginTop: "var(--space-m)" }}>
        {[
          { step: 1, title: "Зарегистрировать бота", desc: "@BotFather → /newbot → имя и username. Получишь токен — ключ доступа к API Telegram." },
          { step: 2, title: "Выбрать фреймворк", desc: "aiogram (Python) или grammy (TypeScript). Оба бесплатные, с отличной документацией." },
          { step: 3, title: "Добавить команды и меню", desc: "/start, /help, /catalog. Кнопки под сообщениями (inline keyboard). Меню с разделами." },
          { step: 4, title: "Подключить базу данных", desc: "PostgreSQL — хранение пользователей, заказов, настроек. Бесплатный хостинг на Vercel." },
          { step: 5, title: "Сделать админку", desc: "Веб-панель для управления: рассылки, статистика, редактирование контента." },
          { step: 6, title: "Запустить и продвигать", desc: "Деплой на VPS за 400 ₽/мес. Добавить бота в каталоги, настроить Webhook." },
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

      {tools.length > 0 && (
        <>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-xl)" }}>Инструменты для ботов</h2>
          <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginTop: "var(--space-m)" }}>
            {tools.map(t => (
              <Link key={t.slug} href={`/ai-tools/${t.slug}`} style={{ padding: "8px 16px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "var(--color-text-primary)", fontSize: "var(--text-xs)", fontWeight: 600, borderRadius: "var(--radius-m)" }}>
                {t.name}
              </Link>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: "var(--space-xl)", textAlign: "center", padding: "var(--space-xl)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)" }}>Создай бота сегодня</h2>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>Бесплатный Blueprint + AI-помощник. 24 решения, готовые промпты, проверки на каждом шаге.</p>
        <Link href="/blueprints/telegram-bot" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)" }}>
          Начать бесплатно →
        </Link>
      </div>
    </div>
  );
}
