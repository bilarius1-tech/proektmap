"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Wrench,
  Eye,
  Share2,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Calculator,
  Code2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { MicroserviceItem, MicroserviceCategory } from "@/lib/services/data";
import Breadcrumbs from "@/components/nav/breadcrumbs";

const ICON_MAP: Record<string, React.ReactNode> = {
  Image: <ImageIcon size={28} />,
  Calculator: <Calculator size={28} />,
  Code2: <Code2 size={28} />,
  Wrench: <Wrench size={28} />,
};

interface ServicesCatalogClientProps {
  services: MicroserviceItem[];
  categories: MicroserviceCategory[];
  statsMap: Record<string, { viewCount: number; useCount: number; shareCount: number }>;
}

export default function ServicesCatalogClient({
  services,
  categories,
  statsMap,
}: ServicesCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.badges.some((b) => b.toLowerCase().includes(q)) ||
        item.features.some((f) => f.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  const handleShare = async (e: React.MouseEvent, service: MicroserviceItem) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/services/${service.slug}`;
    const shareData = {
      title: `${service.title} — ProektMap`,
      text: service.shortDescription,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Track share count
        fetch(`/api/services/${service.slug}/stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "share" }),
        }).catch(() => {});
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or unsupported
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedSlug(service.slug);
      setTimeout(() => setCopiedSlug(null), 2200);

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
      {copiedSlug && (
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
          Ссылка на микросервис скопирована!
        </div>
      )}

      {/* Hero Section */}
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(139, 92, 246, 0.08) 100%)",
          borderBottom: "1px solid var(--color-border-light)",
          padding: "48px 20px 36px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ marginBottom: "var(--space-m)", display: "flex", justifyContent: "center" }}>
            <Breadcrumbs pathname="/services" pageTitle="Микросервисы" />
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              background: "rgba(16, 185, 129, 0.12)",
              color: "var(--color-accent)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              marginBottom: "var(--space-s)",
            }}
          >
            <Sparkles size={15} />
            Инженерные онлайн-инструменты ProektMap
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(26px, 4.5vw, 42px)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "var(--space-s)",
              letterSpacing: "-0.02em",
            }}
          >
            Микросервисы и утилиты под задачи
          </h1>

          <p
            style={{
              fontSize: "var(--text-m)",
              color: "var(--color-text-secondary)",
              maxWidth: 640,
              margin: "0 auto var(--space-l)",
              lineHeight: 1.5,
            }}
          >
            Бесплатные изолированные утилиты для AI-инженеров, вайбкодеров и продавцов. Работают прямо в браузере без задержек и утечки данных.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: 540, margin: "0 auto", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск инструмента (уникализатор, токены, SVG, Авито)..."
              style={{
                width: "100%",
                padding: "13px 16px 13px 44px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                fontSize: "var(--text-s)",
                outline: "none",
                boxShadow: "var(--shadow-s)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 20px" }}>
        {/* Category Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 12,
            marginBottom: 28,
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? services.length
                : services.filter((s) => s.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "var(--radius-full)",
                  border: isActive
                    ? "1px solid var(--color-accent)"
                    : "1px solid var(--color-border-light)",
                  background: isActive ? "var(--color-accent)" : "var(--color-surface)",
                  color: isActive ? "#ffffff" : "var(--color-text-secondary)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{cat.name}</span>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "var(--radius-full)",
                    background: isActive ? "rgba(255,255,255,0.25)" : "var(--color-bg-secondary)",
                    fontSize: 11,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div
            style={{
              padding: "64px 20px",
              textAlign: "center",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-l)",
              border: "1px dashed var(--color-border)",
            }}
          >
            <Wrench size={36} style={{ color: "var(--color-text-tertiary)", marginBottom: 12 }} />
            <h3 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: 6 }}>
              Ничего не найдено
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>
              Попробуйте изменить запрос или сбросить фильтры.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
              gap: 24,
            }}
          >
            {filteredServices.map((service) => {
              const stats = statsMap[service.slug] || { viewCount: 0, useCount: 0, shareCount: 0 };
              const isComingSoon = service.status === "coming_soon";

              return (
                <div
                  key={service.slug}
                  style={{
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-l)",
                    border: "1px solid var(--color-border-light)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "var(--shadow-s)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Card Cover Banner */}
                  <div
                    style={{
                      height: 140,
                      background: service.gradient || "var(--color-bg-secondary)",
                      position: "relative",
                      borderBottom: "1px solid var(--color-border-light)",
                      overflow: "hidden",
                    }}
                  >
                    {service.coverImage ? (
                      <img
                        src={service.coverImage}
                        alt={service.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          position: "absolute",
                          inset: 0,
                        }}
                      />
                    ) : null}
                    
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        padding: "16px 20px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        background: service.coverImage ? "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)" : "transparent",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: "var(--radius-m)",
                            background: "var(--color-surface)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--color-accent)",
                            boxShadow: "var(--shadow-s)",
                          }}
                        >
                          {ICON_MAP[service.icon] || <Wrench size={24} />}
                        </div>

                        {/* Status / Pro badge */}
                        <div style={{ display: "flex", gap: 6 }}>
                          {isComingSoon ? (
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "var(--radius-full)",
                                background: "rgba(234, 179, 8, 0.2)",
                                color: "#facc15",
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              В разработке
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "var(--radius-full)",
                                background: "rgba(16, 185, 129, 0.2)",
                                color: "#34d399",
                                fontSize: 11,
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Zap size={12} /> Активен
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Category pill */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {service.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge}
                            style={{
                              padding: "3px 8px",
                              borderRadius: "var(--radius-s)",
                              background: "rgba(0,0,0,0.6)",
                              color: "#ffffff",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "var(--font-heading)",
                        marginBottom: 8,
                        lineHeight: 1.3,
                      }}
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {service.title}
                      </Link>
                    </h2>

                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.5,
                        marginBottom: 16,
                        flex: 1,
                      }}
                    >
                      {service.shortDescription}
                    </p>

                    {/* Features checklist snippet */}
                    <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                      {service.features.slice(0, 2).map((feat, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 6,
                            fontSize: 11,
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          <Check
                            size={13}
                            style={{
                              color: "var(--color-accent)",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                          <span style={{ lineHeight: 1.35 }}>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer: Views, Share & Action Button */}
                    <div
                      style={{
                        borderTop: "1px solid var(--color-border-light)",
                        paddingTop: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      {/* Views count */}
                      <div
                        title="Количество просмотров"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          color: "var(--color-text-tertiary)",
                          fontWeight: 500,
                        }}
                      >
                        <Eye size={14} />
                        <span>{stats.viewCount > 0 ? stats.viewCount : 1}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Share Button */}
                        <button
                          onClick={(e) => handleShare(e, service)}
                          title="Поделиться микросервисом"
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "var(--radius-s)",
                            border: "1px solid var(--color-border-light)",
                            background: "var(--color-bg-secondary)",
                            color: "var(--color-text-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {copiedSlug === service.slug ? (
                            <Check size={15} style={{ color: "var(--color-accent)" }} />
                          ) : (
                            <Share2 size={15} />
                          )}
                        </button>

                        {/* Open Action */}
                        <Link
                          href={`/services/${service.slug}`}
                          style={{
                            padding: "7px 14px",
                            borderRadius: "var(--radius-s)",
                            background: isComingSoon ? "var(--color-bg-secondary)" : "var(--color-accent)",
                            color: isComingSoon ? "var(--color-text-tertiary)" : "#ffffff",
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            transition: "background 0.15s ease",
                          }}
                        >
                          <span>{isComingSoon ? "Обзор" : "Открыть"}</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
