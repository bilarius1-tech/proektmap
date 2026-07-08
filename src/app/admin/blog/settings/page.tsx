import { getDb } from "@/lib/db/index";
import BlogSettingsClient from "./client";

export const dynamic = "force-dynamic";

export default async function BlogSettingsPage() {
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const feeds = await db.blogFeed.count();
  const posts = await db.blogPost.count();
  const drafts = await db.blogPost.count({ where: { status: "draft" } });

  return (
    <BlogSettingsClient
      settings={JSON.parse(JSON.stringify(settings || {}))}
      stats={{ feeds, posts, drafts }}
    />
  );
}
