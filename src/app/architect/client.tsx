'use client';
import { useState } from "react";
import { Sparkles, Loader, Zap, Database, Plug, Package, AlertTriangle, Clock, DollarSign, Server, Cpu, Copy, Check, ChevronDown, ChevronRight, History } from "lucide-react";
import Link from "next/link";

const IDEAS = [
  { label: "SaaS для SEO", text: "Сервис автоматической проверки сайтов на SEO-ошибки с генерацией отчётов и коммерческих предложений владельцам." },
  { label: "Чат-бот поддержки", text: "AI-бот для Telegram, который отвечает на частые вопросы клиентов, собирает заявки и переключает на оператора." },
  { label: "Лендинг услуг", text: "Продающий лендинг для стоматологии: hero, услуги, отзывы, форма записи, интеграция с Telegram." },
  { label: "CRM для бизнеса", text: "Простая CRM для малого бизнеса: клиенты, сделки, задачи, напоминания. С интеграцией Telegram-уведомлений." },
  { label: "AI-консультант", text: "Виджет AI-консультанта на сайт: отвечает на вопросы, знает услуги, собирает заявки в Telegram." },
];

const PROGRESS = [
  "Анализирую задачу...",
  "Определяю тип продукта...",
  "Подбираю архитектурные паттерны...",
  "Проектирую сущности базы данных...",
  "Подбираю интеграции и MCP-серверы...",
  "Подбираю готовые промпты...",
  "Оцениваю стоимость и сроки...",
  "Формирую план разработки...",
  "Выявляю типичные ошибки...",
];

export default function ArchitectClient() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressIdx, setProgressIdx] = useState(-1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  function toggle(s: string) { setOpenSections(prev => ({ ...prev, [s]: !prev[s] })); }

  async function analyze() {
    if (!idea.trim() || idea.length < 10) return;
    setLoading(true); setError(""); setResult(null); setProgressIdx(0);
    const timer = setInterval(() => setProgressIdx(p => { if (p >= PROGRESS.length - 1) { clearInterval(timer); return p; } return p + 1; }), 1000);
    try {
      await new Promise(r => setTimeout(r, 600));
      const res = await fetch("/api/architect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea }) });
      const data = await res.json();
      clearInterval(timer);
      if (data.error && !data.productType) { setError(data.error); setProgressIdx(-1); setLoading(false); return; }
      setProgressIdx(PROGRESS.length);
      setTimeout(() => { setResult(data); setLoading(false); setOpenSections({ entities: true, plan: true }); }, 500);
    } catch { clearInterval(timer); setError("Ошибка соединения"); setLoading(false); }
  }

  function sectionText(key: string): string {
    if (!result) return "";
    if (key === "entities") return (result.entities || []).join("\n");
    if (key === "plan") return (result.plan || []).join("\n");
    if (key === "mistakes") return (result.mistakes || []).join("\n");
    if (key === "patterns") return (result.patterns || []).map((p: any) => p.title).join("\n");
    if (key === "mcp") return (result.mcp || []).map((m: any) => m.name).join("\n");
    if (key === "prompts") return (result.prompts || []).map((p: any) => p.title).join("\n");
    return "";
  }

  function copySection(key: string) {
    const t = sectionText(key);
    if (t) { navigator.clipboard.writeText(t); setCopiedSection(key); setTimeout(() => setCopiedSection(""), 2000); }
  }

  function fullDoc(): string {
    if (!result) return "";
    const L = ["# Архитектура проекта\n", result.summary || "", "\n## Метаданные", `- Тип: ${result.productType || "—"}`, `- Сложность: ${result.complexity || "—"}/10`, `- MVP: ${result.mvpDays || "—"}`, `- Монетизация: ${result.monetization || "—"}`, "", "## Стоимость", `- Разработка: ${result.costDev || "—"}`, `- AI: ${result.costAi || "—"}`, `- Сервер: ${result.costServer || "—"}`, ""];
    if (result.entities?.length) { L.push("## Сущности БД"); result.entities.forEach((e: string) => L.push(`- ${e}`)); L.push(""); }
    if (result.plan?.length) { L.push("## План разработки"); result.plan.forEach((p: string, i: number) => L.push(`${i + 1}. ${p}`)); L.push(""); }
    if (result.patterns?.length) { L.push("## Паттерны"); result.patterns.forEach((p: any) => L.push(`- ${p.title} (/patterns/${p.slug})`)); L.push(""); }
    if (result.mcp?.length) { L.push("## MCP-серверы"); result.mcp.forEach((m: any) => L.push(`- ${m.name} (/mcp/${m.slug})`)); L.push(""); }
    if (result.prompts?.length) { L.push("## Промпты"); result.prompts.forEach((p: any) => L.push(`- ${p.title}`)); L.push(""); }
    if (result.mistakes?.length) { L.push("## Типичные ошибки"); result.mistakes.forEach((m: string) => L.push(`- ❌ ${m}`)); L.push(""); }
    return L.join("\n");
  }

  const doc = result ? fullDoc() : "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
      <header style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 900, fontFamily: "var(--font-heading)", margin: 0, letterSpacing: "-0.02em" }}>
              <Cpu size={22} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--color-accent)" }} />
              AI <span style={{ color: "var(--color-accent)" }}>Архитектор</span>
            </h1>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", margin: "4px 0 0 0" }}>Опиши бизнес-идею — получи карту проекта для агента</p>
          </div>
          <a href="/" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none" }}>← На главную</a>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        {/* Input */}
        <div style={{ marginBottom: "var(--space-l)" }}>
          <div style={{ display: "flex", gap: 0, border: "2px solid " + (idea.length >= 10 ? "var(--color-accent)" : "var(--color-border)"), background: "var(--color-bg-primary)", overflow: "hidden" }}>
            <input value={idea} onChange={e => setIdea(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) analyze(); }}
              placeholder="Опиши бизнес-идею... Например: сервис проверки сайтов на SEO-ошибки"
              style={{ flex: 1, padding: "16px 20px", border: "none", fontSize: "var(--text-m)", fontFamily: "var(--font-body)", outline: "none", background: "transparent", color: "var(--color-text-primary)" }} />
            <button onClick={analyze} disabled={loading || idea.length < 10}
              style={{ padding: "16px 28px", background: idea.length >= 10 ? "var(--color-accent)" : "var(--color-border)", color: "#fff", border: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", cursor: idea.length >= 10 ? "pointer" : "default", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              {loading ? <Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={16} />}
              {loading ? "Анализ..." : "Анализировать"}
            </button>
          </div>
        </div>

        {/* Chips */}
        {!result && !loading && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-l)" }}>
            {IDEAS.map((s, i) => (
              <button key={i} onClick={() => setIdea(s.text)}
                style={{ padding: "6px 14px", background: idea === s.text ? "var(--color-accent-light)" : "var(--color-bg-primary)", border: "1px solid " + (idea === s.text ? "var(--color-accent)" : "var(--color-border)"), color: idea === s.text ? "var(--color-accent)" : "var(--color-text-secondary)", cursor: "pointer", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", borderRadius: 0, whiteSpace: "nowrap" }}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Progress */}
        {loading && progressIdx >= 0 && (
          <div style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", marginBottom: "var(--space-l)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-s)" }}>
              <div style={{ flex: 1, height: 4, background: "var(--color-border-light)", overflow: "hidden" }}>
                <div style={{ width: ((progressIdx + 1) / PROGRESS.length * 100) + "%", height: "100%", background: "var(--color-accent)", transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{progressIdx + 1}/{PROGRESS.length}</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 14, background: "var(--color-accent)", animation: "blink 1s step-end infinite" }} />
              <span>{PROGRESS[progressIdx] || PROGRESS[PROGRESS.length - 1]}</span>
            </div>
          </div>
        )}

        {error && <div style={{ padding: "var(--space-m)", background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", fontSize: "var(--text-xs)", marginBottom: "var(--space-l)" }}>{error}</div>}

        {/* Results */}
        {result && (
          <div>
            {result.summary && (
              <div style={{ padding: "var(--space-l)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", borderLeft: "4px solid var(--color-accent)", marginBottom: "var(--space-l)" }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Резюме</div>
                <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.7 }}>{result.summary}</div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
              {[
                { icon: Cpu, label: "Тип", value: result.productType },
                { icon: AlertTriangle, label: "Сложность", value: `${result.complexity}/10` },
                { icon: Clock, label: "MVP", value: result.mvpDays },
                { icon: DollarSign, label: "Монетизация", value: result.monetization },
                { icon: Clock, label: "Разработка", value: result.costDev },
                { icon: Zap, label: "AI-расходы", value: result.costAi },
                { icon: Server, label: "Сервер", value: result.costServer },
              ].map((m, i) => (
                <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <m.icon size={12} style={{ color: "var(--color-accent)" }} />
                    <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</span>
                  </div>
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Refine */}
            <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", display: "flex", gap: 8, alignItems: "center" }}>
              <input id="refine-inp" placeholder="Уточнить: добавь интеграцию с ЮKassa, Telegram..."
                style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", outline: "none", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", borderRadius: 0 }} />
              <button onClick={() => { const inp = document.getElementById("refine-inp") as HTMLInputElement; if (inp?.value) { setIdea(idea + ". " + inp.value); inp.value = ""; analyze(); } }}
                style={{ padding: "10px 18px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-body)", whiteSpace: "nowrap", borderRadius: 0 }}>
                🔄 Уточнить
              </button>
            </div>

            {/* Accordions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
              {[
                { key: "entities", icon: Database, label: "Сущности базы данных", color: "var(--color-accent)", render: () => result.entities?.map((e: string, i: number) => <span key={i} style={{ padding: "4px 10px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", margin: "0 4px 4px 0", display: "inline-block" }}>{e}</span>) },
                { key: "plan", icon: AlertTriangle, label: "План разработки", color: "#f59e0b", render: () => result.plan?.map((p: string, i: number) => <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < result.plan.length - 1 ? "1px solid var(--color-border-light)" : "none", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}><span style={{ width: 22, height: 22, background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span><span>{p}</span></div>) },
                { key: "patterns", icon: Package, label: "Паттерны", color: "#8b5cf6", render: () => result.patterns?.map((p: any, i: number) => <Link key={i} href={`/patterns/${p.slug}`} style={{ padding: "5px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", margin: "0 4px 4px 0", display: "inline-flex", alignItems: "center", gap: 6 }}><Package size={11} /> {p.title}</Link>) },
                { key: "mcp", icon: Plug, label: "MCP-серверы", color: "#ef4444", render: () => result.mcp?.map((m: any, i: number) => <Link key={i} href={`/mcp/${m.slug}`} style={{ padding: "5px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", margin: "0 4px 4px 0", display: "inline-block" }}>{m.name}</Link>) },
                { key: "prompts", icon: Sparkles, label: "Промпты", color: "#f59e0b", render: () => result.prompts?.map((p: any, i: number) => <span key={i} style={{ padding: "5px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: "0 4px 4px 0", display: "inline-block" }}>{p.title}</span>) },
                { key: "mistakes", icon: AlertTriangle, label: "Типичные ошибки", color: "#ef4444", render: () => result.mistakes?.map((m: string, i: number) => <div key={i} style={{ display: "flex", gap: 8, padding: "3px 0", fontSize: "var(--text-xs)", color: "#991b1b", lineHeight: 1.6 }}><span style={{ flexShrink: 0 }}>❌</span><span>{m}</span></div>) },
              ].map(section => {
                const content = section.render();
                const isOpen = openSections[section.key] ?? (section.key === "entities" || section.key === "plan");
                if (!content || (Array.isArray(content) && content.length === 0)) return null;
                return (
                  <div key={section.key} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                    <button onClick={() => toggle(section.key)}
                      style={{ width: "100%", padding: "var(--space-m) var(--space-l)", display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-text-primary)", textAlign: "left" }}>
                      {isOpen ? <ChevronDown size={14} style={{ color: section.color }} /> : <ChevronRight size={14} style={{ color: section.color }} />}
                      <section.icon size={14} style={{ color: section.color }} />
                      <span>{section.label}</span>
                      <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>{Array.isArray(content) ? content.length : ""}</span>
                      <button onClick={(e: any) => { e.stopPropagation(); copySection(section.key); }}
                        style={{ padding: "2px 8px", border: "1px solid var(--color-border)", background: copiedSection === section.key ? "var(--color-accent)" : "transparent", color: copiedSection === section.key ? "#fff" : "var(--color-text-tertiary)", cursor: "pointer", fontSize: 10, fontFamily: "var(--font-body)", marginLeft: 6, flexShrink: 0 }}
                        title="Копировать секцию">
                        {copiedSection === section.key ? <Check size={10} /> : <Copy size={10} />}
                      </button>
                    </button>
                    {isOpen && <div style={{ padding: "0 var(--space-l) var(--space-l)", borderTop: "1px solid var(--color-border-light)" }}><div style={{ paddingTop: "var(--space-m)" }}>{content}</div></div>}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
              <button onClick={() => { navigator.clipboard.writeText(doc); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }}
                style={{ padding: "12px 24px", background: "var(--color-accent)", color: "#fff", border: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderRadius: 0 }}>
                {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                {copiedAll ? "Скопировано!" : "📋 Копировать Markdown"}
              </button>
              <button onClick={() => { setIdea(""); setResult(null); setProgressIdx(-1); }}
                style={{ padding: "12px 24px", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", borderRadius: 0 }}>
                Новый анализ
              </button>
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
              Скопируй Markdown и отправь в Cursor / VS Code / Claude Code — агент поймёт архитектуру и начнёт писать код
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
