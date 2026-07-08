"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Play } from "lucide-react";

export default function BlogSettingsClient({ settings, stats }: any) {
  const router = useRouter();
  const [form, setForm] = useState({
    openrouterKey: process.env.OPENROUTER_API_KEY ? "••••••••" : "",
    deepseekKey: settings.deepseekApiKey || process.env.DEEPSEEK_API_KEY ? "••••••••" : "",
    openrouterModel: settings.openrouterModel || "openai/gpt-4o-mini",
    deepseekModel: settings.deepseekModel || "deepseek-chat",
    autoPublishEnabled: !!settings.autoPublishEnabled,
    autoPublishHour: settings.autoPublishHour || 9,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.refresh();
    setSaving(false);
    alert("✅ Настройки сохранены");
  }

  async function triggerAutoPublish() {
    setSaving(true);
    const res = await fetch("/api/blog/auto-publish", { method: "POST" });
    const data = await res.json();
    const count = data.results?.filter((r: any) => r.status === "draft").length || 0;
    alert(`📝 Создано ${count} черновиков`);
    router.refresh();
    setSaving(false);
  }

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>⚙️ Настройки блога</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>
            {stats.posts} постов · {stats.drafts} черновиков · {stats.feeds} источников
          </p>
        </div>
        <button onClick={save} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Save size={14} /> Сохранить
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
        {/* AI Models */}
        <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>🤖 AI-модели для автопостинга</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>OpenRouter API Key</label>
              <input type="password" value={form.openrouterKey} onChange={e => setForm({ ...form, openrouterKey: e.target.value })}
                placeholder="sk-or-v1-..." style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>openrouter.ai → API Keys</div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>DeepSeek API Key</label>
              <input type="password" value={form.deepseekKey} onChange={e => setForm({ ...form, deepseekKey: e.target.value })}
                placeholder="sk-..." style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>platform.deepseek.com → API Keys</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>OpenRouter модель</label>
              <select value={form.openrouterModel} onChange={e => setForm({ ...form, openrouterModel: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                <option value="openai/gpt-4o-mini">GPT-4o Mini (дешёвый)</option>
                <option value="openai/gpt-4o">GPT-4o (качество)</option>
                <option value="anthropic/claude-3-haiku">Claude Haiku (быстрый)</option>
                <option value="google/gemini-2.0-flash">Gemini Flash (скорость)</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>DeepSeek модель</label>
              <select value={form.deepseekModel} onChange={e => setForm({ ...form, deepseekModel: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                <option value="deepseek-chat">DeepSeek Chat (дешёвый)</option>
                <option value="deepseek-reasoner">DeepSeek Reasoner (логика)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Auto-publish settings */}
        <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>⏱️ Авто-публикация</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)", alignItems: "end" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-s)", fontWeight: 600 }}>
                <input type="checkbox" checked={form.autoPublishEnabled} onChange={e => setForm({ ...form, autoPublishEnabled: e.target.checked })}
                  style={{ width: 18, height: 18 }} />
                Включить автоматический сбор
              </label>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4, marginLeft: 26 }}>
                Каждый день в указанное время (МСК)
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Час запуска (0-23 МСК)</label>
              <input type="number" min={0} max={23} value={form.autoPublishHour} onChange={e => setForm({ ...form, autoPublishHour: parseInt(e.target.value) || 9 })}
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={triggerAutoPublish} disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
              <Play size={14} /> Запустить сбор сейчас
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>🔗 Быстрые ссылки</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href="/admin/blog" style={{ padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", fontSize: "var(--text-s)" }}>📝 Все посты</a>
            <a href="/admin/blog/feeds" style={{ padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", fontSize: "var(--text-s)" }}>📡 Источники</a>
            <a href="/admin/blog/categories" style={{ padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", fontSize: "var(--text-s)" }}>📂 Категории</a>
            <a href="/blog" target="_blank" style={{ padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", fontSize: "var(--text-s)" }}>🌐 Смотреть блог</a>
          </div>
        </div>
      </div>
    </div>
  );
}
