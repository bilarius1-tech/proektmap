'use client';
import { useState, useEffect } from "react";
import { Sparkles, Loader, Zap, Database, Plug, Package, AlertTriangle, Clock, DollarSign, Server, Cpu, Copy, Check, ChevronDown, ChevronRight, Download, ThumbsUp, FileText } from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";

const CATEGORIES = [
  { name: "SaaS", icon: "☁️", ideas: [
    { label: "SEO-аудитор", text: "Сервис проверки сайтов на SEO-ошибки с генерацией отчётов и КП владельцам. Подписка 990 ₽/мес." },
    { label: "AI-консультант", text: "Виджет на сайт: отвечает про услуги, собирает заявки, отправляет в Telegram. SaaS с подпиской." },
    { label: "Конструктор лендингов", text: "No-code платформа: шаблоны, AI-генерация текста, A/B тесты, аналитика. B2B." },
  ]},
  { name: "Боты и автоматизация", icon: "🤖", ideas: [
    { label: "Telegram-бот поддержки", text: "AI-бот: отвечает на FAQ из базы знаний, собирает заявки, переключает на оператора." },
    { label: "Автоворонка продаж", text: "Бот квалифицирует лидов: задаёт вопросы, оценивает бюджет, передаёт тёплых менеджеру." },
    { label: "Умный каталог", text: "Бот-витрина: поиск товаров по фото, рекомендации, корзина, оплата через ЮKassa." },
  ]},
  { name: "Маркетплейсы и CRM", icon: "🏪", ideas: [
    { label: "Маркетплейс услуг", text: "Платформа где исполнители создают анкеты, а заказчики находят их по фильтрам. Рейтинг, отзывы, чат." },
    { label: "CRM для малого бизнеса", text: "Клиенты, сделки, задачи, напоминания. Интеграция с Telegram и email-рассылками." },
  ]},
  { name: "Инструменты", icon: "🛠️", ideas: [
    { label: "Генератор КП", text: "Сервис: ввёл данные клиента → получил персонализированное коммерческое предложение в PDF." },
    { label: "AI-ассистент риэлтора", text: "Подбор объектов по параметрам, автообзвон, запись на показ, CRM для сделок." },
  ]},
];

const IDEAS = CATEGORIES.flatMap(c => c.ideas);

const PROGRESS = ["Анализирую задачу...","Определяю тип продукта...","Прорабатываю 3 варианта архитектуры...","Проектирую сущности...","Подбираю стек и MCP...","Оцениваю стоимость...","Формирую план...","Готово!"];

export default function ArchitectClient() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressIdx, setProgressIdx] = useState(-1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(0);
  const [copied, setCopied] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  function toggle(s: string) { setOpenSections(p => ({ ...p, [s]: !p[s] })); }

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check").then(r => r.json()).then(d => {
      setIsLoggedIn(d.authenticated || false);
      setIsPro(d.subscription === "pro");
    }).catch(() => setIsLoggedIn(false));
  }, []);

  async function analyze() {
    if (!idea.trim() || idea.length < 10) return;
    setLoading(true); setError(""); setResult(null); setProgressIdx(0); setSelectedOption(0);
    const timer = setInterval(() => setProgressIdx(p => { if (p >= PROGRESS.length - 1) { clearInterval(timer); return p; } return p + 1; }), 800);
    try {
      await new Promise(r => setTimeout(r, 500));
      const res = await fetch("/api/architect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea }) });
      const data = await res.json();
      clearInterval(timer);
      if (data.error && !data.options) { setError(data.error); setProgressIdx(-1); setLoading(false); return; }
      setProgressIdx(PROGRESS.length);
      setTimeout(() => { setResult(data); setLoading(false); setOpenSections({ entities: true, plan: true }); }, 400);
    } catch { clearInterval(timer); setError("Ошибка соединения"); setLoading(false); }
  }

  const option = result?.options?.[selectedOption];

  function exportPDF() {
    if (!option) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    let y = 20;
    const margin = 20;
    const w = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFont("helvetica", "bold"); doc.setFontSize(18);
    doc.text("Архитектура проекта", margin, y); y += 12;
    doc.setFontSize(12); doc.setFont("helvetica", "normal");
    doc.text(option.name || "", margin, y); y += 8;
    doc.setFontSize(10);
    doc.text(option.summary || "", margin, y, { maxWidth: w }); y += 16;

    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("Метаданные", margin, y); y += 8;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const meta = [`Тип: ${result.productType || "—"}`, `Сложность: ${option.complexity}/10`, `MVP: ${option.mvpDays}`, `Монетизация: ${option.monetization}`, `Разработка: ${option.costDev}`, `AI: ${option.costAi}`, `Сервер: ${option.costServer}`];
    meta.forEach(m => { doc.text(m, margin, y); y += 6; }); y += 6;

    if (option.entities?.length) { doc.setFont("helvetica", "bold"); doc.text("Сущности БД", margin, y); y += 8; doc.setFont("helvetica", "normal"); option.entities.forEach((e: string) => { doc.text("• " + e, margin, y); y += 5; }); y += 4; }
    if (option.plan?.length) { doc.setFont("helvetica", "bold"); doc.text("План разработки", margin, y); y += 8; doc.setFont("helvetica", "normal"); option.plan.forEach((p: string, i: number) => { doc.text(`${i + 1}. ${p}`, margin, y, { maxWidth: w }); y += 5; }); y += 4; }
    if (option.mistakes?.length) { doc.setFont("helvetica", "bold"); doc.text("Типичные ошибки", margin, y); y += 8; doc.setFont("helvetica", "normal"); option.mistakes.forEach((m: string) => { doc.text("❌ " + m, margin, y, { maxWidth: w }); y += 5; }); }

    doc.save("architect-blueprint.pdf");
  }

  function fullDoc(): string { if (!option) return ""; const L = ["# " + (option.name || "Архитектура"), "", option.summary || "", "", "## Метаданные", `- Тип: ${result.productType}`, `- Сложность: ${option.complexity}/10`, `- MVP: ${option.mvpDays}`, `- Монетизация: ${option.monetization}`, `- Разработка: ${option.costDev}`, `- AI: ${option.costAi}`, `- Сервер: ${option.costServer}`, ""];
    if (option.entities?.length) { L.push("## Сущности БД"); option.entities.forEach((e: string) => L.push(`- ${e}`)); L.push(""); }
    if (option.plan?.length) { L.push("## План"); option.plan.forEach((p: string, i: number) => L.push(`${i + 1}. ${p}`)); L.push(""); }
    if (option.patterns?.length) { L.push("## Паттерны"); option.patterns.forEach((p: any) => L.push(`- ${p.title} (/patterns/${p.slug})`)); L.push(""); }
    if (option.mcp?.length) { L.push("## MCP"); option.mcp.forEach((m: any) => L.push(`- ${m.name} (/mcp/${m.slug})`)); L.push(""); }
    if (option.mistakes?.length) { L.push("## Ошибки"); option.mistakes.forEach((m: string) => L.push(`- ❌ ${m}`)); L.push(""); }
    return L.join("\n"); }

  function sectionText(key: string): string { if (!option) return "";
    if (key === "entities") return (option.entities || []).join("\n"); if (key === "plan") return (option.plan || []).join("\n");
    if (key === "mistakes") return (option.mistakes || []).join("\n"); if (key === "patterns") return (option.patterns || []).map((p: any) => p.title).join("\n");
    if (key === "mcp") return (option.mcp || []).map((m: any) => m.name).join("\n"); if (key === "prompts") return (option.prompts || []).map((p: any) => p.title).join("\n"); return ""; }

  function copySection(key: string) { const t = sectionText(key); if (t) { navigator.clipboard.writeText(t); setCopied(key); setTimeout(() => setCopied(""), 2000); } }

  const docText = option ? fullDoc() : "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
      <header style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><h1 style={{ fontSize: "var(--text-xl)", fontWeight: 900, fontFamily: "var(--font-heading)", margin: 0, letterSpacing: "-0.02em" }}><Cpu size={22} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--color-accent)" }} />AI <span style={{ color: "var(--color-accent)" }}>Архитектор</span></h1>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", margin: "4px 0 0 0" }}>Опиши идею — получи 3 варианта архитектуры с экспертными рекомендациями</p></div>
          <a href="/" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none" }}>← На главную</a>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        {/* Quick steps */}
          {!result && !loading && (
            <div style={{ display: "flex", gap: "var(--space-l)", justifyContent: "center", marginBottom: "var(--space-l)", flexWrap: "wrap" }}>
              {[
                { num: "1", title: "Опиши идею", desc: "Напиши что хочешь создать. Чем детальнее — тем точнее анализ." },
                { num: "2", title: "Выбери вариант", desc: "AI предложит 3 архитектуры: от быстрого MVP до максимальной." },
                { num: "3", title: "Скопируй агенту", desc: "Markdown-документ → Cursor/Claude Code. Агент начнёт писать код." },
              ].map(s => (
                <div key={s.num} style={{ flex: "1", minWidth: 180, maxWidth: 280, padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, fontFamily: "var(--font-heading)", margin: "0 auto 8px" }}>{s.num}</div>
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
        <div style={{ marginBottom: "var(--space-l)" }}><div style={{ display: "flex", gap: 0, border: "2px solid " + (idea.length >= 10 ? "var(--color-accent)" : "var(--color-border)"), background: "var(--color-bg-primary)", overflow: "hidden" }}>
          <input value={idea} onChange={e => setIdea(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) analyze(); }} placeholder="Опиши бизнес-идею... Например: сервис проверки сайтов на SEO-ошибки" style={{ flex: 1, padding: "16px 20px", border: "none", fontSize: "var(--text-m)", fontFamily: "var(--font-body)", outline: "none", background: "transparent", color: "var(--color-text-primary)" }} />
          <button onClick={analyze} disabled={loading || idea.length < 10} style={{ padding: "16px 28px", background: idea.length >= 10 ? "var(--color-accent)" : "var(--color-border)", color: "#fff", border: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", cursor: idea.length >= 10 ? "pointer" : "default", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>{loading ? <Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={16} />}{loading ? "Анализ..." : "Анализировать"}</button>
        </div></div>

        {!result && !loading && (
            <div style={{ marginBottom: "var(--space-l)" }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-s)" }}>Готовые примеры</div>
              {CATEGORIES.map(cat => (
                <div key={cat.name} style={{ marginBottom: "var(--space-m)" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 6 }}>{cat.icon} {cat.name}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {cat.ideas.map(s => (
                      <button key={s.label} onClick={() => setIdea(s.text)}
                        style={{ padding: "8px 14px", background: idea === s.text ? "var(--color-accent-light)" : "var(--color-bg-primary)", border: "1px solid " + (idea === s.text ? "var(--color-accent)" : "var(--color-border)"), color: idea === s.text ? "var(--color-accent)" : "var(--color-text-secondary)", cursor: "pointer", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", borderRadius: 0, whiteSpace: "nowrap", textAlign: "left" }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        {loading && progressIdx >= 0 && (<div style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", marginBottom: "var(--space-l)" }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-s)" }}><div style={{ flex: 1, height: 4, background: "var(--color-border-light)", overflow: "hidden" }}><div style={{ width: ((progressIdx + 1) / PROGRESS.length * 100) + "%", height: "100%", background: "var(--color-accent)", transition: "width 0.3s" }} /></div><span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{progressIdx + 1}/{PROGRESS.length}</span></div><div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 14, background: "var(--color-accent)", animation: "blink 1s step-end infinite" }} /><span>{PROGRESS[progressIdx]}</span></div></div>)}

        {error && <div style={{ padding: "var(--space-m)", background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", fontSize: "var(--text-xs)", marginBottom: "var(--space-l)" }}>{error}</div>}

        {result && (
          <div>
            {/* Expert recommendation */}
            {result.expertRecommendation && (
              <div style={{ padding: "var(--space-l)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", borderLeft: "4px solid var(--color-accent)", marginBottom: "var(--space-l)" }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>💡 Экспертная рекомендация</div>
                <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.7 }}>{result.expertRecommendation}</div>
              </div>
            )}

            {/* 3 Options */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-l)" }}>
              {result.options?.map((opt: any, i: number) => (
                <div key={i} onClick={() => { setSelectedOption(i); setOpenSections({ entities: true, plan: true }); }}
                  style={{ padding: "var(--space-l)", background: selectedOption === i ? "var(--color-accent-light)" : "var(--color-bg-primary)", border: "2px solid " + (selectedOption === i ? "var(--color-accent)" : "var(--color-border)"), cursor: "pointer", transition: "border-color 0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "var(--text-s)", fontFamily: "var(--font-heading)", marginBottom: 4 }}>
                        {i === 0 ? "🥉" : i === 1 ? "🥈" : "🥇"} {opt.name}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{opt.description}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: "var(--space-s)" }}>
                    <span>⚡ {opt.complexity}/10</span><span>⏱ {opt.mvpDays}</span><span>💰 {opt.costDev}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {opt.toolRecommendation && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>💻 {opt.toolRecommendation.split(".")[0]}</div>}
                  {opt.pros?.slice(0, 2).map((p: string, j: number) => <div key={j} style={{ fontSize: 11, color: "var(--color-accent)", display: "flex", alignItems: "center", gap: 4 }}><span>✓</span> {p}</div>)}
                  </div>
                  {selectedOption === i && <div style={{ marginTop: "var(--space-s)", padding: "4px 12px", background: "var(--color-accent)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-heading)", textAlign: "center" }}>ВЫБРАНО</div>}
                </div>
              ))}
            </div>

            {/* Pro gate */}
            {option && !isPro && isLoggedIn !== null && (
              <div style={{ padding: "var(--space-l)", background: "var(--color-accent-light)", border: "2px solid var(--color-accent)", textAlign: "center", marginBottom: "var(--space-l)" }}>
                <div style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 8 }}>Только для Pro</div>
                <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
                  Ты видишь 3 варианта архитектуры. Pro открывает: пошаговый план, сущности БД, стек, типичные ошибки, PDF.
                </div>
                {!isLoggedIn ? (
                  <a href="/auth" style={{ padding: "12px 28px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", display: "inline-block" }}>Войти и подключить Pro</a>
                ) : (
                  <a href="/pricing" style={{ padding: "12px 28px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", display: "inline-block" }}>Pro за 300 /мес</a>
                )}
              </div>
            )}

            {(isPro || isLoggedIn === null) && (
            {/* Detailed view for selected option */}
            {option && (
              <>
                {option.summary && <div style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", marginBottom: "var(--space-l)" }}><div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>📋 {option.name}</div><div style={{ fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.7 }}>{option.summary}</div></div>}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
                  {[{ icon: Cpu, label: "Тип", value: result.productType },{ icon: AlertTriangle, label: "Сложность", value: `${option.complexity}/10` },{ icon: Clock, label: "MVP", value: option.mvpDays },{ icon: DollarSign, label: "Монетизация", value: option.monetization },{ icon: Clock, label: "Разработка", value: option.costDev },{ icon: Zap, label: "AI-расходы", value: option.costAi },{ icon: Server, label: "Сервер", value: option.costServer }].map((m, i) => (<div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><m.icon size={12} style={{ color: "var(--color-accent)" }} /><span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</span></div><div style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{m.value}</div></div>))}
                </div>

                {/* Refine */}
                <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <input id="refine-inp" placeholder="Уточнить: добавь интеграцию с ЮKassa..." style={{ flex: 1, minWidth: 180, padding: "10px 14px", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", outline: "none", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", borderRadius: 0 }} />
                  <button onClick={() => { const inp = document.getElementById("refine-inp") as HTMLInputElement; if (inp?.value) { setIdea(idea + ". " + inp.value); inp.value = ""; analyze(); } }}
                    style={{ padding: "10px 14px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-body)", borderRadius: 0, whiteSpace: "nowrap" }}>🔄 Уточнить</button>
                  <button onClick={() => { setIdea(idea + ". Сделай проще, для новичка, меньше функционала."); analyze(); }}
                    style={{ padding: "10px 14px", background: "#f0fdf4", border: "1px solid var(--color-accent)", color: "var(--color-accent)", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-body)", borderRadius: 0, whiteSpace: "nowrap" }}>📉 Упростить</button>
                  <button onClick={() => { setIdea(idea + ". Сделай более техническим, добавь детали архитектуры, безопасности и масштабирования."); analyze(); }}
                    style={{ padding: "10px 14px", background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-body)", borderRadius: 0, whiteSpace: "nowrap" }}>📈 Углубить</button>
                </div>

                {/* Accordions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
                  {[
                    { key: "entities", icon: Database, label: "Сущности базы данных", color: "var(--color-accent)", render: () => option.entities?.map((e: string, i: number) => <span key={i} style={{ padding: "4px 10px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", margin: "0 4px 4px 0", display: "inline-block" }}>{e}</span>) },
                    { key: "plan", icon: AlertTriangle, label: "План разработки", color: "#f59e0b", render: () => option.plan?.map((p: string, i: number) => <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < option.plan.length - 1 ? "1px solid var(--color-border-light)" : "none", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}><span style={{ width: 22, height: 22, background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span><span>{p}</span></div>) },
                    { key: "patterns", icon: Package, label: "Паттерны", color: "#8b5cf6", render: () => option.patterns?.map((p: any, i: number) => <Link key={i} href={`/patterns/${p.slug}`} style={{ padding: "5px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", margin: "0 4px 4px 0", display: "inline-flex", alignItems: "center", gap: 6 }}><Package size={11} /> {p.title}</Link>) },
                    { key: "mcp", icon: Plug, label: "MCP-серверы", color: "#ef4444", render: () => option.mcp?.map((m: any, i: number) => <Link key={i} href={`/mcp/${m.slug}`} style={{ padding: "5px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", margin: "0 4px 4px 0", display: "inline-block" }}>{m.name}</Link>) },
                    { key: "prompts", icon: Sparkles, label: "Промпты", color: "#f59e0b", render: () => option.prompts?.map((p: any, i: number) => <span key={i} style={{ padding: "5px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: "0 4px 4px 0", display: "inline-block" }}>{p.title}</span>) },
                    { key: "mistakes", icon: AlertTriangle, label: "Типичные ошибки", color: "#ef4444", render: () => option.mistakes?.map((m: string, i: number) => <div key={i} style={{ display: "flex", gap: 8, padding: "3px 0", fontSize: "var(--text-xs)", color: "#991b1b", lineHeight: 1.6 }}><span style={{ flexShrink: 0 }}>❌</span><span>{m}</span></div>) },
                  ].map(s => { const c = s.render(); if (!c || (Array.isArray(c) && c.length === 0)) return null; const isOpen = openSections[s.key] ?? (s.key === "entities" || s.key === "plan"); return (
                    <div key={s.key} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                      <button onClick={() => toggle(s.key)} style={{ width: "100%", padding: "var(--space-m) var(--space-l)", display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-text-primary)", textAlign: "left" }}>{isOpen ? <ChevronDown size={14} style={{ color: s.color }} /> : <ChevronRight size={14} style={{ color: s.color }} />}<s.icon size={14} style={{ color: s.color }} /><span>{s.label}</span><span style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>{Array.isArray(c) ? c.length : ""}</span><button onClick={(e: any) => { e.stopPropagation(); copySection(s.key); }} style={{ padding: "2px 8px", border: "1px solid var(--color-border)", background: copied === s.key ? "var(--color-accent)" : "transparent", color: copied === s.key ? "#fff" : "var(--color-text-tertiary)", cursor: "pointer", fontSize: 10, fontFamily: "var(--font-body)", marginLeft: 6, flexShrink: 0 }} title="Копировать">{copied === s.key ? <Check size={10} /> : <Copy size={10} />}</button></button>
                      {isOpen && <div style={{ padding: "0 var(--space-l) var(--space-l)", borderTop: "1px solid var(--color-border-light)" }}><div style={{ paddingTop: "var(--space-m)" }}>{c}</div></div>}
                    </div>)})}
                </div>

                {/* Actions */})}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                  <button onClick={() => { navigator.clipboard.writeText(docText); setCopied("doc"); setTimeout(() => setCopied(""), 2000); }}
                    style={{ padding: "12px 24px", background: "var(--color-accent)", color: "#fff", border: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderRadius: 0 }}>
                    {copied === "doc" ? <Check size={14} /> : <Copy size={14} />}{copied === "doc" ? "Скопировано!" : "📋 Markdown"}
                  </button>
                  <button onClick={exportPDF}
                    style={{ padding: "12px 24px", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderRadius: 0 }}>
                    <Download size={14} /> PDF
                  </button>
                  <button onClick={() => { setIdea(""); setResult(null); setProgressIdx(-1); }}
                    style={{ padding: "12px 24px", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", borderRadius: 0 }}>Новый анализ</button>
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Markdown → Cursor / VS Code / Claude Code. Агент поймёт архитектуру и начнёт писать код.</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
