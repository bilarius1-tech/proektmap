"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload, User, Globe, Send, Github, Sparkles, Check } from "lucide-react";

const STATUSES = [
  { value: "junior", label: "🌱 Junior Вайбкодер" },
  { value: "middle", label: "⚡ Middle AI-инженер" },
  { value: "senior", label: "🔥 Senior AI-разработчик" },
  { value: "architect", label: "👑 AI-Архитектор" },
];

export default function EditProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name || "",
    headline: user.headline || "Вайбкодер & AI-инженер",
    bio: user.bio || "",
    skills: user.skills || "",
    status: user.status || "junior",
    telegram: user.telegram || "",
    github: user.github || "",
    website: user.website || "",
    publicProfile: user.publicProfile || false,
    avatar: user.avatar || "",
  });

  const [avatarUrl, setAvatarUrl] = useState(user.avatar || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  async function save() {
    setSaving(true);
    setSavedSuccess(false);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.refresh();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
    setSaving(false);
  }

  async function uploadAvatar(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setAvatarUrl(data.url);
        setForm((prev) => ({ ...prev, avatar: data.url }));
      }
    } catch {}
    setUploading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
        <div>
          <h3 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 2px" }}>
            Настройки профиля вайбкодера
          </h3>
          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: 0 }}>
            Эта информация отображается в каталоге специалистов и карточках ваших работ
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 18px",
            borderRadius: 6,
            background: savedSuccess ? "#0fb880" : "var(--color-accent)",
            color: "#fff",
            border: "none",
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {savedSuccess ? <Check size={14} /> : <Save size={14} />}
          {saving ? "Сохраняем..." : savedSuccess ? "Сохранено!" : "Сохранить"}
        </button>
      </div>

      {/* Avatar Section */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center", padding: "16px", background: "var(--color-bg-primary)", borderRadius: 8 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: avatarUrl ? `url(${avatarUrl}) center/cover` : "var(--color-bg-secondary)",
            border: "2px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {!avatarUrl && (form.name?.[0] || user.email[0]).toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <Upload size={13} /> {uploading ? "Загрузка..." : "Загрузить фото"}
              <input type="file" accept="image/*" onChange={uploadAvatar} style={{ display: "none" }} />
            </label>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => { setAvatarUrl(""); setForm({ ...form, avatar: "" }); }}
                style={{ background: "none", border: "none", color: "var(--color-text-tertiary)", fontSize: 11, cursor: "pointer" }}
              >
                Удалить
              </button>
            )}
          </div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
            Рекомендуется квадратная аватарка (PNG, JPG, WebP)
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
            Имя / Никнейм
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="например, Алексей Тимофеев"
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", background: "var(--color-bg-primary)" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
            Уровень квалификации
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", background: "var(--color-bg-primary)" }}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
          Позиционирование (Headline)
        </label>
        <input
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
          placeholder="например, AI-инженер & Создатель SaaS-продуктов"
          style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", background: "var(--color-bg-primary)" }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
          О себе / Био
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={2}
          placeholder="Опыт, интересы, с какими задачами и проектами к вам можно обращаться..."
          style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", resize: "vertical", background: "var(--color-bg-primary)" }}
        />
      </div>

      {/* Contacts and Links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
            <Send size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> Telegram (username)
          </label>
          <input
            value={form.telegram}
            onChange={(e) => setForm({ ...form, telegram: e.target.value.replace("@", "") })}
            placeholder="durov"
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", background: "var(--color-bg-primary)" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
            <Github size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> GitHub
          </label>
          <input
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
            placeholder="https://github.com/..."
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", background: "var(--color-bg-primary)" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
            <Globe size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> Сайт / Блог
          </label>
          <input
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://..."
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", background: "var(--color-bg-primary)" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
          Ключевые навыки и стек (через запятую)
        </label>
        <input
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          placeholder="Next.js 16, TypeScript, Cursor IDE, Claude 3.7, Prisma, Telegram Bot API"
          style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: 6, border: "1px solid var(--color-border)", outline: "none", background: "var(--color-bg-primary)" }}
        />
      </div>

      {/* Toggle Public Profile */}
      <div style={{ padding: "12px 16px", background: "rgba(15, 184, 128, 0.05)", border: "1px solid rgba(15, 184, 128, 0.2)", borderRadius: 6 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.publicProfile}
            onChange={(e) => setForm({ ...form, publicProfile: e.target.checked })}
            style={{ width: 16, height: 16, accentColor: "var(--color-accent)" }}
          />
          <span>Показывать мой профиль в каталоге специалистов и сообществе вайбкодеров</span>
        </label>
      </div>
    </div>
  );
}
