"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";

interface Decision {
  id?: string; stageId: string; title: string; slug: string;
  problem: string; why: string; recommended: string; content: string;
  tradeoffs: string; whenNotUse: string; mistakes: string; context: string; constraints: string; validation: string; iteration: string;
  difficulty: string; xpReward: number; timeEstimate: string;
  promptTitle: string; promptTemplate: string; sortOrder: number;
}

const DEPTH_FIELDS = {
  "🎯 Понимание (30 сек)": ["problem", "why", "context", "constraints"] as const,
  "🧠 Выбор (2-5 мин)": ["recommended", "content", "tradeoffs", "whenNotUse"] as const,
  "⚡ Действие (5-15 мин)": ["mistakes", "validation", "iteration", "promptTemplate"] as const,
};

interface Stage { id: string; title: string; }

export default function DecisionForm({ stages, initial }: { stages: Stage[]; initial?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<Decision>({
    stageId: initial?.stageId || "", title: initial?.title || "", slug: initial?.slug || "",
    problem: initial?.problem || "", why: initial?.why || "", recommended: initial?.recommended || "",
    content: initial?.content || "", tradeoffs: initial?.tradeoffs || "",
    whenNotUse: initial?.whenNotUse || "", mistakes: initial?.mistakes || "",
    context: initial?.context || "", constraints: initial?.constraints || "",
    validation: initial?.validation || "", iteration: initial?.iteration || "",
    difficulty: initial?.difficulty || "easy", xpReward: initial?.xpReward || 15,
    timeEstimate: initial?.timeEstimate || "15 мин",
    promptTitle: initial?.promptTitle || "", promptTemplate: initial?.promptTemplate || "",
    sortOrder: initial?.sortOrder || 0, id: initial?.id,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Count filled 12-field fields (exclude title/slug/stageId/xpReward etc)
  const depthFieldNames = Object.values(DEPTH_FIELDS).flat();
  const filledCount = depthFieldNames.filter(f => (form as any)[f]?.trim()).length;
  const totalDepth = depthFieldNames.length;
  const completeness = Math.round((filledCount / totalDepth) * 100);

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

  function update(field: keyof Decision, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <Link href="/admin/decisions" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-m)", textDecoration: "none" }}>
        <ArrowLeft size={14} /> Назад к списку
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: "var(--space-l)" }}>
        <h1 style={{ fontSize: "var(--text-xl)", margin: 0 }}>{form.id ? "Редактировать решение" : "Новое решение"}</h1>

        {/* Completeness bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: "var(--radius-full)", background: completeness === 100 ? "var(--color-accent-light)" : "var(--color-bg-tertiary)", border: `2px solid ${completeness === 100 ? "var(--color-accent)" : "var(--color-border)"}`, fontSize: "var(--text-xs)", fontWeight: 600 }}>
          {completeness === 100 ? <CheckCircle size={14} style={{ color: "var(--color-accent)" }} /> : <Circle size={14} style={{ color: "var(--color-text-tertiary)" }} />}
          <span style={{ color: completeness === 100 ? "var(--color-accent)" : "var(--color-text-secondary)" }}>
            {filledCount}/{totalDepth} полей
          </span>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: "var(--color-border-light)", overflow: "hidden" }}>
            <div style={{ width: `${completeness}%`, height: "100%", background: completeness === 100 ? "var(--color-accent)" : completeness >= 50 ? "#f59e0b" : "var(--color-border)", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)", maxWidth: 800 }}>
        {/* Basic info */}
        <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <h2 style={sectionH2}>📋 Основное</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-s)" }}>
            <div><label style={lbl}>Этап *</label><select className="input" value={form.stageId} onChange={e => update("stageId", e.target.value)} required><option value="">Выберите этап</option>{stages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></div>
            <div><label style={lbl}>Сложность</label><select className="input" value={form.difficulty} onChange={e => update("difficulty", e.target.value)}><option value="easy">Лёгкий</option><option value="medium">Средний</option><option value="hard">Сложный</option></select></div>
            <div><label style={lbl}>Название *</label><input className="input" value={form.title} onChange={e => update("title", e.target.value)} required /></div>
            <div><label style={lbl}>Slug</label><input className="input" value={form.slug} onChange={e => update("slug", e.target.value)} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-s)", marginTop: "var(--space-s)" }}>
            <div><label style={lbl}>XP</label><input className="input" type="number" value={form.xpReward} onChange={e => update("xpReward", parseInt(e.target.value) || 0)} /></div>
            <div><label style={lbl}>Время</label><input className="input" value={form.timeEstimate} onChange={e => update("timeEstimate", e.target.value)} /></div>
            <div><label style={lbl}>Порядок</label><input className="input" type="number" value={form.sortOrder} onChange={e => update("sortOrder", parseInt(e.target.value) || 0)} /></div>
          </div>
        </div>

        {/* 3 Depth Levels */}
        {Object.entries(DEPTH_FIELDS).map(([section, fields]) => {
          const sectionFilled = fields.filter(f => (form as any)[f]?.trim()).length;
          return (
            <div key={section} style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
                <h2 style={{ ...sectionH2, marginBottom: 0 }}>{section}</h2>
                <span style={{ fontSize: "var(--text-xs)", color: sectionFilled === fields.length ? "var(--color-accent)" : "var(--color-text-tertiary)", fontWeight: 600 }}>
                  {sectionFilled}/{fields.length}
                </span>
              </div>

              {fields.map(field => (
                <div key={field} style={{ marginBottom: "var(--space-s)" }}>
                  <label style={{ ...lbl, display: "flex", alignItems: "center", gap: 4 }}>
                    {fieldLabels[field]}
                    {(form as any)[field]?.trim()
                      ? <CheckCircle size={10} style={{ color: "var(--color-accent)" }} />
                      : <Circle size={10} style={{ color: "var(--color-border)" }} />}
                  </label>
                  {field === "promptTemplate" ? (
                    <textarea className="input" rows={4} value={form.promptTemplate}
                      onChange={e => update("promptTemplate", e.target.value)}
                      placeholder="Рабочий промпт с версиями, именами файлов, структурой. Переменные: {project}, {level}" />
                  ) : field === "content" || field === "validation" ? (
                    <textarea className="input" rows={3} value={(form as any)[field]}
                      onChange={e => update(field, e.target.value)}
                      placeholder={fieldPlaceholders[field]} />
                  ) : (
                    <textarea className="input" rows={2} value={(form as any)[field]}
                      onChange={e => update(field, e.target.value)}
                      placeholder={fieldPlaceholders[field]} />
                  )}
                </div>
              ))}
            </div>
          );
        })}

        {msg && <div style={{ fontSize: "var(--text-s)", color: msg.includes("✅") ? "var(--color-accent)" : "var(--color-error)", padding: "var(--space-s)", background: msg.includes("✅") ? "var(--color-accent-light)" : "var(--color-error-light)", borderRadius: "var(--radius-m)" }}>{msg}</div>}

        <div style={{ display: "flex", gap: "var(--space-s)", paddingBottom: "var(--space-xxl)" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Сохранение..." : (form.id ? "Обновить" : "Создать")}</button>
          <Link href="/admin/decisions" className="btn btn-secondary" style={{ textDecoration: "none" }}>Отмена</Link>
        </div>
      </form>
    </div>
  );
}

const sectionH2: React.CSSProperties = { fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" };
const lbl: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2xs)" };

const fieldLabels: Record<string, string> = {
  problem: "Проблема (что решаем)",
  why: "Почему это важно",
  context: "Контекст (что AI должен знать о проекте)",
  constraints: "Ограничения (что НЕ делать)",
  recommended: "Рекомендуемое решение",
  content: "Как сделать (пошаговая инструкция)",
  tradeoffs: "Компромиссы",
  whenNotUse: "Когда НЕ применять",
  mistakes: "Типичные ошибки",
  validation: "Как проверить (чек-лист)",
  iteration: "Как улучшить (после базовой настройки)",
  promptTemplate: "AI-промпт (рабочий, копируемый)",
};

const fieldPlaceholders: Record<string, string> = {
  problem: "Одно предложение: что именно решаем",
  why: "Что будет если игнорировать или выбрать неправильно",
  context: "Проект: корпоративный сайт. Фреймворк: Next.js 16. Хостинг: Vercel.",
  constraints: "Не использовать X, не делать Y — жёсткие рамки",
  recommended: "Конкретный вариант + почему. Например: Vercel, потому что...",
  content: "1. Зайди на сайт X\n2. Нажми Y\n3. Скопируй Z\n...",
  tradeoffs: "Чем жертвуем: стоимость vs скорость, простота vs гибкость",
  whenNotUse: "Случаи когда эта рекомендация НЕ работает",
  mistakes: "1. Новички часто...\n2. Никогда не делай...",
  validation: "[ ] Проверить X\n[ ] Убедиться что Y работает\n[ ] npx что-то",
  iteration: "1. После базовой настройки добавь...\n2. Улучши через...",
  promptTemplate: "Создай next.config.js для Next.js 16 с images.remotePatterns для домена example.ru...",
};
