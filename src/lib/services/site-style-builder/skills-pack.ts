import { DIRECTION_LABELS } from "./defaults";
import { SCHOOLS } from "./schools";
import type { StyleTokens } from "./types";

/** Зеркало Premium Landing Stack из /ai-skills — только то, что уходит в файл агенту. */
export const DESIGN_PACK = [
  {
    slug: "frontend-design",
    title: "Frontend Design",
    author: "Anthropic",
    npx: "npx skills add anthropics/skills --skill frontend-design",
    role: "Направление и сборка",
    note: "Зафиксировать эстетику, затем сверстать каркас.",
  },
  {
    slug: "taste-skill",
    title: "taste-skill",
    author: "Leonxlnx",
    npx: "npx skills add Leonxlnx/taste-skill",
    role: "Вкус и композиция",
    note: "Усилить иерархию и характер без новых секций.",
  },
  {
    slug: "web-design-guidelines",
    title: "Web Design Guidelines",
    author: "Vercel",
    npx: "npx skills add vercel-labs/agent-skills --skill web-design-guidelines",
    role: "Нормы",
    note: "Audit findings → точечные фиксы a11y/UX.",
  },
  {
    slug: "impeccable",
    title: "Impeccable",
    author: "Paul Bakaus",
    npx: "npx skills add pbakaus/impeccable",
    role: "Polish",
    note: "Режим brand или product → audit → polish.",
  },
] as const;

export function renderSkillsInstall(): string {
  return DESIGN_PACK.map((skill) => skill.npx).join("\n");
}

export function renderSkillsRoutePrompt(tokens: StyleTokens): string {
  const school = SCHOOLS[tokens.direction];
  const screenType = tokens.direction === "product-minimal" ? "product" : "brand";

  return `Подключи Skills сразу, в этом порядке, не читай как урок — это рабочий маршрут:
1) Frontend Design (Anthropic)
2) taste-skill
3) web-design-guidelines (Vercel)
4) Impeccable — режим ${screenType}

Источник правды: DESIGN.md в корне. Токены не выдумывай.

Задача: собери полноценный шаблон сайта.
Продукт: ${tokens.productName}. Аудитория: ${tokens.audience}.
Стиль: ${tokens.direction} (${DIRECTION_LABELS[tokens.direction]}). ${school.thesis}
Цвета целиком: bg ${tokens.bg}, text ${tokens.text}, muted ${tokens.muted}, border ${tokens.border}, accent ${tokens.accent}.
Шрифты: display ${tokens.fontDisplay}, body ${tokens.fontBody}${tokens.fontMono ? `, mono ${tokens.fontMono}` : ""}.
Сетка: ${tokens.gridColumns} колонок, max-width ${tokens.maxWidth}px, радиус ${tokens.radius}px, кнопки ${tokens.buttonStyle === "fill" ? "заливка" : "контур"} ${tokens.buttonHeight}px.

Порядок:
${DESIGN_PACK.map((skill, index) => `${index + 1}) ${skill.role}: ${skill.note}`).join("\n")}

Не копируй чужой бренд, логотип, тексты и уникальные иллюстрации. Нужна та же стилистика и раскладка — новый шаблон.
Запреты: Inter, Roboto, Arial, Space Grotesk, фиолетовый градиент, hero из трёх одинаковых карточек.
После каждого скилла — 3 буллета «что сделал».`;
}

export function renderSkillsDesignMdSection(): string {
  const install = renderSkillsInstall();
  return `## Skills агента — подключить сразу
Порядок: ${DESIGN_PACK.map((skill) => skill.title).join(" → ")}.
Это не методичка. Поставь пакет в проект агента и работай по файлу.

\`\`\`bash
${install}
\`\`\`

| Шаг | Skill | Работа |
|---|---|---|
${DESIGN_PACK.map((skill) => `| ${skill.role} | ${skill.title} | ${skill.note} |`).join("\n")}

Skills не отменяют токены выше. Без этого файла скиллы усиливают случайность.`;
}
