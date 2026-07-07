"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Decision {
  id?: string; stageId: string; title: string; slug: string;
  problem: string; why: string; recommended: string; content: string;
  tradeoffs: string; whenNotUse: string; mistakes: string;
  difficulty: string; xpReward: number; timeEstimate: string;
  promptTitle: string; promptTemplate: string; sortOrder: number;
}

interface Stage { id: string; title: string; }

export default function DecisionForm({ stages, initial }: { stages: Stage[]; initial?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<Decision>({
    stageId: initial?.stageId || "", title: initial?.title || "", slug: initial?.slug || "",
    problem: initial?.problem || "", why: initial?.why || "", recommended: initial?.recommended || "",
    content: initial?.content || "", tradeoffs: initial?.tradeoffs || "",
    whenNotUse: initial?.whenNotUse || "", mistakes: initial?.mistakes || "",
    difficulty: initial?.difficulty || "easy", xpReward: initial?.xpReward || 15,
    timeEstimate: initial?.timeEstimate || "15 мин",
    promptTitle: initial?.promptTitle || "", promptTemplate: initial?.promptTemplate || "",
    sortOrder: initial?.sortOrder || 0, id: initial?.id,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.stageId) { setMsg("Название и этап обязательны"); return; }
    if (!form.slug) form.slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-я0-9-]/g, "");
    setSaving(true);
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/decisions", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (d.error) setMsg(d.error);
    else { router.push("/admin/decisions"); router.refresh(); }
    setSaving(false);
  }

  return (
    <div>
      <Link href="/admin/decisions" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-m)", textDecoration: "none" }}>
        <ArrowLeft size={14} /> Назад к списку
      </Link>
      <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-l)" }}>{form.id ? "Редактировать решение" : "Новое решение"}</h1>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", maxWidth: 720 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-s)" }}>
          <div><label style={lbl}>Этап *</label><select className="input" value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })} required><option value="">Выберите этап</option>{stages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></div>
          <div><label style={lbl}>Сложность</label><select className="input" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}><option value="easy">Лёгкий</option><option value="medium">Средний</option><option value="hard">Сложный</option></select></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-s)" }}>
          <div><label style={lbl}>Название *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label style={lbl}>Slug</label><input className="input" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
        </div>
        <div><label style={lbl}>Проблема (что решаем)</label><textarea className="input" rows={2} value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} /></div>
        <div><label style={lbl}>Почему это важно</label><textarea className="input" rows={2} value={form.why} onChange={e => setForm({ ...form, why: e.target.value })} /></div>
        <div><label style={lbl}>Рекомендуемое решение</label><textarea className="input" rows={2} value={form.recommended} onChange={e => setForm({ ...form, recommended: e.target.value })} /></div>
        <div><label style={lbl}>Как сделать</label><textarea className="input" rows={3} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
        <div><label style={lbl}>Компромиссы</label><textarea className="input" rows={2} value={form.tradeoffs} onChange={e => setForm({ ...form, tradeoffs: e.target.value })} /></div>
        <div><label style={lbl}>Типичные ошибки</label><textarea className="input" rows={2} value={form.mistakes} onChange={e => setForm({ ...form, mistakes: e.target.value })} /></div>
        <div><label style={lbl}>Когда НЕ применять</label><input className="input" value={form.whenNotUse} onChange={e => setForm({ ...form, whenNotUse: e.target.value })} /></div>

        <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)" }}>🤖 Шаблон промпта</div>
          <div><label style={lbl}>Заголовок</label><input className="input" value={form.promptTitle} onChange={e => setForm({ ...form, promptTitle: e.target.value })} /></div>
          <div style={{ marginTop: "var(--space-xs)" }}>
            <label style={lbl}>Текст {"(переменные: {project}, {level})"}</label>
            <textarea className="input" rows={3} value={form.promptTemplate} onChange={e => setForm({ ...form, promptTemplate: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-s)" }}>
          <div><label style={lbl}>XP</label><input className="input" type="number" value={form.xpReward} onChange={e => setForm({ ...form, xpReward: parseInt(e.target.value) || 0 })} /></div>
          <div><label style={lbl}>Время</label><input className="input" value={form.timeEstimate} onChange={e => setForm({ ...form, timeEstimate: e.target.value })} /></div>
          <div><label style={lbl}>Порядок</label><input className="input" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} /></div>
        </div>

        {msg && <div style={{ fontSize: "var(--text-s)", color: msg.includes("✅") ? "var(--color-accent)" : "var(--color-error)" }}>{msg}</div>}
        <div style={{ display: "flex", gap: "var(--space-s)" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Сохранение..." : (form.id ? "Обновить" : "Создать")}</button>
          <Link href="/admin/decisions" className="btn btn-secondary" style={{ textDecoration: "none" }}>Отмена</Link>
        </div>
      </form>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2xs)" };
