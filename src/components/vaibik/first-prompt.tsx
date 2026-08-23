"use client";

import { useEffect, useRef, useState } from "react";
import QuestBackground from "@/components/vaibik/quest-background";
import SpeechNextButton from "@/components/vaibik/speech-next-button";
import { playWin } from "@/lib/vaibik/quest-audio";
import { getAction, getTheme } from "@/lib/vaibik/quest-choices";
import { getLine } from "@/lib/vaibik/quest-lines";
import { useSpeechAdvance } from "@/lib/vaibik/use-speech-advance";
import { cn } from "@/lib/vaibik/utils";
import { Brain, Sparkles, Star, Wand2, type LucideIcon } from "lucide-react";

type Emotion = "normal" | "thinking" | "happy" | "surprised";
type Phase = "magic" | "explain" | "game";

const MISSION_LABEL = "МИССИЯ 3/6";
const START_PROGRESS = 33.3;
const DONE_PROGRESS = 50;

interface FirstPromptProps {
  themeId: string;
  actionId: string;
  onComplete?: () => void;
}

function Vaibik({ emotion }: { emotion: Emotion }) {
  const happy = emotion === "happy";
  const surprised = emotion === "surprised";
  const thinking = emotion === "thinking";
  const eyeOpen = happy ? "M50 60 Q64 46 78 60" : undefined;
  const eyeOpen2 = happy ? "M86 60 Q100 46 114 60" : undefined;

  return (
    <div className="relative">
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-transparent blur-2xl animate-pulse" />
      <div className="absolute -inset-4 rounded-full border-2 border-indigo-300/40 animate-pulse" />
      <svg
        viewBox="0 0 160 160"
        className="relative h-44 w-44 sm:h-52 sm:w-52 drop-shadow-[0_0_28px_rgba(168,85,247,0.7)]"
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
            <circle cx={surprised ? 66 : 66} cy="60" r="4" fill="#312e81" />
            <circle cx={surprised ? 102 : 102} cy="60" r="4" fill="#312e81" />
            {thinking && (
              <path
                d="M48 42 L64 46"
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
        ) : thinking ? (
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

function ChoiceChip({
  label,
  gradient,
  icon: Icon,
}: {
  label: string;
  gradient: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md shadow-[0_0_30px_-8px_rgba(139,92,246,0.8)]">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white",
          gradient
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-bold text-white">{label}</span>
    </div>
  );
}

export default function FirstPrompt({
  themeId,
  actionId,
  onComplete,
}: FirstPromptProps) {
  const [phase, setPhase] = useState<Phase>("magic");
  const [cardsIn, setCardsIn] = useState(false);
  const [merged, setMerged] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [progress, setProgress] = useState(START_PROGRESS);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const theme = getTheme(themeId);
  const action = getAction(actionId);
  const prompt = `Создай игру про ${theme.promptWord}, где нужно ${action.promptWord}`;

  useEffect(() => {
    if (phase !== "magic") return;
    const t1 = window.setTimeout(() => setCardsIn(true), 600);
    const t2 = window.setTimeout(() => setMerged(true), 2600);
    timers.current.push(t1, t2);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "game" || rewarded) return;
    const t = window.setTimeout(() => {
      setRewarded(true);
      setProgress(DONE_PROGRESS);
    }, 900);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, rewarded]);

  // Речевой шлюз: сцена переходит дальше, когда Вайбик дочитал реплику
  // (или по тайм-ауту-подстраховке, или по кнопке «Дальше»).
  const phaseGate: Record<
    Phase,
    {
      active: boolean;
      text: string;
      advance: () => void;
      fallbackMs: number;
      minWaitMs: number;
    }
  > = {
    magic: {
      active: true,
      text: getLine("prompt.magic"),
      advance: () => setPhase("explain"),
      fallbackMs: 15000,
      minWaitMs: 5000,
    },
    explain: {
      active: true,
      text: getLine("prompt.explain"),
      advance: () => setPhase("game"),
      fallbackMs: 14000,
      minWaitMs: 3500,
    },
    game: {
      active: true,
      text: getLine("prompt.game"),
      advance: () => onComplete?.(),
      fallbackMs: 13000,
      minWaitMs: 3500,
    },
  };

  const gate = phaseGate[phase];
  const { skip } = useSpeechAdvance({
    text: gate.text,
    advance: gate.advance,
    fallbackMs: gate.fallbackMs,
    minWaitMs: gate.minWaitMs,
    active: gate.active,
    deps: [phase],
  });

  const showOptions = phase === "magic";

  const lineText =
    phase === "magic"
      ? getLine("prompt.magic")
      : phase === "explain"
        ? getLine("prompt.explain")
        : getLine("prompt.game");

  useEffect(() => {
    if (merged) {
      const t = window.setTimeout(() => playWin(), 600);
      return () => clearTimeout(t);
    }
  }, [merged]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-10">
      <QuestBackground kind="dialog" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="mb-8 flex w-full max-w-sm flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
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

        <div className="relative flex w-full flex-col items-center animate-in fade-in duration-700">
          <Vaibik emotion={phase === "explain" ? "happy" : "normal"} />
          <div
            key={phase}
            className="relative z-10 mt-2 max-w-md rounded-3xl border border-white/20 bg-slate-900/85 px-6 py-4 text-center text-lg font-semibold text-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-400"
          >
            {lineText}
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-slate-900/85" />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <SpeechNextButton onNext={() => skip()} />
        </div>

        {showOptions && (
          <div className="relative mt-10 flex h-56 w-full max-w-xl items-center justify-center">
            <div
              className={cn(
                "absolute transition-all duration-700 ease-out",
                cardsIn
                  ? "translate-x-[-70px] scale-100 opacity-100"
                  : "translate-x-[150%] scale-90 opacity-0"
              )}
            >
              <ChoiceChip
                label={theme.label}
                gradient={theme.gradient}
                icon={theme.heroIcon}
              />
            </div>
            <div
              className={cn(
                "absolute transition-all duration-700 ease-out",
                cardsIn
                  ? "translate-x-[70px] scale-100 opacity-100"
                  : "-translate-x-[150%] scale-90 opacity-0"
              )}
            >
              <ChoiceChip
                label={action.label}
                gradient={action.gradient}
                icon={action.collectIcon}
              />
            </div>

            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                merged ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="relative animate-in fade-in zoom-in duration-700">
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-indigo-400/50 via-fuchsia-400/60 to-amber-300/50 blur-xl" />
                <div className="relative flex max-w-lg items-center gap-3 rounded-2xl border border-fuchsia-300/70 bg-slate-900/80 px-6 py-5 shadow-[0_0_50px_-6px_rgba(217,70,239,0.9)] backdrop-blur-md">
                  <Wand2 className="h-6 w-6 shrink-0 text-fuchsia-300" />
                  <p className="text-lg font-bold leading-snug text-white">
                    {prompt}
                  </p>
                </div>
              </div>
            </div>

            {merged && (
              <div className="pointer-events-none absolute inset-0 overflow-visible">
                {[...Array(8)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute h-4 w-4 text-fuchsia-300 animate-pulse"
                    style={{
                      left: `${10 + i * 11}%`,
                      top: `${10 + (i % 3) * 30}%`,
                      opacity: 0.6 + (i % 4) * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {phase === "explain" && (
          <div className="mt-8 w-full max-w-md rounded-3xl border border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-500/20 via-indigo-500/20 to-transparent p-[1px] animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-slate-900/70 px-6 py-7 text-center backdrop-blur-md shadow-[0_0_40px_-8px_rgba(217,70,239,0.8)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/30 text-fuchsia-200">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Первый промпт!</h2>
              <p className="text-base leading-relaxed text-indigo-100/90">
                Промпт — это просто инструкция для ИИ. Ты написал словами, что
                создать:{" "}
                <span className="font-semibold text-white">{prompt}</span>.
                Вайбик понял задачу и строит игру!
              </p>
            </div>
          </div>
        )}

        {phase === "game" && (
          <div className="mt-8 flex flex-col items-center gap-3 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-2 rounded-2xl border border-amber-300/50 bg-amber-400/20 px-5 py-3 text-lg font-bold text-amber-200 shadow-[0_0_30px_-6px_rgba(251,191,36,0.7)]">
              <Star className="h-6 w-6 fill-amber-300" />
              +10 ⭐
            </div>
            <p className="text-indigo-100/80">
              Этап пройден! Дальше — проверим, что построил Вайбик.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
