"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("proektmap-theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("proektmap-theme", next ? "dark" : "light");
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div style={{ width: 36, height: 36 }} />;
  }

  return (
    <button onClick={toggle}
      title={dark ? "Светлая тема" : "Тёмная тема"}
      style={{
        background: "none", border: "1px solid var(--color-border-light)",
        borderRadius: "var(--radius-m)", padding: 6, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--color-text-secondary)", width: 36, height: 36,
      }}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
