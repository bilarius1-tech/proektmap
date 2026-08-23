"use client";

import { useEffect, useRef } from "react";
import { isEnabled, isUnlocked, speak, stopSpeak } from "@/lib/vaibik/quest-audio";

/**
 * Хук «речевого шлюза» для смены сцен в квесте.
 *
 * Задача: сцена должна переходить дальше не раньше, чем Вайбик дочитает свою
 * реплику. При этом у нас всегда есть подстраховки:
 *  1. событие окончания речи (utterance.onend) — основной сигнал;
 *  2. тайм-аут-подстраховка (fallbackMs), если речи нет или событие не сработало;
 *  3. минимальная пауза (minWaitMs), чтобы текст успел появиться и прочитаться;
 *  4. ручная кнопка «Дальше» (skip) для перехода в любой момент.
 *
 * Хук вызывается один раз на реплику (deps — фаза/ключ реплики), озвучивает
 * текст и вызывает advance(), когда можно двигаться дальше.
 */
export function useSpeechAdvance({
  text,
  lineId,
  advance,
  fallbackMs,
  minWaitMs = 0,
  active = true,
  deps = [],
}: {
  /** Текст реплики, которую нужно озвучить. */
  text: string;
  /** Ключ реплики для MP3 (/audio/vaibik/<id>.mp3). */
  lineId?: string;
  /** Вызывается, когда можно переходить дальше. */
  advance: () => void;
  /** Тайм-аут-подстраховка в мс (если речи нет или событие не пришло). */
  fallbackMs: number;
  /** Минимальная пауза перед переходом, мс. */
  minWaitMs?: number;
  /** Если false — шлюз выключен (для фазы, где переход не нужен). */
  active?: boolean;
  /** Зависимости, при смене которых хук «сбрасывается» на новую реплику. */
  deps?: unknown[];
}) {
  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  // Храним актуальный skip(), чтобы кнопка «Дальше» всегда работала на
  // текущей реплике.
  const skipRef = useRef<() => void>(() => {});
  skipRef.current = () => advanceRef.current();

  useEffect(() => {
    // Фаза, где переход не нужен, — ничего не делаем.
    if (!active) {
      skipRef.current = () => {};
      return;
    }

    let released = false;
    let minPassed = minWaitMs <= 0;
    let speechDone = false;
    const timers: number[] = [];

    // Финальный выход: отпускаем переход (идемпотентно).
    const release = () => {
      if (released) return;
      released = true;
      advanceRef.current();
    };

    // Переходим только когда прошли И мини-пауза, И речь закончилась
    // (либо случилась подстраховка).
    const maybeRelease = () => {
      if (minPassed && speechDone) release();
    };

    const canSpeak =
      typeof window !== "undefined" && isEnabled() && isUnlocked();

    if (minWaitMs > 0) {
      timers.push(
        window.setTimeout(() => {
          minPassed = true;
          maybeRelease();
        }, minWaitMs)
      );
    }

    if (canSpeak && text) {
      // Основной сигнал — конец речи (MP3 или TTS).
      speak(text, () => {
        speechDone = true;
        maybeRelease();
      }, lineId);
      // Подстраховка, если событие end не придёт.
      timers.push(
        window.setTimeout(() => {
          speechDone = true;
          maybeRelease();
        }, fallbackMs)
      );
    } else {
      // Речи нет — «речь» считаем завершённой сразу, ждём только паузу,
      // чтобы реплика успела отобразиться.
      speechDone = true;
      timers.push(
        window.setTimeout(
          () => {
            minPassed = true;
            maybeRelease();
          },
          minWaitMs > 0 ? minWaitMs : 900
        )
      );
    }

    // Кнопка «Дальше» переходит немедленно.
    skipRef.current = () => release();

    return () => {
      released = true;
      timers.forEach(clearTimeout);
      stopSpeak();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { skip: () => skipRef.current() };
}
