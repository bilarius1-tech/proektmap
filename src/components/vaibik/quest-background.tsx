"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  QUEST_BACKGROUNDS,
  pickRandomBackground,
  rotatesBackground,
  type QuestBackgroundKind,
} from "@/lib/vaibik/quest-backgrounds";

const emptySubscribe = () => () => {};

/** true на клиенте после монтирования, false на сервере и при первом гидрат-рендере. */
function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface QuestBackgroundProps {
  kind: QuestBackgroundKind;
  /** Интервал смены фонов в мс (для чередующихся сцен). */
  interval?: number;
}

function RotatingBackground({
  images,
  interval,
}: {
  images: string[];
  interval: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {images.map((img, i) => (
        <div
          key={img}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
          style={{
            backgroundImage: `url(${img})`,
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}

export default function QuestBackground({
  kind,
  interval = 6000,
}: QuestBackgroundProps) {
  const pool = QUEST_BACKGROUNDS[kind];
  const mounted = useIsMounted();
  const [single, setSingle] = useState<string | undefined>(undefined);

  if (mounted && single === undefined) {
    setSingle(pickRandomBackground(kind));
  }
  const resolved = mounted && single !== undefined ? single : pool[0];

  if (rotatesBackground(kind)) {
    if (!pool.length)
      return <div className="absolute inset-0 cosmic-bg" aria-hidden="true" />;
    return <RotatingBackground images={pool} interval={interval} />;
  }

  if (!resolved) {
    return <div className="absolute inset-0 cosmic-bg" aria-hidden="true" />;
  }

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${resolved})` }}
      aria-hidden="true"
    />
  );
}
