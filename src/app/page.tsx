import Link from "next/link";
import { Globe, Smartphone, Gamepad2, Server, Camera, Package, ArrowRight, Check, Crown, Shield } from "lucide-react";

const blueprints = [
  { slug: "corporate-website", title: "Корпоративный сайт", desc: "От покупки домена до запуска рекламы", icon: Globe, xp: 710, decisions: 40, active: true },
  { slug: "saas-project", title: "SaaS-продукт", desc: "От идеи до платежей и первых клиентов", icon: Server, xp: 0, decisions: 0 },
  { slug: "mobile-app", title: "Мобильное приложение", desc: "React Native + AI: от макета до App Store", icon: Smartphone, xp: 0, decisions: 0 },
  { slug: "game-dev", title: "Разработка игры", desc: "Unity/Godot + AI-ассистент", icon: Gamepad2, xp: 0, decisions: 0 },
  { slug: "photo-service", title: "Сервис обработки фото", desc: "AI API + загрузка + галерея", icon: Camera, xp: 0, decisions: 0 },
  { slug: "api-service", title: "Backend API", desc: "REST/GraphQL + БД + авторизация", icon: Package, xp: 0, decisions: 0 },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--color-bg-primary)", padding: "60px 20px 50px", textAlign: "center", borderBottom: "1px solid var(--color-border-light)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)" }}>
          🎓 AI Инженер
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, lineHeight: 1.15, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Научись создавать проекты<br />с помощью AI
        </h1>
        <p style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          Инженерный навигатор с готовыми промптами. Выбери шаблон и пройди путь от идеи до запуска.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
          <Link href="/corporate-website" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            Начать бесплатно <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard/billing" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "white", color: "var(--color-accent)", border: "1px solid var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            <Crown size={16} /> Pro — 300 ₽/мес
          </Link>
        </div>
      </div>

      {/* Как это работает */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, textAlign: "center", marginBottom: "var(--space-xl)" }}>Как это работает</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-l)" }}>
          {[
            { step: "1", title: "Выберите шаблон", desc: "Корпоративный сайт, SaaS, игра, мобильное приложение — выберите что создаёте." },
            { step: "2", title: "Создайте проект", desc: "Дайте имя, выберите цвета и шрифты. Все промпты персонализируются под ваш проект." },
            { step: "3", title: "Пройдите этапы", desc: "11 этапов от покупки домена до мониторинга. Каждый с готовым промптом для AI." },
            { step: "4", title: "Запустите проект", desc: "К финалу у вас готовый сайт, SaaS или приложение — созданные с AI." },
          ].map(item => (
            <div key={item.step} style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "var(--text-s)", marginBottom: "var(--space-s)" }}>{item.step}</div>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Шаблоны */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, textAlign: "center", marginBottom: "var(--space-xl)" }}>Доступные шаблоны</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-m)" }}>
          {blueprints.map((bp) => {
            const Icon = bp.icon;
            return (
              <Link key={bp.slug} href={bp.active ? `/${bp.slug}` : "#"}
                style={{
                  display: "flex", flexDirection: "column", padding: "var(--space-l)", background: "var(--color-bg-primary)",
                  borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", textDecoration: "none", color: "inherit",
                  opacity: bp.active ? 1 : 0.5, cursor: bp.active ? "pointer" : "default",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-s)" }}>
                  <Icon size={22} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{bp.title}</div>
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", flex: 1, marginBottom: "var(--space-s)" }}>{bp.desc}</div>
                {bp.active ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600 }}>{bp.decisions} решений</span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{bp.xp} XP</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Скоро</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Тарифы */}
      <div style={{ background: "var(--color-bg-primary)", padding: "var(--space-xl) var(--space-m)", borderTop: "1px solid var(--color-border-light)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, textAlign: "center", marginBottom: "var(--space-xl)" }}>Тарифы</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-l)", alignItems: "start" }}>
            {/* Бесплатный */}
            <div style={{ padding: "var(--space-xl)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Бесплатный</div>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: "var(--space-s)" }}>0 ₽</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "var(--space-l)", fontSize: "var(--text-xs)" }}>
                {["Все Blueprint'ы (12 этапов)", "Библиотека промптов", "Прогресс и XP"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}><Check size={14} style={{ color: "var(--color-accent)" }} />{f}</div>
                ))}
              </div>
              <Link href="/corporate-website" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)", color: "var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600 }}>Начать</Link>
            </div>

            {/* Pro */}
            <div style={{ padding: "var(--space-xl)", borderRadius: "var(--radius-xl)", border: "2px solid var(--color-accent)", background: "var(--color-accent-light)", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent)", color: "white", fontSize: 10, fontWeight: 700 }}>РЕКОМЕНДУЕМ</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pro</div>
                <Crown size={14} style={{ color: "var(--color-accent)" }} />
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>300 <span style={{ fontSize: "var(--text-m)", fontWeight: 500 }}>₽/мес</span></div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>Можно отменить в любой момент</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "var(--space-l)", fontSize: "var(--text-xs)" }}>
                {["Всё из бесплатного", "AI-консультант (DeepSeek/OpenRouter)", "Персональные промпты с данными проекта", "Приоритетная поддержка"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: f === "Всё из бесплатного" ? 400 : 600 }}><Check size={14} style={{ color: "var(--color-accent)" }} />{f}</div>
                ))}
              </div>
              <Link href="/dashboard/billing" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>Подключить Pro</Link>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center", marginTop: 8 }}>Оплата через ЮKassa. После оплаты доступ открывается мгновенно.</div>
            </div>
          </div>
        </div>
      </div>

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
