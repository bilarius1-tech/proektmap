import Link from "next/link";
import { ArrowLeft, Palette, Layers, Grid3X3, FileText, Zap, Box, BookOpen, Code, Figma, Globe } from "lucide-react";

export const metadata = {
  title: "Дизайн-система — полный гайд для AI-инженера",
  description: "Что такое дизайн-система, зачем нужна, из чего состоит и как внедрить в проект. Полный гайд с инструментами, примерами кода и AI-подходом.",
};

export default function DesignSystemPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-secondary)", minHeight: "100dvh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", color: "white", padding: "var(--space-xxl) var(--space-m)", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link href="/sandbox" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
            <ArrowLeft size={14} /> Песочница
          </Link>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: "var(--space-m)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Дизайн-система
          </h1>
          <p style={{ fontSize: "var(--text-l)", opacity: 0.8, maxWidth: 600, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Почему большие проекты без неё разваливаются, как построить свою, и почему AI-инженер должен знать это лучше дизайнера.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", fontSize: "var(--text-xs)", opacity: 0.7 }}>
            <span>⏱️ 25 минут чтения</span>
            <span>📐 10+ инструментов</span>
            <span>💻 Примеры кода</span>
            <span>🤖 AI-подход</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* Содержание */}
        <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-l)", borderRadius: 0, marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📑 Содержание</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "var(--text-s)" }}>
            {["Что такое дизайн-система и зачем она нужна", "Из чего состоит: 5 слоёв", "Дизайн-токены — фундамент всего", "Компоненты: от кнопки до страницы", "Паттерны и правила использования", "Документация: Storybook, Zeroheight", "Инструменты: Figma, Token Studio, Style Dictionary", "AI и дизайн-системы: как автоматизировать", "Пошаговый план внедрения", "Примеры: Material, Ant, shadcn/ui"].map((item, i) => (
              <a key={i} href={`#section-${i}`} style={{ color: "var(--color-accent)", textDecoration: "none" }}>
                {i + 1}. {item}
              </a>
            ))}
          </div>
        </div>

        {/* Section 1 */}
        <Section id="section-0" icon={<Box size={20} />} title="Что такое дизайн-система и зачем она нужна">
          <P>
            <strong>Дизайн-система — это единый язык, на котором говорят дизайнеры, разработчики и AI-агенты.</strong> Это не просто UI Kit. Это набор правил, компонентов, токенов и документации, который позволяет создавать интерфейсы быстро, согласованно и без хаоса.
          </P>

          <H3>Проблема без дизайн-системы</H3>
          <P>
            Представьте: в проекте 50 страниц, 3 разработчика и AI-агент. Дизайнер нарисовал кнопку с `border-radius: 8px`. Разработчик 1 сделал `border-radius: 6px`. Разработчик 2 — `10px`. AI-агент сгенерировал `12px`. Через месяц у вас 5 разных кнопок, 3 оттенка акцентного цвета и ад в CSS. Это реальная проблема большинства проектов.
          </P>

          <div style={{ background: "var(--color-error-light)", border: "1px solid var(--color-error)", padding: "var(--space-m)", borderRadius: 0, margin: "var(--space-m) 0" }}>
            <strong style={{ color: "var(--color-error)" }}>🚫 Без дизайн-системы:</strong>
            <ul style={{ margin: "4px 0 0", paddingLeft: 20, fontSize: "var(--text-xs)" }}>
              <li>Каждый разработчик изобретает свои отступы и цвета</li>
              <li>AI генерирует несогласованные компоненты</li>
              <li>Дизайнер не может проверить реализацию</li>
              <li>Любое изменение дизайна = переписывание всего CSS</li>
            </ul>
          </div>

          <div style={{ background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", padding: "var(--space-m)", borderRadius: 0, margin: "var(--space-m) 0" }}>
            <strong style={{ color: "var(--color-accent)" }}>✅ С дизайн-системой:</strong>
            <ul style={{ margin: "4px 0 0", paddingLeft: 20, fontSize: "var(--text-xs)" }}>
              <li>Единый источник правды — токены в коде</li>
              <li>AI получает контекст: «используй радиус M, цвет accent»</li>
              <li>Изменение одного токена меняет весь интерфейс</li>
              <li>Дизайнер и разработчик говорят на одном языке</li>
            </ul>
          </div>
        </Section>

        {/* Section 2 */}
        <Section id="section-1" icon={<Layers size={20} />} title="Из чего состоит: 5 слоёв">
          <P>Дизайн-система — это не просто «набор компонентов». Это пирамида из 5 слоёв. Каждый слой зависит от предыдущего.</P>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, margin: "var(--space-l) 0" }}>
            {[
              { layer: "5. Страницы и шаблоны", desc: "Типовые экраны: дашборд, форма, список. Собраны из организмов.", color: "#0fb880" },
              { layer: "4. Организмы", desc: "Секции: хедер, футер, карточка товара. Собраны из молекул.", color: "#3b82f6" },
              { layer: "3. Молекулы", desc: "Составные элементы: поиск (input + кнопка), карточка (изображение + текст).", color: "#8b5cf6" },
              { layer: "2. Атомы", desc: "Базовые элементы: кнопка, input, иконка, текст, цвет. Неделимые.", color: "#f59e0b" },
              { layer: "1. Токены", desc: "Переменные: цвета, шрифты, отступы, радиусы, тени. Фундамент всего.", color: "#ef4444" },
            ].map(item => (
              <div key={item.layer} style={{
                padding: "var(--space-m)", borderLeft: `4px solid ${item.color}`,
                background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)",
              }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: item.color, marginBottom: 2 }}>{item.layer}</div>
                <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <H3>Atomic Design — методология</H3>
          <P>
            Эту модель придумал Брэд Фрост в 2013 году. Она называется <strong>Atomic Design</strong>. Идея проста: интерфейс строится из атомов (кнопки, поля), которые собираются в молекулы (форма поиска), те — в организмы (хедер сайта), а из организмов — страницы.
          </P>
          <P>
            <strong>Для AI-инженера это критически важно:</strong> когда вы даёте промпт AI-агенту, вы можете сказать «собери страницу из компонентов Button, Input и Card», и агент поймёт что делать. Без системы — агент сгенерирует хаос.
          </P>
        </Section>

        {/* Section 3 — Tokens */}
        <Section id="section-2" icon={<Palette size={20} />} title="Дизайн-токены — фундамент всего">
          <P>
            <strong>Токены — это переменные.</strong> Вместо того чтобы писать <code style={{ background: "var(--color-bg-tertiary)", padding: "1px 5px", borderRadius: 3, fontSize: "var(--text-xs)" }}>color: #0fb880</code> в 50 местах, вы пишете <code style={{ background: "var(--color-bg-tertiary)", padding: "1px 5px", borderRadius: 3, fontSize: "var(--text-xs)" }}>color: var(--color-accent)</code>. Когда дизайнер решит сменить акцентный цвет, вы меняете ОДНУ переменную.
          </P>

          <H3>Категории токенов</H3>
          <CodeBlock>{`/* ═══════════════════════════
   Design Tokens — пример
   ═══════════════════════════ */
:root {
  /* 🎨 Цвета */
  --color-accent: #0fb880;
  --color-accent-hover: #0ca36e;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f3;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #5c5c50;
  --color-border: #d4d4cc;

  /* 📏 Отступы */
  --space-xs: 4px;
  --space-s: 8px;
  --space-m: 16px;
  --space-l: 24px;
  --space-xl: 40px;

  /* 🔤 Типографика */
  --font-heading: "Onest", sans-serif;
  --font-body: "Inter", sans-serif;
  --text-xs: 12px;
  --text-s: 14px;
  --text-m: 16px;
  --text-l: 20px;
  --text-xl: 28px;

  /* ⭕ Радиусы */
  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 12px;
  --radius-full: 9999px;

  /* 🌑 Тени */
  --shadow-s: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-m: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-l: 0 4px 16px rgba(0,0,0,0.12);
}

/* 🌙 Тёмная тема — просто переопределяем токены */
[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #242424;
  --color-text-primary: #f5f5f3;
  --color-text-secondary: #b0b0a4;
  --color-border: #3e3e38;
}`}</CodeBlock>

          <H3>Токены в Tailwind CSS 4</H3>
          <P>В Tailwind 4 можно связать CSS-переменные с утилитарными классами через <code>@theme</code>:</P>
          <CodeBlock>{`/* tailwind.css */
@import "tailwindcss";

@theme {
  --color-accent: var(--color-accent);
  --spacing-s: var(--space-s);
  --spacing-m: var(--space-m);
  --text-xs: var(--text-xs);
  --radius-m: var(--radius-m);
}

/* Теперь можно писать: */
/* <button className="bg-accent text-white px-m py-s rounded-m"> */`}</CodeBlock>
        </Section>

        {/* Section 4 — Components */}
        <Section id="section-3" icon={<Grid3X3 size={20} />} title="Компоненты: от кнопки до страницы">
          <P>
            Компонент — это переиспользуемый блок интерфейса. Хороший компонент: изолирован, настраивается через props, задокументирован.
          </P>

          <H3>Пример: компонент Button</H3>
          <CodeBlock>{`// Button.tsx — атом дизайн-системы
import { forwardRef } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles = {
  primary: { background: "var(--color-accent)", color: "white" },
  secondary: { background: "var(--color-bg-tertiary)", color: "var(--color-text-primary)" },
  ghost: { background: "transparent", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" },
};

const sizeStyles = {
  sm: { padding: "4px 10px", fontSize: "var(--text-xs)" },
  md: { padding: "8px 16px", fontSize: "var(--text-s)" },
  lg: { padding: "12px 24px", fontSize: "var(--text-m)" },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", children }, ref) => (
    <button ref={ref} style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-xs)",
      border: "none", borderRadius: "var(--radius-m)",
      fontWeight: 600, cursor: "pointer",
      transition: "opacity 0.15s",
      ...variantStyles[variant],
      ...sizeStyles[size],
    }}>
      {children}
    </button>
  )
);

// Использование:
<Button variant="primary" size="lg">Купить</Button>
<Button variant="ghost" size="sm">Отмена</Button>`}</CodeBlock>

          <H3>Компонент Card с вариантами</H3>
          <CodeBlock>{`// Card.tsx — молекула дизайн-системы
interface CardProps {
  padding?: "s" | "m" | "l";
  elevated?: boolean;
  accent?: boolean;
  children: React.ReactNode;
}

export function Card({ padding = "m", elevated, accent, children }: CardProps) {
  const pads = { s: "var(--space-s)", m: "var(--space-m)", l: "var(--space-l)" };
  return (
    <div style={{
      padding: pads[padding],
      background: "var(--color-surface)",
      border: accent ? "1px solid var(--color-accent)" : "1px solid var(--color-border-light)",
      borderRadius: "var(--radius-l)",
      boxShadow: elevated ? "var(--shadow-m)" : "none",
      ...(accent && { borderTop: "3px solid var(--color-accent)" }),
    }}>
      {children}
    </div>
  );
}`}</CodeBlock>
        </Section>

        {/* Section 5 — Patterns */}
        <Section id="section-4" icon={<FileText size={20} />} title="Паттерны и правила использования">
          <P>Компонентов мало. Нужны правила: когда какой компонент использовать, как их комбинировать, чего избегать.</P>

          <H3>Паттерн: Форма с валидацией</H3>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-m)", margin: "var(--space-s) 0", fontSize: "var(--text-xs)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-s)" }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>✅ Правильно</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  <li>Поля сгруппированы логически</li>
                  <li>Лейблы над полями</li>
                  <li>Ошибка под проблемным полем</li>
                  <li>Кнопка primary + кнопка ghost для отмены</li>
                </ul>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--color-error)" }}>❌ Неправильно</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  <li>Все поля в один столбец без группировки</li>
                  <li>Лейблы как placeholder (исчезают)</li>
                  <li>Ошибка alert'ом вверху страницы</li>
                  <li>Две primary кнопки рядом</li>
                </ul>
              </div>
            </div>
          </div>

          <H3>Чек-лист качества компонента</H3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "var(--text-xs)" }}>
            {[
              "Компонент работает изолированно (можно использовать без контекста)",
              "Все варианты задокументированы (primary, secondary, disabled, loading)",
              "Состояния обработаны (hover, focus, active, disabled, error)",
              "Доступность (aria-атрибуты, keyboard navigation, contrast)",
              "Адаптивность (компонент корректно выглядит на мобильных)",
              "Нет хардкода цветов/размеров — только токены",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <input type="checkbox" defaultChecked={i < 4} readOnly style={{ marginTop: 2 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 6 — Documentation */}
        <Section id="section-5" icon={<BookOpen size={20} />} title="Документация: Storybook, Zeroheight">
          <P>Дизайн-система без документации — как карта без легенды. Инструменты:</P>

          <H3>Storybook</H3>
          <P>
            <strong>Стандарт индустрии</strong> для изолированной разработки компонентов. Каждый компонент имеет свою «историю» (story) — пример использования с разными props. Позволяет тестировать компоненты визуально, проверять accessibility, делать скриншот-тесты.
          </P>
          <CodeBlock>{`// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: { variant: "primary", children: "Кнопка" },
};

export const AllVariants = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};`}</CodeBlock>

          <H3>Другие инструменты документации</H3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", fontSize: "var(--text-xs)" }}>
            {[
              { name: "Zeroheight", desc: "Платформа для дизайн-документации. Связывает Figma с кодом. Используют Uber, Adobe." },
              { name: "Backlight", desc: "All-in-one платформа: код, документация, дизайн в одном месте." },
              { name: "Docz", desc: "Документация на MDX. Простой, на React. Хорош для небольших систем." },
              { name: "Notion + Figma", desc: "Быстрый старт: описание в Notion, макеты в Figma, код в GitHub." },
            ].map(tool => (
              <div key={tool.name} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--color-accent)" }}>{tool.name}</div>
                <div style={{ color: "var(--color-text-secondary)" }}>{tool.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 7 — Tools */}
        <Section id="section-6" icon={<Figma size={20} />} title="Инструменты: Figma, Token Studio, Style Dictionary">
          <H3>Figma</H3>
          <P>Основной инструмент дизайнеров. Но AI-инженеру тоже полезно знать:</P>
          <ul style={{ fontSize: "var(--text-s)", lineHeight: 1.8 }}>
            <li><strong>Dev Mode</strong> — показывает CSS-код, отступы, токены прямо из макета</li>
            <li><strong>Variables</strong> — аналог CSS-переменных в Figma (цвета, числа, строки)</li>
            <li><strong>Components + Variants</strong> — компоненты с вариантами (как props в React)</li>
            <li><strong>Auto Layout</strong> — аналог Flexbox в Figma</li>
            <li><strong>Plugins:</strong> Tokens Studio, Figma to Code, Design Lint</li>
          </ul>

          <H3>Tokens Studio (Figma Plugin)</H3>
          <P>
            Самый важный плагин для синхронизации токенов между Figma и кодом. Позволяет экспортировать токены в JSON, который можно преобразовать в CSS-переменные через Style Dictionary.
          </P>
          <CodeBlock>{`// tokens.json — экспорт из Tokens Studio
{
  "color": {
    "accent": { "value": "#0fb880", "type": "color" },
    "bg": {
      "primary": { "value": "#ffffff", "type": "color" },
      "secondary": { "value": "#f5f5f3", "type": "color" }
    }
  },
  "spacing": {
    "s": { "value": "8px", "type": "spacing" },
    "m": { "value": "16px", "type": "spacing" }
  }
}`}</CodeBlock>

          <H3>Style Dictionary</H3>
          <P>
            Инструмент от Amazon, который преобразует токены из одного формата в другой: JSON → CSS, SCSS, JavaScript, iOS, Android. Ключевое звено между дизайном и кодом.
          </P>
          <CodeBlock>{`// config.json — Style Dictionary
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "src/styles/",
      "files": [{ "destination": "tokens.css", "format": "css/variables" }]
    },
    "ts": {
      "transformGroup": "js",
      "buildPath": "src/lib/",
      "files": [{ "destination": "tokens.ts", "format": "javascript/es6" }]
    }
  }
}

// Запуск: npx style-dictionary build
// На выходе:
// src/styles/tokens.css — CSS-переменные
// src/lib/tokens.ts — TypeScript-константы`}</CodeBlock>
        </Section>

        {/* Section 8 — AI */}
        <Section id="section-7" icon={<Zap size={20} />} title="AI и дизайн-системы: как автоматизировать">
          <P>
            <strong>Это главная причина, почему AI-инженеру нужна дизайн-система.</strong> AI-агенты (Cursor, Claude, Reasonix) генерируют код на основе промптов. Если у агента нет контекста о вашей дизайн-системе — он сгенерирует случайные стили.
          </P>

          <H3>Промпт для AI с дизайн-системой</H3>
          <CodeBlock>{`Ты — frontend-разработчик. Твоя задача — создать страницу настроек
профиля. Используй дизайн-систему проекта:

ТОКЕНЫ (всегда используй эти переменные, не хардкодь цвета):
- Цвета: var(--color-accent), var(--color-bg-primary),
  var(--color-text-secondary), var(--color-border)
- Отступы: var(--space-s), var(--space-m), var(--space-l)
- Радиусы: var(--radius-m), var(--radius-l)
- Текст: var(--text-xs), var(--text-s), var(--text-m)

КОМПОНЕНТЫ (используй готовые, не создавай новые):
- Button: <Button variant="primary|secondary|ghost" size="sm|md|lg">
- Card: <Card padding="m" elevated>...</Card>
- Input: <Input label="Название" error="Ошибка" />

ПРАВИЛА:
- Формы: группируй поля в Card, лейблы над полями
- Кнопки: одна primary (главное действие) + ghost (отмена)
- Не используй inline-стили без крайней необходимости`}</CodeBlock>

          <H3>AI-агенты, которые работают с дизайн-системами</H3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", fontSize: "var(--text-xs)" }}>
            {[
              { name: "Cursor", desc: "Читает ваш проект. Если в AGENTS.md описана дизайн-система — использует её токены и компоненты." },
              { name: "v0.dev", desc: "Генерирует UI по описанию. Можно указать: «используй shadcn/ui + Tailwind»." },
              { name: "Claude Code", desc: "Работает как агент в терминале. Может прочитать tokens.css и использовать переменные." },
              { name: "Bolt.new", desc: "Генерирует full-stack приложения. Понимает Tailwind-классы и CSS-переменные." },
            ].map(tool => (
              <div key={tool.name} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{tool.name}</div>
                <div style={{ color: "var(--color-text-secondary)" }}>{tool.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 9 — Implementation */}
        <Section id="section-8" icon={<Code size={20} />} title="Пошаговый план внедрения">
          <P>Как внедрить дизайн-систему в существующий или новый проект:</P>

          {[
            { step: "1", title: "Аудит", desc: "Соберите все используемые цвета, отступы, шрифты в проекте. Вы удивитесь сколько дубликатов: 5 оттенков серого, 3 синих, 8 размеров шрифта." },
            { step: "2", title: "Токены", desc: "Создайте CSS-переменные для всего что нашли. Объедините похожие значения. Должно остаться: 5-7 цветов, 4-5 отступов, 3-4 размера шрифта." },
            { step: "3", title: "Базовые компоненты", desc: "Выделите самые используемые элементы: Button, Input, Card, Badge. Создайте компоненты с вариантами (variant, size)." },
            { step: "4", title: "Документация", desc: "Поднимите Storybook. Добавьте stories для каждого компонента. Покажите все варианты и состояния." },
            { step: "5", title: "AI-контекст", desc: "Опишите дизайн-систему в AGENTS.md / .cursorrules. Укажите токены, компоненты, правила использования. AI-агенты будут это читать." },
            { step: "6", title: "Миграция", desc: "Постепенно заменяйте хардкод на токены и готовые компоненты. Не всё сразу — по одной странице за раз." },
            { step: "7", title: "Поддержка", desc: "Дизайн-система живёт. Новые компоненты → в систему. Изменения токенов → через Style Dictionary. Документация → обновляется." },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: "var(--space-m)", padding: "var(--space-s) 0", borderBottom: "1px solid var(--color-border-light)" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-xs)", flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </Section>

        {/* Section 10 — Examples */}
        <Section id="section-9" icon={<Globe size={20} />} title="Примеры: Material, Ant, shadcn/ui">
          <H3>Готовые дизайн-системы, которые стоит изучить</H3>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
            {[
              {
                name: "Material Design 3 (Google)",
                url: "https://m3.material.io",
                desc: "Самая известная дизайн-система. Токены, компоненты, гайдлайны. Используется в Android, Flutter, Angular Material. Отличный пример токенов: dynamic color, тональные палитры.",
                tools: "Figma Kit · Material Web Components · Angular Material · Jetpack Compose",
              },
              {
                name: "Ant Design",
                url: "https://ant.design",
                desc: "Китайская дизайн-система для enterprise-приложений. Огромная библиотека компонентов (таблицы, формы, модалки). Популярна в React-экосистеме. Хороший пример документирования.",
                tools: "React · Angular · Vue · Mobile · Charts",
              },
              {
                name: "shadcn/ui",
                url: "https://ui.shadcn.com",
                desc: "Не библиотека, а коллекция копируемых компонентов на Radix + Tailwind. Вы копируете код в свой проект и владеете им. Идеален для стартапов — быстрый старт, полный контроль.",
                tools: "Tailwind CSS · Radix UI · Class Variance Authority · Lucide Icons",
              },
              {
                name: "Radix UI",
                url: "https://www.radix-ui.com",
                desc: "Headless-компоненты (без стилей). Дают логику и accessibility, вы даёте стили. Идеально для своей дизайн-системы. Используется внутри shadcn/ui.",
                tools: "Dialog · Dropdown · Tabs · Tooltip · 30+ примитивов",
              },
            ].map(ds => (
              <div key={ds.name} style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>
                  <a href={ds.url} target="_blank" style={{ color: "var(--color-accent)", textDecoration: "none" }}>{ds.name}</a>
                </div>
                <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-s)" }}>{ds.desc}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", padding: "var(--space-xs)", background: "var(--color-bg-secondary)" }}>🔧 {ds.tools}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div style={{ marginTop: "var(--space-xxl)", textAlign: "center", padding: "var(--space-xl)", background: "var(--color-accent-light)", border: "2px solid var(--color-accent)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)" }}>
            Готов построить свою дизайн-систему?
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-l)", maxWidth: 500, margin: "0 auto var(--space-l)" }}>
            Пройди Blueprint «Корпоративный сайт» — там есть этап «Дизайн-система и токены» с AI-промптами и примерами.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/blueprints/corporate-website" className="btn btn-primary" style={{ textDecoration: "none", padding: "12px 24px", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Пройти Blueprint →
            </Link>
            <Link href="/sandbox" className="btn btn-ghost" style={{ textDecoration: "none", padding: "12px 24px", fontSize: "var(--text-s)", fontWeight: 700 }}>
              ← В песочницу
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper components
function Section({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: "var(--space-xxl)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-l)", color: "var(--color-accent)" }}>
        {icon}
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700, margin: "var(--space-l) 0 var(--space-s)", color: "var(--color-text-primary)" }}>{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "var(--text-s)", lineHeight: 1.8, color: "var(--color-text-secondary)", margin: "0 0 var(--space-m)" }}>{children}</p>;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{
      background: "#1e1e2e", color: "#cdd6f4", padding: "var(--space-l)", overflow: "auto",
      fontSize: 12, lineHeight: 1.6, fontFamily: "var(--font-mono)", border: "1px solid #2a2a3a",
      borderLeft: "3px solid var(--color-accent)", borderRadius: 0, margin: "var(--space-m) 0",
    }}>
      <code>{children}</code>
    </pre>
  );
}
