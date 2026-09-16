import type { ShpargalkaPrompt } from "./types";

export function makePrompt(
  pack: string,
  id: string,
  title: string,
  task: string,
  body: string,
  why: string,
  extra?: Pick<ShpargalkaPrompt, "bad" | "relatedHref" | "relatedLabel">,
): ShpargalkaPrompt {
  return {
    id: `${pack}-${id}`,
    pack,
    title,
    task,
    body: body.trim(),
    why,
    ...extra,
  };
}
