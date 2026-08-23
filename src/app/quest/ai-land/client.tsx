"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  Gamepad2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import common from "../../../../locales/ru/ai-land/common.json";
import quests from "../../../../locales/ru/ai-land/quests.json";
import type {
  AiLandGameHandle,
  AiLandProgress,
  QuestStage,
} from "@/game/ai-land/types";

const STORAGE_KEY = "proektmap-ai-land-v1";
const INITIAL_PROGRESS: AiLandProgress = {
  stage: "intro",
  xp: 0,
  badges: [],
};

type Selection = Record<string, string>;

export default function AiLandClient() {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<AiLandGameHandle | null>(null);
  const [progress, setProgress] = useState<AiLandProgress>(INITIAL_PROGRESS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState<"intro" | "lesson" | "challenge" | "result">("intro");
  const [selection, setSelection] = useState<Selection>({});
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress({ ...INITIAL_PROGRESS, ...JSON.parse(saved) });
    } catch {
      // Повреждённое локальное сохранение не должно ломать игру.
    } finally {
      setProgressLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, progressLoaded]);

  useEffect(() => {
    let cancelled = false;
    if (!mountRef.current || !progressLoaded) return;

    import("@/game/ai-land/create-game").then(({ createAiLandGame }) => {
      if (cancelled || !mountRef.current) return;
      gameRef.current = createAiLandGame(
        mountRef.current,
        {
          onRobotInteraction: () => {
            setPanelOpen(true);
            setDialogStep("intro");
            setProgress((current) => ({ ...current, stage: "talk" }));
            gameRef.current?.setPaused(true);
          },
          onBridgeReached: () => {
            setProgress((current) => ({ ...current, stage: "done" }));
          },
        },
        progress.stage === "reward" || progress.stage === "done",
      );
      setGameReady(true);
    });

    return () => {
      cancelled = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, [progressLoaded]);

  const parts = useMemo(
    () =>
      quests.parts.map((part, index) => ({
        ...part,
        options: index % 2 === 0 ? part.options : [...part.options].reverse(),
      })),
    [],
  );

  const choose = (partId: string, optionId: string) => {
    setSelection((current) => ({ ...current, [partId]: optionId }));
    setChecked(false);
  };

  const checkPrompt = () => {
    const complete = parts.every((part) => selection[part.id]);
    const correct =
      complete &&
      parts.every((part) =>
        part.options.find(
          (option) =>
            option.id === selection[part.id] && option.correct,
        ),
      );
    setChecked(true);
    setSuccess(Boolean(correct));
    setDialogStep("result");
    setProgress((current) => ({
      ...current,
      stage: correct ? "result" : "challenge",
    }));
  };

  const openBridge = () => {
    gameRef.current?.openBridge();
    gameRef.current?.setPaused(false);
    setPanelOpen(false);
    setProgress({
      stage: "reward",
      xp: Math.max(progress.xp, 120),
      badges: progress.badges.includes(common.badge)
        ? progress.badges
        : [...progress.badges, common.badge],
    });
  };

  const closePanel = () => {
    gameRef.current?.setPaused(false);
    setPanelOpen(false);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px)",
        background: "#102f25",
        color: "#f7fbf8",
        padding: "20px",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/sandbox"
              aria-label={common.back}
              style={{
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#f7fbf8",
              }}
            >
              <ArrowLeft size={19} />
            </Link>
            <div>
              <div
                style={{
                  color: "#6ee7b7",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {common.level}
              </div>
              <h1
                style={{
                  margin: "3px 0 0",
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(24px, 4vw, 36px)",
                  lineHeight: 1,
                }}
              >
                {common.title}
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                padding: "9px 14px",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {progress.xp} {common.xp}
            </div>
            <button
              type="button"
              onClick={reset}
              title="Начать уровень заново"
              style={iconButtonStyle}
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 260px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "#0b211a",
          }}
          className="ai-land-layout"
        >
          <div style={{ minWidth: 0, position: "relative" }}>
            <div
              ref={mountRef}
              aria-label="Игровое поле AI Forest"
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                background: "#bfe8d1",
              }}
            />
            {!gameReady && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "#173f31",
                  background: "#bfe8d1",
                  fontWeight: 700,
                }}
              >
                Загружаем AI Forest…
              </div>
            )}
          </div>

          <aside
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.18)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <div style={eyebrowStyle}>ЗАДАНИЕ</div>
              <p style={{ margin: "8px 0 0", lineHeight: 1.55, fontSize: 14 }}>
                {common.mission}
              </p>
            </div>
            <div>
              <div style={eyebrowStyle}>УПРАВЛЕНИЕ</div>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.55,
                  fontSize: 13,
                }}
              >
                {common.controls}
              </p>
            </div>
            {progress.badges.length > 0 && (
              <div
                style={{
                  marginTop: "auto",
                  borderTop: "1px solid rgba(255,255,255,0.16)",
                  paddingTop: 18,
                }}
              >
                <div style={eyebrowStyle}>НАГРАДА</div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 9,
                    color: "#6ee7b7",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  <Sparkles size={17} /> {common.badge}
                </div>
              </div>
            )}
          </aside>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.4fr",
            gap: 8,
            marginTop: 10,
            maxWidth: 620,
          }}
          className="ai-land-mobile-controls"
        >
          <HoldButton
            label={common.mobileLeft}
            icon={<ArrowLeft size={22} />}
            onChange={(active) => gameRef.current?.setMoveLeft(active)}
          />
          <HoldButton
            label={common.mobileRight}
            icon={<ArrowRight size={22} />}
            onChange={(active) => gameRef.current?.setMoveRight(active)}
          />
          <button
            type="button"
            onClick={() => gameRef.current?.interact()}
            style={controlButtonStyle}
          >
            <Gamepad2 size={21} /> {common.mobileAction}
          </button>
        </div>
      </div>

      {panelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Разговор с роботом Роби"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "grid",
            placeItems: "center",
            padding: 18,
            background: "rgba(5,20,15,0.82)",
          }}
        >
          <div
            style={{
              width: "min(760px, 100%)",
              maxHeight: "90dvh",
              overflowY: "auto",
              background: "#f7fbf8",
              color: "#15352b",
              border: "4px solid #0fb880",
              padding: "clamp(20px, 4vw, 34px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  display: "grid",
                  placeItems: "center",
                  background: "#15352b",
                  color: "#6ee7b7",
                }}
              >
                <Bot size={26} />
              </div>
              <div>
                <div style={eyebrowDarkStyle}>ПЕРСОНАЖ</div>
                <strong>{quests.robot.name}</strong>
              </div>
            </div>

            {dialogStep === "intro" && (
              <DialogText
                text={quests.robot.intro}
                button="Слушаю"
                onNext={() => setDialogStep("lesson")}
              />
            )}

            {dialogStep === "lesson" && (
              <DialogText
                text={quests.robot.lesson}
                button="Собрать команду"
                onNext={() => {
                  setDialogStep("challenge");
                  setProgress((current) => ({
                    ...current,
                    stage: "challenge",
                  }));
                }}
              />
            )}

            {(dialogStep === "challenge" || dialogStep === "result") && (
              <>
                <h2
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "var(--font-heading)",
                    fontSize: 25,
                  }}
                >
                  {quests.robot.challengeTitle}
                </h2>
                <p
                  style={{
                    margin: "0 0 20px",
                    color: "#587067",
                    lineHeight: 1.55,
                  }}
                >
                  {quests.robot.challengeHint}
                </p>

                <div style={{ display: "grid", gap: 15 }}>
                  {parts.map((part) => (
                    <div key={part.id}>
                      <div style={eyebrowDarkStyle}>{part.label}</div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: 8,
                          marginTop: 6,
                        }}
                      >
                        {part.options.map((option) => {
                          const selected = selection[part.id] === option.id;
                          const wrong = checked && selected && !option.correct;
                          return (
                            <button
                              type="button"
                              key={option.id}
                              onClick={() => choose(part.id, option.id)}
                              style={{
                                padding: "11px 13px",
                                border: `2px solid ${
                                  wrong
                                    ? "#c84d45"
                                    : selected
                                      ? "#0fb880"
                                      : "#cad8d2"
                                }`,
                                background: selected ? "#e2f7ef" : "#ffffff",
                                color: "#15352b",
                                textAlign: "left",
                                cursor: "pointer",
                                fontWeight: selected ? 700 : 500,
                                lineHeight: 1.35,
                              }}
                            >
                              {option.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {checked && (
                  <div
                    style={{
                      marginTop: 18,
                      padding: 14,
                      background: success ? "#dff7ea" : "#fff0ed",
                      borderLeft: `4px solid ${success ? "#0fb880" : "#c84d45"}`,
                      lineHeight: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {success ? quests.robot.success : quests.robot.retry}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 9,
                    marginTop: 22,
                    flexWrap: "wrap",
                  }}
                >
                  {!success ? (
                    <button
                      type="button"
                      onClick={checkPrompt}
                      style={primaryButtonStyle}
                    >
                      <Check size={18} /> {quests.robot.check}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openBridge}
                      style={primaryButtonStyle}
                    >
                      {quests.robot.continue} <ArrowRight size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closePanel}
                    style={secondaryButtonStyle}
                  >
                    Вернуться в лес
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {progress.stage === "done" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Уровень пройден"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            display: "grid",
            placeItems: "center",
            padding: 18,
            background: "rgba(5,20,15,0.84)",
          }}
        >
          <div
            style={{
              width: "min(540px, 100%)",
              padding: "clamp(26px, 6vw, 48px)",
              background: "#f7fbf8",
              color: "#15352b",
              border: "4px solid #0fb880",
              textAlign: "center",
            }}
          >
            <Sparkles size={42} color="#0b8f63" />
            <div style={{ ...eyebrowDarkStyle, marginTop: 18 }}>
              AI FOREST · МИССИЯ ВЫПОЛНЕНА
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(28px, 6vw, 42px)",
                lineHeight: 1.05,
                margin: "9px 0 14px",
              }}
            >
              Ты открыл мост!
            </h2>
            <p style={{ lineHeight: 1.65, margin: "0 auto 22px", maxWidth: 420 }}>
              Теперь ты знаешь: ИИ не читает мысли. Хорошая команда объясняет,
              кто он, что сделать, для кого, в каком виде и с какими
              ограничениями.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: "#dff7ea",
                color: "#0b6b4b",
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              <Sparkles size={18} /> +120 XP · {common.badge}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 9,
                flexWrap: "wrap",
              }}
            >
              <button type="button" onClick={reset} style={secondaryButtonStyle}>
                Пройти ещё раз
              </button>
              <Link
                href="/sandbox"
                style={{
                  ...primaryButtonStyle,
                  textDecoration: "none",
                }}
              >
                Вернуться в Песочницу <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 840px) {
          .ai-land-layout { grid-template-columns: 1fr !important; }
          .ai-land-layout aside { border-left: 0 !important; border-top: 1px solid rgba(255,255,255,0.18); }
        }
        @media (min-width: 841px) {
          .ai-land-mobile-controls { display: none !important; }
        }
      `}</style>
    </main>
  );
}

function DialogText({
  text,
  button,
  onNext,
}: {
  text: string;
  button: string;
  onNext: () => void;
}) {
  return (
    <>
      <p style={{ fontSize: 19, lineHeight: 1.65, margin: "0 0 24px" }}>
        {text}
      </p>
      <button type="button" onClick={onNext} style={primaryButtonStyle}>
        {button} <ArrowRight size={18} />
      </button>
    </>
  );
}

function HoldButton({
  label,
  icon,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  onChange: (active: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        onChange(true);
      }}
      onPointerUp={() => onChange(false)}
      onPointerCancel={() => onChange(false)}
      onPointerLeave={() => onChange(false)}
      style={controlButtonStyle}
    >
      {icon} {label}
    </button>
  );
}

const eyebrowStyle: React.CSSProperties = {
  color: "#6ee7b7",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.12em",
};

const eyebrowDarkStyle: React.CSSProperties = {
  color: "#538172",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const iconButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  display: "grid",
  placeItems: "center",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#f7fbf8",
  cursor: "pointer",
};

const controlButtonStyle: React.CSSProperties = {
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "#183d30",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  touchAction: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 18px",
  border: "none",
  background: "#0b8f63",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  border: "1px solid #b9ccc5",
  background: "#ffffff",
  color: "#15352b",
  fontWeight: 700,
  cursor: "pointer",
};
