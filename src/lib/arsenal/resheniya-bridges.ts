/**
 * Мосты /resheniya ↔ Нейро каталог (/arsenal).
 * Skill: .cursor/skills/arsenal-resheniya-bridge/SKILL.md
 */
import { getArsenalStack } from "./stacks";
import { getArsenalToolsBySlugs } from "./tools";
import type { ArsenalStack, ArsenalTool } from "./types";

export type ResheniyaArsenalBridge = {
  /** slug маршрута /resheniya/<slug> */
  solutionSlug: string;
  /** 1–3 стека арсенала под миссию */
  stackSlugs: string[];
  /** 2–4 конкретных инструмента (не весь каталог) */
  toolSlugs: string[];
  /** Одна фраза «зачем этот набор» */
  why: string;
};

/** Канонические мосты для опубликованных решений */
export const RESHENIYA_ARSENAL_BRIDGES: ResheniyaArsenalBridge[] = [
  {
    solutionSlug: "saas-product",
    stackSlugs: ["vibe-coder", "prompt-ops", "mcp-agents"],
    toolSlugs: ["opencode", "superpowers", "agent-skills", "prompts-chat"],
    why: "Кодинг-агент, навыки и библиотека промптов — чтобы довести SaaS до проверяемого среза.",
  },
  {
    solutionSlug: "telegram-bot",
    stackSlugs: ["mcp-agents", "desktop-agent", "rf-stack"],
    toolSlugs: ["hermes-agent", "open-interpreter", "gigachat-3-5", "whichllm"],
    why: "Агентский контур и РФ-доступные модели — для бота без хаоса закладок.",
  },
  {
    solutionSlug: "avito-business",
    stackSlugs: ["listing-photo", "seller-content", "short-video"],
    toolSlugs: ["removerized", "ideogram", "openshorts", "ai-marketing-skills"],
    why: "Фото витрины, тексты и короткий ролик — этичный контент под объявления.",
  },
];

export function getBridgeForSolution(solutionSlug: string): ResheniyaArsenalBridge | undefined {
  return RESHENIYA_ARSENAL_BRIDGES.find((b) => b.solutionSlug === solutionSlug);
}

export function resolveBridge(solutionSlug: string): {
  bridge: ResheniyaArsenalBridge;
  stacks: ArsenalStack[];
  tools: ArsenalTool[];
} | null {
  const bridge = getBridgeForSolution(solutionSlug);
  if (!bridge) return null;
  const stacks = bridge.stackSlugs
    .map((s) => getArsenalStack(s))
    .filter((s): s is ArsenalStack => Boolean(s));
  const tools = getArsenalToolsBySlugs(bridge.toolSlugs);
  return { bridge, stacks, tools };
}
