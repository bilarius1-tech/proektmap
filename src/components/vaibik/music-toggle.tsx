"use client";

import { useAudio } from "@/components/vaibik/audio-provider";
import { Button } from "@/components/vaibik/ui/button";
import { Music, Music4 } from "lucide-react";
import { playClick } from "@/lib/vaibik/quest-audio";

export default function MusicToggle() {
  const { musicEnabled, toggleMusic } = useAudio();

  return (
    <Button
      type="button"
      aria-label={
        musicEnabled ? "Выключить фоновую музыку" : "Включить фоновую музыку"
      }
      onClick={() => {
        playClick();
        toggleMusic();
      }}
      className="fixed bottom-5 right-20 z-50 h-12 w-12 rounded-full border border-white/20 bg-slate-900/70 text-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-transform hover:scale-105"
      variant="ghost"
      size="icon"
    >
      {musicEnabled ? (
        <Music4 className="h-6 w-6" />
      ) : (
        <Music className="h-6 w-6" />
      )}
    </Button>
  );
}
