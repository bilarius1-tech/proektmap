import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import { resolveCover } from "@/lib/og/providers";
import {
  appendFaq,
  buildSeoPrompt,
  InternalLinkCandidate,
  parseSeoArticle,
  parseSeoKeywords,
  sanitizeArticleHtml,
  scoreSeoArticle,
  SeoArticle,
} from "@/lib/blog/seo-pipeline";

function translit(text: string): string {
  const map: any = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
  return text.toLowerCase().split("").map((c: string) => map[c] || c).join("");
}

// Parse RSS/XML properly using simple regex that handles CDATA
function parseXmlItems(xml: string): { title: string; link: string; description: string }[] {
  const items: any[] = [];
  // Try <item> tags (RSS) first, then <entry> (Atom)
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (const block of blocks.slice(0, 5)) {
    const title = (block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
    const link = block.match(/<link[^>]*>(.*?)<\/link>/i)?.[1] || block.match(/<link[^>]*href="([^"]*)"/i)?.[1] || "";
    const desc = (block.match(/<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i)?.[1] || block.match(/<summary[^>]*>(.*?)<\/summary>/i)?.[1] || "").replace(/\s+/g, " ").trim();
    if (title) items.push({ title, link, description: desc.slice(0, 500) });
  }
  return items;
}

// Clean slug: keep only latin, digits, hyphens
function cleanSlug(title: string): string {
  const clean = title.replace(/[^a-zа-я0-9\s-]/gi, "").trim();
  return translit(clean).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

function sourceMarker(url: string): string {
  return `<!-- source:${encodeURIComponent(url)} -->`;
}

function seoCommentValue(value: string): string {
  return encodeURIComponent(value).slice(0, 300);
}

function rankInternalLinks(candidates: InternalLinkCandidate[], query: string): InternalLinkCandidate[] {
  const tokens = query.toLocaleLowerCase("ru").replace(/ё/g, "е").match(/[a-zа-я0-9]{3,}/g) || [];
  return candidates
    .map((candidate) => {
      const haystack = `${candidate.title} ${candidate.description}`.toLocaleLowerCase("ru").replace(/ё/g, "е");
      const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 35)
    .map(({ candidate }) => candidate);
}

async function getInternalLinkCatalog(db: any): Promise<InternalLinkCandidate[]> {
  const [tools, glossary, blueprints, solutions, skills, patterns, posts] = await Promise.all([
    db.aITool.findMany({ where: { isActive: true }, select: { name: true, slug: true, shortDescription: true }, take: 60 }),
    db.glossaryTerm.findMany({ where: { isPublished: true }, select: { term: true, slug: true, simpleExplanation: true }, take: 60 }),
    db.blueprint.findMany({ where: { isPublished: true }, select: { title: true, slug: true, description: true }, take: 40 }),
    db.solution.findMany({ where: { isPublished: true }, select: { title: true, slug: true, summary: true }, take: 40 }),
    db.skill.findMany({ where: { isPublished: true }, select: { title: true, slug: true, description: true }, take: 40 }),
    db.buildPattern.findMany({ where: { isPublished: true }, select: { title: true, slug: true, description: true }, take: 40 }),
    db.blogPost.findMany({ where: { status: "published" }, select: { title: true, slug: true, excerpt: true }, orderBy: { publishedAt: "desc" }, take: 40 }),
  ]);

  const candidates: InternalLinkCandidate[] = [
    { title: "Каталог AI-инструментов", url: "/ai-tools", description: "Выбор AI-инструментов под задачу" },
    { title: "Blueprint'ы", url: "/blueprints", description: "Пошаговые маршруты создания проектов" },
    { title: "Библиотека промптов", url: "/prompts", description: "Готовые промпты и шаблоны запросов" },
    ...tools.map((item: any) => ({ title: item.name, url: `/ai-tools/${item.slug}`, description: item.shortDescription })),
    ...glossary.map((item: any) => ({ title: item.term, url: `/glossary/${item.slug}`, description: item.simpleExplanation })),
    ...blueprints.map((item: any) => ({ title: item.title, url: `/blueprints/${item.slug}`, description: item.description || "" })),
    ...solutions.map((item: any) => ({ title: item.title, url: `/solutions/${item.slug}`, description: item.summary })),
    ...skills.map((item: any) => ({ title: item.title, url: `/skills/${item.slug}`, description: item.description })),
    ...patterns.map((item: any) => ({ title: item.title, url: `/patterns/${item.slug}`, description: item.description })),
    ...posts.map((item: any) => ({ title: item.title, url: `/blog/${item.slug}`, description: item.excerpt })),
  ].filter((item) => item.title && item.url && !item.url.endsWith("/"));

  return candidates;
}

async function generateSeoArticle(input: {
  key: string;
  model: string;
  sourceTitle: string;
  sourceDescription: string;
  sourceUrl: string;
  category: string;
  siteKeywords: string[];
  internalLinks: InternalLinkCandidate[];
  revision?: { article: SeoArticle; check: ReturnType<typeof scoreSeoArticle> };
}): Promise<SeoArticle> {
  const aiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${input.key}` },
    body: JSON.stringify({
      model: input.model,
      messages: [
        {
          role: "system",
          content: "Ты создаёшь самостоятельные SEO-материалы из новостных источников. Отвечай только валидным JSON без Markdown.",
        },
        { role: "user", content: buildSeoPrompt(input) },
      ],
      max_tokens: 8000,
      temperature: input.revision ? 0.25 : 0.4,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!aiRes.ok) {
    throw new Error(`DeepSeek API ${aiRes.status}: ${(await aiRes.text().catch(() => "")).slice(0, 100)}`);
  }

  const aiData = await aiRes.json();
  return parseSeoArticle(aiData.choices?.[0]?.message?.content || "");
}

function mskNow(): { hour: number; minute: number } {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false });
  const parts = fmt.formatToParts(new Date());
  const hour = Number(parts.find((x) => x.type === 'hour')?.value ?? '0') % 24;
  const minute = Number(parts.find((x) => x.type === 'minute')?.value ?? '0');
  return { hour, minute };
}

function buildReport(results: any[], totalCreated: number, startedAt: number): string {
  const queued = results.filter((r) => r.status === 'queued');
  const errors = results.filter((r) => r.status === 'error');
  const rejected = results.filter((r) => r.status === 'seo_rejected');
  const lines = [
    '📰 Авто-сбор завершён — статьи в очереди',
    'В очередь: ' + totalCreated,
    'Ошибок источников: ' + errors.length,
    'Отклонено по SEO: ' + rejected.length,
    'Время: ' + ((Date.now() - startedAt) / 60000).toFixed(1) + ' мин',
  ];
  if (queued.length) {
    lines.push('', 'Новые статьи:');
    for (const p of queued.slice(0, 10)) lines.push('• ' + p.title);
  }
  if (errors.length) {
    lines.push('', 'Ошибки:');
    for (const e of errors.slice(0, 5)) lines.push('• ' + e.feed + ': ' + e.reason);
  }
  return lines.join(String.fromCharCode(10));
}

async function sendTelegramReport(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_REPORT_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID || '';
  if (!token || !chatId) return;
  try {
    await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    console.error('[auto-publish] tg report:', e);
  }
}

export async function POST(req: Request) {
  // Cron secret — bypasses auth for automated runs
  const cronSecret = req.headers.get('x-cron-secret') || new URL(req.url).searchParams.get('secret') || '';
  const isCron = cronSecret === process.env.CRON_SECRET && process.env.CRON_SECRET;

  // Auth check (skip for cron)
  if (!isCron) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const db = await getDb();

  let settings: any = null;
  try { settings = await db.siteSettings.findUnique({ where: { id: 'main' } }); } catch (e) {}

  let dripResult: any = { published: false, reason: 'none' };
  try {
    const intervalMin = settings?.autoPublishIntervalMin ?? 45;
    const lastDrip = settings?.lastDripPublishedAt;
    if (!lastDrip || Date.now() - new Date(lastDrip).getTime() >= intervalMin * 60 * 1000) {
      const nextPost = await db.blogPost.findFirst({ where: { status: 'queued' }, orderBy: { createdAt: 'asc' } });
      if (nextPost) {
        await db.blogPost.update({ where: { id: nextPost.id }, data: { status: 'published', publishedAt: new Date() } });
        await db.siteSettings.update({ where: { id: 'main' }, data: { lastDripPublishedAt: new Date() } });
        dripResult = { published: true, slug: nextPost.slug, title: nextPost.title };
      } else {
        dripResult = { published: false, reason: 'empty-queue' };
      }
    } else {
      dripResult = { published: false, reason: 'interval-not-elapsed' };
    }
  } catch (e) {
    dripResult = { published: false, reason: 'error' };
  }
  if (settings?.autoPublishEnabled !== true) return NextResponse.json({ drip: dripResult, collection: { scheduled: false, reason: 'disabled' } });
  const now = mskNow();
  if (now.hour !== (settings?.autoPublishHour ?? 9) && now.hour !== (settings?.autoPublishEveningHour ?? 20)) {
    return NextResponse.json({ drip: dripResult, collection: { scheduled: false, reason: 'off-hours', hour: now.hour } });
  }
  const lastRun = settings?.autoPublishLastRunAt;
  if (lastRun && Date.now() - new Date(lastRun).getTime() < 45 * 60 * 1000) {
    return NextResponse.json({ drip: dripResult, collection: { scheduled: false, reason: 'recent-run' } });
  }
  const stale = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const claimed = await db.siteSettings.updateMany({
    where: { id: 'main', OR: [{ autoPublishRunning: false }, { autoPublishLastRunAt: { lt: stale } }] },
    data: { autoPublishRunning: true, autoPublishLastRunAt: new Date() },
  });
  if (claimed.count === 0) return NextResponse.json({ drip: dripResult, collection: { started: false, reason: 'already-running' } });
  const startedAt = Date.now();

  void (async () => {
  try {

  const feeds = await db.blogFeed.findMany({ where: { isActive: true } });
  const admin = await db.user.findFirst({ where: { role: "admin" } });
    if (!admin) return;

  let key = process.env.DEEPSEEK_API_KEY || "";
  let model = "deepseek-chat";
  let itemsPerFeed = 2;
  let siteKeywords: string[] = [];
  try {
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (settings?.deepseekApiKey) key = settings.deepseekApiKey;
    if (settings?.deepseekModel) model = settings.deepseekModel;
    if (settings?.autoPublishItemsPerFeed) itemsPerFeed = settings.autoPublishItemsPerFeed;
    siteKeywords = parseSeoKeywords(settings?.seoKeywords || "");
  } catch {}
    if (!key) return;
  const internalLinkCatalog = await getInternalLinkCatalog(db);

  const results: any[] = [];
  let totalCreated = 0;

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, {
        headers: { "Accept": feed.type === "xml" ? "application/xml,text/xml" : "application/json", "User-Agent": "ProektMap/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        results.push({ feed: feed.name, status: "error", reason: `HTTP ${res.status}` });
        continue;
      }

      const raw = await res.text();
      if (!raw || raw.length < 50) {
        results.push({ feed: feed.name, status: "empty" });
        continue;
      }

      let items: { title: string; link: string; description: string; image?: string }[] = [];

      if (feed.type === "json") {
        try {
          const json = JSON.parse(raw);
          if (json.hits) {
            items = json.hits.map((h: any) => ({ title: h.title || h.story_title || "", link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, description: (h.story_text || h.comment_text || "").slice(0, 500) }));
          } else if (json.data?.children) {
            items = json.data.children.map((c: any) => { const d = c.data; return { title: d.title, link: `https://reddit.com${d.permalink}`, description: (d.selftext || "").slice(0, 500), image: d.thumbnail?.startsWith("http") ? d.thumbnail : d.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") }; });
          } else if (json.items) {
            items = json.items.slice(0, 5).map((i: any) => ({ title: i.full_name || i.name, link: i.html_url || i.url, description: (i.description || "").slice(0, 500), image: i.owner?.avatar_url || null }));
          } else if (Array.isArray(json)) {
            items = json.slice(0, 5).map((i: any) => ({ title: i.title || i.name || "", link: i.url || i.link || "", description: (i.description || i.summary || "").slice(0, 500) }));
          }
        } catch (e: any) {
          results.push({ feed: feed.name, status: "error", reason: "JSON parse: " + (e.message?.slice(0, 50) || "unknown") });
          continue;
        }
      } else {
        items = parseXmlItems(raw);
      }

      // Filter out items with titles that are too short or just URLs
      items = items.filter(i => i.title && i.title.length >= 10 && i.link && !/^https?:\/\//.test(i.title));

      if (items.length === 0) {
        results.push({ feed: feed.name, status: "empty" });
        continue;
      }

      let feedCreated = 0;
      for (const item of items.slice(0, itemsPerFeed)) {
        try {
          // Better duplicate detection: check slug first, then link in metaDesc
          const candidateSlug = cleanSlug(item.title);
          const slugExists = await db.blogPost.findUnique({ where: { slug: candidateSlug } });
          if (slugExists) continue;

          if (item.link) {
            const linkExists = await db.blogPost.findFirst({
              where: {
                OR: [
                  { content: { contains: sourceMarker(item.link) } },
                  { content: { contains: `href="${item.link}"` } },
                ],
              },
              select: { id: true },
            });
            if (linkExists) continue;
          }

          // Обложка: RSS-thumbnail (2-й источник) → SVG-движок (фолбэк)
          let coverImage = `/api/og?title=${encodeURIComponent(item.title.slice(0, 80))}&category=${encodeURIComponent(feed.category)}`;
          try {
            const cover = await resolveCover({
              title: item.title.slice(0, 80),
              category: feed.category,
              tags: feed.category.replace(/[^a-zA-Zа-яА-ЯёЁ,]/g, "").split(",").filter(Boolean),
              thumbnailUrl: item.image || undefined,
            });
            coverImage = cover.url;
          } catch {}

          const internalLinks = rankInternalLinks(internalLinkCatalog, `${item.title} ${item.description} ${feed.category}`);
          const allowedInternalUrls = internalLinks.map((link) => link.url);

          let article = await generateSeoArticle({
            key,
            model,
            sourceTitle: item.title,
            sourceDescription: item.description,
            sourceUrl: item.link,
            category: feed.category,
            siteKeywords,
            internalLinks,
          });
          article.html = sanitizeArticleHtml(article.html);
          let seoCheck = scoreSeoArticle(article, item.link, allowedInternalUrls, item.description);

          // Один редакторский проход: статья ниже 70/100 не публикуется автоматически.
          if (seoCheck.score < 70) {
            article = await generateSeoArticle({
              key,
              model,
              sourceTitle: item.title,
              sourceDescription: item.description,
              sourceUrl: item.link,
              category: feed.category,
              siteKeywords,
              internalLinks,
              revision: { article, check: seoCheck },
            });
            article.html = sanitizeArticleHtml(article.html);
            seoCheck = scoreSeoArticle(article, item.link, allowedInternalUrls, item.description);
          }

          if (seoCheck.score < 70) {
            results.push({
              feed: feed.name,
              title: item.title.slice(0, 60),
              status: "seo_rejected",
              seoScore: seoCheck.score,
              missing: seoCheck.missing,
            });
            continue;
          }

          const title = article.title;
          const metaDesc = article.metaDesc.slice(0, 170);
          const content = `${sourceMarker(item.link)}<!-- seo-score:${seoCheck.score}; type:${seoCommentValue(article.contentType)}; intent:${seoCommentValue(article.intent)}; primary:${seoCommentValue(article.primaryKeyword)} -->${appendFaq(article.html, article.faq)}`;
          const excerpt = metaDesc;
          const slug = cleanSlug(title);
          if (!slug) continue;
          if (await db.blogPost.findUnique({ where: { slug }, select: { id: true } })) continue;

          // Ensure category exists
          let cat = await db.blogCategory.findFirst({ where: { name: feed.category } });
          if (!cat) cat = await db.blogCategory.create({ data: { name: feed.category, slug: feed.category.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").slice(0, 50) } });

          await db.blogPost.create({
            data: {
              title, slug, content, excerpt, coverImage,
              status: "queued", authorId: admin.id, categoryId: cat.id,
              tags: [feed.category, article.contentType, article.primaryKeyword, ...article.secondaryKeywords.slice(0, 5)].filter(Boolean).join(","),
              aiGenerated: true, aiModel: model,
              metaTitle: article.metaTitle, metaDesc,
            },
          });

          feedCreated++;
          totalCreated++;
          results.push({
            feed: feed.name,
            title: title.slice(0, 60),
            slug,
            status: "queued",
            contentType: article.contentType,
            primaryKeyword: article.primaryKeyword,
            seoScore: seoCheck.score,
            seoCheck: seoCheck.checks,
          });
        } catch (itemErr: any) {
          results.push({ feed: feed.name, title: item.title?.slice(0, 40), status: "error", reason: itemErr.message?.slice(0, 60) });
        }
      }

      await db.blogFeed.update({ where: { id: feed.id }, data: { lastFetched: new Date() } });
      if (feedCreated === 0 && results.filter(r => r.feed === feed.name && r.status === "error").length === 0) {
        results.push({ feed: feed.name, status: "dup", reason: "all duplicates" });
      }
    } catch (feedErr: any) {
      results.push({ feed: feed.name, status: "error", reason: (feedErr.message || "unknown").slice(0, 80) });
    }
  }

  await sendTelegramReport(buildReport(results, totalCreated, startedAt));
  } catch (e: any) {
    console.error('[auto-publish] run:', e?.message || e);
    await sendTelegramReport('📰 Авто-публикация: ошибка' + String.fromCharCode(10) + (e?.message || String(e)));
  } finally {
    try { await db.siteSettings.update({ where: { id: 'main' }, data: { autoPublishRunning: false } }); } catch (e) {}
  }
  })();

  return NextResponse.json({ drip: dripResult, collection: { scheduled: true, started: true } });
}
