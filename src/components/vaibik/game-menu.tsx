"use client";

import Link from "next/link";
import { playClick } from "@/lib/vaibik/quest-audio";
import { BookOpen, Phone, Rocket } from "lucide-react";
import HomeSiteButton from "@/components/vaibik/home-site-button";

function VaibikMini() {
  return (
    <svg
      viewBox="0 0 160 160"
      className="h-32 w-32 sm:h-40 sm:w-40 drop-shadow-[0_0_28px_rgba(124,108,240,0.55)]"
      role="img"
      aria-label="Робот Вайбик"
    >
      <g>
        <line
          x1="80"
          y1="22"
          x2="80"
          y2="6"
          stroke="#9ca3af"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="80" cy="5" r="5" fill="#fbbf24">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
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
        <path
          d="M50 60 Q64 46 78 60"
          stroke="#312e81"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M86 60 Q100 46 114 60"
          stroke="#312e81"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M60 88 Q82 108 104 88 Z" fill="#312e81" />
        <rect x="64" y="108" width="34" height="24" rx="12" fill="#f59e0b" />
        <rect x="46" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
        <rect x="106" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
      </g>
    </svg>
  );
}

const MENU_ITEMS = [
  {
    href: "/vaibik/quest",
    label: "Начать миссию",
    description: "Пройди квест «Вайбик: Миссия №1»",
    icon: Rocket,
    gradient: "from-indigo-500 to-fuchsia-500",
    glow: "shadow-[0_12px_40px_-8px_rgba(139,92,246,0.8)]",
  },
  {
    href: "/vaibik/about",
    label: "О игре",
    description: "Логика, суть и что получит ребёнок",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-[0_12px_40px_-8px_rgba(16,185,129,0.6)]",
  },
  {
    href: "/vaibik/contacts",
    label: "Контакты",
    description: "Автор и связи",
    icon: Phone,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-[0_12px_40px_-8px_rgba(245,158,11,0.6)]",
  },
];

export default function GameMenu() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-14">
      <div className="absolute inset-0 cosmic-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <VaibikMini />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          Вайбик: Миссия №1
        </h1>
        <p className="mt-3 max-w-md rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 text-lg text-indigo-100/90 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          Космическое приключение, где ты вместе с роботом Вайбиком узнаешь, как
          ИИ помогает создавать игры.
        </p>

        <nav className="mt-10 grid w-full max-w-md gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => playClick()}
                className={`group flex items-center gap-4 rounded-3xl border border-white/15 bg-slate-900/70 px-6 py-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] ${item.glow}`}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${item.gradient}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xl font-bold text-white">
                    {item.label}
                  </span>
                  <span className="text-sm text-indigo-100/70">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
          <HomeSiteButton variant="menu" />
        </nav>
      </div>
    </div>
  );
}
