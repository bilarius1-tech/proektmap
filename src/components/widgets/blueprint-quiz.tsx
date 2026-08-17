"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Bot, Globe, Server, Smartphone, Gamepad2, Sparkles } from "lucide-react";

interface Question {
  q: string;
  options: { label: string; value: string; icon?: any }[];
}

const questions: Question[] = [
  {
    q: "Что ты хочешь создать?",
    options: [
      { label: "Сайт / Лендинг", value: "website", icon: Globe },
      { label: "Telegram Бота", value: "bot", icon: Bot },
      { label: "Интернет-магазин", value: "shop", icon: Server },
      { label: "Мобильное приложение", value: "mobile", icon: Smartphone },
      { label: "Игру", value: "game", icon: Gamepad2 },
    ],
  },
  {
    q: "Есть опыт в программировании?",
    options: [
      { label: "Вообще нет, я новичок", value: "none" },
      { label: "Немного, базовые знания", value: "basic" },
      { label: "Да, пишу код уверенно", value: "pro" },
    ],
  },
  {
    q: "Ты из России?",
    options: [
      { label: "Да, нужны решения без VPN", value: "ru" },
      { label: "Нет, VPN не проблема", value: "world" },
    ],
  },
  {
    q: "Нужны онлайн-платежи?",
    options: [
      { label: "Да (ЮKassa, Telegram Stars)", value: "yes_pay" },
      { label: "Нет, просто сайт-визитка", value: "no_pay" },
    ],
  },
  {
    q: "Нужен AI внутри продукта?",
    options: [
      { label: "Да (чат-бот, генерация контента)", value: "yes_ai" },
      { label: "Нет, простой функционал", value: "no_ai" },
    ],
  },
];

// Recommendation logic
function getRecommendation(answers: string[]) {
  const [type, skill, country, pay, ai] = answers;

  // Telegram Bot path
  if (type === "bot") {
    return {
      blueprint: "telegram-bot",
      title: "Telegram Бот",
      desc: "Идеальный выбор! Telegram — платформа №1 в России. Blueprint проведёт от идеи до работающего бота с платежами и AI.",
      links: [
        { label: "Пройти Blueprint «Telegram Бот»", href: "/telegram-bot" },
        { label: "Гайд по Telegram Ботам", href: "/telegram" },
      ],
    };
  }

  // Shop
  if (type === "shop") {
    return {
      blueprint: "corporate-website",
      title: "Корпоративный сайт + Каталог",
      desc: "Интернет-магазин на Next.js с каталогом и ЮKassa. Blueprint «Корпоративный сайт» покрывает всё: от домена до приёма платежей.",
      links: [
        { label: "Пройти Blueprint «Корпоративный сайт»", href: "/corporate-website" },
        { label: "Гайд: AI без VPN", href: "/ai-without-vpn" },
      ],
    };
  }

  // Game
  if (type === "game") {
    return {
      blueprint: "game-dev",
      title: "Разработка игры",
      desc: "Godot + AI: от идеи до публикации. Blueprint проведёт через все этапы геймдева с AI-помощником.",
      links: [
        { label: "Пройти Blueprint «Игра»", href: "/game-dev" },
        { label: "Vibe Coding Tools", href: "/vibecraft" },
      ],
    };
  }

  // Default: website
  return {
    blueprint: "corporate-website",
    title: "Корпоративный сайт",
    desc: country === "ru"
      ? "Сайт компании с блогом и формами. Используй российский AI-стек (YandexGPT вместо ChatGPT) и хостинг в РФ."
      : "Сайт компании с блогом и формами. Полный Blueprint от структуры до запуска.",
    links: [
      { label: "Пройти Blueprint «Корпоративный сайт»", href: "/corporate-website" },
      ...(country === "ru" ? [{ label: "Российский AI-стек", href: "/russian-ai-stack" }] : []),
      { label: "Vibe Coding: с чего начать", href: "/vibecraft" },
    ],
  };
}

export default function BlueprintQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [done, setDone] = useState(false);

  function answer(value: string) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const rec = getRecommendation(newAnswers);
      setResult(rec);
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setDone(false);
  }

  return (
    <div className="home-widget-card home-quiz-card" style={{
      background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-l)", overflow: "hidden", maxWidth: 640, margin: "0 auto",
    }}>
      {/* Header */}
      <div className="home-widget-header" style={{
        padding: "var(--space-l) var(--space-xl)",
        background: "linear-gradient(135deg, var(--color-accent-light), var(--color-bg-primary))",
        borderBottom: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Sparkles size={24} style={{ color: "var(--color-accent)" }} />
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>
            {done ? "Твой Blueprint" : "Какой Blueprint тебе нужен?"}
          </h3>
          <p className="home-widget-subtitle" style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
            {done ? "На основе твоих ответов" : `${step + 1} из ${questions.length} вопросов`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {!done && (
        <div style={{ height: 3, background: "var(--color-border)" }}>
          <div style={{
            height: "100%", background: "var(--color-accent)",
            width: `${((step) / questions.length) * 100}%`,
            transition: "width 0.3s ease",
          }} />
        </div>
      )}

      {/* Content */}
      <div className="home-widget-content" style={{ padding: "var(--space-xl)" }}>
        {!done ? (
          <>
            <p className="home-quiz-question" style={{
              fontSize: "var(--text-m)", fontWeight: 600, fontFamily: "var(--font-heading)",
              marginBottom: "var(--space-l)", lineHeight: 1.4,
            }}>
              {questions[step].q}
            </p>
            <div className="home-quiz-options" style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              {questions[step].options.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => answer(opt.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 18px", borderRadius: "var(--radius-m)",
                      border: "1px solid var(--color-border)", background: "var(--color-bg-primary)",
                      cursor: "pointer", fontFamily: "inherit", fontSize: "var(--text-s)",
                      color: "var(--color-text-primary)", textAlign: "left",
                      transition: "all 0.15s", width: "100%",
                    }}
                    className="card-hover home-quiz-option"
                  >
                    {Icon && <Icon size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />}
                    {opt.label}
                    <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--color-text-secondary)", flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <button
                onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  marginTop: "var(--space-m)", padding: "8px 16px",
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--color-text-secondary)", fontSize: "var(--text-xs)",
                  fontFamily: "inherit",
                }}
              >
                <ArrowLeft size={14} /> Назад
              </button>
            )}
          </>
        ) : (
          <div>
            {/* Result card */}
            <div className="home-quiz-result" style={{
              background: "var(--color-accent-light)", borderRadius: "var(--radius-m)",
              padding: "var(--space-xl)", textAlign: "center", marginBottom: "var(--space-l)",
            }}>
              <Check size={32} style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)" }} />
              <div style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 4 }}>
                {result.title}
              </div>
              <p className="home-quiz-result-description" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {result.desc}
              </p>
            </div>

            {/* Action links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              {result.links.map((link: any, i: number) => (
                <Link key={i} href={link.href} className="home-quiz-result-link" style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 18px", borderRadius: "var(--radius-m)",
                  background: i === 0 ? "var(--color-accent)" : "var(--color-bg-secondary)",
                  color: i === 0 ? "#fff" : "var(--color-text-primary)",
                  textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600,
                  border: i === 0 ? "none" : "1px solid var(--color-border)",
                  transition: "all 0.15s",
                }}>
                  {link.label}
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>

            {/* Retry */}
            <button
              onClick={reset}
              style={{
                display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
                width: "100%", marginTop: "var(--space-m)", padding: "12px",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--color-text-secondary)", fontSize: "var(--text-xs)",
                fontFamily: "inherit",
              }}
            >
              Пройти заново
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
