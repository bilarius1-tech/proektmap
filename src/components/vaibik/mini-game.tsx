"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import QuestBackground from "@/components/vaibik/quest-background";
import { playError, playPop, playWin } from "@/lib/vaibik/quest-audio";
import { getAction, getTheme } from "@/lib/vaibik/quest-choices";
import { getLine } from "@/lib/vaibik/quest-lines";
import { cn } from "@/lib/vaibik/utils";
import { Sparkles, Star, X, type LucideIcon } from "lucide-react";

type Phase = "play" | "celebrate" | "hint" | "done";

const MISSION_LABEL = "МИССИЯ 4/6";
const START_PROGRESS = 50;
const DONE_PROGRESS = 66.6;

interface StaticItem {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface MovingObj {
  id: number;
  x: number;
  y: number;
  dir: number;
  speed: number;
  kind: "enemy" | "minus";
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

const TOTAL_STARS = 10;
const TARGET_MISSED = 8;
const TARGET_POINTS = 8;

const GOOD_POSITIONS: Array<[number, number]> = [
  [16, 22],
  [38, 14],
  [62, 18],
  [82, 30],
  [26, 42],
  [52, 36],
  [76, 54],
  [22, 68],
  [46, 58],
  [68, 74],
];

const BURST_COLORS = ["#fbbf24", "#f472b6", "#a5b4fc", "#34d399", "#fda4af"];

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

interface MiniGameProps {
  themeId?: string;
  actionId?: string;
  onComplete?: () => void;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function MiniGame({
  themeId = "space",
  actionId = "stars",
  onComplete,
}: MiniGameProps) {
  const theme = getTheme(themeId);
  const action = getAction(actionId);
  const CollectIcon = action.collectIcon;
  const mode = action.id;

  const movingMode = mode === "aliens" || mode === "score";

  const [phase, setPhase] = useState<Phase>("play");
  const [collected, setCollected] = useState<number[]>([]);
  const [missed, setMissed] = useState(0);
  const [minusHits, setMinusHits] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [rewarded, setRewarded] = useState(false);
  const [progress, setProgress] = useState(START_PROGRESS);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [hero, setHero] = useState({ x: 50, y: 82 });
  const [dragging, setDragging] = useState(false);
  const timers = useRef<number[]>([]);
  const heroRef = useRef({ x: 50, y: 82 });
  const objsRef = useRef<MovingObj[]>([]);
  const nextId = useRef(100);
  const spawnCounter = useRef(0);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [, force] = useReducer((x: number) => x + 1, 0);

  const staticGoods = useMemo<StaticItem[]>(() => {
    const count = mode === "stars" ? TOTAL_STARS : TARGET_POINTS;
    return GOOD_POSITIONS.slice(0, count).map(([x, y], i) => ({
      id: i,
      x,
      y,
      delay: (i % 5) * 0.12,
    }));
  }, [mode]);

  const points = Math.max(0, collected.length - minusHits);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (phase !== "play") return;
    let won = false;
    if (mode === "stars") won = collected.length >= TOTAL_STARS;
    else if (mode === "aliens") won = missed >= TARGET_MISSED;
    else won = points >= TARGET_POINTS;
    if (!won) return;
    playWin();
    const t1 = window.setTimeout(() => {
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
      setPhase("celebrate");
    }, 150);
    timers.current.push(t1);
    return () => clearTimeout(t1);
  }, [phase, mode, collected.length, missed, points]);

  useEffect(() => {
    if (phase !== "celebrate") return;
    const t = window.setTimeout(() => setPhase("hint"), 5800);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "hint" || rewarded) return;
    const t = window.setTimeout(() => {
      setRewarded(true);
      setProgress(DONE_PROGRESS);
    }, 900);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, rewarded]);

  useEffect(() => {
    if (phase !== "hint" || !rewarded || !onComplete) return;
    const t = window.setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 5800);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, rewarded, onComplete]);

  const collides = useCallback(
    (ox: number, oy: number, hx: number, hy: number) => {
      const dx = ox - hx;
      const dy = oy - hy;
      return Math.hypot(dx, dy) < 9;
    },
    []
  );

  useEffect(() => {
    if (!movingMode || phase !== "play") return;
    spawnCounter.current = 0;
    const interval = window.setInterval(() => {
      spawnCounter.current++;
      let toSpawn: MovingObj | null = null;
      if (spawnCounter.current % 34 === 0) {
        const fromLeft = Math.random() > 0.5;
        const y = 14 + Math.random() * 68;
        toSpawn = {
          id: nextId.current++,
          x: fromLeft ? -8 : 108,
          y,
          dir: fromLeft ? 1 : -1,
          speed: 1.1 + Math.random() * 0.9,
          kind: mode === "score" ? "minus" : "enemy",
        };
      }
      const current = objsRef.current;
      const next: MovingObj[] = [];
      let missDelta = 0;
      let hit = false;
      const h = heroRef.current;
      for (const o of current) {
        const nx = o.x + o.dir * o.speed;
        if (collides(nx, o.y, h.x, h.y)) {
          hit = true;
          continue;
        }
        if (nx < -12 || nx > 112) {
          if (o.kind === "enemy") missDelta++;
          continue;
        }
        next.push({ ...o, x: nx });
      }
      if (toSpawn) next.push(toSpawn);
      if (missDelta) setMissed((m) => m + missDelta);
      if (hit) {
        if (mode === "score") setMinusHits((m) => m + 1);
        playError();
      }
      const changed =
        next.length !== current.length ||
        next.some((o, i) => current[i] && o.x !== current[i].x);
      objsRef.current = next;
      if (changed) force();
    }, 40);
    return () => clearInterval(interval);
  }, [movingMode, mode, phase, collides]);

  const setHeroFromPointer = useCallback((clientX: number, clientY: number) => {
    const el = fieldRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 6, 94);
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 8, 92);
    heroRef.current = { x, y };
    setHero({ x, y });
  }, []);

  const handleDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!movingMode) return;
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setHeroFromPointer(e.clientX, e.clientY);
    },
    [movingMode, setHeroFromPointer]
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setHeroFromPointer(e.clientX, e.clientY);
    },
    [dragging, setHeroFromPointer]
  );

  const handleUp = useCallback(() => setDragging(false), []);

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
    (item: StaticItem) => {
      if (phase !== "play") return;
      if (collected.includes(item.id)) return;
      playPop();
      setCollected((c) => [...c, item.id]);
      addBurst(Date.now() + item.id, item.x, item.y);
    },
    [phase, collected, addBurst]
  );

  const scoreLabel =
    mode === "aliens" ? "ПРОПУЩЕНО" : mode === "score" ? "ОЧКИ" : "СЧЁТ";
  const scoreValue =
    mode === "stars"
      ? `${collected.length}/${TOTAL_STARS}`
      : mode === "aliens"
        ? `${missed}/${TARGET_MISSED}`
        : `${points}/${TARGET_POINTS}`;

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-8">
      <QuestBackground kind="game" />
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
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm font-semibold tracking-[0.25em] text-indigo-200/80">
            {scoreLabel}
          </span>
          <div className="flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/15 px-4 py-1.5 shadow-[0_0_24px_-6px_rgba(251,191,36,0.7)]">
            <CollectIcon className={cn("h-4 w-4", action.collectColor)} />
            <span
              key={scoreValue}
              className="text-lg font-bold tabular-nums text-amber-200 animate-in zoom-in duration-300"
            >
              {scoreValue}
            </span>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-[2rem] border border-indigo-300/30 bg-gradient-to-b from-[#0b1026] via-[#201a52] to-[#3a1f6e] shadow-[0_20px_70px_-20px_rgba(91,42,134,0.9)]">
          <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_20%_20%,rgba(255,255,255,0.5)_50%,transparent_50%),radial-gradient(1.5px_1.5px_at_75%_30%,rgba(255,255,255,0.4)_50%,transparent_50%),radial-gradient(1px_1px_at_45%_70%,rgba(255,255,255,0.5)_50%,transparent_50%),radial-gradient(1px_1px_at_85%_80%,rgba(255,255,255,0.4)_50%,transparent_50%)] bg-[length:100%_100%]" />

          <div
            ref={fieldRef}
            className="relative aspect-[16/10] w-full select-none sm:aspect-[16/9]"
            style={{ touchAction: movingMode ? "none" : undefined }}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleUp}
          >
            {mode === "stars" ? (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                {theme.id === "space" ? (
                  <Rocket />
                ) : (
                  <Hero icon={theme.heroIcon} />
                )}
              </div>
            ) : (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${hero.x}%`, top: `${hero.y}%` }}
              >
                {theme.id === "space" ? (
                  <Rocket />
                ) : (
                  <Hero icon={theme.heroIcon} />
                )}
              </div>
            )}

            {staticGoods.map((item) => {
              const isCollected = collected.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label="Собрать бонус"
                  onClick={() => collect(item)}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                    isCollected
                      ? "pointer-events-none scale-0 opacity-0"
                      : "scale-100 opacity-100",
                    !isCollected &&
                      "cursor-pointer hover:scale-125 active:scale-90"
                  )}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transitionDelay: isCollected ? "0ms" : `${item.delay}ms`,
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

            {objsRef.current.map((o) => (
              <div
                key={o.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${o.x}%`, top: `${o.y}%` }}
              >
                {o.kind === "minus" ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-red-400/70 bg-red-500/20 shadow-[0_0_18px_-4px_rgba(248,113,113,0.9)]">
                    <X className="h-6 w-6 text-red-300" strokeWidth={3} />
                  </div>
                ) : (
                  <CollectIcon
                    className={cn(
                      "h-10 w-10 animate-bob drop-shadow-[0_0_14px_rgba(232,121,249,0.9)]",
                      action.collectColor
                    )}
                    style={{ fill: action.collectFill }}
                    strokeWidth={1}
                  />
                )}
              </div>
            ))}

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

            {(phase === "celebrate" ||
              phase === "hint" ||
              phase === "done") && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
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
                    Получилось!
                  </h2>
                  <p className="text-lg text-indigo-100/90">
                    {action.celebrate}
                  </p>
                </div>
              </div>
            )}

            {(phase === "hint" || phase === "done") && (
              <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center px-6">
                <div className="max-w-md rounded-2xl border border-fuchsia-300/50 bg-slate-900/85 px-5 py-4 text-center shadow-[0_0_40px_-8px_rgba(217,70,239,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <p className="text-base font-semibold leading-snug text-white">
                    {getLine("game.hint")}
                  </p>
                </div>
              </div>
            )}

            {rewarded && (
              <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-400/20 px-3 py-1.5 text-sm font-bold text-amber-200 animate-in fade-in zoom-in duration-500">
                <Star className="h-4 w-4 fill-amber-300" />
                +10 ⭐
              </div>
            )}
          </div>
        </div>

        {phase === "play" && (
          <p className="mt-5 max-w-md text-center text-indigo-100/80 animate-in fade-in duration-700">
            {action.instruction}
          </p>
        )}
      </div>
    </div>
  );
}
