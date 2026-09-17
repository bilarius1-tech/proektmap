import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import JSZip from "jszip";
import type { TemplateDossier } from "./types";

const STARTER_ROOT = join(process.cwd(), "content/site-starter");

function walkFiles(dir: string, acc: Array<{ rel: string; buf: Buffer }> = []): Array<{ rel: string; buf: Buffer }> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(STARTER_ROOT, full).replace(/\\/g, "/");
    if (statSync(full).isDirectory()) {
      walkFiles(full, acc);
      continue;
    }
    acc.push({ rel, buf: readFileSync(full) });
  }
  return acc;
}

function cursorReadme(dossier: TemplateDossier): string {
  return `# ${dossier.productName}

Рабочая папка сайта. Бриф и направление уже заполнены. index.html агент собирает в Cursor.

## Старт в Cursor

1. Откройте эту папку как проект.
2. Вставьте промпт из CURSOR.md (или скажите: прочитай AGENTS.md, BRIEF.md и DESIGN.md, собери главную).
3. Не копируйте содержание examples/densio — это чужой пример.
4. Страница должна открываться двойным кликом по index.html.

## Источники правды

- BRIEF.md — задача и факты
- DESIGN.md — визуал
- shared/tokens.css — цвета и шрифты
- materials/ — ваши файлы
- .agents/skills/ и .cursor/skills/ — brief, new-page, page-reviewer

Скиллы читаются как файлы. Отдельный Codex не нужен.
`;
}

export async function packStarterZip(dossier: TemplateDossier): Promise<Buffer> {
  const zip = new JSZip();
  const root = zip.folder(dossier.slug);
  if (!root) throw new Error("zip folder");

  for (const file of walkFiles(STARTER_ROOT)) {
    root.file(file.rel, file.buf);
  }

  root.file("BRIEF.md", dossier.briefMd);
  root.file("DESIGN.md", dossier.designMd);
  root.file("SITEMAP.md", dossier.sitemapMd);
  root.file("REFERENCES.md", dossier.referencesMd);
  root.file("HANDOFF.md", dossier.handoffMd);
  root.file("shared/tokens.css", dossier.tokensCss);
  root.file("README.md", cursorReadme(dossier));
  root.file("CURSOR.md", dossier.cursorPrompt);
  root.file("START-CURSOR.md", dossier.cursorPrompt);

  const skillFiles = walkFiles(join(STARTER_ROOT, ".agents/skills"));
  for (const file of skillFiles) {
    const cut = file.rel.replace(/^\.agents\/skills\//, "");
    root.file(`.cursor/skills/${cut}`, file.buf);
  }

  const buf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  return Buffer.from(buf);
}
