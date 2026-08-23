"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { playClick, stopSpeak } from "@/lib/vaibik/quest-audio";

/** Возврат на главную ProektMap из игровой оболочки. */
export default function HomeSiteButton({
  variant = "floating",
}: {
  variant?: "floating" | "menu";
}) {
  if (variant === "menu") {
    return (
      <Link
        href="/"
        onClick={() => {
          playClick();
          stopSpeak();
        }}
        className="group flex items-center gap-4 rounded-3xl border border-white/15 bg-slate-900/70 px-6 py-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-emerald-400/40 hover:shadow-[0_0_36px_-8px_rgba(16,185,129,0.55)]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Home className="h-7 w-7" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-xl font-bold text-white">На главную сайта</span>
          <span className="text-sm text-indigo-100/70">Вернуться на ProektMap</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="На главную сайта ProektMap"
      onClick={() => {
        playClick();
        stopSpeak();
      }}
      className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-slate-900/70 px-4 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-transform hover:scale-105"
    >
      <Home className="h-5 w-5" />
      <span className="hidden sm:inline">На главную</span>
    </Link>
  );
}
