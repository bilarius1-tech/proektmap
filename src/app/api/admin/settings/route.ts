import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  return NextResponse.json(settings || {});
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();

  // Map ALL settings fields to DB
  const fields = [
    "proPrice", "yookassaShopId", "yookassaSecretKey",
    "deepseekApiKey", "openrouterApiKey", "openrouterModel", "deepseekModel",
    "autoPublishEnabled", "autoPublishHour",
    "yandexMetrikaId", "yandexWebmasterId", "googleAnalyticsId",
    "seoTitle", "seoDescription", "seoKeywords",
    "headerCode", "footerCode",
    "assistantGreeting", "assistantHintInterval", "assistantProOnly",
    "siteName", "siteUrl",
    "accentColor", "headingFont", "bodyFont", "borderRadius", "designStyle",
  ];
  
  const update: any = {};
  for (const f of fields) {
    if (data[f] !== undefined) update[f] = data[f];
  }
  
  // Support old key names
  if (data.deepseekKey && data.deepseekKey !== "••••••••") update.deepseekApiKey = data.deepseekKey;
  if (data.openrouterKey && data.openrouterKey !== "••••••••") update.openrouterApiKey = data.openrouterKey;

  const settings = await db.siteSettings.upsert({
    where: { id: "main" },
    update,
    create: { ...update, id: "main" },
  });

  return NextResponse.json(settings);
}
