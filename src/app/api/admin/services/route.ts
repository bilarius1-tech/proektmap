import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { MICROSERVICES } from "@/lib/services/data";

// GET all microservices merged with DB meta
export async function GET() {
  try {
    const db = await getDb();
    const metas = await db.microserviceMeta.findMany();
    const metaMap: Record<string, any> = {};
    (metas || []).forEach((m: any) => {
      metaMap[m.slug] = m;
    });

    const merged = MICROSERVICES.map((s) => {
      const meta = metaMap[s.slug];
      return {
        slug: s.slug,
        defaultTitle: s.title,
        customTitle: meta?.customTitle || "",
        title: meta?.customTitle || s.title,
        defaultDesc: s.shortDescription,
        customDesc: meta?.customDesc || "",
        description: meta?.customDesc || s.shortDescription,
        category: s.category,
        coverImage: meta?.coverImage || s.coverImage || "",
        viewCount: meta?.viewCount || 0,
        useCount: meta?.useCount || 0,
        shareCount: meta?.shareCount || 0,
        isFeatured: meta?.isFeatured || false,
        sortOrder: meta?.sortOrder ?? 0,
        status: s.status,
      };
    });

    return NextResponse.json({ services: merged, metas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST / PATCH to update microservice meta
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, customTitle, customDesc, coverImage, isFeatured, sortOrder } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const db = await getDb();
    const updated = await db.microserviceMeta.upsert({
      where: { slug },
      create: {
        slug,
        customTitle: customTitle ?? "",
        customDesc: customDesc ?? "",
        coverImage: coverImage ?? "",
        isFeatured: isFeatured ?? false,
        sortOrder: sortOrder ?? 0,
      },
      update: {
        ...(customTitle !== undefined && { customTitle }),
        ...(customDesc !== undefined && { customDesc }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({ success: true, meta: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
