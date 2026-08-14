import { Bot } from "grammy";
import { askDeepSeek } from "./ai";

const SYSTEM =
  "Ты — AI-Архитектор, инженерный консультант. " +
  "Объясняй простым языком, без жаргона. Термины — объясняй. " +
  "Отвечай на русском, доброжелательно, кратко: 2-4 предложения + практический совет.";

const DAILY_LIMIT = 20;
const usage = new Map<number, { date: string; count: number }>();

export function registerAsk(bot: Bot): void {
  bot.command("ask", async (ctx) => {
    const q = (ctx.match || "").trim();
    if (!q) {
      return ctx.reply("Используй: /ask <вопрос>\nНапример: /ask какой стек выбрать для Telegram-бота");
    }

    const uid = ctx.from?.id || 0;
    const today = new Date().toISOString().slice(0, 10);
    const u = usage.get(uid);
    if (u && u.date === today && u.count >= DAILY_LIMIT) {
      return ctx.reply("⏳ Дневной лимит вопросов (20) исчерпан. Возвращайся завтра!");
    }
    usage.set(uid, { date: today, count: (u && u.date === today ? u.count : 0) + 1 });

    try { await ctx.api.sendChatAction(ctx.chat.id, "typing"); } catch {}
    const answer = await askDeepSeek(SYSTEM, q, 500, 0.7);
    await ctx.reply(answer || "⚠️ AI-консультант временно недоступен. Попробуй позже.");
  });
}
