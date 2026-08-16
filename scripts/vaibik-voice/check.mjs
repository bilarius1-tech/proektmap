import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const publicRoot = join(root, "public");
const audioRoot = join(publicRoot, "audio/vaibik");
const manifestPath = join(
  root,
  "src/lib/audio/vaibik-audio-manifest.json",
);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const ids = Object.keys(manifest);

const themes = ["space", "dino", "cat"];
const actions = ["stars", "aliens", "score"];
const iterationItems = ["stars", "crystals", "coins"];
const dynamicIds = [
  ...themes.map((theme) => `lab.action.prompt.${theme}`),
  ...themes.flatMap((theme) =>
    actions.map((action) => `lab.done.${theme}.${action}`),
  ),
  ...iterationItems.map((item) => `iteration.play.${item}`),
];

const missingFiles = [];
const invalidPaths = [];
for (const [id, url] of Object.entries(manifest)) {
  const expected = `/audio/vaibik/${id}.mp3`;
  if (url !== expected) invalidPaths.push(`${id}: ${url} (ожидался ${expected})`);
  if (!existsSync(join(publicRoot, url.replace(/^\//, "")))) {
    missingFiles.push(id);
  }
}

const files = existsSync(audioRoot)
  ? walk(audioRoot)
      .filter((file) => file.endsWith(".mp3"))
      .filter((file) => !relative(audioRoot, file).startsWith(`test/`))
  : [];
const manifestFiles = new Set(
  Object.values(manifest).map((url) =>
    resolve(publicRoot, url.replace(/^\//, "")),
  ),
);
const orphanFiles = files.filter((file) => !manifestFiles.has(resolve(file)));
const missingDynamic = dynamicIds.filter((id) => !(id in manifest));

const questLineFiles = findNamed(root, "quest-lines.ts");
const staticIds = new Set();
for (const file of questLineFiles) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(
    /["'`]([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)+)["'`]\s*:/g,
  )) {
    staticIds.add(match[1]);
  }
}
const dynamicBases = new Set([
  "lab.action.prompt",
  "lab.done",
  "iteration.play",
]);
const missingStatic = [...staticIds].filter(
  (id) => !dynamicBases.has(id) && !(id in manifest),
);

console.log("VAIBIK AUDIO CHECK\n");
line(files.length === ids.length, `${files.length} audio files found`);
line(true, `${ids.length} manifest entries`);
if (questLineFiles.length) {
  line(
    missingStatic.length === 0,
    `static quest lines: ${missingStatic.length ? "ERROR" : "OK"}`,
  );
} else {
  console.log("! static quest lines: quest-lines.ts не найден в этом проекте");
}
line(
  missingDynamic.length === 0,
  `dynamic combinations: ${missingDynamic.length ? "ERROR" : "OK"}`,
);
line(missingFiles.length === 0, `missing files: ${missingFiles.length}`);
line(orphanFiles.length === 0, `orphan files: ${orphanFiles.length}`);
line(invalidPaths.length === 0, `invalid ID/path pairs: ${invalidPaths.length}`);

printList("Отсутствующие MP3", missingFiles);
printList(
  "Лишние MP3",
  orphanFiles.map((file) => relative(audioRoot, file)),
);
printList("Статические ID без аудио", missingStatic);
printList("Динамические ID без manifest", missingDynamic);
printList("ID и путь не совпадают", invalidPaths);

const hasErrors =
  missingFiles.length ||
  orphanFiles.length ||
  missingStatic.length ||
  missingDynamic.length ||
  invalidPaths.length;
process.exitCode = hasErrors ? 1 : 0;

function line(ok, text) {
  console.log(`${ok ? "✓" : "✗"} ${text}`);
}

function printList(title, values) {
  if (!values.length) return;
  console.log(`\n${title}:`);
  for (const value of values) console.log(`  - ${value}`);
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function findNamed(directory, target) {
  const ignored = new Set([
    ".git",
    ".next",
    "node_modules",
    ".voice-cache",
    ".voice-venv",
  ]);
  return readdirSync(directory).flatMap((name) => {
    if (ignored.has(name)) return [];
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return findNamed(path, target);
    return name === target ? [path] : [];
  });
}
