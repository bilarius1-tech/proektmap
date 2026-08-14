import { Bot } from "grammy";

const QUESTIONS = [
  { q: "Что такое RAG?", options: ["Генерация ответа с поиском по внешним данным", "Метод квантования модели", "Язык программирования", "Протокол передачи данных"], correct: 0, hint: "RAG (Retrieval-Augmented Generation) — модель ищет релевантные документы и отвечает на их основе, снижая галлюцинации." },
  { q: "На каком языке пишут ботов на grammy?", options: ["Python", "TypeScript / JavaScript", "Go", "Rust"], correct: 1, hint: "grammy — современная библиотека для Node.js (TS/JS)." },
  { q: "Что делает fine-tuning?", options: ["Дообучает модель на своих данных", "Сжимает модель", "Ускоряет инференс", "Шифрует запросы"], correct: 0, hint: "Fine-tuning дообучает базовую модель на ваших примерах, подстраивая её под задачу." },
  { q: "Что такое Chain-of-Thought (CoT)?", options: ["Модель рассуждает по шагам", "Способ сжатия токенов", "Вид нейросети", "Формат JSON"], correct: 0, hint: "Chain-of-Thought — просьба к модели рассуждать пошагово, что повышает точность сложных ответов." },
  { q: "Какая модель стоит за AI-консультантом ProektMap?", options: ["DeepSeek", "GPT-4o", "Llama", "Claude"], correct: 0, hint: "ProektMap использует DeepSeek (deepseek-chat) для AI-консультанта и сводок." },
  { q: "Что такое webhook у Telegram-бота?", options: ["URL, на который Telegram шлёт апдейты", "Пароль бота", "База данных", "Кнопка меню"], correct: 0, hint: "Webhook — ваш HTTPS-URL, куда Telegram сразу отправляет апдейты (альтернатива polling)." },
  { q: "Для чего нужна Prisma?", options: ["ORM для работы с БД", "Облачный хостинг", "Генератор картинок", "Почтовый сервис"], correct: 0, hint: "Prisma — ORM для Node.js/TypeScript: схема, типы и запросы к БД." },
  { q: "Что такое Decision-Driven Development?", options: ["Метод: каждое решение фиксируешь и проверяешь", "Фреймворк фронтенда", "Метод сжатия видео", "Язык запросов"], correct: 0, hint: "Decision-Driven Development — философия ProektMap: строить проект через осознанные решения (ПОНЯТЬ → ВЫБРАТЬ → ПРОВЕРИТЬ)." },
  { q: "Что проще для публичного бота без своего домена?", options: ["Polling (long polling)", "Webhook", "Только локально", "FTP"], correct: 0, hint: "Polling не требует публичного HTTPS-URL — бот сам опрашивает Telegram. Webhook нужен при своём домене/SSL." },
  { q: "Что такое системный промпт?", options: ["Инструкция, задающая роль и правила модели", "Пароль от API", "Название датасета", "Кнопка в интерфейсе"], correct: 0, hint: "System prompt — инструкция, которая задаёт модели роль, тон и правила ответа." },
];

function todayIndex(): number {
  const day = Math.floor(Date.now() / 86400000);
  return day % QUESTIONS.length;
}

export function registerQuiz(bot: Bot): void {
  bot.command("quiz", async (ctx) => {
    const q = QUESTIONS[todayIndex()];
    await ctx.reply(`🧠 Вопрос дня:\n\n${q.q}`, {
      reply_markup: {
        inline_keyboard: q.options.map((o, i) => [{ text: o, callback_data: "quiz:" + i }]),
      },
    });
  });

  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    if (!data.startsWith("quiz:")) return;
    const idx = Number(data.slice(5));
    const q = QUESTIONS[todayIndex()];
    const ok = idx === q.correct;
    await ctx.answerCallbackQuery({ text: ok ? "✅ Верно!" : "❌ Неверно" });
    await ctx.reply(
      `${ok ? "✅ Верно!" : "❌ Неверно. Правильный ответ: " + q.options[q.correct]}\n\n${q.hint}`
    );
  });
}
