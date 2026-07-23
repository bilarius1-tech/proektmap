'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Edit, Save, X, Check, Trash2, GripVertical, MoveUp, MoveDown, Plus } from "lucide-react";
import RichEditor from "@/components/admin/rich-editor";

interface QuestStep {
  id: string;
  step: number;
  title: string;
  detail: string;
  checklist: string;
  why: string;
  prompt: string;
  sortOrder: number;
}

function parseChecklist(raw: string): string[] {
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

export default function QuestAdminClient({ steps: init }: { steps: QuestStep[] }) {
  const router = useRouter();
  const [steps, setSteps] = useState<QuestStep[]>(init);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", detail: "", checklist: "", why: "", prompt: "" });
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  function startEdit(s: QuestStep) {
    setEditingId(s.id);
    const items = parseChecklist(s.checklist);
    setForm({ title: s.title, detail: s.detail, checklist: items.join("\n"), why: s.why, prompt: s.prompt || "" });
  }

  function startNew() {
    const maxStep = steps.reduce((m, s) => Math.max(m, s.step), 0);
    setEditingId("new");
    setForm({ title: "", detail: "", checklist: "", why: "", prompt: "" });
  }

  async function save() {
    setSaving(true);
    const body: any = {
      title: form.title,
      detail: form.detail,
      checklist: JSON.stringify(form.checklist.split("\n").map(l => l.trim()).filter(l => l)),
      why: form.why,
      prompt: form.prompt,
    };
    if (editingId !== "new") body.id = editingId;
    else {
      const m = steps.reduce((x, s) => Math.max(x, s.step), 0);
      body.step = m + 1;
      body.sortOrder = m + 1;
    }
    const res = await fetch("/api/quest/beginner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { router.refresh(); setEditingId(null); const u = await fetch("/api/quest/beginner").then(r => r.json()); if (Array.isArray(u)) setSteps(u); }
    setSaving(false);
  }

  async function deleteStep(id: string) {
    const res = await fetch(`/api/quest/beginner?id=${id}`, { method: "DELETE" });
    if (res.ok) { router.refresh(); setDeleteId(null); const u = await fetch("/api/quest/beginner").then(r => r.json()); if (Array.isArray(u)) setSteps(u); }
  }

  const moveStep = async (id: string, dir: -1 | 1) => {
    const idx = steps.findIndex(s => s.id === id);
    if (idx === -1) return;
    const other = steps[idx + dir];
    if (!other) return;
    // Swap sortOrder
    await fetch("/api/quest/beginner/reorder", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: id, b: other.id }),
    });
    router.refresh();
    const u = await fetch("/api/quest/beginner").then(r => r.json());
    if (Array.isArray(u)) setSteps(u);
  };

  const handleDragStart = (idx: number) => { dragItem.current = idx; };
  const handleDragEnter = (idx: number) => { dragOverItem.current = idx; };
  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === to) return;
    const a = steps[from];
    const b = steps[to];
    if (!a || !b) return;
    await fetch("/api/quest/beginner/reorder", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: a.id, b: b.id }),
    });
    router.refresh();
    const u = await fetch("/api/quest/beginner").then(r => r.json());
    if (Array.isArray(u)) setSteps(u);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div style={{ padding: "var(--space-xl)", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>🗺️ Квест — Путь новичка</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{steps.length} шагов · перетащите чтобы изменить порядок</p>
        </div>
        <button onClick={startNew} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "10px 20px",
          background: "var(--color-accent)", color: "white", border: "none",
          fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer",
        }}>
          <Plus size={14} /> Новый шаг
        </button>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{
            background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)",
            width: "min(95vw, 900px)", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                {editingId === "new" ? "Новый шаг" : "Редактирование шага"}
              </h2>
              <button onClick={() => setEditingId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Заголовок</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", border: "1px solid var(--color-border)", outline: "none", fontFamily: "var(--font-body)" }} />
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>
                📝 Описание (Rich Text редактор)
              </label>
              <RichEditor content={form.detail} onChange={(html) => setForm({ ...form, detail: html })} />
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Чеклист (по строке на пункт)</label>
              <textarea value={form.checklist} onChange={e => setForm({ ...form, checklist: e.target.value })} rows={5}
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.6 }} />
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Почему это важно?</label>
              <textarea value={form.why} onChange={e => setForm({ ...form, why: e.target.value })} rows={3}
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.6 }} />
            </div>

            <div style={{ marginBottom: "var(--space-l)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>AI-промпт</label>
              <textarea value={form.prompt} onChange={e => setForm({ ...form, prompt: e.target.value })} rows={4}
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical", fontFamily: "monospace", lineHeight: 1.6 }} />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={save} disabled={saving || !form.title}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: form.title ? "var(--color-accent)" : "var(--color-border)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: form.title ? "pointer" : "default" }}>
                <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => setEditingId(null)} style={{ padding: "12px 24px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <p style={{ fontSize: "var(--text-s)", marginBottom: "var(--space-l)", fontWeight: 600 }}>Удалить шаг навсегда?</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => deleteStep(deleteId)} style={{ padding: "10px 20px", background: "var(--color-error)", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "var(--text-xs)" }}>Удалить</button>
              <button onClick={() => setDeleteId(null)} style={{ padding: "10px 20px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", cursor: "pointer", fontSize: "var(--text-xs)" }}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Steps Table */}
      <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["↕", "№", "Заголовок", "Статус", "Действия"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => {
              const items = parseChecklist(s.checklist);
              return (
                <tr key={s.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  style={{
                    borderBottom: "1px solid var(--color-border-light)",
                    cursor: 'grab',
                    background: dragOverItem.current === i ? 'var(--color-accent-light)' : 'transparent',
                    transition: 'background 0.15s',
                  }}>
                  <td style={{ padding: "10px 6px", width: 28 }}>
                    <GripVertical size={12} style={{ color: "var(--color-text-tertiary)", cursor: 'grab' }} />
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--color-accent)", fontSize: "var(--text-s)" }}>{s.step}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontWeight: 600, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                      {s.prompt ? "📋 Есть промпт" : "Нет промпта"} · {items.length} пунктов
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ padding: "2px 8px", fontSize: 10, background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600 }}>Активен</span>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2 }}>
                    <button onClick={() => moveStep(s.id, -1)} disabled={i === 0}
                      style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", color: "var(--color-text-secondary)", padding: 4, opacity: i === 0 ? 0.3 : 1 }}>
                      <MoveUp size={14} />
                    </button>
                    <button onClick={() => moveStep(s.id, 1)} disabled={i === steps.length - 1}
                      style={{ background: "none", border: "none", cursor: i === steps.length - 1 ? "default" : "pointer", color: "var(--color-text-secondary)", padding: 4, opacity: i === steps.length - 1 ? 0.3 : 1 }}>
                      <MoveDown size={14} />
                    </button>
                    <button onClick={() => startEdit(s)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => setDeleteId(s.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {steps.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          Нет шагов. Запустите seed-скрипт или создайте новый шаг.
        </div>
      )}
    </div>
  );
}
