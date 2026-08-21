"use client";

import Image from "next/image";
import { playClick } from "@/lib/vaibik/quest-audio";

const INTRO_IMAGE = "/vaibik/assets/quest-splash-2.png";

interface QuestIntroProps {
  onStart?: () => void;
}

export default function QuestIntro({ onStart }: QuestIntroProps) {
  return (
    <button
      type="button"
      onClick={() => {
        // Жест пользователя: разблок MP3 + клик, затем сцена со speakLine.
        playClick();
        onStart?.();
      }}
      aria-label="Начать игру"
      className="relative block min-h-[100dvh] w-full cursor-pointer overflow-hidden focus:outline-none"
    >
      <Image
        src={INTRO_IMAGE}
        alt="Вайбик: Миссия №1 — начало игры"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </button>
  );
}
