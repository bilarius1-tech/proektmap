import { ExternalLink, Minus, Plus, Sparkles } from "lucide-react";
import { CODING_PLATFORMS } from "@/app/resheniya/coding-platforms";

/**
 * Стек + плюсы/минусы платформ для кодинга: Cursor, Reasonix, OpenCode.
 */
export default function CodingPlatformsCompare() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
        Основной путь ProektMap — <strong>Cursor</strong>.{" "}
        <strong>Reasonix</strong> (DeepSeek / китайский стек) и <strong>OpenCode</strong> — открытые альтернативы,
        если нужна другая экономика моделей или open-source агент.
      </p>

      {CODING_PLATFORMS.map((p) => {
        const primary = p.recommend === "primary";
        return (
          <article
            key={p.id}
            style={{
              border: primary ? "1px solid var(--color-accent, #0fb880)" : "1px solid var(--color-border)",
              background: "var(--color-bg-primary, #fff)",
            }}
          >
            <header
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderBottom: "1px solid var(--color-border)",
                background: primary ? "rgba(15,184,128,0.08)" : "var(--color-bg-secondary, #f7f7f8)",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 16 }}>{p.name}</span>
                  <span
                    style={{
                      padding: "3px 8px",
                      background: primary ? "var(--color-accent, #0fb880)" : "transparent",
                      border: primary ? "none" : "1px solid var(--color-border)",
                      color: primary ? "#fff" : "var(--color-text-secondary)",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.recommendLabel}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>{p.tagline}</div>
                <div style={{ fontSize: 12, marginTop: 6, color: "var(--color-text-secondary)" }}>
                  Когда брать: {p.bestFor}
                </div>
              </div>
              <a
                href={p.website}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  background: primary ? "var(--color-accent, #0fb880)" : "var(--color-bg-primary, #fff)",
                  border: primary ? "none" : "1px solid var(--color-border)",
                  color: primary ? "#fff" : "var(--color-text-primary)",
                  fontWeight: 700,
                  fontSize: 12,
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                {p.websiteLabel} <ExternalLink size={13} />
              </a>
            </header>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              <div style={{ padding: "12px 14px", borderRight: "1px solid var(--color-border)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Sparkles size={13} /> Стек
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
                  {p.stack.map((item) => (
                    <li key={item} style={{ marginBottom: 4 }}>
                      {item}
                    </li>
                  ))}
                </ul>
                <p style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
                  {p.payVpn}
                </p>
                {p.arsenalHref && (
                  <a
                    href={p.arsenalHref}
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--color-accent, #0fb880)",
                    }}
                  >
                    В каталоге ProektMap →
                  </a>
                )}
              </div>

              <div style={{ padding: "12px 14px", borderRight: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#0a7a56", marginBottom: 8 }}>
                  Плюсы
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                  {p.pros.map((item) => (
                    <li key={item} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
                      <Plus size={14} style={{ flexShrink: 0, marginTop: 2, color: "#0fb880" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#a15c00", marginBottom: 8 }}>
                  Минусы
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                  {p.cons.map((item) => (
                    <li key={item} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
                      <Minus size={14} style={{ flexShrink: 0, marginTop: 2, color: "#c47a00" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
