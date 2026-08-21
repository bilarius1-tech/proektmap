"use client";

import { useEffect } from "react";
import QuestBackground from "@/components/vaibik/quest-background";
import { Button } from "@/components/vaibik/ui/button";
import { playClick, speakLine } from "@/lib/vaibik/quest-audio";
import { Rocket } from "lucide-react";

const MISSION_LABEL = "МИССИЯ 1/6";
const MISSION_PROGRESS = 16.6;

function Vaibik() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-transparent blur-2xl animate-pulse" />
      <div className="absolute -inset-4 rounded-full border-2 border-indigo-300/40 animate-pulse" />
      <svg
        viewBox="0 0 160 160"
        className="relative h-52 w-52 drop-shadow-[0_0_28px_rgba(168,85,247,0.7)] sm:h-64 sm:w-64"
        role="img"
        aria-label="Робот Вайбик"
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
        <circle cx="64" cy="58" r="11" fill="#ffffff">
          <animate
            attributeName="ry"
            values="11;3;11"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="11;14;11"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="100" cy="58" r="11" fill="#ffffff">
          <animate
            attributeName="ry"
            values="11;3;11"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="11;14;11"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="66" cy="60" r="4" fill="#312e81" />
        <circle cx="102" cy="60" r="4" fill="#312e81" />
        <path
          d="M62 92 Q82 106 100 92"
          stroke="#312e81"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="64" y="108" width="34" height="24" rx="12" fill="#f59e0b" />
        <rect x="46" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
        <rect x="106" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
      </svg>
    </div>
  );
}

interface MissionStartProps {
  onStart?: () => void;
}

export default function MissionStart({ onStart }: MissionStartProps) {
  useEffect(() => {
    // Явный id → гарантированно берём MP3, не браузерный TTS.
    speakLine("mission1.welcome");
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-14">
      <QuestBackground kind="splash" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <div className="mb-10 flex w-full max-w-sm flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="text-xs font-semibold tracking-[0.3em] text-indigo-200/80">
            {MISSION_LABEL}
          </span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all duration-1000"
              style={{ width: `${MISSION_PROGRESS}%` }}
            />
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Vaibik />
        </div>

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          Вайбик: Миссия №1
        </h1>

        <p className="mt-4 max-w-md rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 text-lg text-indigo-100/90 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          Привет! Я — Вайбик, твой робот-напарник. Добро пожаловать в
          космическую лабораторию — вместе разберёмся, как ИИ помогает создавать
          игры.
        </p>

        <Button
          size="lg"
          onClick={() => {
            playClick();
            onStart?.();
          }}
          className="mt-10 h-14 gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-10 text-lg font-semibold text-white shadow-[0_12px_40px_-8px_rgba(139,92,246,0.8)] hover:from-indigo-400 hover:to-fuchsia-400 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          Начать миссию
          <Rocket className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
