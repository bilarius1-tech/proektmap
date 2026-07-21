"use client";

import { useState } from "react";
import { Search, Star, ExternalLink, Check, X, ArrowUpDown, Copy, Tag, ChevronDown, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, string> = {
  "Файлы": "📂", "Базы данных": "🗄️", "Git": "🔄", "Поиск": "🔍",
  "Браузер": "🌐", "Коммуникации": "💬", "AI и память": "🧠",
  "Разработка": "💻", "Облако": "☁️", "Веб и API": "🌍",
  "Управление проектами": "📋", "Заметки": "📝", "Дизайн": "🎨",
  "Бизнес": "💼", "DevOps": "⚙️", "Наука и данные": "🔬",
  "AI сервисы": "🤖", "Данные": "📊", "Медиа": "🎬",
  "Утилиты": "🔧", "Каталоги": "📚", "Офисные": "📎", "Гео и карты": "🗺️",
};

// AI Tools compatibility map
const TOOL_COMPAT: Record<string, string[]> = {
  "cursor": ["github-mcp","postgres-mcp","brave-search-mcp","puppeteer-mcp","memory-mcp","sequential-thinking","chrome-devtools-mcp","context7","fetch-mcp","linear-mcp","notion-mcp","playwright-mcp","figma-mcp","sentry-mcp","stripe-mcp","supabase-mcp","exa-mcp","cloudflare-mcp","jira-mcp","todoist-mcp","git-mcp","time-mcp","elevenlabs-mcp","telegram-mcp","tavily-mcp","claude-desktop-commander","jetbrains-mcp","yandex-cloud-mcp","openai-mcp"],
  "claude": ["github-mcp","postgres-mcp","brave-search-mcp","puppeteer-mcp","memory-mcp","sequential-thinking","slack-mcp","chrome-devtools-mcp","context7","fetch-mcp","linear-mcp","obsidian-mcp","firecrawl-mcp","notion-mcp","playwright-mcp","figma-mcp","sentry-mcp","stripe-mcp","exa-mcp","jira-mcp","arxiv-mcp","weather-mcp","git-mcp","time-mcp","elevenlabs-mcp","telegram-mcp","tavily-mcp","claude-desktop-commander","openai-mcp"],
  "reasonix": ["filesystem","github-mcp","postgres-mcp","brave-search-mcp","memory-mcp","sequential-thinking","fetch-mcp","firecrawl-mcp","git-mcp","docker-mcp","claude-desktop-commander","tavily-mcp","openai-mcp"],
  "vibecraft": ["yandex-cloud-mcp","gitverse-mcp","telegram-mcp","postgres-mcp","fetch-mcp"],
  "cursor-agent": ["github-mcp","postgres-mcp","chrome-devtools-mcp","context7","playwright-mcp","sentry-mcp","stripe-mcp","supabase-mcp","cloudflare-mcp","jira-mcp","git-mcp","claude-desktop-commander","jetbrains-mcp"],
  "windsurf": ["github-mcp","postgres-mcp","memory-mcp","sequential-thinking","context7","chrome-devtools-mcp","firecrawl-mcp","playwright-mcp","sentry-mcp","supabase-mcp","git-mcp"],
};

const MCP_FAQ = [
  { q: "Что такое MCP простыми словами?", a: "MCP (Model Context Protocol) — это «USB-разъём» для AI. Раньше каждый AI-инструмент нужно было подключать к каждой базе данных или API отдельно. MCP делает это единым способом: один раз установил сервер — и он работает в Cursor, Claude, Reasonix и других AI-инструментах." },
  { q: "Как установить MCP-сервер?", a: "Большинство серверов устанавливаются одной командой в терминале: npx -y @scope/server-name. После этого добавьте сервер в конфигурацию вашего AI-инструмента (Cursor → Settings → MCP, Claude Desktop → claude_desktop_config.json)." },
  { q: "Безопасно ли это?", a: "Да. MCP-серверы работают локально на вашем компьютере. Данные не отправляются в облако (если только сам сервер не использует внешний API). Вы полностью контролируете, к каким файлам и сервисам у AI есть доступ." },
  { q: "Какие AI-инструменты поддерживают MCP?", a: "Cursor, Claude Desktop, Reasonix, Windsurf (Devin), GitHub Copilot, JetBrains, VS Code (через расширения). На нашем сайте есть сравнение всех AI-инструментов с поддержкой MCP." },
  { q: "Нужно ли уметь программировать?", a: "Для простых серверов (Filesystem, Memory) — нет, достаточно скопировать команду. Для продвинутых (PostgreSQL, Docker) — желательно базовое понимание технологий." },
  { q: "MCP работает в России?", a: "Большинство MCP-серверов работают локально — VPN не нужен. Исключение: серверы, которые подключаются к зарубежным API (Anthropic, OpenAI) — для них может потребоваться VPN или российский аналог (GigaCode, Yandex Cloud MCP)." },
];

export default function MCPPageClient({ servers }: any) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [russianOnly, setRussianOnly] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [activeTag, setActiveTag] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  const categories = [...new Set(servers.map((s: any) => s.category))] as string[];

  // Collect all tags
  const allTags = servers.reduce((acc: Record<string, number>, s: any) => {
    (s.tags || "").split(",").filter(Boolean).forEach((t: string) => { acc[t.trim()] = (acc[t.trim()] || 0) + 1; });
    return acc;
  }, {});
  const sortedTags = Object.entries(allTags).sort((a, b) => b[1] - a[1]);

  const filtered = servers.filter((s: any) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase()) && !(s.tags || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "all" && s.category !== category) return false;
    if (difficulty !== "all" && s.difficulty !== difficulty) return false;
    if (russianOnly && !s.russianDocs) return false;
    if (activeTag && !(s.tags || "").includes(activeTag)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.rating - a.rating;
  });

  const compareServers = servers.filter((s: any) => compareIds.has(s.id));

  function toggleCompare(id: string) {
    const next = new Set(compareIds);
    if (next.has(id)) next.delete(id);
    else if (next.size < 3) next.add(id);
    setCompareIds(next);
  }

  function copyCommand(slug: string) {
    navigator.clipboard.writeText(`npx -y ${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 1500);
  }

  // AI tools compatibility for compare
  const aiToolNames = ["Cursor", "Claude", "Reasonix", "Vibecraft", "Cursor Agent", "Windsurf"];
  const aiToolSlugs = ["cursor", "claude", "reasonix", "vibecraft", "cursor-agent", "windsurf"];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      {/* Header */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-s)" }}>🆕 Первый в России</div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>🔌 MCP-серверы</h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          MCP (Model Context Protocol) — открытый стандарт для подключения AI к внешним системам.
          Базы данных, файлы, API, браузер — всё через один протокол.
        </p>
      </div>

      {/* FAQ — мини-урок */}
      <div style={{ marginBottom: "var(--space-xl)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)", overflow: "hidden" }}>
        <div style={{ padding: "var(--space-m) var(--space-l)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={16} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontWeight: 700, color: "var(--color-accent)", fontSize: "var(--text-s)" }}>Как работать с MCP-серверами — коротко</span>
        </div>
        <div style={{ padding: "var(--space-m) var(--space-l)" }}>
          {MCP_FAQ.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < MCP_FAQ.length - 1 ? "1px solid var(--color-border-light)" : "none" }}>
              <div onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-s) 0", cursor: "pointer" }}>
                <span style={{ fontWeight: 600, fontSize: "var(--text-s)" }}>{faq.q}</span>
                <ChevronDown size={14} style={{ transform: faqOpen === i ? "rotate(180deg)" : "", transition: "0.2s", flexShrink: 0 }} />
              </div>
              {faqOpen === i && (
                <div style={{ padding: "0 0 var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* What is MCP */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        {[
          { icon: "🔌", title: "Единый протокол", desc: "USB-C для AI. Один раз настроил — работает в Cursor, Claude, Reasonix" },
          { icon: "🛠️", title: "Инструменты", desc: "AI получает доступ к БД, файлам, API, браузеру" },
          { icon: "🔒", title: "Безопасность", desc: "Серверы работают локально. Данные не покидают ваш компьютер" },
          { icon: "📦", title: "Одна команда", desc: "npx -y server-name — и сервер готов за секунды" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)" }}>
            <div style={{ fontSize: 24, marginBottom: "var(--space-xs)" }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Tag cloud */}
      <div style={{ marginBottom: "var(--space-l)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
          <Tag size={14} style={{ color: "var(--color-text-tertiary)" }} />
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)" }}>Теги:</span>
          {sortedTags.slice(0, showAllTags ? 999 : 12).map(([tag, count]) => (
            <button key={tag}
              onClick={() => { setActiveTag(activeTag === tag ? "" : tag); setSearch(""); }}
              style={{
                padding: "2px 10px", borderRadius: "var(--radius-full)", cursor: "pointer", fontSize: 11,
                border: activeTag === tag ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                background: activeTag === tag ? "var(--color-accent)" : "white",
                color: activeTag === tag ? "white" : "var(--color-text-secondary)",
                fontWeight: activeTag === tag ? 600 : 400,
                transition: "all 0.15s",
              }}>
              {tag} {count}
            </button>
          ))}
          {sortedTags.length > 12 && (
            <button onClick={() => setShowAllTags(!showAllTags)}
              style={{ padding: "2px 10px", borderRadius: "var(--radius-full)", border: "none", background: "transparent", color: "var(--color-accent)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
              {showAllTags ? "Свернуть" : `+${sortedTags.length - 12}`}
            </button>
          )}
        </div>
        {activeTag && (
          <div style={{ padding: "4px 0", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
            Фильтр по тегу «{activeTag}» — {filtered.length} серверов. <button onClick={() => setActiveTag("")} style={{ background: "none", border: "none", color: "var(--color-accent)", cursor: "pointer", fontWeight: 600 }}>Сбросить</button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginBottom: "var(--space-l)", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 250px", maxWidth: 350 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 34px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", background: "white", boxSizing: "border-box" }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white" }}>
          <option value="all">Все категории</option>
          {categories.map(c => <option key={c} value={c}>{c} ({servers.filter((s:any)=>s.category===c).length})</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          style={{ padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white" }}>
          <option value="all">Любая сложность</option>
          <option value="easy">🟢 Новичок</option>
          <option value="medium">🟡 Средне</option>
          <option value="hard">🔴 Сложно</option>
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", cursor: "pointer" }}>
          <input type="checkbox" checked={russianOnly} onChange={e => setRussianOnly(e.target.checked)} />
          🇷🇺 Русские
        </label>
        {compareIds.size > 0 && (
          <button onClick={() => setCompareIds(new Set())} style={{ padding: "6px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600, cursor: "pointer" }}>
            Сбросить ({compareIds.size})
          </button>
        )}
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginLeft: "auto" }}>{sorted.length} из {servers.length}</span>
      </div>

      {/* Compare panel */}
      {compareServers.length >= 2 && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📊 Сравнение: {compareServers.map((s:any)=>s.name).join(" vs ")}</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>Критерий</th>
                  {compareServers.map((s: any) => <th key={s.id} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700 }}>{s.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Категория", (s:any) => s.category],
                  ["Рейтинг", (s:any) => `${s.rating}/10`],
                  ["Сложность", (s:any) => s.difficulty],
                  ["API ключ", (s:any) => s.requiresApiKey ? "🔑 Нужен" : "🆓 Нет"],
                  ["Русский", (s:any) => s.russianDocs ? "🇷🇺 Да" : "❌ Нет"],
                  ["⭐ GitHub", (s:any) => s.stars],
                  ["Совместимость", (s:any) => aiToolSlugs.filter(slug => TOOL_COMPAT[slug]?.includes(s.slug)).map(slug => aiToolNames[aiToolSlugs.indexOf(slug)]).join(", ") || "—"],
                ].map(([label, fn]) => (
                  <tr key={label as string} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--color-text-secondary)" }}>{label}</td>
                    {compareServers.map((s: any) => <td key={s.id} style={{ padding: "8px 12px" }}>{(fn as any)(s)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-m)" }}>
        {sorted.map((s: any) => {
          const compatTools = aiToolSlugs.filter(slug => TOOL_COMPAT[slug]?.includes(s.slug));
          return (
            <div key={s.id} style={{
              padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-s)",
              border: compareIds.has(s.id) ? "2px solid var(--color-accent)" : "1px solid var(--color-border-light)",
              display: "flex", flexDirection: "column", position: "relative",
            }}>
              {s.isFeatured && (
                <div style={{ position: "absolute", top: -1, right: 12, padding: "2px 10px", borderRadius: "0 0 var(--radius-s) var(--radius-s)", background: "var(--color-accent)", color: "white", fontSize: 9, fontWeight: 700 }}>
                  ⭐ Выбор редакции
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)" }}>
                <Link href={`/mcp/${s.slug}`} style={{ fontWeight: 800, fontSize: "var(--text-s)", color: "var(--color-accent)", textDecoration: "none" }}>{s.name}</Link>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Star size={12} style={{ color: "var(--color-warning)", fill: "var(--color-warning)" }} />
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{s.rating}</span>
                </div>
              </div>

              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-s)", flex: 1 }}>{s.description}</p>

              {/* AI Tools compatibility */}
              {compatTools.length > 0 && (
                <div style={{ marginBottom: "var(--space-s)" }}>
                  <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginBottom: 4, fontWeight: 600 }}>Совместим с:</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {compatTools.map((slug: string, i: number) => (
                      <Link key={i} href={`/ai-tools`} title={aiToolNames[aiToolSlugs.indexOf(slug)]}
                        style={{ padding: "1px 8px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: 9, fontWeight: 600, textDecoration: "none" }}>
                        {aiToolNames[aiToolSlugs.indexOf(slug)]}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                {s.russianDocs && <span style={{ padding: "2px 6px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 9, fontWeight: 600 }}>🇷🇺</span>}
                {s.requiresApiKey && <span style={{ padding: "2px 6px", borderRadius: "var(--radius-s)", background: "#fffbeb", color: "#92400e", fontSize: 9, fontWeight: 600 }}>🔑 API</span>}
                {!s.requiresApiKey && <span style={{ padding: "2px 6px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 9, fontWeight: 600 }}>🆓</span>}
                <span style={{ padding: "2px 6px", borderRadius: "var(--radius-s)", background: "var(--color-bg-secondary)", color: "var(--color-text-tertiary)", fontSize: 9, fontWeight: 600 }}>
                  {s.difficulty === "easy" ? "🟢" : s.difficulty === "medium" ? "🟡" : "🔴"}
                </span>
                {s.stars > 0 && <span style={{ padding: "2px 6px", borderRadius: "var(--radius-s)", background: "#eff6ff", color: "#1e40af", fontSize: 9, fontWeight: 600 }}>⭐ {s.stars>=1000?`${(s.stars/1000).toFixed(1)}k`:s.stars}</span>}
              </div>

              {/* Bottom */}
              <div style={{ paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => toggleCompare(s.id)}
                    style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", border: compareIds.has(s.id) ? "1px solid var(--color-accent)" : "1px solid var(--color-border)", background: compareIds.has(s.id) ? "var(--color-accent)" : "white", color: compareIds.has(s.id) ? "white" : "var(--color-text-secondary)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                    <ArrowUpDown size={10} style={{ display: "inline", marginRight: 2 }} />
                    {compareIds.has(s.id) ? "В сравнении" : "Сравнить"}
                  </button>
                  <a href={s.githubUrl} target="_blank" rel="noopener" style={{ color: "var(--color-text-tertiary)" }}><ExternalLink size={14} /></a>
                </div>
                <button onClick={() => copyCommand(s.slug)}
                  style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: copied === s.slug ? "var(--color-accent)" : "white", color: copied === s.slug ? "white" : "var(--color-accent)", fontSize: 10, cursor: "pointer", fontWeight: 600, transition: "all 0.2s", whiteSpace: "nowrap" }}>
                  {copied === s.slug ? "✅ Скопировано!" : <><Copy size={10} style={{ display: "inline", marginRight: 2 }} /> npx -y</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
