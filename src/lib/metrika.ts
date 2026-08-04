"use client";

/**
 * Send a Yandex.Metrica goal (client-side only).
 * Safe to call on server — silently no-ops.
 */
export function trackGoal(goal: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const ym = (window as any).ym;
  if (typeof ym !== "function") return;
  try {
    const metrikaId = getMetrikaId();
    if (metrikaId && params) {
      ym(metrikaId, "reachGoal", goal, params);
    } else if (metrikaId) {
      ym(metrikaId, "reachGoal", goal);
    }
  } catch {}
}

function getMetrikaId(): number | null {
  try {
    // Metrika counter ID — extracted from the first ym() init call
    const scripts = document.querySelectorAll("script");
    for (const s of scripts) {
      const match = s.textContent?.match(/ym\((\d+)/);
      if (match) return parseInt(match[1], 10);
    }
  } catch {}
  return null;
}

// Predefined goals for type safety
export const Goals = {
  REGISTRATION: "registration",
  BLUEPRINT_START: "blueprint_start",
  BLUEPRINT_COMPLETE: "blueprint_complete",
  PRO_CLICK: "pro_click",
  SEARCH_USE: "search_use",
} as const;
