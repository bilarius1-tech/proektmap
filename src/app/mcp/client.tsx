"use client";

import { useState } from "react";
import { Search, Filter, Star, ExternalLink, ChevronRight, Globe, Database, GitBranch, MessageCircle, Cloud, Zap, BookOpen } from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  "Файлы": Database, "Базы данных": Database, "Git": GitBranch, "Поиск": Search,
  "Браузер": Globe, "Коммуникации": MessageCircle, "AI и память": Zap,
  "Разработка": BookOpen, "Облако": Cloud, "Веб и API": Globe,
  "Управление проектами": BookOpen, "Заметки": BookOpen, "Дизайн": BookOpen,
  "Бизнес": BookOpen, "DevOps": Cloud, "Наука и данные": Search,
  "AI сервисы": Zap, "Данные": Database, "Медиа": Globe,
  "Утилиты": Zap, "Каталоги": Search, "Офисные": BookOpen, "Гео и карты": Globe,
};

export default function MCPPageClient({ servers }: any) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [russianOnly, setRussianOnly] = useState(false);

  const categories = [...new Set(servers.map((s: any) => s.category))] as string[];

  const filtered = servers.filter((s: any) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase()) && !s.tags.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "all" && s.category !== category) return false;
    if (difficulty !== "all" && s.difficulty !== difficulty) return false;
    if (russianOnly && !s.russianDocs) return false;
    return true;
  });

  // Sort: featured first, then by rating
  const sorted = [...filtered].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.rating - a.rating;
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-s)" }}>🆕 Первый в России</div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>🔌 MCP-серверы</h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          MCP (Model Context Protocol) — открытый стандарт для подключения AI к внешним системам.
          Базы данных, файлы, API, браузер, GitHub, Slack — всё через один протокол.
          Выберите сервер, установите одной командой, и AI получит новый супер-инструмент.
        </p>
      </div>

      {/* What is MCP */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        {[
          { icon: "🔌", title: "Единый протокол", desc: "USB-C для AI. Один раз настроил — работает в Cursor, Claude, Reasonix" },
          { icon: "🛠️", title: "Инструменты", desc: "AI получает доступ к БД, файлам, API, браузеру — тысячи новых возможностей" },
          { icon: "🔒", title: "Безопасность", desc: "Серверы работают локально. Данные не покидают ваш компьютер" },
          { icon: "📦", title: "Одна команда", desc: "npx -y server-name — и сервер готов к работе за секунды" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)" }}>
            <div style={{ fontSize: 24, marginBottom: "var(--space-xs)" }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginBottom: "var(--space-l)", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 250px", maxWidth: 350 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input placeholder="Поиск по названию, описанию, тегам..." value={search} onChange={e => setSearch(e.target.value)}
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
          🇷🇺 Только с русской документацией
        </label>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginLeft: "auto" }}>
          {sorted.length} из {servers.length}
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-m)" }}>
        {sorted.map((s: any) => (
          <div key={s.id} style={{
            padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-s)",
            border: s.isFeatured ? "2px solid var(--color-accent)" : "1px solid var(--color-border-light)",
            display: "flex", flexDirection: "column",
            position: "relative",
          }}>
            {s.isFeatured && (
              <div style={{ position: "absolute", top: -1, right: 12, padding: "2px 10px", borderRadius: "0 0 var(--radius-s) var(--radius-s)", background: "var(--color-accent)", color: "white", fontSize: 9, fontWeight: 700 }}>
                ⭐ Выбор редакции
              </div>
            )}

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "var(--text-s)" }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{s.category}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Star size={12} style={{ color: "var(--color-warning)", fill: "var(--color-warning)" }} />
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{s.rating}</span>
              </div>
            </div>

            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-s)", flex: 1 }}>
              {s.description}
            </p>

            {/* Badges */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
              {s.russianDocs && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 9, fontWeight: 600 }}>🇷🇺 Русский</span>}
              {s.requiresApiKey && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#fffbeb", color: "#92400e", fontSize: 9, fontWeight: 600 }}>🔑 API ключ</span>}
              {!s.requiresApiKey && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 9, fontWeight: 600 }}>🆓 Бесплатно</span>}
              <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "var(--color-bg-secondary)", color: "var(--color-text-tertiary)", fontSize: 9, fontWeight: 600 }}>
                {s.difficulty === "easy" ? "🟢 Новичок" : s.difficulty === "medium" ? "🟡 Средне" : "🔴 Сложно"}
              </span>
              {s.stars > 0 && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#eff6ff", color: "#1e40af", fontSize: 9, fontWeight: 600 }}>⭐ {s.stars >= 1000 ? `${(s.stars/1000).toFixed(1)}k` : s.stars}</span>}
            </div>

            {/* Bottom */}
            <div style={{ paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <a href={s.githubUrl} target="_blank" rel="noopener"
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none" }}>
                <ExternalLink size={12} /> GitHub
              </a>
              <span style={{ fontSize: 10, color: "var(--color-accent)", fontWeight: 600 }}>
                npx -y {s.name.toLowerCase().replace(/ /g, "-")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
