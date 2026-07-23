import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET — returns all steps ordered by sortOrder
export async function GET() {
  try {
    const db = await getDb();
    const steps = await db.questStep.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(steps);
  } catch (error) {
    console.error("GET /api/quest/beginner error:", error);
    return NextResponse.json({ error: "Failed to fetch steps" }, { status: 500 });
  }
}

// POST — creates or updates a step (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const db = await getDb();

    if (data.id) {
      // Update existing
      const { id, ...fields } = data;
      const updated = await db.questStep.update({
        where: { id },
        data: fields,
      });
      return NextResponse.json(updated);
    } else {
      // Create new
      const created = await db.questStep.create({
        data: {
          step: data.step,
          title: data.title,
          detail: data.detail || "",
          checklist: data.checklist || "[]",
          why: data.why || "",
          prompt: data.prompt || "",
          sortOrder: data.sortOrder || 0,
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("POST /api/quest/beginner error:", error);
    return NextResponse.json({ error: "Failed to save step" }, { status: 500 });
  }
}
