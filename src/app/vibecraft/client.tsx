"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ExternalLink, MessageCircle, Zap, AlertTriangle, Lightbulb, BookOpen, Rocket, Wrench, Send } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    category: "Старт и доступ",
    section: "01",
    icon: Rocket,
    color: "#0fb880",
    questions: [
      { q: "Как получить доступ к VibeCraft?", a: "Нужен Yandex ID. Зайдите на vibe.sourcecraft.dev, нажмите «Запросить доступ». Ожидание — от нескольких часов до 2-3 дней. Доступ дают волнами, проверяйте почту и папку spam." },
      { q: "Мне не дают доступ уже неделю. Что делать?", a: "Проверьте spam-папку почты. Убедитесь что Yandex ID активен. Попробуйте зайти на sourcecraft.dev — иногда доступ открывается там раньше. Напишите в поддержку через форму на сайте." },
      { q: "Нужен ли VPN?", a: "Нет. VibeCraft работает из России без VPN. Все серверы размещены в Yandex Cloud на территории РФ." },
      { q: "Какие браузеры поддерживаются?", a: "Яндекс.Браузер, Chrome, Firefox. Safari работает нестабильно — возможны баги с WebSocket. Мобильная версия пока в разработке." },
    ],
  },
  {
    category: "Возможности и ограничения",
    section: "02",
    icon: Wrench,
    color: "#3b82f6",
    questions: [
      { q: "Что можно создать?", a: "Лендинги, корпоративные сайты, интернет-магазины, CRM, трекеры задач, мини-игры, квизы, опросы, аналитические панели. ИИ генерирует уникальный код под задачу — это не шаблоны." },
      { q: "Какие технологии используются?", a: "TypeScript/JavaScript. Фронтенд — React/Next.js. Бэкенд — Node.js. База данных — PostgreSQL. Стили — CSS/Tailwind." },
      { q: "Можно ли подключить свой домен?", a: "Да. После публикации в Yandex Cloud — привязать через DNS. Инструкция — в документации SourceCraft." },
      { q: "Поддерживается ли внешнее API?", a: "Да, через fetch/axios. Некоторые API требуют серверной части — тогда нужен бэкенд в Yandex Cloud." },
      { q: "Можно ли работать вдвоём?", a: "Пока нет. Совместная работа в разработке — поддержка только одного пользователя на проект." },
    ],
  },
  {
    category: "Нейрокредиты и цены",
    section: "03",
    icon: Zap,
    color: "#f59e0b",
    questions: [
      { q: "Сколько стоит?", a: "Регистрация — 4000 нейрокредитов бесплатно. Тариф Free — 0₽, Pro — 250₽/мес. Публикация — оплата Yandex Cloud (~150-500₽/мес)." },
      { q: "Что такое нейрокредиты?", a: "Абстрактная единица потребления LLM. Одно действие ИИ = 1 кредит. Сложные задачи тратят больше. 4000 хватает на 2-3 небольших проекта. Источник: SourceCraft docs." },
      { q: "Можно ли докупить?", a: "Да, через тариф Pro. Пакеты: 10 000 / 100 000 кредитов. Цены — в личном кабинете." },
      { q: "Yandex Cloud — обязательно платить?", a: "Для разработки и превью — нет. Для публикации в интернет — да, нужен аккаунт Yandex Cloud." },
    ],
  },
  {
    category: "Сравнение с аналогами",
    section: "04",
    icon: AlertTriangle,
    color: "#8b5cf6",
    questions: [
      { q: "VibeCraft vs Tilda", a: "Tilda — конструктор с готовыми блоками. VibeCraft — ИИ генерирует уникальный код под задачу. Tilda = шаблоны, VibeCraft = индивидуальная разработка." },
      { q: "VibeCraft vs Bolt.new / Lovable", a: "Bolt/Lovable — английский, нужен VPN и зарубежная карта. VibeCraft — русский язык, без VPN, российские карты. Плюс полный доступ к коду в SourceCraft-репозитории." },
      { q: "Code Assistant vs GigaCode", a: "SourceCraft — для экосистемы Яндекса. GigaCode — если нужно окно 128K и лучшая работа с русским языком (экосистема Сбера). Источник: Habr, сравнение." },
      { q: "Кто конкуренты в РФ?", a: "ААХ (React+TS, только фронтенд), Lork (облачная IDE), HostAI. Конструкторы: Tilda (ИИ-блоки), uCoz, Битрикс24. Источник: Habr." },
    ],
  },
  {
    category: "Лайфхаки и советы",
    section: "05",
    icon: Lightbulb,
    color: "#ec4899",
    questions: [
      { q: "Как правильно описать проект?", a: "Формула: Цель + Аудитория + Функционал + Дизайн. Пример: «Лендинг стоматологии для клиентов 30-50 лет. Нужна форма записи, галерея работ, отзывы. Сине-белая гамма, строгий стиль.»" },
      { q: "Как экономить нейрокредиты?", a: "Чёткая формулировка экономит 30%. Мелкие баги правьте руками в редакторе кода. Не просите перегенерировать весь проект — просите исправить конкретный блок." },
      { q: "Как забрать код?", a: "Код в SourceCraft-репозитории. Клонируйте: git clone https://git.sourcecraft.dev/ваш-проект.git. Весь код — ваш." },
      { q: "ИИ зациклился — что делать?", a: "Нажмите «Отменить», начните заново с более конкретным запросом. Если не помогает — создайте новый чат. Старый чат можно удалить." },
    ],
  },
  {
    category: "Технические детали",
    section: "06",
    icon: Wrench,
    color: "#6366f1",
    questions: [
      { q: "Контекстное окно Code Assistant", a: "32K токенов (~50 страниц). Меньше чем GigaChat MAX (128K) и Claude (200K). Для больших проектов может не вместить весь код. Источник: Habr." },
      { q: "Свои модели вместо YandexGPT", a: "Да. Code Assistant поддерживает custom провайдеров — локальная Ollama или API сторонних моделей. Рекомендуются только большие LLM. Источник: Habr." },
      { q: "Индексация кода как в Cursor?", a: "Частично. Эмбеддинги, а не графы как в Cursor. Требуется Ollama локально + Qdrant для векторного поиска. Источник: Habr." },
      { q: "Сохраняется ли история чата?", a: "Нет. Каждый чат — с чистого листа. Копируйте контекст или используйте файлы .codeassistant/ с правилами. Источник: Habr." },
      { q: "Почему сайт не открывается после деплоя?", a: "Проверьте публикацию (кнопка «Деплой»), DNS для своего домена. Первый деплой — до 10 минут. Логи — в Yandex Cloud." },
    ],
  },
];

export default function VibeCraftKBClient() {
  const [search, setSearch] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (q: string) => {
    const next = new Set(expandedQuestions);
    if (next.has(q)) next.delete(q); else next.add(q);
    setExpandedQuestions(next);
  };

  const searchResults = search.length >= 2
    ? FAQ_CATEGORIES.flatMap(cat =>
        cat.questions.filter(q =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
        ).map(q => ({ ...q, category: cat.category, section: cat.section }))
      )
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      {/* Hero — magazine style */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "100px var(--space-xl) 60px",
        borderBottom: "1px solid var(--color-border-light)",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <span style={{
            fontSize: "var(--text-s)", fontWeight: 700, color: "var(--color-accent)",
            textTransform: "uppercase", letterSpacing: "0.08em",
            borderBottom: "2px solid var(--color-accent)", paddingBottom: 4,
          }}>
            База знаний
          </span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontWeight: 600 }}>
            Источники: Хабр, SourceCraft Docs, Telegram-чаты
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900,
          fontFamily: "var(--font-heading)", letterSpacing: "-0.03em",
          lineHeight: 1.05, marginBottom: 16, maxWidth: 800,
        }}>
          VibeCraft & SourceCraft
        </h1>
        <p style={{
          fontSize: "var(--text-l)", color: "var(--color-text-secondary)",
          lineHeight: 1.6, maxWidth: 560, fontWeight: 400,
        }}>
          Всё, что нужно знать о платформе от Яндекса. 30+ ответов на реальные вопросы разработчиков.
        </p>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 480, marginTop: 32 }}>
          <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Найти ответ..."
            style={{
              width: "100%", padding: "14px 14px 14px 44px", fontSize: "var(--text-s)", borderRadius: 0,
              border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", outline: "none",
              boxSizing: "border-box", color: "var(--color-text-primary)",
              transition: "border-color 0.15s",
            }}
          />
        </div>
      </div>

      {/* Search results */}
      {search.length >= 2 && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Найдено {searchResults.length} ответов
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {searchResults.map((item, i) => (
              <div key={i} style={{ paddingBottom: 16, borderBottom: "1px solid var(--color-border-light)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-tertiary)", minWidth: 24, marginTop: 2 }}>
                    {item.section}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-text-primary)" }}>
                      {highlightMatch(item.q, search)}
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                      {highlightMatch(item.a, search)}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 6 }}>
                      {item.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories — journal grid */}
      {!search && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px var(--space-xl)" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 0,
          }}>
            {FAQ_CATEGORIES.map((cat, catIndex) => (
              <div key={cat.section} style={{
                padding: "var(--space-xl)",
                borderBottom: "1px solid var(--color-border-light)",
                borderRight: catIndex % 2 === 0 ? "1px solid var(--color-border-light)" : "none",
                borderLeft: catIndex > 1 ? "none" : "none",
              }}>
                {/* Category header */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
                  }}>
                    <span style={{
                      fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-mono)", letterSpacing: "0.05em",
                    }}>
                      {cat.section}
                    </span>
                    <cat.icon size={16} style={{ color: cat.color }} />
                  </div>
                  <h3 style={{
                    fontSize: "var(--text-xl)", fontWeight: 800,
                    fontFamily: "var(--font-heading)", letterSpacing: "-0.01em",
                    margin: 0, color: "var(--color-text-primary)",
                  }}>
                    {cat.category}
                  </h3>
                </div>

                {/* Questions */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {cat.questions.map((qa, i) => {
                    const isOpen = expandedQuestions.has(qa.q);
                    return (
                      <div key={i} style={{
                        borderBottom: i < cat.questions.length - 1 ? "1px solid var(--color-border-light)" : "none",
                      }}>
                        <div
                          onClick={() => toggleQuestion(qa.q)}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                            gap: 12, padding: "14px 0", cursor: "pointer",
                          }}
                        >
                          <span style={{
                            fontWeight: 600, fontSize: "var(--text-s)", color: "var(--color-text-primary)",
                            lineHeight: 1.5, flex: 1,
                          }}>
                            {qa.q}
                          </span>
                          <ChevronDown size={14} style={{
                            color: "var(--color-text-tertiary)", marginTop: 4, flexShrink: 0,
                            transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "",
                          }} />
                        </div>
                        {isOpen && (
                          <div style={{
                            padding: "0 0 16px", fontSize: "var(--text-xs)",
                            color: "var(--color-text-secondary)", lineHeight: 1.8,
                          }}>
                            {qa.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question form — minimal */}
      {!search && (
        <div style={{
          maxWidth: 500, margin: "0 auto", padding: "0 var(--space-xl) 80px",
          textAlign: "center",
        }}>
          <div style={{
            paddingTop: 32, borderTop: "2px solid var(--color-border)",
          }}>
            <div style={{
              fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-tertiary)",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12,
            }}>
              Не нашли ответ?
            </div>
            <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: 20 }}>
              Напишите вопрос — мы добавим его в базу знаний
            </p>
            <a
              href="https://t.me/bilarius"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 28px", borderRadius: 0,
                background: "var(--color-accent)", color: "white",
                textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)",
              }}
            >
              <Send size={14} /> Задать вопрос в Telegram
            </a>
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 12 }}>
              @bilarius
            </div>
          </div>
        </div>
      )}

      {/* Footer links */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "var(--space-xl)", borderTop: "1px solid var(--color-border-light)",
        display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center",
        fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)",
      }}>
        <a href="https://vibe.sourcecraft.dev" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <ExternalLink size={12} /> vibe.sourcecraft.dev
        </a>
        <a href="https://sourcecraft.dev" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <ExternalLink size={12} /> sourcecraft.dev
        </a>
        <a href="https://t.me/sourcecraft_ru" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <ExternalLink size={12} /> @sourcecraft_ru
        </a>
        <Link href="/ai-tools" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <ExternalLink size={12} /> AI-инструменты
        </Link>
      </div>
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
