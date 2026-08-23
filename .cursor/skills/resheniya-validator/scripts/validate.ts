import { pathToFileURL } from "node:url";
import path from "node:path";

type UnknownRecord = Record<string, unknown>;

async function main() {
const [, , dataFile, exportName] = process.argv;

if (!dataFile || !exportName) {
  console.error("RESHENIYA VALIDATOR: FAIL");
  console.error("- Usage: npx tsx .../validate.ts <data-file> <export-name>");
  process.exit(1);
}

async function loadRoute() {
  const absolutePath = path.resolve(process.cwd(), dataFile);
  const moduleUrl = `${pathToFileURL(absolutePath).href}?validator=${Date.now()}`;
  const loaded = await import(moduleUrl);
  return loaded[exportName] as UnknownRecord | undefined;
}

const route = await loadRoute().catch((error: unknown) => {
  console.error("RESHENIYA VALIDATOR: FAIL");
  console.error(`- Cannot load ${dataFile}: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

if (!route || typeof route !== "object") {
  console.error("RESHENIYA VALIDATOR: FAIL");
  console.error(`- Export "${exportName}" was not found in ${dataFile}`);
  process.exit(1);
}

const errors: string[] = [];
const text = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const list = (value: unknown) => Array.isArray(value) && value.length > 0;
const label = text(route.slug) ? String(route.slug) : exportName;

for (const field of ["slug", "title", "result", "duration"]) {
  if (!text(route[field])) errors.push(`Route "${label}": missing ${field}`);
}

const steps = Array.isArray(route.steps) ? route.steps as UnknownRecord[] : [];
if (steps.length === 0) errors.push(`Route "${label}": steps must not be empty`);

const seenSlugs = new Set<string>();
const forbidden = [
  /заполните\s+(анкет|форм)/iu,
  /опишите\s+(свой|ваш)\s+проект/iu,
  /обоснуйте\s+(свой\s+)?выбор/iu,
  /выберите\s+(основной\s+)?(стек|архитектур)/iu,
  /укажите\s+путь\s+к\s+файлу/iu,
  /придумайте\s+(архитектур|стек|промпт)/iu,
];

steps.forEach((step, index) => {
  const prefix = `Step ${index + 1}${text(step.slug) ? ` "${step.slug}"` : ""}`;

  for (const field of ["slug", "shortTitle", "title", "duration", "goal", "explanation", "artifact"]) {
    if (!text(step[field])) errors.push(`${prefix}: missing ${field}`);
  }

  const slug = text(step.slug) ? String(step.slug) : "";
  if (slug && seenSlugs.has(slug)) errors.push(`${prefix}: duplicate slug`);
  seenSlugs.add(slug);

  const recommendation = step.recommendation as UnknownRecord | undefined;
  if (!recommendation || !text(recommendation.title) || !text(recommendation.why)) {
    errors.push(`${prefix}: recommendation must contain title and why`);
  }

  const instructions = Array.isArray(step.instructions) ? step.instructions as UnknownRecord[] : [];
  if (instructions.length === 0) {
    errors.push(`${prefix}: instructions must not be empty`);
  } else {
    instructions.forEach((instruction, instructionIndex) => {
      if (!text(instruction.title) || !text(instruction.text)) {
        errors.push(`${prefix}: instruction ${instructionIndex + 1} needs title and text`);
      }
    });
  }

  const prompt = step.prompt as UnknownRecord | undefined;
  const hasPrompt = Boolean(prompt && text(prompt.title) && text(prompt.body));
  const hasCommand = instructions.some((instruction) => text(instruction.command));
  if (!hasPrompt && !hasCommand) errors.push(`${prefix}: add a ready command or prompt`);

  if (!list(step.success)) errors.push(`${prefix}: success criteria must not be empty`);
  if (!Array.isArray(step.terms)) errors.push(`${prefix}: terms must be an array`);

  const references = Array.isArray(step.references) ? step.references as UnknownRecord[] : [];
  if (references.length === 0) {
    errors.push(`${prefix}: add contextual internal references`);
  } else {
    references.forEach((reference, referenceIndex) => {
      if (!text(reference.label) || !text(reference.href) || !String(reference.href).startsWith("/")) {
        errors.push(`${prefix}: reference ${referenceIndex + 1} must have label and internal href`);
      }
    });
  }

  const searchable = JSON.stringify({
    goal: step.goal,
    explanation: step.explanation,
    recommendation,
    instructions,
    prompt,
    success: step.success,
  });
  forbidden.forEach((pattern) => {
    if (pattern.test(searchable)) errors.push(`${prefix}: forbidden constructor/proof language (${pattern.source})`);
  });
});

if (errors.length > 0) {
  console.error("RESHENIYA VALIDATOR: FAIL");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("RESHENIYA VALIDATOR: PASS");
console.log(`Route: ${label}`);
console.log(`Steps: ${steps.length}`);
}

main().catch((error: unknown) => {
  console.error("RESHENIYA VALIDATOR: FAIL");
  console.error(`- ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
