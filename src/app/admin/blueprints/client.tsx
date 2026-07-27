"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Save, X, Check, Trash2, Plus, ChevronDown, ChevronRight, GitBranch, Layers, FileText, RefreshCw } from "lucide-react";

export default function BlueprintsAdmin({ data }: { data: any[] }) {
  const router = useRouter();
  const [blueprints, setBlueprints] = useState(data);
  const [expandedBp, setExpandedBp] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Edit Decision modal
  const [editDec, setEditDec] = useState<any>(null);

  function toggleBp(id: string) { setExpandedBp(expandedBp === id ? null : id); setExpandedStage(null); }
  function toggleStage(id: string) { setExpandedStage(expandedStage === id ? null : id); }

  function startEditDecision(dec: any) {
    setEditDec({
      id: dec.id,
      title: dec.title || "",
      problem: dec.problem || "",
      why: dec.why || "",
      recommended: dec.recommended || "",
      promptTemplate: dec.promptTemplate || "",
      skillsRequired: dec.skillsRequired || "[]",
      content: dec.content || "",
      mistakes: dec.mistakes || "",
      xpReward: dec.xpReward || 5,
    });
  }

  async function saveDecision() {
    if (!editDec) return;
    setSaving(true);
    const body: any = { ...editDec };
    try { body.skillsRequired = JSON.stringify(JSON.parse(body.skillsRequired)); } catch {}
    await fetch("/api/admin/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage("Сохранено!");
    setTimeout(() => setMessage(""), 2000);
    setSaving(false);
    setEditDec(null);
    router.refresh();
  }

  const lab: any = { display: "block", fontSize: 10, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, fontFamily: "var(--font-heading)" };
  const inp: any = { width: "100%", padding: "8px 10px", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", outline: "none", borderRadius: 0, background: "var(--color-bg-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" };
  const ta: any = { ...inp, minHeight: 80, resize: "vertical", lineHeight: 1.5 };

  return (
    <div style={{ padding: "var(--space-xl)", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, fontFamily: "var(--font-heading)", margin: 0 }}>
            <GitBranch size={22} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--color-accent)" }} />
            Blueprint'ы
          </h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)", marginTop: 4 }}>
            {blueprints.length} шаблонов · Редактируйте этапы, решения, промпты и навыки
          </p>
        </div>
      </div>

      {message && (
        <div style={{ padding: "var(--space-s) var(--space-m)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", marginBottom: "var(--space-m)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
          {message}
        </div>
      )}

      {/* Blueprints tree */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {blueprints.map((bp: any) => (
          <div key={bp.id} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
            <button onClick={() => toggleBp(bp.id)} style={{
              width: "100%", padding: "var(--space-m) var(--space-l)", display: "flex", alignItems: "center", gap: 10,
              border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-body)", textAlign: "left",
            }}>
              {expandedBp === bp.id ? <ChevronDown size={16} style={{ color: "var(--color-accent)" }} /> : <ChevronRight size={16} style={{ color: "var(--color-accent)" }} />}
              <GitBranch size={16} style={{ color: "var(--color-accent)" }} />
              <span style={{ fontWeight: 700, fontSize: "var(--text-s)", fontFamily: "var(--font-heading)", flex: 1 }}>{bp.title}</span>
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{bp.totalDecisions} решений · {bp.totalXp} XP</span>
              <span style={{ padding: "2px 8px", fontSize: 10, background: bp.isPublished ? "var(--color-accent-light)" : "var(--color-bg-secondary)", color: bp.isPublished ? "var(--color-accent)" : "var(--color-text-tertiary)", fontWeight: 600 }}>
                {bp.isPublished ? "Опубликован" : "Черновик"}
              </span>
            </button>

            {expandedBp === bp.id && (
              <div style={{ borderTop: "1px solid var(--color-border)", padding: "var(--space-s) var(--space-l) var(--space-l)" }}>
                {bp.stages?.map((bs: any) => (
                  <div key={bs.id} style={{ marginBottom: "var(--space-s)" }}>
                    <button onClick={() => toggleStage(bs.id)} style={{
                      width: "100%", padding: "8px 0", display: "flex", alignItems: "center", gap: 8,
                      border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-body)", textAlign: "left",
                    }}>
                      {expandedStage === bs.id ? <ChevronDown size={14} style={{ color: "var(--color-text-tertiary)" }} /> : <ChevronRight size={14} style={{ color: "var(--color-text-tertiary)" }} />}
                      <Layers size={14} style={{ color: "var(--color-text-tertiary)" }} />
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, flex: 1 }}>{bs.stage?.title || "Без названия"}</span>
                      <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{bs.stage?.decisions?.length || 0} решений</span>
                    </button>

                    {expandedStage === bs.id && bs.stage?.decisions && (
                      <div style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 4 }}>
                        {bs.stage.decisions.map((dec: any) => (
                          <div key={dec.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-light)" }}>
                            <FileText size={12} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
                            <span style={{ fontSize: "var(--text-xs)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {dec.title}
                              {dec.promptTemplate ? " 📝" : " ⚠️"}
                              {dec.skillsRequired !== "[]" ? " 🏷️" : ""}
                            </span>
                            <button onClick={() => startEditDecision(dec)} style={{
                              padding: "2px 8px", border: "1px solid var(--color-border)", background: "transparent",
                              cursor: "pointer", fontSize: 10, fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 4,
                              color: "var(--color-text-secondary)",
                            }}>
                              <Edit size={10} /> Ред.
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Decision Modal */}
      {editDec && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", width: "min(95vw, 800px)", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <h2 style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)", margin: 0 }}>Решение: {editDec.title}</h2>
              <button onClick={() => setEditDec(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}><label style={lab}>Заголовок</label><input style={inp} value={editDec.title} onChange={(e: any) => setEditDec({ ...editDec, title: e.target.value })} /></div>
            <div style={{ marginBottom: "var(--space-m)" }}><label style={lab}>Проблема (почему это важно)</label><textarea style={ta} value={editDec.problem} onChange={(e: any) => setEditDec({ ...editDec, problem: e.target.value })} rows={3} /></div>
            <div style={{ marginBottom: "var(--space-m)" }}><label style={lab}>Почему это решение?</label><textarea style={ta} value={editDec.why} onChange={(e: any) => setEditDec({ ...editDec, why: e.target.value })} rows={2} /></div>
            <div style={{ marginBottom: "var(--space-m)" }}><label style={lab}>Рекомендация</label><textarea style={ta} value={editDec.recommended} onChange={(e: any) => setEditDec({ ...editDec, recommended: e.target.value })} rows={2} /></div>
            
            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={lab}>📝 Промпт (для Cursor/Claude Code)</label>
              <textarea style={{ ...ta, minHeight: 120, fontFamily: "monospace", fontSize: 11 }} value={editDec.promptTemplate} onChange={(e: any) => setEditDec({ ...editDec, promptTemplate: e.target.value })} rows={5}
                placeholder="Ты — AI-разработчик. Создай файл... Используй {{project}}, {{stack}}." />
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}>
              <label style={lab}>🏷️ Навыки (JSON массив slug-ов из глоссария)</label>
              <input style={{ ...inp, fontFamily: "monospace" }} value={editDec.skillsRequired} onChange={(e: any) => setEditDec({ ...editDec, skillsRequired: e.target.value })}
                placeholder='["nextjs","prisma","postgresql"]' />
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}><label style={lab}>Типичные ошибки</label><textarea style={ta} value={editDec.mistakes} onChange={(e: any) => setEditDec({ ...editDec, mistakes: e.target.value })} rows={2} /></div>
            <div style={{ marginBottom: "var(--space-l)" }}><label style={lab}>XP за решение</label><input style={{ ...inp, width: 80 }} type="number" value={editDec.xpReward} onChange={(e: any) => setEditDec({ ...editDec, xpReward: parseInt(e.target.value) || 5 })} /></div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveDecision} disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: "var(--color-accent)", color: "#fff", border: "none", fontSize: "var(--text-xs)", fontWeight: 700, fontFamily: "var(--font-heading)", cursor: "pointer", borderRadius: 0 }}>
                {saving ? <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => setEditDec(null)} style={{ padding: "12px 24px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", cursor: "pointer", borderRadius: 0, fontFamily: "var(--font-body)" }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
