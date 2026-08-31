"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Code,
  Sparkles,
  Smartphone,
  Monitor,
  Settings2,
  Layers,
  ArrowRight,
  ExternalLink,
  Volume2,
  Sliders,
  Palette,
  Eye,
  FileText,
  Download,
  Flame,
  CheckCircle2,
  Radio,
  Zap,
} from "lucide-react";

export interface CustomRouteConfig {
  id: string;
  route: string;
  title: string;
  voice: "svetlana-fast" | "svetlana" | "dmitry-fast" | "dmitry";
  text: string;
  durationSec: number;
  actions: { label: string; href: string; primary?: boolean }[];
}

export interface WidgetCustomization {
  themeColor: string;
  position: "bottom-right" | "bottom-left";
  mode: "ask" | "auto" | "off";
  badgeText: string;
  showWave: boolean;
}

const PRESET_TEMPLATES: Record<string, { name: string; desc: string; routes: CustomRouteConfig[] }> = {
  saas: {
    name: "SaaS / AI-сервис",
    desc: "Шаблон для продуктовых стартапов, сервисов подписок и веб-приложений.",
    routes: [
      {
        id: "home",
        route: "/",
        title: "Главная страница",
        voice: "svetlana-fast",
        text: "Привет! Мы разработали платформу автоматизации маркетинга на базе искусственного интеллекта. Попробуйте бесплатный демо-доступ и оптимизируйте ваши рутинные задачи в 3 раза быстрее.",
        durationSec: 22,
        actions: [
          { label: "Попробовать демо", href: "/demo", primary: true },
          { label: "Тарифы и цены", href: "/pricing" },
        ],
      },
      {
        id: "pricing",
        route: "/pricing",
        title: "Тарифы и цены",
        voice: "svetlana-fast",
        text: "В этом разделе представлены три простых тарифа: Стартовый для небольших проектов, Профессиональный с расширенными лимитами и Корпоративный с выделенным сервером и поддержкой 24/7.",
        durationSec: 24,
        actions: [
          { label: "Выбрать Про", href: "#pro", primary: true },
          { label: "Задать вопрос", href: "/contact" },
        ],
      },
      {
        id: "features",
        route: "/features",
        title: "Возможности",
        voice: "svetlana-fast",
        text: "Здесь вы можете изучить ключевые функции: интеграция с CRM, экспорт аналитических отчетов и готовые API для подключения к вашему стеку.",
        durationSec: 20,
        actions: [{ label: "Документация API", href: "/docs", primary: true }],
      },
    ],
  },
  shop: {
    name: "Интернет-магазин / Авито",
    desc: "Шаблон для товарного бизнеса, лендингов услуг и селлеров маркетплейсов.",
    routes: [
      {
        id: "home",
        route: "/",
        title: "Каталог товаров",
        voice: "dmitry-fast",
        text: "Здравствуйте! В нашем каталоге более тысячи проверенных товаров с гарантией от производителя. Доставляем по всей России в течение одного-двух дней, а при заказе от трех тысяч рублей доставка бесплатная.",
        durationSec: 24,
        actions: [
          { label: "Смотреть новинки", href: "/catalog", primary: true },
          { label: "Написать в WhatsApp", href: "https://wa.me/" },
        ],
      },
      {
        id: "delivery",
        route: "/delivery",
        title: "Оплата и доставка",
        voice: "dmitry-fast",
        text: "Мы принимаем оплату онлайн картой, через СБП или при получении в пункте выдачи. Вы можете проверить заказ перед оплатой.",
        durationSec: 18,
        actions: [{ label: "Рассчитать доставку", href: "#calc", primary: true }],
      },
    ],
  },
  agency: {
    name: "Агентство / Услуги",
    desc: "Шаблон для веб-студий, юристов, дизайнеров и сервисных компаний.",
    routes: [
      {
        id: "home",
        route: "/",
        title: "Наши услуги",
        voice: "svetlana-fast",
        text: "Добро пожаловать в нашу студию. Мы создаем конверсионные сайты, настраиваем рекламу и внедряем AI-ботов под ключ с гарантией соблюдения сроков по договору.",
        durationSec: 21,
        actions: [
          { label: "Рассчитать смету", href: "#contact", primary: true },
          { label: "Кейсы и портфолио", href: "/portfolio" },
        ],
      },
      {
        id: "portfolio",
        route: "/portfolio",
        title: "Портфолио проектов",
        voice: "svetlana-fast",
        text: "В портфолио собраны наши лучшие работы за последний год с реальными показателями роста конверсии и окупаемости инвестиций клиентов.",
        durationSec: 19,
        actions: [{ label: "Хочу такой же проект", href: "#order", primary: true }],
      },
    ],
  },
};

const COLOR_PALETTES = [
  { name: "Изумруд ProektMap", hex: "#0fb880" },
  { name: "Электрик Blue", hex: "#3b82f6" },
  { name: "Фиолетовый AI", hex: "#8b5cf6" },
  { name: "Коралловый", hex: "#f43f5e" },
  { name: "Янтарный", hex: "#f59e0b" },
  { name: "Бирюзовый", hex: "#06b6d4" },
  { name: "Тёмный графит", hex: "#475569" },
];

export default function VoiceGuideBuilderWorkspace() {
  const [routes, setRoutes] = useState<CustomRouteConfig[]>(PRESET_TEMPLATES.saas.routes);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"routes" | "design" | "code">("routes");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCodePlatform, setActiveCodePlatform] = useState<"script" | "tilda" | "react" | "json">("script");

  // Customization
  const [customization, setCustomization] = useState<WidgetCustomization>({
    themeColor: "#0fb880",
    position: "bottom-right",
    mode: "ask",
    badgeText: "Голосовой гид",
    showWave: true,
  });

  // Audio Preview & Generation State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [mockPagePath, setMockPagePath] = useState("/");
  const [mockWidgetState, setMockWidgetState] = useState<"prompt" | "player" | "collapsed">("prompt");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeRoute = routes[activeRouteIndex] || routes[0];

  // Синхронизация mock страницы при смене активного маршрута
  useEffect(() => {
    if (activeRoute) {
      setMockPagePath(activeRoute.route);
    }
  }, [activeRouteIndex]);

  // Остановка аудио при смене маршрута или размонтировании
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleApplyPreset = (key: string) => {
    const preset = PRESET_TEMPLATES[key];
    if (preset) {
      setRoutes(preset.routes);
      setActiveRouteIndex(0);
      setMockPagePath(preset.routes[0]?.route || "/");
    }
  };

  const handleAddRoute = () => {
    const newId = `route_${Date.now()}`;
    const newRoute: CustomRouteConfig = {
      id: newId,
      route: `/page-${routes.length + 1}`,
      title: `Новая страница ${routes.length + 1}`,
      voice: "svetlana-fast",
      text: "Кратко расскажите, о чем эта страница, какую пользу она несет посетителю и что ему сделать прямо сейчас.",
      durationSec: 18,
      actions: [{ label: "Перейти к действию", href: "#action", primary: true }],
    };
    setRoutes([...routes, newRoute]);
    setActiveRouteIndex(routes.length);
  };

  const handleRemoveRoute = (index: number) => {
    if (routes.length <= 1) return;
    const next = routes.filter((_, i) => i !== index);
    setRoutes(next);
    if (activeRouteIndex >= next.length) {
      setActiveRouteIndex(next.length - 1);
    }
  };

  const handleUpdateActiveRoute = (field: keyof CustomRouteConfig, val: any) => {
    const updated = [...routes];
    updated[activeRouteIndex] = { ...updated[activeRouteIndex], [field]: val };

    if (field === "text") {
      const len = String(val).trim().length;
      updated[activeRouteIndex].durationSec = Math.max(10, Math.round(len / 13));
    }

    setRoutes(updated);
  };

  const handleAddAction = () => {
    if (!activeRoute || activeRoute.actions.length >= 3) return;
    const nextActions = [...activeRoute.actions, { label: "Новая кнопка", href: "#", primary: false }];
    handleUpdateActiveRoute("actions", nextActions);
  };

  const handleUpdateAction = (actionIdx: number, field: "label" | "href" | "primary", val: any) => {
    if (!activeRoute) return;
    const nextActions = activeRoute.actions.map((act, i) => {
      if (i === actionIdx) {
        return { ...act, [field]: val };
      }
      return act;
    });
    handleUpdateActiveRoute("actions", nextActions);
  };

  const handleRemoveAction = (actionIdx: number) => {
    if (!activeRoute) return;
    const nextActions = activeRoute.actions.filter((_, i) => i !== actionIdx);
    handleUpdateActiveRoute("actions", nextActions);
  };

  // Живой тест синтеза речи через наш API
  const handleTestSynthesis = async () => {
    if (!activeRoute || !activeRoute.text.trim()) return;

    if (isPlayingPreview && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
      return;
    }

    setIsSynthesizing(true);
    try {
      const voiceName =
        activeRoute.voice === "svetlana-fast"
          ? "ru-RU-SvetlanaNeural"
          : activeRoute.voice === "dmitry-fast"
          ? "ru-RU-DmitryNeural"
          : activeRoute.voice === "dmitry"
          ? "ru-RU-DmitryNeural"
          : "ru-RU-SvetlanaNeural";

      const rate = activeRoute.voice.includes("fast") ? "+6%" : "+0%";

      const res = await fetch("/api/voice-guide/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: activeRoute.text,
          voice: voiceName,
          rate: rate,
        }),
      });

      if (!res.ok) {
        throw new Error("Ошибка синтеза речи");
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
          setPreviewProgress((audio.currentTime / audio.duration) * 100);
        }
      });

      audio.addEventListener("ended", () => {
        setIsPlayingPreview(false);
        setPreviewProgress(0);
      });

      await audio.play();
      setIsPlayingPreview(true);
      setMockWidgetState("player");
    } catch (err) {
      console.error(err);
      alert("Не удалось синтезировать голос. Попробуйте снова через несколько секунд.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Пакетная генерация и переход к коду
  const handleGenerateEmbedCode = async () => {
    setIsGeneratingAll(true);
    try {
      // Предварительный прогрев кэша на сервере для всех страниц
      await Promise.all(
        routes.map(async (r) => {
          if (!r.text.trim()) return;
          const voiceName =
            r.voice === "svetlana-fast"
              ? "ru-RU-SvetlanaNeural"
              : r.voice === "dmitry-fast"
              ? "ru-RU-DmitryNeural"
              : r.voice === "dmitry"
              ? "ru-RU-DmitryNeural"
              : "ru-RU-SvetlanaNeural";
          const rate = r.voice.includes("fast") ? "+6%" : "+0%";

          await fetch("/api/voice-guide/synthesize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: r.text,
              voice: voiceName,
              rate: rate,
            }),
          }).catch(() => {});
        })
      );

      setActiveTab("code");
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // Генерация кодов для вставки
  const generateEmbedJSON = () => {
    const config = {
      theme: customization.themeColor,
      position: customization.position,
      mode: customization.mode,
      routes: routes.map((r) => ({
        route: r.route,
        title: r.title,
        voice: r.voice,
        duration: r.durationSec,
        text: r.text,
        actions: r.actions,
      })),
    };
    return JSON.stringify(config, null, 2);
  };

  const getEmbedScriptCode = () => {
    const jsonRoutes = JSON.stringify(
      routes.map((r) => ({
        route: r.route,
        title: r.title,
        voice: r.voice,
        duration: r.durationSec,
        text: r.text,
        actions: r.actions,
      }))
    ).replace(/"/g, "&quot;");

    return `<!-- ProektMap Voice Guide Widget -->
<script
  src="https://proektmap.ru/vguide/widget.js"
  data-theme="${customization.themeColor}"
  data-position="${customization.position}"
  data-mode="${customization.mode}"
  data-routes="${jsonRoutes}"
  async>
</script>`;
  };

  const getTildaCode = () => {
    return `<!-- Вставьте этот код в блок T123 (HTML-код) на всех страницах или в Head сайта -->
${getEmbedScriptCode()}`;
  };

  const getReactCode = () => {
    const cleanRoutes = routes.map((r) => ({
      route: r.route,
      title: r.title,
      voice: r.voice,
      duration: r.durationSec,
      text: r.text,
      actions: r.actions,
    }));

    return `import Script from "next/script";

export default function VoiceGuide() {
  const routes = ${JSON.stringify(cleanRoutes, null, 2)};

  return (
    <Script
      src="https://proektmap.ru/vguide/widget.js"
      data-theme="${customization.themeColor}"
      data-position="${customization.position}"
      data-mode="${customization.mode}"
      data-routes={JSON.stringify(routes)}
      strategy="afterInteractive"
    />
  );
}`;
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Top Banner & Presets Bar */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(15, 184, 128, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)",
          border: "1px solid rgba(15, 184, 128, 0.3)",
          borderRadius: "var(--radius-l)",
          padding: "24px 28px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background: "rgba(15, 184, 128, 0.2)",
                color: "var(--color-accent)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              🎙️ Без API-ключей и оплат
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              Microsoft Svetlana & Dmitry Neural
            </span>
          </div>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, margin: "0 0 6px" }}>
            Конструктор голосового проводника для вашего сайта
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Настройте аудиогиды для 2–5 ключевых страниц, выберите дизайн виджета и получите готовый скрипт для Tilda, WordPress, React или обычного HTML.
          </p>
        </div>

        {/* Action Button & Quick Presets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
          <button
            onClick={handleGenerateEmbedCode}
            disabled={isGeneratingAll}
            style={{
              padding: "12px 22px",
              borderRadius: "var(--radius-m)",
              background: "linear-gradient(135deg, #0fb880 0%, #0d9668 100%)",
              color: "#ffffff",
              border: "none",
              fontSize: "var(--text-s)",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 6px 20px rgba(15, 184, 128, 0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 184, 128, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(15, 184, 128, 0.35)";
            }}
          >
            {isGeneratingAll ? (
              <>
                <Radio size={16} className="animate-spin" />
                <span>Генерация аудио и кода...</span>
              </>
            ) : (
              <>
                <Zap size={16} fill="white" />
                <span>Сгенерировать код для вставки</span>
              </>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
              Шаблоны:
            </span>
            {Object.entries(PRESET_TEMPLATES).map(([key, item]) => (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "var(--radius-m)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Sparkles size={11} style={{ color: "var(--color-accent)" }} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-border)",
          gap: 12,
        }}
      >
        <button
          onClick={() => setActiveTab("routes")}
          style={{
            padding: "12px 20px",
            border: "none",
            borderBottom: activeTab === "routes" ? "2px solid var(--color-accent)" : "2px solid transparent",
            background: "transparent",
            color: activeTab === "routes" ? "var(--color-accent)" : "var(--color-text-secondary)",
            fontSize: "var(--text-m)",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Layers size={18} />
          <span>1. Маршруты и тексты ({routes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("design")}
          style={{
            padding: "12px 20px",
            border: "none",
            borderBottom: activeTab === "design" ? "2px solid var(--color-accent)" : "2px solid transparent",
            background: "transparent",
            color: activeTab === "design" ? "var(--color-accent)" : "var(--color-text-secondary)",
            fontSize: "var(--text-m)",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Palette size={18} />
          <span>2. Внешний вид & Live Preview</span>
        </button>

        <button
          onClick={() => setActiveTab("code")}
          style={{
            padding: "12px 20px",
            border: "none",
            borderBottom: activeTab === "code" ? "2px solid var(--color-accent)" : "2px solid transparent",
            background: "transparent",
            color: activeTab === "code" ? "var(--color-accent)" : "var(--color-text-secondary)",
            fontSize: "var(--text-m)",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Code size={18} />
          <span>3. Код для вставки</span>
        </button>
      </div>

      {/* WORKSPACE CONTENT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: activeTab === "design" ? "1fr 1fr" : "1.2fr 0.8fr",
          gap: 28,
        }}
        className="builder-grid-layout"
      >
        {/* LEFT COLUMN: Editor depending on tab */}
        <div>
          {/* TAB 1: ROUTES & TEXTS */}
          {activeTab === "routes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Route Selector Horizontal Chips */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  overflowX: "auto",
                  paddingBottom: 4,
                }}
              >
                {routes.map((r, idx) => (
                  <button
                    key={r.id || idx}
                    onClick={() => setActiveRouteIndex(idx)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "var(--radius-m)",
                      background: activeRouteIndex === idx ? "var(--color-accent)" : "var(--color-surface)",
                      color: activeRouteIndex === idx ? "#ffffff" : "var(--color-text-primary)",
                      border: "1px solid",
                      borderColor: activeRouteIndex === idx ? "var(--color-accent)" : "var(--color-border)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>{r.title || r.route}</span>
                    <span
                      style={{
                        fontSize: 10,
                        opacity: 0.8,
                        background: "rgba(0,0,0,0.2)",
                        padding: "1px 5px",
                        borderRadius: 4,
                      }}
                    >
                      {r.durationSec}с
                    </span>
                  </button>
                ))}

                <button
                  onClick={handleAddRoute}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-m)",
                    background: "rgba(15, 184, 128, 0.1)",
                    color: "var(--color-accent)",
                    border: "1px dashed var(--color-accent)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Plus size={14} />
                  <span>Добавить страницу</span>
                </button>
              </div>

              {/* Active Route Card Editor */}
              {activeRoute && (
                <div
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-l)",
                    padding: 24,
                    boxShadow: "var(--shadow-s)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 20,
                      paddingBottom: 16,
                      borderBottom: "1px solid var(--color-border-light)",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>
                        Редактирование страницы #{activeRouteIndex + 1}
                      </h3>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                        Укажите URL страницы и текст, который диктор озвучит посетителю
                      </span>
                    </div>

                    {routes.length > 1 && (
                      <button
                        onClick={() => handleRemoveRoute(activeRouteIndex)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#ef4444",
                          padding: "6px 12px",
                          borderRadius: "var(--radius-m)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Удалить страницу</span>
                      </button>
                    )}
                  </div>

                  {/* Fields: Path & Title */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 6 }}>
                        URL путь (например: /, /pricing, /about)
                      </label>
                      <input
                        type="text"
                        value={activeRoute.route}
                        onChange={(e) => handleUpdateActiveRoute("route", e.target.value)}
                        placeholder="/"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-m)",
                          background: "var(--color-bg-primary)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text-primary)",
                          fontSize: "var(--text-s)",
                          fontWeight: 500,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 6 }}>
                        Название страницы для виджета
                      </label>
                      <input
                        type="text"
                        value={activeRoute.title}
                        onChange={(e) => handleUpdateActiveRoute("title", e.target.value)}
                        placeholder="Главная страница"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-m)",
                          background: "var(--color-bg-primary)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text-primary)",
                          fontSize: "var(--text-s)",
                          fontWeight: 500,
                        }}
                      />
                    </div>
                  </div>

                  {/* Voice Selector */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 6 }}>
                      Голос диктора (Нейросеть)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateActiveRoute("voice", "svetlana-fast")}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "var(--radius-m)",
                          background: activeRoute.voice === "svetlana-fast" ? "rgba(15, 184, 128, 0.15)" : "var(--color-bg-primary)",
                          border: activeRoute.voice === "svetlana-fast" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                          color: activeRoute.voice === "svetlana-fast" ? "var(--color-accent)" : "var(--color-text-primary)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>👩 Светлана Neural (Бодрая)</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Темп +6% · Современный живой тон</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateActiveRoute("voice", "dmitry-fast")}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "var(--radius-m)",
                          background: activeRoute.voice === "dmitry-fast" ? "rgba(15, 184, 128, 0.15)" : "var(--color-bg-primary)",
                          border: activeRoute.voice === "dmitry-fast" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                          color: activeRoute.voice === "dmitry-fast" ? "var(--color-accent)" : "var(--color-text-primary)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>👨 Дмитрий Neural (Уверенный)</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Темп +4% · Презентационный мужской тон</div>
                      </button>
                    </div>
                  </div>

                  {/* Voice Script Textarea */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>
                        Текст сценария озвучки (20–35 секунд)
                      </label>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                        Символов: {activeRoute.text.length} · Примерно ~{activeRoute.durationSec} сек
                      </span>
                    </div>
                    <textarea
                      value={activeRoute.text}
                      onChange={(e) => handleUpdateActiveRoute("text", e.target.value)}
                      rows={4}
                      placeholder="Напишите краткий сценарий: 1) о чем раздел, 2) какую пользу несет, 3) что сделать..."
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "var(--radius-m)",
                        background: "var(--color-bg-primary)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                        fontSize: "var(--text-s)",
                        lineHeight: 1.5,
                        resize: "vertical",
                      }}
                    />

                    {/* Test Play Synthesis Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                      <button
                        onClick={handleTestSynthesis}
                        disabled={isSynthesizing}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "var(--radius-m)",
                          background: isPlayingPreview ? "var(--color-warning)" : "var(--color-accent)",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "var(--text-xs)",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: "0 4px 14px rgba(15,184,128,0.3)",
                        }}
                      >
                        {isSynthesizing ? (
                          <>
                            <Radio size={14} className="animate-spin" />
                            <span>Синтез аудио...</span>
                          </>
                        ) : isPlayingPreview ? (
                          <>
                            <Pause size={14} />
                            <span>Остановить воспроизведение</span>
                          </>
                        ) : (
                          <>
                            <Play size={14} fill="white" />
                            <span>Прослушать как звучит</span>
                          </>
                        )}
                      </button>

                      {isPlayingPreview && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600 }}>
                          <Volume2 size={15} />
                          <span>Диктор говорит...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions / CTA Buttons */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, display: "block" }}>
                          Кнопки быстрых действий (после прослушивания)
                        </label>
                        <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                          Показываются посетителю после окончания фразы
                        </span>
                      </div>

                      {activeRoute.actions.length < 3 && (
                        <button
                          onClick={handleAddAction}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "var(--radius-s)",
                            background: "rgba(15, 184, 128, 0.12)",
                            border: "1px solid var(--color-accent)",
                            color: "var(--color-accent)",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Plus size={12} />
                          <span>Добавить кнопку</span>
                        </button>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {activeRoute.actions.map((act, actIdx) => (
                        <div
                          key={actIdx}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1.2fr 1.2fr auto auto",
                            gap: 8,
                            alignItems: "center",
                            background: "var(--color-bg-primary)",
                            padding: "8px 10px",
                            borderRadius: "var(--radius-m)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <input
                            type="text"
                            value={act.label}
                            onChange={(e) => handleUpdateAction(actIdx, "label", e.target.value)}
                            placeholder="Текст кнопки (например: Попробовать)"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "var(--radius-s)",
                              background: "var(--color-surface)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-text-primary)",
                              fontSize: "var(--text-xs)",
                            }}
                          />
                          <input
                            type="text"
                            value={act.href}
                            onChange={(e) => handleUpdateAction(actIdx, "href", e.target.value)}
                            placeholder="Ссылка (/pricing или https://...)"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "var(--radius-s)",
                              background: "var(--color-surface)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-text-primary)",
                              fontSize: "var(--text-xs)",
                            }}
                          />
                          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={!!act.primary}
                              onChange={(e) => handleUpdateAction(actIdx, "primary", e.target.checked)}
                              style={{ accentColor: "var(--color-accent)" }}
                            />
                            <span>Главная</span>
                          </label>
                          <button
                            onClick={() => handleRemoveAction(actIdx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--color-text-tertiary)",
                              cursor: "pointer",
                              padding: 4,
                            }}
                            title="Удалить кнопку"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTON */}
                  <div
                    style={{
                      borderTop: "1px solid var(--color-border-light)",
                      paddingTop: 18,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={handleGenerateEmbedCode}
                      disabled={isGeneratingAll}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "var(--radius-m)",
                        background: "var(--color-accent)",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "var(--text-s)",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 4px 14px rgba(15, 184, 128, 0.3)",
                      }}
                    >
                      <Zap size={15} fill="white" />
                      <span>Сгенерировать код для вставки →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DESIGN & CUSTOMIZATION */}
          {activeTab === "design" && (
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-l)",
                padding: 24,
                boxShadow: "var(--shadow-s)",
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              <div>
                <h3 style={{ fontSize: "var(--text-l)", fontWeight: 700, margin: "0 0 4px" }}>
                  Настройки внешнего вида виджета
                </h3>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                  Настройте цвета и логику появления виджета под фирменный стиль вашего сайта
                </span>
              </div>

              {/* Theme Color Picker */}
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 8 }}>
                  Цвет акцента (кнопки, волна, рамка)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {COLOR_PALETTES.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setCustomization({ ...customization, themeColor: c.hex })}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c.hex,
                        border: customization.themeColor === c.hex ? "3px solid #ffffff" : "2px solid transparent",
                        boxShadow: customization.themeColor === c.hex ? "0 0 0 2px " + c.hex : "none",
                        cursor: "pointer",
                        transition: "transform 0.15s",
                      }}
                      title={c.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={customization.themeColor}
                    onChange={(e) => setCustomization({ ...customization, themeColor: e.target.value })}
                    style={{ width: 34, height: 34, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }}
                    title="Выбрать свой цвет"
                  />
                </div>
              </div>

              {/* Widget Position */}
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 8 }}>
                  Позиция на экране
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button
                    onClick={() => setCustomization({ ...customization, position: "bottom-right" })}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "var(--radius-m)",
                      background: customization.position === "bottom-right" ? "rgba(15, 184, 128, 0.15)" : "var(--color-bg-primary)",
                      border: customization.position === "bottom-right" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                      color: customization.position === "bottom-right" ? "var(--color-accent)" : "var(--color-text-primary)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    👉 Справа внизу (стандарт)
                  </button>
                  <button
                    onClick={() => setCustomization({ ...customization, position: "bottom-left" })}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "var(--radius-m)",
                      background: customization.position === "bottom-left" ? "rgba(15, 184, 128, 0.15)" : "var(--color-bg-primary)",
                      border: customization.position === "bottom-left" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                      color: customization.position === "bottom-left" ? "var(--color-accent)" : "var(--color-text-primary)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    👈 Слева внизу
                  </button>
                </div>
              </div>

              {/* Behavior Mode */}
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 8 }}>
                  Режим поведения по умолчанию
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-m)",
                      background: customization.mode === "ask" ? "rgba(15, 184, 128, 0.1)" : "var(--color-bg-primary)",
                      border: "1px solid",
                      borderColor: customization.mode === "ask" ? "var(--color-accent)" : "var(--color-border)",
                      cursor: "pointer",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      checked={customization.mode === "ask"}
                      onChange={() => setCustomization({ ...customization, mode: "ask" })}
                      style={{ accentColor: "var(--color-accent)" }}
                    />
                    <div>
                      <div>Спрашивать перед чтением (рекомендуется)</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 400 }}>
                        Показывает карточку-приглашение «Послушать 20 сек?». Не нарушает политику Autoplay в браузерах.
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-m)",
                      background: customization.mode === "auto" ? "rgba(15, 184, 128, 0.1)" : "var(--color-bg-primary)",
                      border: "1px solid",
                      borderColor: customization.mode === "auto" ? "var(--color-accent)" : "var(--color-border)",
                      cursor: "pointer",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      checked={customization.mode === "auto"}
                      onChange={() => setCustomization({ ...customization, mode: "auto" })}
                      style={{ accentColor: "var(--color-accent)" }}
                    />
                    <div>
                      <div>Автовоспроизведение при входе</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 400 }}>
                        Запускает аудиогид автоматически после первого клика пользователя по странице.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Badge Text */}
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 6 }}>
                  Текст бейджа
                </label>
                <input
                  type="text"
                  value={customization.badgeText}
                  onChange={(e) => setCustomization({ ...customization, badgeText: e.target.value })}
                  placeholder="Голосовой гид"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-m)",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                    fontSize: "var(--text-s)",
                  }}
                />
              </div>

              {/* BOTTOM ACTION BUTTON */}
              <div
                style={{
                  borderTop: "1px solid var(--color-border-light)",
                  paddingTop: 18,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={handleGenerateEmbedCode}
                  disabled={isGeneratingAll}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "var(--radius-m)",
                    background: "var(--color-accent)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "var(--text-s)",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(15, 184, 128, 0.3)",
                  }}
                >
                  <Zap size={15} fill="white" />
                  <span>Сгенерировать код для вставки →</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CODE EXPORT */}
          {activeTab === "code" && (
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-l)",
                padding: 24,
                boxShadow: "var(--shadow-s)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: "rgba(15, 184, 128, 0.15)",
                      color: "var(--color-accent)",
                    }}
                  >
                    ✓ ГОТОВО К ВСТАВКЕ
                  </span>
                </div>
                <h3 style={{ fontSize: "var(--text-l)", fontWeight: 700, margin: "0 0 4px" }}>
                  Готовый код для вашего сайта
                </h3>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                  Скопируйте скрипт и вставьте его перед закрывающим тегом &lt;/body&gt; или в Head вашего сайта
                </span>
              </div>

              {/* Platform Selector */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { id: "script", name: "🚀 Универсальный HTML" },
                  { id: "tilda", name: "🟧 Tilda (Блок T123)" },
                  { id: "react", name: "⚛️ React / Next.js" },
                  { id: "json", name: "📄 JSON-конфиг" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveCodePlatform(p.id as any)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "var(--radius-m)",
                      background: activeCodePlatform === p.id ? "var(--color-accent)" : "var(--color-bg-primary)",
                      color: activeCodePlatform === p.id ? "#ffffff" : "var(--color-text-primary)",
                      border: "1px solid",
                      borderColor: activeCodePlatform === p.id ? "var(--color-accent)" : "var(--color-border)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Code Display Area */}
              <div style={{ position: "relative" }}>
                <pre
                  style={{
                    background: "#0d1117",
                    color: "#58a6ff",
                    padding: "16px 20px",
                    borderRadius: "var(--radius-m)",
                    fontSize: 12,
                    fontFamily: "monospace",
                    overflowX: "auto",
                    lineHeight: 1.5,
                    border: "1px solid rgba(255,255,255,0.1)",
                    maxHeight: 280,
                  }}
                >
                  <code>
                    {activeCodePlatform === "script" && getEmbedScriptCode()}
                    {activeCodePlatform === "tilda" && getTildaCode()}
                    {activeCodePlatform === "react" && getReactCode()}
                    {activeCodePlatform === "json" && generateEmbedJSON()}
                  </code>
                </pre>

                <button
                  onClick={() => {
                    const code =
                      activeCodePlatform === "script"
                        ? getEmbedScriptCode()
                        : activeCodePlatform === "tilda"
                        ? getTildaCode()
                        : activeCodePlatform === "react"
                        ? getReactCode()
                        : generateEmbedJSON();
                    handleCopyCode(code);
                  }}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    padding: "6px 12px",
                    borderRadius: "var(--radius-s)",
                    background: copiedCode ? "var(--color-accent)" : "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {copiedCode ? (
                    <>
                      <Check size={13} />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Скопировать код</span>
                    </>
                  )}
                </button>
              </div>

              {/* Integration Helper Cards */}
              <div
                style={{
                  background: "rgba(15, 184, 128, 0.06)",
                  border: "1px solid rgba(15, 184, 128, 0.2)",
                  borderRadius: "var(--radius-m)",
                  padding: "14px 18px",
                  fontSize: "var(--text-xs)",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: 4 }}>
                  💡 Как подключить к Tilda за 1 минуту:
                </div>
                <ol style={{ margin: 0, paddingLeft: 18, color: "var(--color-text-secondary)" }}>
                  <li>Добавьте на страницу блок <b>T123 (HTML-код)</b> из раздела «Другое».</li>
                  <li>Вставьте скопированный скрипт в поле блока и опубликуйте страницу.</li>
                  <li>Виджет автоматически начнет приветствовать ваших посетителей!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE MOCKUP */}
        <div>
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-l)",
              padding: 20,
              boxShadow: "var(--shadow-s)",
              position: "sticky",
              top: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)" }}>
                  ● LIVE ИНТЕРАКТИВНЫЙ МАКЕТ
                </span>
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  style={{
                    background: previewDevice === "desktop" ? "var(--color-accent)" : "transparent",
                    color: previewDevice === "desktop" ? "#fff" : "var(--color-text-tertiary)",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  title="Десктопная версия"
                >
                  <Monitor size={15} />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  style={{
                    background: previewDevice === "mobile" ? "var(--color-accent)" : "transparent",
                    color: previewDevice === "mobile" ? "#fff" : "var(--color-text-tertiary)",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  title="Мобильная версия"
                >
                  <Smartphone size={15} />
                </button>
              </div>
            </div>

            {/* Mockup Browser Window */}
            <div
              style={{
                background: "#0e1117",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                maxWidth: previewDevice === "mobile" ? 320 : "100%",
                margin: "0 auto",
                minHeight: 400,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Browser Header Bar */}
              <div
                style={{
                  background: "#161b22",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "center",
                    fontFamily: "monospace",
                  }}
                >
                  https://yoursite.com{activeRoute?.route || "/"}
                </div>
              </div>

              {/* Mock Page Content */}
              <div style={{ padding: "18px 16px", flex: 1, color: "#fff" }}>
                <div style={{ width: "40%", height: 12, background: "rgba(255,255,255,0.15)", borderRadius: 4, marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: "#f8fafc" }}>
                  {activeRoute?.title || "Заголовок страницы"}
                </div>
                <div style={{ width: "90%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginBottom: 6 }} />
                <div style={{ width: "75%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginBottom: 16 }} />

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 80, height: 26, borderRadius: 6, background: customization.themeColor, opacity: 0.8 }} />
                  <div style={{ width: 80, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.1)" }} />
                </div>
              </div>

              {/* MOCK WIDGET OVERLAY INSIDE PREVIEW */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  [customization.position === "bottom-left" ? "left" : "right"]: 14,
                  zIndex: 20,
                  maxWidth: 290,
                }}
              >
                {/* 1. Prompt State */}
                {mockWidgetState === "prompt" && (
                  <div
                    style={{
                      background: "rgba(18, 20, 29, 0.95)",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${customization.themeColor}55`,
                      borderRadius: 14,
                      padding: "10px 12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          background: `${customization.themeColor}22`,
                          color: customization.themeColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        🎧
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: customization.themeColor, textTransform: "uppercase" }}>
                          {customization.badgeText}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
                          Послушать о «{activeRoute?.title}»?
                        </div>
                      </div>
                      <button
                        onClick={() => setMockWidgetState("collapsed")}
                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => {
                          setMockWidgetState("player");
                          handleTestSynthesis();
                        }}
                        style={{
                          flex: 1,
                          padding: "5px 10px",
                          borderRadius: 6,
                          background: customization.themeColor,
                          border: "none",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        ▶ {activeRoute?.durationSec || 20}с
                      </button>
                      <button
                        onClick={() => setMockWidgetState("collapsed")}
                        style={{
                          padding: "5px 8px",
                          borderRadius: 6,
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.7)",
                          fontSize: 10,
                          cursor: "pointer",
                        }}
                      >
                        Позже
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Expanded Player State */}
                {mockWidgetState === "player" && (
                  <div
                    style={{
                      background: "rgba(18, 20, 29, 0.98)",
                      backdropFilter: "blur(14px)",
                      border: `1px solid ${customization.themeColor}88`,
                      borderRadius: 14,
                      padding: "12px 14px",
                      boxShadow: "0 10px 28px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: customization.themeColor, textTransform: "uppercase" }}>
                        {customization.badgeText}
                      </div>
                      <button
                        onClick={() => setMockWidgetState("collapsed")}
                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 11 }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Sound Waves & Progress */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 6,
                        padding: "5px 8px",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 3, height: isPlayingPreview ? 10 : 4, background: customization.themeColor, borderRadius: 2 }} />
                        <span style={{ width: 3, height: isPlayingPreview ? 14 : 4, background: customization.themeColor, borderRadius: 2 }} />
                        <span style={{ width: 3, height: isPlayingPreview ? 8 : 4, background: customization.themeColor, borderRadius: 2 }} />
                        <span style={{ fontSize: 10, color: customization.themeColor, fontWeight: 600, marginLeft: 4 }}>
                          {isPlayingPreview ? "Диктор говорит..." : "Готово к прослушиванию"}
                        </span>
                      </div>
                    </div>

                    {/* Actions preview */}
                    {activeRoute?.actions && activeRoute.actions.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                        {activeRoute.actions.map((act, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "5px 8px",
                              borderRadius: 6,
                              background: act.primary ? `${customization.themeColor}22` : "rgba(255,255,255,0.06)",
                              border: `1px solid ${act.primary ? customization.themeColor : "rgba(255,255,255,0.1)"}`,
                              color: act.primary ? customization.themeColor : "#fff",
                              fontSize: 10,
                              fontWeight: 600,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{act.label}</span>
                            <span>→</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Collapsed Button State */}
                {mockWidgetState === "collapsed" && (
                  <button
                    onClick={() => setMockWidgetState("prompt")}
                    style={{
                      height: 34,
                      padding: "0 12px",
                      borderRadius: 17,
                      background: "rgba(18, 20, 29, 0.95)",
                      border: `1px solid ${customization.themeColor}`,
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                    }}
                  >
                    <span>🎧</span>
                    <span>{customization.badgeText}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Switch Mock Pages */}
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Проверить страницу:</span>
              {routes.map((r, i) => (
                <button
                  key={r.id || i}
                  onClick={() => {
                    setActiveRouteIndex(i);
                    setMockWidgetState("prompt");
                  }}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: activeRouteIndex === i ? "rgba(15,184,128,0.15)" : "var(--color-bg-primary)",
                    border: "1px solid",
                    borderColor: activeRouteIndex === i ? "var(--color-accent)" : "var(--color-border)",
                    color: activeRouteIndex === i ? "var(--color-accent)" : "var(--color-text-secondary)",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  {r.route}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
