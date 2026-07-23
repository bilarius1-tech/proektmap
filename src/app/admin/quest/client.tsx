"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Save, X, Check } from "lucide-react";

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

export default function QuestAdminClient({ steps: initialSteps }: { steps: QuestStep[] }) {
  const router = useRouter();
  const [steps, setSteps] = useState<QuestStep[]>(initialSteps);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { title: "", detail: "", checklist: "", why: "", prompt: "" };
  const [form, setForm] = useState(emptyForm);

  function startEdit(s: QuestStep) {
    setEditingId(s.id);
    const items = parseChecklist(s.checklist);
    setForm({
      title: s.title,
      detail: s.detail,
      checklist: items.join("\n"),
      why: s.why,
      prompt: s.prompt || "",
    });
  }

  function startNew() {
    setEditingId("new");
    setForm({ title: "", detail: "", checklist: "", why: "", prompt: "" });
  }

  function parseChecklist(raw: string): string[] {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async function save() {
    setSaving(true);
    const checklistArr = form.checklist
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const body: any = {
      title: form.title,
      detail: form.detail,
      checklist: JSON.stringify(checklistArr),
      why: form.why,
      prompt: form.prompt,
    };

    if (editingId !== "new") {
      body.id = editingId;
    } else {
      // Find max step number
      const maxStep = steps.reduce((max, s) => Math.max(max, s.step), 0);
      body.step = maxStep + 1;
      body.sortOrder = maxStep + 1;
    }

    const res = await fetch("/api/quest/beginner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.refresh();
      setEditingId(null);
      // Refresh steps
      const updated = await fetch("/api/quest/beginner").then(r => r.json());
      if (Array.isArray(updated)) setSteps(updated);
    }
    setSaving(false);
  }

  return (
    <div style={{ padding: "var(--space-xl)", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>🗺️ Квест — Путь новичка</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>
            {steps.length} шагов
          </p>
        </div>
        <button onClick={startNew}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0,
            background: "var(--color-accent)", color: "white", border: "none",
            fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer",
          }}>
          + Новый шаг
        </button>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)",
        }}>
          <div style={{
            background: "var(--color-bg-primary)", borderRadius: 0,
            border: "1px solid var(--color-border)", padding: "var(--space-xl)",
            width: "min(90vw, 720px)", maxHeight: "90vh", overflow: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                {editingId === "new" ? "Новый шаг" : "Редактирование шага"}
              </h2>
              <button onClick={() => setEditingId(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Заголовок</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: 0,
                  border: "1px solid var(--color-border)", outline: "none",
                  fontFamily: "var(--font-body)",
                }} />
            </div>

            {/* Detail (textarea) */}
            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>
                Описание (rich text с Term|слово разметкой)
              </label>
              <textarea value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })}
                rows={8}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", borderRadius: 0,
                  border: "1px solid var(--color-border)", outline: "none", resize: "vertical",
                  fontFamily: "var(--font-body)", lineHeight: 1.6,
                }} />
            </div>

            {/* Checklist (one per line) */}
            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>
                Чеклист (по одному пункту на строку)
              </label>
              <textarea value={form.checklist} onChange={e => setForm({ ...form, checklist: e.target.value })}
                rows={5}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", borderRadius: 0,
                  border: "1px solid var(--color-border)", outline: "none", resize: "vertical",
                  fontFamily: "var(--font-body)", lineHeight: 1.6,
                }} />
            </div>

            {/* Why */}
            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Почему это важно?</label>
              <textarea value={form.why} onChange={e => setForm({ ...form, why: e.target.value })}
                rows={3}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", borderRadius: 0,
                  border: "1px solid var(--color-border)", outline: "none", resize: "vertical",
                  fontFamily: "var(--font-body)", lineHeight: 1.6,
                }} />
            </div>

            {/* Prompt */}
            <div style={{ marginBottom: "var(--space-l)" }}>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>AI-промпт</label>
              <textarea value={form.prompt} onChange={e => setForm({ ...form, prompt: e.target.value })}
                rows={4}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", borderRadius: 0,
                  border: "1px solid var(--color-border)", outline: "none", resize: "vertical",
                  fontFamily: "monospace", lineHeight: 1.6,
                }} />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={save} disabled={saving || !form.title}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 0,
                  background: form.title ? "var(--color-accent)" : "var(--color-border)",
                  color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600,
                  cursor: form.title ? "pointer" : "default",
                }}>
                <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => setEditingId(null)}
                style={{
                  padding: "12px 24px", borderRadius: 0, background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer",
                }}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps Table */}
      <div style={{ background: "var(--color-bg-primary)", borderRadius: 0, border: "1px solid var(--color-border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["№", "Заголовок", "Чеклист", "Статус", "Действия"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.map((s) => {
              const items = parseChecklist(s.checklist);
              const doneCount = items.length;
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--color-accent)" }}>{s.step}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontWeight: 600, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                      {s.prompt ? "📋 Есть промпт" : "Нет промпта"}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={12} style={{ color: "var(--color-accent)" }} />
                      <span style={{ color: "var(--color-text-secondary)" }}>{doneCount} пунктов</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 0, fontSize: 10,
                      background: "var(--color-accent-light)", color: "var(--color-accent)",
                      fontWeight: 600,
                    }}>
                      Активен
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => startEdit(s)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--color-text-secondary)", padding: 4,
                      }}>
                      <Edit size={14} />
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
