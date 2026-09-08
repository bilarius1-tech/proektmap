"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Lock,
  Network,
  RefreshCw,
  Shield,
  Unlock,
  X,
} from "lucide-react";
import type { VaultCapsule } from "@/lib/project-vault";
import { VAULT } from "@/lib/project-vault";
import { buildBootstrapFromDnaPrompt } from "@/lib/project-vault/bootstrap-prompt";
import {
  getProjectVaultPassword,
  isVaultUnlockedInSession,
  setVaultUnlockedInSession,
} from "@/lib/project-vault/gate";
import CopyPromptBlock from "@/components/project-vault/copy-prompt-block";

type Props = {
  capsule: VaultCapsule;
};

export default function VaultCapsuleView({ capsule }: Props) {
  const accent = capsule.accent ?? "#0f766e";
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const inputId = useId();

  useEffect(() => {
    const ok = isVaultUnlockedInSession();
    setUnlocked(ok);
    setModalOpen(!ok);
    setReady(true);
  }, []);

  const tryUnlock = useCallback((value: string) => {
    if (value === getProjectVaultPassword()) {
      setVaultUnlockedInSession();
      setUnlocked(true);
      setModalOpen(false);
      setPassword("");
      setError(null);
      return;
    }
    setError("Неверный пароль. Попробуйте ещё раз.");
    setPassword("");
  }, []);

  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      <Header capsule={capsule} accent={accent} />

      {!ready ? (
        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-secondary)",
            fontSize: 14,
          }}
        >
          Проверка доступа…
        </div>
      ) : unlocked ? (
        <UnlockedBody capsule={capsule} accent={accent} />
      ) : (
        <LockedShell
          accent={accent}
          capsuleName={capsule.name}
          onOpen={() => {
            setError(null);
            setModalOpen(true);
          }}
        />
      )}

      {ready && !unlocked && modalOpen && (
        <PasswordModal
          accent={accent}
          titleId={titleId}
          inputId={inputId}
          password={password}
          error={error}
          onPasswordChange={(v) => {
            setPassword(v);
            if (error) setError(null);
          }}
          onSubmit={(e) => {
            e.preventDefault();
            tryUnlock(password);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function Header({ capsule, accent }: { capsule: VaultCapsule; accent: string }) {
  return (
    <section
      style={{
        background: "var(--color-bg-primary)",
        borderBottom: "1px solid var(--color-border)",
        padding: "40px 20px 36px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link
          href="/project-vault"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> {VAULT.title}
        </Link>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px",
            background: `${accent}22`,
            color: "#2a5555",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          <Archive size={13} aria-hidden /> Капсула · DNA {capsule.dnaVersion}
          {capsule.derivedFrom ? ` · derivedFrom ${capsule.derivedFrom}` : ""}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: "0 0 12px",
          }}
        >
          {capsule.name}
        </h1>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "var(--text-l, 18px)",
            lineHeight: 1.55,
            color: "var(--color-text-secondary)",
            maxWidth: 640,
          }}
        >
          {capsule.tagline}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <a
            href={capsule.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 700,
              color: "#0f766e",
              textDecoration: "none",
            }}
          >
            {capsule.sourceUrl.replace(/^https?:\/\//, "")}
            <ExternalLink size={13} aria-hidden />
          </a>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#0f766e",
              background: "rgba(15,118,110,0.1)",
              padding: "4px 8px",
            }}
          >
            <Lock size={12} aria-hidden /> Client Boundary ON
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#5a4a3a",
              background: "rgba(201, 169, 110, 0.18)",
              padding: "4px 8px",
            }}
          >
            <Lock size={12} aria-hidden /> Инженерная карта · пароль
          </span>
        </div>
      </div>
    </section>
  );
}

function UnlockedBody({ capsule, accent }: { capsule: VaultCapsule; accent: string }) {
  const bootstrapPrompt = buildBootstrapFromDnaPrompt({
    capsuleSlug: capsule.slug,
    capsuleName: capsule.name,
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 64px" }}>
      <Section title="Создать новый проект из DNA" id="bootstrap">
        <CopyPromptBlock text={bootstrapPrompt} accent={accent} />
      </Section>

      <Section title="Зачем эта капсула">
        <p style={pStyle}>
          Перенос AI-инженерии: следующий похожий проект стартует не с пустого чата, а с
          проверенных rules, harness, loop, graph и паттернов деплоя.
        </p>
        <ul style={{ margin: "12px 0 0", paddingLeft: 18, lineHeight: 1.6 }}>
          {capsule.longSummary.map((item) => (
            <li key={item} style={{ marginBottom: 6, color: "var(--color-text-secondary)" }}>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="DNA" id="dna">
        <div style={{ display: "grid", gap: 12 }}>
          {capsule.dnaSections.map((sec) => (
            <div
              key={sec.id}
              style={{
                padding: "14px 16px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <strong style={{ display: "block", marginBottom: 4 }}>{sec.title}</strong>
              <p style={{ ...pStyle, marginBottom: 8 }}>{sec.summary}</p>
              <code style={codeBlock}>{sec.paths.join(" · ")}</code>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <TrackLink href="/agent-engineering/harness" icon={Shield} label="Harness" />
          <TrackLink href="/agent-engineering/loop" icon={RefreshCw} label="Loop" />
          <TrackLink href="/agent-engineering/graph" icon={Network} label="Graph" />
        </div>
      </Section>

      <Section title="Snapshot" id="snapshot">
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            lineHeight: 1.65,
            color: "var(--color-text-secondary)",
          }}
        >
          {capsule.snapshotHighlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <p style={{ ...pStyle, marginTop: 12 }}>
          Package root: <code>{capsule.packageRoot}</code>
          <br />
          Manifest: <code>{capsule.manifestPath}</code>
        </p>
      </Section>

      <Section title="Reusable" id="reusable">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {capsule.reusablePatterns.map((p) => (
            <span
              key={p}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 10px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Arsenal candidates" id="arsenal">
        <p style={{ ...pStyle, marginBottom: 10 }}>
          Только пометки — <strong>не опубликовано автоматически</strong> в /arsenal.
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
          {capsule.arsenalCandidates.map((c) => (
            <li key={c.title} style={{ marginBottom: 8, color: "var(--color-text-secondary)" }}>
              <strong style={{ color: "var(--color-text-primary)" }}>{c.title}</strong> — {c.reason}
            </li>
          ))}
        </ul>
        <Link href={capsule.links.arsenal} style={textLink}>
          Открыть Arsenal <ArrowRight size={14} />
        </Link>
      </Section>

      <Section title="Связи" id="links">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          <Link href={capsule.links.agentEngineering} style={textLink}>
            Инженерия агентов
          </Link>
          <Link href={capsule.links.aiSkills} style={textLink}>
            AI Skills
          </Link>
          <Link href="/ai-skills" style={textLink}>
            Skills каталог
          </Link>
        </div>
      </Section>

      <Section title="Для агента" id="agent-paths">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "14px 16px",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <span style={{ marginTop: 2, display: "inline-flex" }}>
            <FolderOpen size={18} color="#0f766e" aria-hidden />
          </span>
          <div>
            <p style={{ ...pStyle, marginBottom: 8 }}>Абсолютный путь на хосте ProektMap:</p>
            <code style={codeBlock}>
              /var/www/www-root/data/www/proektmap.ru/{capsule.packageRoot}
            </code>
            <p style={{ ...pStyle, marginTop: 10 }}>
              Старт проекта #2: промпт выше или <code>ai/BOOTSTRAP-FROM-DNA.md</code>. Археология
              готового продукта в Vault — TEMPLATE в <code>docs/PROJECT-VAULT-TZ.md</code>.
            </p>
          </div>
        </div>
        <ul style={{ margin: "14px 0 0", paddingLeft: 0, listStyle: "none" }}>
          {[
            "Client Boundary подписан",
            "Secret scan package clean",
            "DNA достаточна для day-0 harness",
          ].map((t) => (
            <li
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
                fontSize: 14,
              }}
            >
              <CheckCircle2 size={16} color="#0fb880" aria-hidden /> {t}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function LockedShell({
  accent,
  capsuleName,
  onOpen,
}: {
  accent: string;
  capsuleName: string;
  onOpen: () => void;
}) {
  return (
    <div
      style={{
        maxWidth: 560,
        margin: "48px auto",
        padding: "40px 24px",
        textAlign: "center",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: `${accent}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2a5555",
        }}
      >
        <Lock size={24} aria-hidden />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontWeight: 800,
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
        }}
      >
        Инженерная карта закрыта
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--color-text-secondary)",
        }}
      >
        Пути DNA, snapshot и промпт для проекта «{capsuleName}» доступны после ввода пароля. Хаб
        Vault остаётся открытым.
      </p>
      <button
        type="button"
        onClick={onOpen}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 18px",
          border: "none",
          cursor: "pointer",
          background: accent,
          color: "#1a2a2a",
          fontWeight: 800,
          fontSize: 14,
          fontFamily: "var(--font-body)",
          borderRadius: "var(--radius-s, 8px)",
        }}
      >
        <Unlock size={16} aria-hidden /> Ввести пароль
      </button>
    </div>
  );
}

function PasswordModal({
  accent,
  titleId,
  inputId,
  password,
  error,
  onPasswordChange,
  onSubmit,
  onClose,
}: {
  accent: string;
  titleId: string;
  inputId: string;
  password: string;
  error: string | null;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(26, 32, 30, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--color-bg-primary)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 18px 48px rgba(26, 32, 30, 0.22)",
          padding: "28px 24px 24px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            padding: 4,
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            width: 48,
            height: 48,
            marginBottom: 14,
            borderRadius: "50%",
            background: `${accent}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2a5555",
          }}
        >
          <Lock size={22} aria-hidden />
        </div>

        <h2
          id={titleId}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 20,
            fontWeight: 800,
            margin: "0 0 6px",
          }}
        >
          Доступ к инженерной карте
        </h2>
        <p
          style={{
            margin: "0 0 18px",
            fontSize: 14,
            lineHeight: 1.5,
            color: "var(--color-text-secondary)",
          }}
        >
          Введите пароль, чтобы открыть пути DNA, snapshot и шаблон промпта.
        </p>

        <form onSubmit={onSubmit}>
          <label
            htmlFor={inputId}
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 6,
              color: "var(--color-text-secondary)",
            }}
          >
            Пароль
          </label>
          <input
            id={inputId}
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              fontSize: 15,
              fontFamily: "var(--font-body)",
              border: `1px solid ${error ? "#c45c5c" : "var(--color-border)"}`,
              borderRadius: "var(--radius-s, 8px)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              outline: "none",
              marginBottom: error ? 8 : 16,
            }}
          />
          {error && (
            <p
              role="alert"
              style={{
                margin: "0 0 14px",
                fontSize: 13,
                color: "#b33a3a",
                fontWeight: 600,
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 16px",
              border: "none",
              cursor: "pointer",
              background: accent,
              color: "#1a2a2a",
              fontWeight: 800,
              fontSize: 14,
              fontFamily: "var(--font-body)",
              borderRadius: "var(--radius-s, 8px)",
            }}
          >
            <Unlock size={16} aria-hidden /> Открыть карту
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: 36 }}>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontWeight: 800,
          margin: "0 0 12px",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function TrackLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Shield;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        color: "var(--color-text-primary)",
      }}
    >
      <Icon size={14} aria-hidden /> {label}
    </Link>
  );
}

const pStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.6,
  color: "var(--color-text-secondary)",
};

const codeBlock: CSSProperties = {
  display: "block",
  fontSize: 12,
  lineHeight: 1.45,
  padding: "8px 10px",
  background: "var(--color-bg-secondary)",
  border: "1px solid var(--color-border)",
  overflowWrap: "anywhere",
};

const textLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  marginTop: 10,
  fontSize: 13,
  fontWeight: 700,
  color: "#0f766e",
  textDecoration: "none",
};
