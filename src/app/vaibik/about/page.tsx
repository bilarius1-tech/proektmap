import type { Metadata } from "next";
import BackLink from "@/components/vaibik/back-link";
import {
  CheckCircle2,
  Gamepad2,
  Lightbulb,
  Rocket,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

const FEATURES = [
  {
    icon: Lightbulb,
    title: "Что такое ИИ",
    text: "Ребёнок узнаёт, что ИИ не читает мысли — ему нужно объяснять задачу словами.",
  },
  {
    icon: Rocket,
    title: "Промпт",
    text: "Простыми словами объясняется, что промпт — это инструкция для ИИ.",
  },
  {
    icon: Gamepad2,
    title: "Проверка результата",
    text: "Ребёнок играет в созданную игру и учится проверять результат.",
  },
  {
    icon: Star,
    title: "Итерация",
    text: "Ошибка исправляется через объяснение ИИ — так работают настоящие проекты.",
  },
];

const REWARDS = [
  {
    icon: Trophy,
    title: "Игровое настроение",
    text: "Квест ощущается как игра, а не урок.",
  },
  {
    icon: Sparkles,
    title: "50 XP и медаль",
    text: "Ребёнок получает статус «Первый вайбкодер».",
  },
  {
    icon: CheckCircle2,
    title: "Готовность к VibeCraft",
    text: "Понимает, что может создавать цифровые продукты.",
  },
];

export const metadata: Metadata = {
  title: "О игре «Вайбик: Миссия №1»",
  description:
    "Что такое «Вайбик: Миссия №1»: короткий детский веб-квест на 5–10 минут для детей 9–12 лет. Ребёнок узнает, что такое ИИ и промпт, проверит и исправит игру, получит 50 XP и медаль.",
};

export default function AboutPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-14">
      <div className="absolute inset-0 cosmic-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <BackLink />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            О игре
          </h1>
          <p className="mt-3 max-w-2xl rounded-2xl border border-white/10 bg-slate-900/70 px-6 py-5 text-lg leading-relaxed text-indigo-100/90 backdrop-blur-md">
            «Вайбик: Миссия №1» — короткий детский веб-квест на 5–10 минут для
            детей 9–12 лет. Вместе с роботом Вайбиком ребёнок проходит путь
            вайбкодера: придумывает идею, объясняет её словами, собирает промпт,
            проверяет и исправляет игру — и в финале понимает, что
            программирование начинается с идеи.
          </p>
        </div>

        <section className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-xl font-bold text-white">Что ребёнок узнает</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex flex-col items-start gap-3 rounded-3xl border border-white/15 bg-slate-900/70 px-6 py-5 backdrop-blur-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-indigo-100/80">
                    {f.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-xl font-bold text-white">Что получит ребёнок</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {REWARDS.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="flex flex-col items-center gap-3 rounded-3xl border border-amber-300/40 bg-slate-900/70 px-5 py-6 text-center backdrop-blur-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-indigo-100/80">
                    {r.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
