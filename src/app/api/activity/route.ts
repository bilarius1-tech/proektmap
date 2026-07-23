import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const db = await getDb();
  const [newTerms, newPatterns, newMcp, newPrompts] = await Promise.all([
    db.glossaryTerm.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 3, select: { term: true, slug: true, createdAt: true } }),
    db.buildPattern.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 2, select: { title: true, slug: true, createdAt: true } }),
    db.mCPServer.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 2, select: { name: true, slug: true, createdAt: true } }),
    db.promptBlueprint.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 2, select: { title: true, slug: true, createdAt: true } }),
  ]);

  const feed = [
    ...newTerms.map((t: any) => ({ type: "glossary", title: t.term, slug: t.slug, href: "/glossary/" + t.slug, date: t.createdAt })),
    ...newPatterns.map((p: any) => ({ type: "pattern", title: p.title, slug: p.slug, href: "/patterns/" + p.slug, date: p.createdAt })),
    ...newMcp.map((m: any) => ({ type: "mcp", title: m.name, slug: m.slug, href: "/mcp/" + m.slug, date: m.createdAt })),
    ...newPrompts.map((p: any) => ({ type: "prompt", title: p.title, slug: p.slug, href: "/prompts", date: p.createdAt })),
  ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return NextResponse.json({ feed });
}
