"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import {
  isEnabled,
  isMusicEnabled,
  readStoredMusicPreference,
  readStoredPreference,
  setEnabled,
  setMusicEnabled,
  stopSpeak,
  subscribeMusic,
  subscribeSound,
  toggleEnabled,
  toggleMusic,
  unlock,
} from "@/lib/vaibik/quest-audio";

interface AudioContextValue {
  enabled: boolean;
  toggle: () => void;
  musicEnabled: boolean;
  toggleMusic: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  enabled: true,
  toggle: () => {},
  musicEnabled: true,
  toggleMusic: () => {},
});

export function useAudio() {
  return useContext(AudioCtx);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Состояние настроек берём из внешнего хранилища (quest-audio) через
  // useSyncExternalStore с детерминированным getServerSnapshot, чтобы первый
  // рендер на сервере и клиенте совпадал при гидратации. localStorage читается
  // только после монтирования (в эффекте ниже), поэтому SSR не зависит от
  // сохранённых значений.
  const enabled = useSyncExternalStore(subscribeSound, isEnabled, () => true);
  const musicEnabled = useSyncExternalStore(
    subscribeMusic,
    isMusicEnabled,
    () => true
  );

  useEffect(() => {
    // Синхронизируем модуль с сохранёнными предпочтениями только на клиенте.
    setEnabled(readStoredPreference());
    setMusicEnabled(readStoredMusicPreference());
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => {
      unlock();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);
    return cleanup;
  }, []);

  useEffect(() => {
    // Глушим только при уходе с раздела /vaibik, не при /vaibik → /vaibik/quest.
    if (!pathname?.startsWith("/vaibik")) {
      stopSpeak();
    }
  }, [pathname]);

  const toggle = useCallback(() => {
    toggleEnabled();
  }, []);

  const toggleMusicCb = useCallback(() => {
    toggleMusic();
  }, []);

  return (
    <AudioCtx.Provider
      value={{ enabled, toggle, musicEnabled, toggleMusic: toggleMusicCb }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
