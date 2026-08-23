"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  vaibikAudioManager,
  type VaibikVoiceState,
} from "@/lib/audio/vaibik-audio-manager";

export function useVaibikVoice() {
  const [voice, setVoice] = useState<VaibikVoiceState>(
    vaibikAudioManager.getState(),
  );

  useEffect(() => vaibikAudioManager.subscribe(setVoice), []);

  return {
    ...voice,
    isTalking: voice.status === "loading" || voice.status === "playing",
    characterState:
      voice.status === "loading" || voice.status === "playing"
        ? ("talking" as const)
        : ("idle" as const),
  };
}

export function VaibikVoiceControls() {
  const voice = useVaibikVoice();

  return (
    <div
      aria-label="Настройки голоса Вайбика"
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <button
        type="button"
        aria-label={voice.muted ? "Включить голос Вайбика" : "Выключить голос Вайбика"}
        title={voice.muted ? "Включить голос Вайбика" : "Выключить голос Вайбика"}
        onClick={() =>
          voice.muted
            ? vaibikAudioManager.unmuteVoice()
            : vaibikAudioManager.muteVoice()
        }
        style={{
          width: 36,
          height: 36,
          display: "grid",
          placeItems: "center",
          border: "1px solid currentColor",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
        }}
      >
        {voice.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <label
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
      >
        <span>Голос Вайбика</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={voice.volume}
          aria-label="Громкость голоса Вайбика"
          onChange={(event) =>
            vaibikAudioManager.setVoiceVolume(Number(event.target.value))
          }
        />
      </label>
    </div>
  );
}

export function VaibikSubtitle() {
  const voice = useVaibikVoice();
  if (!voice.subtitle || voice.status === "idle") return null;

  return (
    <div role="status" aria-live="polite" style={subtitleStyle}>
      {voice.subtitle}
    </div>
  );
}

const subtitleStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: 20,
  zIndex: 20,
  width: "min(680px, calc(100% - 32px))",
  transform: "translateX(-50%)",
  padding: "11px 16px",
  background: "rgba(10, 18, 24, 0.9)",
  color: "#ffffff",
  textAlign: "center",
  fontSize: 17,
  lineHeight: 1.45,
  pointerEvents: "none",
};
