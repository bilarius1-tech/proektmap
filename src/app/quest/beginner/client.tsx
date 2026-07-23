"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Monitor, Terminal, Globe, Download, Cloud, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  {
    title: "Подготовка инструментов",
    time: "10 мин",
    icon: Download,
    color: "#f59e0b",
    content: `Твой путь в AI-разработку начинается с трёх инструментов. Все бесплатные — ты не потратишь ни рубля.

🖥️ Cursor — это редактор кода со встроенным ИИ. Представь себе VS Code, но с ChatGPT внутри. Ты пишешь что хочешь сделать, а ИИ создаёт код. Скачай с cursor.com. Windows, Mac, Linux — всё поддерживается.

⚡ Node.js — движок, на котором работает современный веб. Без него твой код просто текст. Скачай LTS-версию (Long Term Support — самая стабильная) с nodejs.org. После установки открой терминал и проверь: node -v (должен показать версию, например v20.11).

☁️ GitHub — облако для хранения кода. Представь Google Drive, но для программистов. Зарегистрируйся на github.com (нужен email). Позже ты будешь хранить там все свои проекты.

Почему именно эти три? Cursor даёт ИИ-помощника. Node.js даёт среду запуска. GitHub даёт сохранность. Без любого из этих трёх — разработка превращается в боль.`,
    question: "Всё установлено?",
    options: [
      { id: "done", text: "✅ Cursor, Node.js и GitHub готовы — идём дальше", action: "next" },
      { id: "help", text: "Нужна помощь с установкой", action: "explain" },
    ],
  },
  {
    title: "Первый сайт через AI",
    time: "15 мин",
    icon: Monitor,
    color: "#3b82f6",
    content: `Сейчас ты создашь свой первый сайт. Не написав ни строчки кода. Только один промпт.

Открой Cursor. Нажми Ctrl+I (на Mac: Cmd+I). Откроется AI-чат. Это твой главный инструмент — ты будешь писать сюда задачи, а ИИ будет создавать код.

Скопируй этот промпт и вставь в чат:

---
Действуй как опытный frontend-разработчик. Создай новый проект на Next.js (App Router) с Tailwind CSS. Сделай одностраничный сайт-визитку для Мастерской по ремонту телефонов.

Структура страницы:
• Шапка с названием «Мастерская Телефончик» и номером +7 999 123-45-67
• Секция «Наши услуги» с 3 карточками:
  - Замена экрана — 2 500 ₽
  - Замена батареи — 1 500 ₽
  - Диагностика — Бесплатно
• Простая форма заявки (Имя, Телефон, кнопка Отправить)
• Подвал с копирайтом «© 2026 Мастерская Телефончик»

Дизайн: современный, тёмные тона. Напиши ВСЕ команды для терминала — я новичок и хочу просто скопировать и вставить.
---

ИИ начнёт создавать файлы. В терминале Cursor (Ctrl+\`) появятся команды — выполняй их по одной. Обычно это:
1. npm install (установить зависимости)
2. npm run dev (запустить сервер)

Открой браузер → http://localhost:3000. Ты увидишь свой сайт. Настоящий, работающий сайт. На твоём компьютере.`,
    question: "Сайт открылся в браузере?",
    options: [
      { id: "works", text: "✅ Вижу сайт на localhost:3000 — работает!", action: "next" },
      { id: "error", text: "Что-то пошло не так — ошибка", action: "explain" },
    ],
  },
  {
    title: "Правки через ИИ",
    time: "10 мин",
    icon: Terminal,
    color: "#8b5cf6",
    content: `Сайт работает. Теперь научимся его менять — не переписывая код руками.

Главное правило AI-разработки: ты не правишь код. Ты описываешь ИИ что изменить, а он меняет файлы сам.

В том же чате Cursor напиши новый промпт:

---
Сайт работает, спасибо. Улучши его:

1. В секции «Наши услуги» сделай hover-эффект: при наведении курсора карточка услуги немного увеличивается и появляется тень.
2. В форму заявки добавь проверку: поле «Телефон» обязательно для заполнения. Если пользователь не заполнил — покажи сообщение об ошибке.
3. Покажи мне какие именно файлы ты изменил и объясни изменения простыми словами (я новичок).
---

Нажми Enter. ИИ прочитает твой код, найдёт нужные файлы и внесёт правки. Обнови страницу в браузере (F5) и проверь: наведи курсор на карточку — она увеличивается? Попробуй отправить пустую форму — показывает ошибку?

Ты только что сделал итерацию. Это основа AI-разработки: написал → проверил → попросил улучшить → проверил снова. Не бойся просить ИИ переделать — он не устаёт.`,
    question: "Изменения работают?",
    options: [
      { id: "works", text: "✅ Карточки увеличиваются, валидация работает", action: "next" },
      { id: "not_sure", text: "Изменений не вижу", action: "explain" },
    ],
  },
  {
    title: "Сохранить код на GitHub",
    time: "10 мин",
    icon: Cloud,
    color: "#22c55e",
    content: `Ты создал сайт. Он работает на твоём компьютере. Но если компьютер сломается — всё пропадёт. Научимся сохранять код.

Git — это машина времени для твоего проекта. Ты делаешь «снимок» кода, и можешь вернуться к нему в любой момент. GitHub — это облако, где эти снимки хранятся.

Шаг 1: Создай репозиторий на GitHub. Зайди на github.com → кнопка New → название my-ai-website → Create repository. Скопируй ссылку (она выглядит как https://github.com/твой-логин/my-ai-website.git).

Шаг 2: В терминале Cursor (Ctrl+\`) выполни команды, которые даст ИИ. Спроси его так:

---
Я новичок. Дай мне ровно 4 команды для терминала:
1. Инициализировать Git в этой папке
2. Сохранить все файлы
3. Привязать к моему GitHub-репозиторию (ссылка: https://github.com/...)
4. Отправить код на GitHub
Объясни каждую команду простыми словами.
---

Выполни команды. Зайди на github.com в свой репозиторий — видишь файлы? Твой код теперь в безопасности.`,
    question: "Код на GitHub?",
    options: [
      { id: "done", text: "✅ Файлы видны в репозитории на GitHub", action: "next" },
      { id: "help", text: "Не получается — ошибка при git push", action: "explain" },
    ],
  },
  {
    title: "Сайт в интернете",
    time: "10 мин",
    icon: Globe,
    color: "#ef4444",
    content: `Последний шаг. Твой сайт работает локально. Сделаем так чтобы он был доступен всему миру.

Vercel — это бесплатный хостинг для Next.js. Он сам берёт код из GitHub и публикует его в интернете. Никаких серверов, никаких настроек — просто подключи репозиторий.

Шаг 1: Зайди на vercel.com → нажми Sign Up → войди через GitHub (кнопка Continue with GitHub).

Шаг 2: Нажми Import Repository → выбери my-ai-website → нажми Deploy. Никакие настройки менять не нужно — Vercel сам определит что это Next.js и соберёт проект.

Шаг 3: Подожди 1-2 минуты. Vercel покажет ссылку вида my-ai-website.vercel.app. Открой её. Открой с телефона. Отправь другу.

Твой сайт в интернете. Настоящий. Работающий. Доступный всем. Ты прошёл путь от пустого экрана до работающего сайта за час. Это и есть AI-разработка.`,
    question: "Сайт открывается по ссылке в интернете?",
    options: [
      { id: "live", text: "🎉 Да! Мой сайт в интернете — я могу показать его кому угодно", action: "next" },
      { id: "stuck", text: "Что-то пошло не так", action: "explain" },
    ],
  },
];

export default function BeginnerPathClient({ nodes }: any) {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("beginner-path-v2");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.step) setStep(data.step);
        if (data.completed) setCompleted(new Set(data.completed));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("beginner-path-v2", JSON.stringify({ step, completed: [...completed] }));
  }, [step, completed]);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;
  const isDone = completed.has(step);
  const option = current?.options?.find((o: any) => o.id === selectedOption);
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  async function handleExplain() {
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "Ты — терпеливый наставник. Объясни пошагово что делать. Дай точные команды для терминала. Говори на русском, дружелюбно, как другу. Используй простые слова. Если пользователь на Windows — адаптируй инструкции.",
          userMessage: `Я на шаге «${current.title}». Мой ответ: «${option?.text || "Нужна помощь"}». Объясни подробнее что делать.`,
        }),
      });
      const data = await res.json();
      setAiResponse(data.reply || "Попробуй ещё раз — я с тобой!");
    } catch {
      setAiResponse("Попробуй ещё раз — я с тобой!");
    }
    setAiLoading(false);
  }

  function handleNext() {
    setCompleted(prev => new Set([...prev, step]));
    setSelectedOption("");
    setAiResponse("");
    if (!isLast) setStep(prev => prev + 1);
  }

  function handlePrev() {
    if (step > 0) { setStep(prev => prev - 1); setSelectedOption(""); setAiResponse(""); }
  }

  if (!current) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "var(--font-heading)", marginBottom: 8 }}>Ты прошёл весь путь!</h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 500, lineHeight: 1.7, marginBottom: 24 }}>
          От идеи до сайта в интернете за час. Ты научился: устанавливать инструменты → создавать сайт через AI-промпт → править код через ИИ → сохранять в Git → публиковать на Vercel.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setStep(0); setCompleted(new Set()); localStorage.removeItem("beginner-path-v2"); }}
            style={{ padding: "12px 24px", borderRadius: 0, border: "1px solid var(--color-border)", background: "white", cursor: "pointer", fontWeight: 600 }}>
            Пройти заново
          </button>
          <a href="/quest/services-site" style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 0, background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700 }}>
            Следующий уровень <ArrowRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)" }}>
      {/* Progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, height: 4, background: "var(--color-border-light)" }}>
        <div style={{ height: "100%", background: current.color, width: `${progress}%`, transition: "width 0.4s" }} />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", display: "flex", gap: "var(--space-xl)", alignItems: "flex-start" }}>
        {/* LEFT: Step content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Step header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-l)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: current.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, flexShrink: 0 }}>
              {step + 1}
            </div>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontWeight: 600 }}>
                Шаг {step + 1} из {STEPS.length} · ~{current.time}
              </div>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 900, fontFamily: "var(--font-heading)", margin: "4px 0 0" }}>
                {current.title}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div style={{
            padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)",
            borderLeft: `4px solid ${current.color}`, borderRadius: 0, marginBottom: "var(--space-l)",
            fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.8, whiteSpace: "pre-wrap",
          }}>
            {current.content}
          </div>

          {/* Question */}
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-s)", color: "var(--color-text-primary)" }}>
            {current.question}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
            {current.options.map((opt: any) => {
              const isSelected = selectedOption === opt.id;
              return (
                <button key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  disabled={isDone}
                  style={{
                    textAlign: "left", padding: "var(--space-m)", borderRadius: 0,
                    border: isSelected ? `2px solid ${current.color}` : "1px solid var(--color-border-light)",
                    background: isSelected ? `${current.color}10` : "var(--color-bg-primary)",
                    cursor: isDone ? "default" : "pointer",
                    opacity: isDone && !isSelected ? 0.5 : 1,
                    display: "flex", alignItems: "flex-start", gap: 10,
                  }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${isSelected ? current.color : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {isSelected && <Check size={14} style={{ color: current.color }} />}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "var(--text-s)" }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "var(--space-l)" }}>
            {step > 0 && (
              <button onClick={handlePrev}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 20px", borderRadius: 0, border: "1px solid var(--color-border)", background: "white", cursor: "pointer", fontWeight: 600, fontSize: "var(--text-s)" }}>
                <ChevronLeft size={16} /> Назад
              </button>
            )}

            {selectedOption && option?.action === "explain" && !aiResponse && (
              <button onClick={handleExplain} disabled={aiLoading}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: current.color, color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "var(--text-s)" }}>
                <Sparkles size={16} /> {aiLoading ? "Думает..." : "Объясни подробнее"}
              </button>
            )}

            {(aiResponse || isDone || (selectedOption && option?.action === "next")) && (
              <button onClick={handleNext}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "var(--text-s)" }}>
                {isLast ? "Завершить" : "Дальше"} <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* AI response */}
          {aiResponse && (
            <div style={{ padding: "var(--space-m)", background: `${current.color}10`, borderRadius: 0, border: `1px solid ${current.color}30`, marginBottom: "var(--space-l)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: current.color, marginBottom: 6 }}>
                <Sparkles size={14} style={{ display: "inline", marginRight: 4 }} /> Ответ от AI-наставника
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiResponse}</div>
            </div>
          )}
        </div>

        {/* RIGHT: Progress map */}
        <div style={{
          width: 220, flexShrink: 0, position: "sticky", top: 24,
          padding: "var(--space-m)", background: "var(--color-bg-primary)",
          border: "1px solid var(--color-border-light)", borderRadius: 0,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-m)" }}>
            Карта пути
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((s, i) => {
              const isActive = i === step;
              const isStepDone = completed.has(i);
              return (
                <button key={i}
                  onClick={() => { if (isStepDone || i <= step) { setStep(i); setSelectedOption(""); setAiResponse(""); } }}
                  style={{
                    textAlign: "left", background: "none", border: "none", cursor: isStepDone || i <= step ? "pointer" : "default",
                    padding: 0, display: "flex", gap: 0, minHeight: 56,
                  }}>
                  {/* Vertical line + circle */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                    <div style={{
                      width: isActive ? 32 : 28, height: isActive ? 32 : 28, borderRadius: "50%",
                      background: isStepDone ? s.color : isActive ? s.color : "var(--color-border-light)",
                      border: isActive && !isStepDone ? `3px solid ${s.color}40` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isStepDone || isActive ? "white" : "var(--color-text-tertiary)",
                      fontWeight: 800, fontSize: 12, transition: "all 0.2s",
                    }}>
                      {isStepDone ? <Check size={14} /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 12, background: isStepDone ? s.color : "var(--color-border-light)", opacity: 0.3 }} />
                    )}
                  </div>
                  {/* Label */}
                  <div style={{ padding: "8px 0 8px 10px", flex: 1 }}>
                    <div style={{
                      fontSize: 11, fontWeight: isActive ? 700 : 500,
                      color: isStepDone ? s.color : isActive ? s.color : "var(--color-text-tertiary)",
                      lineHeight: 1.3,
                    }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginTop: 2 }}>{s.time}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
