'use client';
import { useState } from "react";
import { Play, RefreshCw, Copy, ExternalLink, Sparkles, ArrowRight, Code, Eye } from "lucide-react";

const SUGGESTIONS = [
  { label: "Лендинг стоматологии", prompt: "Создай лендинг стоматологической клиники с формой записи на приём. Заголовок, 3 преимущества, форма с именем и телефоном, кнопка." },
  { label: "Карточка товара", prompt: "Создай карточку товара для интернет-магазина: фото-заглушка, название, цена 2 490 руб, кнопка Купить, описание из 2 предложений." },
  { label: "Telegram-бот интерфейс", prompt: "Создай интерфейс Telegram-бота для записи клиентов: приветствие, выбор услуги из 3 вариантов, поле для имени, кнопка Записаться." },
  { label: "Дашборд метрики", prompt: "Создай мини-дашборд с 4 метриками в карточках: Продажи (142 000 руб), Заявки (38), Конверсия (4.2%), Клиенты (12). Зелёный акцент." },
  { label: "Форма обратной связи", prompt: "Создай форму обратной связи: имя, email, сообщение, кнопка Отправить. Чистый минимализм, серый фон, белая форма." },
];

export default function PlaygroundClient() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  async function run() {
    if (!prompt.trim()) return;
    setLoading(true); setError(""); setHtml("");
    try {
      const res = await fetch("/api/playground", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setHtml(data.html); }
    } catch { setError("Ошибка соединения"); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-primary)", padding: "var(--space-l) var(--space-xl)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 900, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em", margin: 0 }}>
              Prompt <span style={{ color: "var(--color-accent)" }}>Playground</span>
            </h1>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", margin: "4px 0 0 0" }}>Пиши промпт — смотри живой результат. Без Cursor, без установки.</p>
          </div>
          <a href="/" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none" }}>← На главную</a>
        </div>
      </header>

      {/* Main */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        {/* Suggestions */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-l)" }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => setPrompt(s.prompt)}
              style={{ padding: "6px 14px", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--font-body)", borderRadius: 0, whiteSpace: "nowrap" }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Split */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-l)", minHeight: 500 }}>
          {/* LEFT: Prompt */}
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-l)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-m)" }}>
              <Sparkles size={16} style={{ color: "var(--color-accent)" }} />
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-tertiary)" }}>Твой промпт</span>
            </div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="Опиши что хочешь создать... Например: лендинг кофейни с меню и формой заказа..."
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) run(); }}
              style={{ flex: 1, width: "100%", padding: "var(--space-m)", border: "1px solid var(--color-border)", borderRadius: 0, resize: "none", fontSize: "var(--text-s)", fontFamily: "var(--font-body)", lineHeight: 1.7, outline: "none", background: "var(--color-bg-secondary)" }} />
            <div style={{ display: "flex", gap: 8, marginTop: "var(--space-m)", alignItems: "center" }}>
              <button onClick={run} disabled={loading || !prompt.trim()}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", background: prompt.trim() ? "var(--color-accent)" : "var(--color-border)", color: "#fff", border: "none", borderRadius: 0, fontSize: "var(--text-s)", fontWeight: 700, cursor: prompt.trim() ? "pointer" : "default", fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}>
                {loading ? <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={16} />}
                {loading ? "Генерирую..." : "Запустить"}
                {!loading && <span style={{ fontSize: 10, opacity: 0.6 }}>Ctrl+Enter</span>}
              </button>
              {error && <span style={{ fontSize: "var(--text-xs)", color: "var(--color-error)" }}>{error}</span>}
            </div>
          </div>

          {/* RIGHT: Result */}
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-m) var(--space-l)", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Eye size={14} style={{ color: "var(--color-accent)" }} />
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-tertiary)" }}>Результат</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setViewMode("preview")}
                  style={{ padding: "4px 10px", border: "1px solid var(--color-border)", borderRadius: 0, background: viewMode === "preview" ? "var(--color-accent)" : "transparent", color: viewMode === "preview" ? "#fff" : "var(--color-text-secondary)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                  <Eye size={10} style={{ display: "inline", marginRight: 4 }} />Preview
                </button>
                <button onClick={() => setViewMode("code")}
                  style={{ padding: "4px 10px", border: "1px solid var(--color-border)", borderRadius: 0, background: viewMode === "code" ? "var(--color-accent)" : "transparent", color: viewMode === "code" ? "#fff" : "var(--color-text-secondary)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                  <Code size={10} style={{ display: "inline", marginRight: 4 }} />Код
                </button>
                {html && (
                  <button onClick={() => { navigator.clipboard.writeText(html); }}
                    style={{ padding: "4px 10px", border: "1px solid var(--color-border)", borderRadius: 0, background: "transparent", color: "var(--color-text-secondary)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                    <Copy size={10} style={{ display: "inline", marginRight: 4 }} />Копировать
                  </button>
                )}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {!html && !loading && (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-tertiary)", fontSize: "var(--text-s)", flexDirection: "column", gap: 12 }}>
                  <Sparkles size={40} style={{ opacity: 0.3 }} />
                  <span>Напиши промпт слева и нажми «Запустить»</span>
                  <span style={{ fontSize: "var(--text-xs)" }}>AI создаст страницу за несколько секунд</span>
                </div>
              )}
              {loading && (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                  <RefreshCw size={40} style={{ animation: "spin 1s linear infinite", color: "var(--color-accent)" }} />
                  <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>DeepSeek генерирует страницу...</span>
                </div>
              )}
              {html && viewMode === "preview" && (
                <iframe srcDoc={html} style={{ width: "100%", height: "100%", border: "none", minHeight: 500 }} sandbox="allow-scripts allow-same-origin" title="Preview" />
              )}
              {html && viewMode === "code" && (
                <pre style={{ margin: 0, padding: "var(--space-m)", fontSize: 11, lineHeight: 1.5, overflow: "auto", maxHeight: 600, background: "var(--color-bg-secondary)", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                  {html}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
