"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
    setMounted(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  }

  if (!mounted || !visible) return null;

  return (
    <div className="cookie-banner fixed left-0 right-0 z-[1000] flex items-center justify-between gap-m flex-wrap bg-bg-primary border-t border-border px-l py-m text-xs"
      style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", bottom: "var(--bottom-chrome, 56px)" }}>
      <div className="flex-1 min-w-[200px] text-text-secondary leading-relaxed">
        🍪 Мы используем cookies для авторизации и аналитики (Яндекс.Метрика).
        Продолжая использовать сайт, вы соглашаетесь с{" "}
        <a href="/privacy" className="text-accent font-semibold">Политикой конфиденциальности</a>.
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={accept}
          className="px-[20px] py-2 rounded-m bg-accent text-white border-0 text-xs font-semibold cursor-pointer"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
