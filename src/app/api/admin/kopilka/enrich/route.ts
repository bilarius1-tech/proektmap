import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/kopilka/auth";
import { enrichDesignUrl } from "@/lib/kopilka/enrich";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  let url = String(body.url || "").trim();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Некорректный URL" }, { status: 400 });
  }

  const db = await getDb();
  let categoryTitle = body.categoryTitle as string | undefined;
  if (body.categoryId && !categoryTitle) {
    const cat = await db.designBankCategory.findUnique({ where: { id: body.categoryId } });
    categoryTitle = cat?.title;
  }

  try {
    const enriched = await enrichDesignUrl(url, categoryTitle);
    return NextResponse.json({ url, ...enriched });
  } catch (e) {
    return NextResponse.json(
      { error: `Не удалось разобрать ссылку: ${(e as Error).message}` },
      { status: 502 }
    );
  }
}
