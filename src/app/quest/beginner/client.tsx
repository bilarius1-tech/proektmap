"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, ChevronLeft, ChevronRight, Circle, ExternalLink } from "lucide-react";

const STEPS = [
  {
    title: "Подготовка инструментов",
    subtitle: "Устанавливаем базу для работы",
    time: "10 мин",
    color: "#f59e0b",
    detail: `Для AI-разработки нужны три бесплатных инструмента. Не пропускай этот шаг — без них ничего не заработает.`,
    checklist: [
      "Скачать и установить Cursor с cursor.com (Windows/Mac/Linux)",
      "Установить Node.js (LTS) с nodejs.org",
      "Зарегистрироваться на github.com",
    ],
    why: "Cursor даёт ИИ-помощника прямо в редакторе кода. Node.js — движок для запуска JavaScript. GitHub — облачное хранилище, чтобы код не потерялся. Без любого из трёх — разработка превращается в боль.",
    next: "Создаём первый сайт через AI-промпт",
    result: "Все инструменты установлены и готовы к работе",
  },
  {
    title: "Первый сайт через AI",
    subtitle: "Пишем не код, а промпт",
    time: "15 мин",
    color: "#3b82f6",
    detail: "Ты создашь сайт, не написав ни строчки кода. Только один текстовый промпт. ИИ сделает всё остальное.",
    checklist: [
      "Открыть Cursor → Ctrl+I (Mac: Cmd+I)",
      "Скопировать готовый промпт (ниже) и вставить в чат",
      "Выполнить команды из терминала: npm install, npm run dev",
      "Открыть http://localhost:3000 — сайт работает!",
    ],
    prompt: `Действуй как frontend-разработчик. Создай проект Next.js с Tailwind. Сделай сайт-визитку для Мастерской по ремонту телефонов. Шапка с названием и телефоном, 3 карточки услуг с ценами, форма заявки (Имя, Телефон), подвал. Тёмный дизайн. Напиши ВСЕ команды для терминала.`,
    why: "Правильный промпт = 90% успеха. Мы даём ИИ роль, стек, структуру и пример. Он создаёт код, ты — запускаешь. Через 5 минут у тебя работающий сайт.",
    next: "Учимся менять сайт через ИИ",
    result: "Сайт открывается в браузере на localhost:3000",
  },
  {
    title: "Правки через ИИ",
    subtitle: "Не пишем код — описываем изменения",
    time: "10 мин",
    color: "#8b5cf6",
    detail: "Главное правило: ты не правишь код руками. Ты описываешь ИИ что изменить, а он меняет файлы сам. Это быстрее и безопаснее.",
    checklist: [
      "В том же чате Cursor написать промпт для правок (ниже)",
      "Дождаться пока ИИ изменит файлы",
      "Обновить страницу в браузере (F5)",
      "Проверить: карточки увеличиваются при наведении? Валидация работает?",
    ],
    prompt: `Сайт работает. Улучши его: 1) В карточках услуг — hover-эффект (увеличение + тень). 2) В форме — поле Телефон обязательно. Покажи какие файлы изменил и объясни простыми словами.`,
    why: "Итеративная разработка — это цикл: написал → проверил → попросил улучшить. Не бойся просить ИИ переделать — он не устаёт. Каждая итерация занимает 2-3 минуты.",
    next: "Сохраняем код в облако",
    result: "Карточки анимируются, форма проверяет телефон",
  },
  {
    title: "Сохранить на GitHub",
    subtitle: "Код в безопасности",
    time: "10 мин",
    color: "#22c55e",
    detail: "Git — машина времени для проекта. GitHub — облако где хранятся все версии. Если компьютер сломается — код не пропадёт.",
    checklist: [
      "Создать репозиторий на GitHub (кнопка New)",
      "Спросить ИИ: «Дай 4 команды для git init, add, commit, push»",
      "Выполнить команды в терминале Cursor (Ctrl+`)",
      "Проверить: файлы видны на github.com",
    ],
    why: "Без Git ты потеряешь код при первой ошибке. С Git ты можешь откатиться на любую версию. GitHub хранит копию в облаке — доступно с любого компьютера.",
    next: "Публикуем сайт в интернет",
    result: "Код в репозитории на GitHub",
  },
  {
    title: "Сайт в интернете",
    subtitle: "Деплой на Vercel",
    time: "10 мин",
    color: "#ef4444",
    detail: "Твой сайт работает локально. Сейчас он станет доступен всему миру. Vercel — бесплатный хостинг для Next.js проектов.",
    checklist: [
      "Зайти на vercel.com → войти через GitHub",
      "Import Repository → выбрать проект → Deploy",
      "Подождать 1-2 минуты сборки",
      "Открыть ссылку вида проект.vercel.app — сайт в интернете!",
    ],
    why: "Vercel автоматически собирает и публикует проект. Никаких серверов, никаких настроек. Ты просто подключаешь репозиторий — и сайт в интернете. Бесплатный домен, автоматический HTTPS.",
    next: "Ты прошёл весь путь!",
    result: "Сайт доступен по ссылке в интернете",
  },
];

export default function BeginnerPathClient() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("beginner-path-v3");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.step) setStep(data.step);
        if (data.completed) setCompleted(new Set(data.completed));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("beginner-path-v3", JSON.stringify({ step, completed: [...completed] }));
  }, [step, completed]);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;
  const progress = Math.round(((completed.size) / STEPS.length) * 100);

  function handleComplete() {
    setCompleted(prev => new Set([...prev, step]));
    if (!isLast) setStep(prev => prev + 1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "var(--font-body)" }}>
    
      <div style={{ display: "flex" }}>
        {/* SIDEBAR — steps */}
        <aside style={{
          width: 310, background: "white", borderRight: "1px solid #ececec",
          minHeight: "calc(100vh - 72px)", padding: 35, flexShrink: 0,
        }}>
          <h3 style={{ marginBottom: 20, fontSize: 13, color: "#777", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Путь проекта
          </h3>
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isStepDone = completed.has(i);
            return (
              <div key={i}
                onClick={() => { if (isStepDone || i <= Math.max(step, ...[...completed])) { setStep(i); } }}
                style={{
                  padding: 15, borderRadius: 0, marginBottom: 6, cursor: isStepDone || i <= step ? "pointer" : "default",
                  background: isActive ? "#eef3ff" : "transparent",
                  border: isActive ? "1px solid #d8e2ff" : "1px solid transparent",
                  transition: "0.2s", opacity: i > step && !isStepDone ? 0.4 : 1,
                }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                  {isStepDone ? <Check size={14} style={{ color: "var(--color-accent)" }} /> : <Circle size={14} style={{ color: isActive ? "var(--color-accent)" : "#ccc" }} />}
                  {i + 1}. {s.title}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{s.subtitle}</div>
              </div>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: 50, minWidth: 0 }}>
          {/* Progress */}
          <div style={{ height: 8, background: "#ececec", borderRadius: 0, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: current.color, transition: "width 0.4s" }} />
          </div>

          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 0, background: `${current.color}15`, color: current.color, fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
            Шаг {step + 1} из {STEPS.length} · ~{current.time}
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.01em" }}>
            {current.title}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#555", maxWidth: 700, marginBottom: 40 }}>
            {current.detail}
          </p>

          {/* Two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 35 }}>
            {/* LEFT: Checklist + Why */}
            <div>
              {/* Checklist */}
              <div style={{
                background: "white", borderRadius: 0, padding: 35,
                border: "1px solid #ececec", marginBottom: 20,
              }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Что нужно сделать</h2>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {current.checklist.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "14px 0", borderBottom: i < current.checklist.length - 1 ? "1px solid #f2f2f2" : "none",
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", border: "2px solid var(--color-accent)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                      }} />
                      <span style={{ lineHeight: 1.6, fontSize: 15 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Prompt */}
                {current.prompt && (
                  <div style={{ marginTop: 20, padding: 20, background: "#f8f8f8", borderRadius: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--color-accent)" }}>
                      <Sparkles size={14} style={{ display: "inline", marginRight: 4 }} /> Готовый промпт — скопируй и вставь в Cursor
                    </div>
                    <div style={{ fontSize: 13, fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#444" }}>
                      {current.prompt}
                    </div>
                  </div>
                )}

                {/* Why */}
                <div style={{
                  marginTop: 20, padding: 20, background: "#FFF9EA", border: "1px solid #FFE29A", borderRadius: 0,
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Почему это важно?</div>
                  <div style={{ lineHeight: 1.7, color: "#666", fontSize: 14 }}>{current.why}</div>
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 10 }}>
                {step > 0 && (
                  <button onClick={() => setStep(prev => prev - 1)}
                    style={{ padding: "14px 24px", borderRadius: 0, border: "1px solid #ececec", background: "white", cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
                    <ChevronLeft size={16} style={{ display: "inline", marginRight: 4 }} /> Назад
                  </button>
                )}
                <button onClick={handleComplete}
                  style={{
                    flex: 1, padding: "14px 24px", borderRadius: 0, border: "none",
                    background: current.color, color: "white", cursor: "pointer", fontWeight: 700, fontSize: 15,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  {isLast ? "Завершить маршрут" : "Готово, дальше"} <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* RIGHT: AI Architect + Results + Next */}
            <div>
              {/* AI Architect */}
              <div style={{ background: "white", padding: 28, borderRadius: 0, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 12, fontSize: 16 }}>AI Архитектор</h3>
                <p style={{ lineHeight: 1.7, color: "#666", fontSize: 14, marginBottom: 16 }}>
                  Я сопровождаю тебя на протяжении всего маршрута. Моя задача — не писать код вместо тебя, а помогать принимать правильные инженерные решения.
                </p>
                <button onClick={handleComplete}
                  style={{
                    display: "block", width: "100%", padding: 16, borderRadius: 0, border: "none",
                    background: current.color, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  }}>
                  {isLast ? "Завершить" : "Начать этап"} <ArrowRight size={14} style={{ display: "inline", marginLeft: 4 }} />
                </button>
              </div>

              {/* After completion */}
              <div style={{ background: "white", padding: 28, borderRadius: 0, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 12, fontSize: 16 }}>После завершения этапа</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {current.checklist.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#555" }}>
                      {completed.has(step) ? <Check size={14} style={{ color: "var(--color-accent)" }} /> : <Circle size={14} style={{ color: "#ddd" }} />}
                      <span style={{ textDecoration: completed.has(step) ? "line-through" : "none", opacity: completed.has(step) ? 0.6 : 1 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next step */}
              {!isLast && (
                <div style={{
                  padding: 18, background: "#EEF8F2", borderRadius: 0,
                  fontSize: 14, lineHeight: 1.6, color: "#444",
                }}>
                  <strong style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#065f46" }}>Следующий этап</strong>
                  {STEPS[step + 1]?.title} — {STEPS[step + 1]?.subtitle}
                </div>
              )}

              {/* Result */}
              <div style={{ marginTop: 15, padding: 15, background: "#f8f8f8", borderRadius: 0, fontSize: 13, lineHeight: 1.6, color: "#666" }}>
                <strong style={{ display: "block", marginBottom: 6, color: "#444" }}>Результат этапа</strong>
                {current.result}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
