import { getDb } from "../src/lib/db";
import { syncVkVideosToDb, hasVkToken } from "../src/lib/vk-video";

async function main() {
  if (!hasVkToken()) {
    console.error("VK_SERVICE_TOKEN не задан. Открой docs/VK-VIDEO.md");
    process.exit(1);
  }
  const db = await getDb();
  const result = await syncVkVideosToDb(db, { maxPerChannel: 120 });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
