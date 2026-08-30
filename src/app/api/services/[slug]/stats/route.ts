import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getMicroserviceBySlug } from "@/lib/services/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = getMicroserviceBySlug(slug);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  try {
    const db = await getDb();
    const meta = await db.microserviceMeta.findUnique({
      where: { slug },
      select: { viewCount: true, useCount: true, shareCount: true },
    });

    return NextResponse.json({
      viewCount: meta?.viewCount || 0,
      useCount: meta?.useCount || 0,
      shareCount: meta?.shareCount || 0,
    });
  } catch (err) {
    console.error("Failed to get microservice stats:", err);
    return NextResponse.json({ viewCount: 0, useCount: 0, shareCount: 0 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = getMicroserviceBySlug(slug);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "view"; // "view" | "share" | "use"

    const db = await getDb();
    
    let updateData: any = {};
    if (action === "share") {
      updateData = { shareCount: { increment: 1 } };
    } else if (action === "use") {
      updateData = { useCount: { increment: 1 } };
    } else {
      updateData = { viewCount: { increment: 1 } };
    }

    const updated = await db.microserviceMeta.upsert({
      where: { slug },
      create: {
        slug,
        viewCount: action === "view" ? 1 : 0,
        shareCount: action === "share" ? 1 : 0,
        useCount: action === "use" ? 1 : 0,
      },
      update: updateData,
      select: { viewCount: true, useCount: true, shareCount: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update microservice stats:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
