export type AiSkillTrust = "verified" | "community" | "flagged";

export type AiSkillCategory = "design";

export interface AiSkillExample {
  before: string;
  after: string;
}

export interface AiSkillWriteRule {
  bad: string;
  good: string;
  why: string;
}

export interface AiSkill {
  slug: string;
  title: string;
  author: string;
  repository: string;
  category: AiSkillCategory;
  typeLabels: string[];
  summary: string;
  does: string;
  whenToUse: string[];
  install: string;
  invoke: string;
  /** Как правильно писать запросы к агенту с этим Skill */
  howToWrite: AiSkillWriteRule[];
  example: AiSkillExample;
  result: string;
  limits: string[];
  agents: string[];
  tags: string[];
  relatedSlugs: string[];
  trust: AiSkillTrust;
  graphRole: string;
}

export interface SkillRecipeStep {
  skillSlug: string;
  role: string;
  note: string;
}

export interface SkillRecipe {
  slug: string;
  title: string;
  goal: string;
  steps: SkillRecipeStep[];
  stackSlug: string;
  /** Готовый текст маршрута для копирования в агент */
  routePrompt: string;
}

export interface SkillStack {
  slug: string;
  title: string;
  summary: string;
  skillSlugs: string[];
  recipeSlug: string;
}

export interface GraphNode {
  id: string;
  label: string;
  kind: "phase" | "skill";
  skillSlug?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}
