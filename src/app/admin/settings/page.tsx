import { getDb } from "@/lib/db/index";
import SettingsClient from "./client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  return (
    <SettingsClient settings={settings ? JSON.parse(JSON.stringify(settings)) : { proPrice: 300 }} />
  );
}
