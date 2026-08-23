"use client";

import { Button } from "@/components/vaibik/ui/button";
import { ArrowRight } from "lucide-react";
import { playClick } from "@/lib/vaibik/quest-audio";

/**
 * Кнопка «Дальше» для ручного перехода между сценами квеста.
 * Показывается во время реплики Вайбика и позволяет ребёнку
 * перейти дальше, не дожидаясь конца озвучки.
 */
export default function SpeechNextButton({ onNext }: { onNext: () => void }) {
  return (
    <Button
      type="button"
      onClick={() => {
        playClick();
        onNext();
      }}
      className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-7 text-base font-semibold text-white shadow-[0_12px_40px_-10px_rgba(139,92,246,0.8)] hover:from-indigo-400 hover:to-fuchsia-400 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      Дальше
      <ArrowRight className="h-5 w-5" />
    </Button>
  );
}
