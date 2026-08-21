"use client";

import { useAudio } from "@/components/vaibik/audio-provider";
import { Button } from "@/components/vaibik/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { playClick } from "@/lib/vaibik/quest-audio";

export default function SoundToggle() {
  const { enabled, toggle } = useAudio();

  return (
    <Button
      type="button"
      aria-label={
        enabled ? "Выключить голос и эффекты" : "Включить голос и эффекты"
      }
      onClick={() => {
        playClick();
        toggle();
      }}
      className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full border border-white/20 bg-slate-900/70 text-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-transform hover:scale-105"
      variant="ghost"
      size="icon"
    >
      {enabled ? (
        <Volume2 className="h-6 w-6" />
      ) : (
        <VolumeX className="h-6 w-6" />
      )}
    </Button>
  );
}
