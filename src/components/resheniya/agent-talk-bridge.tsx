import Link from "next/link";
import { ArrowRight, GitBranch, MessageSquare, Repeat, Shield } from "lucide-react";
import { AGENT_TALK_BRIDGE } from "@/app/resheniya/agent-talk-bridge";

const ICONS = {
  harness: Shield,
  loop: Repeat,
  graph: GitBranch,
} as const;

/**
 * Мост: как писать агенту → Harness / Loop / Graph (/agent-engineering).
 */
export default function AgentTalkBridge() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
        {AGENT_TALK_BRIDGE.lead}
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {AGENT_TALK_BRIDGE.pillars.map((p) => {
          const Icon = ICONS[p.id];
          return (
            <article
              key={p.id}
              style={{
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-primary, #fff)",
              }}
            >
              <header
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderBottom: "1px solid var(--color-border)",
                  background: "var(--color-bg-secondary, #f7f7f8)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-accent, #0fb880)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {p.order}
                  </span>
                  <Icon size={18} style={{ color: "var(--color-accent, #0fb880)" }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{p.plain}</div>
                  </div>
                </div>
                <Link
                  href={p.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--color-accent, #0fb880)",
                    textDecoration: "none",
                  }}
                >
                  Урок <ArrowRight size={14} />
                </Link>
              </header>

              <div style={{ padding: "12px 14px", display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <MessageSquare size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--color-accent, #0fb880)" }} />
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
                    {p.howToTalk}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 10,
                  }}
                >
                  <div style={{ padding: "10px 12px", border: "1px solid #e8b4b4", background: "rgba(200,60,60,0.04)" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#a33", marginBottom: 6 }}>
                      Плохо
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45 }}>{p.bad}</p>
                  </div>
                  <div style={{ padding: "10px 12px", border: "1px solid var(--color-accent, #0fb880)", background: "rgba(15,184,128,0.06)" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#0a7a56", marginBottom: 6 }}>
                      Хорошо
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45 }}>{p.good}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
                  Почему: {p.why}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <Link
        href={AGENT_TALK_BRIDGE.trackHref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "center",
          padding: "12px 16px",
          background: "var(--color-accent, #0fb880)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 13,
          textDecoration: "none",
        }}
      >
        {AGENT_TALK_BRIDGE.trackLabel} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
