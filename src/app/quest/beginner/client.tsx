"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, ChevronLeft, ChevronRight, Circle, ExternalLink, Hammer } from "lucide-react";
import Term from "@/components/glossary/tooltip-term";
import React from "react";

const STEPS = [
  {
    title: "Подготовка инструментов",
    subtitle: "Устанавливаем базу для работы",
    time: "10 мин",
    color: "var(--color-warning)",
    detail: "В 2026 программирование начинается не с синтаксиса. Ты описываешь идею на русском — {{Term|LLM|ИИ}} создаёт код. Но чтобы получить результат, нужно правильно выбрать инструмент.\n\nРоссийские (без VPN, русский язык):\nVibecraft (vibe.sourcecraft.dev) — пишешь идею → сайт. No-code. Для первого знакомства.\nSourceCraft (sourcecraft.dev) — {{Term|GitHub}} + AI-ассистент. Хранение кода.\nGigaCode (gigacode.ru) — AI-помощник от Сбера. VS Code + JetBrains.\n\nМеждународные (нужна карта или VPN):\n{{Term|Cursor}} ([Cursor](https://cursor.com)) — лучший AI-редактор. 20 долл/мес, бесплатный тир.\nVS Code + Copilot — стандарт. Бесплатный редактор + AI (10 долл/мес).\nReasonix (reasonix.ai) — open-source агент. Бесплатно. Для продвинутых.\n\nДва инструмента нужны ВСЕМ:\n{{Term|Node.js}} ([Node.js](https://nodejs.org), LTS) — среда для запуска кода.\nGitHub ([GitHub](https://github.com)) — облачное хранилище. Бесплатно.\n\nГлавное правило: не пиши код руками. Описывай задачу словами — ИИ создаёт код.\n\n🇷🇺 Российские (без VPN, русский язык):\n• Vibecraft (vibe.sourcecraft.dev) — пишешь идею → сайт. No-code. Бесплатно.\n• SourceCraft (sourcecraft.dev) — GitHub + AI-ассистент. Yandex ID.\n• GigaCode (gigacode.ru) — Copilot от Сбера. VS Code + JetBrains.\n\n🌍 Международные (нужен VPN или карта):\n• Cursor ([Cursor](https://cursor.com)) — лучший AI-редактор. $20/мес.\n• VS Code + Copilot — бесплатный редактор + AI ($10/мес).\n• Reasonix (reasonix.ai) — open-source, терминал. Бесплатно.\n\n⚡ Ещё нужно: Node.js ([Node.js](https://nodejs.org) LTS) + GitHub ([GitHub](https://github.com)).",
    checklist: [
      "Прочитай обзор и выбери инструмент",
      "Новичок — Vibecraft (русский, бесплатно, без VPN)",
      "Есть опыт — Cursor или VS Code Copilot",
      "Всем: Node.js (nodejs.org, LTS)",
      "Всем: GitHub (github.com)",
    ],
    why: "Российские сервисы работают без VPN и принимают российские карты. Международные мощнее, но требуют зарубежную карту. Node.js и GitHub нужны всем. Главное — не учить синтаксис, а учиться ставить задачи ИИ.",
    next: "Создаём первый сайт через AI-промпт",
    result: "Все инструменты установлены и готовы к работе",
  },
  {
    title: "Первый сайт через AI",
    subtitle: "Пишем не код, а промпт",
    time: "15 мин",
    color: "var(--color-accent)",
    detail: "Сейчас произойдёт магия. Ты напишешь обычный текст — и через 5 минут увидишь работающий сайт. Не веришь? Давай проверим.\n\nПредставь: ты фрилансер. Клиент — мастерская по ремонту телефонов. Ему нужен сайт. Бюджет небольшой, срок — вчера. Раньше ты бы потратил неделю на вёрстку. Сейчас — 5 минут и один {{Term|Prompt}}.\n\nОткрой {{Term|Cursor}} → Ctrl+I → вставь промпт ниже → смотри как рождается сайт.",
    checklist: [
      "Открыть Cursor → Ctrl+I (Mac: Cmd+I)",
      "Скопировать готовый промпт (ниже) и вставить в чат",
      "Выполнить команды из терминала: npm install, npm run dev",
      "Открыть http://localhost:3000 — сайт работает!",
    ],
    prompt: "Действуй как frontend-разработчик. Создай проект Next.js с Tailwind. Сделай сайт-визитку для Мастерской по ремонту телефонов. Шапка с названием и телефоном, 3 карточки услуг с ценами, форма заявки (Имя, Телефон), подвал. Тёмный дизайн. Напиши ВСЕ команды для терминала.",
    why: "Правильный промпт = 90% успеха. Мы даём ИИ роль, стек, структуру и пример. Он создаёт код, ты — запускаешь. Через 5 минут у тебя работающий сайт.",
    next: "Учимся менять сайт через ИИ",
    result: "Сайт открывается в браузере на localhost:3000",
  },
  {
    title: "Правки через ИИ",
    subtitle: "Не пишем код — описываем изменения",
    time: "10 мин",
    color: "var(--color-info)",
    detail: "Главное правило: ты не правишь код руками. Ты описываешь {{Term|LLM|ИИ}} что изменить, а он меняет файлы сам.",
    checklist: [
      "В том же чате Cursor написать промпт для правок",
      "Дождаться пока ИИ изменит файлы",
      "Обновить страницу в браузере (F5)",
      "Проверить: карточки увеличиваются при наведении? Валидация работает?",
    ],
    prompt: "Сайт работает. Улучши его: 1) В карточках услуг — hover-эффект (увеличение + тень). 2) В форме — поле Телефон обязательно. Покажи какие файлы изменил и объясни простыми словами.",
    why: "Итеративная разработка — это цикл: написал → проверил → попросил улучшить. Не бойся просить ИИ переделать — он не устаёт. Каждая итерация занимает 2-3 минуты.",
    next: "Сохраняем код в облако",
    result: "Карточки анимируются, форма проверяет телефон",
  },
  {
    title: "Сохранить на GitHub",
    subtitle: "Код в безопасности",
    time: "10 мин",
    color: "var(--color-success)",
    detail: "{{Term|Git}} — машина времени для проекта. {{Term|GitHub}} — облако где хранятся все версии.",
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
    color: "var(--color-error)",
    detail: "Твой сайт работает локально. Сейчас он станет доступен всему миру.",
    checklist: [
      "Зайти на vercel.com → войти через GitHub",
      "Import Repository → выбрать проект → Deploy",
      "Подождать 1-2 минуты сборки",
      "Открыть ссылку вида проект.vercel.app — сайт в интернете!",
    ],
    why: "Vercel автоматически собирает и публикует проект. Никаких серверов, никаких настроек. Ты просто подключаешь репозиторий — и сайт в интернете.",
    next: "Ты прошёл весь путь!",
    result: "Сайт доступен по ссылке в интернете",
  },
  {
    title: "Структура проекта",
    subtitle: "Понимаем что внутри папок",
    time: "10 мин",
    color: "var(--color-warning)",
    detail: "Ты создал сайт, но что внутри? Как машина: ты умеешь ездить, но не знаешь что под капотом. Сейчас откроем капот.\n\n{{Term|package.json}} — это паспорт проекта. Здесь записано: имя, версия, какие библиотеки используются. Node_modules — это склад запчастей. Тысячи файлов, которые ты не писал, но без них ничего не работает.\n\nПонимание структуры — это переход от «я скопировал и заработало» к «я знаю что где лежит и могу это изменить».",
    checklist: [
      "Открыть папку проекта в Cursor",
      "Найти файл package.json — прочитать что внутри",
      "Понять: dependencies = библиотеки, scripts = команды",
      "Найти папку src/app — здесь живут страницы",
    ],
    why: "Понимание структуры проекта = контроль над ним. Ты не просто копируешь команды — ты знаешь ЗАЧЕМ они нужны. Это отличает инженера от копипастера.",
    next: "Учимся хранить секреты",
    result: "Понимаешь структуру Next.js проекта",
  },
  {
    title: "Переменные окружения",
    subtitle: "Секреты и безопасность",
    time: "10 мин",
    color: "var(--color-info)",
    detail: "Один программист забыл убрать {{Term|API}}-ключ из кода и залил на {{Term|GitHub}}. Через час пришёл счёт на 5000 долларов — кто-то использовал его ключ для майнинга крипты.\n\n.env — это сейф для секретов. Здесь лежат: пароли, ключи API, {{Term|Token}}ы. Этот файл НИКОГДА не попадает в GitHub. .gitignore — это охранник, который не пускает .env в репозиторий.\n\n5 минут настройки сейчас = тысячи долларов экономии потом.",
    checklist: [
      "Создать файл .env в корне проекта",
      "Добавить .env в .gitignore (чтобы не утёк в GitHub)",
      "Создать .env.example — шаблон без реальных данных",
      "Понять разницу: локальные ключи vs продакшен",
    ],
    prompt: "Объясни что такое .env файл, .gitignore и почему секреты нельзя хранить в коде. Покажи как создать .env.example для моего Next.js проекта. Я новичок.",
    why: "Утечка API-ключа в GitHub = взлом за 5 минут + счёт на тысячи долларов. Это самая частая ошибка новичков. 5 минут настройки сейчас — тысячи долларов экономии потом.",
    next: "Настройка SEO и аналитики",
    result: ".env настроен, секреты в безопасности",
  },
  {
    title: "SEO и аналитика",
    subtitle: "Сайт находят в поиске",
    time: "15 мин",
    color: "var(--color-success)",
    detail: "Ты сделал сайт. Он прекрасен. Но Яндекс о нём не знает. Это как открыть магазин в подвале без вывески — никто не найдёт.\n\n{{Term|SEO}} — это вывеска для поисковиков. Title и Description — это то, что люди видят в搜索结果. {{Term|Sitemap}} — это карта магазина для роботов. Метрика — это камера наблюдения: кто заходит, откуда, что делает.\n\nБез этого сайт существует в вакууме. С этим — становится видимым для миллионов.",
    checklist: [
      "Добавить title и description на главную страницу",
      "Создать sitemap.xml и robots.txt",
      "Зарегистрироваться в Яндекс.Метрике",
      "Добавить код Метрики в layout.tsx",
    ],
    prompt: "Добавь SEO для моего Next.js проекта: 1) Динамические meta-теги (title, description, OG) 2) sitemap.ts 3) Интеграцию Яндекс.Метрики через next/script. Объясни каждое изменение простыми словами.",
    why: "Без SEO сайт не найдёт ни один поисковик. Ты можешь сделать лучший сайт в мире, но без метатегов его никто не увидит. Это последний шаг перед реальными пользователями.",
    next: "Ты прошёл полный путь AI-разработчика!",
    result: "SEO настроено, Метрика подключена",
  },
];

export default function BeginnerPathClient() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
const STEP_TERMS: Record<number, string[]> = {
  1: ["Cursor", "Vibecraft", "Node.js", "GitHub", "SourceCraft", "GigaCode", "Reasonix", "VS Code"],
  2: ["Next.js", "Tailwind", "localhost", "npm", "Frontend", "Backend", "Prompt"],
  3: ["Итерация", "Hover-эффект", "Валидация", "React"],
  4: ["Git", "Репозиторий", "Commit", "Push", "Ветка", "Pull Request"],
  5: ["Деплой", "Vercel", "HTTPS", "Домен", "Сервер", "Хостинг"],
  6: ["package.json", "Модули", "Зависимости", "Фреймворк", "Структура"],
  7: ["Безопасность", "Токен", "API", "Аутентификация", "Шифрование"],
  8: ["SEO", "Sitemap", "Метатеги", "Аналитика", "Индексация", "Робот"],
};


  useEffect(() => {
    try {
      const saved = localStorage.getItem("beginner-path-v5");
      if (saved) { const data = JSON.parse(saved); if (data.step) setStep(data.step); if (data.completed) setCompleted(new Set(data.completed)); }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("beginner-path-v5", JSON.stringify({ step, completed: [...completed] }));
  }, [step, completed]);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;
  const progress = Math.round(((completed.size) / STEPS.length) * 100);

  function handleComplete() {
    setCompleted(prev => new Set([...prev, step]));
    if (!isLast) setStep(prev => prev + 1);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg-secondary)",
      fontFamily: "var(--font-body)",
    }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: "var(--color-border-light)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-accent)", transition: "width 0.4s" }} />
      </div>

      <div style={{ display: "flex" }}>
        {/* SIDEBAR — steps */}
        <aside style={{
          width: "clamp(240px, 22vw, 290px)", background: "var(--color-bg-primary)",
          borderRight: "1px solid var(--color-border-light)",
          minHeight: "calc(100vh - 4px)", padding: "var(--space-xl)", flexShrink: 0,
          display: "var(--sidebar-display, block)",
        }} className="quest-sidebar">
          <div style={{
            fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-tertiary)",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-m)",
          }}>
            Путь проекта
          </div>
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isStepDone = completed.has(i);
            return (
              <div key={i}
                onClick={() => { if (isStepDone || i <= Math.max(step, ...[...completed])) { setStep(i); setMobileSidebarOpen(false); } }}
                style={{
                  padding: "var(--space-s) var(--space-m)", borderRadius: 0, marginBottom: 4,
                  cursor: isStepDone || i <= step ? "pointer" : "default",
                  background: isActive ? "var(--color-accent-light)" : "transparent",
                  border: isActive ? "1px solid var(--color-accent)" : "1px solid transparent",
                  opacity: i > step && !isStepDone ? 0.35 : 1,
                  transition: "background 0.15s",
                }}>
                <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>
                  {isStepDone
                    ? <Check size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                    : <Circle size={14} style={{ color: isActive ? "var(--color-accent)" : "var(--color-border)", flexShrink: 0 }} />
                  }
                  {i + 1}. {s.title}
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{s.subtitle}</div>
              </div>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: "clamp(20px, 4vw, 50px)", minWidth: 0 }}>
          {/* Mobile sidebar toggle */}
          <div style={{ display: "none", marginBottom: "var(--space-m)" }} className="quest-mobile-toggle">
            <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 0,
                border: "1px solid var(--color-border)", background: "var(--color-bg-primary)",
                color: "var(--color-text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: "var(--text-xs)",
              }}>
              <Hammer size={14} /> {mobileSidebarOpen ? "Скрыть шаги" : "Все шаги (" + STEPS.length + ")"}
            </button>
          </div>

          {/* Mobile sidebar dropdown */}
          {mobileSidebarOpen && (
            <div style={{ display: "none", marginBottom: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)" }} className="quest-mobile-sidebar">
              {STEPS.map((s, i) => {
                const isActive = i === step;
                const isStepDone = completed.has(i);
                return (
                  <div key={i}
                    onClick={() => { if (isStepDone || i <= step) { setStep(i); setMobileSidebarOpen(false); } }}
                    style={{
                      padding: "8px 12px", cursor: "pointer", fontWeight: isActive ? 700 : 500,
                      fontSize: "var(--text-xs)", color: isActive ? "var(--color-accent)" : isStepDone ? "var(--color-success)" : "var(--color-text-secondary)",
                    }}>
                    {i + 1}. {s.title}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step badge */}
          <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 0, background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-s)" }}>
            Шаг {step + 1} из {STEPS.length} · ~{current.time}
          </div>

          <h1 style={{
            fontSize: "var(--text-xxl)", fontWeight: 900, marginBottom: "var(--space-xs)",
            fontFamily: "var(--font-heading)", letterSpacing: "-0.02em",
          }}>
            {current.title}
          </h1>
          <RichText text={current.detail} />

          {/* Grid: content + right panel */}
          <div className="quest-grid" style={{ display: "grid", gridTemplateColumns: "1fr clamp(240px, 25%, 300px)", gap: "var(--space-xl)" }}>
            {/* LEFT: Checklist + Why + Prompt */}
            <div>
              <div style={{
                background: "var(--color-bg-primary)", borderRadius: 0, padding: "var(--space-xl)",
                border: "1px solid var(--color-border-light)", marginBottom: "var(--space-l)",
              }}>
                <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)", fontFamily: "var(--font-heading)" }}>Что нужно сделать</h2>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {current.checklist.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "var(--space-s) 0", borderBottom: i < current.checklist.length - 1 ? "1px solid var(--color-border-light)" : "none",
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", border: "2px solid var(--color-accent)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                      }} />
                      <span style={{ lineHeight: 1.6, fontSize: "var(--text-s)" }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Prompt block */}
                {current.prompt && (
                  <div style={{ marginTop: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: 8, color: "var(--color-accent)" }}>
                      <Sparkles size={14} style={{ display: "inline", marginRight: 4 }} /> Готовый промпт — скопируй и вставь в Cursor
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
                      {current.prompt}
                    </div>
                  </div>
                )}

                {/* Why */}
                <div style={{
                  marginTop: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-warning-light)",
                  border: "1px solid var(--color-warning)", borderRadius: 0,
                }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 6 }}>Почему это важно?</div>
                  <div style={{ lineHeight: 1.7, color: "var(--color-text-secondary)", fontSize: "var(--text-xs)" }}>{current.why}</div>
                </div>
              </div>

              {/* Nav buttons */}
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                {step > 0 && (
                  <button onClick={() => setStep(prev => prev - 1)}
                    style={{
                      padding: "var(--space-s) var(--space-l)", borderRadius: 0,
                      border: "1px solid var(--color-border)", background: "var(--color-bg-primary)",
                      cursor: "pointer", fontWeight: 600, fontSize: "var(--text-s)",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                    <ChevronLeft size={16} /> Назад
                  </button>
                )}
                <button onClick={handleComplete}
                  style={{
                    flex: 1, padding: "var(--space-s) var(--space-l)", borderRadius: 0, border: "none",
                    background: "var(--color-accent)", color: "white", cursor: "pointer",
                    fontWeight: 700, fontSize: "var(--text-s)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  {isLast ? "Завершить маршрут" : "Готово, дальше"} <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* RIGHT: Info panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
              {/* AI Architect */}
              <div style={{ background: "var(--color-bg-primary)", padding: "var(--space-l)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-s)", fontFamily: "var(--font-heading)" }}>AI Архитектор</div>
                <p style={{ lineHeight: 1.7, color: "var(--color-text-secondary)", fontSize: "var(--text-xs)", marginBottom: "var(--space-m)" }}>
                  Я сопровождаю тебя на протяжении всего маршрута. Моя задача — не писать код вместо тебя, а помогать принимать правильные инженерные решения.
                </p>
                <button onClick={handleComplete}
                  style={{
                    display: "block", width: "100%", padding: "var(--space-s)", borderRadius: 0, border: "none",
                    background: "var(--color-accent)", color: "white", fontWeight: 700, fontSize: "var(--text-xs)", cursor: "pointer",
                  }}>
                  {isLast ? "Завершить" : "Начать этап →"}
                </button>
              </div>

              {/* Checklist status */}
              <div style={{ background: "var(--color-bg-primary)", padding: "var(--space-l)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-s)", fontFamily: "var(--font-heading)" }}>После завершения</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {current.checklist.slice(0, 4).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      {completed.has(step) ? <Check size={12} style={{ color: "var(--color-accent)", flexShrink: 0 }} /> : <Circle size={12} style={{ color: "var(--color-border)", flexShrink: 0 }} />}
                      <span style={{ opacity: completed.has(step) ? 0.6 : 1 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next step */}
              {!isLast && (
                <div style={{
                  padding: "var(--space-m)", background: "var(--color-success-light)", borderRadius: 0,
                  border: "1px solid var(--color-success)", fontSize: "var(--text-xs)",
                  lineHeight: 1.6, color: "var(--color-text-secondary)",
                }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: 4, color: "var(--color-success)" }}>Следующий этап</div>
                  {STEPS[step + 1]?.title} — {STEPS[step + 1]?.subtitle}
                </div>
              )}

              {/* Result */}
              <div style={{
                padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: 0,
                fontSize: "var(--text-xs)", lineHeight: 1.6, color: "var(--color-text-secondary)",
              }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: 4, color: "var(--color-text-primary)" }}>Результат этапа</div>
                {current.result}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .quest-sidebar { display: none !important; }
          .quest-mobile-toggle { display: block !important; }
          .quest-mobile-sidebar { display: block !important; }
          .quest-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
