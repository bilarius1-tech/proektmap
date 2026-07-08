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

  // Map settings to DB fields
  const update: any = {};
  if (data.proPrice !== undefined) update.proPrice = data.proPrice;
  if (data.yookassaShopId !== undefined) update.yookassaShopId = data.yookassaShopId;
  if (data.yookassaSecretKey !== undefined) update.yookassaSecretKey = data.yookassaSecretKey;
  
  // Store AI keys and blog settings as JSON or in env-compatible way
  // We'll store them in separate fields or use the existing settings model
  // For now, store as env variables via process
  if (data.deepseekKey && data.deepseekKey !== "••••••••") {
    update.deepseekApiKey = data.deepseekKey;
    process.env.DEEPSEEK_API_KEY = data.deepseekKey;
  }
  if (data.openrouterKey && data.openrouterKey !== "••••••••") {
    update.openrouterApiKey = data.openrouterKey;
    process.env.OPENROUTER_API_KEY = data.openrouterKey;
  }
  if (data.openrouterModel) update.openrouterModel = data.openrouterModel;
  if (data.deepseekModel) update.deepseekModel = data.deepseekModel;
  if (data.autoPublishEnabled !== undefined) update.autoPublishEnabled = data.autoPublishEnabled;
  if (data.autoPublishHour !== undefined) update.autoPublishHour = data.autoPublishHour;

  const settings = await db.siteSettings.upsert({
    where: { id: "main" },
    update,
    create: { ...update, id: "main" },
  });

  return NextResponse.json(settings);
}
