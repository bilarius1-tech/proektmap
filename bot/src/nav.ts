import { Bot } from "grammy";
import { CONFIG } from "./config";

async function fetchJson(path: string): Promise<any> {
  try {
    const res = await fetch(CONFIG.siteUrl + path, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function registerNav(bot: Bot): void {
  bot.command("blueprint", async (ctx) => {
    const slug = (ctx.match || "").trim().toLowerCase();
    if (!slug) return ctx.reply("Используй: /blueprint <slug>\nНапример: /blueprint telegram-bot");
    const list = await fetchJson("/api/blueprints");
    if (!Array.isArray(list)) return ctx.reply("⚠️ Не удалось загрузить Blueprint'ы.");
    const bp = list.find((b: any) => (b.slug || "").toLowerCase() === slug);
    if (!bp) {
      const names = list.map((b: any) => b.slug).slice(0, 12).join(", ");
      return ctx.reply(`Blueprint «${slug}» не найден.\n\nДоступные: ${names}`);
    }
    const stages = (bp.stages || []).map((s: any) => s.stage?.title).filter(Boolean).join(" → ");
    const text =
      `🧭 ${bp.title}\n` +
      `Сложность: ${bp.difficulty || "—"}\n\n` +
      `${bp.description || ""}\n\n` +
      (stages ? `Этапы: ${stages}\n\n` : "") +
      `→ ${CONFIG.siteUrl}/blueprints/${bp.slug}`;
    await ctx.reply(text, { link_preview_options: { is_disabled: true } });
  });

  bot.command("tool", async (ctx) => {
    const name = (ctx.match || "").trim().toLowerCase();
    if (!name) return ctx.reply("Используй: /tool <название>\nНапример: /tool cursor");
    const data = await fetchJson("/api/ai-tools");
    const tools: any[] = data?.tools || [];
    const tool = tools.find((t: any) => (t.name || "").toLowerCase().includes(name));
    if (!tool) return ctx.reply(`Инструмент «${name}» не найден. Попробуй другое название.`);
    const text =
      `🛠️ ${tool.name} (${tool.type || "—"})\n` +
      `Провайдер: ${tool.provider || "—"} | Рейтинг: ${tool.rating || "—"}/10\n\n` +
      `${tool.shortDescription || tool.description || ""}\n\n` +
      (tool.pricing ? `Цена: ${tool.pricing}\n` : "") +
      (tool.bestFor ? `Подходит для: ${tool.bestFor}\n` : "") +
      `\n→ ${tool.url || CONFIG.siteUrl + "/ai-tools"}`;
    await ctx.reply(text, { link_preview_options: { is_disabled: true } });
  });

  bot.command("term", async (ctx) => {
    const q = (ctx.match || "").trim().toLowerCase();
    if (!q) return ctx.reply("Используй: /term <термин>\nНапример: /term RAG");
    const data = await fetchJson("/api/glossary");
    const terms: any[] = data?.terms || [];
    const t =
      terms.find((x: any) => (x.term || "").toLowerCase() === q) ||
      terms.find((x: any) => (x.term || "").toLowerCase().includes(q));
    if (!t) return ctx.reply(`Термин «${q}» не найден в глоссарии.`);
    const text =
      `📖 ${t.term}${t.level ? ` (уровень: ${t.level})` : ""}\n\n` +
      `${t.simpleExplanation || t.definition || ""}\n\n` +
      `→ ${CONFIG.siteUrl}/glossary/${t.slug}`;
    await ctx.reply(text, { link_preview_options: { is_disabled: true } });
  });

  bot.command("search", async (ctx) => {
    const q = (ctx.match || "").trim();
    if (!q) return ctx.reply("Используй: /search <запрос>\nНапример: /search телеграм бот");
    const data = await fetchJson("/api/search?q=" + encodeURIComponent(q));
    const results: any[] = data?.results || [];
    if (results.length === 0) return ctx.reply(`По запросу «${q}» ничего не найдено.`);
    const lines = results.slice(0, 5).map((r: any, i: number) =>
      `${i + 1}. ${r.typeLabel || ""} ${r.title || r.term || r.name}\n` +
      `${(r.snippet || r.description || "").slice(0, 130)}\n` +
      `${CONFIG.siteUrl}${r.href}`
    );
    await ctx.reply(`🔎 Результаты по «${q}»:\n\n${lines.join("\n\n")}`, { link_preview_options: { is_disabled: true } });
  });
}
