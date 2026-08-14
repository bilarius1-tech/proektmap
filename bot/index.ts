import { Bot } from "grammy";
import { CONFIG } from "./src/config";
import { startRssPolling } from "./src/rss";
import { startDigestSchedule, runDigest } from "./src/digest";

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
      `Я публикую новости блога и еженедельные итоги проекта.\n\n` +
      `Сайт → https://proektmap.ru`,
    { link_preview_options: { is_disabled: true } },
  ),
);

bot.command("help", (ctx) =>
  ctx.reply(
    `ℹ️ Команды:\n` +
      `/start — приветствие\n` +
      `/help — этот список\n` +
      `/digest — запустить еженедельную выжимку (только админ)\n\n` +
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

// Расписания
startRssPolling(bot);
startDigestSchedule(bot);

bot.catch((err) => console.error("Bot error:", (err.error as Error)?.message || String(err)));

bot.start({
  onStart: () => console.log("✅ ProektMap-бот запущен и слушает обновления"),
});
