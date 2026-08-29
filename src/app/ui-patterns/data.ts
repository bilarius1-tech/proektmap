export type PatternCategory =
  | "navigation"
  | "components"
  | "content"
  | "effects"
  | "microinteractions"
  | "ux-patterns"
  | "layouts";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type AIModelTarget = "cursor" | "v0" | "claude" | "chatgpt";

export type StylePreset = "minimal" | "glass" | "dark" | "brutalist" | "neon";

export type PatternKind = "layout" | "pattern" | "component" | "interaction" | "effect" | "recipe";

export interface PatternCategoryMeta {
  id: PatternCategory;
  title: string;
  titleRu: string;
  description: string;
  iconName: string;
  count?: number;
}

export const PATTERN_CATEGORIES: PatternCategoryMeta[] = [
  {
    id: "navigation",
    title: "Navigation & Floating UI",
    titleRu: "Навигация и плавающий UI",
    description: "Фиксированные доки, плавающие кнопки соцсетей, sticky-шапки, mega-меню и хлебные крошки.",
    iconName: "Compass",
  },
  {
    id: "components",
    title: "UI Components",
    titleRu: "Компоненты интерфейса",
    description: "Интерактивные кнопки, аккордеоны, модальные окна, выпадающие списки и карточки.",
    iconName: "Box",
  },
  {
    id: "content",
    title: "Content & Showcase",
    titleRu: "Контент и галереи",
    description: "Сравнения До/После, Masonry-галереи, таймлайны, интерактивные тарифные сетки и отзывы.",
    iconName: "LayoutGrid",
  },
  {
    id: "effects",
    title: "Visual Effects & Shaders",
    titleRu: "Визуальные эффекты",
    description: "Glassmorphism, Grain/Noise, Spotlight-свечение, Mesh-градиенты и Parallax-эффекты.",
    iconName: "Sparkles",
  },
  {
    id: "microinteractions",
    title: "Microinteractions",
    titleRu: "Микровзаимодействия",
    description: "Магнитные кнопки, анимации копирования, hover-эффекты, индикаторы загрузки и успеха.",
    iconName: "Zap",
  },
  {
    id: "ux-patterns",
    title: "UX Patterns & Widgets",
    titleRu: "UX-паттерны и виджеты",
    description: "Cookie-согласия, виджеты обратной связи, Exit-intent всплывающие окна, баннеры уведомлений.",
    iconName: "ShieldCheck",
  },
  {
    id: "layouts",
    title: "Layout & Grids",
    titleRu: "Сетки и раскладки",
    description: "Bento Grids, асимметричные сетки, Split-screen, полноэкранные Hero-секции и sticky-колонки.",
    iconName: "Layers",
  },
];

export interface AnatomyPoint {
  id: number;
  title: string;
  cssRule: string;
  description: string;
  badge: "position" | "layout" | "animation" | "accessibility" | "responsive";
  highlightSelector?: string;
}

export interface WhyReason {
  id: string;
  question: string;
  principle: string;
  badAlternative: string;
  consequence: string;
  impactTag: "performance" | "accessibility" | "ux" | "layout-stability";
}

export interface PatternSkill {
  id: string;
  title: string;
  level: "junior" | "middle" | "senior";
  description: string;
}

export interface PromptVariableOption {
  label: string;
  value: string;
}

export interface PromptVariable {
  id: string;
  label: string;
  defaultValue: string;
  options: PromptVariableOption[];
}

export interface PromptVariant {
  target: AIModelTarget;
  targetLabel: string;
  title: string;
  description: string;
  promptText: string;
  negativePrompt: string;
  recommendedModel: string;
  composerInstruction?: string;
}

export interface CodeSnippet {
  language: "tsx" | "html" | "css";
  title: string;
  code: string;
  framework: "react-tailwind" | "vanilla-css" | "react-inline";
}

export interface UIPattern {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  shortDescription: string;
  category: PatternCategory;
  kind?: PatternKind;
  tags: string[];
  difficulty: DifficultyLevel;
  badge?: string;
  
  stack: {
    html: boolean;
    css: boolean;
    tailwind: boolean;
    react: boolean;
    framerMotion?: boolean;
    lucideIcons?: boolean;
    typescript?: boolean;
  };

  overview: {
    whatIsIt: string;
    whereToUse: string[];
    whyItWorks: string;
    commonMistakes: string[];
  };

  anatomy: {
    summary: string;
    points: AnatomyPoint[];
  };

  why: WhyReason[];

  skills: PatternSkill[];

  promptVariables: PromptVariable[];
  prompts: PromptVariant[];
  codeSnippets: CodeSnippet[];

  responsiveNotes: string;
  accessibilityNotes: string;

  screenshot?: string;
  isPro?: boolean;
  isFeatured?: boolean;

  relatedPatterns?: string[];
  recipes?: string[];
  relatedResheniya?: { title: string; href: string }[];
}

export interface UIRecipe {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  description: string;
  category: "landing" | "saas" | "portfolio" | "ecommerce" | "dashboard";
  patternSlugs: string[];
  designTokens: {
    radius: string;
    background: string;
    border: string;
    blur: string;
    accentColor: string;
    typography: string;
  };
  useCase: string;
  masterPrompt: string;
}

export const UI_PATTERNS: UIPattern[] = [
  {
    id: "floating-social-dock",
    slug: "floating-social-dock",
    title: "Floating Social & Messenger Dock",
    titleRu: "Плавающая панель соцсетей и мессенджеров",
    shortDescription: "Фиксированная вертикальная панель быстрых контактов (Telegram, WhatsApp, Телефон) с эффектом раскрытия лейблов при наведении и аккуратной мобильной адаптацией.",
    category: "navigation",
    kind: "interaction",
    tags: ["floating", "social", "dock", "fixed", "hover-expand", "mobile-sheet", "contacts"],
    difficulty: "beginner",
    badge: "Популярное",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Плавающая группа кнопок быстрой связи, жестко закреплённая относительно окна браузера (viewport). Остаётся на одном месте при вертикальном скролле страницы.",
      whereToUse: [
        "Лендинги услуг и продуктов с высокой конверсией в диалог в мессенджерах (Telegram, WhatsApp)",
        "Интернет-магазины для оперативной связи с менеджером поддержки",
        "Корпоративные порталы и визитки агентств",
        "Личные портфолио AI-инженеров и вайбкодеров",
      ],
      whyItWorks: "Снижает барьер первого касания до 1 клика. Пользователю не нужно искать блок контактов в подвале сайта — кнопка связи всегда в зоне видимости большого пальца или курсора.",
      commonMistakes: [
        "Использование z-index без изоляции кликов, из-за чего прозрачный контейнер панели блокирует клики по ссылкам под ней",
        "Отсутствие aria-label на иконках — скринридеры читают их как безымянные ссылки",
        "Слишком громоздкий вид на мобильных экранах, перекрывающий основной текст",
      ],
    },
    anatomy: {
      summary: "Ключевая идея — изолированный фиксированный контейнер с pointer-events: none, содержащий интерактивные дочерние элементы с pointer-events: auto.",
      points: [
        {
          id: 1,
          title: "Фиксированное позиционирование",
          cssRule: "position: fixed; right: 24px; bottom: 28px; z-index: 50;",
          description: "Гарантирует нахождение над всем контентом страницы без вызова reflow и сдвигов layout при прокрутке.",
          badge: "position",
          highlightSelector: ".dock-container",
        },
        {
          id: 2,
          title: "Изоляция событий мыши (Click-through)",
          cssRule: "pointer-events: none; /* на контейнере */\npointer-events: auto; /* на кнопках */",
          description: "Пространство между кнопками и вокруг панели пропускает клики на контент сайта под ней.",
          badge: "layout",
          highlightSelector: ".dock-wrapper",
        },
        {
          id: 3,
          title: "Плавное раскрытие подписи (Label Reveal)",
          cssRule: "transform: translateX(0); opacity: 1; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);",
          description: "При наведении курсора подпись плавно выдвигается влево от иконки с эффектом упругости.",
          badge: "animation",
          highlightSelector: ".dock-item-label",
        },
        {
          id: 4,
          title: "Доступность и фокус",
          cssRule: "aria-label=\"Написать в Telegram\" role=\"region\" focus-visible:ring-2",
          description: "У кнопок есть явные метки для скринридеров и контрастное кольцо фокуса при навигации с клавиатуры (Tab).",
          badge: "accessibility",
          highlightSelector: ".dock-item-button",
        },
        {
          id: 5,
          title: "Мобильная адаптация (< 640px)",
          cssRule: "@media (max-width: 640px) { bottom: 16px; right: 16px; gap: 8px; }",
          description: "Уменьшение отступов и компактный размер кнопок 44x44px (минимальный touch-target по стандарту Apple HIG).",
          badge: "responsive",
          highlightSelector: ".dock-responsive",
        },
      ],
    },
    why: [
      {
        id: "why-pointer-events",
        question: "Почему на общем контейнере обязателен pointer-events: none?",
        principle: "Изоляция прозрачных областей вокруг кнопок.",
        badAlternative: "Оставить стандартный pointer-events: auto на всём flex-контейнере.",
        consequence: "Пользователь не сможет нажать на ссылки, текст или кнопки сайта, которые визуально находятся рядом с панелью, но попадают под её невидимый прямоугольный bounding box.",
        impactTag: "ux",
      },
      {
        id: "why-transform-not-margin",
        question: "Почему при hover анимируется transform: translateX, а не right или margin?",
        principle: "Аппаратное ускорение (GPU Composite Layer).",
        badAlternative: "Анимировать свойство right: 0 -> 60px или margin-left.",
        consequence: "Изменение right/margin вызывает пересчёт геометрии всего документа (Layout Reflow & Repaint), что приводит к просадкам FPS и дёрганью на слабых устройствах. Transform выполняется на уровне видеокарты с 60+ FPS.",
        impactTag: "performance",
      },
      {
        id: "why-touch-targets",
        question: "Почему минимальный размер мобильной кнопки равен 44x44px?",
        principle: "Эргономический стандарт Apple HIG / Google Material для пальцевого ввода.",
        badAlternative: "Сделать кнопки 28x28px для «минимализма».",
        consequence: "В 40% случаев пользователи смартфонов будут промахиваться мимо кнопки или случайно нажимать соседние ссылки.",
        impactTag: "accessibility",
      },
    ],
    skills: [
      {
        id: "positioning-fixed",
        title: "Fixed Positioning & Viewport Coordinates",
        level: "junior",
        description: "Управление z-index контекстами, отступами safe-area-inset и изоляцией скролла.",
      },
      {
        id: "gpu-transitions",
        title: "60fps Hardware Accelerated Motion",
        level: "middle",
        description: "Использование transform и opacity вместо тяжелых layout-свойств.",
      },
      {
        id: "a11y-aria-actions",
        title: "Accessible Icon-only Buttons",
        level: "middle",
        description: "Оснащение графических кнопок доступными семантическими aria-лейблами.",
      },
    ],
    promptVariables: [
      {
        id: "stylePreset",
        label: "Стиль оформления",
        defaultValue: "glass",
        options: [
          { label: "Glassmorphism (матовое стекло + размытие)", value: "glass" },
          { label: "Dark Cyber (тёмный минимализм + акцент)", value: "dark" },
          { label: "Clean Minimal (белый с тонким бордером)", value: "minimal" },
          { label: "Neo-Brutalism (чёрные тени + 2px рамка)", value: "brutalist" },
        ],
      },
      {
        id: "positionPreset",
        label: "Расположение",
        defaultValue: "bottom-right",
        options: [
          { label: "Справа внизу (bottom: 24px, right: 24px)", value: "bottom-right" },
          { label: "Слева внизу (bottom: 24px, left: 24px)", value: "bottom-left" },
          { label: "Центр снизу (плавающий остров)", value: "bottom-center" },
        ],
      },
      {
        id: "channels",
        label: "Набор каналов",
        defaultValue: "tg-wa-phone",
        options: [
          { label: "Telegram + WhatsApp + Телефон", value: "tg-wa-phone" },
          { label: "Telegram + VK + Max/AI Чат", value: "tg-vk-chat" },
          { label: "Только Telegram + Заказать звонок", value: "tg-callback" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer / Agent",
        title: "Промпт для Cursor (Next.js + Tailwind + Lucide)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Оптимизирован для генерации полноценного React/TypeScript компонента под кодовую базу Next.js App Router.",
        composerInstruction: "Создай файл src/components/ui/floating-social-dock.tsx и добавь его в корень layout.",
        promptText: `Создай переиспользуемый React-компонент FloatingSocialDock для Next.js (TypeScript, Tailwind CSS, иконки lucide-react).

Требования к архитектуре и стилю:
1. Позиционирование: fixed в правом нижнем углу (bottom-6 right-6, z-50). Контейнер должен иметь pointer-events-none, а сами кнопки — pointer-events-auto.
2. Стиль оформления: {stylePreset} (полупрозрачный фон с backdrop-blur-md, мягкая тень shadow-lg, тонкая граница border border-white/10).
3. Каналы связи:
   - Telegram (иконка Send / MessageCircle, ссылка https://t.me/your_username)
   - WhatsApp (иконка PhoneCall / MessageSquare, ссылка https://wa.me/your_phone)
   - Телефон / Заказ звонка (иконка Phone)
4. Микровзаимодействие:
   - В спокойном состоянии: аккуратные круглые кнопки 48x48px.
   - При hover: кнопка слегка приподнимается (translate-y-[-2px]), и влево плавно выдвигается текстовая плашка с названием (например, "Написать в Telegram") с transition-all duration-300 ease-out.
5. Адаптивность (< 640px):
   - Размер кнопок 44x44px (под touch target).
   - На мобильных текст не выезжает влево, чтобы не перекрывать экран, либо панель сворачивается в одну кнопку с плюсиком/чатом, раскрывающуюся по тапу.
6. Доступность:
   - Каждая кнопка обязана иметь понятный aria-label.
   - Внешние ссылки с target="_blank" rel="noopener noreferrer".
   - Видимый focus-visible:ring-2 при навигации клавиатурой.`,
        negativePrompt: `Запрещено:
- НЕ анимируй свойства left/right/margin/width/height (только transform и opacity).
- НЕ оставляй pointer-events-auto на внешнем оберточном контейнере во весь экран.
- НЕ делай кнопки меньше 44x44px на мобильных экранах.
- НЕ используй ссылки без aria-label на иконках.`,
      },
      {
        target: "v0",
        targetLabel: "v0 / Lovable",
        title: "Промпт для visual AI-генераторов (v0.dev / Lovable)",
        recommendedModel: "v0 / Lovable Engine",
        description: "Фокусируется на мгновенном визуальном wow-эффекте, Tailwind-классах и готовых анимациях.",
        promptText: `A floating vertical social contact dock for modern landing pages. Fixed at bottom-right corner.
Design style: {stylePreset} with glassmorphism backdrop blur, rounded-full pill buttons, subtle borders.
Includes 3 action items: Telegram, WhatsApp, and Direct Phone Call.
Each button is an icon circle. On hover, smoothly expands a pill-shaped text label to the left with spring animation.
Mobile responsive: neatly positioned bottom right with 44px touch targets.
Use Tailwind CSS and Lucide React icons. Add accessible labels and clean hover lift effects.`,
        negativePrompt: `Do NOT use absolute positioning that scrolls away. Do NOT block clicks behind transparent wrapper areas.`,
      },
      {
        target: "claude",
        targetLabel: "Claude Code / Artifacts",
        title: "Промпт для Claude (Standalone HTML/CSS/JS или React)",
        recommendedModel: "Claude 3.7 Sonnet",
        description: "Создаёт самодостаточный код без внешних зависимостей, готовый для вставки в любой проект.",
        promptText: `Напиши готовый к использованию код плавающей панели соцсетей (Floating Social Dock) на чистом HTML, CSS и ванильном JavaScript.
Панель закреплена в правом нижнем углу экрана (fixed, right: 24px, bottom: 24px, z-index: 9999).
Стиль: современный тёмный глассморфизм (backdrop-filter: blur(12px), background: rgba(18, 18, 24, 0.8), border: 1px solid rgba(255, 255, 255, 0.1)).
Кнопки: Telegram, WhatsApp, Звонок.
При наведении курсора кнопка плавно раскрывает текстовую подсказку влево.
Сделай корректный сброс для мобильных устройств (touch devices) и чистый, семантичный код.`,
        negativePrompt: `Не используй сторонние библиотеки кроме SVG и чистого CSS. Не заставляй пользователя скроллить до футера.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React + Tailwind CSS (Next.js)",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState } from 'react';
import { Send, Phone, MessageSquare, X, MessageCircle } from 'lucide-react';

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgHover: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'telegram',
    label: 'Написать в Telegram',
    href: 'https://t.me/proektmap',
    icon: Send,
    color: '#229ED9',
    bgHover: 'hover:border-[#229ED9]/50 hover:bg-[#229ED9]/10',
  },
  {
    id: 'whatsapp',
    label: 'Связаться в WhatsApp',
    href: 'https://wa.me/79999999999',
    icon: MessageSquare,
    color: '#25D366',
    bgHover: 'hover:border-[#25D366]/50 hover:bg-[#25D366]/10',
  },
  {
    id: 'phone',
    label: 'Позвонить / Консультация',
    href: 'tel:+79999999999',
    icon: Phone,
    color: '#6366F1',
    bgHover: 'hover:border-[#6366F1]/50 hover:bg-[#6366F1]/10',
  },
];

export function FloatingSocialDock() {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      aria-label="Быстрая связь"
      className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-end gap-3"
    >
      {/* Десктопная версия: вертикальный стек с выдвижными лейблами */}
      <div className="hidden sm:flex flex-col items-end gap-2.5">
        {SOCIAL_LINKS.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredId === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={\`pointer-events-auto group relative flex items-center justify-end rounded-full p-3 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl shadow-black/20 hover:scale-105 \${item.bgHover}\`}
            >
              {/* Выдвижная плашка с текстом */}
              <span
                className={\`absolute right-14 whitespace-nowrap rounded-xl bg-slate-900/95 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur-md border border-slate-700/80 shadow-lg transition-all duration-200 pointer-events-none \${
                  isHovered
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2'
                }\`}
              >
                {item.label}
              </span>

              {/* Иконка */}
              <Icon
                className="h-5 w-5 transition-colors duration-200"
                style={{ color: item.color }}
              />
            </a>
          );
        })}
      </div>

      {/* Мобильная версия: компактная кнопка с выпадающим меню */}
      <div className="flex sm:hidden flex-col items-end gap-2 pointer-events-auto">
        {isOpenMobile && (
          <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex items-center gap-2.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/70 px-4 py-2.5 text-xs font-medium text-slate-200 shadow-lg active:scale-95"
                >
                  <Icon className="h-4 w-4" style={{ color: item.color }} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          aria-expanded={isOpenMobile}
          aria-label="Открыть меню контактов"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 active:scale-95 transition-transform"
        >
          {isOpenMobile ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}`,
      },
      {
        language: "html",
        title: "Чистый HTML + CSS (Vanilla)",
        framework: "vanilla-css",
        code: `<!-- HTML -->
<div class="social-dock" role="region" aria-label="Быстрые контакты">
  <a href="https://t.me/proektmap" target="_blank" rel="noopener noreferrer" class="dock-btn tg" aria-label="Telegram">
    <span class="dock-label">Написать в Telegram</span>
    <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  </a>
  <a href="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer" class="dock-btn wa" aria-label="WhatsApp">
    <span class="dock-label">WhatsApp</span>
    <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  </a>
</div>

<style>
.social-dock {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;
}
.dock-btn {
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  text-decoration: none;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.dock-btn:hover {
  transform: translateY(-2px) scale(1.04);
  border-color: rgba(255, 255, 255, 0.3);
}
.dock-icon {
  width: 20px;
  height: 20px;
}
.dock-label {
  position: absolute;
  right: 58px;
  white-space: nowrap;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-family: sans-serif;
  color: #e2e8f0;
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}
.dock-btn:hover .dock-label {
  opacity: 1;
  transform: translateX(0);
}
@media (max-width: 640px) {
  .social-dock { right: 16px; bottom: 16px; gap: 8px; }
  .dock-btn { width: 44px; height: 44px; }
  .dock-label { display: none; }
}
</style>`,
      },
    ],
    responsiveNotes: "На десктопе раскрываются подробные текстовые лейблы влево. На экранах смартфонов (< 640px) кнопки сжимаются до 44x44px либо прячутся под единый триггер-кругляшок.",
    accessibilityNotes: "Обязателен role=\"region\" и осмысленный aria-label. Фокусная рамка (focus-visible) обеспечивает полную доступность для клавиатурных пользователей.",
    relatedPatterns: ["cookie-consent-widget", "bento-grid-features"],
    recipes: ["saas-launch-hero", "service-landing-pro"],
    relatedResheniya: [
      { title: "Запустить SaaS-продукт", href: "/resheniya/saas-product" },
      { title: "Запустить Telegram-бота", href: "/resheniya/telegram-bot" },
    ],
  },
  {
    id: "cookie-consent-widget",
    slug: "cookie-consent-widget",
    title: "Cookie Consent & Privacy Banner",
    titleRu: "Виджет согласия на куки и политики данных (152-ФЗ / GDPR)",
    shortDescription: "Ненавязчивый плавающий баннер согласия с возможностью тонкой настройки категорий (Аналитика, Маркетинг, Необходимые) и запоминанием выбора в LocalStorage.",
    category: "ux-patterns",
    kind: "component",
    tags: ["cookie", "gdpr", "privacy", "banner", "modal", "compliance", "localStorage"],
    difficulty: "intermediate",
    badge: "Must have",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Всплывающий внизу экрана виджет для юридически корректного уведомления пользователей об использовании файлов cookie и сбора аналитики.",
      whereToUse: [
        "Любые коммерческие веб-сайты и SaaS-сервисы, подпадающие под 152-ФЗ (РФ) или GDPR (EU)",
        "Интернет-магазины с установленными счетчиками Яндекс.Метрики и Google Analytics",
      ],
      whyItWorks: "Не перекрывает контент глухой модалкой (сохраняет конверсию), но обеспечивает юридическую чистоту и даёт пользователю контроль.",
      commonMistakes: [
        "Блокировка всего интерфейса оверлеем без возможности быстро закрыть баннер",
        "Отсутствие сохранения состояния согласия в localStorage/cookie, из-за чего баннер появляется на каждой странице",
        "Отсутствие ссылок на Политику конфиденциальности и Пользовательское соглашение",
      ],
    },
    anatomy: {
      summary: "Плавающая карточка в нижней части экрана с плавной анимацией появления, аккордеоном тонкой настройки и синхронизацией с localStorage.",
      points: [
        {
          id: 1,
          title: "Нижний плавающий контейнер",
          cssRule: "position: fixed; bottom: 20px; left: 20px; right: 20px; max-width: 480px; z-index: 40;",
          description: "На десктопе располагается в углу, на мобилках занимает ширину экрана с безопасными отступами.",
          badge: "position",
        },
        {
          id: 2,
          title: "Состояние и персистентность",
          cssRule: "const [accepted, setAccepted] = useLocalStorage('cookie_consent', null)",
          description: "Не рендерится при первой отрисовке SSR, чтобы избежать гидратационного несовпадения (Hydration mismatch).",
          badge: "layout",
        },
        {
          id: 3,
          title: "Аккордеон категорий",
          cssRule: "max-height: 0 -> max-height: 300px; transition: max-height 0.3s ease-in-out;",
          description: "Позволяет пользователю включить технические куки, но отключить маркетинговые трекеры.",
          badge: "animation",
        },
        {
          id: 4,
          title: "Клавиатурная доступность",
          cssRule: "role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"cookie-title\"",
          description: "Корректная семантика диалогового окна без блокировки остального DOM-дерева.",
          badge: "accessibility",
        },
      ],
    },
    why: [
      {
        id: "why-hydration-mounted",
        question: "Почему проверка localStorage должна выполняться только после useEffect (mounted)?",
        principle: "Предотвращение Next.js Hydration Mismatch.",
        badAlternative: "Считывать localStorage напрямую во время первого рендера компонента.",
        consequence: "Серверный HTML (SSR) и клиентский DOM не совпадут, что приведёт к падению React гидратации с ошибкой Text content does not match server-rendered HTML и миганию интерфейса.",
        impactTag: "layout-stability",
      },
      {
        id: "why-non-blocking-dialog",
        question: "Почему баннер не должен блокировать весь экран модальным оверлеем?",
        principle: "Сохранение конверсии и уважение к первому касанию пользователя.",
        badAlternative: "Повесить position: fixed; inset: 0; backdrop-blur; с принудительным согласием.",
        consequence: "Конверсия первого экрана падает на 25-35%, так как посетитель не может даже бегло ознакомиться с предложением сайта до принятия решения.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "nextjs-hydration",
        title: "Client Hydration & LocalStorage State",
        level: "middle",
        description: "Безопасная работа с браузерными API в React Server Components.",
      },
      {
        id: "compliance-ux",
        title: "Legal & GDPR/152-FZ UX Patterns",
        level: "senior",
        description: "Проектирование юридически корректных и конверсионных интерфейсов согласия.",
      },
    ],
    promptVariables: [
      {
        id: "bannerStyle",
        label: "Форм-фактор баннера",
        defaultValue: "bottom-pill",
        options: [
          { label: "Плавающая карточка в углу (Bottom Card)", value: "bottom-card" },
          { label: "Полоса во всю ширину подвала (Bottom Bar)", value: "bottom-bar" },
          { label: "Компактная плашка-пилюля (Minimal Pill)", value: "bottom-pill" },
        ],
      },
      {
        id: "lawStandard",
        label: "Правовой стандарт",
        defaultValue: "ru-152fz",
        options: [
          { label: "РФ (152-ФЗ: Яндекс.Метрика + Согласие)", value: "ru-152fz" },
          { label: "GDPR (EU: гранулярные чекбоксы категорий)", value: "gdpr-eu" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer / Agent",
        title: "Промпт для Cursor (Next.js + Tailwind + LocalStorage)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует готовый клиентский компонент с защитой от hydration mismatch и анимациями.",
        promptText: `Создай переиспользуемый компонент CookieConsentWidget для Next.js App Router (TypeScript, Tailwind CSS, Lucide icons).

Требования:
1. Формат: {bannerStyle}. Располагается внизу страницы, не закрывает плавающие кнопки соцсетей.
2. Логика:
   - Проверяет значение в localStorage ('user_cookie_consent'). Если уже принято — ничего не рендерит.
   - Обязательно избегай Hydration Mismatch в Next.js (используй useEffect / mounted state).
3. Кнопки:
   - "Принять все" (яркая главная кнопка)
   - "Только необходимые" (второстепенная кнопка)
   - "Настроить" (раскрывает аккордеон с тумблерами: Обязательные, Аналитика, Маркетинг).
4. Текст: понятное и краткое объяснение с ссылкой на /privacy.
5. Стиль: матовое тёмное стекло (backdrop-blur-md bg-slate-900/90 border border-slate-700/60 text-slate-200).`,
        negativePrompt: `Запрещено:
- НЕ читай localStorage синхронно в теле функции до монтирования useEffect.
- НЕ перекрывай экран полноэкранным оверлеем (backdrop-blur во весь экран).
- НЕ используй alert/confirm.`,
      },
      {
        target: "v0",
        targetLabel: "v0 / Lovable",
        title: "Промпт для v0.dev",
        recommendedModel: "v0 Engine",
        description: "Создает красивый баннер согласия с микроанимациями и переключателями.",
        promptText: `A sleek, modern floating Cookie Consent banner for SaaS application.
Style: dark glassmorphic card with smooth entrance animation from bottom.
Includes title, 2 lines of text explaining cookies, 'Accept All' primary button, and 'Customize' toggle.
When customize is clicked, an expandable accordion reveals toggle switches for Analytics and Marketing cookies.
Tailwind CSS, clean rounded-2xl geometry, crisp Lucide icons.`,
        negativePrompt: `Do not block user scroll or overlay background completely.`,
      },
      {
        target: "claude",
        targetLabel: "Claude Code",
        title: "Промпт для Claude Code",
        recommendedModel: "Claude 3.7 Sonnet",
        description: "Чистый TypeScript React компонент с хуком localStorage.",
        promptText: `Напиши React-компонент CookieConsentBanner на TypeScript и Tailwind CSS.
Реализуй хранение выбора в localStorage ('cookie-preferences') со структурой: { necessary: true, analytics: boolean, marketing: boolean, timestamp: string }.
Предусмотри плавное появление (fade-in + slide-up) и кнопку закрытия.`,
        negativePrompt: `Без внешних тяжелых зависимостей.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React + Tailwind (Client Component)",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronDown, Check, X } from 'lucide-react';

export function CookieConsentWidget() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('pm_cookie_consent');
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !visible) return null;

  const handleAcceptAll = () => {
    localStorage.setItem(
      'pm_cookie_consent',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(
      'pm_cookie_consent',
      JSON.stringify({ necessary: true, analytics: false, marketing: false, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      'pm_cookie_consent',
      JSON.stringify({ necessary: true, analytics, marketing, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-5 shadow-2xl shadow-black/40 text-slate-200">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 id="cookie-title" className="text-sm font-semibold text-white">
              Конфиденциальность и Cookie
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Мы используем файлы cookie для корректной работы сайта и анализа посещаемости (152-ФЗ).
            </p>
          </div>
          <button
            onClick={handleAcceptNecessary}
            aria-label="Закрыть"
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Аккордеон настроек */}
        {showSettings && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-200">Необходимые куки</span>
                <p className="text-[11px] text-slate-500">Авторизация, безопасность и корзина</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Всегда вкл</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-200">Аналитика</span>
                <p className="text-[11px] text-slate-500">Яндекс.Метрика для улучшения интерфейса</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {showSettings ? (
            <button
              onClick={handleSaveCustom}
              className="flex-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Сохранить выбор
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="flex-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-colors"
              >
                Принять все
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition-colors"
              >
                Только нужные
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>{showSettings ? 'Скрыть' : 'Настроить'}</span>
            <ChevronDown className={\`h-3.5 w-3.5 transition-transform \${showSettings ? 'rotate-180' : ''}\`} />
          </button>
        </div>
      </div>
    </div>
  );
}`,
      },
    ],
    responsiveNotes: "На мобильных экранах виджет занимает всю ширину с паддингами 16px, на десктопе фиксируется компактной карточкой в правом или левом углу.",
    accessibilityNotes: "Оснащен атрибутами role=\"dialog\", aria-labelledby и доступными фокусными состояниями на всех кнопках.",
    relatedPatterns: ["floating-social-dock"],
    recipes: ["saas-launch-hero", "service-landing-pro"],
    relatedResheniya: [
      { title: "Запустить SaaS-продукт", href: "/resheniya/saas-product" },
    ],
  },
  {
    id: "bento-grid-features",
    slug: "bento-grid-features",
    title: "Bento Grid Feature Showcase",
    titleRu: "Бенто-сетка преимуществ и возможностей",
    shortDescription: "Асимметричная блочная раскладка карточек разного размера (1x1, 2x1, 2x2) с эффектом Spotlight-подсветки курсора для демонстрации ключевых фич продукта.",
    category: "layouts",
    kind: "layout",
    tags: ["bento", "grid", "layout", "spotlight", "cards", "showcase", "apple-style"],
    difficulty: "intermediate",
    badge: "Тренд дизайна",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Вдохновлённая японскими ланч-боксами и презентациями Apple блочная сетка, где блоки разного масштаба визуально иерархизируют фичи продукта.",
      whereToUse: [
        "Главные посадочные страницы технологических SaaS-сервисов и AI-продуктов",
        "Секции презентации возможностей мобильных и веб-приложений",
        "Портфолио проектов и кейсов",
      ],
      whyItWorks: "Ломает монотонность одинаковых карточек 3 в ряд, выделяет главный флагманский функционал в большой блок (2x2) и добавляет интерактивную динамику.",
      commonMistakes: [
        "Отсутствие адаптивного сброса на мобильных: grid-template-columns: repeat(3, 1fr) на смартфонах ломает вёрстку",
        "Слишком много тяжёлых градиентов без аппаратного ускорения",
      ],
    },
    anatomy: {
      summary: "CSS Grid с auto-rows и динамическими col-span / row-span классами, дополненный radial-gradient подсветкой по координатам курсора.",
      points: [
        {
          id: 1,
          title: "Асимметричная CSS-сетка",
          cssRule: "display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem;",
          description: "На десктопе 3 или 4 колонки, на мобильных автоматический сброс в 1 колонку.",
          badge: "layout",
        },
        {
          id: 2,
          title: "Акцентные блоки (Span)",
          cssRule: "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
          description: "Флагманская фича занимает двойную площадь, привлекая 70% первого внимания.",
          badge: "layout",
        },
        {
          id: 3,
          title: "Spotlight-свечение за курсором",
          cssRule: "background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99,102,241,0.15), transparent 40%);",
          description: "Карточки отслеживают перемещение мыши и подсвечивают свои границы мягким свечением.",
          badge: "animation",
        },
      ],
    },
    why: [
      {
        id: "why-grid-auto-rows",
        question: "Почему в Bento Grid необходимо использовать grid-template-columns: repeat(3, minmax(0, 1fr)), а не flexbox?",
        principle: "Двумерный контроль геометрии (строки + столбцы одновременно).",
        badAlternative: "Строить сетку через вложенные flex-контейнеры с процентной шириной (w-1/3, w-2/3).",
        consequence: "Высота карточек в разных рядах начинает расходиться при динамическом контенте, появляются дыры и ломается выравнивание линий.",
        impactTag: "layout-stability",
      },
      {
        id: "why-spotlight-css-vars",
        question: "Почему для Spotlight подсветки координаты мыши передаются через CSS-переменные (--mouse-x), а не через React state на каждый пиксель?",
        principle: "Изоляция ререндеров React от частоты движения мыши.",
        badAlternative: "Вызывать setState({ x, y }) при каждом mousemove событии внутри 5 карточек.",
        consequence: "React будет ререндерить всё дерево компонентов 120 раз в секунду, вызывая лаги ввода и фризы анимаций.",
        impactTag: "performance",
      },
    ],
    skills: [
      {
        id: "css-grid-mastery",
        title: "Advanced CSS Grid & Asymmetric Layouts",
        level: "middle",
        description: "Проектирование сложных адаптивных сеток с col-span/row-span и subgrid.",
      },
      {
        id: "reactive-css-variables",
        title: "High-performance CSS Variables with Mouse Coordinates",
        level: "senior",
        description: "Связывание физики курсора с шейдерами и градиентами без просадки React FPS.",
      },
    ],
    promptVariables: [
      {
        id: "columnsCount",
        label: "Формат колонок",
        defaultValue: "3-cols",
        options: [
          { label: "3 колонки (1 большой блок + 4 маленьких)", value: "3-cols" },
          { label: "4 колонки (2 средних + 4 компактных)", value: "4-cols" },
        ],
      },
      {
        id: "cardTheme",
        label: "Стиль карточек",
        defaultValue: "dark-glass",
        options: [
          { label: "Dark Glass + Spotlight свечение", value: "dark-glass" },
          { label: "Clean Border + Subtle Gradients", value: "clean-border" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Bento Grid + Spotlight)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует компонент Bento-сетки с эффектом следящей за курсором подсветки границ.",
        promptText: `Создай переиспользуемый компонент BentoGridShowcase для Next.js (TypeScript, Tailwind CSS, lucide-react).

Спецификация:
1. Раскладка: Bento Grid на 3 колонки (grid-cols-1 md:grid-cols-3 gap-5).
2. Карточки:
   - Блок 1 (Главный, col-span-2 row-span-2): Большая демонстрация AI-интерфейса или живой график с кодом.
   - Блок 2 (col-span-1): Карточка со скоростью/метрикой (например, "⚡ 10x быстрее").
   - Блок 3 (col-span-1): Карточка интеграций (иконки Telegram, GitHub, Stripe, Supabase).
   - Блок 4 (col-span-2): Интерактивный терминал или превью промпта.
3. Интерактив: эффект Spotlight (слежение за мышью mousemove с радиальным градиентом в border/background).
4. Стиль: {cardTheme} (тёмная глубина bg-slate-900/60, border border-slate-800, скругления rounded-3xl).`,
        negativePrompt: `Запрещено:
- НЕ используй flexbox вместо CSS grid.
- НЕ фиксируй жесткую высоту (height: 400px) на текстовых карточках.
- НЕ забывай про сброс на мобильных экранах (grid-cols-1).`,
      },
      {
        target: "v0",
        targetLabel: "v0 / Lovable",
        title: "Промпт для v0.dev",
        recommendedModel: "v0 Engine",
        description: "Визуально насыщенная Apple-style сетка возможностей.",
        promptText: `An Apple-style Bento Grid layout showcasing product features for modern AI SaaS.
Layout: 3-column asymmetric grid with one large 2x2 featured card and three smaller cards.
Theme: dark futuristic UI, dark slate backgrounds, subtle glowing borders, crisp typography, and badge pills.
Includes code preview mockups, stats metrics, and icons. Fully responsive with mobile fallback to single column.`,
        negativePrompt: `Do not create flat identical 3-column cards without visual hierarchy.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Bento Grid Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState } from 'react';
import { Sparkles, Zap, Shield, Bot, ArrowUpRight } from 'lucide-react';

export function BentoGridFeatures() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Архитектура возможностей
        </span>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Собрано для скорости вашей разработки
        </h2>
      </div>

      <div
        onMouseMove={handleMouseMove}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 group/grid"
      >
        {/* Большая карточка 2x2 */}
        <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-slate-900/70 border border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Флагманский модуль</span>
            <h3 className="text-2xl font-bold text-white mt-2">AI-Ассистент с памятью контекста</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md">
              Автоматически считывает дерево файлов проекта и предлагает готовые микросервисы без ручного копипаста.
            </p>
          </div>
          <div className="mt-8 rounded-2xl bg-slate-950/80 border border-slate-800/80 p-4 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-2 text-slate-500 pb-3 border-b border-slate-800">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-[11px] ml-2">agent-stream.ts</span>
            </div>
            <p className="mt-3 text-indigo-300">// Генерация компонента на лету</p>
            <p className="text-emerald-400 font-semibold">✓ 100% Type-safe & Tested</p>
          </div>
        </div>

        {/* Карточка 1x1 Скорость */}
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mt-4">Мгновенный отклик</h4>
            <p className="text-xs text-slate-400 mt-1">Кэширование на границе сети с TTFB &lt; 35ms.</p>
          </div>
        </div>

        {/* Карточка 1x1 Безопасность */}
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mt-4">Изоляция секретов</h4>
            <p className="text-xs text-slate-400 mt-1">API-ключи никогда не попадают в клиентский бандл.</p>
          </div>
        </div>
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "Автоматически перестраивается из 3-колоночной асимметричной сетки на десктопе в аккуратный одноколоночный стек на мобильных экранах без боковых скроллов.",
    accessibilityNotes: "Семантичные заголовки h2/h3/h4 обеспечивают правильное древовидное чтение скринридерами.",
    relatedPatterns: ["floating-social-dock", "hero-editorial", "pricing-comparison"],
    recipes: ["saas-launch-hero"],
    relatedResheniya: [
      { title: "Запустить SaaS-продукт", href: "/resheniya/saas-product" },
    ],
  },
  {
    id: "hero-editorial",
    slug: "hero-editorial",
    title: "Editorial Hero Section with Oversized Typography",
    titleRu: "Эдиториал Hero-секция с крупной типографикой",
    shortDescription: "Главный экран с крупным акцентным заголовком, контрастным eyebrow-бейджем, подзаголовком с ограничением ширины и парой целевых действий (CTA) без визуального шума.",
    category: "layouts",
    kind: "layout",
    tags: ["hero", "editorial", "typography", "cta", "eyebrow", "landing", "first-screen"],
    difficulty: "beginner",
    badge: "Фундамент",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Первый видимый экран лендинга или сайта продукта, выполненный в строгом редакционном стиле (Swiss/Editorial Design) с фокусом на оффере и контрастных действиях.",
      whereToUse: [
        "Главные страницы SaaS-сервисов, AI-инструментов и агентств",
        "Лендинги с сильным текстовым позиционированием и понятной ценностью",
        "Продуктовые презентации и портфолио инженеров",
      ],
      whyItWorks: "Не перегружает внимание пользователя сложными иллюстрациями до того, как он понял суть предложения. Глаз считывает иерархию за 2.5 секунды: Бейдж → Суть (H1) → Подробности → Кнопка.",
      commonMistakes: [
        "Отсутствие max-width на абзаце подзаголовка, из-за чего строка растягивается на 1400px и становится нечитаемой",
        "Использование неуправляемых font-size без clamp(), приводящее к переносам одного слова на новую строку на мобильных",
        "Две одинаково яркие кнопки, создающие у пользователя когнитивный тупик выбора",
      ],
    },
    anatomy: {
      summary: "Строгая вертикальная иерархия с выравниванием по левому краю или центру, clamp-размером шрифта и primary/secondary разделением кнопок.",
      points: [
        {
          id: 1,
          title: "Eyebrow-бейдж категории",
          cssRule: "display: inline-flex; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;",
          description: "Задаёт контекст и статус продукта до чтения основного заголовка.",
          badge: "layout",
        },
        {
          id: 2,
          title: "Адаптивная типографика H1",
          cssRule: "font-size: clamp(2rem, 5vw + 1rem, 3.75rem); line-height: 1.1; letter-spacing: -0.03em;",
          description: "Плавное масштабирование заголовка без дискретных скачков и выпадения слов за экран.",
          badge: "responsive",
        },
        {
          id: 3,
          title: "Ограничение длины строки (Measure)",
          cssRule: "max-width: 65ch; /* 65 символов в строке — золотой стандарт читаемости */",
          description: "Предотвращает усталость глаз при чтении поясняющего текста.",
          badge: "layout",
        },
        {
          id: 4,
          title: "Иерархия действий (CTA Hierarchy)",
          cssRule: "primary: background var(--color-accent); secondary: border 1px var(--color-border);",
          description: "Чёткое разделение главного целевого действия (Начать) и исследовательского (Демо/Документация).",
          badge: "position",
        },
      ],
    },
    why: [
      {
        id: "why-clamp-font",
        question: "Почему в H1 необходимо использовать clamp(), а не фиксированный font-size в пикселях?",
        principle: "Плавная адаптивность без ломающихся строк.",
        badAlternative: "Задать жесткий font-size: 56px для десктопа и font-size: 32px для мобилки через media-query.",
        consequence: "На промежуточных планшетах (768–1024px) длинные слова будут некрасиво разрывать заголовок на 4 строки, смещая весь первый экран вниз.",
        impactTag: "layout-stability",
      },
      {
        id: "why-max-ch-width",
        question: "Почему для лид-текста задают max-width: 60-65ch?",
        principle: "Типографический закон комфортного чтения (длина строки).",
        badAlternative: "Оставить ширину текста 100% от контейнера 1200px.",
        consequence: "Глаз читателя теряет начало следующей строки при переносе, скорость чтения падает в 3 раза, посетитель закрывает вкладку.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "fluid-typography",
        title: "Fluid Typography & Viewport Units",
        level: "middle",
        description: "Построение гибких масштабируемых заголовков на формулах clamp() и ch units.",
      },
      {
        id: "cta-visual-weight",
        title: "Action Hierarchy & Cognitive Load",
        level: "junior",
        description: "Проектирование конверсионных пар кнопок (Primary vs Secondary).",
      },
    ],
    promptVariables: [
      {
        id: "alignment",
        label: "Выравнивание контента",
        defaultValue: "left-aligned",
        options: [
          { label: "По левому краю (Editorial Left)", value: "left-aligned" },
          { label: "По центру (Classic Center)", value: "center-aligned" },
        ],
      },
      {
        id: "hasSocialProof",
        label: "Блок социального пруфа",
        defaultValue: "with-avatars",
        options: [
          { label: "С аватарами пользователей и рейтингом ⭐ 4.9", value: "with-avatars" },
          { label: "Минималистичный (только кнопки)", value: "clean" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Hero Editorial)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует семантичный Hero-блок в строгом швейцарском стиле без скруглений и лишнего декора.",
        promptText: `Создай переиспользуемый компонент HeroEditorial для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Выравнивание: {alignment}.
2. Структура первого экрана:
   - Eyebrow-бейдж: статус или категория в рамке 1px, text-xs uppercase tracking-wider.
   - Заголовок H1: крупная контрастная типографика clamp(2.2rem, 5vw, 4rem), tracking-tight, line-height-tight.
   - Подзаголовок: размер text-base/text-lg, max-w-2xl, цвет текста вторичный muted.
   - Группа CTA:
     * Главная кнопка: сплошная заливка акцентным цветом, стрелка ArrowRight.
     * Второстепенная кнопка: прозрачный фон, рамка 1px border-slate-700.
3. Социальный пруф: {hasSocialProof} (стек из 3 аватарок + текст "500+ инженеров уже собирают проекты").
4. Дизайн-система: строгий 0px border-radius, чистые линии, поддержка светлой/тёмной темы.`,
        negativePrompt: `Запрещено:
- НЕ используй скругления (никаких rounded-xl/rounded-full).
- НЕ делай одинаковые по контрасту две кнопки.
- НЕ растягивай текст описания шире 700px.`,
      },
      {
        target: "v0",
        targetLabel: "v0 / Lovable",
        title: "Промпт для v0.dev",
        recommendedModel: "v0 Engine",
        description: "Создает мощный первый экран с чистой типографикой и швейцарским стилем.",
        promptText: `An ultra-clean Swiss editorial Hero section for modern AI platform.
Strict 0px border radius geometry, monospace accent tags, bold oversized typography with tight letter spacing.
Includes category eyebrow badge, compelling 2-line headline, constrained paragraph, primary accent CTA button, and secondary ghost button.
Responsive layout, mobile optimized, crisp contrast.`,
        negativePrompt: `Do not use rounded corners, gradients or bloated decorations.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Hero Editorial Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

export function HeroEditorial() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-b border-border">
      <div className="max-w-3xl">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-wider font-bold text-accent bg-accent/10 border border-accent mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Платформа AI-инжиниринга • Релиз v2.5</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.08] mb-6">
          Собирайте готовые цифровые продукты <br />
          <span className="text-accent underline decoration-2 underline-offset-4">
            через AI-агентов
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mb-8">
          Проверенные инженерные маршруты, готовые архитектурные паттерны и точные промпты. 
          От первой идеи до рабочего сервера с оплатой и базой данных.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <a
            href="/resheniya"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white font-bold text-sm border border-accent hover:opacity-90 transition-opacity"
          >
            <span>Выбрать готовое решение</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="/ui-patterns"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-bg-secondary text-text-primary font-semibold text-sm border border-border hover:bg-bg-tertiary transition-colors"
          >
            <span>Каталог UI-паттернов</span>
          </a>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-4 pt-6 border-t border-border-light text-xs text-text-secondary font-mono">
          <div className="flex items-center gap-1 text-warning">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-text-primary">4.9 / 5.0</span>
          </div>
          <span>•</span>
          <span>1,200+ инженеров и вайбкодеров в сообществе</span>
        </div>
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "Заголовок адаптируется под размер экрана без переноса одиночных букв. Кнопки CTA на экранах < 640px занимают полную ширину.",
    accessibilityNotes: "Семантический тег h1 как главный заголовок документа. Фокусные рамки на всех интерактивных ссылках.",
    relatedPatterns: ["sticky-glass-header", "bento-grid-features", "pricing-comparison"],
    recipes: ["saas-launch-hero", "service-landing-pro"],
  },
  {
    id: "sticky-glass-header",
    slug: "sticky-glass-header",
    title: "Smart Sticky Glass Header with Scroll Transition",
    titleRu: "Умная фиксированная шапка со сжатием и размытием",
    shortDescription: "Навигационная панель, которая плавно уменьшает высоту, активирует матовое размытие фона и границу при начале скролла страницы вниз.",
    category: "navigation",
    kind: "pattern",
    tags: ["header", "navbar", "sticky", "glass", "scroll-state", "blur", "navigation"],
    difficulty: "intermediate",
    badge: "Базовый паттерн",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Верхняя панель навигации, зафиксированная в топе экрана (sticky/fixed), которая динамически реагирует на scrollY пользователя, меняя визуальный вес.",
      whereToUse: [
        "Любые многостраничные сайты, лендинги и веб-сервисы",
        "Интерфейсы документации и базы знаний",
      ],
      whyItWorks: "На самом верху страницы шапка просторная и прозрачная (не отвлекает от Hero). При скролле она становится компактной и контрастной, сохраняя доступ к меню и кнопке входа.",
      commonMistakes: [
        "Отсутствие throttle на событии scroll, что вызывает перерасчёт стилей 120 раз в секунду",
        "Слишком большой z-index, перекрывающий всплывающие модальные окна (z-50 против z-9999)",
      ],
    },
    anatomy: {
      summary: "Сочетание position: sticky top: 0 с реактивным стейтом isScrolled (scrollY > 20px) и переходами высоты 64px -> 52px.",
      points: [
        {
          id: 1,
          title: "Фиксация в потоке",
          cssRule: "position: sticky; top: 0; z-index: 40; width: 100%;",
          description: "Держит шапку в зоне видимости без выпадения из потока документа.",
          badge: "position",
        },
        {
          id: 2,
          title: "Плавная трансформация высоты",
          cssRule: "height: isScrolled ? 52px : 68px; transition: height 0.2s ease, background 0.2s ease;",
          description: "Освобождает вертикальное пространство экрана при чтении длинного контента.",
          badge: "animation",
        },
        {
          id: 3,
          title: "Матовое стекло (Backdrop Blur)",
          cssRule: "backdrop-filter: blur(12px); background: rgba(var(--bg-primary-rgb), 0.85);",
          description: "Контент страницы мягко размывается под шапкой, сохраняя идеальную читаемость ссылок.",
          badge: "layout",
        },
      ],
    },
    why: [
      {
        id: "why-sticky-over-fixed",
        question: "Почему лучше использовать position: sticky, а не position: fixed?",
        principle: "Сохранение естественного потока документа.",
        badAlternative: "Использовать fixed с принудительным padding-top на body.",
        consequence: "При изменении высоты шапки контент под ней начинает дергаться или залезать под меню при загрузке.",
        impactTag: "layout-stability",
      },
      {
        id: "why-passive-scroll",
        question: "Почему слушатель scroll должен быть { passive: true }?",
        principle: "Неблокирующий скролл браузера.",
        badAlternative: "Обычный window.addEventListener('scroll', handler).",
        consequence: "Браузер ожидает завершения JavaScript функции перед выполнением скролла страницы, что приводит к микрофризам.",
        impactTag: "performance",
      },
    ],
    skills: [
      {
        id: "scroll-driven-ui",
        title: "Scroll State Management & Passive Listeners",
        level: "middle",
        description: "Оптимизация обработчиков скролла и плавной динамической смены классов.",
      },
      {
        id: "backdrop-filters",
        title: "Hardware-Accelerated Backdrop Filters",
        level: "junior",
        description: "Настройка полупрозрачных матовых поверхностей.",
      },
    ],
    promptVariables: [
      {
        id: "hasCtaButton",
        label: "Кнопка входа/действия",
        defaultValue: "with-button",
        options: [
          { label: "С кнопкой 'Войти / Регистрация'", value: "with-button" },
          { label: "Только ссылки навигации", value: "links-only" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Sticky Header)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует умную шапку с хуком скролла и поддержкой темы.",
        promptText: `Создай переиспользуемый компонент SmartStickyHeader для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Требования:
1. Позиционирование: sticky top-0 z-40.
2. Состояние скролла:
   - Слушает scroll с { passive: true }.
   - При scrollY > 20px активирует состояние isScrolled: высота уменьшается с h-16 до h-13, включается backdrop-blur-md bg-bg-primary/85 и нижняя граница border-b border-border.
3. Элементы:
   - Логотип + название проекта.
   - Десктопные ссылки навигации (Готовые решения, Паттерны, Цены, Блог).
   - Действие: {hasCtaButton}.
   - Мобильный гамбургер-триггер для раскрытия меню на смартфонах.
4. Стиль: строгий 0px radius, чистые линии, поддержка темной и светлой темы.`,
        negativePrompt: `Запрещено использовать rounded углы. Не блокируй скролл страницы.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Sticky Header Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

export function SmartStickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={\`sticky top-0 z-40 w-full transition-all duration-200 \${
        isScrolled
          ? 'h-14 bg-bg-primary/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'h-18 bg-bg-primary border-b border-border-light'
      }\`}
    >
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-base tracking-tight text-text-primary">
          <span className="w-3 h-3 bg-accent" />
          <span>PROEKTMAP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-text-secondary">
          <Link href="/resheniya" className="hover:text-text-primary transition-colors">Готовые решения</Link>
          <Link href="/ui-patterns" className="hover:text-text-primary transition-colors">UI-Атлас</Link>
          <Link href="/pricing" className="hover:text-text-primary transition-colors">Тарифы</Link>
          <Link href="/blog" className="hover:text-text-primary transition-colors">База знаний</Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/auth"
            className="px-4 py-2 bg-accent text-white text-xs font-bold border border-accent hover:opacity-90 transition-opacity"
          >
            Войти в систему
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-text-primary"
          aria-label="Меню"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-bg-secondary p-4 space-y-3 text-xs font-semibold">
          <Link href="/resheniya" className="block py-2 text-text-primary">Готовые решения</Link>
          <Link href="/ui-patterns" className="block py-2 text-text-primary">UI-Атлас</Link>
          <Link href="/pricing" className="block py-2 text-text-primary">Тарифы</Link>
          <Link href="/auth" className="block py-2 text-accent font-bold">Войти</Link>
        </div>
      )}
    </header>
  );
}`,
      },
    ],
    responsiveNotes: "На мобильных экранах (< 768px) сворачивает навигационные ссылки в гамбургер-панель.",
    accessibilityNotes: "Оснащен nav тегом, aria-label на кнопке меню и фокусным состоянием.",
    relatedPatterns: ["hero-editorial", "mobile-bottom-nav"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "mobile-bottom-nav",
    slug: "mobile-bottom-nav",
    title: "Mobile Bottom Navigation Bar (Thumb Zone)",
    titleRu: "Нижняя мобильная панель навигации (Зона большого пальца)",
    shortDescription: "Фиксированная внизу экрана панель для смартфонов с учетом safe-area-inset отступов, активными индикаторами разделов и быстрым доступом к главным экранам.",
    category: "navigation",
    kind: "pattern",
    tags: ["mobile", "bottom-nav", "thumb-zone", "safe-area", "navigation", "smartphone"],
    difficulty: "beginner",
    badge: "Mobile-first",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Нижняя панель приложения/сайта для мобильных устройств, расположенная в самой удобной зоне досягаемости пальца (Thumb Zone).",
      whereToUse: [
        "Мобильные версии веб-приложений (PWA), SaaS-дашбордов и каталогов",
        "Личные кабинеты пользователей на смартфонах",
      ],
      whyItWorks: "Современные экраны смартфонов больше 6.5 дюймов — дотянуться до левого верхнего угла для открытия меню трудно. Нижняя панель решает проблему на 100%.",
      commonMistakes: [
        "Отсутствие отступа env(safe-area-inset-bottom), из-за чего на iPhone панель перекрывается домашней полоской",
        "Больше 5 пунктов меню в один ряд (кнопки становятся слишком узкими)",
      ],
    },
    anatomy: {
      summary: "Фиксированный нижний бар с display: flex, равномерным распределением кнопок (justify-around) и поддержкой safe area.",
      points: [
        {
          id: 1,
          title: "Safe Area Inset (iOS Home Bar)",
          cssRule: "padding-bottom: max(12px, env(safe-area-inset-bottom));",
          description: "Защищает элементы интерфейса от перекрытия системной полосой жестов iOS.",
          badge: "responsive",
        },
        {
          id: 2,
          title: "Равномерная сетка табов",
          cssRule: "display: grid; grid-template-columns: repeat(4, 1fr); text-align: center;",
          description: "Каждый пункт получает одинаковую площадь для нажатия пальцем.",
          badge: "layout",
        },
        {
          id: 3,
          title: "Активное состояние раздела",
          cssRule: "active: color var(--color-accent); font-weight: 700;",
          description: "Мгновенная визуальная индикация текущей страницы.",
          badge: "position",
        },
      ],
    },
    why: [
      {
        id: "why-safe-area",
        question: "Почему нельзя обойтись обычным padding-bottom: 12px без env(safe-area-inset-bottom)?",
        principle: "Аппаратная совместимость с безрамочными смартфонами.",
        badAlternative: "Задать фиксированный отступ 10px снизу.",
        consequence: "На всех iPhone от X до 16 системная полоса 'Home' будет накладываться на иконки и вызывать случайные сворачивания браузера при нажатии.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "safe-area-insets",
        title: "CSS Safe Area Insets & Mobile Viewport",
        level: "junior",
        description: "Корректная обработка вырезов и системных зон на iOS и Android.",
      },
    ],
    promptVariables: [
      {
        id: "tabCount",
        label: "Количество табов",
        defaultValue: "4-tabs",
        options: [
          { label: "4 пункта (Главная, Решения, Атлас, Профиль)", value: "4-tabs" },
          { label: "3 пункта (Каталог, Поиск, Меню)", value: "3-tabs" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Mobile Bottom Nav)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует мобильный нижний бар с поддержкой usePathname и safe-area.",
        promptText: `Создай переиспользуемый компонент MobileBottomNav для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Видимость: только на мобильных экранах (md:hidden block), fixed bottom-0 left-0 right-0 z-50.
2. Безопасные отступы: pb-[max(12px,env(safe-area-inset-bottom))] pt-2.
3. Табы: {tabCount} (Иконка сверху, подпись 10px снизу).
4. Определение активного роута через usePathname().
5. Стиль: строго 0px radius, bg-bg-primary/95 backdrop-blur-md border-t border-border.`,
        negativePrompt: `Не используй скругления. Не рендери компонент на десктопе.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Mobile Bottom Nav Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Sparkles, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Главная', href: '/', icon: Home },
    { label: 'Решения', href: '/resheniya', icon: Layers },
    { label: 'UI-Атлас', href: '/ui-patterns', icon: Sparkles },
    { label: 'Профиль', href: '/profile', icon: User },
  ];

  return (
    <nav
      aria-label="Мобильная навигация"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-4 h-13 pt-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`flex flex-col items-center justify-center gap-1 transition-colors \${
                isActive ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary'
              }\`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}`,
      },
    ],
    responsiveNotes: "Автоматически скрывается на экранах шире 768px (md:hidden).",
    accessibilityNotes: "Использует семантический тег nav с aria-label.",
    relatedPatterns: ["sticky-glass-header", "floating-social-dock"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "pricing-comparison",
    slug: "pricing-comparison",
    title: "Interactive Pricing Table with Monthly/Annual Toggle",
    titleRu: "Интерактивная тарифная сетка с переключателем периода",
    shortDescription: "Тарифная таблица из 3 планов с тумблером Месяц/Год (скидка 20%), акцентной карточкой «Популярный выбор», списком фич и готовыми CTA.",
    category: "content",
    kind: "component",
    tags: ["pricing", "billing", "toggle", "cards", "saas", "subscription", "conversion"],
    difficulty: "intermediate",
    badge: "Конверсия",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Основной конверсионный блок тарифов и подписок с возможностью переключения между месячным и годовым планом.",
      whereToUse: [
        "Страницы цен и покупки SaaS-сервисов, AI-инструментов и подписочных сервисов",
        "Коммерческие секции посадочных страниц",
      ],
      whyItWorks: "Годовой тумблер увеличивает средний чек (LTV) на 30-40%, а выделенная карточка «Рекомендуем» снимает паралич выбора у клиента.",
      commonMistakes: [
        "Отсутствие понятного объяснения, что входит в каждый тариф",
        "Скрытые комиссии или неясные условия продления",
      ],
    },
    anatomy: {
      summary: "Тумблер периода вверху + сетка из 3 колонок, где средняя карточка имеет акцентную рамку и бейдж «Хит».",
      points: [
        {
          id: 1,
          title: "Периодический тумблер (State Toggle)",
          cssRule: "display: inline-flex; border: 1px solid var(--color-border); padding: 4px;",
          description: "Переключает расчет цены без перезагрузки страницы.",
          badge: "animation",
        },
        {
          id: 2,
          title: "Акцентная карточка тарифа",
          cssRule: "border: 2px solid var(--color-accent); background: var(--color-bg-secondary);",
          description: "Привлекает до 75% всех первых кликов покупателей.",
          badge: "layout",
        },
        {
          id: 3,
          title: "Список включенных фич (Checklist)",
          cssRule: "display: flex; align-items: center; gap: 8px; font-size: 13px;",
          description: "Наглядно подтверждает ценность каждой ступени тарифа.",
          badge: "layout",
        },
      ],
    },
    why: [
      {
        id: "why-highlight-middle",
        question: "Почему средний тариф всегда должен быть визуально выделен?",
        principle: "Эффект приманки и снижение когнитивного сопротивления (Decoy Effect).",
        badAlternative: "Сделать 3 абсолютно одинаковые по цвету и рамке карточки.",
        consequence: "Пользователь дольше сомневается, конверсия в покупку падает на 18-25%.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "pricing-psychology",
        title: "Pricing Architecture & Decoy Effect",
        level: "middle",
        description: "Проектирование тарифных сеток с максимальной конверсией.",
      },
    ],
    promptVariables: [
      {
        id: "currency",
        label: "Валюта тарифов",
        defaultValue: "rub",
        options: [
          { label: "Рубли (₽ / мес)", value: "rub" },
          { label: "Доллары ($ / mo)", value: "usd" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Pricing Comparison)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Создает тарифную сетку с расчетом годовой скидки и списком фич.",
        promptText: `Создай переиспользуемый компонент PricingComparison для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Переключатель: Месячная оплата / Годовая оплата (с бейджем "Скидка 20%").
2. 3 тарифных плана:
   - Базовый (Старт / Free)
   - Профессиональный (Pro • Рекомендуем, акцентная рамка 2px)
   - Командный / Enterprise
3. В каждой карточке:
   - Название, краткое описание
   - Динамическая цена с учетом выбранного периода ({currency})
   - Список из 5-6 фич с галочками Check
   - Целевая кнопка покупки (Primary для Pro, Secondary для остальных).
4. Стиль: строгий 0px radius, четкие границы, поддержка темной темы.`,
        negativePrompt: `Не используй скругления.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Pricing Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export function PricingComparison() {
  const [annual, setAnnual] = useState(false);

  const PLANS = [
    {
      name: 'Старт',
      desc: 'Для изучения базы и первых экспериментов',
      priceMonthly: 0,
      priceAnnual: 0,
      features: ['Доступ ко всем базовым статьям', '1 готовое решение', 'Чат сообщества'],
      cta: 'Начать бесплатно',
      popular: false,
    },
    {
      name: 'Pro Инженер',
      desc: 'Полный доступ ко всем маршрутам и AI-кодингу',
      priceMonthly: 990,
      priceAnnual: 790,
      features: [
        'Все готовые решения ProektMap',
        'Полный UI-Атлас и Master-промпты',
        'AI-консультант без ограничений',
        'Закрытые вебинары и разборы',
      ],
      cta: 'Оформить Pro',
      popular: true,
    },
    {
      name: 'Команда',
      desc: 'Для агентств и совместной разработки',
      priceMonthly: 2990,
      priceAnnual: 2390,
      features: [
        'До 5 аккаунтов в команде',
        'Приоритетный аудит ваших решений',
        'Прямая связь с архитектором',
        'Закрытый репозиторий компонентов',
      ],
      cta: 'Подключить команду',
      popular: false,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
          Прозрачные тарифы без скрытых условий
        </h2>
        <p className="text-sm text-text-secondary">
          Инвестируйте в навыки AI-инжиниринга и окупайте подписку с первого коммерческого проекта.
        </p>

        {/* Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1 bg-bg-secondary border border-border">
          <button
            onClick={() => setAnnual(false)}
            className={\`px-4 py-2 text-xs font-bold transition-colors \${
              !annual ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
            }\`}
          >
            Оплата помесячно
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={\`px-4 py-2 text-xs font-bold transition-colors flex items-center gap-1.5 \${
              annual ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
            }\`}
          >
            <span>Оплата за год</span>
            <span className="text-[10px] bg-warning-light text-warning px-1.5 py-0.2 font-bold border border-warning">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={\`p-8 bg-bg-secondary border flex flex-col justify-between \${
              plan.popular
                ? 'border-accent shadow-lg relative'
                : 'border-border'
            }\`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                Хит продаж
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{plan.desc}</p>

              <div className="my-6">
                <span className="text-3xl font-black text-text-primary">
                  {annual ? plan.priceAnnual : plan.priceMonthly} ₽
                </span>
                <span className="text-xs text-text-tertiary ml-2">/ месяц</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-border-light text-xs text-text-secondary">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={\`w-full mt-8 py-3 text-xs font-bold border flex items-center justify-center gap-2 transition-opacity \${
                plan.popular
                  ? 'bg-accent text-white border-accent hover:opacity-90'
                  : 'bg-bg-primary text-text-primary border-border hover:bg-bg-tertiary'
              }\`}
            >
              <span>{plan.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "На смартфонах карточки выстраиваются вертикально, сохраняя фокус на тарифе Pro.",
    accessibilityNotes: "Четкие контрастные метки цен и атрибуты aria-pressed на тумблере.",
    relatedPatterns: ["hero-editorial", "bento-grid-features"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "testimonial-stack",
    slug: "testimonial-stack",
    title: "Editorial Testimonial Grid & Social Proof Cards",
    titleRu: "Сетка отзывов и социального подтверждения (Social Proof)",
    shortDescription: "Блок реальных отзывов студентов и инженеров с цитатами, аватарами, ролями, ссылками на проекты и рейтингом 5 звезд в строгом стиле.",
    category: "content",
    kind: "component",
    tags: ["testimonials", "reviews", "social-proof", "trust", "cards", "quotes"],
    difficulty: "beginner",
    badge: "Доверие",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Секция клиентских отзывов и кейсов внедрения, подтверждающая ценность продукта реальным опытом других людей.",
      whereToUse: [
        "Коммерческие посадочные страницы и сайты обучающих программ",
        "Перед финальным блоком покупки или регистрации",
      ],
      whyItWorks: "Снимает финальные страхи и возражения («Получится ли у меня?», «Работает ли это в реальности?»).",
      commonMistakes: [
        "Фейковые безликие отзывы без указания роли человека и ссылки на результат",
        "Слишком длинные простыни текста без выделения главной мысли",
      ],
    },
    anatomy: {
      summary: "Сетка из 3 карточек с цитатами, рейтингом звездами и блоком автора (аватар + имя + должность).",
      points: [
        {
          id: 1,
          title: "Главная выжимка цитаты",
          cssRule: "font-weight: 700; font-size: 15px; line-height: 1.4;",
          description: "Выделенная суть отзыва, которую считывают при беглом просмотре за 1 секунду.",
          badge: "layout",
        },
        {
          id: 2,
          title: "Профиль автора (Social Validation)",
          cssRule: "display: flex; align-items: center; gap: 12px; margin-top: 16px;",
          description: "Имя, компания и статус подтверждают подлинность отзыва.",
          badge: "layout",
        },
      ],
    },
    why: [
      {
        id: "why-short-quotes",
        question: "Почему длинный отзыв должен начинаться с короткого жирного резюме?",
        principle: "Сканируемость контента (F-pattern reading).",
        badAlternative: "Выводить 3 абзаца сплошного мелкого текста.",
        consequence: "Посетители пролистывают сплошной текст, не читая. Короткий акцент зацепляет внимание 80% пользователей.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "social-proof-design",
        title: "Social Proof Architecture & Trust Triggers",
        level: "junior",
        description: "Оформление кейсов и отзывов для максимального доверия аудитории.",
      },
    ],
    promptVariables: [
      {
        id: "cardCount",
        label: "Количество отзывов",
        defaultValue: "3-cards",
        options: [
          { label: "3 карточки в один ряд", value: "3-cards" },
          { label: "6 карточек (сетка 2x3)", value: "6-cards" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Testimonials Grid)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует карточки отзывов в швейцарском стиле без скруглений.",
        promptText: `Создай переиспользуемый компонент TestimonialStack для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Раскладка: 3-колоночная сетка отзывов (grid-cols-1 md:grid-cols-3 gap-6).
2. В каждой карточке:
   - 5 желтых звезд рейтинга (Star fill-current)
   - Главная жирная мысль отзыва (font-bold)
   - Поясняющий текст впечатления
   - Автор: аватар (или инициалы в квадратной рамке), имя, роль ("AI-инженер", "Основатель сервиса").
3. Стиль: строго 0px border-radius, фон bg-bg-secondary, границы border-border, поддержка темной темы.`,
        negativePrompt: `Запрещено использовать круглые аватары или скругленные карточки.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Testimonial Grid Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

export function TestimonialStack() {
  const REVIEWS = [
    {
      highlight: 'Собрал и задеплоил первый SaaS за 3 вечера',
      quote: 'Раньше я терялся в тысячах настроек Next.js и базах данных. Маршрут ProektMap дал четкую пошаговую инструкцию без лишней теории.',
      author: 'Александр В.',
      role: 'Indie Hacker & Вайбкодер',
    },
    {
      highlight: 'Качество промптов на порядок выше обычного чата',
      quote: 'Слой WHY и Negative Prompt сэкономили мне десятки часов правок кода в Cursor. Все генерируется чисто с первого раза.',
      author: 'Михаил К.',
      role: 'Fullstack разработчик',
    },
    {
      highlight: 'Инженерная дисциплина в эпоху AI',
      quote: 'Здесь учат не просто нажимать Generate, а понимать архитектуру, z-index изоляцию и производительность.',
      author: 'Елена С.',
      role: 'Product Designer',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
          Что говорят инженеры о ProektMap
        </h2>
        <p className="text-sm text-text-secondary">
          Реальный опыт специалистов, которые перешли от хаотичного кодинга к системной сборке продуктов.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((rev, idx) => (
          <div
            key={idx}
            className="p-6 bg-bg-secondary border border-border flex flex-col justify-between"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 text-warning mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <h3 className="text-sm font-bold text-text-primary mb-2 leading-snug">
                «{rev.highlight}»
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {rev.quote}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border-light flex items-center gap-3">
              <div className="w-8 h-8 bg-accent text-white font-bold text-xs flex items-center justify-center">
                {rev.author[0]}
              </div>
              <div>
                <div className="text-xs font-bold text-text-primary">{rev.author}</div>
                <div className="text-[10px] font-mono text-text-tertiary">{rev.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "На смартфонах отзывы выстраиваются в аккуратную вертикальную колонку.",
    accessibilityNotes: "Семантичные цитаты и видимые текстовые метки авторов.",
    relatedPatterns: ["hero-editorial", "pricing-comparison"],
    recipes: ["saas-launch-hero", "service-landing-pro"],
  },
  {
    id: "logo-cloud",
    slug: "logo-cloud",
    title: "Monochrome Partner & Tech Stack Logo Grid",
    titleRu: "Монохромная сетка логотипов технологий и партнеров",
    shortDescription: "Аккуратный ряд логотипов стека или партнеров в монохромном исполнении с эффектом нормализации высоты и мягким hover-эффектом.",
    category: "content",
    kind: "component",
    tags: ["logos", "partners", "tech-stack", "social-proof", "monochrome", "trust"],
    difficulty: "beginner",
    badge: "Доверие",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Блок доверия, отображающий поддерживаемые технологии, фреймворки или логотипы компаний-партнеров в единой стилистике.",
      whereToUse: [
        "Сразу под первым экраном (Hero) для моментального социального подтверждения",
        "В разделах интеграций и поддерживаемых инструментов",
      ],
      whyItWorks: "Монохромная обработка убирает цветовую какофонию разных брендов, объединяя их в цельную премиальную композицию сайта.",
      commonMistakes: [
        "Разношерстные размеры логотипов (один гигантский, другой крошечный)",
        "Использование цветных логотипов, перетягивающих внимание от главного оффера",
      ],
    },
    anatomy: {
      summary: "Flex/Grid контейнер с max-height на логотипах, filter: grayscale(100%) и opacity: 0.6.",
      points: [
        {
          id: 1,
          title: "Монохромный фильтр (Grayscale)",
          cssRule: "filter: grayscale(100%); opacity: 0.65; transition: opacity 0.2s ease, filter 0.2s ease;",
          description: "Уравнивает визуальный вес разных брендов.",
          badge: "layout",
        },
        {
          id: 2,
          title: "Фиксированная высота (Height Normalization)",
          cssRule: "height: 28px; width: auto; object-fit: contain;",
          description: "Гарантирует геометрическую гармонию ряда.",
          badge: "responsive",
        },
      ],
    },
    why: [
      {
        id: "why-grayscale-logos",
        question: "Почему логотипы сторонних сервисов должны быть монохромными?",
        principle: "Визуальная иерархия и фокус на вашем бренде.",
        badAlternative: "Вставить оригинальные цветные SVG/PNG логотипы Google, Telegram, Stripe.",
        consequence: "Взгляд пользователя разрывается между 10 яркими цветами, сайт выглядит как пестрый базар, доверие падает.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "brand-normalization",
        title: "Logo Normalization & CSS Filter Management",
        level: "junior",
        description: "Гармонизация сторонних логотипов с дизайн-системой проекта.",
      },
    ],
    promptVariables: [
      {
        id: "layoutType",
        label: "Тип раскладки логотипов",
        defaultValue: "grid-5",
        options: [
          { label: "Сетка из 5-6 логотипов (Статичная)", value: "grid-5" },
          { label: "Компактная полоса с надписью 'Работает на базе'", value: "inline-bar" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Logo Cloud)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует чистый блок логотипов стека в монохроме.",
        promptText: `Создай переиспользуемый компонент LogoCloud для Next.js (TypeScript, Tailwind CSS).

Спецификация:
1. Заголовок над блоком: "РАЗРАБОТКА И ДЕПЛОЙ НА СТЕКЕ СЛЕДУЮЩЕГО ПОКОЛЕНИЯ" (font-mono text-xs text-text-tertiary uppercase tracking-widest text-center).
2. Сетка: 5 технологических брендов (Next.js, TypeScript, Prisma, PostgreSQL, Docker).
3. Визуальный стиль: монохромный (grayscale opacity-60 hover:opacity-100 hover:grayscale-0), высота h-7.
4. Стиль: строгий 0px radius, чистые разделители, поддержка темной темы.`,
        negativePrompt: `Не используй разноцветные логотипы по умолчанию.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Logo Cloud Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';

export function LogoCloud() {
  const TECH_STACK = [
    { name: 'Next.js 16', label: 'NEXT.JS' },
    { name: 'TypeScript', label: 'TYPESCRIPT' },
    { name: 'Prisma ORM', label: 'PRISMA' },
    { name: 'PostgreSQL', label: 'POSTGRESQL' },
    { name: 'Tailwind CSS', label: 'TAILWIND' },
    { name: 'Docker', label: 'DOCKER' },
  ];

  return (
    <section className="py-12 px-4 border-b border-border-light bg-bg-primary">
      <div className="max-w-6xl mx-auto">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-text-tertiary mb-8">
          Технологический стек платформы
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="h-10 px-4 flex items-center justify-center border border-border bg-bg-secondary text-text-secondary font-mono text-xs font-bold tracking-wider hover:text-text-primary hover:border-accent transition-all cursor-default w-full text-center"
            >
              {tech.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "Сетка автоматически масштабируется от 2 колонок на мобилках до 6 на десктопе.",
    accessibilityNotes: "Текстовые лейблы для каждого элемента для доступности скринридерами.",
    relatedPatterns: ["hero-editorial", "bento-grid-features"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "faq-accordion",
    slug: "faq-accordion",
    title: "Accessible FAQ Accordion with Smooth Disclosure",
    titleRu: "Доступный аккордеон часто задаваемых вопросов (FAQ)",
    shortDescription: "Раздел ответов на частые вопросы с поддержкой клавиатурной навигации (Enter/Space), плавным раскрытием ответов и возможностью открыть только один пункт за раз.",
    category: "components",
    kind: "component",
    tags: ["faq", "accordion", "disclosure", "accessibility", "keyboard", "questions"],
    difficulty: "beginner",
    badge: "Конверсия",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Компактный список раскрывающихся вопросов и ответов для закрытия финальных сомнений пользователя.",
      whereToUse: [
        "В нижней части посадочных страниц и тарифов",
        "В центрах поддержки и базах знаний",
      ],
      whyItWorks: "Экономит 70% площади экрана, позволяя посетителю быстро найти ответ именно на свой персональный вопрос.",
      commonMistakes: [
        "Недоступность с клавиатуры (использование div вместо button)",
        "Дерганая анимация высоты без css-перехода",
      ],
    },
    anatomy: {
      summary: "Список элементов button с aria-expanded и раскрывающимся контейнером ответа с overflow: hidden.",
      points: [
        {
          id: 1,
          title: "Семантический триггер кнопки",
          cssRule: "<button aria-expanded={isOpen} aria-controls={`faq-answer-${id}`}>",
          description: "Скринридеры озвучивают состояние раскрытия пункта.",
          badge: "accessibility",
        },
        {
          id: 2,
          title: "Индикатор состояния (+ / -)",
          cssRule: "transform: isOpen ? rotate(45deg) : rotate(0deg); transition: transform 0.2s ease;",
          description: "Наглядная иконка изменения состояния.",
          badge: "animation",
        },
      ],
    },
    why: [
      {
        id: "why-button-trigger",
        question: "Почему триггер FAQ обязан быть тегом <button>, а не <div>?",
        principle: "Стандарты доступности WAI-ARIA (Accordion Pattern).",
        badAlternative: "<div onClick={toggle}>Вопрос</div>.",
        consequence: "Пользователи без мыши не могут переключаться табом (Tab) и нажимать Enter/Space.",
        impactTag: "accessibility",
      },
    ],
    skills: [
      {
        id: "aria-accordion",
        title: "WAI-ARIA Accordion Pattern & Keyboard Nav",
        level: "junior",
        description: "Создание полностью доступных интерфейсов раскрытия контента.",
      },
    ],
    promptVariables: [
      {
        id: "allowMultiple",
        label: "Режим раскрытия",
        defaultValue: "single-open",
        options: [
          { label: "Только один открытый вопрос (Single Accordion)", value: "single-open" },
          { label: "Несколько открытых одновременно (Multi-collapse)", value: "multi-open" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (FAQ Accordion)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует доступный аккордеон с ARIA-атрибутами и плавным раскрытием.",
        promptText: `Создай переиспользуемый компонент FAQAccordion для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Режим раскрытия: {allowMultiple}.
2. Список из 4-5 ключевых вопросов о продукте ProektMap (Как начать, Нужен ли опыт в коде, Что входит в Pro).
3. Доступность: теги button, aria-expanded, aria-controls, управление с клавиатуры.
4. Стиль: строгий 0px radius, фон bg-bg-secondary, границы border-border, акцентный плюс/минус при раскрытии.`,
        negativePrompt: `Не используй rounded классы. Не заменяй button на div.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React FAQ Accordion Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'Нужен ли мне опыт в классическом программировании?',
      a: 'Нет. Все маршруты ProektMap разработаны для AI-инженеров и вайбкодеров. Мы даем готовый проверенный стек, команды терминала и точные промпты для AI-агентов.',
    },
    {
      q: 'Чем ProektMap отличается от обычных сборников промптов?',
      a: 'Мы храним не абстрактный текст, а инженерные маршруты с контролем архитектуры, z-index изоляцией, проверками Definition of Done и защитой от галлюцинаций моделей.',
    },
    {
      q: 'Могу ли я запускать коммерческие проекты для клиентов?',
      a: 'Да. Все созданные по нашим шаблонам и паттернам сервисы принадлежат вам без лицензионных ограничений.',
    },
    {
      q: 'Как работает подписка Pro?',
      a: 'Pro открывает неограниченный доступ ко всем 20+ готовым решениям, AI-консультанту и полному UI-Атласу. Оплата через ЮKassa без скрытых автосписаний.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-text-primary mb-3">
          Часто задаваемые вопросы
        </h2>
        <p className="text-sm text-text-secondary">
          Все, что нужно знать перед началом работы с платформой
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-border bg-bg-secondary overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={\`faq-answer-\${idx}\`}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-text-primary hover:text-accent transition-colors"
              >
                <span>{faq.q}</span>
                <Plus
                  className={\`w-4 h-4 text-accent shrink-0 transition-transform duration-200 \${
                    isOpen ? 'rotate-45' : 'rotate-0'
                  }\`}
                />
              </button>

              {isOpen && (
                <div
                  id={\`faq-answer-\${idx}\`}
                  className="px-5 pb-5 text-xs text-text-secondary leading-relaxed border-t border-border-light pt-3"
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "Полная ширина на мобилках с удобным увеличенным тач-таргетом кнопки.",
    accessibilityNotes: "Строгое соответствие спецификации WAI-ARIA Accordion.",
    relatedPatterns: ["pricing-comparison", "testimonial-stack"],
    recipes: ["service-landing-pro"],
  },
  {
    id: "feature-comparison",
    slug: "feature-comparison",
    title: "Side-by-Side Matrix & Feature Comparison Table",
    titleRu: "Сравнительная матрица возможностей (ProektMap vs Другие)",
    shortDescription: "Наглядная таблица построчного сравнения вашего продукта с классическим подходом или конкурентами с понятными чекбоксами и акцентной подсветкой.",
    category: "content",
    kind: "component",
    tags: ["comparison", "matrix", "table", "versus", "competitors", "features"],
    difficulty: "intermediate",
    badge: "Конверсия",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Табличный блок аргументации «Мы против классического пути», наглядно демонстрирующий экономию времени и денег.",
      whereToUse: [
        "Лендинги с сильным конкурентным преимуществом",
        "Продуктовые страницы сравнения альтернатив",
      ],
      whyItWorks: "Снимает возражение «Зачем мне платить вам, если я могу сделать сам по туториалам на YouTube?».",
      commonMistakes: [
        "Неадаптивная таблица с горизонтальным скроллом на смартфонах без пояснений",
        "Агрессивное принижение конкурентов вместо честного сравнения фактов",
      ],
    },
    anatomy: {
      summary: "Семантическая разметка <table> с колонками «Критерий», «Классический путь», «ProektMap AI».",
      points: [
        {
          id: 1,
          title: "Акцентная колонка продукта",
          cssRule: "background: var(--color-accent-light); border-left: 2px solid var(--color-accent);",
          description: "Фокусирует взгляд на победных характеристиках.",
          badge: "layout",
        },
      ],
    },
    why: [
      {
        id: "why-clear-contrast",
        question: "Почему важно сравнивать не с прямыми брендами, а с «Традиционным подходом»?",
        principle: "Позиционирование новой категории продукта.",
        badAlternative: "Указывать конкретные названия мелких конкурентов.",
        consequence: "Вы рекламируете чужие сервисы и рискуете юридическими претензиями.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "matrix-positioning",
        title: "Product Matrix Positioning & Value Tables",
        level: "middle",
        description: "Убедительное табличное позиционирование ценности продукта.",
      },
    ],
    promptVariables: [
      {
        id: "columnsCount",
        label: "Формат сравнения",
        defaultValue: "vs-classic",
        options: [
          { label: "ProektMap vs Традиционный кодинг", value: "vs-classic" },
          { label: "3 тарифа ProektMap (Free vs Pro vs Team)", value: "vs-tiers" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Feature Comparison)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует сравнительную матрицу возможностей в швейцарском стиле.",
        promptText: `Создай переиспользуемый компонент FeatureComparison для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Формат: {columnsCount}.
2. Критерии: Время запуска (3 вечера vs 2 месяца), Стоимость (990₽ vs 150 000₽), Архитектура (Готовый стек vs Месяцы поиска), База данных (Готовый Prisma-сетап vs Ошибки миграций).
3. Визуальный стиль: строгая таблица 0px radius, четкие границы border-border, акцентная колонка ProektMap.`,
        negativePrompt: `Не используй скругления. Обеспечь адаптивность на мобилках.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Comparison Table Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export function FeatureComparison() {
  const ROWS = [
    {
      feature: 'Скорость запуска MVP',
      classic: '1-3 месяца поиска решений',
      proektmap: '2-3 вечера по готовому маршруту',
      win: true,
    },
    {
      feature: 'Стоимость разработки',
      classic: 'От 150 000 ₽ найм студии',
      proektmap: '990 ₽ подписка Pro',
      win: true,
    },
    {
      feature: 'Стек и архитектура',
      classic: 'Случайный набор библиотек',
      proektmap: 'Проверенный Next.js 16 + Prisma 7',
      win: true,
    },
    {
      feature: 'Защита от сбоев БД',
      classic: 'Ручные ошибки миграций',
      proektmap: 'Вшитый seed.ts + безопасные скрипты',
      win: true,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-text-primary mb-3">
          Почему инженеры выбирают ProektMap
        </h2>
        <p className="text-sm text-text-secondary">
          Сравнение классического хаотичного подхода и системного AI-инжиниринга
        </p>
      </div>

      <div className="overflow-x-auto border border-border bg-bg-secondary">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-bg-tertiary">
              <th className="p-4 font-bold text-text-primary w-2/5">Критерий</th>
              <th className="p-4 font-bold text-text-secondary w-3/10">Обычный путь</th>
              <th className="p-4 font-bold text-accent bg-accent/10 border-l border-accent w-3/10">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ProektMap</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {ROWS.map((row, idx) => (
              <tr key={idx} className="hover:bg-bg-primary/50 transition-colors">
                <td className="p-4 font-semibold text-text-primary">{row.feature}</td>
                <td className="p-4 text-text-secondary">{row.classic}</td>
                <td className="p-4 font-bold text-text-primary bg-accent/5 border-l border-accent">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>{row.proektmap}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "Контейнер с overflow-x-auto для плавного скролла таблицы на экранах смартфонов.",
    accessibilityNotes: "Семантичные теги table, thead, tbody, th, td.",
    relatedPatterns: ["pricing-comparison", "hero-editorial"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "floating-action-cta",
    slug: "floating-action-cta",
    title: "Sticky Bottom Floating CTA Conversion Bar",
    titleRu: "Фиксированная конверсионная плашка действия (Sticky CTA Bar)",
    shortDescription: "Всплывающая снизу плашка с кратким оффером и кнопкой быстрого перехода, которая появляется только после прокрутки первого экрана.",
    category: "ux-patterns",
    kind: "interaction",
    tags: ["sticky-bar", "cta", "floating", "conversion", "scroll-trigger", "lead-gen"],
    difficulty: "intermediate",
    badge: "Конверсия",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Компактная плавающая полоса внизу экрана, возвращающая пользователя к целевому действию в любой точке длинного лендинга.",
      whereToUse: [
        "Длинные лонгриды, статьи базы знаний и лендинги готовых решений",
        "Страницы с высокой глубиной скролла",
      ],
      whyItWorks: "Пользователю не нужно скроллить 5000px обратно наверх, чтобы купить или нажать «Начать».",
      commonMistakes: [
        "Появление плашки сразу на первом экране (перекрывает контент Hero)",
        "Отсутствие кнопки закрытия (крестика) для раздраженных пользователей",
      ],
    },
    anatomy: {
      summary: "Фиксированная плашка fixed bottom-4 right-4 max-w-md с проверкой scrollY > 400px и кнопкой Close.",
      points: [
        {
          id: 1,
          title: "Скролл-триггер (Scroll Trigger)",
          cssRule: "transform: isVisible ? translateY(0) : translateY(100px); opacity: isVisible ? 1 : 0;",
          description: "Плавное всплытие снизу только после ухода с Hero-секции.",
          badge: "animation",
        },
      ],
    },
    why: [
      {
        id: "why-dismissable-cta",
        question: "Почему у плавающей плашки обязательно должна быть кнопка закрытия?",
        principle: "Уважение к пространству экрана пользователя.",
        badAlternative: "Заблокировать нижнюю часть экрана намертво без возможности скрыть.",
        consequence: "Пользователи на небольших ноутбуках будут раздражаться перекрытым текстом и покинут сайт.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "sticky-cta-architecture",
        title: "Conversion Triggering & Dismiss State",
        level: "junior",
        description: "Управление контекстными конверсионными триггерами.",
      },
    ],
    promptVariables: [
      {
        id: "ctaPosition",
        label: "Позиция плашки",
        defaultValue: "bottom-right",
        options: [
          { label: "Плавающая карточка справа (Bottom Right)", value: "bottom-right" },
          { label: "Полоса на всю ширину (Full Bottom Bar)", value: "bottom-bar" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Floating Action CTA)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Создает умную конверсионную плашку с запоминанием закрытия.",
        promptText: `Создай переиспользуемый компонент FloatingActionCTA для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Позиция: {ctaPosition}.
2. Логика появления: появляется только при scrollY > 500px, плавная анимация transition-all.
3. Элементы: иконка молнии, оффер "Готовы запустить свой AI-продукт?", кнопка действия и крестик закрытия.
4. Стиль: строгий 0px radius, bg-bg-secondary border border-accent shadow-xl.`,
        negativePrompt: `Не используй rounded углы.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Floating Action CTA Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState, useEffect } from 'react';
import { Zap, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function FloatingActionCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-bg-secondary border-2 border-accent p-4 shadow-2xl transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <span>Готовое решение</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-text-tertiary hover:text-text-primary p-1"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-text-primary font-bold mt-2">
        Запустите собственный SaaS-сервис уже в эти выходные.
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/resheniya"
          className="flex-1 py-2 px-3 bg-accent text-white text-xs font-bold text-center border border-accent hover:opacity-90 flex items-center justify-center gap-1.5"
        >
          <span>Смотреть маршрут</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}`,
      },
    ],
    responsiveNotes: "На узких мобильных экранах закрепляется по нижней кромке с отступами 8px.",
    accessibilityNotes: "Кнопка закрытия с доступным aria-label.",
    relatedPatterns: ["floating-social-dock", "hero-editorial"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "announcement-bar",
    slug: "announcement-bar",
    title: "Dismissable Top Announcement Bar with Action Link",
    titleRu: "Информационная полоса уведомлений в топе сайта",
    shortDescription: "Верхняя акцентная строка для анонсов новых релизов, скидок или вебинаров с кнопкой перехода и возможностью закрытия.",
    category: "components",
    kind: "component",
    tags: ["announcement", "banner", "top-bar", "notification", "promo", "release"],
    difficulty: "beginner",
    badge: "Внимание",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Самая верхняя строка сайта над шапкой для привлечения внимания к важным обновлениям.",
      whereToUse: [
        "Анонсы крупных обновлений платформы (например, релиз нового раздела готовых решений)",
        "Специальные предложения и ограниченные по времени промо-акции",
      ],
      whyItWorks: "Первая строчка, которую видит пользователь до начала чтения страницы.",
      commonMistakes: [
        "Слишком высокая плашка, съедающая полезную высоту первого экрана",
        "Агрессивные мигающие цвета, раздражающие постоянных пользователей",
      ],
    },
    anatomy: {
      summary: "Компактная полоса height: 36px с flex выравниванием, ссылкой и крестиком закрытия.",
      points: [
        {
          id: 1,
          title: "Компактная высота",
          cssRule: "height: 36px; display: flex; align-items: center; justify-content: center;",
          description: "Не смещает первый экран вниз слишком сильно.",
          badge: "layout",
        },
      ],
    },
    why: [
      {
        id: "why-subtle-top-bar",
        question: "Почему верхний анонс не должен быть выше 40px?",
        principle: "Сохранение видимости первого экрана (Above the Fold).",
        badAlternative: "Сделать огромный баннер 100px над меню.",
        consequence: "Заголовок H1 и кнопка CTA на ноутбуках с экраном 1366x768 уезжают за пределы видимости без скролла.",
        impactTag: "ux",
      },
    ],
    skills: [
      {
        id: "top-announcement-design",
        title: "Above-the-fold Optimization & Banner UX",
        level: "junior",
        description: "Оптимизация верхних информационных полос.",
      },
    ],
    promptVariables: [
      {
        id: "bannerTone",
        label: "Тональность анонса",
        defaultValue: "accent-glow",
        options: [
          { label: "Акцентный (Accent Background)", value: "accent-glow" },
          { label: "Строгий темный с тонкой рамкой", value: "dark-border" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Top Announcement Bar)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует аккуратную полосу анонса в самом верху сайта.",
        promptText: `Создай переиспользуемый компонент AnnouncementBar для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Позиция: самый верх страницы (над Sticky Header).
2. Тональность: {bannerTone}.
3. Элементы: значок искры Sparkles, текст "Новый релиз: Добавлено 15 готовых UI-паттернов для AI", ссылка со стрелкой и кнопка закрытия.
4. Стиль: строгий 0px radius, компактная высота h-9, поддержка светлой/темной темы.`,
        negativePrompt: `Не делай баннер выше 40px. Не используй rounded классы.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Announcement Bar Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementBar() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="bg-accent text-white text-xs font-semibold py-2 px-4 border-b border-accent flex items-center justify-between">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-1 text-center">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>Новый релиз: Открыт интерактивный UI-Атлас для AI-инженеров</span>
        <Link
          href="/ui-patterns"
          className="underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-1 font-bold ml-2"
        >
          <span>Смотреть</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <button
        onClick={() => setClosed(true)}
        className="text-white/80 hover:text-white p-1 shrink-0"
        aria-label="Закрыть уведомление"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}`,
      },
    ],
    responsiveNotes: "На смартфонах текст сокращается или центрируется без переноса на 3 строки.",
    accessibilityNotes: "Кнопка закрытия с aria-label.",
    relatedPatterns: ["sticky-glass-header", "hero-editorial"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "logo-marquee",
    slug: "logo-marquee",
    title: "Infinite Hardware-Accelerated Logo Marquee",
    titleRu: "Бесконечная бегущая строка логотипов и технологий (Marquee)",
    shortDescription: "Плавная бесконечная бегущая строка на чистом CSS с аппаратным ускорением (GPU), паузой при наведении курсора и мягким затуханием по краям (mask-image).",
    category: "effects",
    kind: "effect",
    tags: ["marquee", "infinite-scroll", "gpu", "animation", "mask-image", "logos"],
    difficulty: "intermediate",
    badge: "Эффект",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Динамическая непрерывная лента с логотипами клиентов, инструментов или ключевыми фразами, движущаяся горизонтально без рывков.",
      whereToUse: [
        "Разделительные блоки между секциями на продуктовых лендингах",
        "Блоки доверия с большим числом брендов (15+ штук)",
      ],
      whyItWorks: "Создает ощущение живого, динамичного и популярного продукта при минимальной нагрузке на процессор.",
      commonMistakes: [
        "Использование JS requestAnimationFrame/setInterval вместо CSS translate3d",
        "Отсутствие mask-image, из-за чего логотипы резко обрезаются о край экрана",
      ],
    },
    anatomy: {
      summary: "Двойной дублированный ряд элементов с CSS-анимацией translateX(-50%) и mask-image: linear-gradient.",
      points: [
        {
          id: 1,
          title: "Градиентная маска по краям (Mask Fade)",
          cssRule: "mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);",
          description: "Создает премиальный эффект растворения логотипов у границ экрана.",
          badge: "layout",
        },
        {
          id: 2,
          title: "GPU Аппаратное ускорение",
          cssRule: "will-change: transform; transform: translate3d(0, 0, 0);",
          description: "Обеспечивает стабильные 60-120 FPS без лагов на смартфонах.",
          badge: "animation",
        },
      ],
    },
    why: [
      {
        id: "why-css-marquee",
        question: "Почему бесконечная строка должна быть строго на CSS-анимации, а не на JS-скрипте?",
        principle: "Разгрузка основного потока браузера (Main Thread offloading).",
        badAlternative: "Двигать координаты элементов через React useEffect и useState(x => x + 1).",
        consequence: "Любой тяжелый рендер на странице вызовет микрозависание строки, анимация будет дергаться.",
        impactTag: "performance",
      },
    ],
    skills: [
      {
        id: "hardware-acceleration",
        title: "GPU CSS Animations & Composite Layers",
        level: "middle",
        description: "Настройка сверхплавных анимаций без layout-thrashing.",
      },
    ],
    promptVariables: [
      {
        id: "speed",
        label: "Скорость движения",
        defaultValue: "medium",
        options: [
          { label: "Умеренная (30s полный цикл)", value: "medium" },
          { label: "Быстрая (15s полный цикл)", value: "fast" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Logo Marquee)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует GPU-ускоренный marquee с маской затухания.",
        promptText: `Создай переиспользуемый компонент LogoMarquee для Next.js (TypeScript, Tailwind CSS).

Спецификация:
1. Анимация: бесконечный чистый CSS @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } с длительностью {speed}.
2. Остановка: pause-on-hover (hover:animation-play-state: paused).
3. Градиентные края: маска mask-image для мягкого растворения по бокам.
4. Контент: 8 технологических брендов, сдублированных 2 раза для бесшовности.
5. Стиль: строго 0px radius, монохромный фильтр.`,
        negativePrompt: `Не используй тяжелые JS библиотеки (framer-motion).`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Marquee Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';

export function LogoMarquee() {
  const ITEMS = [
    'NEXT.JS 16',
    'POSTGRESQL',
    'PRISMA 7',
    'DEEPSEEK V3',
    'CLAUDE 3.7',
    'CURSOR IDE',
    'DOCKER',
    'TAILWIND',
  ];

  return (
    <div className="w-full py-8 overflow-hidden bg-bg-secondary border-y border-border relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
        {[...ITEMS, ...ITEMS].map((item, idx) => (
          <div
            key={idx}
            className="mx-6 px-4 py-2 border border-border bg-bg-primary text-text-secondary font-mono text-xs font-bold tracking-widest uppercase hover:text-accent hover:border-accent transition-colors cursor-default"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}`,
      },
    ],
    responsiveNotes: "Работает адаптивно на любых разрешениях, маска предотвращает вылеты за границы экрана.",
    accessibilityNotes: "Остановка анимации при наведении и учет prefers-reduced-motion.",
    relatedPatterns: ["logo-cloud", "hero-editorial"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "responsive-gallery",
    slug: "responsive-gallery",
    title: "Adaptive Masonry & Multi-Column Image Grid",
    titleRu: "Адаптивная контентная галерея артефактов (Masonry Grid)",
    shortDescription: "Сетка скриншотов и результатов генераций с разной высотой карточек, всплывающими деталями при наведении и фильтрацией по категориям.",
    category: "content",
    kind: "component",
    tags: ["gallery", "masonry", "grid", "showcase", "lightbox", "portfolio"],
    difficulty: "intermediate",
    badge: "Галерея",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Визуальная витрина скриншотов готовых интерфейсов, графиков или дизайн-макетов.",
      whereToUse: [
        "Портфолио выполненных проектов и галерея сгенерированных AI экранов",
        "Каталоги визуальных шаблонов",
      ],
      whyItWorks: "Плотная раскладка без пустот показывает разнообразие и богатство готовых результатов.",
      commonMistakes: [
        "Одинаковые квадратные плашки, обрезающие реальные пропорции экранов",
      ],
    },
    anatomy: {
      summary: "CSS Columns / Grid с break-inside: avoid для предотвращения разрыва карточек.",
      points: [
        {
          id: 1,
          title: "Защита от разрыва элементов",
          cssRule: "break-inside: avoid; margin-bottom: 16px;",
          description: "Карточка всегда рендерится целиком без разделения между колонками.",
          badge: "layout",
        },
      ],
    },
    why: [
      {
        id: "why-css-columns",
        question: "Почему для Masonry-галереи лучше использовать CSS Columns вместо тяжелых JS библиотек?",
        principle: "Производительность и отсутствие прыжков контента (CLS).",
        badAlternative: "Вычислять абсолютные координаты (top/left) на JavaScript при скролле.",
        consequence: "При медленном интернете сайт тормозит при загрузке каждой картинки.",
        impactTag: "layout-stability",
      },
    ],
    skills: [
      {
        id: "css-columns-layout",
        title: "CSS Multi-Column Layout & Break Control",
        level: "junior",
        description: "Построение плотных динамических сеток без JavaScript.",
      },
    ],
    promptVariables: [
      {
        id: "columnsCount",
        label: "Число колонок",
        defaultValue: "3-cols",
        options: [
          { label: "3 колонки на десктопе", value: "3-cols" },
          { label: "4 колонки на широком экране", value: "4-cols" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Responsive Gallery)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует легкую галерею на CSS Columns без внешних скриптов.",
        promptText: `Создай переиспользуемый компонент ResponsiveGallery для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Раскладка: CSS multi-column (columns-1 sm:columns-2 lg:columns-3 gap-4).
2. Карточки: break-inside-avoid, строгий 0px radius, граница border-border, бейдж категории.
3. Hover: легкое затемнение и появление кнопки "Открыть детали".`,
        negativePrompt: `Не используй сторонние библиотеки типа isotope или masonry-js.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Masonry Gallery Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

export function ResponsiveGallery() {
  const ITEMS = [
    { title: 'Дашборд аналитики SaaS', tag: 'SaaS App', h: 'h-64' },
    { title: 'Лендинг AI-агентов', tag: 'Landing', h: 'h-48' },
    { title: 'Мобильный интерфейс бота', tag: 'Mobile', h: 'h-80' },
    { title: 'Тарифная матрица Pro', tag: 'Billing', h: 'h-52' },
    { title: 'Виджет согласия 152-ФЗ', tag: 'Widget', h: 'h-40' },
    { title: 'Bento-сетка преимуществ', tag: 'Layout', h: 'h-60' },
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {ITEMS.map((item, idx) => (
          <div
            key={idx}
            className={\`mb-4 break-inside-avoid border border-border bg-bg-secondary p-5 flex flex-col justify-between group hover:border-accent transition-colors \${item.h}\`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-accent bg-accent/10 px-2 py-0.5 border border-accent">
                {item.tag}
              </span>
              <ExternalLink className="w-4 h-4 text-text-tertiary group-hover:text-text-primary transition-colors" />
            </div>

            <div>
              <h4 className="font-bold text-sm text-text-primary mt-4">{item.title}</h4>
              <p className="text-xs text-text-secondary mt-1">Готовый сгенерированный артефакт</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "Автоматически схлопывается в одну колонку на экранах телефонов.",
    accessibilityNotes: "Фокусные состояния на интерактивных карточках.",
    relatedPatterns: ["bento-grid-features", "hero-editorial"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "before-after-slider",
    slug: "before-after-slider",
    title: "Interactive Before / After Comparison Slider",
    titleRu: "Интерактивный слайдер сравнения До / После",
    shortDescription: "Ползунок для попиксельного сравнения двух состояний (сырой код vs отполированный интерфейс, до рефакторинга vs после).",
    category: "content",
    kind: "component",
    tags: ["before-after", "slider", "comparison", "interactive", "showcase", "visual-diff"],
    difficulty: "intermediate",
    badge: "Интерактив",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Интерактивный компонент с вертикальным разделителем, позволяющий пользователю плавно перетягивать границу между двумя слоями.",
      whereToUse: [
        "Демонстрация результатов редизайна или оптимизации скорости",
        "Сравнение 'До внедрения AI' и 'После запуска автоматизации'",
      ],
      whyItWorks: "Дает пользователю физическое ощущение контроля и наглядно доказывает контраст изменений.",
      commonMistakes: [
        "Отсутствие поддержки Touch-событий на смартфонах (работает только от мыши)",
      ],
    },
    anatomy: {
      summary: "Два наложенных абсолютно слоя с clip-path: inset() или width: percentage и range input / touch handler.",
      points: [
        {
          id: 1,
          title: "Клипирование верхнего слоя",
          cssRule: "clip-path: polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%);",
          description: "Обрезает верхнее изображение точно по линии ползунка.",
          badge: "layout",
        },
      ],
    },
    why: [
      {
        id: "why-clip-path",
        question: "Почему для слайдера лучше использовать clip-path polygon, а не смену width контейнера?",
        principle: "Изоляция внутренних элементов от сжатия.",
        badAlternative: "Уменьшать width левой колонки с overflow: hidden.",
        consequence: "Внутренний текст и картинки начнут ломаться и сжиматься при движении ползунка.",
        impactTag: "layout-stability",
      },
    ],
    skills: [
      {
        id: "clip-path-interactions",
        title: "CSS Clip-Path & Pointer Events Calculation",
        level: "middle",
        description: "Математика позиционирования интерактивных масок.",
      },
    ],
    promptVariables: [
      {
        id: "startPosition",
        label: "Начальное положение ползунка",
        defaultValue: "50-percent",
        options: [
          { label: "По центру (50%)", value: "50-percent" },
          { label: "Слева (30%)", value: "30-percent" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Before After Slider)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Создает слайдер До/После с поддержкой мыши и тач-жестов.",
        promptText: `Создай переиспользуемый компонент BeforeAfterSlider для Next.js (TypeScript, Tailwind CSS).

Спецификация:
1. Интерактив: перетягивание ползунка мышью и тачем (PointerEvents).
2. Слой 1 (До): Старый хаотичный код без архитектуры.
3. Слой 2 (После): Чистая архитектура ProektMap с токенами и 0px радиусами.
4. Разделитель: тонкая линия 2px var(--color-accent) с бейджем по центру.
5. Стиль: строго 0px radius, четкие границы.`,
        negativePrompt: `Не используй сторонние библиотеки слайдеров.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Before/After Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState } from 'react';

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  return (
    <div
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className="relative w-full max-w-3xl mx-auto h-80 border-2 border-border bg-bg-secondary select-none cursor-ew-resize overflow-hidden"
    >
      {/* Layer After (Background) */}
      <div className="absolute inset-0 p-8 flex flex-col justify-center bg-bg-primary">
        <span className="text-xs font-mono font-bold text-accent uppercase mb-2">● ПОСЛЕ (PROEKTMAP ARCHITECTURE)</span>
        <h3 className="text-2xl font-extrabold text-text-primary">Готовый чистый результат за 3 вечера</h3>
        <p className="text-xs text-text-secondary mt-2">Строгие токены, z-index изоляция, 0 ошибок гидратации.</p>
      </div>

      {/* Layer Before (Clipped) */}
      <div
        className="absolute inset-0 p-8 flex flex-col justify-center bg-bg-tertiary border-r-2 border-accent"
        style={{ clipPath: \`polygon(0 0, \${position}% 0, \${position}% 100%, 0 100%)\` }}
      >
        <span className="text-xs font-mono font-bold text-text-tertiary uppercase mb-2">✕ ДО (ХАОТИЧНЫЙ КОДИНГ)</span>
        <h3 className="text-2xl font-extrabold text-text-primary opacity-60">Месяцы правок и сбоев сервера</h3>
        <p className="text-xs text-text-secondary mt-2 opacity-60">Случайные промпты, конфликты стилей и 404 ошибки.</p>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-accent pointer-events-none"
        style={{ left: \`\${position}%\` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 py-1 bg-accent text-white font-mono text-[10px] font-bold uppercase shadow-lg">
          ◄ ►
        </div>
      </div>
    </div>
  );
}`,
      },
    ],
    responsiveNotes: "Полная поддержка тач-событий на мобильных устройствах.",
    accessibilityNotes: "Возможность управления с клавиатуры стрелками влево/вправо.",
    relatedPatterns: ["feature-comparison", "responsive-gallery"],
    recipes: ["service-landing-pro"],
  },
  {
    id: "scroll-reveal",
    slug: "scroll-reveal",
    title: "Lightweight CSS Scroll-Driven Reveal Animations",
    titleRu: "Легкие скролл-анимации появления блоков (Scroll Reveal)",
    shortDescription: "Мягкое появление контента при попадании в зону видимости экрана на базе IntersectionObserver без тяжелых внешних JS библиотек.",
    category: "effects",
    kind: "effect",
    tags: ["scroll-reveal", "intersection-observer", "fade-in", "performance", "lightweight"],
    difficulty: "beginner",
    badge: "Эффект",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Техника постепенного проявления карточек и секций при прокрутке страницы пользователем.",
      whereToUse: [
        "Все посадочные страницы для добавления премиального ощущения качества",
      ],
      whyItWorks: "Фокусирует взгляд на появляющемся блоке, снижая ощущение информационной перегрузки.",
      commonMistakes: [
        "Слишком медленная анимация (дольше 0.4s), заставляющая пользователя ждать текст",
      ],
    },
    anatomy: {
      summary: "Хук useInView на базе IntersectionObserver + CSS transition: opacity, transform.",
      points: [
        {
          id: 1,
          title: "Смещение и прозрачность",
          cssRule: "opacity: isVisible ? 1 : 0; transform: isVisible ? 'translateY(0)' : 'translateY(24px)';",
          description: "Плавное движение вверх при появлении.",
          badge: "animation",
        },
      ],
    },
    why: [
      {
        id: "why-native-observer",
        question: "Почему IntersectionObserver лучше события window.onscroll?",
        principle: "Асинхронная проверка видимости в фоновом потоке браузера.",
        badAlternative: "Вычислять getBoundingClientRect() на каждом пикселе скролла.",
        consequence: "Вызывает принудительный перерасчет разметки (reflow) и лаги страницы.",
        impactTag: "performance",
      },
    ],
    skills: [
      {
        id: "intersection-observer-api",
        title: "IntersectionObserver API & Lazy Rendering",
        level: "junior",
        description: "Оптимизация производительности рендера при скролле.",
      },
    ],
    promptVariables: [
      {
        id: "delay",
        label: "Каскадная задержка (Stagger)",
        defaultValue: "stagger-100",
        options: [
          { label: "Каскад по 100ms на карточку", value: "stagger-100" },
          { label: "Одновременное появление", value: "simultaneous" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Scroll Reveal)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует хук useScrollReveal и анимированные обертки.",
        promptText: `Создай переиспользуемый компонент ScrollReveal для Next.js (TypeScript, Tailwind CSS).

Спецификация:
1. Движок: IntersectionObserver с threshold: 0.15 и unobserve после первого срабатывания.
2. Анимация: duration-300 ease-out transition-all (opacity-0 translate-y-6 -> opacity-100 translate-y-0).
3. Каскадность: поддержка {delay} для сеток из нескольких элементов.
4. Стиль: строгий 0px radius.`,
        negativePrompt: `Не используй framer-motion или GSAP.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Scroll Reveal Hook & Wrapper",
        framework: "react-tailwind",
        code: `'use client';

import React, { useEffect, useRef, useState } from 'react';

export function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: \`\${delay}ms\` }}
      className={\`transition-all duration-300 ease-out \${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }\`}
    >
      {children}
    </div>
  );
}`,
      },
    ],
    responsiveNotes: "Мгновенно срабатывает на смартфонах без задержек.",
    accessibilityNotes: "Уважает prefers-reduced-motion медиа-запрос.",
    relatedPatterns: ["bento-grid-features", "hero-editorial"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "sticky-sidebar",
    slug: "sticky-sidebar",
    title: "Sticky Table of Contents & Documentation Sidebar",
    titleRu: "Фиксированное оглавление статьи и боковая панель (Sticky TOC)",
    shortDescription: "Боковая колонка с оглавлением статьи/документации, которая плавно фиксируется при скролле и подсвечивает текущий читаемый раздел.",
    category: "navigation",
    kind: "pattern",
    tags: ["sidebar", "toc", "sticky", "docs", "reading-progress", "navigation"],
    difficulty: "intermediate",
    badge: "Навигация",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Боковая навигационная панель для длинных технических статей, инструкций и готовых решений.",
      whereToUse: [
        "База знаний, документация API и маршруты решений ProektMap",
      ],
      whyItWorks: "Позволяет мгновенно ориентироваться в лонгриде на 15 000 знаков и перескакивать к нужному этапу.",
      commonMistakes: [
        "Использование fixed вместо sticky, из-за чего сайдбар наезжает на футер сайта",
      ],
    },
    anatomy: {
      summary: "Контейнер grid grid-cols-1 lg:grid-cols-[1fr_260px] с position: sticky top-24 на сайдбаре.",
      points: [
        {
          id: 1,
          title: "Ограничение высоты sticky",
          cssRule: "position: sticky; top: 96px; max-height: calc(100vh - 120px); overflow-y: auto;",
          description: "Сайдбар скроллится независимо, если пунктов меню много.",
          badge: "position",
        },
      ],
    },
    why: [
      {
        id: "why-sticky-bounds",
        question: "Почему сайдбар должен использовать sticky внутри родительского грида, а не fixed?",
        principle: "Изоляция прокрутки пределами родительской секции.",
        badAlternative: "Повесить position: fixed на сайдбар.",
        consequence: "В конце страницы сайдбар налезет на футер и перекроет копирайты и юридические ссылки.",
        impactTag: "layout-stability",
      },
    ],
    skills: [
      {
        id: "sticky-layout-bounds",
        title: "Sticky Contexts & Overflow Scrolling",
        level: "middle",
        description: "Корректная настройка сложных колоночных интерфейсов документации.",
      },
    ],
    promptVariables: [
      {
        id: "tocStyle",
        label: "Стиль индикатора активного пункта",
        defaultValue: "left-border",
        options: [
          { label: "Левая акцентная полоса 2px", value: "left-border" },
          { label: "Фоновая плашка (Pill)", value: "bg-pill" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Sticky TOC Sidebar)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Создает боковую колонку оглавления со scrollspy подсветкой.",
        promptText: `Создай переиспользуемый компонент StickySidebarTOC для Next.js (TypeScript, Tailwind CSS).

Спецификация:
1. Позиционирование: sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto.
2. Активный раздел: отслеживание через IntersectionObserver или scrollY.
3. Стиль: строгий 0px radius, мелкий шрифт 12px, левая граница border-l-2 border-accent у активного пункта.`,
        negativePrompt: `Не используй rounded углы. Сайдбар не должен наезжать на футер.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Sticky TOC Sidebar Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState } from 'react';

export function StickySidebarTOC() {
  const [activeId, setActiveId] = useState('stage-1');

  const HEADINGS = [
    { id: 'stage-1', title: '1. Архитектура и стек' },
    { id: 'stage-2', title: '2. Настройка базы данных' },
    { id: 'stage-3', title: '3. API эндпоинты' },
    { id: 'stage-4', title: '4. Подключение оплаты' },
    { id: 'stage-5', title: '5. Деплой на боевой сервер' },
  ];

  return (
    <aside className="hidden lg:block w-64 sticky top-24 self-start border-l border-border pl-4 py-2">
      <div className="font-mono text-[10px] uppercase font-bold text-text-tertiary tracking-wider mb-3">
        Оглавление маршрута
      </div>

      <nav className="space-y-2">
        {HEADINGS.map((h) => {
          const isActive = activeId === h.id;
          return (
            <button
              key={h.id}
              onClick={() => setActiveId(h.id)}
              className={\`block w-full text-left text-xs transition-colors \${
                isActive
                  ? 'font-bold text-accent border-l-2 border-accent -ml-[17px] pl-4'
                  : 'text-text-secondary hover:text-text-primary'
              }\`}
            >
              {h.title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}`,
      },
    ],
    responsiveNotes: "Автоматически скрывается на смартфонах и планшетах (hidden lg:block).",
    accessibilityNotes: "Семантический тег aside и nav с навигационными ссылками.",
    relatedPatterns: ["sticky-glass-header", "hero-editorial"],
    recipes: ["service-landing-pro"],
  },
  {
    id: "stacking-cards",
    slug: "stacking-cards",
    title: "Sticky Stacking Cards on Page Scroll",
    titleRu: "Каскадно накладывающиеся карточки этапов (Stacking Cards)",
    shortDescription: "Эффект, при котором карточки этапов последовательно накладываются друг на друга стопкой при скролле страницы вниз.",
    category: "effects",
    kind: "effect",
    tags: ["stacking-cards", "sticky", "scroll-effect", "steps", "stages", "awwwards"],
    difficulty: "advanced",
    badge: "Премиум",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Визуальный прием демонстрации последовательных шагов (Этап 1 -> Этап 2 -> Этап 3), где каждая новая карточка перекрывает предыдущую.",
      whereToUse: [
        "Презентации этапов разработки готового решения или этапов воронки",
      ],
      whyItWorks: "Удерживает внимание на процессе и превращает скучный список шагов в захватывающий визуальный сторителлинг.",
      commonMistakes: [
        "Неправильный расчет top отступа у каждой последующей карточки (top: 80px, top: 100px, top: 120px)",
      ],
    },
    anatomy: {
      summary: "Каждая карточка имеет position: sticky с возрастающим top-offset и z-index.",
      points: [
        {
          id: 1,
          title: "Каскадный отступ фиксации",
          cssRule: "position: sticky; top: calc(80px + ${index * 20}px); z-index: ${index + 1};",
          description: "Создает видимый край стопки предыдущих карточек.",
          badge: "position",
        },
      ],
    },
    why: [
      {
        id: "why-sticky-stack",
        question: "Почему стопку карточек можно собрать на чистом CSS sticky без Framer Motion?",
        principle: "Встроенные возможности современного браузерного движка раскладки.",
        badAlternative: "Использовать тяжелые JS скрипты с расчетом скролла.",
        consequence: "Высокий расход батареи на мобильных устройствах и просадка FPS.",
        impactTag: "performance",
      },
    ],
    skills: [
      {
        id: "css-sticky-stacking",
        title: "Sticky Stacking Contexts & Z-Index Ladders",
        level: "senior",
        description: "Построение кинематографичных скролл-эффектов на чистом CSS.",
      },
    ],
    promptVariables: [
      {
        id: "cardCount",
        label: "Количество шагов в стопке",
        defaultValue: "3-steps",
        options: [
          { label: "3 этапа разработки", value: "3-steps" },
          { label: "4 этапа разработки", value: "4-steps" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Stacking Cards)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует каскадные sticky-карточки этапов на чистом CSS.",
        promptText: `Создай переиспользуемый компонент StackingCards для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Эффект: карточки этапов (1. Архитектура, 2. Сборка, 3. Деплой) накладываются стопкой при скролле.
2. CSS формула: sticky top-[calc(5rem+index*1.5rem)] z-[index].
3. Карточка: строгий 0px radius, фон bg-bg-secondary, граница border-border shadow-2xl, номер этапа font-mono.`,
        negativePrompt: `Не используй внешние JS библиотеки анимации.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Stacking Cards Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';
import { Layers, Terminal, Rocket } from 'lucide-react';

export function StackingCards() {
  const STEPS = [
    {
      num: '01',
      title: 'Спроектировать архитектуру и схему БД',
      desc: 'Выбираем стек, проектируем Prisma-модели и исключаем конфликты z-index.',
      icon: Layers,
      color: 'text-accent',
    },
    {
      num: '02',
      title: 'Собрать рабочее ядро через AI-агентов',
      desc: 'Генерируем чистый код по проверенным промптам с защитой от галлюцинаций.',
      icon: Terminal,
      color: 'text-warning',
    },
    {
      num: '03',
      title: 'Задеплоить на боевой сервер с оплатой',
      desc: 'Настраиваем Nginx, PM2, ЮKassa и запускаем трафик клиентов.',
      icon: Rocket,
      color: 'text-accent',
    },
  ];

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto space-y-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-text-primary">3 шага к работающему продукту</h2>
      </div>

      <div className="space-y-8 relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              style={{
                top: \`calc(80px + \${idx * 24}px)\`,
                zIndex: idx + 1,
              }}
              className="sticky p-8 bg-bg-secondary border-2 border-border shadow-2xl flex items-start gap-6"
            >
              <div className="font-mono text-3xl font-black text-text-tertiary">{step.num}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={\`w-5 h-5 \${step.color}\`} />
                  <h3 className="text-lg font-bold text-text-primary">{step.title}</h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}`,
      },
    ],
    responsiveNotes: "Корректно работает на мобильных экранах с меньшим top-offset.",
    accessibilityNotes: "Понятная нумерация шагов для скринридеров.",
    relatedPatterns: ["scroll-reveal", "bento-grid-features"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "command-palette",
    slug: "command-palette",
    title: "Keyboard-Driven Command Palette (Cmd + K)",
    titleRu: "Командная строка быстрого поиска и действий (Cmd + K)",
    shortDescription: "Модальное окно быстрого поиска по сайту, готовым решениям и действиям с клавиатурными шорткатами (Cmd/Ctrl + K, стрелки, Enter, Escape).",
    category: "components",
    kind: "component",
    tags: ["command-palette", "cmd-k", "search", "shortcuts", "keyboard", "modal", "power-user"],
    difficulty: "advanced",
    badge: "Power-User",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Всплывающее окно быстрого поиска и командного управления в стиле Raycast/macOS Spotlight.",
      whereToUse: [
        "Сложные SaaS-приложения, инженерные платформы и базы знаний",
      ],
      whyItWorks: "Позволяет опытным пользователям перемещаться по сайту за 0.5 секунды без использования мыши.",
      commonMistakes: [
        "Отсутствие блокировки скролла подложки при открытии модального окна",
        "Неработающий шорткат на Windows (Ctrl+K вместо Cmd+K)",
      ],
    },
    anatomy: {
      summary: "Fixed backdrop overlay + диалоговое окно по центру + input с autoFocus + список с keyboard navigation.",
      points: [
        {
          id: 1,
          title: "Глобальный перехват шортката",
          cssRule: "if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsOpen(true); }",
          description: "Корректно работает и на macOS (Cmd), и на Windows/Linux (Ctrl).",
          badge: "accessibility",
        },
      ],
    },
    why: [
      {
        id: "why-trap-focus-palette",
        question: "Почему модальная командная палитра должна удерживать фокус внутри (Focus Trap)?",
        principle: "Доступность и предотвращение потери контекста.",
        badAlternative: "Оставить возможность табаться на элементы под оверлеем.",
        consequence: "Пользователь случайно нажмет скрытую кнопку на странице, пока ищет команду в палитре.",
        impactTag: "accessibility",
      },
    ],
    skills: [
      {
        id: "keyboard-shortcuts-engine",
        title: "Keyboard Event Interception & Focus Trapping",
        level: "senior",
        description: "Проектирование быстрых клавиатурных интерфейсов профессионального уровня.",
      },
    ],
    promptVariables: [
      {
        id: "themeMode",
        label: "Стиль палитры",
        defaultValue: "swiss-dark",
        options: [
          { label: "Швейцарский строгий монохром", value: "swiss-dark" },
          { label: "Светлый минимализм", value: "swiss-light" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Command Palette)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Создает Cmd+K командную палитру с поиском и клавиатурным управлением.",
        promptText: `Создай переиспользуемый компонент CommandPalette для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Вызов: шорткат Cmd+K (macOS) и Ctrl+K (Windows) + глобальная кнопка в шапке.
2. Функционал: фильтрация списка действий при вводе, навигация стрелками вверх/вниз, выбор по Enter, закрытие по Escape.
3. Категории: "Готовые решения", "UI-Паттерны", "Действия".
4. Стиль: строго 0px radius, фон bg-bg-secondary, граница border-border, фокусная акцентная строка.`,
        negativePrompt: `Не используй rounded углы. Обязательно добавь e.preventDefault() на Cmd+K.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Command Palette Component",
        framework: "react-tailwind",
        code: `'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Layers, ArrowRight, X } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-bg-secondary border-2 border-border shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg-primary">
          <Search className="w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по решениям, паттернам или действиям (Cmd+K)..."
            className="w-full bg-transparent text-xs text-text-primary focus:outline-none placeholder:text-text-tertiary"
          />
          <button onClick={() => setOpen(false)} className="text-text-tertiary hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-border-light text-xs">
          <div className="p-2 text-[10px] font-mono uppercase text-text-tertiary">Готовые решения</div>
          <div className="p-2.5 hover:bg-accent/10 hover:text-accent flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="font-bold">Запустить SaaS-продукт под ключ</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </div>

          <div className="p-2 text-[10px] font-mono uppercase text-text-tertiary pt-3">UI-Атлас</div>
          <div className="p-2.5 hover:bg-accent/10 hover:text-accent flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">Bento Grid Showcase (Паттерн)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
}`,
      },
    ],
    responsiveNotes: "На мобильных экранах адаптируется по ширине с отступами 16px.",
    accessibilityNotes: "Полная поддержка клавиатуры и ARIA dialog разметки.",
    relatedPatterns: ["sticky-sidebar", "hero-editorial"],
    recipes: ["saas-launch-hero"],
  },
  {
    id: "floating-pulse-button",
    slug: "floating-pulse-button",
    title: "Pulsing Floating Action Button (Pulse FAB)",
    titleRu: "Пульсирующая фиксированная кнопка действия (Pulse FAB)",
    shortDescription: "Фиксированная в углу экрана кнопка быстрого перехода или целевого действия с бесконечной кольцевой волной на CSS box-shadow, масштабированием при наведении и адаптацией под смартфоны.",
    category: "navigation",
    kind: "interaction",
    tags: ["floating", "fab", "pulse", "animation", "call-to-action", "fixed", "box-shadow", "microinteractions"],
    difficulty: "beginner",
    badge: "Микровзаимодействие",
    stack: {
      html: true,
      css: true,
      tailwind: true,
      react: true,
      lucideIcons: true,
      typescript: true,
    },
    overview: {
      whatIsIt: "Компактная плавающая круглая или квадратная кнопка (FAB), зафиксированная в углу экрана (слева или справа), привлекающая внимание мягкой расходящейся световой волной.",
      whereToUse: [
        "Прямой переход в сервис (MAX, Telegram-канал, чат-бот поддержки)",
        "Кнопка 'Заказать звонок' или 'Быстрое бронирование'",
        "Глобальный триггер обратной связи или виджета сообщества",
      ],
      whyItWorks: "Кольцевая волна создает непрерывный визуальный якорь на периферии зрения, увеличивая кликабельность (CTR) на 40-60% по сравнению со статичной кнопкой.",
      commonMistakes: [
        "Использование z-index: 9999, из-за чего пульсирующая кнопка перекрывает модальные окна и мобильные меню",
        "Анимация масштаба всей кнопки (transform scale в keyframes), приводящая к размытию текста и иконки",
        "Отсутствие паузы анимации при наведении курсора (hover), что раздражает пользователя при попытке кликнуть",
      ],
    },
    anatomy: {
      summary: "Фиксированный контейнер с position: fixed, анимацией @keyframes pulse (box-shadow rings), паузой на hover и медиа-запросом для мобильных экранов.",
      points: [
        {
          id: 1,
          title: "Кольцевая волна (Box-Shadow Spread)",
          cssRule: "animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* Расширение тени от 0 до 20px с затуханием opacity */",
          description: "Генерирует расходящуюся волну света без смещения геометрии самой кнопки.",
          badge: "animation",
        },
        {
          id: 2,
          title: "Изолированное позиционирование",
          cssRule: "position: fixed; bottom: 20px; left: 20px; z-index: 40;",
          description: "Держит кнопку поверх контента страницы, но под системными модальными окнами.",
          badge: "position",
        },
        {
          id: 3,
          title: "Hover-стабилизация",
          cssRule: "transform: scale(1.08); animation-play-state: paused; transition: all 0.25s ease;",
          description: "Останавливает пульсацию при наведении, обеспечивая комфортный и точный клик.",
          badge: "animation",
        },
      ],
    },
    why: [
      {
        id: "why-box-shadow-pulse",
        question: "Почему кольцевую волну нужно анимировать через box-shadow, а не через transform: scale() всей кнопки?",
        principle: "Сохранение четкости и стабильности внутреннего контента.",
        badAlternative: "Анимировать @keyframes { 50% { transform: scale(1.2); } } на самой кнопке.",
        consequence: "Иконка и текст внутри кнопки будут постоянно дергаться и замыливаться в субпиксельном рендере, вызывая усталость глаз.",
        impactTag: "ux",
      },
      {
        id: "why-safe-z-index",
        question: "Почему плавающей кнопке нельзя задавать z-index: 9999?",
        principle: "Соблюдение иерархии слоев интерфейса (Z-Index Hierarchy).",
        badAlternative: "Задать z-index: 9999 или 999999.",
        consequence: "Кнопка будет нагло просвечивать сквозь открытые модальные окна, экран авторизации и Cookie-баннеры, ломая UX.",
        impactTag: "layout-stability",
      },
    ],
    skills: [
      {
        id: "css-keyframes-rings",
        title: "CSS Keyframe Ring Pulsation & Shadow Physics",
        level: "junior",
        description: "Создание привлекающих внимание микроанимаций без потери производительности.",
      },
      {
        id: "z-index-architecture",
        title: "Layer Stacking Contexts & Z-Index Governance",
        level: "middle",
        description: "Проектирование безопасных плавающих элементов без конфликтов перекрытия.",
      },
    ],
    promptVariables: [
      {
        id: "placement",
        label: "Расположение кнопки",
        defaultValue: "bottom-left",
        options: [
          { label: "Снизу слева (Bottom Left)", value: "bottom-left" },
          { label: "Снизу справа (Bottom Right)", value: "bottom-right" },
        ],
      },
      {
        id: "shape",
        label: "Геометрия кнопки",
        defaultValue: "rounded-circle",
        options: [
          { label: "Круглая (Classic 50% Radius)", value: "rounded-circle" },
          { label: "Строгий квадрат (ProektMap 0px)", value: "square-strict" },
        ],
      },
    ],
    prompts: [
      {
        target: "cursor",
        targetLabel: "Cursor Composer",
        title: "Промпт для Cursor (Pulsing Floating Button)",
        recommendedModel: "Claude 3.7 Sonnet / GPT-4o",
        description: "Генерирует плавающую кнопку с плавной кольцевой пульсацией и безопасным z-index.",
        promptText: `Создай переиспользуемый компонент FloatingPulseButton для Next.js (TypeScript, Tailwind CSS, Lucide icons).

Спецификация:
1. Позиционирование: {placement} (fixed bottom-5 left-5 или right-5, z-40).
2. Форм-фактор: {shape} (размер 64x64px на десктопе, 54x54px на экранах < 768px).
3. Пульсация: CSS-анимация pulse через box-shadow (расширение волны от 0 до 20px с затуханием opacity).
4. Hover-эффект: увеличение scale-105, смена оттенка на более глубокий и animation-play-state: paused.
5. Иконка: центрированная SVG или Lucide иконка (Sparkles, Send или внешний логотип).
6. Ссылка: открытие во внешней вкладке (target="_blank" rel="noopener noreferrer") с доступным aria-label.`,
        negativePrompt: `Запрещено:
- НЕ ставь z-index выше 50 (никаких z-[9999]).
- НЕ анимируй transform scale внутри keyframes (только box-shadow).
- НЕ используй внешние JS-библиотеки анимации.`,
      },
      {
        target: "v0",
        targetLabel: "v0 / Lovable",
        title: "Промпт для v0.dev",
        recommendedModel: "v0 Engine",
        description: "Создает пульсирующую плавающую кнопку для быстрых действий.",
        promptText: `A floating pulsing action button fixed in bottom corner.
Features smooth infinite CSS box-shadow wave animation (2s duration), hover scale effect with animation pause, crisp contrast border, and fully responsive sizing for mobile devices. Safe z-index layering.`,
        negativePrompt: `Do not use z-index 9999. Do not animate transform scale in keyframes.`,
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "React Floating Pulse Button Component",
        framework: "react-tailwind",
        code: `'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingPulseButtonProps {
  href?: string;
  title?: string;
  position?: 'bottom-left' | 'bottom-right';
  className?: string;
}

export function FloatingPulseButton({
  href = 'https://max.ru',
  title = 'Перейти в приложение',
  position = 'bottom-left',
  className = '',
}: FloatingPulseButtonProps) {
  const positionClass = position === 'bottom-left' ? 'left-5' : 'right-5';

  return (
    <>
      <style jsx>{\`
        @keyframes ringPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(65, 75, 205, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(65, 75, 205, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(65, 75, 205, 0);
          }
        }
        .pulse-fab-button {
          animation: ringPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .pulse-fab-button:hover {
          animation-play-state: paused;
        }
      \`}</style>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        aria-label={title}
        className={\`fixed bottom-5 \${positionClass} z-40 w-16 h-16 sm:w-18 sm:h-18 bg-[#414BCD] hover:bg-[#2F3A9E] text-white flex items-center justify-center border-2 border-white shadow-xl transition-all duration-200 hover:scale-108 pulse-fab-button \${className}\`}
      >
        <Sparkles className="w-8 h-8 pointer-events-none" />
      </a>
    </>
  );
}`,
      },
    ],
    responsiveNotes: "Автоматически уменьшается с 68px до 56px на смартфонах для сохранения полезной площади экрана.",
    accessibilityNotes: "Оснащен aria-label, title и безопасными атрибутами rel='noopener noreferrer'.",
    relatedPatterns: ["floating-social-dock", "floating-action-cta"],
    recipes: ["service-landing-pro"],
  },
];

export const UI_RECIPES: UIRecipe[] = [
  {
    id: "saas-launch-hero",
    slug: "saas-launch-hero",
    title: "High-Conversion SaaS Launch Screen",
    titleRu: "Конверсионный экран запуска SaaS-продукта",
    description: "Сборка экрана первого впечатления: Sticky Blur Header + Асимметричная Bento-сетка ключевых фич + Плавающий док мессенджеров + Единые дизайн-токены.",
    category: "saas",
    patternSlugs: ["bento-grid-features", "floating-social-dock", "cookie-consent-widget"],
    designTokens: {
      radius: "rounded-3xl (24px)",
      background: "#0B0F19 (Slate Dark)",
      border: "border-slate-800/80",
      blur: "backdrop-blur-xl",
      accentColor: "#6366F1 (Indigo Glow)",
      typography: "Inter / Tight Tracking",
    },
    useCase: "Главная страница технологического AI-стартапа, микросервиса или SaaS-платформы под ключ.",
    masterPrompt: `Собери главный экран SaaS-приложения на Next.js (App Router, TypeScript, Tailwind CSS, lucide-react) по согласованному дизайн-рецепту ProektMap:

1. ДИЗАЙН-ТОКЕНЫ СИСТЕМЫ:
   - Радиусы скругления: rounded-3xl (24px) для карточек и rounded-xl (12px) для кнопок.
   - Цветовая база: тёмный фон #0B0F19, границы border-slate-800/80, акцент #6366F1.
   - Эффект глубины: backdrop-blur-xl на всех плавающих слоях.

2. СТРУКТУРА ЭКРАНА И ПАТТЕРНЫ:
   - Секция 1: Bento Grid фич (bento-grid-features) — 3-колоночная асимметричная сетка с 1 флагманским блоком 2x2.
   - Секция 2: Floating Social Dock (floating-social-dock) — фиксированная панель Telegram/WhatsApp в правом нижнем углу с pointer-events-none изоляцией.
   - Секция 3: Cookie Consent Widget (cookie-consent-widget) — ненавязчивый баннер согласия 152-ФЗ с запоминанием в LocalStorage.

3. ТРЕБОВАНИЯ К КОДУ:
   - Все компоненты типобезопасны (TypeScript).
   - Отсутствие конфликтов по z-index: Header (z-40), Floating Dock (z-50), Cookie Banner (z-40).
   - 100% мобильная адаптивность без горизонтального скролла.`,
  },
  {
    id: "service-landing-pro",
    slug: "service-landing-pro",
    title: "Agency & AI Engineer Service Landing",
    titleRu: "Лендинг услуг AI-инженера и агентства",
    description: "Проверенная связка для продажи услуг внедрения AI: плавающий контактный док + юридический виджет + конверсионные блоки.",
    category: "landing",
    patternSlugs: ["floating-social-dock", "cookie-consent-widget"],
    designTokens: {
      radius: "rounded-2xl (16px)",
      background: "#090D16",
      border: "border-slate-800",
      blur: "backdrop-blur-md",
      accentColor: "#10B981 (Emerald)",
      typography: "Inter",
    },
    useCase: "Посадочная страница для привлечения клиентов на разработку ботов, интеграцию AI и веб-сервисов.",
    masterPrompt: `Сгенерируй посадочную страницу для услуг AI-инжиниринга:
- Стек: Next.js + Tailwind CSS.
- Включи Floating Social Dock в правом нижнем углу для прямого контакта в Telegram.
- Включи Cookie Consent баннер с поддержкой 152-ФЗ.
- Стиль: строгий темный технологичный минимализм.`,
  },
];

export function getPatternBySlug(slug: string): UIPattern | undefined {
  return UI_PATTERNS.find((p) => p.slug === slug);
}

export function getPatternsByCategory(category: PatternCategory): UIPattern[] {
  return UI_PATTERNS.filter((p) => p.category === category);
}

export function getRecipeBySlug(slug: string): UIRecipe | undefined {
  return UI_RECIPES.find((r) => r.slug === slug);
}
