"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function StreakBanner() {
  const [streak, setStreak] = useState<number | null>(null);
  const [xpGained, setXpGained] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check and claim streak
    fetch("/api/user/streak", { method: "POST" })
      .then(r => r.json())
      .then(d => {
        if (d.streak && !d.alreadyClaimed && d.xpGained > 0) {
          setStreak(d.streak);
          setXpGained(d.xpGained);
          setShow(true);
          setTimeout(() => setShow(false), 5000);
        }
      });
  }, []);

  if (!show) return null;

  return (
    <div style={{
      background: "var(--color-accent)", color: "white", padding: "8px 16px",
      textAlign: "center", fontSize: "var(--text-s)", fontWeight: 600,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      animation: "slideDown 0.3s ease",
    }}>
      <Zap size={16} />
      {streak && streak >= 7 ? "🔥" : "👍"} {streak} {streak === 1 ? "день" : streak! < 5 ? "дня" : "дней"} подряд! +{xpGained} XP
    </div>
  );
}
