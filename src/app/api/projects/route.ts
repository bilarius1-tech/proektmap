import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const db = await getDb();

  const project = await db.project.create({
    data: {
      userId: (session.user as any).id,
      blueprintId: data.blueprintId,
      name: data.name || "",
      description: data.description || "",
      domain: data.domain || "",
      stack: data.stack || "",
      niche: data.niche || "",
      colors: data.colors || "",
      goals: data.goals || "",
    },
  });

  return NextResponse.json(project);
}
