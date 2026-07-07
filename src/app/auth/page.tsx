"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    if (result?.error) setError("Неверный email или пароль");
    else router.push("/dashboard");
    setLoading(false);
  }

  async function handleYandex() {
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

        {/* Yandex */}
        <button onClick={handleYandex} style={{
          width: "100%", padding: "12px", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)",
          background: "var(--color-bg-primary)", color: "var(--color-text-primary)", fontSize: "var(--text-m)", fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)",
        }}>
          <span style={{ color: "#fc3f1d", fontWeight: 800 }}>Я</span> Войти через Яндекс
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>
          <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
          или
          <div style={{ flex: 1, height: 1, background: "var(--color-border-light)" }} />
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
      </div>
    </div>
  );
}
