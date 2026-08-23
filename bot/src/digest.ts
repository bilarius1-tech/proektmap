import { Bot } from "grammy";
import cron from "node-cron";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { CONFIG, PROJECT_ROOT } from "./config";
import { askDeepSeek } from "./ai";

const DIGEST_SYSTEM = `Ты — редактор еженедельной сводки проекта ProektMap («Карта роста» — платформа для обучения AI-инжинирингу).
Суммируй ТОЛЬКО переданные ниже коммиты и DEVLOG. Не выдумывай факты и не добавляй ничего от себя.
Пиши на русском, дружелюбно, для читателя-разработчика.
Формат: 3–6 пунктов, каждый начинается с «•». В конце каждого пункта — что это значит для пользователя.`;

function collectRaw(): string {
  let gitLog = "";
  try {
    gitLog = execSync('git log --since="8 days ago" --pretty=format:"%h %s"', {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
    })
      .split("\n")
      .slice(0, 60)
      .join("\n");
  } catch (e) {
    console.error("git log error:", (e as Error).message);
  }

  let devlog = "";
  try {
    devlog = readFileSync(join(PROJECT_ROOT, "docs", "DEVLOG.md"), "utf8")
      .split("\n")
      .slice(-120)
      .join("\n");
  } catch {
    // нет DEVLOG — не критично
  }

  return `Коммиты за неделю:\n${gitLog || "(нет данных)"}\n\nDEVLOG (хвост):\n${devlog || "(нет данных)"}`;
}

function fallbackFromRaw(raw: string): string {
  // Деградация без LLM: просто первые строки коммитов
  const lines = raw
    .split("\n")
    .filter((l) => /^[0-9a-f]{6,}\s/.test(l.trim()))
    .slice(0, 6);
  return lines.length ? "• " + lines.join("\n• ") : "• За неделю изменений не зафиксировано.";
}

export async function runDigest(bot: Bot): Promise<string> {
  try {
    const raw = collectRaw();
    const summary = await askDeepSeek(DIGEST_SYSTEM, raw, 900, 0.4);
    const text = summary || fallbackFromRaw(raw);

    const msg = `🗓 Итоги недели на ProektMap\n\n${text}\n\n→ https://proektmap.ru`;
    for (const ch of CONFIG.channels) {
      await bot.api.sendMessage(ch, msg);
    }
    console.log("Еженедельная выжимка опубликована");
    return text;
  } catch (e) {
    console.error("Digest error:", (e as Error).message);
    return "";
  }
}

export function startDigestSchedule(bot: Bot): void {
  // Понедельник 10:00 по Москве
  cron.schedule(
    "0 10 * * 1",
    () => runDigest(bot).catch((e) => console.error(e)),
    { timezone: "Europe/Moscow" },
  );
  console.log("Расписание выжимки: понедельник 10:00 MSK");
}
