// Собирает public/starter-kit/ai-project-starter.zip из папки starter-kit/.
// Запуск: node scripts/build-starter-kit.mjs
import { execSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "starter-kit");
const outDir = join(root, "public", "starter-kit");
const out = join(outDir, "ai-project-starter.zip");

mkdirSync(outDir, { recursive: true });
if (existsSync(out)) rmSync(out);

execSync(`cd "${src}" && zip -r -q "${out}" .`, { stdio: "inherit" });
console.log(`Built ${out}`);
