import DemoBlock from "@/components/home/demo-block";
import Link from "next/link";
import { Globe, Smartphone, Gamepad2, Server, Camera, Package, ArrowRight, Check, Crown, Shield } from "lucide-react";

const blueprints = [
  { slug: "corporate-website", title: "Корпоративный сайт", desc: "От покупки домена до запуска рекламы", icon: Globe, xp: 710, decisions: 40, active: true },
  { slug: "saas-project", title: "SaaS-продукт", desc: "От идеи до первых платящих клиентов", icon: Server, xp: 445, decisions: 21, active: true },
  { slug: "mobile-app", title: "Мобильное приложение", desc: "React Native + AI: от макета до App Store", icon: Smartphone, xp: 0, decisions: 0 },
  { slug: "game-dev", title: "Разработка игры", desc: "Godot + AI: от идеи до Яндекс.Игр", icon: Gamepad2, xp: 350, decisions: 19, active: true },
  { slug: "photo-service", title: "Сервис обработки фото", desc: "AI API + загрузка + галерея", icon: Camera, xp: 0, decisions: 0 },
  { slug: "api-service", title: "Backend API", desc: "REST/GraphQL + БД + авторизация", icon: Package, xp: 0, decisions: 0 },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--color-bg-primary)", padding: "80px 20px 50px", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)" }}>
          🎓 AI Инженер
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Научись создавать проекты<br />с помощью AI
        </h1>
        <p style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          Инженерный навигатор с готовыми промптами. Выбери шаблон и пройди путь от идеи до запуска.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
          <Link href="/corporate-website" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            Начать бесплатно <ArrowRight size={16} />
          </Link>
          <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "white", color: "var(--color-accent)", border: "1px solid var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            <Crown size={16} /> Pro — 300 ₽/мес
          </Link>
        </div>
      </div>


      {/* Поисковая строка */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", textAlign: "center" }}>
        <div style={{ fontSize: "var(--text-m)", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>
          Найди термин, паттерн или инструмент
        </div>
        <form action="/search" method="GET" style={{ display: "flex", gap: 0, maxWidth: 500, margin: "0 auto", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <input
            name="q"
            placeholder="RAG, MCP, Prisma, SEO Аудитор..."
            style={{
              flex: 1, padding: "14px 20px", fontSize: "var(--text-m)", borderRadius: 0,
              border: "2px solid var(--color-border)", borderRight: "none", background: "var(--color-bg-primary)",
              outline: "none", color: "var(--color-text-primary)", boxSizing: "border-box",
            }}
          />
          <button type="submit"
            style={{
              padding: "14px 24px", borderRadius: 0, border: "none", background: "var(--color-accent)",
              color: "white", fontWeight: 700, fontSize: "var(--text-s)", cursor: "pointer",
            }}>
            🔍 Найти
          </button>
        </form>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "var(--space-m)", flexWrap: "wrap", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          Часто ищут:
          <a href="/search?q=MCP" style={{ color: "var(--color-accent)", textDecoration: "none" }}>MCP</a>
          <a href="/search?q=RAG" style={{ color: "var(--color-accent)", textDecoration: "none" }}>RAG</a>
          <a href="/search?q=Prisma" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Prisma</a>
          <a href="/search?q=SEO" style={{ color: "var(--color-accent)", textDecoration: "none" }}>SEO</a>
          <a href="/search?q=Next.js" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Next.js</a>
        </div>
      </div>

      <DemoBlock />

      {/* Реквизиты */}
      <div style={{ padding: "var(--space-xl) var(--space-m)", background: "var(--color-bg-secondary)", borderTop: "1px solid var(--color-border-light)", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.8 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--color-text-secondary)" }}>Реквизиты</div>
          <div>ИП Тимофеев Алексей Геннадьевич · ИНН 532002912418</div>
          <div>Email: bilariuss@yandex.ru · Telegram: @bilarius · Тел: +7 921 201-32-52</div>
          <div style={{ marginTop: "var(--space-s)", display: "flex", gap: "var(--space-m)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ color: "var(--color-text-tertiary)" }}>Политика</Link>
            <Link href="/terms" style={{ color: "var(--color-text-tertiary)" }}>Соглашение</Link>
            <Link href="/offer" style={{ color: "var(--color-text-tertiary)" }}>Оферта</Link>
            <Link href="/refund" style={{ color: "var(--color-text-tertiary)" }}>Возврат</Link>
            <Link href="/contacts" style={{ color: "var(--color-text-tertiary)" }}>Контакты</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
