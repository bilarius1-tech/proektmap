import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST() {
  const db = await getDb();
  const jobs = await db.autoPublish.findMany({ where: { isActive: true } });
  
  if (jobs.length === 0) {
    return NextResponse.json({ message: "Нет активных заданий" });
  }

  const results: any[] = [];
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) return NextResponse.json({ error: "Админ не найден" }, { status: 500 });

  for (const job of jobs) {
    try {
      const prompt = `Напиши статью для блога на русском языке. Тема: ${job.topic}. 800-1200 слов, 3-5 H2, практическая польза. Markdown.`;

      const key = process.env.DEEPSEEK_API_KEY;
      if (!key) { results.push({ topic: job.topic, status: "skipped", reason: "Нет DEEPSEEK_API_KEY" }); continue; }

      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 3000 }),
      });

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) { results.push({ topic: job.topic, status: "error" }); continue; }

      const titleMatch = content.match(/^# (.+)/m);
      const title = titleMatch ? titleMatch[1] : job.topic;
      const slug = title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "");
      const excerpt = content.split("\n").find((l: string) => l.length > 50 && !l.startsWith("#"))?.slice(0, 200) || "";

      let cat = await db.blogCategory.findFirst({ where: { name: job.category } });
      if (!cat) cat = await db.blogCategory.create({ data: { name: job.category, slug: job.category.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-") } });

      await db.blogPost.create({
        data: { title, slug, content, excerpt, status: "draft", authorId: admin.id,
          categoryId: cat.id, tags: job.category, aiGenerated: true, aiModel: "deepseek-chat",
          metaTitle: title + " — Карта роста", metaDesc: excerpt },
      });

      await db.autoPublish.update({ where: { id: job.id }, data: { lastRunAt: new Date() } });
      results.push({ topic: job.topic, status: "draft", title });
    } catch (e: any) {
      results.push({ topic: job.topic, status: "error", reason: e.message });
    }
  }

  return NextResponse.json({ results });
}
