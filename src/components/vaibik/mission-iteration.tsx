"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  playClick,
  playError,
  playPop,
  playWin,
  speak,
} from "@/lib/vaibik/quest-audio";
import SpeechNextButton from "@/components/vaibik/speech-next-button";
import { getAction, getTheme } from "@/lib/vaibik/quest-choices";
import { getLine, iterationPlay } from "@/lib/vaibik/quest-lines";
import { useSpeechAdvance } from "@/lib/vaibik/use-speech-advance";
import { cn } from "@/lib/vaibik/utils";
import {
  Ban,
  RotateCw,
  Sparkles,
  Star,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";

type Emotion = "normal" | "thinking" | "happy" | "surprised" | "confused";
type Phase = "play" | "found" | "guide" | "fixed" | "work" | "explain" | "done";

const MISSION_LABEL = "МИССИЯ 6/6";
const START_PROGRESS = 83.3;
const DONE_PROGRESS = 100;

const REACHABLE = 9;
const TOTAL = 10;

interface StarData {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface Burst {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
}

const STAR_POSITIONS: Array<[number, number]> = [
  [16, 22],
  [38, 14],
  [62, 18],
  [82, 30],
  [26, 42],
  [52, 36],
  [76, 54],
  [22, 68],
  [60, 72],
];

const BROKEN_POS = { x: 98, y: 94 };
const FIXED_POS = { x: 50, y: 86 };

const BURST_COLORS = ["#fbbf24", "#f472b6", "#a5b4fc", "#34d399", "#fda4af"];

interface Choice {
  id: "quit" | "nothing" | "explain";
  label: string;
  icon: typeof X;
}

const OPTIONS: Choice[] = [
  { id: "quit", label: "Бросить", icon: X },
  { id: "nothing", label: "Ничего не делать", icon: Ban },
  { id: "explain", label: "Объяснить ИИ", icon: Wand2 },
];

const GUIDE_LINES: Record<"quit" | "nothing", string> = {
  quit: getLine("iteration.guide.quit"),
  nothing: getLine("iteration.guide.nothing"),
};

function Vaibik({ emotion }: { emotion: Emotion }) {
  const eyeOpen = emotion === "happy" ? "M50 60 Q64 46 78 60" : undefined;
  const eyeOpen2 = emotion === "happy" ? "M86 60 Q100 46 114 60" : undefined;
  const surprised = emotion === "surprised";
  const thinking = emotion === "thinking";
  const confused = emotion === "confused";

  return (
    <div className="relative">
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-transparent blur-2xl animate-pulse" />
      <div className="absolute -inset-4 rounded-full border-2 border-indigo-300/40 animate-pulse" />
      <svg
        viewBox="0 0 160 160"
        className="relative h-40 w-40 sm:h-48 sm:w-48 drop-shadow-[0_0_28px_rgba(168,85,247,0.7)]"
        role="img"
        aria-label="Голограмма робота Вайбика"
      >
        <circle cx="80" cy="92" r="78" fill="url(#hologlow)" opacity="0.35" />
        <defs>
          <radialGradient id="hologlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a21caf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="animate-pulse">
          <line
            x1="80"
            y1="22"
            x2="80"
            y2="6"
            stroke="#a5b4fc"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="80" cy="5" r="5" fill="#fbbf24">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        {confused && (
          <text x="124" y="40" fontSize="30" fontWeight="bold" fill="#fbbf24">
            ?
          </text>
        )}
        <rect x="34" y="20" width="92" height="86" rx="24" fill="#7c6cf0" />
        <rect
          x="40"
          y="26"
          width="80"
          height="74"
          rx="18"
          fill="#8f83f5"
          opacity="0.9"
        />
        {eyeOpen ? (
          <>
            <path
              d={eyeOpen}
              stroke="#312e81"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={eyeOpen2}
              stroke="#312e81"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle cx="64" cy="58" r={surprised ? 13 : 11} fill="#ffffff">
              <animate
                attributeName="ry"
                values={surprised ? "13" : "11;3;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values={surprised ? "13" : "11;14;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="100" cy="58" r={surprised ? 13 : 11} fill="#ffffff">
              <animate
                attributeName="ry"
                values={surprised ? "13" : "11;3;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values={surprised ? "13" : "11;14;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="66" cy="60" r="4" fill="#312e81" />
            <circle cx="102" cy="60" r="4" fill="#312e81" />
            {(thinking || confused) && (
              <path
                d={confused ? "M46 46 L64 42" : "M48 42 L64 46"}
                stroke="#312e81"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
          </>
        )}
        {surprised ? (
          <ellipse cx="82" cy="90" rx="8" ry="9" fill="#312e81" />
        ) : eyeOpen ? (
          <path d="M60 88 Q82 108 104 88 Z" fill="#312e81" />
        ) : thinking || confused ? (
          <path
            d="M70 92 Q82 86 94 92"
            stroke="#312e81"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M62 92 Q82 106 100 92"
            stroke="#312e81"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        <rect x="64" y="108" width="34" height="24" rx="12" fill="#f59e0b" />
        <rect x="46" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
        <rect x="106" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
      </svg>
    </div>
  );
}

function Hero({ icon }: { icon: LucideIcon }) {
  const ThemedIcon = icon;
  return (
    <div className="flex items-end justify-center">
      <div className="relative">
        <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-transparent blur-2xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-slate-900/70 text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.8)] backdrop-blur-sm sm:h-24 sm:w-24">
          <ThemedIcon className="h-12 w-12 animate-bob sm:h-14 sm:w-14" />
        </div>
      </div>
    </div>
  );
}

function Rocket() {
  return (
    <svg
      viewBox="0 0 120 160"
      className="h-24 w-auto sm:h-28"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rocketBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <g className="animate-bob">
        <path
          d="M60 8 L92 64 Q92 100 76 112 L44 112 Q28 100 28 64 Z"
          fill="url(#rocketBody)"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <path
          d="M60 12 Q78 40 78 66 L60 66 L42 66 Q42 40 60 12 Z"
          fill="#60a5fa"
          opacity="0.9"
        />
        <circle cx="60" cy="52" r="9" fill="#38bdf8" />
        <path
          d="M44 112 L36 140 Q52 126 60 140 Q68 126 84 140 L76 112 Z"
          fill="#f59e0b"
        />
        <path d="M76 112 L88 132 Q80 122 76 124 L76 108 Z" fill="#f87171" />
        <path d="M44 112 L32 132 Q40 122 44 124 L44 108 Z" fill="#f87171" />
        <path
          d="M36 40 Q16 34 10 8 Q40 12 44 30 Z"
          fill="#a5b4fc"
          stroke="#818cf8"
          strokeWidth="2"
        />
        <path
          d="M84 40 Q104 34 110 8 Q80 12 76 30 Z"
          fill="#a5b4fc"
          stroke="#818cf8"
          strokeWidth="2"
        />
        <path d="M60 60 L66 108 L54 108 Z" fill="#cbd5e1" />
        <path
          d="M60 140 L72 156 L60 152 L48 156 Z"
          fill="#fbbf24"
          opacity="0.9"
        />
      </g>
      <g className="animate-flame">
        <path
          d="M52 156 Q60 146 68 156 Q62 168 60 168 Q58 168 52 156 Z"
          fill="#fbbf24"
        />
        <path
          d="M56 158 Q60 150 64 158 Q62 166 60 166 Q58 166 56 158 Z"
          fill="#fb923c"
        />
      </g>
    </svg>
  );
}

interface MissionIterationProps {
  themeId?: string;
  actionId?: string;
  onComplete?: () => void;
}

export default function MissionIteration({
  themeId = "space",
  actionId = "stars",
  onComplete,
}: MissionIterationProps) {
  const theme = getTheme(themeId);
  const action = getAction(actionId);
  const CollectIcon = action.collectIcon;
  const [phase, setPhase] = useState<Phase>("play");
  const [collected, setCollected] = useState<number[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [returned, setReturned] = useState(false);
  const [wobble, setWobble] = useState(false);
  const [guideId, setGuideId] = useState<"quit" | "nothing" | null>(null);
  const [rewarded, setRewarded] = useState(false);
  const [progress, setProgress] = useState(START_PROGRESS);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [stars] = useState<StarData[]>(() =>
    STAR_POSITIONS.map(([x, y], i) => ({ id: i, x, y, delay: (i % 5) * 0.12 }))
  );
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (phase !== "play" || collected.length !== REACHABLE) return;
    const t = window.setTimeout(() => setPhase("found"), 1400);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, collected]);

  useEffect(() => {
    if (phase !== "work" || rewarded) return;
    const t = window.setTimeout(() => {
      setRewarded(true);
      setProgress(DONE_PROGRESS);
    }, 1200);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, rewarded]);

  useEffect(() => {
    if (phase !== "work" || !rewarded) return;
    const t = window.setTimeout(() => setPhase("explain"), 5800);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, rewarded]);

  // Речевой шлюз: этап «Итерация» (объяснение) переходит к финалу только после
  // того, как Вайбик дочитал реплику (или по тайм-ауту / кнопке «Дальше»).
  const explainGate = useSpeechAdvance({
    text: phase === "explain" ? getLine("iteration.explain") : "",
    advance: () => {
      setPhase("done");
      onComplete?.();
    },
    fallbackMs: 18000,
    minWaitMs: 2500,
    active: phase === "explain" && !!onComplete,
    deps: [phase],
  });

  const addBurst = useCallback((id: number, x: number, y: number) => {
    setBursts((b) => [...b, { id, x, y }]);
    setParticles((p) => [
      ...p,
      ...Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return {
          id: id + i,
          x,
          y,
          dx: Math.cos(angle) * 34,
          dy: Math.sin(angle) * 34,
          color: BURST_COLORS[(id + i) % BURST_COLORS.length],
          size: 5 + Math.random() * 5,
        };
      }),
    ]);
    const t = window.setTimeout(() => {
      setBursts((b) => b.filter((burst) => burst.id !== id));
      setParticles((p) =>
        p.filter((part) => part.id < id || part.id >= id + 8)
      );
    }, 1200);
    timers.current.push(t);
  }, []);

  const collect = useCallback(
    (star: StarData) => {
      if (collected.includes(star.id)) return;
      if (phase === "play" && star.id === 9) return;
      playPop();
      setCollected((c) => [...c, star.id]);
      addBurst(Date.now() + star.id, star.x, star.y);

      if (phase === "fixed" && star.id === 9) {
        const t = window.setTimeout(() => {
          playWin();
          setConfetti(
            Array.from({ length: 44 }, (_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const dist = 80 + Math.random() * 160;
              return {
                id: i,
                x: 50,
                y: 50,
                dx: Math.cos(angle) * dist,
                dy: Math.sin(angle) * dist - 40,
                color: BURST_COLORS[i % BURST_COLORS.length],
                size: 6 + Math.random() * 6,
              };
            })
          );
          setPhase("work");
        }, 450);
        timers.current.push(t);
      }
    },
    [phase, collected, addBurst]
  );

  const pickWrong = (id: "quit" | "nothing") => {
    if (phase !== "found" && phase !== "guide") return;
    playError();
    setGuideId(id);
    setPhase("guide");
  };

  const pickExplain = () => {
    if (phase !== "found" && phase !== "guide") return;
    playClick();
    setPhase("fixed");
    const t = window.setTimeout(() => setReturned(true), 1500);
    timers.current.push(t);
  };

  const brokenClick = () => {
    if (phase !== "play") return;
    playError();
    setWobble(true);
    const t = window.setTimeout(() => setWobble(false), 600);
    timers.current.push(t);
  };

  const showOptions = phase === "found" || phase === "guide";
  const score = collected.length;
  const brokenCollected = collected.includes(9);

  const dialogLine = (): { text: string; emotion: Emotion } => {
    switch (phase) {
      case "play":
        return {
          text: iterationPlay(action.collectible),
          emotion: "happy",
        };
      case "found":
        return {
          text: getLine("iteration.found"),
          emotion: "confused",
        };
      case "guide":
        return {
          text: guideId
            ? GUIDE_LINES[guideId]
            : getLine("iteration.guide.default"),
          emotion: "thinking",
        };
      case "fixed":
        return {
          text: getLine("iteration.fixed"),
          emotion: "happy",
        };
      case "work":
        return { text: getLine("iteration.work"), emotion: "happy" };
      case "explain":
        return {
          text: getLine("iteration.explain"),
          emotion: "thinking",
        };
      case "done":
        return { text: getLine("iteration.done"), emotion: "happy" };
    }
  };

  const line = dialogLine();

  useEffect(() => {
    if (!line?.text || phase === "explain") return;
    speak(line.text);
  }, [line?.text, phase]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 cosmic-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="mb-6 flex w-full max-w-sm flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="text-xs font-semibold tracking-[0.3em] text-indigo-200/80">
            {MISSION_LABEL}
          </span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {rewarded && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-300 animate-in fade-in zoom-in duration-500">
              <Star className="h-4 w-4 fill-amber-300" />
              +10 звёзд
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm font-semibold tracking-[0.25em] text-indigo-200/80">
            СЧЁТ
          </span>
          <div className="flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/15 px-4 py-1.5 shadow-[0_0_24px_-6px_rgba(251,191,36,0.7)]">
            <CollectIcon className={cn("h-4 w-4", action.collectColor)} />
            <span
              key={score}
              className="text-lg font-bold tabular-nums text-amber-200 animate-in zoom-in duration-300"
            >
              {score}/{TOTAL}
            </span>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-[2rem] border border-indigo-300/30 bg-gradient-to-b from-[#0b1026] via-[#201a52] to-[#3a1f6e] shadow-[0_20px_70px_-20px_rgba(91,42,134,0.9)]">
          <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_20%_20%,rgba(255,255,255,0.5)_50%,transparent_50%),radial-gradient(1.5px_1.5px_at_75%_30%,rgba(255,255,255,0.4)_50%,transparent_50%),radial-gradient(1px_1px_at_45%_70%,rgba(255,255,255,0.5)_50%,transparent_50%),radial-gradient(1px_1px_at_85%_80%,rgba(255,255,255,0.4)_50%,transparent_50%)] bg-[length:100%_100%]" />

          <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              {theme.id === "space" ? (
                <Rocket />
              ) : (
                <Hero icon={theme.heroIcon} />
              )}
            </div>

            {stars.map((star) => {
              const isCollected = collected.includes(star.id);
              return (
                <button
                  key={star.id}
                  type="button"
                  aria-label="Собрать элемент"
                  onClick={() => collect(star)}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                    isCollected
                      ? "pointer-events-none scale-0 opacity-0"
                      : "scale-100 opacity-100",
                    !isCollected &&
                      "cursor-pointer hover:scale-125 active:scale-90"
                  )}
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    transitionDelay: isCollected ? "0ms" : `${star.delay}ms`,
                  }}
                >
                  <CollectIcon
                    className={cn(
                      "h-9 w-9 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] animate-in fade-in zoom-in duration-500",
                      action.collectColor
                    )}
                    style={{ fill: action.collectFill }}
                    strokeWidth={1}
                  />
                </button>
              );
            })}

            {!brokenCollected && (
              <button
                type="button"
                aria-label="Элемент за пределами поля"
                onClick={() =>
                  returned
                    ? collect({
                        id: 9,
                        x: FIXED_POS.x,
                        y: FIXED_POS.y,
                        delay: 0,
                      })
                    : brokenClick()
                }
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out",
                  wobble && "animate-shake",
                  returned
                    ? "cursor-pointer hover:scale-125 active:scale-90"
                    : "cursor-not-allowed"
                )}
                style={{
                  left: returned ? `${FIXED_POS.x}%` : `${BROKEN_POS.x}%`,
                  top: returned ? `${FIXED_POS.y}%` : `${BROKEN_POS.y}%`,
                }}
              >
                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-full p-1",
                    returned
                      ? "bg-transparent"
                      : "border-2 border-dashed border-red-400/80 bg-red-500/10"
                  )}
                >
                  <CollectIcon
                    className={cn(
                      "h-9 w-9 transition-all duration-500",
                      returned
                        ? cn(
                            "drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]",
                            action.collectColor
                          )
                        : "text-slate-500 opacity-70"
                    )}
                    style={
                      returned
                        ? { fill: action.collectFill }
                        : { fill: "#475569" }
                    }
                    strokeWidth={1}
                  />
                  {!returned && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      !
                    </span>
                  )}
                </div>
              </button>
            )}

            {bursts.map((burst) => (
              <div
                key={burst.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
              >
                <div className="h-20 w-20 animate-ping rounded-full bg-amber-300/60" />
              </div>
            ))}

            {particles.map((part) => (
              <span
                key={part.id}
                className="pointer-events-none absolute h-2 w-2 rounded-full animate-particle"
                style={
                  {
                    left: `${part.x}%`,
                    top: `${part.y}%`,
                    backgroundColor: part.color,
                    "--dx": `${part.dx}px`,
                    "--dy": `${part.dy}px`,
                    width: part.size,
                    height: part.size,
                  } as React.CSSProperties
                }
              />
            ))}

            {confetti.length > 0 && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                {confetti.map((c) => (
                  <span
                    key={c.id}
                    className="pointer-events-none absolute h-2 w-2 animate-confetti"
                    style={
                      {
                        left: "50%",
                        top: "50%",
                        backgroundColor: c.color,
                        "--dx": `${c.dx}px`,
                        "--dy": `${c.dy}px`,
                        width: c.size,
                        height: c.size,
                      } as React.CSSProperties
                    }
                  />
                ))}
                <div className="relative flex flex-col items-center gap-3 px-6 text-center animate-in zoom-in duration-700">
                  <Sparkles className="h-10 w-10 text-amber-300" />
                  <h2 className="text-4xl font-bold text-white sm:text-5xl">
                    Работает!
                  </h2>
                  <p className="text-lg text-indigo-100/90">
                    Все предметы на месте! 🎉
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-6 flex w-full max-w-md flex-col items-center animate-in fade-in duration-700">
          <Vaibik emotion={line.emotion} />
          <div
            key={line.text}
            className="relative z-10 mt-2 max-w-md rounded-3xl border border-white/20 bg-slate-900/85 px-6 py-4 text-center text-lg font-semibold text-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-400"
          >
            {line.text}
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-slate-900/85" />
          </div>
        </div>

        {showOptions && (
          <div className="mt-8 grid w-full max-w-2xl gap-4 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isExplain = opt.id === "explain";
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    opt.id === "explain" ? pickExplain() : pickWrong(opt.id)
                  }
                  className={cn(
                    "card-hover flex flex-col items-center gap-3 rounded-3xl border px-4 py-5 backdrop-blur-md transition-all duration-300",
                    isExplain
                      ? "border-amber-300/70 bg-gradient-to-br from-amber-400/25 to-orange-500/25 shadow-[0_0_30px_-8px_rgba(251,191,36,0.8)]"
                      : "border-white/15 bg-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                      isExplain
                        ? "from-amber-400 to-orange-500"
                        : "from-indigo-500/80 to-blue-500/80"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center text-base font-bold text-white">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {phase === "explain" && (
          <div className="mt-8 w-full max-w-md rounded-3xl border border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-500/20 via-indigo-500/20 to-transparent p-[1px] animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-slate-900/70 px-6 py-7 text-center backdrop-blur-md shadow-[0_0_40px_-8px_rgba(217,70,239,0.8)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/30 text-fuchsia-200">
                <RotateCw className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Итерация</h2>
              <p className="text-base leading-relaxed text-indigo-100/90">
                Итерация — это повтор. Проверяешь → находишь проблему →
                объясняешь ИИ → получаешь лучше! Так улучшают игры и настоящие
                проекты.
              </p>
              <div className="mt-3 flex justify-center">
                <SpeechNextButton onNext={() => explainGate.skip()} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
