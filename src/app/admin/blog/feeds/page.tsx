import { getDb } from "@/lib/db/index";
import FeedsClient from "./client";

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  const db = await getDb();
  const feeds = await db.blogFeed.findMany({ orderBy: { createdAt: "desc" } });
  return <FeedsClient feeds={JSON.parse(JSON.stringify(feeds))} />;
}
