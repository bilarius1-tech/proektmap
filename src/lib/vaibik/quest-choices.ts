import {
  Egg,
  Ghost,
  PawPrint,
  Rocket,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type ThemeId = "space" | "dino" | "cat";
export type ActionId = "stars" | "aliens" | "score";

export interface QuestTheme {
  id: ThemeId;
  label: string;
  /** Слово для промпта: «Создай игру про …» */
  promptWord: string;
  /** Герой в винительном падеже: «управляй …» */
  heroLabel: string;
  heroIcon: LucideIcon;
  gradient: string;
}

export interface QuestAction {
  id: ActionId;
  label: string;
  /** Слово для промпта: «где нужно …» */
  promptWord: string;
  /** Собираемый объект (мн. ч., вин. падеж): «собери …» */
  collectible: string;
  /** Собираемый объект (ед. ч., вин. падеж): «собери …» */
  collectibleSingular: string;
  collectIcon: LucideIcon;
  collectColor: string;
  collectFill: string;
  gradient: string;
  instruction: string;
  celebrate: string;
}

export const QUEST_THEMES: Record<ThemeId, QuestTheme> = {
  space: {
    id: "space",
    label: "Космос",
    promptWord: "космос",
    heroLabel: "ракету",
    heroIcon: Rocket,
    gradient: "from-indigo-500/80 to-blue-500/80",
  },
  dino: {
    id: "dino",
    label: "Динозавры",
    promptWord: "динозавров",
    heroLabel: "динозаврика",
    heroIcon: Egg,
    gradient: "from-emerald-500/80 to-lime-500/80",
  },
  cat: {
    id: "cat",
    label: "Кот",
    promptWord: "котиков",
    heroLabel: "котика",
    heroIcon: PawPrint,
    gradient: "from-amber-500/80 to-orange-500/80",
  },
};

export const QUEST_ACTIONS: Record<ActionId, QuestAction> = {
  stars: {
    id: "stars",
    label: "Собирать звёзды",
    promptWord: "собирать звёзды",
    collectible: "звёзды",
    collectibleSingular: "звёздочку",
    collectIcon: Star,
    collectColor: "text-amber-300",
    collectFill: "#fde68a",
    gradient: "from-yellow-400/80 to-amber-500/80",
    instruction:
      "Кликай по светящимся звёздам — они исчезают со вспышкой, а счёт растёт!",
    celebrate: "Ты собрал все звёзды! 🎉",
  },
  aliens: {
    id: "aliens",
    label: "Убегать от пришельцев",
    promptWord: "убегать от пришельцев",
    collectible: "пришельцев",
    collectibleSingular: "пришельца",
    collectIcon: Ghost,
    collectColor: "text-fuchsia-300",
    collectFill: "#f0abfc",
    gradient: "from-fuchsia-500/80 to-purple-500/80",
    instruction:
      "Веди героя пальцем, уворачивайся от пришельцев и пропускай их мимо!",
    celebrate: "Ты убежал от всех пришельцев! 🎉",
  },
  score: {
    id: "score",
    label: "Набирать очки",
    promptWord: "набирать очки",
    collectible: "очки",
    collectibleSingular: "очко",
    collectIcon: Trophy,
    collectColor: "text-cyan-300",
    collectFill: "#67e8f9",
    gradient: "from-cyan-400/80 to-sky-500/80",
    instruction:
      "Кликай бонусы, чтобы набрать очки, и уворачивайся от минусов!",
    celebrate: "Ты набрал все очки! 🎉",
  },
};

export function getTheme(id?: string | null): QuestTheme {
  return QUEST_THEMES[(id as ThemeId) ?? "space"] ?? QUEST_THEMES.space;
}

export function getAction(id?: string | null): QuestAction {
  return QUEST_ACTIONS[(id as ActionId) ?? "stars"] ?? QUEST_ACTIONS.stars;
}
