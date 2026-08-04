"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function StreakBanner() {
  const [streak, setStreak] = useState<number | null>(null);
  const [xpGained, setXpGained] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
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
    <div className="bg-accent text-white py-xs px-m text-center text-xs font-semibold">
      <Zap size={14} className="inline align-middle mr-[6px]" />
      {streak}-й день подряд! +{xpGained} XP 🎉
    </div>
  );
}
