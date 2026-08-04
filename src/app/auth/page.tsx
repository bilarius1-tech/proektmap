"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trackGoal, Goals } from "@/lib/metrika";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"login" | "register">("login");

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    if (tab === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await res.json();
      if (d.error) { setError(d.error); setLoading(false); return; }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Неверный email или пароль");
      setLoading(false);
    } else {
      trackGoal(Goals.REGISTRATION, { method: "email" });
      router.push("/dashboard");
    }
  }

  async function handleYandex() {
    trackGoal(Goals.REGISTRATION, { method: "yandex" });
    await signIn("yandex", { callbackUrl: "/dashboard" });
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-secondary)", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-m)" }}>
      <div style={{ width: "100%", maxWidth: 380, background: "var(--color-bg-primary)", borderRadius: "var(--radius-xl)", padding: "var(--space-xl)", border: "1px solid var(--color-border-light)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-l)" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: "var(--space-xs)" }}>
            Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
          </div>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)" }}>Войдите чтобы продолжить</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "var(--space-m)", borderBottom: "1px solid var(--color-border-light)" }}>
          {(["login", "register"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "var(--space-s)", border: "none", background: "transparent",
              cursor: "pointer", fontWeight: tab === t ? 700 : 400,
              color: tab === t ? "var(--color-accent)" : "var(--color-text-tertiary)",
              borderBottom: tab === t ? "2px solid var(--color-accent)" : "2px solid transparent",
              fontSize: "var(--text-s)", marginBottom: -1,
            }}>
              {t === "login" ? "Вход" : "Регистрация"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required style={{ padding: "12px" }} />
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Пароль" required style={{ padding: "12px" }} />
          {error && <div style={{ fontSize: "var(--text-xs)", color: "var(--color-error)", padding: "var(--space-s)", background: "var(--color-error-light)", borderRadius: "var(--radius-m)" }}>{error}</div>}
          <button type="submit" disabled={loading}
            className="btn btn-primary" style={{ padding: "12px", justifyContent: "center", fontSize: "var(--text-m)" }}>
            {loading ? "..." : (tab === "login" ? "Войти" : "Зарегистрироваться")}
          </button>
        </form>

        {/* Yandex OAuth */}
        <div style={{ marginTop: "var(--space-m)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-s)" }}>
            <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>или</span>
            <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
          </div>
          <button
            onClick={handleYandex}
            className="btn btn-ghost"
            style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "var(--text-s)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FC3F1D" style={{ marginRight: 8 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-11H13v6h2.5V9zm-5 0H8v6h2.5V9z" />
            </svg>
            Войти через Яндекс
          </button>
        </div>
      </div>
    </div>
  );
}
