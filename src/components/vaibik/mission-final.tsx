"use client";

import { useEffect, useMemo } from "react";
import { playWin, speakLine } from "@/lib/vaibik/quest-audio";
import { getLine } from "@/lib/vaibik/quest-lines";
import { cn } from "@/lib/vaibik/utils";
import {
  Lightbulb,
  MessageCircle,
  Medal,
  PartyPopper,
  RotateCw,
  Rocket,
  SearchCheck,
  Sparkles,
  Star,
  Wand2,
  type LucideIcon,
} from "lucide-react";

const MISSION_LABEL = "ФИНАЛ";
const MISSION_PROGRESS = 100;

const CONFETTI_COLORS = [
  "#fbbf24",
  "#f472b6",
  "#a5b4fc",
  "#34d399",
  "#fda4af",
  "#60a5fa",
  "#c084fc",
];

const VIBECRAFT_URL = "https://vibe.sourcecraft.dev/";

interface Step {
  id: string;
  icon: LucideIcon;
  label: string;
  gradient: string;
}

const STEPS: Step[] = [
  {
    id: "idea",
    icon: Lightbulb,
    label: "Идея",
    gradient: "from-yellow-400 to-amber-500",
  },
  {
    id: "explain",
    icon: MessageCircle,
    label: "Объяснение",
    gradient: "from-indigo-400 to-blue-500",
  },
  {
    id: "prompt",
    icon: Wand2,
    label: "Промпт",
    gradient: "from-fuchsia-400 to-purple-500",
  },
  {
    id: "check",
    icon: SearchCheck,
    label: "Проверка",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "fix",
    icon: RotateCw,
    label: "Исправление",
    gradient: "from-rose-400 to-orange-500",
  },
];

function MedalBadge() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-amber-300/50 via-yellow-400/30 to-orange-400/40 blur-2xl animate-pulse" />
      <div className="absolute -inset-3 rounded-full border-2 border-amber-300/40 animate-pulse" />
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-[0_0_60px_-8px_rgba(251,191,36,0.9)] sm:h-36 sm:w-36">
        <div className="absolute inset-1 rounded-full border border-amber-300/70" />
        <Medal className="h-14 w-14 text-amber-900 drop-shadow-[0_2px_6px_rgba(255,255,255,0.6)] sm:h-16 sm:w-16" />
      </div>
    </div>
  );
}

function Portal() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-40 w-40 rounded-full bg-fuchsia-500/30 blur-3xl sm:h-48 sm:w-48" />
      <div className="relative h-36 w-36 rounded-full sm:h-44 sm:w-44">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-fuchsia-300/70 animate-portal-ring" />
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-indigo-300/60 animate-portal-ring-reverse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-purple-600 shadow-[inset_0_0_40px_rgba(255,255,255,0.4)] animate-pulse" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sky-300 via-white to-indigo-300 blur-[1px] opacity-90" />
        <Sparkles className="absolute left-2 top-1 h-5 w-5 text-white" />
        <Sparkles className="absolute bottom-3 right-4 h-6 w-6 text-white" />
        <Sparkles className="absolute right-0 top-8 h-4 w-4 text-white" />
      </div>
    </div>
  );
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

function seededRand(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function MissionFinal() {
  const confetti = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: seededRand(i + 1) * 100,
        delay: seededRand(i + 2) * 5,
        duration: 3 + seededRand(i + 3) * 4,
        size: 6 + seededRand(i + 4) * 6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    []
  );

  useEffect(() => {
    playWin();
    speakLine("final.done");
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 cosmic-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      {confetti.map((c) => (
        <span
          key={c.id}
          className="confetti-fall pointer-events-none z-0 h-2 w-2 rounded-sm"
          style={
            {
              left: `${c.left}%`,
              backgroundColor: c.color,
              width: c.size,
              height: c.size,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="mb-8 flex w-full max-w-sm flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="text-xs font-semibold tracking-[0.3em] text-indigo-200/80">
            {MISSION_LABEL}
          </span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all duration-1000 ease-out"
              style={{ width: `${MISSION_PROGRESS}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <MedalBadge />
          <h1 className="mt-6 flex items-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Миссия выполнена!
            <PartyPopper className="h-9 w-9 text-amber-300 sm:h-10 sm:w-10" />
          </h1>
          <p className="mt-3 max-w-md text-lg text-indigo-100/90">
            Ты прошёл весь путь вайбкодера — от идеи до готовой игры. Это твой
            первый настоящий проект!
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-3xl border border-amber-300/60 bg-gradient-to-br from-amber-400/25 to-orange-500/25 px-7 py-4 shadow-[0_0_40px_-8px_rgba(251,191,36,0.8)]">
            <div className="flex items-center gap-2 text-2xl font-bold text-amber-200">
              <Medal className="h-6 w-6 text-amber-300" />
              Первый вайбкодер
            </div>
            <span className="h-8 w-px bg-white/30" />
            <div className="flex items-center gap-1.5 text-2xl font-bold text-white">
              <Star className="h-6 w-6 fill-amber-300 text-amber-300" />
              50 XP
            </div>
          </div>
        </div>

        <div className="mt-10 w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
          <p className="mb-4 text-center text-sm font-semibold tracking-[0.25em] text-indigo-200/80">
            ТВОЙ ПУТЬ ВАЙБКОДЕРА
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="card-hover flex flex-col items-center gap-3 rounded-3xl border border-white/15 bg-white/10 px-3 py-5 backdrop-blur-md"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                      step.gradient
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center text-sm font-bold text-white">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 w-full max-w-xl rounded-3xl border border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-500/20 via-indigo-500/20 to-transparent p-[1px] animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-slate-900/70 px-6 py-7 text-center backdrop-blur-md shadow-[0_0_40px_-8px_rgba(217,70,239,0.8)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/30 text-fuchsia-200">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Программирование начинается с идеи
            </h2>
            <p className="text-base leading-relaxed text-indigo-100/90">
              Игра родилась из твоей идеи: ты объяснил её Вайбику, собрал
              промпт, проверил и исправил. Так создаются настоящие проекты — и
              твой следующий ждёт!
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 sm:flex-row sm:gap-12">
          <div className="order-2 sm:order-1">
            <Portal />
          </div>
          <div className="order-1 flex max-w-md flex-col items-center text-center sm:order-2 sm:items-start sm:text-left">
            <p className="text-lg font-semibold text-indigo-100/90">
              Впереди — мир VibeCraft, где ты можешь создавать свои настоящие
              проекты с помощью ИИ!
            </p>
            <p className="text-xl font-bold text-white">
              А теперь попробуй создать настоящий проект в VibeCraft!
            </p>
            <a
              href={VIBECRAFT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-16 items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 px-9 text-xl font-bold text-slate-900 shadow-[0_16px_50px_-10px_rgba(251,146,60,0.9)] transition-transform duration-200 hover:scale-[1.03] hover:from-amber-300 hover:to-orange-400"
            >
              СОЗДАТЬ ПРОЕКТ В VIBECRAFT
              <Rocket className="h-6 w-6" />
            </a>
            <p className="mt-4 text-sm text-indigo-200/70">
              Ты уже всё умеешь. Пора создавать!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
