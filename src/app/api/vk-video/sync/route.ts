import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { syncVkVideosToDb } from "@/lib/vk-video";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  const cronSecret = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret") || "";
  const isCron = Boolean(process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET);

  if (!isCron) {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const db = await getDb();
    const result = await syncVkVideosToDb(db, { maxPerChannel: 120 });
    if (!result.hasToken) {
      return NextResponse.json(
        {
          ...result,
          hint: "Добавьте VK_SERVICE_TOKEN в .env — инструкция docs/VK-VIDEO.md",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("[vk-video/sync]", e?.message || e);
    return NextResponse.json({ error: e?.message || "sync failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
