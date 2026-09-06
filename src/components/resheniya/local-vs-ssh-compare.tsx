import { HardDrive, Minus, Plus, Server } from "lucide-react";
import type { ReactNode } from "react";
import { LOCAL_VS_SSH_STAGES, type LocalVsSshStage } from "@/app/resheniya/workspace-setup";

function ModeColumn({
  title,
  icon,
  mode,
  accent,
}: {
  title: string;
  icon: ReactNode;
  mode: LocalVsSshStage["local"];
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        border: accent ? "1px solid var(--color-accent, #0fb880)" : "1px solid var(--color-border)",
        background: accent ? "rgba(15,184,128,0.06)" : "var(--color-bg-primary, #fff)",
        minWidth: 0,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
        {icon} {title}
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#0a7a56", marginBottom: 6 }}>
          Плюсы
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {mode.pros.map((item) => (
            <li key={item} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
              <Plus size={14} style={{ flexShrink: 0, marginTop: 2, color: "#0fb880" }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#a15c00", marginBottom: 6 }}>
          Минусы
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {mode.cons.map((item) => (
            <li key={item} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
              <Minus size={14} style={{ flexShrink: 0, marginTop: 2, color: "#c47a00" }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Плюсы/минусы локально vs SSH по этапам маршрута.
 */
export default function LocalVsSshCompare() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
        Не «выбрать навсегда», а подобрать режим под этап. До публикации — локально; SSH — когда выкладываете и поддерживаете живой сайт.
      </p>

      {LOCAL_VS_SSH_STAGES.map((row) => (
        <article
          key={row.id}
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
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{row.stage}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{row.when}</div>
            </div>
            <span
              style={{
                padding: "5px 10px",
                background: row.recommend === "local" ? "rgba(15,184,128,0.12)" : "rgba(15,184,128,0.08)",
                border: "1px solid var(--color-accent, #0fb880)",
                color: "var(--color-text-primary)",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              ProektMap: {row.recommendLabel}
            </span>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 0,
            }}
          >
            <ModeColumn
              title="Локально"
              icon={<HardDrive size={15} />}
              mode={row.local}
              accent={row.recommend === "local" || row.recommend === "both"}
            />
            <ModeColumn
              title="SSH на хостинг"
              icon={<Server size={15} />}
              mode={row.ssh}
              accent={row.recommend === "ssh" || row.recommend === "both"}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
