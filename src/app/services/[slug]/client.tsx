"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  Eye,
  Zap,
  HelpCircle,
  Sparkles,
  ChevronDown,
  UploadCloud,
  FileImage,
  ShieldCheck,
  Settings,
  Download,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Shield,
  Camera,
  Crop,
  Lock,
  FileCode,
  Cpu,
  Smartphone,
  Flame,
  ShoppingBag,
} from "lucide-react";
import type { MicroserviceItem } from "@/lib/services/data";
import Breadcrumbs from "@/components/nav/breadcrumbs";
import AvitoPhotoLabWorkspace from "@/components/services/avito-photo-lab";
import VoiceGuideBuilderWorkspace from "@/components/services/voice-guide-builder";

interface ServiceDetailClientProps {
  service: MicroserviceItem;
  initialStats: { viewCount: number; useCount: number; shareCount: number };
}

export default function ServiceDetailClient({
  service,
  initialStats,
}: ServiceDetailClientProps) {
  const [stats, setStats] = useState(initialStats);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Background view recording
  useEffect(() => {
    fetch(`/api/services/${service.slug}/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.viewCount) {
          setStats((prev) => ({ ...prev, viewCount: data.viewCount }));
        }
      })
      .catch(() => {});
  }, [service.slug]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${service.title} | ProektMap`,
      text: service.shortDescription,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        fetch(`/api/services/${service.slug}/stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "share" }),
        }).catch(() => {});
        return;
      } catch (err) {}
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);

      fetch(`/api/services/${service.slug}/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "share" }),
      }).catch(() => {});
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        paddingBottom: "var(--space-xxl)",
      }}
    >
      {/* Toast Notification */}
      {copied && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            padding: "12px 20px",
            borderRadius: "var(--radius-m)",
            boxShadow: "var(--shadow-l)",
            border: "1px solid var(--color-accent)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: "var(--text-s)",
            fontWeight: 600,
            animation: "slideIn 0.3s ease",
          }}
        >
          <Check size={18} style={{ color: "var(--color-accent)" }} />
          Ссылка на сервис скопирована!
        </div>
      )}

      {/* Top Breadcrumbs & Nav Bar */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border-light)",
          background: "var(--color-surface)",
          padding: "14px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Breadcrumbs
            pathname={`/services/${service.slug}`}
            pageTitle={service.title}
          />

          <Link
            href="/services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "var(--text-xs)",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} /> Все микросервисы
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        {/* Service Header */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-l)",
            border: "1px solid var(--color-border-light)",
            padding: "28px 24px",
            marginBottom: 28,
            boxShadow: "var(--shadow-s)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {service.badges.map((badge) => (
                  <span
                    key={badge}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "var(--radius-s)",
                      background: "rgba(16, 185, 129, 0.12)",
                      color: "var(--color-accent)",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {badge}
                  </span>
                ))}
                {service.status === "active" && (
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "var(--radius-s)",
                      background: "rgba(59, 130, 246, 0.12)",
                      color: "#3b82f6",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Zap size={12} /> Готов к работе
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(24px, 4vw, 34px)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                {service.title}
              </h1>

              <p
                style={{
                  fontSize: "var(--text-m)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.55,
                  maxWidth: 820,
                }}
              >
                {service.fullDescription}
              </p>
            </div>

            {/* Actions: Views & Share */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                title="Просмотров страницы"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: "var(--radius-m)",
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text-tertiary)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                }}
              >
                <Eye size={15} />
                <span>{stats.viewCount > 0 ? stats.viewCount : 1}</span>
              </div>

              <button
                onClick={handleShare}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-m)",
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {copied ? (
                  <>
                    <Check size={15} style={{ color: "var(--color-accent)" }} />
                    <span>Скопировано</span>
                  </>
                ) : (
                  <>
                    <Share2 size={15} />
                    <span>Поделиться</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Workspace / Tool Foundation */}
        <div id="tool-workspace" style={{ marginBottom: 36 }}>
          {service.slug === "avito-photo-uniquizer" ? (
            <AvitoPhotoLabWorkspace />
          ) : service.slug === "voice-guide-builder" ? (
            <VoiceGuideBuilderWorkspace />
          ) : (
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-l)",
                border: "2px solid var(--color-border-light)",
                padding: "48px 20px",
                textAlign: "center",
                boxShadow: "var(--shadow-m)",
              }}
            >
              <Settings size={40} style={{ color: "var(--color-warning)", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: 8 }}>
                Микросервис находится в разработке
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", maxWidth: 500, margin: "0 auto" }}>
                Мы активно готовим релиз этого инструмента. Вы можете следить за обновлениями в блоге и на канале ProektMap.
              </p>
            </div>
          )}
        </div>

        {/* Specialized Advantages Block for Avito Photo Lab */}
        {service.slug === "avito-photo-uniquizer" && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
              borderRadius: "var(--radius-l)",
              border: "1px solid var(--color-border-light)",
              padding: "32px 28px",
              marginBottom: 36,
            }}
          >
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 32px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "var(--color-accent)",
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                <Flame size={14} />
                <span>ИНЖЕНЕРНЫЙ СТАНДАРТ PROEKTMAP</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                Почему Avito Photo Lab надежнее обычных уникализаторов?
              </h3>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                Большинство Telegram-ботов и онлайн-сервисов просто накладывают прозрачную рамку или примитивный шум.
                Алгоритмы компьютерного зрения Авито легко распознают такие манипуляции. Мы создали полноценный конвейер с глубокой математической защитой.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {/* Card 1 */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-m)",
                  padding: "20px",
                  border: "1px solid var(--color-border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-m)",
                      background: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-accent)",
                    }}
                  >
                    <Shield size={18} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    Двухъядерный контроль (pHash + RGB Cube)
                  </h4>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Контролирует как силуэт и геометрию (64-битные дискретные косинусные трансформации DCT), так и 3D-распределение цветовой гистограммы, исключая склейку дублей нейросетями платформы.
                </p>
              </div>

              {/* Card 2 */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-m)",
                  padding: "20px",
                  border: "1px solid var(--color-border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-m)",
                      background: "rgba(59, 130, 246, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3b82f6",
                    }}
                  >
                    <Crop size={18} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    Охранная зона 1:1 & Стандарт 4:3
                  </h4>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Официальный горизонтальный формат 4:3 с защитой квадратного центра 1:1. Текст, логотипы и шильдики никогда не срежутся при просмотре в мобильном приложении Авито.
                </p>
              </div>

              {/* Card 3 */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-m)",
                  padding: "20px",
                  border: "1px solid var(--color-border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-m)",
                      background: "rgba(245, 158, 11, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-warning)",
                    }}
                  >
                    <Camera size={18} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    Аппаратный EXIF Spoofer
                  </h4>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Бинарная инъекция легитимных тегов камер реальных устройств (Apple iPhone 15 Pro, Samsung S24 Ultra, Xiaomi Leica, Sony Alpha) с правдоподобной выдержкой, диафрагмой и датой.
                </p>
              </div>

              {/* Card 4 */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-m)",
                  padding: "20px",
                  border: "1px solid var(--color-border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-m)",
                      background: "rgba(168, 85, 247, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#a855f7",
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    Глубокая очистка ИИ-меток
                  </h4>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Полное вырезание манифестов C2PA, IPTC тегов trainedAlgorithmicMedia, промптов из ComfyUI/Midjourney и разрушение цифровых водяных знаков SynthID.
                </p>
              </div>

              {/* Card 5 */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-m)",
                  padding: "20px",
                  border: "1px solid var(--color-border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-m)",
                      background: "rgba(236, 72, 153, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ec4899",
                    }}
                  >
                    <FileCode size={18} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    XML & CSV фиды Автозагрузки
                  </h4>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Автоматическая сборка структурированных ZIP-архивов по объявлениям с официальным XML-фидом (formatVersion 3) и CSV таблицами для загрузки в личный кабинет Авито Pro.
                </p>
              </div>

              {/* Card 6 */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-m)",
                  padding: "20px",
                  border: "1px solid var(--color-border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-m)",
                      background: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-accent)",
                    }}
                  >
                    <Lock size={18} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    100% приватность (0 байт на сервер)
                  </h4>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Все расчеты, уникализация и упаковка архивов выполняются прямо в вашем браузере на клиенте. Ваши фотографии товаров и закрытые базы никогда не попадут к третьим лицам.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features & How to use Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            marginBottom: 36,
          }}
        >
          {/* How to use */}
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-l)",
              border: "1px solid var(--color-border-light)",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Zap size={18} style={{ color: "var(--color-accent)" }} />
              Как пользоваться сервисом
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {service.howToUse.map((step) => (
                <div key={step.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "var(--radius-full)",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "var(--color-accent)",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "var(--text-s)", fontWeight: 600, marginBottom: 2 }}>
                      {step.title}
                    </h4>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Advantages */}
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-l)",
              border: "1px solid var(--color-border-light)",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ShieldCheck size={18} style={{ color: "var(--color-accent)" }} />
              Инженерные особенности
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {service.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  <Check
                    size={15}
                    style={{
                      color: "var(--color-accent)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {service.faq && service.faq.length > 0 && (
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-l)",
              border: "1px solid var(--color-border-light)",
              padding: "28px 24px",
              marginBottom: 36,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <HelpCircle size={20} style={{ color: "var(--color-accent)" }} />
              Часто задаваемые вопросы
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {service.faq.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid var(--color-border-light)",
                      borderRadius: "var(--radius-m)",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        background: "var(--color-bg-secondary)",
                        border: "none",
                        color: "var(--color-text-primary)",
                        fontSize: "var(--text-s)",
                        fontWeight: 600,
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.2s ease",
                          color: "var(--color-text-tertiary)",
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: "14px 18px",
                          background: "var(--color-surface)",
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.55,
                          borderTop: "1px solid var(--color-border-light)",
                        }}
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Avito Ecosystem Solution Banner */}
        {service.slug === "avito-photo-uniquizer" && (
          <div
            style={{
              marginBottom: 32,
              borderRadius: "var(--radius-l)",
              padding: "24px 28px",
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 52, 96, 0.25) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "var(--text-xs)",
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                <Sparkles size={14} /> Инженерный маршрут ProektMap
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 20,
                  fontWeight: 800,
                  margin: "0 0 6px",
                  color: "var(--color-text-primary)",
                }}
              >
                Запустить AI-магазин на Авито под ключ
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-s)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                Пошаговый план: от анализа ниши и AI-копирайтинга до пакетной уникализации в Avito Photo Lab, сборки XML-фида и настройки AI-автоответов.
              </p>
            </div>
            <Link
              href="/resheniya/avito-business"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                borderRadius: "var(--radius-m)",
                background: "#ef4444",
                color: "#fff",
                fontSize: "var(--text-s)",
                fontWeight: 800,
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)",
              }}
            >
              <span>Открыть решение</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Related Routes */}
        {service.relatedRoutes && service.relatedRoutes.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              background: "var(--color-bg-secondary)",
              borderRadius: "var(--radius-m)",
              border: "1px solid var(--color-border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              Связанные разделы экосистемы:
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {service.relatedRoutes.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-s)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
