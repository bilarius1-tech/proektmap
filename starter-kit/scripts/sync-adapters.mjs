// Синхронизация команд с адаптерами сред: OpenCode / Cursor / Reasonix.
// Команды — единый источник в commands/. Адаптеры — механические копии.
// Запуск: node scripts/sync-adapters.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const commandsDir = join(root, "commands");
const files = readdirSync(commandsDir).filter((f) => f.endsWith(".md")).sort();

for (const file of files) {
  const content = readFileSync(join(commandsDir, file), "utf8");
  const slug = file.replace(/^\d+-/, "").replace(/\.md$/, "");

  const targets = [
    join(root, "adapters", "opencode", ".opencode", "commands", file),
    join(root, "adapters", "cursor", ".cursor", "rules", file.replace(/\.md$/, ".mdc")),
    join(root, "adapters", "reasonix", ".reasonix", "skills", slug, "SKILL.md"),
  ];

  for (const target of targets) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}

console.log(`Synced ${files.length} commands → adapters/{opencode,cursor,reasonix}`);
