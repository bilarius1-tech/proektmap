"use client";
import ImagePicker from "@/components/media/image-picker";
import { useState } from "react";
import { Plus, Edit, Trash2, Sparkles, Loader2, ExternalLink, Star, Check, AlertCircle, XCircle, ShieldCheck, Clock, CheckCircle } from "lucide-react";

const CATEGORIES = ["Бот", "Сайт", "SaaS", "Игра", "Инструмент", "Веб-сервис", "AI-ассистент", "Автоматизация", "Другое"];
const LANGUAGES = ["ru", "en"];
const STATUSES = ["Запущен", "В разработке", "Бета-тест"];

export default function AiProjectsClient({ projects: initialProjects }: any) {
  const [items, setItems] = useState(initialProjects || []);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUrl, setAiUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved">("all");
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  function showToast(type: string, msg: string) {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 4000);
  }

  const empty = {
    title: "",
    slug: "",
    description: "",
    url: "",
    githubUrl: "",
    telegramUrl: "",
    techStack: "",
    aiTools: "",
    authorName: "",
    authorUrl: "",
    authorAvatar: "",
    screenshot: "",
    screenshots: "[]",
    aiRecipe: "",
    timeSpent: "",
    category: "SaaS",
    status: "Запущен",
    language: "ru",
    featured: false,
    moderationStatus: "approved",
  };

  function makeSlug(title: string): string {
    const ru: Record<string, string> = {
      а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
      з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
      п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
      ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
    };
    let slug = title.toLowerCase().trim();
    slug = slug.split("").map((c) => ru[c] || c).join("");
    try { slug = decodeURIComponent(slug); } catch {}
    slug = slug.replace(/[\s_,]+/g, "-");
    slug = slug.replace(/[^a-z0-9\-]/g, "");
    slug = slug.replace(/-+/g, "-").replace(/^-|-$/g, "");
    return slug.slice(0, 70);
  }

  const [form, setForm] = useState(empty);

  function startEdit(p: any) {
    setEditId(p.id);
    setForm({ ...p });
  }

  function startNew() {
    setEditId("new");
    setForm(empty);
  }

  async function save() {
    if (!form.title.trim()) {
      showToast("error", "Введите название");
      return;
    }
    setSaving(true);
    const method = editId === "new" ? "POST" : "PUT";
    const finalForm = { ...form, slug: form.slug || makeSlug(form.title) };
    const body = editId === "new" ? finalForm : { id: editId, ...finalForm };

    const res = await fetch("/api/admin/ai-projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      showToast("success", editId === "new" ? "Проект добавлен" : "Проект обновлён");
      const data = await res.json();
      if (editId === "new") setItems([data, ...items]);
      else setItems(items.map((i: any) => (i.id === editId ? data : i)));
      setTimeout(() => {
        setEditId(null);
        setForm(empty);
      }, 600);
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("error", err.error || "Ошибка сохранения");
    }
    setSaving(false);
  }

  async function setModeration(id: string, moderationStatus: "approved" | "rejected") {
    const res = await fetch("/api/admin/ai-projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, moderationStatus }),
    });
    if (res.ok) {
      setItems(items.map((i: any) => (i.id === id ? { ...i, moderationStatus } : i)));
      showToast("success", moderationStatus === "approved" ? "Проект одобрен и опубликован!" : "Проект отклонен");
    } else {
      showToast("error", "Не удалось изменить статус");
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить проект?")) return;
    await fetch("/api/admin/ai-projects?id=" + id, { method: "DELETE" });
    setItems(items.filter((i: any) => i.id !== id));
    showToast("success", "Проект удален");
  }

  async function aiFill() {
    if (!aiUrl.trim()) {
      showToast("error", "Вставьте ссылку");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/ai-projects/ai-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: aiUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        const aiSlug = data.slug || makeSlug(data.title || "");
        setForm({ ...empty, ...data, slug: aiSlug });
        setEditId("new");
        setAiUrl("");
        showToast("success", "AI заполнил карточку. Проверьте и сохраните.");
      } else showToast("error", data.error || "Ошибка AI");
    } catch {
      showToast("error", "Сетевая ошибка");
    } finally {
      setAiLoading(false);
    }
  }

  const pendingCount = items.filter((i: any) => i.moderationStatus === "pending").length;
  const filteredItems = items.filter((i: any) => {
    if (activeTab === "pending") return i.moderationStatus === "pending";
    if (activeTab === "approved") return i.moderationStatus === "approved";
    return true;
  });

  const lblS: any = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 };
  const inpS: any = { width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", border: "1px solid var(--color-border)", outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box" };

  return (
    <div style={{ padding: "var(--space-xl)", fontFamily: "var(--font-body)", position: "relative" }}>
      {toast && (
        <div style={{ position: "fixed", top: 72, right: 24, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, padding: "14px 24px", background: toast.type === "success" ? "#ecfdf5" : "#fef2f2", border: "1px solid " + (toast.type === "success" ? "#6ee7b7" : "#fca5a5"), color: toast.type === "success" ? "#065f46" : "#991b1b", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", fontSize: "var(--text-s)", fontWeight: 600 }}>
          {toast.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.message}
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 2, marginLeft: 8 }}>
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>🏭 AI Цех & Модерация портфолио</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>
            Всего работ: {items.length} {pendingCount > 0 && <span style={{ color: "#f59e0b", fontWeight: 700 }}>(⏳ {pendingCount} на проверке)</span>}
          </p>
        </div>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--color-accent)", color: "#fff", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={16} /> Новый проект
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-l)" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid var(--color-border)",
            background: activeTab === "all" ? "var(--color-accent)" : "#fff",
            color: activeTab === "all" ? "#fff" : "var(--color-text-primary)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Все работы ({items.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: activeTab === "pending" ? "1px solid #f59e0b" : "1px solid var(--color-border)",
            background: activeTab === "pending" ? "#f59e0b" : "#fff",
            color: activeTab === "pending" ? "#fff" : "#d97706",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ⏳ На модерации ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid var(--color-border)",
            background: activeTab === "approved" ? "var(--color-accent)" : "#fff",
            color: activeTab === "approved" ? "#fff" : "var(--color-text-primary)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ✅ Одобренные ({items.filter((i: any) => i.moderationStatus === "approved").length})
        </button>
      </div>

      {/* AI Fast Add */}
      <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
          <Sparkles size={18} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>Добавить проект по ссылке</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={aiUrl} onChange={e => setAiUrl(e.target.value)} placeholder="https://github.com/username/project или URL сервиса" style={{ flex: 1, padding: "10px 14px", fontSize: "var(--text-s)", border: "1px solid var(--color-border)", outline: "none", fontFamily: "var(--font-mono)" }} onKeyDown={e => e.key === "Enter" && aiFill()} />
          <button onClick={aiFill} disabled={aiLoading} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: aiLoading ? "var(--color-border)" : "var(--color-accent)", color: "#fff", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: aiLoading ? "default" : "pointer", whiteSpace: "nowrap" }}>
            {aiLoading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={16} />}
            {aiLoading ? "Анализирую..." : "Заполнить через AI"}
          </button>
        </div>
      </div>

      {/* Edit modal / form */}
      {editId && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-xl)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>
            {editId === "new" ? "Новый проект" : "Редактирование"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div>
              <label style={lblS}>Название</label>
              <input value={form.title} onChange={e => { const newTitle = e.target.value; const shouldUpdateSlug = editId === "new" && (!form.slug || form.slug === makeSlug(form.title)); setForm({ ...form, title: newTitle, slug: shouldUpdateSlug ? makeSlug(newTitle) : form.slug }); }} style={inpS} />
            </div>
            <div>
              <label style={lblS}>Slug</label>
              <div style={{ display: "flex", gap: 4 }}>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ ...inpS, flex: 1 }} />
                <button type="button" onClick={() => setForm({ ...form, slug: makeSlug(form.title) })} title="Сгенерировать slug" style={{ padding: "8px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", cursor: "pointer", fontSize: "var(--text-s)" }}>↻</button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-m)" }}>
            <label style={lblS}>Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inpS, resize: "vertical" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div>
              <label style={lblS}>URL проекта</label>
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} style={inpS} />
            </div>
            <div>
              <label style={lblS}>GitHub URL</label>
              <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} style={inpS} />
            </div>
            <div>
              <label style={lblS}>Telegram URL</label>
              <input value={form.telegramUrl} onChange={e => setForm({ ...form, telegramUrl: e.target.value })} style={inpS} />
            </div>
            <div>
              <label style={lblS}>Время сборки (timeSpent)</label>
              <input value={form.timeSpent} onChange={e => setForm({ ...form, timeSpent: e.target.value })} placeholder="2 дня" style={inpS} />
            </div>
            <div>
              <label style={lblS}>Технологический стек</label>
              <input value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} placeholder="Next.js, TypeScript, PostgreSQL" style={inpS} />
            </div>
            <div>
              <label style={lblS}>AI-инструменты</label>
              <input value={form.aiTools} onChange={e => setForm({ ...form, aiTools: e.target.value })} placeholder="Cursor, Claude 3.7" style={inpS} />
            </div>
            <div>
              <label style={lblS}>Автор</label>
              <input value={form.authorName} onChange={e => setForm({ ...form, authorName: e.target.value })} style={inpS} />
            </div>
            <div>
              <label style={lblS}>Категория</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inpS}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lblS}>Статус модерации</label>
              <select value={form.moderationStatus || "approved"} onChange={e => setForm({ ...form, moderationStatus: e.target.value })} style={inpS}>
                <option value="approved">✅ Одобрено (публично)</option>
                <option value="pending">⏳ На проверке (pending)</option>
                <option value="rejected">❌ Отклонено</option>
              </select>
            </div>
            <div>
              <label style={lblS}>Язык</label>
              <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} style={inpS}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l === "ru" ? "🇷🇺 Русский" : "🇬🇧 English"}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "var(--text-s)" }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />⭐ В топ витрины
              </label>
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-m)" }}>
            <label style={lblS}>AI-рецепт и процесс разработки</label>
            <textarea value={form.aiRecipe} onChange={e => setForm({ ...form, aiRecipe: e.target.value })} rows={3} style={{ ...inpS, resize: "vertical" }} />
          </div>

          <div style={{ marginBottom: "var(--space-m)" }}>
            <label style={lblS}>Скриншот</label>
            <ImagePicker value={form.screenshot} onChange={url => setForm({ ...form, screenshot: url })} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving || !form.title.trim()} style={{ padding: "12px 24px", background: form.title.trim() ? "var(--color-accent)" : "var(--color-border)", color: "#fff", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: form.title.trim() ? "pointer" : "default" }}>
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={() => { setEditId(null); setForm(empty); }} style={{ padding: "12px 24px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["Проект", "Категория", "Модерация", "Стек", "Просм. / Лайки", "Действия"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((p: any) => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {p.screenshot && <img src={p.screenshot} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />}
                    <div>
                      <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        {p.title} {p.featured && <Star size={12} style={{ color: "#fbbf24" }} />}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{p.authorName}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ padding: "2px 8px", fontSize: 10, background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", fontWeight: 600, border: "1px solid var(--color-border)" }}>
                    {p.category}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  {p.moderationStatus === "pending" ? (
                    <span style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(245, 158, 11, 0.1)", color: "#d97706", fontWeight: 700, fontSize: 10, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> На проверке
                    </span>
                  ) : p.moderationStatus === "rejected" ? (
                    <span style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontWeight: 700, fontSize: 10 }}>
                      ❌ Отклонен
                    </span>
                  ) : (
                    <span style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(15, 184, 128, 0.1)", color: "#0fb880", fontWeight: 700, fontSize: 10 }}>
                      ✅ Одобрен
                    </span>
                  )}
                </td>
                <td style={{ padding: "10px 14px", fontSize: 10, color: "var(--color-text-secondary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.techStack}
                </td>
                <td style={{ padding: "10px 14px", fontSize: 11, whiteSpace: "nowrap" }}>
                  👁️ {p.viewCount} &middot; 🔥 {p.likesCount || 0}
                </td>
                <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                  {p.moderationStatus === "pending" && (
                    <>
                      <button onClick={() => setModeration(p.id, "approved")} title="Одобрить" style={{ background: "none", border: "none", cursor: "pointer", color: "#0fb880", padding: 4 }}>
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => setModeration(p.id, "rejected")} title="Отклонить" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}>
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                  {p.slug && (
                    <a href={`/ai-workshop/${p.slug}`} target="_blank" title="Открыть страницу кейса" style={{ color: "var(--color-text-secondary)", padding: 4 }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => startEdit(p)} title="Редактировать" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}>
                    <Edit size={14} />
                  </button>
                  <button onClick={() => remove(p.id)} title="Удалить" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
