import { getDb } from "@/lib/db/index";
import DesignClient from "./client";

export const dynamic = "force-dynamic";

export default async function DesignPage() {
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  return (
    <DesignClient settings={settings ? JSON.parse(JSON.stringify(settings)) : {
      accentColor: "#0fb880", headingFont: "Montserrat", bodyFont: "Inter",
      borderRadius: 0, designStyle: "swiss"
    }} />
  );
}
