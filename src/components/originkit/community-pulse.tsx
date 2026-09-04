"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Layers,
  Route,
  Wrench,
  BookOpen,
  FileText,
  Compass,
  ArrowRight,
  Plus,
  Flame,
  Zap,
  Brain,
} from "lucide-react";
import "./hero-22.css";
import { NeuralDiagram } from "@/components/originkit/ui/hero-22/neural-diagram";
import { AiAgentsMarquee } from "@/components/originkit/ui/hero-22/ai-agents-marquee";

export interface CommunityStats {
  totalUsers: number;
  totalProjects: number;
  totalSolutions: number;
  totalTools: number;
  totalArsenalTools: number;
  totalTerms: number;
  totalPosts: number;
  totalSkills: number;
}

export function CommunityPulseHero({ stats }: { stats: CommunityStats }) {
  const metrics = [
    {
      icon: <Users size={18} color="#0fb880" />,
      value: stats.totalUsers,
      label: "Вайбкодеров в сообществе",
      sublabel: "Каталог специалистов",
      href: "/specialists",
      accent: "#0fb880",
    },
    {
      icon: <Layers size={18} color="#38bdf8" />,
      value: stats.totalProjects,
      label: "Кейсов в портфолио",
      sublabel: "AI Цех & работы участников",
      href: "/ai-workshop",
      accent: "#38bdf8",
    },
    {
      icon: <Route size={18} color="#a855f7" />,
      value: stats.totalSolutions,
      label: "Готовых решений AI",
      sublabel: "Инженерные маршруты",
      href: "/resheniya",
      accent: "#a855f7",
    },
    {
      icon: <Brain size={18} color="#22d3ee" />,
      value: stats.totalArsenalTools,
      label: "Каталог ИИ",
      sublabel: "Нейро каталог · стеки и инструменты",
      href: "/arsenal",
      accent: "#22d3ee",
    },
    {
      icon: <Wrench size={18} color="#f59e0b" />,
      value: stats.totalTools,
      label: "AI-инструментов",
      sublabel: "14 категорий технологий",
      href: "/ai-tools",
      accent: "#f59e0b",
    },
    {
      icon: <BookOpen size={18} color="#ec4899" />,
      value: stats.totalTerms,
      label: "Терминов в глоссарии",
      sublabel: "Сленг вайбкодинга",
      href: "/glossary",
      accent: "#ec4899",
    },
    {
      icon: <FileText size={18} color="#6366f1" />,
      value: stats.totalPosts,
      label: "Статей и разборов",
      sublabel: "Блог AI-инжиниринга",
      href: "/blog",
      accent: "#6366f1",
    },
    {
      icon: <Compass size={18} color="#14b8a6" />,
      value: stats.totalSkills,
      label: "Навыков в карте",
      sublabel: "5 доменов мастерства",
      href: "/skills",
      accent: "#14b8a6",
    },
  ];

  return (
    <section
      style={{
        maxWidth: 1140,
        margin: "0 auto var(--space-xxl)",
        padding: "0 var(--space-m)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #090a0f 0%, #0d0e15 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(15, 184, 128, 0.08)",
          color: "#fff",
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse at center, rgba(15, 184, 128, 0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Ambient Secondary Purple Glow */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            right: -100,
            width: 400,
            height: 300,
            background: "radial-gradient(ellipse at center, rgba(116, 111, 252, 0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* 1. Header & Call to Action */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "56px 24px 20px",
            textAlign: "center",
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 99,
              background: "rgba(15, 184, 128, 0.12)",
              border: "1px solid rgba(15, 184, 128, 0.3)",
              color: "#34d399",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
              marginBottom: 20,
              backdropFilter: "blur(8px)",
            }}
          >
            <Zap size={14} fill="#34d399" /> Пульс сообщества вайбкодеров ProektMap
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4.5vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
              color: "#ffffff",
            }}
          >
            Создавайте работающие продукты{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #34d399 0%, #60a5fa 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              вместе с AI-инженерами
            </span>
          </h2>

          <p
            style={{
              fontSize: "clamp(14px, 2vw, 17px)",
              color: "#94a3b8",
              lineHeight: 1.6,
              margin: "0 auto 32px",
              maxWidth: 620,
            }}
          >
            Единое пространство: готовые инженерные маршруты, проверенный стек нейросетей, открытые AI-рецепты и портфолио создателей.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/projects/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                borderRadius: 8,
                background: "#0fb880",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(15, 184, 128, 0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <Plus size={16} /> Опубликовать работу (+150 XP)
            </Link>

            <Link
              href="/specialists"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 24px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                color: "#f8fafc",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s",
              }}
            >
              Смотреть всех вайбкодеров ({stats.totalUsers}) <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* 2. Neural Head & Particle Diagram (Strictly Centered) */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
            margin: "-10px 0 -20px",
          }}
        >
          <NeuralDiagram />
        </div>

        {/* 3. Dynamic Live Community Metrics */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "36px 24px 40px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0fb880", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                Живой пульс платформы
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#f8fafc" }}>
                Экосистема ProektMap в цифрах
              </h3>
            </div>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              Обновляется в реальном времени из базы данных
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            {metrics.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                style={{
                  padding: "16px 14px",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {m.icon}
                  </div>
                  <ArrowRight size={13} color="#64748b" />
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    fontFamily: "var(--font-heading)",
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    marginBottom: 2,
                  }}
                >
                  {m.value}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>
                  {m.label}
                </div>

                <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.3 }}>
                  {m.sublabel}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. AI Agents & Tech Stack Marquee Strip */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(11, 11, 14, 0.9)",
            padding: "24px 0 28px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(148, 163, 184, 0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              СТЕК И AI-АГЕНТЫ, НА КОТОРЫХ СТРОЯТСЯ РАБОТЫ СООБЩЕСТВА
            </span>
          </div>

          <AiAgentsMarquee />
        </div>
      </div>
    </section>
  );
}
