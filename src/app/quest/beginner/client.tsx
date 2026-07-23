"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, ChevronLeft, ChevronRight, Circle, ExternalLink, Hammer } from "lucide-react";
import Term from "@/components/glossary/tooltip-term"
import RichText from "@/components/quest/rich-text";
import React from "react";

// Fallback hardcoded data if API fails
const FALLBACK_STEPS = [
  {
    id: "fallback-1", step: 1,
    title: "Подготовка инструментов",
    detail: "В 2026 программирование начинается не с синтаксиса. Ты описываешь идею на русском — {{Term|LLM|ИИ}} создаёт код. Но чтобы получить результат, нужно правильно выбрать инструмент.\n\n🇷🇺 Российские (без VPN, русский язык):\n• [Vibecraft](https://vibe.sourcecraft.dev) — пишешь идею → сайт. No-code. Бесплатно. Идеально для первого знакомства.\n• [SourceCraft](https://sourcecraft.dev) — {{Term|GitHub}} + AI-ассистент. Yandex ID. Профессиональная среда.\n• [GigaCode](https://gigacode.ru) — AI-помощник от Сбера. VS Code + JetBrains.\n\n🌍 Международные (нужен VPN или зарубежная карта):\n• {{Term|Cursor}} ([Cursor](https://cursor.com)) — лучший AI-редактор в мире. $20/мес, есть бесплатный тир.\n• VS Code + Copilot — стандарт индустрии. Бесплатный редактор + AI за $10/мес.\n• [Reasonix](https://reasonix.ai) — open-source AI-агент. Бесплатно. Для продвинутых.\n\n⚡ Два инструмента, которые нужны ВСЕМ:\n• {{Term|Node.js}} ([Node.js](https://nodejs.org), версия LTS) — среда для запуска JavaScript на компьютере.\n• [GitHub](https://github.com) — облачное хранилище кода. Бесплатно. Твой код не пропадёт.\n\nГлавное правило вайбкодинга: ты не пишешь код руками. Ты описываешь задачу словами — ИИ создаёт решение.",
    checklist: '["Прочитай обзор и выбери инструмент","Новичок — Vibecraft (русский, бесплатно, без VPN)","Есть опыт — Cursor или VS Code Copilot","Всем: Node.js (nodejs.org, LTS)","Всем: GitHub (github.com)"]',
    why: "Российские сервисы работают без VPN и принимают российские карты. Международные мощнее, но требуют зарубежную карту. Node.js и GitHub нужны всем. Главное — не учить синтаксис, а учиться ставить задачи ИИ.",
    prompt: "",
    sortOrder: 1,
  },
  {
    id: "fallback-2", step: 2,
    title: "Первый сайт через AI",
    detail: "Сейчас произойдёт магия. Ты напишешь обычный текст — и через 5 минут увидишь работающий сайт. Не веришь? Давай проверим.\n\nПредставь: ты фрилансер. Клиент — мастерская по ремонту телефонов. Ему нужен сайт. Бюджет небольшой, срок — вчера. Раньше ты бы потратил неделю на вёрстку. Сейчас — 5 минут и один {{Term|Prompt}}.\n\nОткрой {{Term|Cursor}} → Ctrl+I → вставь промпт ниже → смотри как рождается сайт.",
    checklist: '["Открыть Cursor → Ctrl+I (Mac: Cmd+I)","Скопировать готовый промпт (ниже) и вставить в чат","Выполнить команды из терминала: npm install, npm run dev","Открыть http://localhost:3000 — сайт работает!"]',
    why: "Правильный промпт = 90% успеха. Мы даём ИИ роль, стек, структуру и пример. Он создаёт код, ты — запускаешь. Через 5 минут у тебя работающий сайт.",
    prompt: "Действуй как frontend-разработчик. Создай проект Next.js с Tailwind. Сделай сайт-визитку для Мастерской по ремонту телефонов. Шапка с названием и телефоном, 3 карточки услуг с ценами, форма заявки (Имя, Телефон), подвал. Тёмный дизайн. Напиши ВСЕ команды для терминала.",
    sortOrder: 2,
  },
  {
    id: "fallback-3", step: 3,
    title: "Правки через ИИ",
    detail: "Сайт работает! Но выглядит как все — серый фон, чёрный текст, никакой души. Сейчас мы превратим его в профессиональный продукт за 2 минуты.\n\nГлавный секрет {{Term|Vibe Coding|вайбкодинга}}: ты не правишь код. Ты описываешь проблему — {{Term|LLM|ИИ}} решает её. Это как работать с джуниор-разработчиком, который никогда не устаёт и не ошибается в синтаксисе.\n\nПравило трёх И: {{Term|Iteration|Итерация}} → Инспекция → Исправление. Повторяй этот цикл пока результат не устроит. Хочешь другой цвет? Скажи. Нужна анимация? Опиши. Не нравится шрифт? Попроси подобрать.\n\nЗапомни: AI делает 80% работы. Твоя задача — оценить результат и сказать что улучшить.",
    checklist: '["В том же чате Cursor написать промпт для правок","Дождаться пока ИИ изменит файлы","Обновить страницу в браузере (F5)","Проверить: карточки увеличиваются при наведении? Валидация работает?"]',
    why: "Итеративная разработка — это цикл: написал → проверил → попросил улучшить. Не бойся просить ИИ переделать — он не устаёт. Каждая итерация занимает 2-3 минуты.",
    prompt: "Сайт работает. Улучши его: 1) В карточках услуг — hover-эффект (увеличение + тень). 2) В форме — поле Телефон обязательно. Покажи какие файлы изменил и объясни простыми словами.",
    sortOrder: 3,
  },
  {
    id: "fallback-4", step: 4,
    title: "Сохранить на GitHub",
    detail: "Представь: ты работал над сайтом 3 дня. Компьютер сгорел. Всё пропало. Больно? А теперь представь что такого никогда не случится.\n\n{{Term|Git}} — это страховка от катастрофы. Три команды — и твой код сохранён навсегда. [GitHub](https://github.com) — облако, где код живёт даже если компьютер упадёт с 10 этажа.\n\nКоманды, которые спасут твою работу:\n• git init — создать историю проекта\n• git add — выбрать файлы для сохранения\n• {{Term|Commit|git commit}} — сделать снимок текущего состояния\n• git push — отправить в облако\n\nЧетыре команды. Миллион спасённых проектов. Выучи их как «раз-два-три-четыре».",
    checklist: '["Создать репозиторий на GitHub (кнопка New)","Спросить ИИ: «Дай 4 команды для git init, add, commit, push»","Выполнить команды в терминале Cursor (Ctrl+`)","Проверить: файлы видны на github.com"]',
    why: "Без Git ты потеряешь код при первой ошибке. С Git ты можешь откатиться на любую версию. GitHub хранит копию в облаке — доступно с любого компьютера.",
    prompt: "",
    sortOrder: 4,
  },
  {
    id: "fallback-5", step: 5,
    title: "Сайт в интернете",
    detail: "Твой сайт живёт только на твоём компьютере. Никто кроме тебя его не видит. Сейчас он выйдет в большой мир.\n\n[Vercel](https://vercel.com) — это как выставить картину в галерее. Был файл на компьютере — стал сайтом в интернете. Бесплатно. Автоматически. С {{Term|SSL|защищённым соединением}}.\n\nТы привязываешь свой [GitHub](https://github.com)-репозиторий → Vercel сам собирает и публикует сайт → ты получаешь ссылку. Всё. Три шага.\n\nЧерез 2 минуты ты отправишь ссылку другу и скажешь: «Смотри, я сделал сайт». И он откроется. На телефоне. У друга. В другом городе. Это магия {{Term|Deploy|деплоя}}.",
    checklist: '["Зайти на vercel.com → войти через GitHub","Import Repository → выбрать проект → Deploy","Подождать 1-2 минуты сборки","Открыть ссылку вида проект.vercel.app — сайт в интернете!"]',
    why: "Vercel автоматически собирает и публикует проект. Никаких серверов, никаких настроек. Ты просто подключаешь репозиторий — и сайт в интернете.",
    prompt: "",
    sortOrder: 5,
  },
  {
    id: "fallback-6", step: 6,
    title: "Структура проекта",
    detail: "Ты создал сайт, но что внутри? Как машина: ты умеешь ездить, но ничего не знаешь о двигателе. Открываем капот.\n\n{{Term|package.json}} — это паспорт проекта. Имя, версия, список библиотек (зависимостей). Если проект — ресторан, то package.json — это меню: что заказано и каких поставщиков.\n\nnode_modules — это склад запчастей. Тысячи файлов от других разработчиков. Ты их не писал, но без них ничего не работает. Их не нужно трогать и не нужно заливать на [GitHub](https://github.com).\n\napp/ — это витрина. Здесь лежат страницы твоего сайта. components/ — кубики интерфейса: кнопки, карточки, формы.\n\nПонимание структуры — переход от «я скопировал и заработало» к «я знаю где что лежит и могу изменить». Это как из пассажира стать водителем.",
    checklist: '["Открыть папку проекта в Cursor","Найти файл package.json — прочитать что внутри","Понять: dependencies = библиотеки, scripts = команды","Найти папку src/app — здесь живут страницы"]',
    why: "Понимание структуры проекта = контроль над ним. Ты не просто копируешь команды — ты знаешь ЗАЧЕМ они нужны. Это отличает инженера от копипастера.",
    prompt: "",
    sortOrder: 6,
  },
  {
    id: "fallback-7", step: 7,
    title: "Переменные окружения",
    detail: "Один программист забыл убрать {{Term|API}}-ключ из кода и залил на {{Term|GitHub}}. Через час пришёл счёт на 5000 долларов — кто-то использовал его ключ для майнинга крипты.\n\n.env — это сейф для секретов. Здесь лежат: пароли, ключи API, {{Term|Token}}ы. Этот файл НИКОГДА не попадает в GitHub. .gitignore — это охранник, который не пускает .env в репозиторий.\n\n5 минут настройки сейчас = тысячи долларов экономии потом.",
    checklist: '["Создать файл .env в корне проекта","Добавить .env в .gitignore (чтобы не утёк в GitHub)","Создать .env.example — шаблон без реальных данных","Понять разницу: локальные ключи vs продакшен"]',
    why: "Утечка API-ключа в GitHub = взлом за 5 минут + счёт на тысячи долларов. Это самая частая ошибка новичков. 5 минут настройки сейчас — тысячи долларов экономии потом.",
    prompt: "Объясни что такое .env файл, .gitignore и почему секреты нельзя хранить в коде. Покажи как создать .env.example для моего Next.js проекта. Я новичок.",
    sortOrder: 7,
  },
  {
    id: "fallback-8", step: 8,
    title: "SEO и аналитика",
    detail: "Ты сделал сайт. Он прекрасен. Но Яндекс о нём не знает. Это как открыть магазин в подвале без вывески — никто не найдёт.\n\n{{Term|SEO}} — это вывеска для поисковиков. Правильные метатеги, sitemap, robots.txt — и твой сайт начинает появляться в поиске. А Яндекс.Метрика — это счётчик посетителей: кто заходит, откуда, что смотрит.\n\nSEO делает сайт видимым.",
    checklist: '["Добавить title и description на главную страницу","Создать sitemap.xml и robots.txt","Зарегистрироваться в Яндекс.Метрике","Добавить код Метрики в layout.tsx"]',
    why: "Без SEO сайт не найдёт ни один поисковик. Ты можешь сделать лучший сайт в мире, но без метатегов его никто не увидит. Это последний шаг перед реальными пользователями.",
    prompt: "Добавь SEO для моего Next.js проекта: 1) Динамические meta-теги (title, description, OG) 2) sitemap.ts 3) Интеграцию Яндекс.Метрики через next/script. Объясни каждое изменение простыми словами.",
    sortOrder: 8,
  },
];

const STEP_TIMES: Record<number, string> = {
  1: "10 мин", 2: "15 мин", 3: "10 мин", 4: "10 мин",
  5: "10 мин", 6: "10 мин", 7: "10 мин", 8: "15 мин",
};

const STEP_COLORS: Record<number, string> = {
  1: "var(--color-warning)", 2: "var(--color-accent)", 3: "var(--color-info)",
  4: "var(--color-success)", 5: "var(--color-error)", 6: "var(--color-warning)",
  7: "var(--color-info)", 8: "var(--color-success)",
};

const STEP_SUBTITLES: Record<number, string> = {
  1: "Устанавливаем базу для работы",
  2: "Пишем не код, а промпт",
  3: "Не пишем код — описываем изменения",
  4: "Код в безопасности",
  5: "Деплой на Vercel",
  6: "Понимаем что внутри папок",
  7: "Секреты и безопасность",
  8: "Сайт находят в поиске",
};

export default function BeginnerPathClient() {
  const [steps, setSteps] = useState<any[]>(FALLBACK_STEPS);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch from API, fallback to hardcoded
  useEffect(() => {
    fetch("/api/quest/beginner")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSteps(data);
        }
      })
      .catch(() => {
        // Use fallback
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("beginner-path-v5");
      if (saved) { const data = JSON.parse(saved); if (data.step) setStep(data.step); if (data.completed) setCompleted(new Set(data.completed)); }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("beginner-path-v5", JSON.stringify({ step, completed: [...completed] }));
  }, [step, completed]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "var(--text-m)", color: "var(--color-text-tertiary)" }}>Загрузка...</div>
      </div>
    );
  }

  const raw = steps[step];
  if (!raw) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 900, fontFamily: "var(--font-heading)", marginBottom: 8 }}>Ты прошёл весь путь!</h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 500, lineHeight: 1.7, marginBottom: 24 }}>
          От идеи до сайта в интернете. Теперь ты знаешь базовый цикл AI-разработки: установить → создать → запустить → сохранить → опубликовать.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setStep(0); setCompleted(new Set()); localStorage.removeItem("beginner-path-v5"); }}
            style={{ padding: "12px 24px", borderRadius: 0, border: "1px solid var(--color-border)", background: "white", cursor: "pointer", fontWeight: 600 }}>
            Пройти заново
          </button>
          <Link href="/quest/services-site"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 0, background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700 }}>
            Следующий уровень <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Parse checklist from JSON string if needed
  let checklist: string[] = [];
  try {
    checklist = typeof raw.checklist === "string" ? JSON.parse(raw.checklist) : raw.checklist;
  } catch {
    checklist = [];
  }

  const current = {
    ...raw,
    checklist,
    subtitle: STEP_SUBTITLES[raw.step] || "",
    time: STEP_TIMES[raw.step] || "10 мин",
    color: STEP_COLORS[raw.step] || "var(--color-accent)",
  };

  const isLast = step >= steps.length - 1;
  const progress = Math.round(((completed.size) / steps.length) * 100);

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
          {steps.map((s, i) => {
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
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{STEP_SUBTITLES[s.step] || ""}</div>
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
              <Hammer size={14} /> {mobileSidebarOpen ? "Скрыть шаги" : "Все шаги (" + steps.length + ")"}
            </button>
          </div>

          {/* Mobile sidebar dropdown */}
          {mobileSidebarOpen && (
            <div style={{ display: "none", marginBottom: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)" }} className="quest-mobile-sidebar">
              {steps.map((s, i) => {
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
            Шаг {step + 1} из {steps.length} · ~{current.time}
          </div>

          <h1 style={{
            fontSize: "var(--text-xxl)", fontWeight: 900, marginBottom: "var(--space-xs)",
            fontFamily: "var(--font-heading)", letterSpacing: "-0.02em",
          }}>
            {current.title}
          </h1>
          

          {/* Grid: content + right panel */}
          <div className="quest-grid" style={{ display: "grid", gridTemplateColumns: "1fr clamp(240px, 25%, 300px)", gap: "var(--space-xl)" }}>
            {/* LEFT: Checklist + Why + Prompt */}
            <div>
              <div style={{
                background: "var(--color-bg-primary)", borderRadius: 0, padding: "var(--space-xl)",
                border: "1px solid var(--color-border-light)", marginBottom: "var(--space-l)",
              }}>
                <RichText text={current.detail} />
              <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)", fontFamily: "var(--font-heading)" }}>Что нужно сделать</h2>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {current.checklist.map((item: string, i: number) => (
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
                  {current.checklist.slice(0, 4).map((item: string, i: number) => (
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
                  {steps[step + 1]?.title} — {STEP_SUBTITLES[steps[step + 1]?.step] || ""}
                </div>
              )}

              {/* Result */}
              <div style={{
                padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: 0,
                fontSize: "var(--text-xs)", lineHeight: 1.6, color: "var(--color-text-secondary)",
              }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: 4, color: "var(--color-text-primary)" }}>Результат этапа</div>
                {current.result || "Готово"}
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
