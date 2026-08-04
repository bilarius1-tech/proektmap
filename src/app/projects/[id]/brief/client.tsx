"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, ArrowLeft, CheckCircle, Circle, HelpCircle, ExternalLink } from "lucide-react";

interface BriefData {
  project: { id: string; name: string; description: string; domain: string; stack: string; niche: string; colors: string; goals: string; progress: number; status: string; createdAt: string };
  blueprint: { title: string; slug: string; goal: string; totalXp: number; totalDecisions: number };
  stages: Array<{ stageTitle: string; stageSlug: string; decisions: DecisionItem[] }>;
  stats: { totalDecisions: number; completedDecisions: number; skippedDecisions: number };
}

interface DecisionItem {
  id: string; title: string; problem: string; why: string; recommended: string; content: string;
  tradeoffs: string; whenNotUse: string; mistakes: string; context: string; constraints: string;
  validation: string; iteration: string; promptTemplate: string;
  difficulty: string; xpReward: number; userChoice: string; userReason: string; status: string;
}

export default function BriefClient({ projectId, isLoggedIn }: { projectId: string; isLoggedIn: boolean }) {
  const router = useRouter();
  const briefRef = useRef<HTMLDivElement>(null);
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDec, setExpandedDec] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/brief`)
      .then(r => r.json())
      .then(d => { setBrief(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-text-tertiary text-s">Загрузка брифа...</div>;
  if (!brief || !brief!.stages) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-text-tertiary text-s">Бриф не найден. <a href="/dashboard" className="text-accent">← В кабинет</a></div>;

  const markdown = generateMarkdown(brief);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function exportPdf() {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFont("helvetica", "normal");

    let y = 15;
    doc.setFontSize(18); doc.text(brief!.blueprint.title + " - Бриф проекта", 15, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Проект: ${brief!.project.name || "Без названия"}`, 15, y); y += 5;
    if (brief!.project.domain) { doc.text(`Домен: ${brief!.project.domain}`, 15, y); y += 5; }
    if (brief!.project.stack) { doc.text(`Стек: ${brief!.project.stack}`, 15, y); y += 5; }
    doc.text(`Прогресс: ${brief!.project.progress}% | Решений: ${brief!.stats.completedDecisions}/${brief!.stats.totalDecisions}`, 15, y); y += 8;

    for (const stage of brief!.stages) {
      if (y > 260) { doc.addPage(); y = 15; }
      doc.setFontSize(13); doc.text(stage.stageTitle, 15, y); y += 6;

      for (const d of stage.decisions) {
        if (y > 265) { doc.addPage(); y = 15; }
        doc.setFontSize(10);
        const label = d.status === "completed" ? `[V] ${d.title}` : `[?] ${d.title}`;
        doc.text(label, 18, y); y += 4;
        if (d.userChoice) {
          const choice = `Выбор: ${d.userChoice}`;
          const lines = doc.splitTextToSize(choice, 170);
          doc.text(lines, 22, y); y += lines.length * 4;
        }
        if (d.userReason) {
          const reason = `Причина: ${d.userReason}`;
          const lines = doc.splitTextToSize(reason, 170);
          doc.text(lines, 22, y); y += lines.length * 4;
        }
        y += 3;
      }
      y += 4;
    }

    doc.save(`brief-${brief!.project.name || "project"}.pdf`);
  }

  return (
    <div ref={briefRef} style={{ minHeight: "100dvh", background: "var(--color-bg-secondary)", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "var(--space-m) var(--space-l)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <a href="/dashboard" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowLeft size={14} /> В кабинет
            </a>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginTop: 4 }}>
              📋 {brief!.blueprint.title} — Бриф
            </h1>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 2 }}>
              {brief!.project.name} · {brief!.stats.completedDecisions} из {brief!.stats.totalDecisions} решений · Прогресс {brief!.project.progress}%
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={copyMarkdown}
              className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: 6 }}>
              <Copy size={14} /> {copied ? "Скопировано!" : "Копировать MD"}
            </button>
            <button onClick={exportPdf}
              className="btn btn-primary" style={{ padding: "8px 14px", fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={14} /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Brief body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        {/* Project overview */}
        <div className="card" style={{ padding: "var(--space-l)", marginBottom: "var(--space-l)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📌 О проекте</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "var(--space-s)", fontSize: "var(--text-xs)" }}>
            {brief!.project.name && <div><strong>Название:</strong> {brief!.project.name}</div>}
            {brief!.project.description && <div><strong>Описание:</strong> {brief!.project.description}</div>}
            {brief!.project.domain && <div><strong>Домен:</strong> {brief!.project.domain}</div>}
            {brief!.project.stack && <div><strong>Стек:</strong> {brief!.project.stack}</div>}
            {brief!.project.niche && <div><strong>Ниша:</strong> {brief!.project.niche}</div>}
            {brief!.project.goals && <div><strong>Цели:</strong> {brief!.project.goals}</div>}
          </div>
        </div>

        {/* Decisions by stage */}
        {brief!.stages.map(stage => (
          <div key={stage.stageTitle} style={{ marginBottom: "var(--space-l)" }}>
            <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)", color: "var(--color-accent)", display: "flex", alignItems: "center", gap: 8 }}>
              {stage.stageTitle}
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontWeight: 400 }}>
                {stage.decisions.filter(d => d.status === "completed").length}/{stage.decisions.length}
              </span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              {stage.decisions.map(d => (
                <div key={d.id} className="card" style={{
                  padding: "var(--space-m)", borderLeft: d.status === "completed" ? "3px solid var(--color-accent)" : "3px solid var(--color-border-light)",
                  cursor: "pointer",
                }} onClick={() => setExpandedDec(expandedDec === d.id ? null : d.id)}>
                  {/* Decision header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    {d.status === "completed" ? <CheckCircle size={16} style={{ color: "var(--color-accent)", marginTop: 1, flexShrink: 0 }} /> :
                     d.status === "skipped" ? <HelpCircle size={16} style={{ color: "var(--color-text-tertiary)", marginTop: 1, flexShrink: 0 }} /> :
                     <Circle size={16} style={{ color: "var(--color-border)", marginTop: 1, flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>{d.title}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 2 }}>
                        {d.problem}
                      </div>

                      {/* User's answer — always visible */}
                      {d.userChoice && (
                        <div style={{ marginTop: 6, padding: "6px 10px", borderRadius: "var(--radius-s)", background: "var(--color-accent-light)", fontSize: "var(--text-xs)" }}>
                          <strong style={{ color: "var(--color-accent)" }}>Ваш выбор:</strong> {d.userChoice}
                          {d.userReason && <span style={{ color: "var(--color-text-secondary)" }}> — {d.userReason}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedDec === d.id && (
                    <div style={{ marginTop: "var(--space-m)", paddingTop: "var(--space-m)", borderTop: "1px solid var(--color-border-light)", fontSize: "var(--text-xs)" }}>
                      {d.recommended && (
                        <div style={{ marginBottom: "var(--space-s)" }}>
                          <strong style={{ color: "var(--color-accent)" }}>Рекомендация:</strong>
                          <p style={{ margin: "2px 0 0 0", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{d.recommended}</p>
                        </div>
                      )}
                      {d.why && (
                        <div style={{ marginBottom: "var(--space-s)" }}>
                          <strong>Почему важно:</strong>
                          <p style={{ margin: "2px 0 0 0", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{d.why}</p>
                        </div>
                      )}
                      {d.mistakes && (
                        <div style={{ marginBottom: "var(--space-s)", padding: 8, background: "var(--color-error-light)", borderRadius: "var(--radius-s)" }}>
                          <strong style={{ color: "var(--color-error)" }}>Частые ошибки:</strong>
                          <p style={{ margin: "2px 0 0 0", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{d.mistakes}</p>
                        </div>
                      )}
                      {d.validation && (
                        <div style={{ marginBottom: "var(--space-s)" }}>
                          <strong>Проверка:</strong>
                          <p style={{ margin: "2px 0 0 0", color: "var(--color-text-secondary)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{d.validation}</p>
                        </div>
                      )}
                      {d.promptTemplate && (
                        <div style={{ marginBottom: "var(--space-s)", padding: 8, background: "var(--color-bg-tertiary)", borderRadius: "var(--radius-s)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                          <strong>AI-промпт:</strong>
                          <pre style={{ margin: "4px 0 0 0", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{d.promptTemplate}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {brief!.stages.length === 0 && (
          <div className="card" style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--color-text-tertiary)" }}>
            У вас пока нет принятых решений. Вернитесь к Blueprint и начните принимать решения!
          </div>
        )}
      </div>
    </div>
  );
}

function generateMarkdown(brief: BriefData): string {
  let md = "";
  md += `# ${brief!.blueprint.title} — Бриф проекта\n\n`;
  md += `**Проект:** ${brief!.project.name || "Без названия"}\n`;
  if (brief!.project.domain) md += `**Домен:** ${brief!.project.domain}\n`;
  if (brief!.project.stack) md += `**Стек:** ${brief!.project.stack}\n`;
  if (brief!.project.niche) md += `**Ниша:** ${brief!.project.niche}\n`;
  md += `**Прогресс:** ${brief!.project.progress}% | Решений: ${brief!.stats.completedDecisions}/${brief!.stats.totalDecisions}\n\n`;
  if (brief!.project.goals) md += `**Цели:** ${brief!.project.goals}\n\n`;
  md += `---\n\n`;

  for (const stage of brief!.stages) {
    md += `## ${stage.stageTitle}\n\n`;
    for (const d of stage.decisions) {
      md += `### ${d.title}\n`;
      md += `**Проблема:** ${d.problem}\n\n`;
      if (d.userChoice) {
        md += `**Выбор:** ${d.userChoice}`;
        if (d.userReason) md += ` — ${d.userReason}`;
        md += `\n\n`;
      }
      if (d.recommended) md += `**Рекомендация:** ${d.recommended}\n\n`;
      if (d.why) md += `**Почему важно:** ${d.why}\n\n`;
      if (d.mistakes) md += `**Ошибки:** ${d.mistakes}\n\n`;
      if (d.validation) md += `**Проверка:**\n${d.validation}\n\n`;
      if (d.promptTemplate) md += `**AI-промпт:**\n\`\`\`\n${d.promptTemplate}\n\`\`\`\n\n`;
    }
  }

  return md;
}
