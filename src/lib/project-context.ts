import { getDb } from "./db/index";

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  domain: string;
  stack: string;
  niche: string;
  colors: string;
  goals: string;
  blueprintTitle: string;
}

export async function getProjectContext(projectId: string): Promise<ProjectContext | null> {
  const db = await getDb();
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { blueprint: { select: { title: true } } },
  });
  if (!project) return null;
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    domain: project.domain,
    stack: project.stack,
    niche: project.niche,
    colors: project.colors,
    goals: project.goals,
    blueprintTitle: project.blueprint.title,
  };
}

// Build user context string for prompt personalization
export function buildUserContext(ctx: ProjectContext): string {
  const parts: string[] = [];
  if (ctx.name) parts.push(`Проект: ${ctx.name}`);
  if (ctx.niche) parts.push(`Ниша: ${ctx.niche}`);
  if (ctx.domain) parts.push(`Домен: ${ctx.domain}`);
  if (ctx.stack) parts.push(`Стек: ${ctx.stack}`);
  if (ctx.colors) parts.push(`Цвета: ${ctx.colors}`);
  if (ctx.description) parts.push(`Описание: ${ctx.description}`);
  if (ctx.goals) parts.push(`Цели: ${ctx.goals}`);
  return parts.length > 0 ? parts.join("\n") : "";
}

// Resolve template variables with project data
export function resolvePrompts(
  template: string,
  ctx: ProjectContext | null
): string {
  if (!ctx) return template;

  const replacements: Record<string, string> = {
    project: ctx.name || "мой проект",
    domain: ctx.domain || "example.ru",
    stack: ctx.stack || "Next.js",
    niche: ctx.niche || "бизнес",
    colors: ctx.colors || "",
    goals: ctx.goals || "",
    description: ctx.description || "",
  };

  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    if (value) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    }
  }

  return result;
}
