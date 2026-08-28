"use client";

import React from "react";

interface AgentLogo {
  name: string;
  category: string;
  badge?: string;
  icon: React.ReactNode;
}

const AGENT_LOGOS: AgentLogo[] = [
  {
    name: "Cursor IDE",
    category: "AI Code Editor",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0fb880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#0fb880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#0fb880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Claude 3.7",
    category: "Anthropic",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="#d97706"/>
      </svg>
    ),
  },
  {
    name: "OpenAI GPT-4o",
    category: "Reasoning LLM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#10a37f" strokeWidth="2"/>
        <path d="M12 6V18M6 12H18" stroke="#10a37f" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "DeepSeek R1/V3",
    category: "Open Weights AI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 15C8 6 16 6 20 15M6 19C10 13 14 13 18 19" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "v0 by Vercel",
    category: "Generative UI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L22 21H2L12 3Z" fill="#ffffff"/>
      </svg>
    ),
  },
  {
    name: "Bolt.new",
    category: "In-browser WebContainer",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#eab308"/>
      </svg>
    ),
  },
  {
    name: "Windsurf",
    category: "AI Flow & Cascades",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 17C7 17 8 7 12 7C16 7 17 17 21 17" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Supabase",
    category: "Backend & Vectors",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 3L3 15H11L9 21L19 9H11L13 3Z" fill="#3ecf8e"/>
      </svg>
    ),
  },
  {
    name: "n8n AI Agents",
    category: "Workflow Automation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="12" r="4" stroke="#ff6d5a" strokeWidth="2"/>
        <circle cx="17" cy="12" r="4" stroke="#ff6d5a" strokeWidth="2"/>
        <path d="M11 12H13" stroke="#ff6d5a" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: "Next.js 16",
    category: "App Router & Turbopack",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="1.5"/>
        <path d="M8 8V16M8 8L16 16M16 8V13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Prisma & PostgreSQL",
    category: "Database & ORM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 6C4 3.79086 7.58172 2 12 2C16.4183 2 20 3.79086 20 6M4 6V18C4 20.2091 7.58172 22 12 22C16.4183 22 20 20.2091 20 18V6M4 6C4 8.20914 7.58172 10 12 10C16.4183 10 20 8.20914 20 6M4 12C4 14.2091 7.58172 16 12 16C16.4183 16 20 14.2091 20 12" stroke="#336791" strokeWidth="1.8"/>
      </svg>
    ),
  },
];

const EDGE_MASK =
  "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)";

export const AiAgentsMarquee = () => (
  <div
    className="relative w-full overflow-hidden"
    style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
  >
    <div
      style={{
        display: "flex",
        width: "max-content",
        animation: "logo-marquee 32s linear infinite",
      }}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          style={{ display: "flex", alignItems: "center", gap: 16, paddingRight: 16 }}
          aria-hidden={copy === 1}
        >
          {AGENT_LOGOS.map((agent) => (
            <div
              key={`${copy}-${agent.name}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 99,
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                cursor: "default",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {agent.icon}
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
                  {agent.name}
                </span>
                <span style={{ fontSize: 9, color: "rgba(148, 163, 184, 0.8)", fontWeight: 500 }}>
                  {agent.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
