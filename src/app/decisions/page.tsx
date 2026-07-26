import Link from "next/link";
import { GitBranch, Lightbulb, Shield, Zap, ArrowRight, Check, Brain, Target } from "lucide-react";

export const metadata = {
  title: "Методология принятия решений — Карта роста",
  description: "Decision-Driven методология: каждый шаг проекта — осознанное решение. ПОНЯТЬ → ВЫБРАТЬ → ПРОВЕРИТЬ → получить навык.",
};

export default function DecisionsPage() {
  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
      {/* Hero */}
      <div style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "80px 20px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)" }}>
            <Brain size={14} /> Методология
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.05, marginBottom: "var(--space-m)", letterSpacing: "-0.02em" }}>
            Каждое решение — <span style={{ color: "var(--color-accent)" }}>осознанный шаг</span>
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
            ProektMap построен на методологии <strong>Decision-Driven Development</strong>. Ты не просто читаешь теорию — ты принимаешь инженерные решения и понимаешь почему.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
            <Link href="/corporate-website" style={{ padding: "14px 28px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0, display: "flex", alignItems: "center", gap: 8 }}>
              Попробовать <ArrowRight size={16} />
            </Link>
            <Link href="/quest/beginner" style={{ padding: "14px 28px", background: "var(--color-bg-primary)", border: "1px solid var(--color-accent)", color: "var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0 }}>
              Путь новичка
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-xl)" }}>
          Как работает методология
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-l)", marginBottom: "var(--space-xl)" }}>
          {[
            { step: "1", icon: Lightbulb, title: "ПОНЯТЬ", desc: "Почему это решение важно? Какие альтернативы? Что будет если выбрать неправильно? AI-помощник объясняет контекст.", color: "#f59e0b" },
            { step: "2", icon: Target, title: "ВЫБРАТЬ", desc: "Ты выбираешь из 2-3 вариантов с обоснованием. Система запоминает твой выбор и причину — формируется журнал решений.", color: "var(--color-accent)" },
            { step: "3", icon: Check, title: "ПРОВЕРИТЬ", desc: "Готовый промпт для AI-агента. Вставь в Cursor/Claude Code → получи рабочий код. Результат можно проверить сразу.", color: "#3b82f6" },
          ].map(item => (
            <div key={item.step} style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "2px solid var(--color-border)", borderRadius: 0, borderTop: "3px solid " + item.color }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-s)" }}>
                <div style={{ width: 36, height: 36, background: item.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, fontFamily: "var(--font-heading)" }}>{item.step}</div>
                <item.icon size={20} style={{ color: item.color }} />
                <span style={{ fontWeight: 700, fontSize: "var(--text-s)", fontFamily: "var(--font-heading)" }}>{item.title}</span>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Decision Map */}
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)", borderRadius: 0 }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)", display: "flex", alignItems: "center", gap: 8 }}>
            <GitBranch size={20} style={{ color: "var(--color-accent)" }} /> Карта решений
          </h3>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-m)" }}>
            Все твои решения сохраняются в карту. В конце Blueprint ты получаешь документ с полным журналом: что выбрал, почему, какие были альтернативы.
          </p>
          <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", padding: "var(--space-m)", fontFamily: "monospace", fontSize: "var(--text-xs)", lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
            <div>Корпоративный сайт</div>
            <div style={{ color: "var(--color-accent)" }}>├─ 🟢 Админка → Strapi (нужна клиенту)</div>
            <div style={{ color: "#f59e0b" }}>├─ 🟡 Блог → Да (SEO-продвижение)</div>
            <div style={{ color: "#3b82f6" }}>├─ 🔵 Каталог → Нет (не нужен)</div>
            <div>├─ 📸 Хранение фото → Supabase Storage</div>
            <div style={{ color: "var(--color-accent)" }}>├─ 🟢 Авторизация → Яндекс.ID + Email</div>
            <div>└─ ⚡ Деплой → VPS через Docker</div>
          </div>
        </div>

        {/* Skills */}
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)", borderRadius: 0 }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)", display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={20} style={{ color: "#f59e0b" }} /> Навыки + XP
          </h3>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-m)" }}>
            Каждое решение требует определённых навыков. Выполнил этап — получил +XP в навык. Система автоматически отслеживает твой прогресс и показывает сильные и слабые стороны.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Next.js +15", "Prisma +10", "Docker +10", "PostgreSQL +8", "Git +5", "OAuth +5", "SEO +3"].map(s => (
              <span key={s} style={{ padding: "4px 12px", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: 11, fontWeight: 600, borderRadius: 0 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Philosophy */}
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)", borderRadius: 0 }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)", display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={20} style={{ color: "#8b5cf6" }} /> Почему это работает?
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
            {[
              { q: "Новичок не знает что выбрать", a: "AI-Архитектор предлагает 2-3 проверенных варианта с плюсами и минусами. Не нужно гуглить — решение уже проанализировано." },
              { q: "Трудно понять последствия выбора", a: "Каждое решение показывает «Влияет на»: выбор БД влияет на API, авторизацию, деплой. Ты видишь связи." },
              { q: "Агент галлюцинирует без контекста", a: "Decision → готовый промпт с контекстом проекта. Агент получает не «сделай сайт», а «сделай админку на Strapi с Яндекс.ID»." },
              { q: "Неясно чему учиться дальше", a: "Система навыков показывает пробелы. Docker 8 XP, а Prisma уже 65 XP — пора учить DevOps." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: 0 }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>❓ {item.q}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>→ {item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-xl)" }}>
          Частые вопросы
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          {[
            { q: "Чем это отличается от обычного курса?", a: "Курс даёт теорию. Decision-Driven даёт практический результат: журнал решений + промпты + карта навыков. После прохождения Blueprint у тебя готовый проект." },
            { q: "Нужно ли знать программирование?", a: "Путь новичка проведёт от «что такое редактор кода» до деплоя. Но для глубоких Blueprint'ов (SaaS, агенты) базовые знания JS помогут." },
            { q: "Можно использовать свои инструменты?", a: "Да. Мы рекомендуем Cursor + Claude Code, но промпты работают с любым AI-агентом (VS Code Copilot, OpenCode, Aider)." },
            { q: "Как связаны решения и навыки?", a: "Каждое решение требует определённых навыков (например, «Настроить Prisma» требует знания Prisma + PostgreSQL). При выполнении ты получаешь XP в эти навыки." },
            { q: "Что такое Blueprint?", a: "Это карта проекта: 10-15 этапов от идеи до запуска. Каждый этап — набор решений с готовыми промптами. Проходишь Blueprint → получаешь работающий продукт." },
          ].map((item, i) => (
            <details key={i} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: 0 }}>
              <summary style={{ padding: "var(--space-m) var(--space-l)", fontSize: "var(--text-s)", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-heading)", listStyle: "none" }}>
                {item.q}
              </summary>
              <div style={{ padding: "0 var(--space-l) var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", paddingBottom: "var(--space-xl)" }}>
        <Link href="/corporate-website" style={{ padding: "14px 32px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <GitBranch size={16} /> Начать принимать решения
        </Link>
      </div>
    </div>
  );
}
