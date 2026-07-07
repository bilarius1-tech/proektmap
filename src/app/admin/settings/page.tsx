import { getDb } from "@/lib/db";
import SettingsForm from "./form";

export default async function SettingsPage() {
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-xs)" }}>Настройки сайта</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-xl)" }}>Цены, SEO, коды</p>
      <SettingsForm settings={settings ? JSON.parse(JSON.stringify(settings)) : { proPrice: 300 }} />
    </div>
  );
}
