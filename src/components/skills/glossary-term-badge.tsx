"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, HelpCircle } from "lucide-react";
import { SkillGlossaryLink } from "@/app/skills/skills-data";

interface GlossaryTermBadgeProps {
  item: SkillGlossaryLink;
}

export default function GlossaryTermBadge({ item }: GlossaryTermBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="glossary-term-wrapper" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`glossary-term-pill ${isOpen ? "active" : ""}`}
        title="Нажмите, чтобы прочитать объяснение термина"
      >
        <BookOpen size={12} className="term-icon" />
        <span className="term-text">{item.term}</span>
        {item.english && <span className="term-en">({item.english})</span>}
      </button>

      {isOpen && (
        <div className="glossary-popover">
          <div className="popover-header">
            <div className="popover-title-row">
              <span className="popover-badge">Термин глоссария</span>
              {item.english && <span className="popover-en">{item.english}</span>}
            </div>
            <h4 className="popover-title">{item.term}</h4>
          </div>

          <p className="popover-desc">{item.explanation}</p>

          <div className="popover-footer">
            {item.slug ? (
              <Link
                href={`/glossary/${item.slug}`}
                className="popover-link"
                target="_blank"
              >
                <span>Подробнее в Глоссарии</span>
                <ExternalLink size={12} />
              </Link>
            ) : (
              <Link
                href="/glossary"
                className="popover-link"
                target="_blank"
              >
                <span>Открыть весь Глоссарий</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .glossary-term-wrapper {
          position: relative;
          display: inline-block;
        }

        .glossary-term-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 6px;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #1d4ed8;
          font-family: var(--font-body, "Inter", sans-serif);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .glossary-term-pill:hover,
        .glossary-term-pill.active {
          background: rgba(59, 130, 246, 0.16);
          border-color: #3b82f6;
          color: #1e40af;
        }

        .term-icon {
          color: #3b82f6;
        }

        .term-en {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: #60a5fa;
          font-weight: 500;
        }

        .glossary-popover {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          width: 280px;
          background: #ffffff;
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 10px;
          padding: 14px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          z-index: 50;
          animation: popIn 0.15s ease-out;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .popover-header {
          margin-bottom: 8px;
        }

        .popover-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .popover-badge {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          padding: 2px 5px;
          border-radius: 3px;
          font-weight: 700;
        }

        .popover-en {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: #888;
        }

        .popover-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 14px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .popover-desc {
          font-size: 12px;
          line-height: 1.5;
          color: #444;
          margin: 0 0 10px 0;
        }

        .popover-footer {
          border-top: 1px solid #f0f0f0;
          padding-top: 8px;
        }

        .popover-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
        }

        .popover-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
