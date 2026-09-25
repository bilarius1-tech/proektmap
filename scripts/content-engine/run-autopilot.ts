/**
 * CLI: npm run content:autopilot
 * force=1 — игнор часа и «уже сегодня»
 */
import { getDb } from "../../src/lib/db/index";
import { runContentAutopilot } from "../../src/lib/blog/content-engine/autopilot";

async function main() {
  const force = process.argv.includes("--force") || process.env.FORCE === "1";
  const db = await getDb();
  const result = await runContentAutopilot(db, { force, silent: false });
  console.log(JSON.stringify({ ok: true, result }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
