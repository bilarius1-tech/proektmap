import { Bot } from "grammy";
import { askDeepSeek } from "./ai";

interface Session {
  step: number;
  answers: string[];
}
const sessions = new Map<number, Session>();

const QUESTIONS = [
  "Что ты создаёшь? Опиши проект одной-двумя фразами.",
  "Какая сейчас главная развилка? (стек / хостинг / оплата / AI-модель / деплой / другое)",
  "Какие варианты рассматриваешь? Перечисли.",
  "Что важнее всего: скорость запуска, цена, надёжность или гибкость?",
  "Есть ли ограничения? (бюджет, сроки, регион, VPN, команда)",
];

const DECIDE_SYSTEM =
  "Ты — коуч по принятию инженерных решений (метод Decision-Driven Development). " +
  "На основе ответов пользователя помоги принять решение по цепочке ПОНЯТЬ → ВЫБРАТЬ → ПРОВЕРИТЬ. " +
  "Выдай кратко: 1) суть выбора, 2) рекомендация с обоснованием, 3) как проверить решение, 4) один конкретный следующий шаг. " +
  "На русском, по делу, без воды.";

export function registerDecide(bot: Bot): void {
  bot.command("decide", async (ctx) => {
    const uid = ctx.from?.id || 0;
    sessions.set(uid, { step: 0, answers: [] });
    await ctx.reply("🧭 Decision-coach запущен.\n\n" + QUESTIONS[0] + "\n\n(в любой момент /cancel — отменить)");
  });

  bot.command("cancel", async (ctx) => {
    const uid = ctx.from?.id || 0;
    sessions.delete(uid);
    await ctx.reply("Диалог отменён.");
  });

  bot.on("message:text", async (ctx) => {
    const uid = ctx.from?.id || 0;
    const session = sessions.get(uid);
    if (!session) return;
    const text = ctx.message.text.trim();
    if (text.startsWith("/")) return;

    session.answers.push(text);
    session.step += 1;

    if (session.step < QUESTIONS.length) {
      await ctx.reply(QUESTIONS[session.step]);
      return;
    }

    sessions.delete(uid);
    await ctx.reply("⏳ Собираю твоё решение…");
    const qa = QUESTIONS.map((q, i) => `${i + 1}) ${q}\n→ ${session.answers[i] || "—"}`).join("\n\n");
    const brief = await askDeepSeek(DECIDE_SYSTEM, qa, 700, 0.6);
    await ctx.reply(brief || "⚠️ Не удалось сгенерировать решение. Попробуй /decide ещё раз.");
  });
}
