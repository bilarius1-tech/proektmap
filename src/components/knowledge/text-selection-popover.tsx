"use client";

import { useState, useEffect, useRef } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface TextSelectionPopoverProps {
  learningMode?: boolean;
}

export default function TextSelectionPopover({ learningMode = false }: TextSelectionPopoverProps) {
  const { data: session } = useSession();
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user) return;

    function handleSelection() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        // Only hide if not in learning mode
        if (!learningMode) setVisible(false);
        return;
      }

      const text = sel.toString().trim();
      if (text.length < 3) { setVisible(false); return; }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 10,
      });
      setSaved(false);
      setVisible(true);
    }

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", () => {
      // Delay to let mouseup fire first
      setTimeout(handleSelection, 10);
    });

    // Hide when clicking elsewhere
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Don't hide if selection still active
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          setVisible(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection as any);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [session, learningMode]);

  async function save() {
    if (!selectedText || saving) return;
    setSaving(true);
    try {
      await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          pageTitle: document.title,
          pageUrl: window.location.pathname,
        }),
      });
      setSaved(true);
      setTimeout(() => { setVisible(false); setSaved(false); }, 1500);
    } catch {} finally { setSaving(false); }
  }

  if (!visible || !session?.user) return null;

  return (
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
        zIndex: 999,
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-l)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        padding: "4px",
        display: "flex",
        gap: 2,
      }}
    >
      <button
        onClick={save}
        disabled={saving || saved}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: "var(--radius-m)",
          border: "none", cursor: (saving || saved) ? "default" : "pointer",
          background: saved ? "var(--color-accent-light)" : "transparent",
          color: saved ? "var(--color-accent)" : "var(--color-text-primary)",
          fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "inherit",
          whiteSpace: "nowrap",
          transition: "background 0.15s",
        }}
      >
        {saving ? (
          <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
        ) : saved ? (
          <Check size={14} />
        ) : (
          <Bookmark size={14} />
        )}
        {saved ? "Сохранено!" : "Сохранить"}
      </button>
    </div>
  );
}
