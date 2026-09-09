"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";

type Category = {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  _count?: { items: number };
};

type Item = {
  id: string;
  categoryId: string;
  url: string;
  title: string;
  descriptionRu: string;
  faviconUrl: string;
  sortOrder: number;
  isPublished: boolean;
  category?: { id: string; title: string; emoji: string };
};

export default function AdminKopilkaClient({
  categories: initialCats,
  items: initialItems,
}: {
  categories: Category[];
  items: Item[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"items" | "categories">("items");
  const [categories, setCategories] = useState(initialCats);
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<Partial<Item> | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [filterCat, setFilterCat] = useState("all");
  const [saving, setSaving] = useState(false);
  const [enriching, setEnriching] = useState(false);

  const visibleItems =
    filterCat === "all" ? items : items.filter((i) => i.categoryId === filterCat);

  async function saveItem() {
    if (!editingItem) return;
    setSaving(true);
    const method = editingItem.id ? "PATCH" : "POST";
    const res = await fetch("/api/admin/kopilka/items", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingItem),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      alert(data.error || "Ошибка");
      return;
    }
    if (editingItem.id) {
      setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)));
    } else {
      setItems((prev) => [...prev, data]);
    }
    setEditingItem(null);
    router.refresh();
  }

  async function enrichCurrent() {
    if (!editingItem?.url) return;
    setEnriching(true);
    try {
      const res = await fetch("/api/admin/kopilka/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: editingItem.url, categoryId: editingItem.categoryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingItem((prev) => ({
        ...prev,
        title: data.title || prev?.title,
        descriptionRu: data.descriptionRu || prev?.descriptionRu,
        faviconUrl: data.faviconUrl || prev?.faviconUrl,
      }));
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setEnriching(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Удалить?")) return;
    await fetch("/api/admin/kopilka/items?id=" + id, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  async function moveItem(id: string, dir: -1 | 1) {
    const list = [...visibleItems].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= list.length) return;
    const payload = [
      { id: list[idx].id, sortOrder: list[swap].sortOrder },
      { id: list[swap].id, sortOrder: list[idx].sortOrder },
    ];
    await fetch("/api/admin/kopilka/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "item", items: payload }),
    });
    setItems((prev) =>
      prev.map((it) => {
        const hit = payload.find((p) => p.id === it.id);
        return hit ? { ...it, sortOrder: hit.sortOrder } : it;
      })
    );
  }

  async function saveCat() {
    if (!editingCat) return;
    setSaving(true);
    const method = editingCat.id ? "PATCH" : "POST";
    const res = await fetch("/api/admin/kopilka/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingCat),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      alert(data.error || "Ошибка");
      return;
    }
    if (editingCat.id) {
      setCategories((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
    } else {
      setCategories((prev) => [...prev, { ...data, _count: { items: 0 } }]);
    }
    setEditingCat(null);
    router.refresh();
  }

  async function removeCat(id: string) {
    if (!confirm("Удалить категорию и все её ссылки?")) return;
    await fetch("/api/admin/kopilka/categories?id=" + id, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.categoryId !== id));
    router.refresh();
  }

  async function moveCat(id: string, dir: -1 | 1) {
    const list = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((c) => c.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= list.length) return;
    const payload = [
      { id: list[idx].id, sortOrder: list[swap].sortOrder },
      { id: list[swap].id, sortOrder: list[idx].sortOrder },
    ];
    await fetch("/api/admin/kopilka/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", items: payload }),
    });
    setCategories((prev) =>
      prev.map((c) => {
        const hit = payload.find((p) => p.id === c.id);
        return hit ? { ...c, sortOrder: hit.sortOrder } : c;
      })
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Копилка дизайна</h1>
          <Link href="/kopilka" style={{ fontSize: 13, color: "var(--color-accent)" }}>
            Открыть публичную страницу →
          </Link>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <TabBtn active={tab === "items"} onClick={() => setTab("items")} label="Ссылки" />
          <TabBtn active={tab === "categories"} onClick={() => setTab("categories")} label="Категории" />
          {tab === "items" ? (
            <button
              onClick={() =>
                setEditingItem({
                  categoryId: categories[0]?.id || "",
                  url: "",
                  title: "",
                  descriptionRu: "",
                  faviconUrl: "",
                  isPublished: true,
                })
              }
              style={accentBtn}
            >
              <Plus size={14} /> Добавить
            </button>
          ) : (
            <button
              onClick={() => setEditingCat({ title: "", slug: "", emoji: "", description: "", isPublished: true })}
              style={accentBtn}
            >
              <Plus size={14} /> Категория
            </button>
          )}
        </div>
      </div>

      {tab === "items" && (
        <>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            style={{ marginBottom: 16, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--color-border)" }}
          >
            <option value="all">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.title}
              </option>
            ))}
          </select>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                {["", "", "Название", "Категория", "Описание", "Публ.", ""].map((h) => (
                  <th key={h || "x"} style={{ textAlign: "left", padding: "8px 10px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleItems
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                    <td style={{ padding: 6, width: 36 }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <button type="button" onClick={() => moveItem(item.id, -1)} style={iconBtn}>
                          <ChevronUp size={14} />
                        </button>
                        <button type="button" onClick={() => moveItem(item.id, 1)} style={iconBtn}>
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: 8, width: 32 }}>
                      {item.faviconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.faviconUrl} alt="" width={18} height={18} />
                      ) : (
                        "🔗"
                      )}
                    </td>
                    <td style={{ padding: 8, fontWeight: 600, cursor: "pointer" }} onClick={() => setEditingItem({ ...item })}>
                      {item.title || item.url}
                    </td>
                    <td style={{ padding: 8 }}>{item.category?.emoji} {item.category?.title}</td>
                    <td style={{ padding: 8, maxWidth: 280, color: "var(--color-text-secondary)" }}>
                      {(item.descriptionRu || "").slice(0, 100)}
                      {(item.descriptionRu || "").length > 100 ? "…" : ""}
                    </td>
                    <td style={{ padding: 8 }}>{item.isPublished ? "✅" : "⏸️"}</td>
                    <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                        <ExternalLink size={14} />
                      </a>
                      <button type="button" onClick={() => removeItem(item.id)} style={{ ...iconBtn, color: "var(--color-error)" }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "categories" && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              {["", "Название", "Slug", "Ссылок", "Публ.", ""].map((h) => (
                <th key={h || "y"} style={{ textAlign: "left", padding: "8px 10px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: 6 }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button type="button" onClick={() => moveCat(c.id, -1)} style={iconBtn}>
                        <ChevronUp size={14} />
                      </button>
                      <button type="button" onClick={() => moveCat(c.id, 1)} style={iconBtn}>
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: 8, fontWeight: 600, cursor: "pointer" }} onClick={() => setEditingCat({ ...c })}>
                    {c.emoji} {c.title}
                  </td>
                  <td style={{ padding: 8 }}>{c.slug}</td>
                  <td style={{ padding: 8 }}>{c._count?.items ?? 0}</td>
                  <td style={{ padding: 8 }}>{c.isPublished ? "✅" : "⏸️"}</td>
                  <td style={{ padding: 8 }}>
                    <button type="button" onClick={() => removeCat(c.id)} style={{ ...iconBtn, color: "var(--color-error)" }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {editingItem && (
        <Modal onClose={() => setEditingItem(null)} title={editingItem.id ? "Редактировать ссылку" : "Новая ссылка"}>
          <Field
            label="URL"
            value={editingItem.url || ""}
            onChange={(v) => setEditingItem({ ...editingItem, url: v })}
          />
          <label style={labelStyle}>Категория</label>
          <select
            value={editingItem.categoryId || ""}
            onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
            style={inputStyle}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={enrichCurrent} disabled={enriching} style={{ ...accentBtn, marginTop: 10, marginBottom: 10 }}>
            {enriching ? <Loader2 size={14} /> : <Sparkles size={14} />} AI-описание
          </button>
          <Field label="Название" value={editingItem.title || ""} onChange={(v) => setEditingItem({ ...editingItem, title: v })} />
          <label style={labelStyle}>Описание (RU)</label>
          <textarea
            value={editingItem.descriptionRu || ""}
            onChange={(e) => setEditingItem({ ...editingItem, descriptionRu: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <Field
            label="Favicon URL"
            value={editingItem.faviconUrl || ""}
            onChange={(v) => setEditingItem({ ...editingItem, faviconUrl: v })}
          />
          <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={editingItem.isPublished !== false}
              onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
            />
            Опубликовано
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="button" onClick={saveItem} disabled={saving} style={accentBtn}>
              <Save size={14} /> {saving ? "…" : "Сохранить"}
            </button>
            <button type="button" onClick={() => setEditingItem(null)} style={ghostBtn}>
              Отмена
            </button>
          </div>
        </Modal>
      )}

      {editingCat && (
        <Modal onClose={() => setEditingCat(null)} title={editingCat.id ? "Категория" : "Новая категория"}>
          <Field
            label="Название"
            value={editingCat.title || ""}
            onChange={(v) => {
              const slug = v
                .toLowerCase()
                .replace(/[^a-zа-я0-9]+/gi, "-")
                .replace(/^-|-$/g, "");
              setEditingCat({ ...editingCat, title: v, slug: editingCat.id ? editingCat.slug : slug });
            }}
          />
          <Field label="Slug" value={editingCat.slug || ""} onChange={(v) => setEditingCat({ ...editingCat, slug: v })} />
          <Field label="Emoji" value={editingCat.emoji || ""} onChange={(v) => setEditingCat({ ...editingCat, emoji: v })} />
          <Field
            label="Описание"
            value={editingCat.description || ""}
            onChange={(v) => setEditingCat({ ...editingCat, description: v })}
          />
          <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={editingCat.isPublished !== false}
              onChange={(e) => setEditingCat({ ...editingCat, isPublished: e.target.checked })}
            />
            Опубликовано
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="button" onClick={saveCat} disabled={saving} style={accentBtn}>
              <Save size={14} /> Сохранить
            </button>
            <button type="button" onClick={() => setEditingCat(null)} style={ghostBtn}>
              Отмена
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        border: active ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
        background: active ? "var(--color-accent-light, #e8faf3)" : "var(--color-bg-primary)",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.4)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-bg-primary)",
          borderRadius: 12,
          maxWidth: 560,
          width: "92%",
          maxHeight: "90vh",
          overflow: "auto",
          padding: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
          <button type="button" onClick={onClose} style={iconBtn}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-primary)",
  fontSize: 13,
  boxSizing: "border-box",
};
const accentBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 16px",
  borderRadius: 8,
  background: "var(--color-accent)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};
const ghostBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  background: "transparent",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};
const iconBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: 2 };
