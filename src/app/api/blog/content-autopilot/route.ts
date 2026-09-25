import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import { runContentAutopilot } from "@/lib/blog/content-engine/autopilot";

export const maxDuration = 120;

export async function POST(req: Request) {
  const cronSecret = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret") || "";
  const isCron = Boolean(cronSecret && cronSecret === process.env.CRON_SECRET);

  if (!isCron) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const force =
    new URL(req.url).searchParams.get("force") === "1" ||
    (!isCron && new URL(req.url).searchParams.get("force") !== "0");

  try {
    const db = await getDb();
    const result = await runContentAutopilot(db, {
      force: Boolean(force),
      silent: false,
    });
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    console.error("[content-autopilot]", e);
    return NextResponse.json(
      { ok: false, error: String(e?.message || e).slice(0, 200) },
      { status: 500 },
    );
  }
}
