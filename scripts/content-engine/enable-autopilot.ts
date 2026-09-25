import { getDb } from "../../src/lib/db/index";

async function main() {
  const db = await getDb();
  await db.siteSettings.update({
    where: { id: "main" },
    data: {
      contentAutopilotEnabled: true,
      contentAutopilotHour: 10,
      contentAutopilotDailyLimit: 1,
      autoPublishEnabled: false,
    },
  });
  const s = await db.siteSettings.findUnique({
    where: { id: "main" },
    select: {
      contentAutopilotEnabled: true,
      autoPublishEnabled: true,
      contentAutopilotHour: true,
      contentAutopilotDailyLimit: true,
    },
  });
  console.log(JSON.stringify(s, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
