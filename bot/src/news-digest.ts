import { Bot } from "grammy";
import cron from "node-cron";
import { CONFIG } from "./config";
import { askDeepSeek } from "./ai";

const SYSTEM = `Ты — редактор еженедельного дайджеста ProektMap («Карта роста»).
Аудитория: AI-инженеры и авитологи / коммерсанты в России.
Суммируй ТОЛЬКО переданные статьи. Не выдумывай факты.
Пиши на русском, коротко, без канцелярита и без технических ошибок.
Формат строго такой (без лишних блоков):

🗓 Дайджест недели · Карта роста

🔥 Главное
• один пункт — что изменилось и зачем это читателю

🛠 Авито / коммерция
• одна автоматизация для продавца (если среди статей нет Авито — напиши «на этой неделе без новой автоматизации» и дай ссылку на https://proektmap.ru/blog)

💡 Лайфхак
• один приём с сайта

📚 На сайте
• заголовок — url
• заголовок — url

В конце: Читать всё → https://proektmap.ru/blog`;

type RssPost = { title: string; link: string; excerpt: string; pubDate: Date };

function decodeEntities(s: string): string {
  return (s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function stripHtml(s: string): string {
  return decodeEntities(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseWeekPosts(xml: string, since: Date): RssPost[] {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  const items: RssPost[] = [];
  for (const block of blocks) {
    const title = decodeEntities(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").trim();
    const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "").trim();
    const excerpt = stripHtml(block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "").slice(0, 180);
    const pubRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
    const pubDate = pubRaw ? new Date(pubRaw) : new Date(0);
    if (title && link && pubDate >= since) items.push({ title, link, excerpt, pubDate });
  }
  return items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

function fallbackDigest(posts: RssPost[]): string {
  const shown = posts.slice(0, 6);
  const lines = shown.map((p) => `• ${p.title}\n  ${p.link}`);
  return (
    `🗓 Дайджест недели · Карта роста\n\n` +
    lines.join("\n\n") +
    `\n\nЧитать всё → https://proektmap.ru/blog`
  );
}

export async function runNewsDigest(bot: Bot): Promise<string> {
  try {
    const res = await fetch(CONFIG.rssUrl, {
      headers: { "User-Agent": "ProektMapBot/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error("News digest RSS HTTP", res.status);
      return "";
    }

    const since = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    const posts = parseWeekPosts(await res.text(), since);
    if (posts.length === 0) {
      console.log("News digest: за неделю нет новых статей");
      return "";
    }

    const raw = posts
      .slice(0, 12)
      .map((p) => `- ${p.title}\n  ${p.excerpt}\n  ${p.link}`)
      .join("\n");
    const summary = await askDeepSeek(SYSTEM, `Статьи за неделю:\n${raw}`, 900, 0.35);
    const text = summary || fallbackDigest(posts);

    for (const ch of CONFIG.channels) {
      await bot.api.sendMessage(ch, text, { link_preview_options: { is_disabled: false } });
    }
    console.log("Пятничный дайджест опубликован:", posts.length, "статей");
    return text;
  } catch (e) {
    console.error("News digest error:", (e as Error).message);
    return "";
  }
}

export function startNewsDigestSchedule(bot: Bot): void {
  cron.schedule("0 18 * * 5", () => runNewsDigest(bot).catch((e) => console.error(e)), {
    timezone: "Europe/Moscow",
  });
  console.log("Расписание новостного дайджеста: пятница 18:00 MSK");
}
