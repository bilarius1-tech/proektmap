import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  Boxes,
  Bot,
  Cloud,
  FolderOpen,
  Globe,
  Monitor,
  Plug,
  ScrollText,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { GROK_BOT_ACCENT, TRUST_LADDER } from "@/lib/agent-engineering/grok-bot-data";

const card: CSSProperties = {
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border)",
};

function Caption({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: "10px 0 0",
        fontSize: 13,
        lineHeight: 1.5,
        color: "var(--color-text-secondary)",
      }}
    >
      {children}
    </p>
  );
}

/** Схема: бот + облачный компьютер (браузер, файлы, терминал). */
export function AnatomyInfographic() {
  return (
    <figure style={{ margin: 0 }} aria-label="Схема: Grok Bot и облачный компьютер">
      <div
        style={{
          ...card,
          padding: "20px 16px",
          background:
            "linear-gradient(180deg, rgba(234,88,12,0.06) 0%, var(--color-bg-primary) 48%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              border: `1px solid ${GROK_BOT_ACCENT}44`,
              background: "var(--color-bg-primary)",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: GROK_BOT_ACCENT }}>
              <Bot size={22} aria-hidden />
              <strong style={{ fontFamily: "var(--font-heading)", fontSize: 16 }}>Бот</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
              <li>Имя и должность</li>
              <li>Описание = закон</li>
              <li>Чат, память роли</li>
              <li>Skills и routines</li>
            </ul>
          </div>

          <div
            aria-hidden
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: GROK_BOT_ACCENT,
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              Сообщения <ArrowRight size={16} />
            </span>
          </div>

          <div
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-secondary)",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#0f766e" }}>
              <Cloud size={22} aria-hidden />
              <strong style={{ fontFamily: "var(--font-heading)", fontSize: 16 }}>Облачный компьютер</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
              {[
                { Icon: Globe, label: "Браузер" },
                { Icon: FolderOpen, label: "Файлы" },
                { Icon: Terminal, label: "Терминал" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    textAlign: "center",
                    padding: "10px 6px",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <item.Icon size={18} style={{ marginBottom: 4, color: "#0f766e" }} aria-hidden />
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Ноутбук закрыт — работа идёт. Телефон видит тот же стол.
            </p>
          </div>
        </div>
      </div>
      <Caption>
        Бот — роль и правила. Компьютер — руки. Закрыть чат ≠ выключить работу.
      </Caption>
    </figure>
  );
}

/** Лестница доверия: задача → skill → routine → второй бот. */
export function LadderInfographic() {
  return (
    <figure style={{ margin: 0 }} aria-label="Лестница: задача, skill, routine, второй бот">
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10,
        }}
      >
        {TRUST_LADDER.map((step, i) => (
          <li
            key={step.n}
            style={{
              ...card,
              padding: "16px 14px",
              borderTop: `4px solid ${GROK_BOT_ACCENT}`,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: GROK_BOT_ACCENT,
                marginBottom: 6,
              }}
            >
              Шаг {step.n}
              {i < TRUST_LADDER.length - 1 ? " →" : ""}
            </div>
            <strong
              style={{
                display: "block",
                fontFamily: "var(--font-heading)",
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              {step.title}
            </strong>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
              {step.text}
            </p>
          </li>
        ))}
      </ol>
      <Caption>Не прыгайте на routine и флот ботов, пока не зелёный ручной прогон.</Caption>
    </figure>
  );
}

/** Три бота смотрят в один компьютер — предупреждение. */
export function SharedComputerInfographic() {
  const bots = ["Разведчик", "Редактор", "Продюсер"];
  return (
    <figure style={{ margin: 0 }} aria-label="Все боты аккаунта делят один компьютер">
      <div style={{ ...card, padding: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {bots.map((name) => (
                <span
                  key={name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 10px",
                    border: `1px solid ${GROK_BOT_ACCENT}44`,
                    background: "rgba(234,88,12,0.06)",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <Bot size={14} aria-hidden /> {name}
                </span>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
              Три имени. Один стол, одни вкладки, одни логины.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              background: "rgba(220, 38, 38, 0.06)",
              border: "1px solid rgba(220, 38, 38, 0.25)",
            }}
          >
            <ShieldAlert size={28} color="#dc2626" aria-hidden />
            <div>
              <strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Не сейф</strong>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
                Залогинились в Авито как Разведчик — Редактор тоже там.
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Monitor size={20} color="#0f766e" aria-hidden />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Общий облачный компьютер аккаунта</span>
        </div>
      </div>
      <Caption>Имя бота не делит безопасность. Делят настройки прав и то, что вы не кладёте на стол.</Caption>
    </figure>
  );
}

/** Внешний контур Grok Bot → внутренний Cursor. */
export function OuterInnerInfographic() {
  return (
    <figure style={{ margin: 0 }} aria-label="Внешний контур Grok Bot и внутренний контур Cursor">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <div style={{ ...card, padding: 16, borderLeft: `4px solid ${GROK_BOT_ACCENT}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GROK_BOT_ACCENT, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
            Outer loop
          </div>
          <strong style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: 16, marginBottom: 8 }}>
            Grok Bot
          </strong>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
            Slack, Notion, почта, сайты. Собирает чистый бриф. Грязный контекст разведки остаётся здесь.
          </p>
        </div>
        <div style={{ ...card, padding: 16, borderLeft: "4px solid #0f766e" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0f766e", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
            Inner loop
          </div>
          <strong style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: 16, marginBottom: 8 }}>
            Cursor Cloud Agent
          </strong>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
            Репозиторий, diff, тесты, PR. Получает готовый промпт, а не пересказ всей переписки.
          </p>
        </div>
      </div>
      <Caption>
        Часто Grok Bot код сам не пишет: готовит тот же заказ, который написали бы вы, и отдаёт кодер-агенту.
      </Caption>
    </figure>
  );
}

export function SkillPluginStrip() {
  const items = [
    { Icon: ScrollText, title: "Skill", text: "Как делать" },
    { Icon: Plug, title: "Плагин", text: "Куда ходить" },
    { Icon: Monitor, title: "Компьютер", text: "Когда нет API" },
    { Icon: Boxes, title: "Cursor skills", text: "Часто те же файлы" },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 10,
      }}
    >
      {items.map((item) => (
        <div key={item.title} style={{ ...card, padding: "14px 12px", textAlign: "center" }}>
          <item.Icon size={22} color={GROK_BOT_ACCENT} aria-hidden />
          <div style={{ fontWeight: 800, marginTop: 8, fontSize: 14 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>{item.text}</div>
        </div>
      ))}
    </div>
  );
}
