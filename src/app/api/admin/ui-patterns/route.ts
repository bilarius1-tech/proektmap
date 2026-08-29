import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { UI_PATTERNS } from "@/app/ui-patterns/data";

// GET all pattern metas or merged pattern list
export async function GET() {
  try {
    const db = await getDb();
    const metas = await db.uiPatternMeta.findMany();
    const metaMap: Record<string, any> = {};
    (metas || []).forEach((m: any) => {
      metaMap[m.slug] = m;
    });

    // Последние добавленные всегда первые
    const merged = [...UI_PATTERNS].reverse().map((p) => {
      const meta = metaMap[p.slug];
      return {
        slug: p.slug,
        defaultTitle: p.titleRu,
        customTitle: meta?.customTitle || "",
        title: meta?.customTitle || p.titleRu,
        defaultDesc: p.shortDescription,
        customDesc: meta?.customDesc || "",
        description: meta?.customDesc || p.shortDescription,
        category: p.category,
        screenshot: meta?.screenshot || "",
        isPro: meta?.isPro || false,
        isFeatured: meta?.isFeatured || false,
        sortOrder: meta?.sortOrder ?? 0,
      };
    });

    return NextResponse.json({ patterns: merged, metas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST / PATCH to update or create pattern meta
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, customTitle, customDesc, screenshot, isPro, isFeatured, sortOrder } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const db = await getDb();
    const updated = await db.uiPatternMeta.upsert({
      where: { slug },
      update: {
        customTitle: customTitle !== undefined ? customTitle : undefined,
        customDesc: customDesc !== undefined ? customDesc : undefined,
        screenshot: screenshot !== undefined ? screenshot : undefined,
        isPro: isPro !== undefined ? Boolean(isPro) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
      },
      create: {
        slug,
        customTitle: customTitle || "",
        customDesc: customDesc || "",
        screenshot: screenshot || "",
        isPro: Boolean(isPro),
        isFeatured: Boolean(isFeatured),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, meta: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
