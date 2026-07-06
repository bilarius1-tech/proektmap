import { ArrowRight, Globe, Database, Wrench, Rocket, Bot } from "lucide-react";

const phases = [
  {
    num: "01",
    title: "Структура проекта",
    desc: "Дизайн-система, токены, страницы, структура данных",
    icon: Globe,
    steps: ["Дизайн-система и токены", "Какие страницы нужны", "Структура данных (Prisma)"],
  },
  {
    num: "02",
    title: "Технологии",
    desc: "Next.js vs Vue vs Laravel. Нужна ли админка? База данных.",
    icon: Database,
    steps: ["Выбор фреймворка", "Админка: Payload vs Strapi", "SQLite vs PostgreSQL"],
  },
  {
    num: "03",
    title: "Реализация",
    desc: "Формы, Telegram бот, SEO, авторизация",
    icon: Wrench,
    steps: ["Формы (React Hook Form + Zod)", "Telegram бот (BotFather → webhook)", "SEO и мета-теги"],
  },
  {
    num: "04",
    title: "Запуск",
    desc: "Домен, SSL, Яндекс.Метрика, Cookie-баннер",
    icon: Rocket,
    steps: ["Покупка домена и DNS", "SSL (Let's Encrypt)", "Яндекс.Метрика + Вебмастер", "Cookie и Политика"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
          <Bot size={16} />
          Инженерный навигатор
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">
          От идеи до продукта
          <br />
          <span className="text-blue-600">за 4 этапа</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Не курсы. Не генератор кода. Инженерное сопровождение: что делать, почему именно так, какие альтернативы.
          AI-консультант объясняет каждое решение.
        </p>
        <button className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2 mx-auto">
          Начать путь <ArrowRight size={18} />
        </button>
      </header>

      {/* Phases */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid gap-4">
          {phases.map((phase, i) => (
            <div
              key={i}
              className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <phase.icon size={24} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-blue-500 tracking-wider">{phase.num}</span>
                    <h3 className="text-lg font-bold text-slate-900">{phase.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{phase.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.steps.map((step, j) => (
                      <span key={j} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium">
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white">
          <Bot size={40} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">AI-консультант на каждом шаге</h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            Не понимаете какое решение принять? Спросите AI — он объяснит почему именно этот выбор правильный для вашего проекта.
          </p>
          <button className="px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition">
            Задать вопрос AI
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-slate-400 text-sm">
        ProektMap © 2026 · Инженерный навигатор
      </footer>
    </div>
  );
}
