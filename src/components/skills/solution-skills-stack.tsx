"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Zap, ShieldCheck, ChevronRight } from "lucide-react";

export interface SolutionRequiredSkill {
  slug: string;
  title: string;
  domainName: string;
  domainColor: string;
  level: "L1" | "L2" | "L3";
  stepNumber: number;
  stepArtifact: string;
  status: "mastered" | "in_focus" | "recommended";
}

const SAAS_REQUIRED_SKILLS: SolutionRequiredSkill[] = [
  {
    slug: "env-runtime",
    title: "Среда и рантайм создателя",
    domainName: "Запуск & Ops",
    domainColor: "#F59E0B",
    level: "L1",
    stepNumber: 1,
    stepArtifact: "Репозиторий, единая ветка main и .env",
    status: "mastered",
  },
  {
    slug: "problem-framing",
    title: "Фрейминг проблемы и Scope v1",
    domainName: "Продукт & Смысл",
    domainColor: "#3B82F6",
    level: "L2",
    stepNumber: 2,
    stepArtifact: "Паспорт ценности продукта v1",
    status: "mastered",
  },
  {
    slug: "data-modeling",
    title: "Моделирование данных и Prisma",
    domainName: "Архитектура & БД",
    domainColor: "#0FB880",
    level: "L2",
    stepNumber: 4,
    stepArtifact: "Схема на 7 моделей и миграции Postgres",
    status: "mastered",
  },
  {
    slug: "auth-sessions",
    title: "Авторизация, сессии и роли",
    domainName: "Архитектура & БД",
    domainColor: "#0FB880",
    level: "L2",
    stepNumber: 5,
    stepArtifact: "OAuth NextAuth и ролевой доступ",
    status: "mastered",
  },
  {
    slug: "server-deploy",
    title: "Сервер, Nginx и PM2",
    domainName: "Запуск & Ops",
    domainColor: "#F59E0B",
    level: "L2",
    stepNumber: 7,
    stepArtifact: "VPS, Nginx реверс-прокси и SSL",
    status: "in_focus",
  },
  {
    slug: "billing-webhooks",
    title: "Платежи и идемпотентные вебхуки",
    domainName: "Запуск & Ops",
    domainColor: "#F59E0B",
    level: "L2",
    stepNumber: 8,
    stepArtifact: "Боевой вебхук ЮKassa с проверкой",
    status: "recommended",
  },
];

export default function SolutionSkillsStack() {
  return (
    <section className="solution-skills-section" aria-labelledby="skills-stack-title">
      <div className="solutions-section-heading">
        <div>
          <span className="solutions-kicker">Proof of Work · Компетенции</span>
          <h2 id="skills-stack-title">Способности, подтверждаемые в этом маршруте</h2>
        </div>
        <p>
          ProektMap показывает не только как сделать проект, но и какие инженерные способности вы закрепляете на каждом этапе.
        </p>
      </div>

      <div className="solution-skills-grid">
        {SAAS_REQUIRED_SKILLS.map((item) => (
          <Link
            key={item.slug}
            href={`/skills/${item.slug}`}
            className={`solution-skill-card status-${item.status}`}
          >
            <div className="skill-card-top">
              <span className="skill-step-badge">Шаг {item.stepNumber}</span>
              <span
                className="skill-domain-pill"
                style={{ color: item.domainColor, background: `${item.domainColor}15` }}
              >
                {item.domainName}
              </span>
              <span className="skill-level-pill">{item.level}</span>
            </div>

            <h3 className="skill-card-title">{item.title}</h3>

            <div className="skill-card-artifact">
              <span className="artifact-label">Артефакт шага:</span>
              <span className="artifact-text">{item.stepArtifact}</span>
            </div>

            <div className="skill-card-bottom">
              {item.status === "mastered" && (
                <span className="status-label mastered">
                  <CheckCircle2 size={13} /> Подтверждается
                </span>
              )}
              {item.status === "in_focus" && (
                <span className="status-label in-focus">
                  <Zap size={13} /> Текущий фокус
                </span>
              )}
              {item.status === "recommended" && (
                <span className="status-label recommended">
                  К освоению
                </span>
              )}
              <span className="skill-open-arrow">
                Паспорт <ChevronRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="skills-footer-row">
        <Link href="/skills" className="skills-map-link">
          <span>Открыть общую карту способностей создателя</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <style jsx>{`
        .solution-skills-section {
          margin: 48px 0;
          padding: 32px;
          background: #ffffff;
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 16px;
        }

        .solution-skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .solution-skill-card {
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 12px;
          padding: 16px;
          background: var(--color-bg-secondary, #fafafa);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          color: inherit;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .solution-skill-card:hover {
          background: #ffffff;
          border-color: #0fb880;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .solution-skill-card.status-in_focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 1px #f59e0b;
        }

        .skill-card-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .skill-step-badge {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          background: #111;
          color: #fff;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .skill-domain-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .skill-level-pill {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          color: #777;
          background: #e5e5e5;
          padding: 2px 5px;
          border-radius: 3px;
          margin-left: auto;
        }

        .skill-card-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 15px;
          font-weight: 800;
          color: #111;
          margin: 0 0 10px 0;
          line-height: 1.25;
        }

        .skill-card-artifact {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 14px;
        }

        .artifact-label {
          display: block;
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          color: #888;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .artifact-text {
          font-weight: 600;
          color: #333;
        }

        .skill-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid var(--color-border-light, #f0f0f0);
          margin-top: auto;
        }

        .status-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-label.mastered {
          color: #0fb880;
        }

        .status-label.in-focus {
          color: #d97706;
        }

        .status-label.recommended {
          color: #2563eb;
        }

        .skill-open-arrow {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
        }

        .skills-footer-row {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }

        .skills-map-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #111;
          text-decoration: underline;
        }

        .skills-map-link:hover {
          color: #0fb880;
        }
      `}</style>
    </section>
  );
}
