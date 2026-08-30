import { getDb } from "@/lib/db/index";
import { MICROSERVICES } from "@/lib/services/data";
import AdminServicesClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const db = await getDb();
  let metas: any[] = [];
  try {
    metas = await db.microserviceMeta.findMany();
  } catch (err) {
    console.error("Failed to load microserviceMeta:", err);
  }

  const metaMap: Record<string, any> = {};
  (metas || []).forEach((m: any) => {
    metaMap[m.slug] = m;
  });

  const services = MICROSERVICES.map((s) => {
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

  return <AdminServicesClient initialServices={services} />;
}
