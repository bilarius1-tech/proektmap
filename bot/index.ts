import { Bot } from "grammy";
import { CONFIG } from "./src/config";
import { startRssPolling } from "./src/rss";
import { startSectionsPolling } from "./src/sections";
import { startDigestSchedule, runDigest } from "./src/digest";
import { registerAsk } from "./src/ask";
import { registerNav } from "./src/nav";
import { registerDecide } from "./src/decide";
import { registerQuiz } from "./src/quiz";

if (!CONFIG.botToken) {
  console.error("✗ TELEGRAM_BOT_TOKEN не задан в bot/.env");
  process.exit(1);
}
if (CONFIG.channels.length === 0) {
  console.warn("⚠ TELEGRAM_CHANNEL_ID не задан в bot/.env — постинг в канал отключён до настройки");
}

const bot = new Bot(CONFIG.botToken);

bot.command("start", (ctx) =>
  ctx.reply(
    `👋 Привет! Я бот ProektMap — «Карты роста».\n\n` +
      `Я публикую новости блога, анонсы новых разделов и еженедельные итоги, а ещё умею:\n` +
      `• /ask — AI-консультант\n` +
      `• /decide — принять решение\n` +
      `• /quiz — вопрос дня\n` +
      `• /search — поиск по базе знаний\n\n` +
      `Сайт → https://proektmap.ru`,
    { link_preview_options: { is_disabled: true } },
  ),
);

bot.command("help", (ctx) =>
  ctx.reply(
    `ℹ️ Команды:\n` +
      `/ask <вопрос> — AI-консультант\n` +
      `/decide — принять решение (decision-coach)\n` +
      `/blueprint <slug> — карточка Blueprint\n` +
      `/tool <название> — AI-инструмент\n` +
      `/term <термин> — термин из глоссария\n` +
      `/search <запрос> — поиск по базе знаний\n` +
      `/quiz — вопрос дня\n` +
      `/digest — еженедельная выжимка (админ)\n` +
      `/cancel — отменить диалог\n\n` +
      `Каналы: ${CONFIG.channels.join(", ")}`,
    { link_preview_options: { is_disabled: true } },
  ),
);

// Ручной запуск выжимки (для тестирования) — только админ
bot.command("digest", async (ctx) => {
  if (CONFIG.adminId && ctx.from?.id !== CONFIG.adminId) {
    return ctx.reply("⛔ Команда доступна только администратору.");
  }
  await ctx.reply("⏳ Собираю выжимку…");
  const text = await runDigest(bot);
  if (!text) await ctx.reply("⚠️ Не удалось собрать выжимку, см. логи.");
});

registerAsk(bot);
registerNav(bot);
registerDecide(bot);
registerQuiz(bot);

startRssPolling(bot);
startSectionsPolling(bot);
startDigestSchedule(bot);

bot.catch((err) => console.error("Bot error:", (err.error as Error)?.message || String(err)));

bot.start({
  onStart: () => console.log("✅ ProektMap-бот запущен и слушает обновления"),
});
