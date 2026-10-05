"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";

const RichEditor = dynamic(() => import("@/components/editor/rich-editor"), { ssr: false });

type Category = {
  id: string;
  title: string;
  slug: string;
  kind: string;
  sortOrder: number;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceRub: number;
  kind: string;
  categoryId: string;
  litresUrl: string;
  fileName: string;
  originalName: string;
  coverUrl: string;
  cardTitle: string;
  ageRating: string;
  pageCount: number;
  isPublished: boolean;
  sortOrder: number;
  fileReady: boolean;
  viewCount: number;
  category?: { title: string };
};

type OrderItem = { title: string; priceRub: number };
type Order = {
  id: string;
  publicToken: string;
  email: string;
  status: string;
  amount: number;
  createdAt: string;
  items: OrderItem[];
};

const emptyProduct = (kind: string, categories: Category[]): Partial<Product> => ({
  title: "",
  slug: "",
  description: "",
  priceRub: 100,
  kind,
  categoryId: categories.find((c) => c.kind === kind)?.id || "",
  litresUrl: "",
  fileName: "",
  originalName: "",
  coverUrl: "",
  cardTitle: "",
  ageRating: "",
  pageCount: 0,
  isPublished: false,
  sortOrder: 0,
});

async function send(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ошибка сохранения");
  return data;
}

export default function AdminShopClient({
  products,
  categories,
  orders,
  orderEmail = "",
  orderPage = 1,
  orderPages = 1,
  initialTab = "book",
}: {
  products: Product[];
  categories: Category[];
  orders: Order[];
  orderEmail?: string;
  orderPage?: number;
  orderPages?: number;
  initialTab?: "book" | "file" | "categories" | "orders";
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"book" | "file" | "categories" | "orders">(initialTab);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<Partial<Category> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [productPage, setProductPage] = useState(1);

  const visible = products.filter((product) => product.kind === tab);
  const productPages = Math.max(1, Math.ceil(visible.length / 20));
  const paged = visible.slice((productPage - 1) * 20, productPage * 20);

  async function saveProduct() {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      await send("/api/admin/shop/products", editing.id ? "PATCH" : "POST", editing);
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(file: File) {
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/shop/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Не удалось загрузить файл");
      return;
    }
    setEditing((prev) => prev ? { ...prev, fileName: data.fileName, originalName: data.originalName } : prev);
  }

  async function uploadCover(file: File) {
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/shop/cover", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Не удалось загрузить обложку");
      return;
    }
    setEditing((prev) => prev ? { ...prev, coverUrl: data.coverUrl } : prev);
  }

  async function removeProduct(id: string) {
    if (!confirm("Удалить товар? Уже оплаченные заказы сохранят файл.")) return;
    await send("/api/admin/shop/products?id=" + id, "DELETE");
    router.refresh();
  }

  async function saveCategory() {
    if (!categoryDraft) return;
    setSaving(true);
    setError("");
    try {
      await send("/api/admin/shop/categories", categoryDraft.id ? "PATCH" : "POST", categoryDraft);
      setCategoryDraft(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function removeCategory(id: string) {
    if (!confirm("Удалить категорию?")) return;
    try {
      await send("/api/admin/shop/categories?id=" + id, "DELETE");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    }
  }

  const fieldStyle = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid var(--color-border)",
    background: "var(--color-bg-primary)",
    color: "var(--color-text-primary)",
    fontSize: 14,
    boxSizing: "border-box" as const,
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>Магазин</h1>
      <p style={{ margin: "0 0 20px", color: "var(--color-text-secondary)", fontSize: 14 }}>
        Книги и файлы. Оплата через ЮKassa, скачивание только после оплаты.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {(
          [
            ["book", "Книги"],
            ["file", "Файлы"],
            ["categories", "Категории"],
            ["orders", "Заказы"],
          ] as const
        ).map(([id, label]) => (
            <button
            key={id}
            onClick={() => { setTab(id); setError(""); setProductPage(1); }}
            style={{
              padding: "8px 14px",
              border: "1px solid var(--color-border)",
              background: tab === id ? "var(--color-accent)" : "var(--color-bg-primary)",
              color: tab === id ? "#fff" : "var(--color-text-primary)",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: "var(--color-error)", marginTop: 0 }}>{error}</p>
      )}

      {(tab === "book" || tab === "file") && (
        <>
          <button
            onClick={() => setEditing(emptyProduct(tab, categories))}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, padding: "10px 16px", background: "var(--color-accent)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}
          >
            <Plus size={14} /> Добавить
          </button>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                {["Название", "Цена", "Просмотры", "Файл", "Статус", ""].map((head) => (
                  <th key={head} style={{ padding: "8px 6px" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "8px 6px" }}>{product.title}</td>
                  <td style={{ padding: "8px 6px" }}>{product.priceRub} ₽</td>
                  <td style={{ padding: "8px 6px" }}>{product.viewCount || 0}</td>
                  <td style={{ padding: "8px 6px" }}>{product.fileReady ? "на месте" : "нет файла"}</td>
                  <td style={{ padding: "8px 6px" }}>{product.isPublished ? "опубликован" : "черновик"}</td>
                  <td style={{ padding: "8px 6px", whiteSpace: "nowrap" }}>
                    <button onClick={() => setEditing(product)} style={{ marginRight: 8, cursor: "pointer" }}>Править</button>
                    <button onClick={() => removeProduct(product.id)} style={{ cursor: "pointer" }}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productPages > 1 && (
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button type="button" disabled={productPage <= 1} onClick={() => setProductPage((value) => value - 1)}>Назад</button>
              <span>Страница {productPage} из {productPages}</span>
              <button type="button" disabled={productPage >= productPages} onClick={() => setProductPage((value) => value + 1)}>Дальше</button>
            </div>
          )}
        </>
      )}

      {editing && (tab === "book" || tab === "file") && (
        <form
          onSubmit={(event) => { event.preventDefault(); saveProduct(); }}
          style={{ marginTop: 20, display: "grid", gap: 10, maxWidth: 960, padding: 16, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}
        >
          <label>Название<input style={fieldStyle} value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
          <label>Название на карточке<input style={fieldStyle} value={editing.cardTitle || ""} onChange={(e) => setEditing({ ...editing, cardTitle: e.target.value })} placeholder="Коротко, до 80 знаков" /></label>
          <label>Возраст<input style={fieldStyle} value={editing.ageRating || ""} onChange={(e) => setEditing({ ...editing, ageRating: e.target.value })} placeholder="0+ или 12+" /></label>
          <label>Страниц<input style={fieldStyle} type="number" value={editing.pageCount ?? 0} onChange={(e) => setEditing({ ...editing, pageCount: Number(e.target.value) })} /></label>
          <label>Slug<input style={fieldStyle} value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Описание</div>
            <RichEditor
              key={editing.id || "new"}
              content={editing.description || ""}
              onChange={(html) => setEditing((prev) => (prev ? { ...prev, description: html } : prev))}
              placeholder="Текст книги, фото страниц, видео VK или Rutube"
            />
          </div>
          <label>Цена, ₽<input style={fieldStyle} type="number" value={editing.priceRub ?? 0} onChange={(e) => setEditing({ ...editing, priceRub: Number(e.target.value) })} /></label>
          <label>Категория
            <select style={fieldStyle} value={editing.categoryId || ""} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}>
              <option value="">Выберите</option>
              {categories.filter((c) => c.kind === editing.kind).map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>
          {editing.kind === "book" && (
            <label>Ссылка Литрес<input style={fieldStyle} value={editing.litresUrl || ""} onChange={(e) => setEditing({ ...editing, litresUrl: e.target.value })} /></label>
          )}
          <label>Порядок<input style={fieldStyle} type="number" value={editing.sortOrder ?? 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} /></label>
          <label>Обложка jpg, png или webp
            <input style={fieldStyle} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadCover(file); }} />
          </label>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)" }}>Файл уходит на сервер. Путь к фото вручную не вводится.</p>
          {editing.coverUrl ? (
            <img src={editing.coverUrl} alt="" style={{ width: 120, aspectRatio: "4 / 5", objectFit: "cover", border: "1px solid var(--color-border)" }} />
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>Обложка ещё не загружена</p>
          )}
          <label>Файл pdf, zip или epub
            <input style={fieldStyle} type="file" accept=".pdf,.zip,.epub" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFile(file); }} />
          </label>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
            {editing.fileName ? `Файл: ${editing.originalName || editing.fileName}` : "Файл ещё не загружен"}
          </p>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={Boolean(editing.isPublished)} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
            Опубликован
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={saving} type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "var(--color-accent)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}>
              <Save size={14} /> {saving ? "Сохраняю" : "Сохранить"}
            </button>
            <button type="button" onClick={() => setEditing(null)} style={{ padding: "10px 16px", cursor: "pointer" }}>Отмена</button>
          </div>
        </form>
      )}

      {tab === "categories" && (
        <>
          <button
            onClick={() => setCategoryDraft({ title: "", slug: "", kind: "file", sortOrder: categories.length + 1 })}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, padding: "10px 16px", background: "var(--color-accent)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}
          >
            <Plus size={14} /> Категория
          </button>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "8px 6px" }}>{category.title}</td>
                  <td style={{ padding: "8px 6px" }}>{category.kind === "book" ? "книги" : "файлы"}</td>
                  <td style={{ padding: "8px 6px" }}>
                    <button onClick={() => setCategoryDraft(category)} style={{ marginRight: 8, cursor: "pointer" }}>Править</button>
                    <button onClick={() => removeCategory(category.id)} style={{ cursor: "pointer" }}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categoryDraft && (
            <form
              onSubmit={(event) => { event.preventDefault(); saveCategory(); }}
              style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 480 }}
            >
              <input style={fieldStyle} placeholder="Название" value={categoryDraft.title || ""} onChange={(e) => setCategoryDraft({ ...categoryDraft, title: e.target.value })} />
              <input style={fieldStyle} placeholder="slug" value={categoryDraft.slug || ""} onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value })} />
              <select style={fieldStyle} value={categoryDraft.kind || "file"} onChange={(e) => setCategoryDraft({ ...categoryDraft, kind: e.target.value })}>
                <option value="file">Файлы</option>
                <option value="book">Книги</option>
              </select>
              <button disabled={saving} type="submit" style={{ padding: "10px 16px", background: "var(--color-accent)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}>Сохранить категорию</button>
            </form>
          )}
        </>
      )}

      {tab === "orders" && (
        <>
          <form action="/admin/shop" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <input type="hidden" name="tab" value="orders" />
            <input
              name="email"
              defaultValue={orderEmail}
              placeholder="Поиск по email"
              style={{ padding: "8px 10px", border: "1px solid var(--color-border)", minWidth: 220 }}
            />
            <button type="submit" style={{ padding: "8px 14px", background: "var(--color-accent)", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>Найти</button>
          </form>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                {["Дата", "Email", "Товар", "Сумма", "Статус", ""].map((head) => (
                  <th key={head} style={{ padding: "8px 6px" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "8px 6px" }}>{new Date(order.createdAt).toLocaleString("ru-RU")}</td>
                  <td style={{ padding: "8px 6px" }}>{order.email}</td>
                  <td style={{ padding: "8px 6px" }}>{order.items.map((item) => item.title).join(", ")}</td>
                  <td style={{ padding: "8px 6px" }}>{order.amount} ₽</td>
                  <td style={{ padding: "8px 6px" }}>{order.status}</td>
                  <td style={{ padding: "8px 6px" }}>
                    <a href={`/zakaz/${order.publicToken}`}>страница заказа</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orderPages > 1 && (
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              {orderPage > 1 && (
                <a href={`/admin/shop?tab=orders&page=${orderPage - 1}${orderEmail ? `&email=${encodeURIComponent(orderEmail)}` : ""}`}>Назад</a>
              )}
              <span>Страница {orderPage} из {orderPages}</span>
              {orderPage < orderPages && (
                <a href={`/admin/shop?tab=orders&page=${orderPage + 1}${orderEmail ? `&email=${encodeURIComponent(orderEmail)}` : ""}`}>Дальше</a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
