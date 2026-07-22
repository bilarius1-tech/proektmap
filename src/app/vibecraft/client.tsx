"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ExternalLink, MessageCircle, Zap, AlertTriangle, Lightbulb, BookOpen, Rocket, Wrench } from "lucide-react";

// Curated FAQ from Telegram channels + official docs
const FAQ_CATEGORIES = [
  {
    category: "🚀 Старт и доступ",
    icon: Rocket,
    color: "#0fb880",
    questions: [
      { q: "Как получить доступ к VibeCraft?", a: "Нужен Yandex ID. Зайдите на vibe.sourcecraft.dev, нажмите «Запросить доступ». Ожидание — от нескольких часов до 2-3 дней. Доступ дают волнами." },
      { q: "Мне не дают доступ уже неделю. Что делать?", a: "Проверьте spam-папку почты. Убедитесь что Yandex ID активен. Попробуйте зайти на sourcecraft.dev — иногда доступ открывается там раньше. Напишите в поддержку через форму на сайте." },
      { q: "Нужен ли VPN для VibeCraft?", a: "Нет. VibeCraft работает из России без VPN. Все серверы в Yandex Cloud на территории РФ." },
      { q: "Какие браузеры поддерживаются?", a: "Яндекс.Браузер, Chrome, Firefox. Safari работает нестабильно (баги с WebSocket)." },
      { q: "Можно ли пользоваться с телефона?", a: "Официально — только десктоп. Мобильная версия в разработке. Некоторые пользователи открывают через «Версию для ПК» в мобильном браузере, но это неудобно." },
    ],
  },
  {
    category: "⚙️ Возможности и ограничения",
    icon: Wrench,
    color: "#3b82f6",
    questions: [
      { q: "Что можно создать в VibeCraft?", a: "Лендинги, корпоративные сайты, интернет-магазины, CRM, трекеры задач, мини-игры, квизы, опросы, дашборды. ИИ генерирует уникальный код под задачу, а не подставляет шаблон." },
      { q: "Какие языки и фреймворки используются?", a: "Преимущественно TypeScript/JavaScript. Фронтенд — React/Next.js. Бэкенд — Node.js. База данных — PostgreSQL. Стили — CSS/Tailwind." },
      { q: "Можно ли подключить свой домен?", a: "Да. После публикации в Yandex Cloud можно привязать свой домен через DNS. Инструкция в документации SourceCraft." },
      { q: "Какие есть ограничения по размеру проекта?", a: "Официальных лимитов нет, но при очень больших проектах (100+ страниц) ИИ может терять контекст. Рекомендуют разбивать на модули." },
      { q: "Можно ли подключить внешнее API?", a: "Да, через fetch/axios. Но некоторые API требуют серверной части — тогда нужен бэкенд в Yandex Cloud." },
      { q: "Поддерживается ли работа с файлами?", a: "Загрузка изображений — да. Загрузка PDF, DOCX — через внешние сервисы. Файловая система — ограничена." },
    ],
  },
  {
    category: "💰 Цены и нейрокредиты",
    icon: Zap,
    color: "#f59e0b",
    questions: [
      { q: "Сколько стоит VibeCraft?", a: "При регистрации — 4000 нейрокредитов бесплатно. Тариф Free — 0₽ (ограничен). Pro — 250₽/мес. Плюс оплата ресурсов Yandex Cloud при публикации (~150-500₽/мес)." },
      { q: "Что такое нейрокредиты и как они расходуются?", a: "Нейрокредит = одно действие ИИ (генерация кода, ответ на вопрос, исправление). Сложные задачи тратят больше кредитов. 4000 хватает примерно на 2-3 небольших проекта." },
      { q: "Можно ли докупить нейрокредиты?", a: "Да, через тариф Pro. Пакеты: 10 000 кредитов / 100 000 кредитов. Цены уточняйте в личном кабинете." },
      { q: "Yandex Cloud — это обязательно платить?", a: "Для разработки и превью — нет. Для публикации сайта в интернет — да, нужен аккаунт Yandex Cloud и оплата ресурсов." },
    ],
  },
  {
    category: "🆚 Сравнение с аналогами",
    icon: AlertTriangle,
    color: "#8b5cf6",
    questions: [
      { q: "Чем VibeCraft отличается от Tilda?", a: "Tilda — конструктор с готовыми блоками. VibeCraft — ИИ генерирует уникальный код. Tilda: шаблоны. VibeCraft: индивидуальный проект. Tilda: визуальный редактор. VibeCraft: текстовые команды + превью." },
      { q: "Чем отличается от Bolt.new или Lovable?", a: "Bolt/Lovable: английский язык, нужен VPN, зарубежная карта. VibeCraft: русский язык, без VPN, российские карты. Плюс VibeCraft даёт полный доступ к коду в SourceCraft-репозитории." },
      { q: "Чем отличается от Cursor или Reasonix?", a: "Cursor/Reasonix — для разработчиков, которые пишут код. VibeCraft — для тех, кто НЕ пишет код. VibeCraft = no-code. Cursor = AI-IDE для профи." },
      { q: "VibeCraft vs ChatGPT/Claude — что лучше для создания сайта?", a: "ChatGPT/Claude дадут код, но вам придётся самим его запускать, деплоить, настраивать хостинг. VibeCraft делает это за вас: написал идею → получил работающий сайт в интернете." },
    ],
  },
  {
    category: "💡 Советы и лайфхаки",
    icon: Lightbulb,
    color: "#ec4899",
    questions: [
      { q: "Как правильно описать проект чтобы ИИ понял?", a: "Формула: Цель + Аудитория + Функционал + Дизайн. Пример: «Лендинг стоматологии для клиентов 30-50 лет. Нужна форма записи, галерея работ, отзывы. Сине-белая гамма, строгий стиль.»" },
      { q: "Как экономить нейрокредиты?", a: "1) Думайте перед запросом — чёткая формулировка экономит 30% кредитов. 2) Исправляйте мелкие баги вручную в редакторе кода. 3) Не просите ИИ перегенерировать весь проект — просите исправить конкретный блок." },
      { q: "Что делать если ИИ «зациклился»?", a: "Нажмите «Отменить» и начните заново с более конкретным запросом. Если не помогает — создайте новый чат. Старый чат можно удалить." },
      { q: "Как забрать код и уйти с платформы?", a: "Код хранится в SourceCraft-репозитории. Вы можете клонировать его через Git: git clone https://git.sourcecraft.dev/your-project.git. Весь код ваш." },
      { q: "Можно ли работать вдвоём над одним проектом?", a: "Пока нет. Совместная работа в разработке. Пока только один пользователь на проект." },
    ],
  },
  {
    category: "🛠️ Технические вопросы",
    icon: Wrench,
    color: "#06b6d4",
    questions: [
      { q: "Почему сайт не открывается после публикации?", a: "1) Проверьте что проект опубликован (кнопка «Деплой»). 2) Проверьте DNS если привязали домен. 3) Подождите 5-10 минут — первый деплой дольше. 4) Проверьте логи в Yandex Cloud." },
      { q: "Как добавить Яндекс.Метрику?", a: "Создайте счётчик в Метрике → скопируйте код → вставьте в <head> через настройки проекта в SourceCraft." },
      { q: "Как сделать адаптивную мобильную версию?", a: "Напишите ИИ: «Сделай мобильную версию сайта». ИИ добавит media queries. Можно указать конкретные брейкпоинты: «адаптив под 375px и 768px»." },
      { q: "Как подключить базу данных?", a: "ИИ сам создаёт PostgreSQL в Yandex Cloud при необходимости. Вы можете явно попросить: «Нужна база данных для хранения заявок»." },
      { q: "Проект перестал открываться после правок. Что делать?", a: "SourceCraft хранит историю изменений (как Git). Откройте репозиторий → найдите последнюю работающую версию → откатитесь. Или создайте новый чат и попросите ИИ исправить конкретную ошибку." },
    ],
  },
];

export default function VibeCraftKBClient() {
  const [search, setSearch] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("🚀 Старт и доступ");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (q: string) => {
    const next = new Set(expandedQuestions);
    if (next.has(q)) next.delete(q); else next.add(q);
    setExpandedQuestions(next);
  };

  // Search across all questions
  const searchResults = search.length >= 2
    ? FAQ_CATEGORIES.flatMap(cat =>
        cat.questions.filter(q =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
        ).map(q => ({ ...q, category: cat.category }))
      )
    : [];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)" }}>
      {/* Hero */}
      <div style={{
        padding: "var(--space-xl)", marginBottom: "var(--space-xl)",
        background: "linear-gradient(135deg, #0fb88008, #3b82f608)",
        border: "1px solid var(--color-border-light)", borderRadius: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-s)", flexWrap: "wrap" }}>
          <div style={{ fontSize: 36 }}>🏗️</div>
          <div>
            <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 900, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em", margin: 0 }}>
              VibeCraft / SourceCraft — база знаний
            </h1>
            <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginTop: 4 }}>
              Ответы на частые вопросы, собранные из Telegram-чатов и официальной документации
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: "var(--space-m)", flexWrap: "wrap", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          <MessageCircle size={14} />
          <span>Источники: @sourcecraft_ru (12 000+ участников), @vibecraft_chat, официальная документация</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "var(--space-xl)", maxWidth: 500 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Найти ответ... Например: доступ, цены, VPN, домен"
          style={{
            width: "100%", padding: "14px 14px 14px 44px", fontSize: "var(--text-s)", borderRadius: 0,
            border: "2px solid var(--color-border)", background: "var(--color-bg-primary)", outline: "none",
            boxSizing: "border-box", color: "var(--color-text-primary)",
          }}
        />
      </div>

      {/* Search results */}
      {search.length >= 2 && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-s)" }}>
            Найдено: {searchResults.length} ответов
          </div>
          {searchResults.map((item, i) => (
            <div key={i} style={{
              padding: "var(--space-m)", marginBottom: "var(--space-xs)",
              background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)", borderRadius: 0,
            }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-text-primary)" }}>
                {highlightMatch(item.q, search)}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {highlightMatch(item.a, search)}
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                {item.category}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      {!search && FAQ_CATEGORIES.map(cat => (
        <div key={cat.category} style={{ marginBottom: "var(--space-s)" }}>
          {/* Category header */}
          <div
            onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "var(--space-m)",
              background: expandedCategory === cat.category ? `${cat.color}10` : "var(--color-bg-primary)",
              border: `1px solid ${expandedCategory === cat.category ? cat.color : "var(--color-border-light)"}`,
              borderLeft: `4px solid ${cat.color}`,
              borderRadius: 0, cursor: "pointer", transition: "background 0.15s",
            }}
          >
            <cat.icon size={18} style={{ color: cat.color }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{cat.category}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{cat.questions.length} вопросов</div>
            </div>
            <ChevronDown size={16} style={{
              color: "var(--color-text-tertiary)", transition: "0.2s",
              transform: expandedCategory === cat.category ? "rotate(180deg)" : "",
            }} />
          </div>

          {/* Questions */}
          {expandedCategory === cat.category && (
            <div style={{ marginLeft: 24 }}>
              {cat.questions.map((qa, i) => (
                <div key={i} style={{
                  borderBottom: i < cat.questions.length - 1 ? "1px solid var(--color-border-light)" : "none",
                }}>
                  <div
                    onClick={() => toggleQuestion(qa.q)}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      gap: 12, padding: "var(--space-s) var(--space-m)", cursor: "pointer",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", color: "var(--color-text-primary)", lineHeight: 1.5 }}>
                        {qa.q}
                      </div>
                    </div>
                    <ChevronDown size={14} style={{
                      color: "var(--color-text-tertiary)", marginTop: 2, flexShrink: 0, transition: "0.2s",
                      transform: expandedQuestions.has(qa.q) ? "rotate(180deg)" : "",
                    }} />
                  </div>
                  {expandedQuestions.has(qa.q) && (
                    <div style={{
                      padding: "0 var(--space-m) var(--space-m)", fontSize: "var(--text-xs)",
                      color: "var(--color-text-secondary)", lineHeight: 1.7,
                      animation: "expandIn 0.2s ease",
                    }}>
                      {qa.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Resources */}
      <div style={{
        marginTop: "var(--space-xl)", padding: "var(--space-l)", background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border-light)", borderRadius: 0,
      }}>
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-s)" }}>
          📚 Полезные ссылки
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "var(--text-xs)" }}>
          <a href="https://vibe.sourcecraft.dev" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <ExternalLink size={12} /> vibe.sourcecraft.dev — платформа VibeCraft
          </a>
          <a href="https://sourcecraft.dev" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <ExternalLink size={12} /> sourcecraft.dev — платформа SourceCraft
          </a>
          <a href="https://t.me/sourcecraft_ru" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <ExternalLink size={12} /> @sourcecraft_ru — официальный Telegram-канал
          </a>
          <Link href="/ai-tools" style={{ color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <ExternalLink size={12} /> Сравнение AI-инструментов на ProektMap
          </Link>
        </div>
      </div>

      <style>{`@keyframes expandIn { from { opacity: 0; max-height: 0 } to { opacity: 1; max-height: 300px } }`}</style>
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  if (!text || !query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '0 2px' }}>{part}</mark>
      : part
  );
}
