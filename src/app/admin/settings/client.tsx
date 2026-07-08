"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Key, Globe, ShoppingCart, Bot, Code } from "lucide-react";

export default function SettingsClient({ settings }: any) {
  const router = useRouter();
  const [form, setForm] = useState({
    proPrice: settings.proPrice || 300,
    yookassaShopId: settings.yookassaShopId || "",
    yookassaSecretKey: settings.yookassaSecretKey || "",
    deepseekApiKey: settings.deepseekApiKey || "",
    openrouterApiKey: settings.openrouterApiKey || "",
    openrouterModel: settings.openrouterModel || "openai/gpt-4o-mini",
    deepseekModel: settings.deepseekModel || "deepseek-chat",
    autoPublishEnabled: !!settings.autoPublishEnabled,
    autoPublishHour: settings.autoPublishHour || 9,
    yandexMetrikaId: settings.yandexMetrikaId || "",
    yandexWebmasterId: settings.yandexWebmasterId || "",
    googleAnalyticsId: settings.googleAnalyticsId || "",
    seoTitle: settings.seoTitle || "",
    seoDescription: settings.seoDescription || "",
    seoKeywords: settings.seoKeywords || "",
    headerCode: settings.headerCode || "",
    footerCode: settings.footerCode || "",
    siteName: settings.siteName || "Карта роста",
    siteUrl: settings.siteUrl || "https://proektmap.ru",
  });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("main");

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); alert("✅ Настройки сохранены"); }
    else alert("❌ Ошибка сохранения");
    setSaving(false);
  }

  const tabs = [
    { key: "main", label: "Основные", icon: <Globe size={14} /> },
    { key: "payments", label: "Платежи", icon: <ShoppingCart size={14} /> },
    { key: "ai", label: "AI-модели", icon: <Bot size={14} /> },
    { key: "seo", label: "SEO", icon: <Code size={14} /> },
  ];

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>⚙️ Настройки сайта</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>Глобальные параметры проекта</p>
        </div>
        <button onClick={save} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Save size={14} /> {saving ? "Сохранение..." : "Сохранить всё"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: "var(--space-l)", borderBottom: "2px solid var(--color-border-light)" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", background: "transparent",
            cursor: "pointer", fontSize: "var(--text-s)", fontWeight: tab === t.key ? 700 : 500,
            color: tab === t.key ? "var(--color-accent)" : "var(--color-text-secondary)",
            borderBottom: tab === t.key ? "2px solid var(--color-accent)" : "2px solid transparent", marginBottom: -2,
          }}>{t.icon}{t.label}</button>
        ))}
      </div>

      {/* Основные */}
      {tab === "main" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
          <Section title="Общие">
            <Row label="Название сайта"><input value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} className="input" /></Row>
            <Row label="URL сайта"><input value={form.siteUrl} onChange={e => setForm({ ...form, siteUrl: e.target.value })} className="input" /></Row>
            <Row label="Цена Pro (₽/мес)"><input type="number" value={form.proPrice} onChange={e => setForm({ ...form, proPrice: parseInt(e.target.value) || 300 })} className="input" /></Row>
          </Section>

          <Section title="Авто-публикация блога">
            <Row label="Включить авто-сбор">
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={form.autoPublishEnabled} onChange={e => setForm({ ...form, autoPublishEnabled: e.target.checked })} style={{ width: 18, height: 18 }} />
                Сбор новостей каждый день
              </label>
            </Row>
            <Row label="Час запуска (0-23)"><input type="number" min={0} max={23} value={form.autoPublishHour} onChange={e => setForm({ ...form, autoPublishHour: parseInt(e.target.value) || 9 })} className="input" /></Row>
          </Section>
        </div>
      )}

      {/* Платежи */}
      {tab === "payments" && (
        <Section title="ЮKassa">
          <Row label="Shop ID"><input type="password" value={form.yookassaShopId} onChange={e => setForm({ ...form, yookassaShopId: e.target.value })} className="input" placeholder="140362..." /></Row>
          <Row label="Secret Key"><input type="password" value={form.yookassaSecretKey} onChange={e => setForm({ ...form, yookassaSecretKey: e.target.value })} className="input" placeholder="live_..." /></Row>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", padding: "var(--space-s) var(--space-m)" }}>
            Webhook URL: <code>https://proektmap.ru/api/billing/webhook</code>
          </div>
        </Section>
      )}

      {/* AI */}
      {tab === "ai" && (
        <Section title="AI-модели">
          <Row label="DeepSeek API Key"><input type="password" value={form.deepseekApiKey} onChange={e => setForm({ ...form, deepseekApiKey: e.target.value })} className="input" placeholder="sk-..." /></Row>
          <Row label="DeepSeek модель">
            <select value={form.deepseekModel} onChange={e => setForm({ ...form, deepseekModel: e.target.value })} className="input">
              <option value="deepseek-chat">DeepSeek Chat (дешёвый)</option>
              <option value="deepseek-reasoner">DeepSeek Reasoner (логика)</option>
            </select>
          </Row>
          <Row label="OpenRouter API Key"><input type="password" value={form.openrouterApiKey} onChange={e => setForm({ ...form, openrouterApiKey: e.target.value })} className="input" placeholder="sk-or-v1-..." /></Row>
          <Row label="OpenRouter модель">
            <select value={form.openrouterModel} onChange={e => setForm({ ...form, openrouterModel: e.target.value })} className="input">
              <option value="openai/gpt-4o-mini">GPT-4o Mini (дешёвый)</option>
              <option value="openai/gpt-4o">GPT-4o (качество)</option>
              <option value="anthropic/claude-3-haiku">Claude Haiku (быстрый)</option>
              <option value="google/gemini-2.0-flash">Gemini Flash (скорость)</option>
            </select>
          </Row>
        </Section>
      )}

      {/* SEO */}
      {tab === "seo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
          <Section title="Мета-теги">
            <Row label="SEO Title (главная)"><input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="input" placeholder="Карта роста — AI-инженерный навигатор" /></Row>
            <Row label="SEO Description"><textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} rows={2} className="input" placeholder="Школа AI-инженеров..." /></Row>
            <Row label="SEO Keywords"><input value={form.seoKeywords} onChange={e => setForm({ ...form, seoKeywords: e.target.value })} className="input" placeholder="AI-инжиниринг, vibe coding" /></Row>
          </Section>

          <Section title="Аналитика">
            <Row label="Яндекс.Метрика ID"><input value={form.yandexMetrikaId} onChange={e => setForm({ ...form, yandexMetrikaId: e.target.value })} className="input" placeholder="109448101" /></Row>
            <Row label="Яндекс.Вебмастер ID"><input value={form.yandexWebmasterId} onChange={e => setForm({ ...form, yandexWebmasterId: e.target.value })} className="input" placeholder="..." /></Row>
            <Row label="Google Analytics ID"><input value={form.googleAnalyticsId} onChange={e => setForm({ ...form, googleAnalyticsId: e.target.value })} className="input" placeholder="G-..." /></Row>
          </Section>

          <Section title="Коды вставки">
            <Row label="Код в &lt;head&gt;"><textarea value={form.headerCode} onChange={e => setForm({ ...form, headerCode: e.target.value })} rows={3} className="input" placeholder="Метрика, верификация..." /></Row>
            <Row label="Код перед &lt;/body&gt;"><textarea value={form.footerCode} onChange={e => setForm({ ...form, footerCode: e.target.value })} rows={3} className="input" placeholder="Счётчики, чаты..." /></Row>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: any }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>{label}</label>
      <style>{`.input { width: 100%; padding: 10px 12px; font-size: var(--text-s); border-radius: var(--radius-s); border: 1px solid var(--color-border); outline: none; font-family: inherit; resize: vertical; box-sizing: border-box; }`}</style>
      {children}
    </div>
  );
}
