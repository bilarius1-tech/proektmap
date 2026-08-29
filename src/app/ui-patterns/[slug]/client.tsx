"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Scan,
  HelpCircle,
  Terminal,
  Code2,
  Copy,
  Check,
  Sparkles,
  Layers,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Info,
  Send,
  Phone,
  MessageSquare,
  MessageCircle,
  X,
  Sliders,
  AlertTriangle,
  Flame,
  Award,
  Monitor,
  Tablet,
  Grid,
  CheckCircle2,
  Star,
  ExternalLink,
  Plus,
  Zap,
  Search,
  Lock,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { UIPattern, AIModelTarget, StylePreset, UI_RECIPES } from "../data";

interface Props {
  pattern: UIPattern;
  allPatterns: UIPattern[];
}

type TabMode = "visual" | "anatomy" | "why" | "prompt" | "code";
type ViewportMode = "desktop" | "tablet" | "mobile";

export default function PatternViewClient({ pattern, allPatterns }: Props) {
  const [activeTab, setActiveTab] = useState<TabMode>("visual");
  const [selectedTarget, setSelectedTarget] = useState<AIModelTarget>("cursor");
  const [selectedCodeTab, setSelectedCodeTab] = useState<"component" | "usage" | "tokens">("component");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeAnatomyPoint, setActiveAnatomyPoint] = useState<number | null>(null);

  // Studio Sandbox Controls
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [stylePreset, setStylePreset] = useState<StylePreset>("glass");

  // Dynamic Prompt Variables State
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    pattern.promptVariables.forEach((v) => {
      initial[v.id] = v.defaultValue;
    });
    return initial;
  });

  // --- Specific Interactive Pattern States ---
  // 1. Floating Social Dock
  const [dockHovered, setDockHovered] = useState<string | null>(null);
  const [dockMobileOpen, setDockMobileOpen] = useState(false);

  // 2. Cookie Consent Widget
  const [cookieConsentSaved, setCookieConsentSaved] = useState(false);
  const [cookieShowSettings, setCookieShowSettings] = useState(false);
  const [cookieAnalytics, setCookieAnalytics] = useState(true);
  const [cookieMarketing, setCookieMarketing] = useState(false);

  // 3. Bento Grid Spotlight
  const [bentoSpotlight, setBentoSpotlight] = useState<{ x: number; y: number } | null>(null);

  // 4. Sticky Glass Header simulation
  const [simulatedScrolled, setSimulatedScrolled] = useState(false);
  const [headerMobileMenu, setHeaderMobileMenu] = useState(false);

  // 5. Mobile Bottom Nav active tab
  const [activeMobileTab, setActiveMobileTab] = useState("home");

  // 6. Pricing Comparison
  const [annualPricing, setAnnualPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  // 7. FAQ Accordion
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // 8. Floating Action CTA
  const [ctaDismissed, setCtaDismissed] = useState(false);

  // 9. Announcement Bar
  const [announcementClosed, setAnnouncementClosed] = useState(false);

  // 10. Before / After Slider
  const [sliderPos, setSliderPos] = useState(50);
  const isDraggingSlider = useRef(false);

  // 11. Scroll Reveal Simulator
  const [revealTrigger, setRevealTrigger] = useState(1);

  // 12. Sticky TOC Sidebar
  const [activeTocId, setActiveTocId] = useState("arch");

  // 13. Stacking Cards
  const [focusedStackStep, setFocusedStackStep] = useState(1);

  // 14. Command Palette
  const [cmdSearchQuery, setCmdSearchQuery] = useState("");

  // 15. Floating Pulse Button
  const [pulseActive, setPulseActive] = useState(true);
  const [pulsePosition, setPulsePosition] = useState<"left" | "right">("left");
  const [pulseShape, setPulseShape] = useState<"circle" | "square">("circle");

  // Current active prompt variant
  const currentPromptVariant = useMemo(() => {
    const found = pattern.prompts.find((p) => p.target === selectedTarget);
    return found || pattern.prompts[0];
  }, [pattern.prompts, selectedTarget]);

  // Computed Prompt Text with dynamic variables substituted
  const computedPromptText = useMemo(() => {
    let text = currentPromptVariant?.promptText || "";
    Object.entries(variableValues).forEach(([key, val]) => {
      text = text.replaceAll(`{${key}}`, val);
    });
    return text;
  }, [currentPromptVariant, variableValues]);

  // Associated Recipes
  const linkedRecipes = useMemo(() => {
    return UI_RECIPES.filter((r) => r.patternSlugs.includes(pattern.slug));
  }, [pattern.slug]);

  const handleCopyPrompt = () => {
    if (!computedPromptText) return;
    const fullText = currentPromptVariant?.negativePrompt
      ? `${computedPromptText}\n\n[NEGATIVE INSTRUCTIONS / ЧТО ЗАПРЕЩЕНО]:\n${currentPromptVariant.negativePrompt}`
      : computedPromptText;

    navigator.clipboard.writeText(fullText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCode = () => {
    let code = pattern.codeSnippets[0]?.code || "";
    if (selectedCodeTab === "usage") {
      code = `// Пример импорта и подключения в Next.js (App Router)
import { ${pattern.title.replace(/[^a-zA-Z]/g, "")} } from "@/components/ui/${pattern.slug}";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <${pattern.title.replace(/[^a-zA-Z]/g, "")} />
    </main>
  );
}`;
    } else if (selectedCodeTab === "tokens") {
      code = `/* ProektMap Design System CSS Tokens (0px radius standard) */
:root {
  --color-accent: #2563eb;
  --color-accent-light: rgba(37, 99, 235, 0.08);
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --radius-strict: 0px;
}`;
    }
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div style={{ background: "var(--color-bg-primary)", minHeight: "100vh", color: "var(--color-text-primary)", paddingBottom: "var(--space-3xl)" }}>
      {/* Top Breadcrumbs Bar */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          padding: "var(--space-s) var(--space-m)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-width, 1200px)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "var(--text-xs)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/ui-patterns"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={14} />
              <span>Каталог UI-Атласа</span>
            </Link>
            <ChevronRight size={12} color="var(--color-text-tertiary)" />
            <span style={{ color: "var(--color-accent)", fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>
              {pattern.category}
            </span>
            <ChevronRight size={12} color="var(--color-text-tertiary)" />
            <span style={{ color: "var(--color-text-primary)", fontWeight: 700 }}>{pattern.titleRu}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                background: "var(--color-accent-light)",
                color: "var(--color-accent)",
                border: "1px solid var(--color-accent)",
                borderRadius: 0,
              }}
            >
              <Sparkles size={12} />
              <span>{pattern.badge || "Золотой фонд"}</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "var(--container-width, 1200px)", margin: "0 auto", padding: "var(--space-m) var(--space-m)" }}>
        {/* Header Hero */}
        <div style={{ marginBottom: "var(--space-l)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-m)", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  #{pattern.slug}
                </span>
                <span style={{ color: "var(--color-border)" }}>•</span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 0,
                    textTransform: "capitalize",
                    border: "1px solid",
                    borderColor:
                      pattern.difficulty === "beginner"
                        ? "var(--color-accent)"
                        : pattern.difficulty === "intermediate"
                        ? "var(--color-warning)"
                        : "var(--color-error)",
                    color:
                      pattern.difficulty === "beginner"
                        ? "var(--color-accent)"
                        : pattern.difficulty === "intermediate"
                        ? "var(--color-warning)"
                        : "var(--color-error)",
                    background: "transparent",
                  }}
                >
                  {pattern.difficulty}
                </span>
                {pattern.kind && (
                  <>
                    <span style={{ color: "var(--color-border)" }}>•</span>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
                      Тип: {pattern.kind}
                    </span>
                  </>
                )}
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--color-text-primary)",
                  margin: "0 0 8px 0",
                  lineHeight: 1.15,
                }}
              >
                {pattern.titleRu}
              </h1>

              <p
                style={{
                  fontSize: "var(--text-s)",
                  color: "var(--color-text-secondary)",
                  maxWidth: 720,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {pattern.shortDescription}
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                onClick={handleCopyPrompt}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  background: "var(--color-accent)",
                  color: "#ffffff",
                  border: "1px solid var(--color-accent)",
                  borderRadius: 0,
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {copiedPrompt ? <Check size={14} /> : <Terminal size={14} />}
                <span>{copiedPrompt ? "Скопировано!" : "Копировать Master-Промпт"}</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "var(--space-m)" }}>
            {pattern.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  padding: "2px 8px",
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                  color: "var(--color-text-secondary)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 5-LAYER MODE SWITCHER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-secondary)",
            padding: 4,
            marginBottom: "var(--space-l)",
            overflowX: "auto",
          }}
        >
          {(
            [
              { id: "visual", label: "1. VISUAL (STUDIO)", icon: Eye },
              { id: "anatomy", label: "2. ANATOMY", icon: Scan },
              { id: "why", label: "3. WHY & IMPACT", icon: HelpCircle },
              { id: "prompt", label: "4. AI PROMPT", icon: Terminal },
              { id: "code", label: "5. PRODUCTION CODE", icon: Code2 },
            ] as { id: TabMode; label: string; icon: any }[]
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  minWidth: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 0,
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "var(--color-accent)" : "transparent",
                  background: isActive ? "var(--color-accent)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--color-text-secondary)",
                  transition: "background 0.15s ease",
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: VISUAL STUDIO SANDBOX */}
        {/* ========================================================================= */}
        {activeTab === "visual" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            {/* Studio Engineering Sandbox */}
            <div
              style={{
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: 0,
                overflow: "hidden",
              }}
            >
              {/* Studio Toolbar */}
              <div
                style={{
                  padding: "8px var(--space-m)",
                  borderBottom: "1px solid var(--color-border)",
                  background: "var(--color-bg-tertiary)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                {/* Left: Viewport Switcher */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", marginRight: 4 }}>
                    ВЬЮПОРТ:
                  </span>
                  {[
                    { id: "desktop", label: "Desktop (100%)", icon: Monitor },
                    { id: "tablet", label: "Tablet (768px)", icon: Tablet },
                    { id: "mobile", label: "Mobile (375px)", icon: Smartphone },
                  ].map((vp) => {
                    const Icon = vp.icon;
                    const isVpActive = viewportMode === vp.id;
                    return (
                      <button
                        key={vp.id}
                        type="button"
                        onClick={() => setViewportMode(vp.id as ViewportMode)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 8px",
                          borderRadius: 0,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: isVpActive ? "var(--color-accent)" : "var(--color-border)",
                          background: isVpActive ? "var(--color-accent)" : "var(--color-bg-primary)",
                          color: isVpActive ? "#ffffff" : "var(--color-text-secondary)",
                        }}
                      >
                        <Icon size={12} />
                        <span>{vp.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Grid Toggle & Status */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 8px",
                      borderRadius: 0,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid var(--color-border)",
                      background: showGrid ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                      color: showGrid ? "var(--color-accent)" : "var(--color-text-tertiary)",
                    }}
                  >
                    <Grid size={12} />
                    <span>Сетка: {showGrid ? "ON" : "OFF"}</span>
                  </button>

                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      padding: "2px 6px",
                      background: "var(--color-bg-primary)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    0px STRICT TOKENS
                  </span>
                </div>
              </div>

              {/* Viewport Canvas Frame */}
              <div
                style={{
                  padding: viewportMode === "desktop" ? "var(--space-l)" : "var(--space-xl) var(--space-m)",
                  minHeight: 480,
                  background: "var(--color-bg-primary)",
                  backgroundImage: showGrid ? "radial-gradient(var(--color-border) 1px, transparent 1px)" : "none",
                  backgroundSize: "20px 20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflowX: "auto",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Simulated Device Frame Container */}
                <div
                  style={{
                    width: viewportMode === "desktop" ? "100%" : viewportMode === "tablet" ? "768px" : "375px",
                    maxWidth: "100%",
                    background: "var(--color-bg-secondary)",
                    border: viewportMode === "desktop" ? "none" : "2px solid var(--color-border)",
                    boxShadow: viewportMode === "desktop" ? "none" : "0 20px 40px rgba(0,0,0,0.15)",
                    position: "relative",
                    minHeight: 380,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: viewportMode === "mobile" ? "12px" : "var(--space-l)",
                  }}
                >
                  {/* ========================================================================= */}
                  {/* PATTERN 1: FLOATING SOCIAL DOCK */}
                  {/* ========================================================================= */}
                  {pattern.slug === "floating-social-dock" && (
                    <div style={{ width: "100%", position: "relative", minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div style={{ padding: 16, border: "1px dashed var(--color-border)", background: "var(--color-bg-primary)" }}>
                        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 700, textTransform: "uppercase" }}>
                          Контейнер страницы с pointer-events-none изоляцией
                        </div>
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
                          Панель фиксируется в правом нижнем углу и не блокирует клики по контенту страницы благодаря свойству <code>pointer-events: none</code> на контейнере и <code>pointer-events: auto</code> на кнопках.
                        </p>
                      </div>

                      {/* The Floating Dock */}
                      <div
                        style={{
                          alignSelf: "flex-end",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 8,
                          marginTop: 24,
                        }}
                      >
                        {[
                          { id: "tg", label: "Написать в Telegram", icon: Send, color: "#229ED9", handle: "@proektmap_bot" },
                          { id: "wa", label: "Связаться в WhatsApp", icon: MessageSquare, color: "#25D366", handle: "+7 (999) 000-00-00" },
                          { id: "phone", label: "Заказать обратный звонок", icon: Phone, color: "var(--color-accent)", handle: "Ответим за 5 минут" },
                        ].map((item) => {
                          const Icon = item.icon;
                          const isHovered = dockHovered === item.id;
                          return (
                            <div
                              key={item.id}
                              onMouseEnter={() => setDockHovered(item.id)}
                              onMouseLeave={() => setDockHovered(null)}
                              style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              {/* Expanded Label on Hover */}
                              <div
                                style={{
                                  padding: "6px 12px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: "var(--color-bg-primary)",
                                  color: "var(--color-text-primary)",
                                  border: "1px solid var(--color-border)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  whiteSpace: "nowrap",
                                  opacity: isHovered ? 1 : 0,
                                  transform: isHovered ? "translateX(0)" : "translateX(10px)",
                                  transition: "opacity 0.2s ease, transform 0.2s ease",
                                  pointerEvents: "none",
                                }}
                              >
                                <span>{item.label}</span>
                                <span style={{ marginLeft: 6, color: "var(--color-text-tertiary)", fontWeight: 500 }}>({item.handle})</span>
                              </div>

                              {/* Button */}
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  background: "var(--color-bg-primary)",
                                  border: isHovered ? `2px solid ${item.color}` : "1px solid var(--color-border)",
                                  color: "var(--color-text-primary)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <Icon size={18} color={item.color} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 2: COOKIE CONSENT WIDGET */}
                  {/* ========================================================================= */}
                  {pattern.slug === "cookie-consent-widget" && (
                    <div style={{ width: "100%", maxWidth: 460, margin: "0 auto" }}>
                      <div
                        style={{
                          background: "var(--color-bg-primary)",
                          border: "2px solid var(--color-border)",
                          padding: "var(--space-m)",
                          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div
                            style={{
                              padding: 8,
                              background: "var(--color-accent-light)",
                              color: "var(--color-accent)",
                              border: "1px solid var(--color-accent)",
                            }}
                          >
                            <ShieldCheck size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <h4 style={{ fontSize: "var(--text-s)", fontWeight: 800, margin: 0, color: "var(--color-text-primary)" }}>
                                Конфиденциальность &amp; 152-ФЗ
                              </h4>
                              {cookieConsentSaved && (
                                <span style={{ fontSize: 10, color: "var(--color-accent)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                                  ✓ СОХРАНЕНО В LS
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "6px 0 0 0", lineHeight: 1.5 }}>
                              Мы используем файлы cookie и аналитику для улучшения работы сервиса и сохранения вашего прогресса обучения.
                            </p>
                          </div>
                        </div>

                        {/* Granular Checkboxes Accordion */}
                        {cookieShowSettings && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, cursor: "not-allowed" }}>
                              <span style={{ fontWeight: 600 }}>Необходимые куки (Сессия, авторизация)</span>
                              <span style={{ color: "var(--color-accent)", fontWeight: 700, fontSize: 10 }}>ОБЯЗАТЕЛЬНО</span>
                            </label>

                            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, cursor: "pointer" }}>
                              <span>Аналитика (Яндекс.Метрика, вебвизор)</span>
                              <input
                                type="checkbox"
                                checked={cookieAnalytics}
                                onChange={(e) => setCookieAnalytics(e.target.checked)}
                              />
                            </label>

                            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, cursor: "pointer" }}>
                              <span>Персонализация рекомендаций</span>
                              <input
                                type="checkbox"
                                checked={cookieMarketing}
                                onChange={(e) => setCookieMarketing(e.target.checked)}
                              />
                            </label>
                          </div>
                        )}

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 8, marginTop: "var(--space-m)" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setCookieConsentSaved(true);
                              setCookieShowSettings(false);
                            }}
                            style={{
                              flex: 1,
                              padding: "8px 14px",
                              background: "var(--color-accent)",
                              color: "#fff",
                              border: "1px solid var(--color-accent)",
                              fontSize: "var(--text-xs)",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Принять все
                          </button>

                          <button
                            type="button"
                            onClick={() => setCookieShowSettings(!cookieShowSettings)}
                            style={{
                              padding: "8px 12px",
                              background: "var(--color-bg-secondary)",
                              color: "var(--color-text-primary)",
                              border: "1px solid var(--color-border)",
                              fontSize: "var(--text-xs)",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {cookieShowSettings ? "Скрыть" : "Настроить"}
                          </button>

                          {cookieConsentSaved && (
                            <button
                              type="button"
                              onClick={() => setCookieConsentSaved(false)}
                              title="Сбросить состояние LocalStorage"
                              style={{
                                padding: "8px 10px",
                                background: "var(--color-bg-tertiary)",
                                color: "var(--color-text-secondary)",
                                border: "1px solid var(--color-border)",
                                cursor: "pointer",
                              }}
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 3: BENTO GRID FEATURES */}
                  {/* ========================================================================= */}
                  {pattern.slug === "bento-grid-features" && (
                    <div
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setBentoSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onMouseLeave={() => setBentoSpotlight(null)}
                      style={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: viewportMode === "mobile" ? "1fr" : "repeat(3, 1fr)",
                        gap: 12,
                        position: "relative",
                      }}
                    >
                      {/* Card 1 (Flagship 2x2) */}
                      <div
                        style={{
                          gridColumn: viewportMode === "mobile" ? "span 1" : "span 2",
                          background: "var(--color-bg-primary)",
                          border: "1px solid var(--color-border)",
                          padding: "var(--space-l)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 200,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
                            <Sparkles size={12} /> Флагманский блок 2x2
                          </div>
                          <h3 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: 0, color: "var(--color-text-primary)" }}>
                            Асимметричная иерархия преимуществ
                          </h3>
                          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
                            Захватывает до 60% первичного внимания пользователя, демонстрируя ключевую ценность вашего продукта.
                          </p>
                        </div>
                        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                          <span style={{ padding: "4px 8px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: 10, fontFamily: "var(--font-mono)" }}>Next.js 16</span>
                          <span style={{ padding: "4px 8px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: 10, fontFamily: "var(--font-mono)" }}>Prisma 7</span>
                          <span style={{ padding: "4px 8px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: 10, fontFamily: "var(--font-mono)" }}>TypeScript</span>
                        </div>
                      </div>

                      {/* Card 2 (1x1 Speed) */}
                      <div
                        style={{
                          background: "var(--color-bg-primary)",
                          border: "1px solid var(--color-border)",
                          padding: "var(--space-m)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: 32, height: 32, background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)", color: "var(--color-warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Zap size={16} />
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <h4 style={{ fontSize: "var(--text-xs)", fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>
                            TTFB &lt; 35ms
                          </h4>
                          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4, lineHeight: 1.4 }}>
                            Мгновенная отдача статики на edge-серверах.
                          </p>
                        </div>
                      </div>

                      {/* Card 3 (1x1 Security) */}
                      <div
                        style={{
                          background: "var(--color-bg-primary)",
                          border: "1px solid var(--color-border)",
                          padding: "var(--space-m)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: 32, height: 32, background: "rgba(37, 99, 235, 0.1)", border: "1px solid var(--color-accent)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Lock size={16} />
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <h4 style={{ fontSize: "var(--text-xs)", fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>
                            Изоляция секретов
                          </h4>
                          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4, lineHeight: 1.4 }}>
                            API-ключи никогда не попадают в клиентский код.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 4: HERO EDITORIAL */}
                  {/* ========================================================================= */}
                  {pattern.slug === "hero-editorial" && (
                    <div style={{ width: "100%", textAlign: "left" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          background: "var(--color-accent-light)",
                          color: "var(--color-accent)",
                          border: "1px solid var(--color-accent)",
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          textTransform: "uppercase",
                          marginBottom: 16,
                        }}
                      >
                        <Sparkles size={12} />
                        <span>ШВЕЙЦАРСКИЙ СТАНДАРТ • 0PX GEOMETRY</span>
                      </div>

                      <h2
                        style={{
                          fontSize: viewportMode === "mobile" ? "1.5rem" : "clamp(1.75rem, 4vw, 2.75rem)",
                          fontWeight: 900,
                          letterSpacing: "-0.03em",
                          lineHeight: 1.1,
                          color: "var(--color-text-primary)",
                          margin: "0 0 16px 0",
                        }}
                      >
                        Собирайте цифровые продукты <br />
                        <span style={{ color: "var(--color-accent)", textDecoration: "underline", textDecorationThickness: 3, textUnderlineOffset: 6 }}>
                          через точные AI-маршруты
                        </span>
                      </h2>

                      <p
                        style={{
                          fontSize: viewportMode === "mobile" ? "12px" : "var(--text-s)",
                          color: "var(--color-text-secondary)",
                          maxWidth: 580,
                          lineHeight: 1.6,
                          margin: "0 0 24px 0",
                        }}
                      >
                        Проверенная архитектура, готовые Prisma-схемы и строгие негативные промпты. От идеи до боевого сервера с оплатой за 3 вечера.
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 24 }}>
                        <button
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "12px 20px",
                            background: "var(--color-accent)",
                            color: "#fff",
                            border: "1px solid var(--color-accent)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          <span>Выбрать готовое решение</span>
                          <ArrowRight size={14} />
                        </button>

                        <button
                          style={{
                            padding: "12px 18px",
                            background: "var(--color-bg-primary)",
                            color: "var(--color-text-primary)",
                            border: "1px solid var(--color-border)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Каталог UI-Атласа
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12, borderTop: "1px solid var(--color-border-light)", fontSize: 11, color: "var(--color-text-secondary)" }}>
                        <div style={{ display: "flex", color: "var(--color-warning)" }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" />
                          ))}
                        </div>
                        <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>4.9/5.0</span>
                        <span>•</span>
                        <span>1,200+ инженеров в сообществе</span>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 5: STICKY GLASS HEADER */}
                  {/* ========================================================================= */}
                  {pattern.slug === "sticky-glass-header" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Controls simulation */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border)", fontSize: 11 }}>
                        <span>Симуляция состояния страницы:</span>
                        <button
                          onClick={() => setSimulatedScrolled(!simulatedScrolled)}
                          style={{
                            padding: "4px 10px",
                            background: simulatedScrolled ? "var(--color-accent)" : "var(--color-bg-primary)",
                            color: simulatedScrolled ? "#fff" : "var(--color-text-primary)",
                            border: "1px solid var(--color-border)",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {simulatedScrolled ? "Scroll > 20px (Сжатие + Blur)" : "Top of Page (Просторная)"}
                        </button>
                      </div>

                      {/* Header Element */}
                      <header
                        style={{
                          width: "100%",
                          height: simulatedScrolled ? 50 : 66,
                          background: simulatedScrolled ? "rgba(var(--bg-primary-rgb, 255, 255, 255), 0.9)" : "var(--color-bg-primary)",
                          backdropFilter: simulatedScrolled ? "blur(12px)" : "none",
                          borderBottom: "1px solid var(--color-border)",
                          padding: "0 var(--space-m)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: "var(--text-s)", letterSpacing: "-0.02em" }}>
                          <span style={{ width: 12, height: 12, background: "var(--color-accent)" }} />
                          <span>PROEKTMAP</span>
                        </div>

                        <nav style={{ display: viewportMode === "mobile" ? "none" : "flex", alignItems: "center", gap: 16, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)" }}>
                          <span style={{ color: "var(--color-text-primary)" }}>Решения</span>
                          <span>UI-Атлас</span>
                          <span>Тарифы</span>
                          <span>База знаний</span>
                        </nav>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            style={{
                              padding: "6px 12px",
                              background: "var(--color-accent)",
                              color: "#fff",
                              border: "1px solid var(--color-accent)",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Войти
                          </button>
                        </div>
                      </header>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 6: MOBILE BOTTOM NAV */}
                  {/* ========================================================================= */}
                  {pattern.slug === "mobile-bottom-nav" && (
                    <div style={{ width: "100%", maxWidth: 360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ fontSize: 11, textAlign: "center", color: "var(--color-text-tertiary)" }}>
                        Интерактивная панель (нажимайте на вкладки):
                      </div>

                      {/* Phone Bottom Mock */}
                      <div
                        style={{
                          background: "var(--color-bg-primary)",
                          border: "2px solid var(--color-border)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div style={{ padding: "12px", minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                          Активный раздел: <strong style={{ marginLeft: 6, color: "var(--color-accent)" }}>{activeMobileTab.toUpperCase()}</strong>
                        </div>

                        {/* Bottom Navigation */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            borderTop: "1px solid var(--color-border)",
                            background: "var(--color-bg-secondary)",
                            paddingTop: 8,
                            paddingBottom: 16,
                          }}
                        >
                          {[
                            { id: "home", label: "Главная", icon: Layers },
                            { id: "solutions", label: "Решения", icon: Zap },
                            { id: "atlas", label: "UI-Атлас", icon: Sparkles },
                            { id: "profile", label: "Профиль", icon: ShieldCheck },
                          ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeMobileTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => setActiveMobileTab(tab.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 4,
                                  cursor: "pointer",
                                  color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                                }}
                              >
                                <Icon size={16} />
                                <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 500 }}>{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 7: PRICING COMPARISON */}
                  {/* ========================================================================= */}
                  {pattern.slug === "pricing-comparison" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Period Toggle */}
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                        <div style={{ display: "inline-flex", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", padding: 3 }}>
                          <button
                            onClick={() => setAnnualPricing(false)}
                            style={{
                              padding: "6px 14px",
                              fontSize: 11,
                              fontWeight: 700,
                              background: !annualPricing ? "var(--color-accent)" : "transparent",
                              color: !annualPricing ? "#fff" : "var(--color-text-secondary)",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Помесячно
                          </button>
                          <button
                            onClick={() => setAnnualPricing(true)}
                            style={{
                              padding: "6px 14px",
                              fontSize: 11,
                              fontWeight: 700,
                              background: annualPricing ? "var(--color-accent)" : "transparent",
                              color: annualPricing ? "#fff" : "var(--color-text-secondary)",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span>За год</span>
                            <span style={{ fontSize: 9, background: "#fef08a", color: "#854d0e", padding: "1px 4px", fontWeight: 800 }}>
                              -20%
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* 3 Columns */}
                      <div style={{ display: "grid", gridTemplateColumns: viewportMode === "mobile" ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
                        {[
                          { id: "free", name: "Старт", monthly: 0, annual: 0, desc: "Базовые статьи и 1 решение", popular: false },
                          { id: "pro", name: "Pro Инженер", monthly: 990, annual: 790, desc: "Все 20+ готовых решений и UI-Атлас", popular: true },
                          { id: "team", name: "Команда", monthly: 2990, annual: 2390, desc: "До 5 аккаунтов и аудит архитектора", popular: false },
                        ].map((plan) => (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            style={{
                              padding: "var(--space-m)",
                              background: "var(--color-bg-primary)",
                              border: plan.popular ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              cursor: "pointer",
                            }}
                          >
                            {plan.popular && (
                              <div style={{ position: "absolute", top: 0, right: 0, background: "var(--color-accent)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", textTransform: "uppercase" }}>
                                Хит продаж
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: "var(--text-s)", fontWeight: 800, color: "var(--color-text-primary)" }}>{plan.name}</div>
                              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{plan.desc}</div>
                              <div style={{ margin: "14px 0" }}>
                                <span style={{ fontSize: "var(--text-l)", fontWeight: 900, color: "var(--color-text-primary)" }}>
                                  {annualPricing ? plan.annual : plan.monthly} ₽
                                </span>
                                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 4 }}>/ месяц</span>
                              </div>
                            </div>
                            <button
                              style={{
                                width: "100%",
                                padding: "8px",
                                background: plan.popular ? "var(--color-accent)" : "var(--color-bg-secondary)",
                                color: plan.popular ? "#fff" : "var(--color-text-primary)",
                                border: plan.popular ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Выбрать план
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 8: TESTIMONIAL STACK */}
                  {/* ========================================================================= */}
                  {pattern.slug === "testimonial-stack" && (
                    <div style={{ width: "100%", display: "grid", gridTemplateColumns: viewportMode === "mobile" ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
                      {[
                        { name: "Александр В.", role: "Indie Hacker", quote: "Собрал и задеплоил первый SaaS за 3 вечера по готовому маршруту.", stars: 5 },
                        { name: "Михаил К.", role: "Fullstack Dev", quote: "Слой WHY и Negative Prompt сэкономили мне десятки часов правок в Cursor.", stars: 5 },
                      ].map((rev, idx) => (
                        <div key={idx} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ display: "flex", color: "var(--color-warning)", marginBottom: 8 }}>
                              {[...Array(rev.stars)].map((_, i) => (
                                <Star key={i} size={13} fill="currentColor" />
                              ))}
                            </div>
                            <p style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.5, margin: 0 }}>
                              «{rev.quote}»
                            </p>
                          </div>
                          <div style={{ marginTop: 16, paddingTop: 10, borderTop: "1px solid var(--color-border-light)", display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, background: "var(--color-accent)", color: "#fff", fontWeight: 800, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {rev.name[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700 }}>{rev.name}</div>
                              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{rev.role}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 9: LOGO CLOUD */}
                  {/* ========================================================================= */}
                  {pattern.slug === "logo-cloud" && (
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                        Технологический фундамент платформы
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: viewportMode === "mobile" ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 8 }}>
                        {["NEXT.JS 16", "TYPESCRIPT", "PRISMA 7", "POSTGRESQL", "TAILWIND", "DOCKER", "DEEPSEEK", "CLAUDE 3.7"].map((item) => (
                          <div
                            key={item}
                            style={{
                              padding: "12px 8px",
                              background: "var(--color-bg-primary)",
                              border: "1px solid var(--color-border)",
                              fontSize: 11,
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              color: "var(--color-text-secondary)",
                              transition: "all 0.2s ease",
                              cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "var(--color-accent)";
                              e.currentTarget.style.color = "var(--color-accent)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "var(--color-border)";
                              e.currentTarget.style.color = "var(--color-text-secondary)";
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 10: FAQ ACCORDION */}
                  {/* ========================================================================= */}
                  {pattern.slug === "faq-accordion" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { q: "Нужен ли мне опыт в кодинге для старта?", a: "Нет. Маршруты ProektMap созданы для AI-инженеров и вайбкодеров. Мы даем готовый стек, терминальные команды и точные промпты." },
                        { q: "Чем ваши решения отличаются от обычных промптов?", a: "Мы даем полную архитектуру (стек, миграции БД, Definition of Done, z-index изоляцию и защиту от галлюцинаций)." },
                        { q: "Могу ли я продавать созданные продукты?", a: "Да. 100% кода и прав на созданные сервисы принадлежат вам без лицензионных отчислений." },
                      ].map((item, idx) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <div key={idx} style={{ background: "var(--color-bg-primary)", border: isOpen ? "1px solid var(--color-accent)" : "1px solid var(--color-border)" }}>
                            <button
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: "none",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "var(--text-xs)",
                                fontWeight: 700,
                                color: isOpen ? "var(--color-accent)" : "var(--color-text-primary)",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              <span>{item.q}</span>
                              <Plus size={14} style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s ease" }} />
                            </button>
                            {isOpen && (
                              <div style={{ padding: "0 16px 12px 16px", fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 11: FEATURE COMPARISON */}
                  {/* ========================================================================= */}
                  {pattern.slug === "feature-comparison" && (
                    <div style={{ width: "100%", overflowX: "auto", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "var(--color-bg-tertiary)", borderBottom: "1px solid var(--color-border)" }}>
                            <th style={{ padding: 10, fontWeight: 700 }}>Критерий</th>
                            <th style={{ padding: 10, color: "var(--color-text-secondary)" }}>Обычный путь</th>
                            <th style={{ padding: 10, color: "var(--color-accent)", background: "var(--color-accent-light)", fontWeight: 800 }}>ProektMap AI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { f: "Срок запуска MVP", bad: "2-3 месяца", good: "2-3 вечера" },
                            { f: "Стоимость разработки", bad: "150 000+ ₽", good: "990 ₽ Pro" },
                            { f: "Архитектура БД", bad: "Ошибки миграций", good: "Готовый Prisma-сетап" },
                          ].map((r, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                              <td style={{ padding: 10, fontWeight: 600 }}>{r.f}</td>
                              <td style={{ padding: 10, color: "var(--color-text-tertiary)" }}>{r.bad}</td>
                              <td style={{ padding: 10, fontWeight: 700, color: "var(--color-accent)", background: "rgba(37, 99, 235, 0.03)" }}>✓ {r.good}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 12: FLOATING ACTION CTA */}
                  {/* ========================================================================= */}
                  {pattern.slug === "floating-action-cta" && (
                    <div style={{ width: "100%", position: "relative", minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>
                      {!ctaDismissed ? (
                        <div style={{ maxWidth: 360, width: "100%", background: "var(--color-bg-primary)", border: "2px solid var(--color-accent)", padding: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "var(--color-accent)", textTransform: "uppercase" }}>⚡ ГОТОВОЕ РЕШЕНИЕ</span>
                            <button onClick={() => setCtaDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}>
                              <X size={14} />
                            </button>
                          </div>
                          <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, margin: "6px 0", color: "var(--color-text-primary)" }}>
                            Запустите собственный SaaS-сервис уже в эти выходные
                          </div>
                          <button style={{ width: "100%", marginTop: 8, padding: "8px", background: "var(--color-accent)", color: "#fff", border: "1px solid var(--color-accent)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            Смотреть маршрут →
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setCtaDismissed(false)} style={{ padding: "6px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: 11, cursor: "pointer" }}>
                          Показать плашку CTA
                        </button>
                      )}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 13: ANNOUNCEMENT BAR */}
                  {/* ========================================================================= */}
                  {pattern.slug === "announcement-bar" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      {!announcementClosed ? (
                        <div style={{ width: "100%", background: "var(--color-accent)", color: "#fff", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, fontWeight: 700 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Sparkles size={14} />
                            <span>Новый релиз: Открыт интерактивный UI-Атлас для AI-инженеров</span>
                          </div>
                          <button onClick={() => setAnnouncementClosed(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setAnnouncementClosed(false)} style={{ alignSelf: "center", padding: "6px 12px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: 11, cursor: "pointer" }}>
                          Восстановить полосу анонса
                        </button>
                      )}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 14: LOGO MARQUEE */}
                  {/* ========================================================================= */}
                  {pattern.slug === "logo-marquee" && (
                    <div style={{ width: "100%", overflow: "hidden", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "14px 0", position: "relative" }}>
                      <div style={{ display: "flex", gap: 16, width: "max-content", animation: "marquee 20s linear infinite" }}>
                        {["NEXT.JS 16", "TYPESCRIPT", "PRISMA 7", "POSTGRESQL", "DOCKER", "DEEPSEEK V3", "CLAUDE 3.7", "NEXT.JS 16", "TYPESCRIPT", "PRISMA 7"].map((item, i) => (
                          <div key={i} style={{ padding: "6px 14px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-text-secondary)" }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 15: RESPONSIVE GALLERY */}
                  {/* ========================================================================= */}
                  {pattern.slug === "responsive-gallery" && (
                    <div style={{ width: "100%", display: "grid", gridTemplateColumns: viewportMode === "mobile" ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
                      {[
                        { title: "SaaS Dashboard UI", tag: "SaaS", h: 100 },
                        { title: "AI Agent Workspace", tag: "Agent", h: 140 },
                        { title: "Billing Matrix Pro", tag: "Pricing", h: 110 },
                      ].map((item, i) => (
                        <div key={i} style={{ minHeight: item.h, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", background: "var(--color-accent-light)", color: "var(--color-accent)", border: "1px solid var(--color-accent)", padding: "2px 6px", width: "fit-content", fontWeight: 700 }}>
                            {item.tag}
                          </span>
                          <div style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{item.title}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 16: BEFORE AFTER SLIDER */}
                  {/* ========================================================================= */}
                  {pattern.slug === "before-after-slider" && (
                    <div
                      onMouseDown={() => (isDraggingSlider.current = true)}
                      onMouseUp={() => (isDraggingSlider.current = false)}
                      onMouseMove={(e) => {
                        if (!isDraggingSlider.current) return;
                        handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect());
                      }}
                      onTouchMove={(e) => {
                        handleSliderMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                      }}
                      style={{
                        position: "relative",
                        width: "100%",
                        height: 220,
                        border: "2px solid var(--color-border)",
                        background: "var(--color-bg-primary)",
                        overflow: "hidden",
                        userSelect: "none",
                        cursor: "ew-resize",
                      }}
                    >
                      {/* After (Background) */}
                      <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--color-bg-primary)" }}>
                        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 800 }}>● ПОСЛЕ (PROEKTMAP 0PX)</span>
                        <h3 style={{ fontSize: "var(--text-m)", fontWeight: 900, color: "var(--color-text-primary)", margin: "4px 0" }}>Чистая архитектура за 3 вечера</h3>
                        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: 0 }}>Строгие токены, z-index изоляция, отсутствие 404 ошибок.</p>
                      </div>

                      {/* Before (Clipped) */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          padding: 20,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          background: "var(--color-bg-tertiary)",
                          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                          borderRight: "2px solid var(--color-accent)",
                        }}
                      >
                        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", fontWeight: 800 }}>✕ ДО (ХАОТИЧНЫЙ КОДИНГ)</span>
                        <h3 style={{ fontSize: "var(--text-m)", fontWeight: 900, color: "var(--color-text-primary)", opacity: 0.6, margin: "4px 0" }}>Месяцы правок и сбоев</h3>
                        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", opacity: 0.6, margin: 0 }}>Случайные промпты и конфликты гидратации.</p>
                      </div>

                      {/* Handle */}
                      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sliderPos}%`, width: 2, background: "var(--color-accent)", pointerEvents: "none" }}>
                        <div style={{ position: "absolute", top: "50%", transform: "translate(-50%, -50%)", padding: "3px 6px", background: "var(--color-accent)", color: "#fff", fontSize: 9, fontWeight: 800 }}>
                          ◄ ►
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 17: SCROLL REVEAL */}
                  {/* ========================================================================= */}
                  {pattern.slug === "scroll-reveal" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                      <button
                        onClick={() => setRevealTrigger((prev) => prev + 1)}
                        style={{
                          padding: "6px 12px",
                          background: "var(--color-accent)",
                          color: "#fff",
                          border: "1px solid var(--color-accent)",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Перезапустить каскадную анимацию
                      </button>
                      <div key={revealTrigger} style={{ width: "100%", display: "grid", gridTemplateColumns: viewportMode === "mobile" ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
                        {[
                          { title: "1. Архитектура", delay: "0.1s" },
                          { title: "2. Сборка AI", delay: "0.25s" },
                          { title: "3. Деплой PM2", delay: "0.4s" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: 16,
                              background: "var(--color-bg-primary)",
                              border: "1px solid var(--color-border)",
                              animation: `fadeInUp 0.4s ease forwards ${item.delay}`,
                            }}
                          >
                            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 700 }}>STAGGER: {item.delay}</div>
                            <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, marginTop: 4 }}>{item.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 18: STICKY SIDEBAR */}
                  {/* ========================================================================= */}
                  {pattern.slug === "sticky-sidebar" && (
                    <div style={{ width: "100%", display: "grid", gridTemplateColumns: viewportMode === "mobile" ? "1fr" : "1fr 180px", gap: 12, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: 14 }}>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 800, color: "var(--color-text-primary)", marginBottom: 4 }}>Контент статьи или решения</div>
                        По мере скролла страницы боковая панель плавно фиксируется в зоне видимости и подсвечивает текущий активный раздел.
                      </div>
                      <div style={{ borderLeft: "1px solid var(--color-border)", paddingLeft: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                        {[
                          { id: "arch", title: "1. Стек и модели" },
                          { id: "db", title: "2. Схема базы данных" },
                          { id: "deploy", title: "3. Запуск и деплой" },
                        ].map((item) => {
                          const isActive = activeTocId === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveTocId(item.id)}
                              style={{
                                background: "none",
                                border: "none",
                                textAlign: "left",
                                fontSize: 11,
                                fontWeight: isActive ? 800 : 500,
                                color: isActive ? "var(--color-accent)" : "var(--color-text-tertiary)",
                                cursor: "pointer",
                                borderLeft: isActive ? "2px solid var(--color-accent)" : "none",
                                paddingLeft: isActive ? 6 : 0,
                                marginLeft: isActive ? -11 : 0,
                              }}
                            >
                              {item.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 19: STACKING CARDS */}
                  {/* ========================================================================= */}
                  {pattern.slug === "stacking-cards" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { step: 1, title: "01. Архитектура и стек", desc: "Проектируем схему данных и исключаем конфликты z-index" },
                        { step: 2, title: "02. AI-генерация в Cursor", desc: "Генерируем код по проверенным негативным промптам" },
                        { step: 3, title: "03. Боевой деплой с ЮKassa", desc: "Подключаем платежи и настраиваем автоперезапуск PM2" },
                      ].map((s) => {
                        const isFocused = focusedStackStep === s.step;
                        return (
                          <div
                            key={s.step}
                            onClick={() => setFocusedStackStep(s.step)}
                            style={{
                              padding: "14px",
                              background: "var(--color-bg-primary)",
                              border: isFocused ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                              boxShadow: isFocused ? "0 8px 24px rgba(37,99,235,0.15)" : "none",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: isFocused ? "var(--color-accent)" : "var(--color-text-primary)" }}>
                              {s.title}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{s.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 20: COMMAND PALETTE */}
                  {/* ========================================================================= */}
                  {pattern.slug === "command-palette" && (
                    <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", background: "var(--color-bg-primary)", border: "2px solid var(--color-accent)", boxShadow: "0 16px 40px rgba(0,0,0,0.2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--color-border)" }}>
                        <Search size={14} color="var(--color-text-tertiary)" />
                        <input
                          type="text"
                          value={cmdSearchQuery}
                          onChange={(e) => setCmdSearchQuery(e.target.value)}
                          placeholder="Поиск решений, паттернов (Cmd+K)..."
                          style={{ width: "100%", border: "none", background: "transparent", fontSize: "var(--text-xs)", outline: "none", color: "var(--color-text-primary)" }}
                        />
                        <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", padding: "1px 4px" }}>
                          ESC
                        </span>
                      </div>
                      <div style={{ padding: "6px 0", maxHeight: 160, overflowY: "auto", fontSize: 11 }}>
                        <div style={{ padding: "4px 14px", fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
                          Готовые решения
                        </div>
                        <div style={{ padding: "6px 14px", background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                          <span>⚡ Запустить SaaS-продукт под ключ</span>
                          <span>↵</span>
                        </div>
                        <div style={{ padding: "6px 14px", color: "var(--color-text-secondary)", display: "flex", justifyContent: "space-between" }}>
                          <span>🤖 Telegram AI-бот с подпиской</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PATTERN 21: FLOATING PULSE BUTTON */}
                  {/* ========================================================================= */}
                  {pattern.slug === "floating-pulse-button" && (
                    <div style={{ width: "100%", height: "100%", minHeight: 280, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      {/* Controls Bar */}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: 10, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: 11 }}>
                        <span style={{ fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", fontSize: 9 }}>Интерактивный тест:</span>
                        <button
                          onClick={() => setPulsePosition(pulsePosition === "left" ? "right" : "left")}
                          style={{ padding: "4px 8px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                        >
                          Позиция: {pulsePosition === "left" ? "Слева" : "Справа"}
                        </button>
                        <button
                          onClick={() => setPulseShape(pulseShape === "circle" ? "square" : "circle")}
                          style={{ padding: "4px 8px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                        >
                          Форма: {pulseShape === "circle" ? "Круглая (50%)" : "Строгая (0px)"}
                        </button>
                        <button
                          onClick={() => setPulseActive(!pulseActive)}
                          style={{ padding: "4px 8px", background: pulseActive ? "var(--color-accent-light)" : "var(--color-bg-secondary)", color: pulseActive ? "var(--color-accent)" : "var(--color-text-primary)", border: "1px solid var(--color-border)", cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                        >
                          Волна: {pulseActive ? "ВКЛ" : "ВЫКЛ"}
                        </button>
                      </div>

                      {/* Mock Page Content */}
                      <div style={{ padding: "16px 20px", color: "var(--color-text-secondary)", fontSize: "var(--text-xs)" }}>
                        <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 800 }}>LIVE DEMO VIEWPORT</div>
                        <h4 style={{ fontSize: "var(--text-s)", fontWeight: 800, color: "var(--color-text-primary)", margin: "4px 0" }}>Тестирование плавающего триггера</h4>
                        <p style={{ margin: 0, opacity: 0.8 }}>Наведите курсор на кнопку в нижнем углу — анимация волны встанет на паузу (hover-pause), а размер плавно увеличится.</p>
                      </div>

                      {/* Keyframes style tag */}
                      <style>{`
                        @keyframes demoPulseWave {
                          0% {
                            box-shadow: 0 0 0 0 rgba(65, 75, 205, 0.75);
                          }
                          70% {
                            box-shadow: 0 0 0 22px rgba(65, 75, 205, 0);
                          }
                          100% {
                            box-shadow: 0 0 0 0 rgba(65, 75, 205, 0);
                          }
                        }
                        .demo-pulse-btn-active {
                          animation: demoPulseWave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                        .demo-pulse-btn-active:hover {
                          animation-play-state: paused !important;
                          transform: scale(1.1) !important;
                          background: #2F3A9E !important;
                        }
                      `}</style>

                      {/* The Floating Pulse Button */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 20,
                          left: pulsePosition === "left" ? 20 : "auto",
                          right: pulsePosition === "right" ? 20 : "auto",
                          zIndex: 40,
                        }}
                      >
                        <a
                          href="https://max.ru"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Открыть MAX"
                          className={pulseActive ? "demo-pulse-btn-active" : ""}
                          style={{
                            width: viewportMode === "mobile" ? 56 : 64,
                            height: viewportMode === "mobile" ? 56 : 64,
                            borderRadius: pulseShape === "circle" ? "50%" : 0,
                            background: "#414BCD",
                            border: "3px solid #ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textDecoration: "none",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            boxShadow: "0 4px 20px rgba(65, 75, 205, 0.5)",
                          }}
                        >
                          <Sparkles size={viewportMode === "mobile" ? 24 : 30} color="#ffffff" style={{ pointerEvents: "none" }} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overview & UX Strategy Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-m)" }}>
              <div
                style={{
                  padding: "var(--space-m)",
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-accent)", fontSize: "var(--text-s)", fontWeight: 700, marginBottom: "var(--space-s)" }}>
                  <Info size={16} />
                  <span>Инженерный разбор &amp; UX-логика</span>
                </div>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 12px 0" }}>
                  {pattern.overview.whatIsIt}
                </p>
                <div
                  style={{
                    padding: "var(--space-s)",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-light)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.5,
                  }}
                >
                  💡 <strong>Почему это работает:</strong> {pattern.overview.whyItWorks}
                </div>
              </div>

              <div
                style={{
                  padding: "var(--space-m)",
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-accent)", fontSize: "var(--text-s)", fontWeight: 700, marginBottom: "var(--space-s)" }}>
                  <Check size={16} />
                  <span>Где использовать</span>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                  {pattern.overview.whereToUse.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <div style={{ marginTop: "var(--space-m)", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-error)", display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    <X size={13} /> Частые архитектурные ошибки
                  </span>
                  <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
                    {pattern.overview.commonMistakes.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ANATOMY SPECIFICATION */}
        {/* ========================================================================= */}
        {activeTab === "anatomy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            <div
              style={{
                padding: "var(--space-m)",
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
                <Scan size={18} color="var(--color-accent)" />
                <h3 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: 0 }}>Анатомия и спецификация правил CSS</h3>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {pattern.anatomy.summary}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-m)" }}>
              {pattern.anatomy.points.map((pt) => {
                const isPointActive = activeAnatomyPoint === pt.id;
                return (
                  <div
                    key={pt.id}
                    onClick={() => setActiveAnatomyPoint(isPointActive ? null : pt.id)}
                    style={{
                      padding: "var(--space-m)",
                      background: "var(--color-bg-secondary)",
                      border: "1px solid",
                      borderColor: isPointActive ? "var(--color-accent)" : "var(--color-border)",
                      borderRadius: 0,
                      cursor: "pointer",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                          borderRadius: 0,
                          background: isPointActive ? "var(--color-accent)" : "var(--color-bg-tertiary)",
                          color: isPointActive ? "#fff" : "var(--color-text-primary)",
                          fontSize: 12,
                          fontWeight: 800,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {pt.id}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 6px",
                          borderRadius: 0,
                          background: "var(--color-accent-light)",
                          color: "var(--color-accent)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {pt.badge}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 6px 0" }}>
                      {pt.title}
                    </h4>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 10px 0" }}>
                      {pt.description}
                    </p>

                    <pre
                      style={{
                        margin: 0,
                        padding: "8px 10px",
                        background: "var(--color-bg-primary)",
                        border: "1px solid var(--color-border-light)",
                        borderRadius: 0,
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-accent)",
                        overflowX: "auto",
                      }}
                    >
                      {pt.cssRule}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WHY & ENGINEERING IMPACT */}
        {/* ========================================================================= */}
        {activeTab === "why" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            <div
              style={{
                padding: "var(--space-m)",
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
                <HelpCircle size={18} color="var(--color-accent)" />
                <h3 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: 0 }}>Слой инженерного понимания (WHY &amp; Consequences)</h3>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                В AI-инжиниринге важно не просто сгенерировать работающий код, а понимать последствия архитектурных решений: предотвращение Next.js Hydration Mismatch, разгрузка Main Thread на GPU и изоляция z-index.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
              {pattern.why.map((reason) => (
                <div
                  key={reason.id}
                  style={{
                    padding: "var(--space-m)",
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-s)", flexWrap: "wrap", gap: 8 }}>
                    <h4 style={{ fontSize: "var(--text-s)", fontWeight: 800, color: "var(--color-text-primary)", margin: 0 }}>
                      ❓ {reason.question}
                    </h4>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        padding: "2px 8px",
                        background: "var(--color-accent-light)",
                        color: "var(--color-accent)",
                        border: "1px solid var(--color-accent)",
                        textTransform: "uppercase",
                      }}
                    >
                      {reason.impactTag}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginTop: 12 }}>
                    <div style={{ padding: 12, background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 700, textTransform: "uppercase" }}>
                        ✓ ПРАВИЛЬНЫЙ ПРИНЦИП
                      </span>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-primary)", fontWeight: 600, margin: "6px 0 0 0" }}>
                        {reason.principle}
                      </p>
                    </div>

                    <div style={{ padding: 12, background: "var(--color-bg-primary)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-error)", fontWeight: 700, textTransform: "uppercase" }}>
                        ✕ ПЛОХАЯ АЛЬТЕРНАТИВА
                      </span>
                      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "6px 0 0 0" }}>
                        {reason.badAlternative}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(239, 68, 68, 0.05)", borderLeft: "3px solid var(--color-error)", fontSize: 11, color: "var(--color-text-secondary)" }}>
                    <strong style={{ color: "var(--color-error)" }}>Последствия ошибки:</strong> {reason.consequence}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills acquired */}
            {pattern.skills.length > 0 && (
              <div style={{ marginTop: "var(--space-m)" }}>
                <h4 style={{ fontSize: "var(--text-s)", fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <Award size={16} color="var(--color-accent)" />
                  <span>Приобретаемые навыки AI-инженера</span>
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                  {pattern.skills.map((sk) => (
                    <div key={sk.id} style={{ padding: 12, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{sk.title}</span>
                        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", textTransform: "uppercase" }}>
                          {sk.level}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4, margin: 0 }}>
                        {sk.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AI PROMPTS & NEGATIVE PROMPTS */}
        {/* ========================================================================= */}
        {activeTab === "prompt" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            {/* Model Target Switcher */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {pattern.prompts.map((p) => {
                const isSelected = selectedTarget === p.target;
                return (
                  <button
                    key={p.target}
                    type="button"
                    onClick={() => setSelectedTarget(p.target)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 0,
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                      background: isSelected ? "var(--color-accent)" : "var(--color-bg-secondary)",
                      color: isSelected ? "#ffffff" : "var(--color-text-primary)",
                    }}
                  >
                    {p.targetLabel}
                  </button>
                );
              })}
            </div>

            {/* Prompt Configurator */}
            {pattern.promptVariables.length > 0 && (
              <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, textTransform: "uppercase", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", marginBottom: 12 }}>
                  Настройка параметров промпта:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                  {pattern.promptVariables.map((v) => (
                    <div key={v.id}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                        {v.label}
                      </label>
                      <select
                        value={variableValues[v.id] || v.defaultValue}
                        onChange={(e) => setVariableValues({ ...variableValues, [v.id]: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: 0,
                          border: "1px solid var(--color-border)",
                          background: "var(--color-bg-primary)",
                          color: "var(--color-text-primary)",
                          fontSize: "var(--text-xs)",
                        }}
                      >
                        {v.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt View Box */}
            <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
              <div style={{ padding: "10px var(--space-m)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-bg-tertiary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={14} color="var(--color-accent)" />
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>
                    {currentPromptVariant.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    background: "var(--color-accent)",
                    color: "#fff",
                    border: "none",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedPrompt ? "Скопировано!" : "Копировать"}</span>
                </button>
              </div>

              <pre style={{ margin: 0, padding: "var(--space-m)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {computedPromptText}
              </pre>

              {currentPromptVariant.negativePrompt && (
                <div style={{ padding: "var(--space-m)", borderTop: "1px solid rgba(239, 68, 68, 0.2)", background: "rgba(239, 68, 68, 0.03)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-error)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
                    ⛔ Negative Prompt (Ограничения для AI):
                  </div>
                  <pre style={{ margin: 0, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                    {currentPromptVariant.negativePrompt}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PRODUCTION CODE */}
        {/* ========================================================================= */}
        {activeTab === "code" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            {/* File Tabs */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { id: "component", label: `${pattern.slug}.tsx` },
                  { id: "usage", label: "Usage.tsx (Импорт)" },
                  { id: "tokens", label: "design-tokens.css" },
                ].map((tab) => {
                  const isSelected = selectedCodeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedCodeTab(tab.id as any)}
                      style={{
                        padding: "6px 14px",
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        border: "1px solid",
                        borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                        background: isSelected ? "var(--color-accent)" : "var(--color-bg-secondary)",
                        color: isSelected ? "#fff" : "var(--color-text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "var(--color-accent)",
                  color: "#fff",
                  border: "1px solid var(--color-accent)",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedCode ? "Код скопирован!" : "Копировать код"}</span>
              </button>
            </div>

            {/* Code Box */}
            <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
              <div style={{ padding: "8px 14px", background: "var(--color-bg-tertiary)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)" }}>
                  Path: src/components/ui/{pattern.slug}.tsx
                </span>
                <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>
                  TypeScript • 0px Radius
                </span>
              </div>

              <pre style={{ margin: 0, padding: "var(--space-m)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", overflowX: "auto", lineHeight: 1.6 }}>
                {selectedCodeTab === "component" && (pattern.codeSnippets[0]?.code || "// Код компонента")}
                {selectedCodeTab === "usage" &&
                  `// Пример подключения в Next.js (App Router)
import React from 'react';
import { ${pattern.title.replace(/[^a-zA-Z]/g, "")} } from '@/components/ui/${pattern.slug}';

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <${pattern.title.replace(/[^a-zA-Z]/g, "")} />
    </main>
  );
}`}
                {selectedCodeTab === "tokens" &&
                  `/* ProektMap Standard Design Tokens */
:root {
  --color-accent: #2563eb;
  --color-accent-light: rgba(37, 99, 235, 0.08);
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --radius-strict: 0px;
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Linked Recipes Footer */}
        {linkedRecipes.length > 0 && (
          <div style={{ marginTop: "var(--space-2xl)", paddingTop: "var(--space-l)", borderTop: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-m)" }}>
              <Layers size={18} color="var(--color-accent)" />
              <h3 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: 0 }}>
                Готовые рецепты экранов с этим паттерном
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-m)" }}>
              {linkedRecipes.map((rec) => (
                <div key={rec.id} style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 700, textTransform: "uppercase" }}>
                    РЕЦЕПТ СБОРКИ • {rec.category}
                  </span>
                  <h4 style={{ fontSize: "var(--text-s)", fontWeight: 800, margin: "6px 0", color: "var(--color-text-primary)" }}>
                    {rec.titleRu}
                  </h4>
                  <p style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 12px 0" }}>
                    {rec.description}
                  </p>
                  <Link
                    href="/ui-patterns/recipes"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--color-accent)",
                      textDecoration: "none",
                    }}
                  >
                    <span>Открыть Master-промпт рецепта</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
