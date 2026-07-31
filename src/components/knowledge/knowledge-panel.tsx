"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Trash2, ExternalLink, BookOpen, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Clip {
  id: string;
  text: string;
  pageTitle: string;
  pageUrl: string;
  blueprintId?: string | null;
  skillId?: string | null;
  glossaryId?: string | null;
  note: string;
  color: string;
  createdAt: string;
}

export default function KnowledgePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchClips = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge");
      const data = await res.json();
      setClips(data.clips || []);
    } catch {} finally { setLoading(false); }
  }, [session]);

  useEffect(() => {
    if (open) fetchClips();
  }, [open, fetchClips]);

  async function deleteClip(id: string) {
    await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
    setClips(prev => prev.filter(c => c.id !== id));
  }

  async function askAI(prompt: string) {
    if (!clips.length) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const text = clips.map(c => c.text).join("\n---\n");
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${prompt}\n\nВот сохранённые заметки пользователя:\n${text}`,
          context: "knowledge_clips",
        }),
      });
      const data = await res.json();
      setAiResult(data.answer || data.error || "Нет ответа");
    } catch (e) {
      setAiResult("Ошибка запроса");
    } finally { setAiLoading(false); }
  }

  if (!open) return null;

  // Group clips by pageUrl for the "source" view
  const grouped = clips.reduce((acc: Record<string, Clip[]>, clip) => {
    const key = clip.pageTitle || "Без названия";
    if (!acc[key]) acc[key] = [];
    acc[key].push(clip);
    return acc;
  }, {});

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 150,
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 420,
        background: "var(--color-bg-primary)", zIndex: 151,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "var(--space-l)", borderBottom: "1px solid var(--color-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={20} style={{ color: "var(--color-accent)" }} />
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700 }}>
                Моя база знаний
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                {clips.length} {plural(clips.length, "заметка", "заметки", "заметок")}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={iconBtnStyle}>
            <X size={18} />
          </button>
        </div>

        {/* AI Actions */}
        {clips.length > 0 && (
          <div style={{
            display: "flex", gap: 6, padding: "var(--space-m) var(--space-l)",
            borderBottom: "1px solid var(--color-border)", flexWrap: "wrap",
          }}>
            <AiBtn icon={<Lightbulb size={14} />} label="Объяснить" loading={aiLoading} onClick={() => askAI("Объясни эти понятия простыми словами, как новичку. На русском.")} />
            <AiBtn icon={<Sparkles size={14} />} label="Конспект" loading={aiLoading} onClick={() => askAI("Составь краткий структурированный конспект из этих заметок. Сгруппируй по темам. На русском.")} />
          </div>
        )}

        {/* AI Result */}
        {aiResult && (
          <div style={{
            margin: "var(--space-m) var(--space-l)", padding: "var(--space-m)",
            background: "var(--color-accent-light)", borderRadius: "var(--radius-m)",
            fontSize: "var(--text-xs)", lineHeight: 1.7, maxHeight: 200, overflowY: "auto",
          }}>
            {aiResult}
          </div>
        )}

        {/* Clip list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-m)" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-secondary)", fontSize: "var(--text-xs)" }}>
              Загрузка...
            </div>
          ) : clips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-xxl) var(--space-l)" }}>
              <BookOpen size={48} style={{ color: "var(--color-border)", marginBottom: "var(--space-m)" }} />
              <div style={{ fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>Пока пусто</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Выдели любой текст на странице и нажми «💾 Сохранить» — он появится здесь.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              {/* Source groups */}
              {Object.entries(grouped).map(([page, pageClips]) => (
                <div key={page}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    color: "var(--color-text-secondary)", letterSpacing: "0.05em",
                    marginBottom: 6, marginTop: 8, paddingLeft: 4,
                  }}>
                    📄 {page}
                  </div>
                  {pageClips.map(clip => (
                    <div key={clip.id} style={{
                      background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)",
                      padding: "var(--space-m)", marginBottom: 4,
                      position: "relative", fontSize: "var(--text-xs)", lineHeight: 1.6,
                    }}>
                      <button
                        onClick={() => deleteClip(clip.id)}
                        style={{
                          position: "absolute", top: 6, right: 6,
                          background: "none", border: "none", cursor: "pointer",
                          color: "var(--color-text-secondary)", padding: 4,
                          borderRadius: "var(--radius-s)",
                        }}
                        title="Удалить"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div style={{ paddingRight: 28 }}>{clip.text}</div>
                      {clip.pageUrl && (
                        <Link href={clip.pageUrl} target="_blank" style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10, color: "var(--color-accent)", textDecoration: "none",
                          marginTop: 6,
                        }}>
                          <ExternalLink size={10} /> источник
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AiBtn({ icon, label, loading, onClick }: { icon: any; label: string; loading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 14px", borderRadius: "var(--radius-full)",
        border: "1px solid var(--color-border)", background: "var(--color-bg-primary)",
        cursor: loading ? "wait" : "pointer", fontSize: 12, fontWeight: 600,
        color: "var(--color-text-primary)", fontFamily: "inherit",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : icon}
      {label}
    </button>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

const iconBtnStyle: any = {
  background: "none", border: "none", cursor: "pointer",
  color: "var(--color-text-secondary)", padding: 6,
  borderRadius: "var(--radius-s)", display: "flex",
};
