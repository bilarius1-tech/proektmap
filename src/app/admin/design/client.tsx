"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Palette, Type, Box } from "lucide-react";

const PRESETS = [
  { key: "swiss", label: "Швейцарский", desc: "Сетка, 0px, без теней", accent: "#0fb880", radius: 0, heading: "Montserrat", body: "Inter" },
  { key: "modern", label: "Современный", desc: "8px, мягкие тени", accent: "#6c63ff", radius: 8, heading: "Inter", body: "Inter" },
  { key: "brutal", label: "Брутализм", desc: "0px, жирные рамки", accent: "#1a1a1a", radius: 0, heading: "Inter", body: "Inter" },
  { key: "warm", label: "Тёплый", desc: "12px, сериф, песок", accent: "#e5533c", radius: 12, heading: "Georgia", body: "Inter" },
];

const FONTS = ["Montserrat", "Inter", "Georgia", "IBM Plex Sans", "Manrope"];
const COLORS = ["#0fb880", "#6c63ff", "#e5533c", "#1a1a1a", "#f59e0b", "#2b6cb0", "#d53f8c", "#2f855a", "#ed8936"];

export default function DesignClient({ settings }: any) {
  const router = useRouter();
  const [form, setForm] = useState({
    accentColor: settings.accentColor || "#0fb880",
    headingFont: settings.headingFont || "Montserrat",
    bodyFont: settings.bodyFont || "Inter",
    borderRadius: settings.borderRadius ?? 0,
    designStyle: settings.designStyle || "swiss",
  });
  const [saving, setSaving] = useState(false);
  const [hoverPreset, setHoverPreset] = useState<string | null>(null);

  function applyPreset(p: any) { setForm({ accentColor: p.accent, headingFont: p.heading, bodyFont: p.body, borderRadius: p.radius, designStyle: p.key }); }
  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); alert("✅ Стиль сохранён"); }
    setSaving(false);
  }

  // Live preview style
  const previewAccent = hoverPreset ? PRESETS.find(p => p.key === hoverPreset)?.accent || form.accentColor : form.accentColor;
  const previewRadius = hoverPreset ? PRESETS.find(p => p.key === hoverPreset)?.radius ?? form.borderRadius : form.borderRadius;
  const previewHeading = hoverPreset ? PRESETS.find(p => p.key === hoverPreset)?.heading || form.headingFont : form.headingFont;
  const previewBody = hoverPreset ? PRESETS.find(p => p.key === hoverPreset)?.body || form.bodyFont : form.bodyFont;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
      {/* LEFT — controls */}
      <div style={{ width: 360, minWidth: 360, padding: "var(--space-xl) var(--space-l)", borderRight: "1px solid var(--color-border-light)", overflowY: "auto", maxHeight: "calc(100vh - 56px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
          <div>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800 }}>🎨 Дизайн</h1>
            <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>Как в Тильде — изменения сразу</p>
          </div>
          <button onClick={save} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: 4, padding: "8px 16px", borderRadius: "var(--radius-s)",
            background: previewAccent, color: "white", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
          }}><Save size={14} /> Сохранить</button>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>🎭 Пресеты</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PRESETS.map(p => (
              <div key={p.key}
                onClick={() => applyPreset(p)}
                onMouseEnter={() => setHoverPreset(p.key)}
                onMouseLeave={() => setHoverPreset(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: "var(--radius-s)",
                  cursor: "pointer", border: form.designStyle === p.key ? "2px solid " + previewAccent : "2px solid transparent",
                  background: form.designStyle === p.key ? previewAccent + "10" : "var(--color-bg-secondary)",
                }}>
                <div style={{ width: 40, height: 30, borderRadius: p.radius, background: p.accent, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 8, fontWeight: 700 }}>
                  {p.radius === 0 ? "0px" : p.radius + "px"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>🎨 Цвет</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => setForm({ ...form, accentColor: c })} style={{
                width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer",
                border: form.accentColor === c ? "3px solid #1a1a1a" : "3px solid transparent",
                transform: form.accentColor === c ? "scale(1.15)" : "scale(1)",
                transition: "0.15s",
              }} title={c} />
            ))}
            <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
              style={{ width: 32, height: 32, border: "none", cursor: "pointer", borderRadius: "50%", padding: 0 }} />
          </div>
        </div>

        {/* Fonts */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>🔤 Шрифты</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4, display: "block" }}>Заголовки</label>
              <select value={form.headingFont} onChange={e => setForm({ ...form, headingFont: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4, display: "block" }}>Текст</label>
              <select value={form.bodyFont} onChange={e => setForm({ ...form, bodyFont: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Radius */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>📐 Скругление</div>
          <input type="range" min={0} max={24} value={form.borderRadius} onChange={e => setForm({ ...form, borderRadius: parseInt(e.target.value) })}
            style={{ width: "100%", accentColor: previewAccent }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--color-text-tertiary)" }}>
            <span>0px (Swiss)</span><span>{form.borderRadius}px</span><span>24px (пузырьки)</span>
          </div>
        </div>
      </div>

      {/* RIGHT — live preview */}
      <div style={{ flex: 1, padding: "var(--space-xl)", background: "#f5f5f3", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{
          width: "100%", maxWidth: 700,
          fontFamily: previewBody + ", Inter, sans-serif",
          background: "var(--color-bg-primary)", borderRadius: 4,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden",
        }}>
          {/* Preview header */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #e5e5e0", background: "#fafaf9" }}>
            <div style={{ fontFamily: previewHeading + ", sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>PROEKTMAP</div>
            <div style={{ display: "flex", gap: 16, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8c8c80" }}>
              <span>Пути</span><span>Блог</span><span>Глоссарий</span>
            </div>
          </div>

          <div style={{ padding: "32px 28px" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c80", marginBottom: 8 }}>Школа AI-инженеров</div>
            <h1 style={{ fontFamily: previewHeading + ", sans-serif", fontSize: 36, fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
              Карта роста<span style={{ color: previewAccent }}>.</span>
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#5c5c50", marginBottom: 20, maxWidth: 400 }}>
              Инженерный навигатор. Без курсов, без лекций — только практика и готовые промпты.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              <div style={{ padding: "9px 20px", background: previewAccent, color: "white", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", borderRadius: previewRadius }}>НАЧАТЬ ПУТЬ</div>
              <div style={{ padding: "9px 20px", border: "1px solid #d4d4cc", color: "#1a1a1a", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", borderRadius: previewRadius }}>PRO — 300₽/МЕС</div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#d4d4cc", marginBottom: 28 }}>
              {["203 Решения", "2,795 XP", "94 Термина", "3 Пути"].map(s => (
                <div key={s} style={{ background: "var(--color-bg-primary)", padding: "14px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: previewHeading, fontWeight: 800, fontSize: 18 }}>{s.split(" ")[0]}</div>
                  <div style={{ fontSize: 9, color: "#8c8c80", marginTop: 2 }}>{s.split(" ")[1]}</div>
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#d4d4cc" }}>
              {["Корпоративный сайт", "SaaS-продукт", "Разработка игры"].map(title => (
                <div key={title} style={{ background: "var(--color-bg-primary)", padding: "16px 14px" }}>
                  <div style={{ fontFamily: previewHeading + ", sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 10, color: "#8c8c80" }}>
                    {title === "Корпоративный сайт" ? "1140 XP · 81 реш." : title === "SaaS-продукт" ? "875 XP · 62 реш." : "780 XP · 60 реш."}
                  </div>
                </div>
              ))}
            </div>

            {/* Cards style demo */}
            <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
              <div style={{
                padding: "12px 16px", background: previewAccent + "10", borderRadius: previewRadius,
                border: "1px solid " + previewAccent, fontSize: 11, color: previewAccent, fontWeight: 600,
              }}>Карточка с рамкой</div>
              <div style={{
                padding: "12px 16px", background: previewAccent, borderRadius: previewRadius,
                color: "white", fontSize: 11, fontWeight: 600,
              }}>Кнопка {previewRadius}px</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
