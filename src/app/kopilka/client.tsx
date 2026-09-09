"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowUpRight, Loader2, Plus, Sparkles, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type Category = {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  description?: string;
};

type Item = {
  id: string;
  url: string;
  title: string;
  descriptionRu: string;
  faviconUrl: string;
  categoryId: string;
  sortOrder: number;
  isPublished: boolean;
  category?: Category;
};

export default function KopilkaClient({
  categories,
  items: initialItems,
  isAdmin,
}: {
  categories: Category[];
  items: Item[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const admin = isAdmin || (session?.user as { role?: string } | undefined)?.role === "admin";

  const [activeCat, setActiveCat] = useState<string>("all");
  const [items, setItems] = useState(initialItems);
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    title: string;
    descriptionRu: string;
    faviconUrl: string;
    sourceMeta?: string;
  } | null>(null);

  const filtered = useMemo(() => {
    if (activeCat === "all") return items.filter((i) => i.isPublished || admin);
    return items.filter((i) => i.categoryId === activeCat && (i.isPublished || admin));
  }, [items, activeCat, admin]);

  async function enrichAndPreview() {
    setError("");
    setPreview(null);
    if (!url.trim()) {
      setError("Вставьте ссылку");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/kopilka/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, categoryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setPreview({
        title: data.title,
        descriptionRu: data.descriptionRu,
        faviconUrl: data.faviconUrl,
        sourceMeta: data.sourceMeta,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function saveItem() {
    if (!preview || !categoryId) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/kopilka/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          categoryId,
          title: preview.title,
          descriptionRu: preview.descriptionRu,
          faviconUrl: preview.faviconUrl,
          sourceMeta: preview.sourceMeta || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не сохранилось");
      setItems((prev) => [...prev, data]);
      setUrl("");
      setPreview(null);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Удалить ссылку из копилки?")) return;
    await fetch("/api/admin/kopilka/items?id=" + id, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  async function moveItem(id: string, dir: -1 | 1) {
    const list = [...filtered].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= list.length) return;
    const a = list[idx];
    const b = list[swap];
    const payload = [
      { id: a.id, sortOrder: b.sortOrder },
      { id: b.id, sortOrder: a.sortOrder },
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

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 64px" }}>
      {/* Categories */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        <Chip active={activeCat === "all"} onClick={() => setActiveCat("all")} label={`Все · ${items.length}`} />
        {categories.map((c) => (
          <Chip
            key={c.id}
            active={activeCat === c.id}
            onClick={() => setActiveCat(c.id)}
            label={`${c.emoji ? c.emoji + " " : ""}${c.title}`}
          />
        ))}
      </div>

      {/* Admin quick add */}
      {admin && (
        <div
          style={{
            marginBottom: 28,
            padding: 20,
            borderRadius: 16,
            border: "1px solid rgba(15,184,128,0.25)",
            background: "linear-gradient(135deg, rgba(15,184,128,0.08), rgba(99,102,241,0.06))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontWeight: 700, fontSize: 14 }}>
            <Plus size={16} color="#0FB880" /> Быстро добавить в копилку
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={fieldStyle}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.title}
                </option>
              ))}
            </select>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://codepen.io/… или любая ссылка"
              style={{ ...fieldStyle, flex: "1 1 240px" }}
            />
            <button onClick={enrichAndPreview} disabled={busy} style={btnPrimary}>
              {busy ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
              AI-описание
            </button>
          </div>
          {error && <p style={{ color: "#E88B8B", fontSize: 13, marginTop: 10 }}>{error}</p>}
          {preview && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {preview.faviconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.faviconUrl} alt="" width={28} height={28} style={{ borderRadius: 6 }} />
                ) : null}
                <div style={{ flex: 1 }}>
                  <input
                    value={preview.title}
                    onChange={(e) => setPreview({ ...preview, title: e.target.value })}
                    style={{ ...fieldStyle, width: "100%", marginBottom: 8, fontWeight: 600 }}
                  />
                  <textarea
                    value={preview.descriptionRu}
                    onChange={(e) => setPreview({ ...preview, descriptionRu: e.target.value })}
                    rows={2}
                    style={{ ...fieldStyle, width: "100%", resize: "vertical" }}
                  />
                </div>
              </div>
              <button onClick={saveItem} disabled={busy} style={btnPrimary}>
                Сохранить в таблицу
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div
        style={{
          borderRadius: 16,
          border: "1px solid var(--color-border, #e5e7eb)",
          overflow: "hidden",
          background: "var(--color-bg-primary, #fff)",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-tertiary, #9ca3af)", fontSize: 14 }}>
            Пока пусто. {admin ? "Добавьте первую ссылку выше." : "Загляните позже — копилка наполняется."}
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {filtered
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((item, i) => (
                <li
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: admin ? "auto 36px 1fr auto auto" : "36px 1fr auto",
                    gap: 14,
                    alignItems: "center",
                    padding: "14px 16px",
                    borderTop: i === 0 ? "none" : "1px solid var(--color-border-light, #f3f4f6)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(15,184,128,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {admin && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button type="button" onClick={() => moveItem(item.id, -1)} style={iconBtn} aria-label="Выше">
                        <ChevronUp size={14} />
                      </button>
                      <button type="button" onClick={() => moveItem(item.id, 1)} style={iconBtn} aria-label="Ниже">
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  )}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "var(--color-bg-secondary, #f9fafb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {item.faviconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.faviconUrl} alt="" width={20} height={20} />
                    ) : (
                      <span style={{ fontSize: 14 }}>🔗</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>
                      {item.title || item.url}
                      {!item.isPublished && admin && (
                        <span style={{ marginLeft: 8, fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>черновик</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary, #6b7280)", lineHeight: 1.5 }}>
                      {item.descriptionRu || "Без описания"}
                    </p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 16px",
                      borderRadius: 12,
                      background: "#0FB880",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 14px rgba(15,184,128,0.35)",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                  >
                    Открыть <ArrowUpRight size={15} />
                  </a>
                  {admin && (
                    <button type="button" onClick={() => removeItem(item.id)} style={{ ...iconBtn, color: "#E88B8B" }} aria-label="Удалить">
                      <Trash2 size={15} />
                    </button>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @media (max-width: 640px) {
          li[style] { grid-template-columns: 32px 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: active ? "1px solid #0FB880" : "1px solid var(--color-border, #e5e7eb)",
        background: active ? "rgba(15,184,128,0.12)" : "var(--color-bg-primary, #fff)",
        color: active ? "#0a7a55" : "var(--color-text-secondary, #4b5563)",
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

const fieldStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--color-border, #e5e7eb)",
  background: "var(--color-bg-primary, #fff)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 16px",
  borderRadius: 12,
  border: "none",
  background: "#0FB880",
  color: "#fff",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const iconBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 4,
  color: "var(--color-text-tertiary, #9ca3af)",
  display: "inline-flex",
};
