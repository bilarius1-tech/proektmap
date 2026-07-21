import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";


async function translateToRussian(text: string): Promise<string> {
  if (!text || text.length < 10) return text;
  try {
    const db = await getDb();
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    const apiKey = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return text;

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Ты переводчик технических текстов. Переведи описание MCP-сервера на русский язык кратко и точно. Верни ТОЛЬКО перевод, без пояснений." },
          { role: "user", content: text.substring(0, 500) }
        ],
        max_tokens: 300,
        temperature: 0.1,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch { return text; }
}


export async function POST() {
  const db = await getDb();
  const log: string[] = [];
  let found = 0, added = 0, updated = 0;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'ProektMap-MCP',
  };

  try {
    const queries = ['topic:mcp-server+stars:>50', 'mcp+server+stars:>100'];
    let repos: any[] = [];
    for (const q of queries) {
      const u = 'https://api.github.com/search/repositories?q=' + q + '&sort=stars&order=desc&per_page=30';
      const r = await fetch(u, { headers });
      if (r.status === 403) { log.push('Rate limit. Add GITHUB_TOKEN.'); break; }
      const d = await r.json();
      if (d.items) { repos.push(...d.items); log.push('Found ' + d.items.length + ' from ' + q); }
      await new Promise(r => setTimeout(r, 1500));
    }

    const seen = new Set<string>();
    repos = repos.filter((r: any) => seen.has(r.full_name) ? false : seen.add(r.full_name));
    found = repos.length;

    for (const repo of repos.slice(0, 40)) {
      try {
        const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const ex = await db.mCPServer.findFirst({ where: { slug } });
        if (ex) {
          await db.mCPServer.update({ where: { id: ex.id }, data: { stars: repo.stargazers_count } });
          await db.mCPTrend.create({ data: { serverId: ex.id, stars: repo.stargazers_count, recordedAt: new Date() } }).catch(() => {});
          updated++;
        } else {
          const topics = (repo.topics || []).map((t: string) => t.toLowerCase());
          let cat = 'Разработка';
          if (topics.some((t: string) => t.includes('database')||t.includes('sql'))) cat='Базы данных';
          else if (topics.some((t: string) => t.includes('search')||t.includes('web'))) cat='Поиск';
          else if (topics.some((t: string) => t.includes('file')||t.includes('storage'))) cat='Файлы';
          else if (topics.some((t: string) => t.includes('git'))) cat='Git';
          else if (topics.some((t: string) => t.includes('browser'))) cat='Браузер';
          else if (topics.some((t: string) => t.includes('slack')||t.includes('telegram'))) cat='Коммуникации';
          else if (topics.some((t: string) => t.includes('llm')||t.includes('memory'))) cat='AI и память';
          else if (topics.some((t: string) => t.includes('cloud')||t.includes('aws'))) cat='Облако';
          else if (topics.some((t: string) => t.includes('finance')||t.includes('payment'))) cat='Бизнес';

          await db.mCPServer.create({
            data: {
              name: repo.name, slug,
              description: (repo.description||'').substring(0,200),
              longDescription: repo.description||'',
              category: cat,
              tags: (repo.topics||[]).filter((t:string)=>!['mcp','mcp-server'].includes(t)).join(','),
              githubUrl: repo.html_url,
              stars: repo.stargazers_count,
              rating: Math.min(10,Math.max(4,Math.floor(repo.stargazers_count/500)+5)),
              difficulty: repo.stargazers_count>5000?'medium':'easy',
              russianDocs:false,
              requiresApiKey:(repo.description||'').toLowerCase().includes('api key'),
              isActive:true,
              sortOrder:100+repos.indexOf(repo),
            }
          });
          added++;
        }
      } catch(e) {}
      await new Promise(r => setTimeout(r, 200));
    }

    log.push('Done: +'+added+' new, '+updated+' updated, '+found+' total');
    return NextResponse.json({ success: true, found, added, updated, log });
  } catch(e: any) {
    return NextResponse.json({ error: e.message, log }, { status: 500 });
  }
}
