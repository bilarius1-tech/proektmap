"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/editor/rich-editor"), { ssr: false });

export default function SuggestClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", tags: "", coverImage: "", categoryId: "" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!form.title || !form.content) return;
    setSaving(true);
    const res = await fetch("/api/blog/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setDone(true); }
    setSaving(false);
  }

  if (done) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: "var(--space-l)" }}>🎉</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, marginBottom: "var(--space-m)" }}>Статья отправлена!</h1>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)", lineHeight: 1.6 }}>
          Спасибо! Ваша статья отправлена на модерацию. Мы проверим её и опубликуем в ближайшее время.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/blog" style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600 }}>← В блог</Link>
          <button onClick={() => { setDone(false); setForm({ title: "", content: "", tags: "", coverImage: "", categoryId: "" }); }} style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>Написать ещё</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к блогу
      </Link>

      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-xxl)", marginBottom: "var(--space-s)" }}>✍️ Предложить статью</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)", fontSize: "var(--text-s)", lineHeight: 1.6 }}>
        Поделитесь опытом, кейсом или туториалом. Статья пройдёт модерацию перед публикацией.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Заголовок *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="О чём статья?" style={{ width: "100%", padding: "12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Категория</label>
            <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} style={{ width: "100%", padding: "12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
              <option value="">Без категории</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Теги (через запятую)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Prisma, React, Docker" style={{ width: "100%", padding: "12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Содержание *</label>
          <RichEditor content={form.content} onChange={html => setForm({ ...form, content: html })} placeholder="Пишите статью..." />
        </div>
        <button onClick={submit} disabled={saving || !form.title || !form.content} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px 32px", borderRadius: "var(--radius-m)",
          background: (form.title && form.content) ? "var(--color-accent)" : "var(--color-border)",
          color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600,
          cursor: (form.title && form.content) ? "pointer" : "default",
          alignSelf: "flex-start",
        }}>
          <Send size={16} /> {saving ? "Отправка..." : "Отправить на модерацию"}
        </button>
      </div>
    </div>
  );
}
