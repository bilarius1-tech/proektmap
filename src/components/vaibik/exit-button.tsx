"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/vaibik/ui/button";
import { DoorOpen } from "lucide-react";
import { playClick, stopSpeak } from "@/lib/vaibik/quest-audio";

/**
 * Кнопка «Закончить / Заново»: завершает текущий проход квеста и возвращает
 * ребёнка в главное игровое меню, чтобы выйти или начать сначала.
 * Размещается рядом с кнопками звука (правый нижний угол).
 */
export default function ExitButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      aria-label="Закончить и вернуться в главное меню"
      onClick={() => {
        playClick();
        stopSpeak();
        router.push("/vaibik");
      }}
      className="fixed bottom-5 right-36 z-50 h-12 w-12 rounded-full border border-white/20 bg-slate-900/70 text-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-transform hover:scale-105"
      variant="ghost"
      size="icon"
    >
      <DoorOpen className="h-6 w-6" />
    </Button>
  );
}
