import { ARSENAL_STACKS, getArsenalStack, getPublishedStacks } from "./stacks";
import { ARSENAL_TOOLS, ARSENAL_CATEGORIES, getArsenalTool, getArsenalToolsBySlugs } from "./tools";
import type { ArsenalStack, ArsenalTool, ArsenalToolTag } from "./types";

export type { ArsenalStack, ArsenalTool, ArsenalToolTag, ArsenalExcelCategory, ArsenalCategoryMeta } from "./types";
export {
  ARSENAL_STACKS,
  ARSENAL_TOOLS,
  ARSENAL_CATEGORIES,
  getArsenalStack,
  getPublishedStacks,
  getArsenalTool,
  getArsenalToolsBySlugs,
};
export {
  RESHENIYA_ARSENAL_BRIDGES,
  getBridgeForSolution,
  resolveBridge,
} from "./resheniya-bridges";
export type { ResheniyaArsenalBridge } from "./resheniya-bridges";

/** Какие арсеналы используют инструмент */
export function getStacksForTool(toolSlug: string): ArsenalStack[] {
  return getPublishedStacks().filter((s) => s.tools.includes(toolSlug));
}

/** Живые счётчики для hero-полосы хаба — из тех же данных, что и каталог */
export function getArsenalHubStats(
  stacks: ArsenalStack[] = getPublishedStacks(),
  tools: ArsenalTool[] = ARSENAL_TOOLS,
) {
  const categoriesWithTools = new Set(tools.map((t) => t.category)).size;
  const withLink = tools.filter((t) => Boolean(t.website || t.download)).length;
  return {
    stacks: stacks.length,
    tools: tools.length,
    categories: categoriesWithTools,
    withLink,
  };
}

export function searchArsenalTools(
  tools: ArsenalTool[],
  opts: {
    query?: string;
    category?: string;
    tag?: ArsenalToolTag | "all";
    onlyInStacks?: boolean;
  },
): ArsenalTool[] {
  const q = (opts.query || "").trim().toLowerCase();
  const cat = opts.category || "all";
  const tag = opts.tag || "all";
  const stackToolSet = new Set(getPublishedStacks().flatMap((s) => s.tools));

  return tools.filter((t) => {
    if (opts.onlyInStacks && !stackToolSet.has(t.slug)) return false;
    if (cat !== "all" && t.category !== cat) return false;
    if (tag !== "all" && !t.tags.includes(tag)) return false;
    if (!q) return true;
    const hay = `${t.name} ${t.summary} ${t.categoryLabel} ${t.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}

export function searchArsenalStacks(
  stacks: ArsenalStack[],
  opts: { query?: string; category?: string; tag?: ArsenalToolTag | "all" },
): ArsenalStack[] {
  const q = (opts.query || "").trim().toLowerCase();
  const cat = opts.category || "all";
  const tag = opts.tag || "all";

  return stacks.filter((s) => {
    if (cat !== "all" && !s.excelCategories.includes(cat as ArsenalStack["excelCategories"][number])) {
      return false;
    }
    if (tag !== "all") {
      const tools = getArsenalToolsBySlugs(s.tools);
      if (!tools.some((t) => t.tags.includes(tag))) return false;
    }
    if (!q) return true;
    const toolNames = getArsenalToolsBySlugs(s.tools)
      .map((t) => `${t.name} ${t.summary}`)
      .join(" ");
    const hay = `${s.title} ${s.mission} ${s.audience} ${s.focus} ${s.definitionOfDone} ${toolNames}`.toLowerCase();
    return hay.includes(q);
  });
}
