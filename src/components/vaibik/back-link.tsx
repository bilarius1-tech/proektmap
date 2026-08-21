"use client";

import Link from "next/link";
import { playClick } from "@/lib/vaibik/quest-audio";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <Link
      href="/vaibik"
      onClick={() => playClick()}
      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-slate-900/70 px-5 py-3 text-base font-semibold text-white backdrop-blur-md transition-transform hover:scale-[1.03]"
    >
      <ArrowLeft className="h-5 w-5" />В меню
    </Link>
  );
}
