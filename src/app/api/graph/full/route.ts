import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  
  const nodes: any[] = [];
  const links: any[] = [];
  const nodeMap = new Map<string, boolean>();

  function addNode(id: string, name: string, type: string, group: string, extra: any = {}) {
    if (nodeMap.has(id)) return;
    nodeMap.set(id, true);
    nodes.push({ id, name, type, group, ...extra });
  }

  // Blueprints
  const blueprints = await db.blueprint.findMany({ where: { isPublished: true }, select: { id: true, title: true, slug: true, difficulty: true } });
  blueprints.forEach(b => addNode(b.slug, b.title, "blueprint", "Blueprint", { difficulty: b.difficulty }));

  // AI Tools
  const tools = await db.aITool.findMany({ where: { isActive: true }, select: { slug: true, name: true, type: true }, take: 30 });
  tools.forEach(t => addNode(t.slug, t.name, "aitool", "Инструмент", { toolType: t.type }));

  // Russian AI
  const russianAI = await db.russianAIProject.findMany({ where: { isPublished: true }, select: { slug: true, name: true, category: true }, take: 20 });
  russianAI.forEach(r => addNode("ru-" + r.slug, r.name, "russian-ai", "РФ AI", { category: r.category }));

  // Get all relations
  const relations = await db.relation.findMany({ take: 200 });
  relations.forEach(r => {
    const source = r.sourceType === "russian-ai" ? "ru-" + r.sourceSlug : r.sourceSlug;
    const target = r.targetType === "russian-ai" ? "ru-" + r.targetSlug : r.targetSlug;
    if (nodeMap.has(source) && nodeMap.has(target)) {
      links.push({ source, target, type: r.relType });
    }
  });

  return NextResponse.json({ nodes, links });
}
