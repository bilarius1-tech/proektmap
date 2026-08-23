import { Bot } from "grammy";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { CONFIG } from "./config";

const STATE_FILE = join(CONFIG.stateDir, "announced-sections.json");
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 минут

interface Announced {
  blueprints: string[];
  tools: string[];
  patterns: string[];
}

function loadAnnounced(): Announced {
  const empty: Announced = { blueprints: [], tools: [], patterns: [] };
  if (!existsSync(STATE_FILE)) return empty;
  try {
    const j = JSON.parse(readFileSync(STATE_FILE, "utf8"));
    return { ...empty, ...j };
  } catch {
    return empty;
  }
}

function saveAnnounced(a: Announced): void {
  mkdirSync(CONFIG.stateDir, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(a, null, 2));
}

async function fetchJson(path: string): Promise<any> {
  try {
    const res = await fetch(CONFIG.siteUrl + path, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function announce(bot: Bot, text: string): Promise<void> {
  for (const ch of CONFIG.channels) {
    await bot.api.sendMessage(ch, text, { link_preview_options: { is_disabled: false } });
  }
  console.log("Анонс раздела:", text.split("\n")[0]);
}

async function poll(bot: Bot): Promise<void> {
  const a = loadAnnounced();
  const isFirst = !existsSync(STATE_FILE);
  let changed = false;

  // Blueprint'ы
  const bps = await fetchJson("/api/blueprints");
  if (Array.isArray(bps)) {
    const known = new Set(a.blueprints);
    if (isFirst) {
      a.blueprints = bps.map((b: any) => b.slug).filter(Boolean);
      changed = true;
    } else {
      for (const b of bps) {
        if (b.slug && !known.has(b.slug)) {
          await announce(bot, `🧭 Новый Blueprint: ${b.title}\n\n${b.description || ""}\n\n→ ${CONFIG.siteUrl}/blueprints/${b.slug}`);
          a.blueprints.push(b.slug);
          changed = true;
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }
  }

  // Инструменты
  const toolsData = await fetchJson("/api/ai-tools");
  const tools: any[] = toolsData?.tools || [];
  if (tools.length) {
    const known = new Set(a.tools);
    if (isFirst) {
      a.tools = tools.map((t: any) => t.slug || t.name).filter(Boolean);
      changed = true;
    } else {
      for (const t of tools) {
        const key = t.slug || t.name;
        if (key && !known.has(key)) {
          await announce(bot, `🛠️ Новый инструмент: ${t.name}\n\n${t.shortDescription || t.description || ""}\n\n→ ${CONFIG.siteUrl}/ai-tools`);
          a.tools.push(key);
          changed = true;
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }
  }

  // Паттерны
  const patData = await fetchJson("/api/patterns");
  const patterns: any[] = patData?.patterns || [];
  if (patterns.length) {
    const known = new Set(a.patterns);
    if (isFirst) {
      a.patterns = patterns.map((p: any) => p.slug).filter(Boolean);
      changed = true;
    } else {
      for (const p of patterns) {
        if (p.slug && !known.has(p.slug)) {
          await announce(bot, `📦 Новый паттерн: ${p.title}\n\n${p.description || ""}\n\n→ ${CONFIG.siteUrl}/patterns/${p.slug}`);
          a.patterns.push(p.slug);
          changed = true;
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }
  }

  if (changed) saveAnnounced(a);
}

export function startSectionsPolling(bot: Bot): void {
  poll(bot).catch((e) => console.error("Sections poll error:", e));
  setInterval(() => poll(bot).catch((e) => console.error("Sections poll error:", e)), POLL_INTERVAL_MS);
}
