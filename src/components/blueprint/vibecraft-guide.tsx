"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, Zap, Rocket, HelpCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: "Нужно ли уметь программировать?",
    a: "Нет. Vibecraft — это no-code платформа. Вы описываете идею на русском языке, а ИИ генерирует код. Но понимание основ веб-разработки поможет ставить более точные задачи.",
  },
  {
    q: "Что можно создать?",
    a: "Лендинги, корпоративные сайты, CRM, трекеры задач, интернет-магазины, мини-игры, квизы, опросы, аналитические панели. ИИ генерирует уникальный код под задачу, а не подставляет шаблон.",
  },
  {
    q: "Сколько времени занимает создание проекта?",
    a: "От идеи до первого результата — 5–10 минут. Дальше можно дорабатывать через чат с ИИ: «добавь форму обратной связи», «поменяй цвет на синий», «сделай мобильную версию».",
  },
  {
    q: "Где хранится код и данные?",
    a: "Код хранится в репозитории SourceCraft (аналог GitHub от Яндекса). Данные — на серверах Yandex Cloud в России. Вы владеете кодом и можете передать его разработчикам для доработки.",
  },
  {
    q: "Сколько это стоит?",
    a: "При регистрации дают 4000 нейрокредитов бесплатно. Тариф Free — 0 ₽ (ограничен). Pro — 250 ₽/мес. Плюс оплата ресурсов Yandex Cloud при публикации.",
  },
  {
    q: "Чем отличается от Tilda или WordPress?",
    a: "Tilda/WP — конструкторы с готовыми шаблонами. Vibecraft — ИИ генерирует уникальный код под конкретную задачу. Не шаблон, а индивидуальное решение.",
  },
  {
    q: "Можно ли забрать код и уйти с платформы?",
    a: "Да. Проект хранится в SourceCraft-репозитории. Вы можете клонировать его, доработать в любом редакторе кода и задеплоить куда угодно.",
  },
  {
    q: "Какие есть ограничения?",
    a: "Preview-статус (нет гарантий SLA). Привязан к экосистеме Яндекса. Только русский язык интерфейса. Доступ по запросу (не мгновенный). Расходует нейрокредиты.",
  },
];

const steps = [
  {
    title: "Зарегистрируйтесь",
    desc: "Нужен Yandex ID. Зайдите на vibe.sourcecraft.dev и нажмите «Запросить доступ». После одобрения откроется чат с ИИ.",
  },
  {
    title: "Опишите идею",
    desc: "Напишите в чате, что хотите создать. Например: «Лендинг стоматологии с формой записи, сине-белый, 4 блока». ИИ уточнит детали.",
  },
  {
    title: "Примите план",
    desc: "ИИ предложит структуру и архитектуру проекта. Можно согласиться или попросить изменить.",
  },
  {
    title: "Смотрите генерацию",
    desc: "В реальном времени на вкладке «Превью» видно, как строится сайт. Весь процесс занимает 5–10 минут.",
  },
  {
    title: "Дорабатывайте через чат",
    desc: "«Добавь галерею», «Поменяй шрифт», «Сделай тёмную тему». ИИ вносит правки по вашему описанию.",
  },
  {
    title: "Опубликуйте",
    desc: "Нажмите «Деплой» — проект опубликуется в Yandex Cloud. Можно привязать свой домен.",
  },
];

export default function VibecraftGuide() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", marginTop: "var(--space-l)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
        <Zap size={20} style={{ color: "#fc0" }} />
        <span style={{ fontWeight: 800, fontSize: "var(--text-l)", color: "var(--color-text)" }}>Vibecraft — ИИ-конструктор сайтов от Яндекса</span>
      </div>
      <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-l)" }}>
        No-code платформа, которая создаёт сайты и приложения по текстовому описанию на русском языке. 
        Вы пишете идею — ИИ генерирует фронтенд, бэкенд и базу данных.
        Не нужен VPN, не нужна зарубежная карта. Полностью российский продукт.
      </p>

      {/* Как начать */}
      <div style={{ marginBottom: "var(--space-l)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
          <Rocket size={16} style={{ color: "var(--color-accent)" }} />
          <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>Как начать за 6 шагов</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "var(--space-s) var(--space-m)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)", alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Сравнение */}
      <div style={{ marginBottom: "var(--space-l)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
          <CheckCircle size={16} style={{ color: "var(--color-accent)" }} />
          <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>Чем отличается от других инструментов</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                {["", "Vibecraft", "Tilda / WP", "Cursor / Reasonix", "Bolt / Lovable"].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "8px 12px", color: "var(--color-text-tertiary)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Кому подходит", "Новичкам, без кода", "Новичкам", "Разработчикам", "Новичкам (на англ.)"],
                ["Русский язык", "✅ Нативный", "✅", "❌ English only", "❌ English only"],
                ["Уникальный код", "✅ ИИ-генерация", "❌ Шаблоны", "✅ Ручное программирование", "✅ ИИ-генерация"],
                ["Хостинг в РФ", "✅ Yandex Cloud", "Зависит", "❌", "❌"],
                ["Владение кодом", "✅ Ваш репозиторий", "❌ На платформе", "✅", "Зависит"],
                ["VPN / карта", "Не нужны", "Не нужны", "Нужны", "Нужны"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "8px 12px", color: j === 0 ? "var(--color-text-secondary)" : "var(--color-text)", fontWeight: j === 0 ? 600 : 400 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: "var(--space-l)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
          <HelpCircle size={16} style={{ color: "var(--color-accent)" }} />
          <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>Частые вопросы</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "var(--color-bg-primary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)" }}>
              <div
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "var(--space-s) var(--space-m)", cursor: "pointer",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "var(--text-s)" }}>{faq.q}</span>
                <ChevronDown
                  size={14}
                  style={{
                    color: "var(--color-text-tertiary)",
                    transition: "0.2s",
                    transform: expandedFaq === i ? "rotate(180deg)" : "",
                    flexShrink: 0,
                  }}
                />
              </div>
              {expandedFaq === i && (
                <div style={{ padding: "0 var(--space-m) var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Важно знать */}
      <div style={{ padding: "var(--space-m)", background: "#fffbeb", borderRadius: "var(--radius-s)", border: "1px solid #f59e0b", marginBottom: "var(--space-m)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <AlertTriangle size={14} style={{ color: "#f59e0b" }} />
          <span style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "#92400e" }}>Важно знать</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: "var(--text-xs)", color: "#92400e", lineHeight: 1.7 }}>
          <li>Доступ по запросу — после регистрации может пройти несколько дней</li>
          <li>Preview-статус — возможны изменения интерфейса и лимитов</li>
          <li>Расходует нейрокредиты — планируйте задачи заранее</li>
          <li>Привязан к Yandex Cloud — для публикации нужен аккаунт</li>
        </ul>
      </div>

      {/* Ссылки */}
      <div style={{ padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-s)" }}>
          <ExternalLink size={14} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>Полезные ссылки</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "var(--text-xs)" }}>
          <a href="https://vibe.sourcecraft.dev" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
            🌐 vibe.sourcecraft.dev — основная платформа
          </a>
          <a href="https://sourcecraft.dev/portal/docs/ru/vibecraft" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
            📖 Документация Vibecraft
          </a>
          <a href="https://habr.com/ru/news/1039470" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
            📰 Статья на Хабре — анонс от Yandex B2B Tech
          </a>
          <a href="https://t.me/sourcecraft_ru" target="_blank" rel="noopener" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
            💬 Telegram-сообщество @sourcecraft_ru
          </a>
        </div>
      </div>
    </div>
  );
}
