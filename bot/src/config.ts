import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Расположение bot/ и корня проекта (не зависит от cwd)
const here = dirname(fileURLToPath(import.meta.url)); // bot/src
export const BOT_DIR = resolve(here, ".."); // bot/
export const PROJECT_ROOT = resolve(BOT_DIR, ".."); // proektmap.ru/

// Загружаем bot/.env
config({ path: resolve(BOT_DIR, ".env") });

export const CONFIG = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || "",
  // Несколько каналов через запятую: @proektmap,@avito_dizain
  channels: (process.env.TELEGRAM_CHANNEL_ID || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  deepseekKey: process.env.DEEPSEEK_API_KEY || "",
  autoApprove: (process.env.AUTO_APPROVE || "true").toLowerCase() !== "false",
  rssUrl: process.env.BLOG_RSS_URL || "https://proektmap.ru/blog/rss.xml",
  adminId: Number(process.env.ADMIN_ID) || 0,
  stateDir: resolve(BOT_DIR, "state"),
} as const;
