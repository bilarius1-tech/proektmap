import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Download,
  FileText,
  GitBranch,
  ListChecks,
  Palette,
  Rocket,
  ScrollText,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Правила разработки с AI-агентами — кодекс и шаблон | ProektMap",
  description:
    "Кодекс AI-агента, 8 фаз разработки, дизайн-скиллы Anthropic и стартовый шаблон проекта для OpenCode, Cursor и Reasonix.",
  alternates: {
    canonical: "https://proektmap.ru/agent-engineering/rules",
  },
  openGraph: {
    title: "Правила разработки с AI-агентами | ProektMap",
    description:
      "Старт — это не «сделай классный SaaS». Это шаблон, идея и 8 фаз. Кодекс агента + стартовый шаблон проекта.",
    url: "https://proektmap.ru/agent-engineering/rules",
    siteName: "ProektMap",
    type: "article",
  },
};

const ACCENT = "#7c3aed";

const codex = [
  { n: 1, title: "Сначала читай AGENTS.md", text: "Правила проекта важнее общих привычек модели." },
  { n: 2, title: "Одна линия истории в git", text: "Работай в main, не оставляй ветки разъехавшимися." },
  { n: 3, title: "Инкременты", text: "Один шаг = код + проверка + коммит. Никаких «сделаю всё сразу»." },
  { n: 4, title: "Не выдумывай", text: "Нет данных → спроси или оставь [уточнить: …]." },
  { n: 5, title: "Scratch вне репозитория", text: "Пробы и сгенерированный мусор не коммитим." },
  { n: 6, title: "Не разрушай данные", text: "Без force-reset БД, без удаления прода." },
  { n: 7, title: "Проверяй сам себя", text: "После каждого шага — тест/билд, перед финалом — дифф." },
];

const phases = [
  { n: 0, name: "Идея", cmd: "—", out: "inputs/idea.md", done: "Идея записана своими словами" },
  { n: 1, name: "Бриф", cmd: "brief", out: "outputs/brief.md", done: "5 категорий раскрыты в диалоге" },
  { n: 2, name: "Ресёрч", cmd: "research", out: "outputs/research.md", done: "5–7 реальных конкурентов, синтез" },
  { n: 3, name: "PRD", cmd: "prd", out: "outputs/prd.md", done: "Одна страница, скоп MVP с MoSCoW" },
  { n: 4, name: "Дизайн", cmd: "design", out: "outputs/ui-kit.md", done: "Палитра, типографика, сетка, состояния" },
  { n: 5, name: "Окружение", cmd: "setup", out: "git, стек, .env.example, README", done: "Проект запускается с нуля" },
  { n: 6, name: "План", cmd: "plan", out: "outputs/plan.md", done: "Шаги с критериями приёмки" },
  { n: 7, name: "Разработка", cmd: "build", out: "код инкрементами", done: "Каждый шаг закрыт коммитом" },
  { n: 8, name: "Ревью и деплой", cmd: "review", out: "outputs/review.md + публикация", done: "Чек-лист приёмки зелёный" },
];

const designSkills = [
  {
    name: "web-design-guidelines",
    source: "Anthropic",
    href: "/ai-skills/web-design-guidelines",
    text: "Правила продакшн-интерфейсов: типографика ≤2 семейств, цвет 60-30-10, сетка 4/8px, состояния и запреты «AI-скуфа».",
  },
  {
    name: "taste-skill",
    source: "Anthropic",
    href: "/ai-skills/taste-skill",
    text: "Вкус: собрать референсы, сделать 2–3 варианта, сравнить по характеру, иерархии и ритму, обосновать без слова «красиво».",
  },
  {
    name: "impeccable",
    source: "Anthropic",
    href: "/ai-skills/impeccable",
    text: "Безупречная полировка: выравнивание, контраст, пустые состояния, микрокопия, переходы 150–250 мс.",
  },
  {
    name: "Adding Product Design",
    source: "Emil Kowalski",
    href: null,
    text: "Продакт-дизайн для инженеров: дизайн как система, качество = сумма деталей, меньше но лучше.",
  },
];

const envRules = [
  { icon: GitBranch, text: "git init, ветка main, .gitignore (node_modules, .env, .next, dist, логи)." },
  { icon: Terminal, text: "Стек по типу проекта: SaaS/веб → Next.js + TS; лендинг → Vite/Next.js; Telegram-бот → Node.js + grammY." },
  { icon: FileText, text: "Секреты: .env.example в git, реальный .env — никогда." },
  { icon: ListChecks, text: "Всё проверяемое — командой: npm run build, npm test, lint." },
  { icon: BookOpenCheck, text: "README: как запустить, собрать и проверить — до начала разработки." },
];

const treeLines = [
  { line: "ai-project-starter/", note: "" },
  { line: "├── README.md", note: "← как начать за 3 шага (твой вход)" },
  { line: "├── AGENTS.md", note: "← кодекс: что агенту можно и нельзя" },
  { line: "├── inputs/idea.md", note: "← сюда кладёшь свою идею" },
  { line: "├── commands/", note: "← 8 команд-фаз, агент запускает по очереди" },
  { line: "│   ├── 00-brief.md", note: "← агент допрашивает: ЦА, боль, монетизация" },
  { line: "│   ├── 01-research.md", note: "← агент идёт в веб, изучает конкурентов" },
  { line: "│   ├── 02-prd.md", note: "← агент собирает одностраничный PRD" },
  { line: "│   ├── 03-design.md", note: "← агент задаёт визуальный язык по дизайн-скиллам" },
  { line: "│   ├── 04-setup.md", note: "← окружение: git, стек, .env, README" },
  { line: "│   ├── 05-plan.md", note: "← PRD → план работ" },
  { line: "│   ├── 06-build.md", note: "← код инкрементами (шаг → проверка → коммит)" },
  { line: "│   └── 07-review.md", note: "← самопроверка диффа и сдача проекта" },
  { line: "├── skills/", note: "← дизайн-скиллы: Anthropic + Emil Kowalski" },
  { line: "├── templates/", note: "← заготовки: бриф, PRD, план" },
  { line: "├── outputs/", note: "← результаты каждой фазы" },
  { line: "├── adapters/", note: "← команды в формате твоей среды" },
  { line: "│   ├── opencode/", note: "← OpenCode: .opencode/commands/" },
  { line: "│   ├── cursor/", note: "← Cursor: .cursor/rules/" },
  { line: "│   └── reasonix/", note: "← Reasonix: .reasonix/skills/" },
  { line: "└── docs/rules.md", note: "← полный текст правил в markdown" },
];

const acceptance = [
  "Проект запускается с нуля: clone → установка → npm run dev.",
  "npm run build проходит без ошибок.",
  "В диффе нет мусора, секретов и node_modules.",
  "Каждый шаг плана закрыт коммитом с понятным сообщением.",
  "README описывает запуск, сборку и проверку.",
  "Интерфейс соответствует UI-киту (не «примерно похоже»).",
];

export default function RulesPage() {
  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(165deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 55%, rgba(124, 58, 237, 0.10) 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "56px 20px 48px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              background: "rgba(124, 58, 237, 0.12)",
              color: ACCENT,
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              marginBottom: 16,
            }}
          >
            <ScrollText size={14} aria-hidden /> 4-й модуль трека · Инженерия агентов
          </div>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--color-text-secondary)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Кодекс · 8 фаз · стартовый шаблон
          </p>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "0 0 14px",
            }}
          >
            Правила разработки с AI-агентами
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "var(--text-l, 18px)",
              lineHeight: 1.65,
              color: "var(--color-text-secondary)",
              maxWidth: 640,
            }}
          >
            Старт — это не «сделай классный SaaS». Это шаблон, идея в inputs/idea.md
            и движение по 8 фазам. Работает в OpenCode, Cursor и Reasonix.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
            <Link
              href="/starter-kit/ai-project-starter.zip"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: ACCENT,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                fontFamily: "var(--font-heading)",
                minHeight: 52,
              }}
            >
              <Download size={16} /> Скачать стартовый шаблон
            </Link>
            <Link
              href="/resheniya"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                minHeight: 52,
              }}
            >
              <Rocket size={16} /> К готовым решениям
            </Link>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 64px" }}>
        {/* Блок 0 */}
        <Section title="Старт — это не «сделай классный SaaS»" kicker="С чего начинается проект">
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div style={{ padding: "18px 16px", background: "var(--color-bg-primary)", border: "1px solid #e88b8b55", borderTop: "3px solid #e88b8b" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 15 }}>❌ Так не надо</p>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                Написать агенту «сделай классный SaaS-проект» и ждать. Агент угадывает,
                выдумывает, прыгает и теряет контекст — получается бардак.
              </p>
            </div>
            <div style={{ padding: "18px 16px", background: "var(--color-bg-primary)", border: "1px solid #0fb88055", borderTop: "3px solid #0fb880" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 15 }}>✅ Так надо</p>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                Скачать шаблон → положить идею в inputs/idea.md → идти по 8 фазам.
                Шаблон даёт закон, команды и заготовки документов.
              </p>
            </div>
          </div>
        </Section>

        {/* Блок 1 */}
        <Section title="Кодекс AI-агента" kicker="7 правил, которые агент обязан соблюдать">
          <div style={{ display: "grid", gap: 10 }}>
            {codex.map((rule) => (
              <div
                key={rule.n}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "14px 16px",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(124, 58, 237, 0.12)",
                    color: ACCENT,
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  {rule.n}
                </span>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15 }}>{rule.title}</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                    {rule.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Блок 2 */}
        <Section title="Восемь фаз разработки" kicker="От идеи до деплоя">
          <div style={{ display: "grid", gap: 8 }}>
            {phases.map((p) => (
              <div
                key={p.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span style={{ fontWeight: 800, color: ACCENT, width: 22 }}>{p.n}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>
                    {p.name}
                    {p.cmd !== "—" && (
                      <code style={{ marginLeft: 8, fontSize: 12, color: "var(--color-text-tertiary)" }}>
                        /{p.cmd}
                      </code>
                    )}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
                    {p.out} · готово, когда: {p.done}
                  </p>
                </div>
                <ArrowRight size={14} style={{ color: "var(--color-text-tertiary)" }} aria-hidden />
              </div>
            ))}
          </div>
        </Section>

        {/* Блок 3 */}
        <Section title="Дизайн: скиллы Anthropic + Emil Kowalski" kicker="Фаза 4 — визуальный язык до кода">
          <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            После PRD агент не бросается писать код. Сначала он читает четыре скилла
            и собирает UI-кит — палитру, типографику, сетку и состояния.
          </p>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {designSkills.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "16px",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  borderTop: `3px solid ${ACCENT}`,
                }}
              >
                <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 15, fontFamily: "ui-monospace, monospace" }}>
                  {s.href ? (
                    <Link href={s.href} style={{ color: "inherit", textDecoration: "none" }}>
                      {s.name} →
                    </Link>
                  ) : (
                    s.name
                  )}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "var(--color-text-tertiary)" }}>
                  {s.source}
                </p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Блок 4 */}
        <Section title="Правила окружения" kicker="Как строить проект с нуля">
          <div style={{ display: "grid", gap: 10 }}>
            {envRules.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: "12px 14px",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Icon size={18} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} aria-hidden />
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{r.text}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Блок 5 */}
        <Section title="Стартовый шаблон: анатомия" kicker="Что внутри до скачивания">
          <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Каждый файл отвечает на три вопроса: <strong>что это → зачем → когда трогать</strong>.
            Не качайте zip «вслепую» — вот вся структура:
          </p>
          <pre
            style={{
              margin: "0 0 16px",
              padding: "18px 16px",
              background: "#0f172a",
              color: "#e2e8f0",
              fontSize: 13,
              lineHeight: 1.7,
              overflowX: "auto",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            {treeLines.map((t) => (
              <div key={t.line}>
                <span style={{ color: t.line.startsWith("├") || t.line.startsWith("└") || t.line.startsWith("│") ? "#94a3b8" : "#f1f5f9", fontWeight: t.line.endsWith("/") || !t.line.includes(".") ? 700 : 400 }}>
                  {t.line}
                </span>
                {t.note && <span style={{ color: "#7dd3d3" }}>  {t.note}</span>}
              </div>
            ))}
          </pre>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Link
              href="/starter-kit/ai-project-starter.zip"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 18px",
                background: ACCENT,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              <Download size={16} /> Скачать ai-project-starter.zip
            </Link>
            <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
              ~80 КБ · Markdown + скрипт адаптеров · без зависимостей
            </span>
          </div>

          <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 15 }}>Как запустить в своей среде</p>
          <div style={{ display: "grid", gap: 10 }}>
            <EnvStep name="OpenCode" cmd="Распакуй архив, открой папку в OpenCode, введи /brief." />
            <EnvStep name="Cursor" cmd="Распакуй, скопируй adapters/cursor/.cursor в корень проекта, попроси агента прочитать правило 00-brief." />
            <EnvStep name="Reasonix" cmd="Распакуй, скопируй adapters/reasonix/.reasonix в корень, вызови skill brief." />
          </div>
        </Section>

        {/* Блок 6 */}
        <Section title="Чек-лист приёмки" kicker="Как понять, что проект готов">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {acceptance.map((a) => (
              <li key={a} style={{ fontSize: 14, lineHeight: 1.6 }}>
                <CheckCircle2 size={14} style={{ color: "#0fb880", display: "inline", marginRight: 6, verticalAlign: -2 }} aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        </Section>

        {/* Навигация */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", marginTop: 48 }}>
          <Link
            href="/agent-engineering/graph"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-primary)",
              textDecoration: "none",
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: 14,
              minHeight: 48,
            }}
          >
            <ArrowLeft size={16} /> Graph — карта системы
          </Link>
          <Link
            href="/resheniya"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "var(--color-accent)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              minHeight: 48,
            }}
          >
            К готовым решениям <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }} aria-labelledby={title.replace(/\s+/g, "-")}>
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--color-accent)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {kicker}
      </p>
      <h2
        id={title.replace(/\s+/g, "-")}
        style={{
          margin: "0 0 16px",
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(20px, 3vw, 24px)",
          fontWeight: 800,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function EnvStep({ name, cmd }: { name: string; cmd: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "12px 14px",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          fontWeight: 800,
          fontSize: 13,
          color: ACCENT,
          minWidth: 88,
        }}
      >
        {name}
      </span>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{cmd}</p>
    </div>
  );
}
