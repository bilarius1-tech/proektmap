export type QuestBackgroundKind = "splash" | "lab" | "game" | "dialog";

/**
 * Пользовательские фоны квеста. Чтобы подставить свои изображения, добавь
 * подготовленные файлы в `public/assets/` и укажи их пути в соответствующем
 * массиве ниже. Сцены диалога с Вайбиком (kind = "dialog") плавно чередуют
 * фоны по кругу, остальные экраны случайно выбирают один фон из набора.
 */
export const QUEST_BACKGROUNDS: Record<QuestBackgroundKind, string[]> = {
  splash: ["/vaibik/assets/quest-splash-1.png"],
  lab: ["/vaibik/assets/quest-lab-1.png", "/vaibik/assets/quest-lab-2.png"],
  game: [
    "/vaibik/assets/quest-game-1.png",
    "/vaibik/assets/quest-game-2.png",
    "/vaibik/assets/quest-game-3.png",
  ],
  dialog: [
    "/vaibik/assets/dialog-bg-1.jpg",
    "/vaibik/assets/dialog-bg-2.jpg",
    "/vaibik/assets/dialog-bg-3.jpg",
    "/vaibik/assets/dialog-bg-4.jpg",
  ],
};

/** Плавно ли чередовать фоны по кругу для данного типа сцены. */
export function rotatesBackground(kind: QuestBackgroundKind): boolean {
  return kind === "dialog";
}

export function pickRandomBackground(
  kind: QuestBackgroundKind
): string | undefined {
  const pool = QUEST_BACKGROUNDS[kind];
  if (!pool.length) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}
