/** Типы Нейро каталога ProektMap (legacy code name: arsenal) */

export type ArsenalToolTag = "local" | "cloud" | "rf" | "mcp";

export type ArsenalExcelCategory =
  | "voice"
  | "local-ai"
  | "coding"
  | "agents"
  | "images"
  | "misc"
  | "video"
  | "learning"
  | "llm"
  | "research"
  | "prompts"
  | "docs"
  | "marketing"
  | "fintech";

export type ArsenalTool = {
  slug: string;
  name: string;
  category: ArsenalExcelCategory;
  categoryLabel: string;
  categoryIcon: string;
  summary: string;
  website: string;
  download: string;
  excelStatus: string;
  tags: ArsenalToolTag[];
  /** встретился в двух строках Excel — одна карточка */
  wasDuplicate?: boolean;
};

export type ArsenalStack = {
  slug: string;
  title: string;
  mission: string;
  audience: string;
  /** slug инструментов в порядке использования */
  tools: string[];
  orderHint: string[];
  definitionOfDone: string;
  commonMistake: string;
  relatedRoutes: { href: string; label: string }[];
  excelCategories: ArsenalExcelCategory[];
  priority: number;
  status: "draft" | "published";
  icon: string;
  focus: string;
};

export type ArsenalCategoryMeta = {
  slug: ArsenalExcelCategory;
  label: string;
  icon: string;
};
