import { Bot } from "grammy";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { CONFIG } from "./config";

const STATE_FILE = join(CONFIG.stateDir, "posted-guids.json");
const POLL_INTERVAL_MS = 3 * 60 * 1000; // 3 минуты

interface RssItem {
  guid: string;
  title: string;
  link: string;
  excerpt: string;
  image: string;
}

function loadState(): string[] {
  if (!existsSync(STATE_FILE)) return [];
  try {
    const arr = JSON.parse(readFileSync(STATE_FILE, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveState(guids: string[]): void {
  mkdirSync(CONFIG.stateDir, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(guids, null, 2));
}

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

function parseRss(xml: string): RssItem[] {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  const items: RssItem[] = [];
  for (const block of blocks) {
    const guid = block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim() || "";
    const title = decodeEntities(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").trim();
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || "";
    const excerpt = stripHtml(block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "").slice(0, 220);
    const image = decodeEntities(block.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] || "").trim();
    if (guid && title) items.push({ guid, title, link, excerpt, image });
  }
  return items;
}

async function poll(_bot: Bot): Promise<void> {
  try {
    const res = await fetch(CONFIG.rssUrl, {
      headers: { "User-Agent": "ProektMapBot/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`RSS HTTP ${res.status}`);
      return;
    }

    const items = parseRss(await res.text());
    if (items.length === 0) return;

    const posted = new Set(loadState());

    // Baseline ТОЛЬКО при самом первом запуске (state-файла ещё нет).
    if (!existsSync(STATE_FILE)) {
      saveState(items.map((i) => i.guid));
      console.log(`RSS baseline: зафиксировано ${items.length} постов`);
      return;
    }

    const fresh = items.filter((i) => !posted.has(i.guid));
    if (fresh.length === 0) return;

    // В канал не постим каждую статью — публичный выход только пятничный дайджест.
    for (const it of fresh) posted.add(it.guid);
    saveState([...posted]);
    console.log(`RSS: ${fresh.length} новых статей зафиксировано без постинга в канал`);
  } catch (e) {
    console.error("RSS poll error:", (e as Error).message);
  }
}

export function startRssPolling(bot: Bot): void {
  poll(bot).catch(() => {});
  setInterval(() => poll(bot).catch(() => {}), POLL_INTERVAL_MS);
}
