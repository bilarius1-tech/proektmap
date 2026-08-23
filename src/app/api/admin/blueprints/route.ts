import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { syncBlueprintsToMenu } from "@/lib/sync-blueprints-menu";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const bp = await db.blueprint.create({
    data: {
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
      description: data.description || "",
      icon: data.icon || "Globe",
      difficulty: data.difficulty || "easy",
      isPublished: data.isPublished ?? false,
      sortOrder: data.sortOrder || 0,
      coverImage: data.coverImage || "",
      goal: data.goal || "",
      timeToComplete: data.timeToComplete || "",
      targetAudience: data.targetAudience || "",
    },
  });
  syncBlueprintsToMenu().catch(e => console.error("Menu sync failed:", e));
  return NextResponse.json({ ok: true, blueprint: bp });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.blueprint.update({ where: { id }, data });
  syncBlueprintsToMenu().catch(e => console.error("Menu sync failed:", e));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.blueprint.delete({ where: { id } });
  syncBlueprintsToMenu().catch(e => console.error("Menu sync failed:", e));
  return NextResponse.json({ ok: true });
}
