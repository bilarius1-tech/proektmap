import type { ShpargalkaPack, ShpargalkaPrompt } from "./types";
import { SHPARGALKA_PACKS } from "./packs";
import { DEVELOPER_PROMPTS } from "./prompts/developers";
import { DESIGNER_PROMPTS } from "./prompts/designers";
import { MARKETER_PROMPTS } from "./prompts/marketers";
import { CONTENT_PROMPTS } from "./prompts/content";
import { EXCEL_PROMPTS } from "./prompts/excel";
import { JOB_HUNTING_PROMPTS } from "./prompts/job-hunting";
import { EDUCATION_PROMPTS } from "./prompts/education";
import { HR_PROMPTS } from "./prompts/hr";
import { ENTREPRENEUR_PROMPTS } from "./prompts/entrepreneurs";
import { WEBSITE_PROMPTS } from "./prompts/websites";
import { LAWYER_PROMPTS } from "./prompts/lawyers";
import { ACCOUNTANT_PROMPTS } from "./prompts/accountants";
import { JOURNALIST_PROMPTS } from "./prompts/journalists";
import { FINANCE_PROMPTS } from "./prompts/finance";
import { AUTHOR_PROMPTS } from "./prompts/authors";
import { COACH_PROMPTS } from "./prompts/coaches";

export type { PackIconName, PackStatus, ShpargalkaExample, ShpargalkaPack, ShpargalkaPrompt, ShpargalkaWriteRule } from "./types";
export { SHPARGALKA_PACKS } from "./packs";
export { SHPARGALKA_TEACHING } from "./teaching";

export const SHPARGALKA_PROMPTS: ShpargalkaPrompt[] = [
  ...DEVELOPER_PROMPTS,
  ...DESIGNER_PROMPTS,
  ...MARKETER_PROMPTS,
  ...CONTENT_PROMPTS,
  ...EXCEL_PROMPTS,
  ...JOB_HUNTING_PROMPTS,
  ...EDUCATION_PROMPTS,
  ...HR_PROMPTS,
  ...ENTREPRENEUR_PROMPTS,
  ...WEBSITE_PROMPTS,
  ...LAWYER_PROMPTS,
  ...ACCOUNTANT_PROMPTS,
  ...JOURNALIST_PROMPTS,
  ...FINANCE_PROMPTS,
  ...AUTHOR_PROMPTS,
  ...COACH_PROMPTS,
];

export function getPublishedPacks(): ShpargalkaPack[] {
  return SHPARGALKA_PACKS.filter((pack) => pack.status === "published");
}

export function getSoonPacks(): ShpargalkaPack[] {
  return SHPARGALKA_PACKS.filter((pack) => pack.status === "soon");
}

export function getPack(slug: string): ShpargalkaPack | undefined {
  return SHPARGALKA_PACKS.find((pack) => pack.slug === slug);
}

export function getPromptsByPack(slug: string): ShpargalkaPrompt[] {
  return SHPARGALKA_PROMPTS.filter((prompt) => prompt.pack === slug);
}

export function getPackTasks(slug: string): string[] {
  const fromData = new Set(getPromptsByPack(slug).map((prompt) => prompt.task));
  return [...fromData];
}

export function searchShpargalka(query: string): ShpargalkaPrompt[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return SHPARGALKA_PROMPTS.filter((prompt) => {
    const pack = getPack(prompt.pack);
    const hay = `${prompt.title} ${prompt.task} ${prompt.body} ${prompt.why} ${pack?.title ?? ""} ${pack?.profession ?? ""}`.toLowerCase();
    return hay.includes(q);
  }).slice(0, 8);
}
