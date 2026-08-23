import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Подтверждение email — ProektMap" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let verified = false;
  let error = "";

  if (token) {
    try {
      const res = await fetch(`https://proektmap.ru/api/auth/verify?token=${token}`);
      const d = await res.json();
      if (d.ok) verified = true;
      else error = d.error || "Неверный токен";
    } catch { error = "Ошибка соединения"; }
  }

  return (
    <div style={{ maxWidth: 500, margin: "80px auto", padding: "var(--space-xl)", textAlign: "center", fontFamily: "var(--font-body)" }}>
      {verified ? (
        <>
          <div style={{ fontSize: 48, marginBottom: "var(--space-m)" }}>✅</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-s)" }}>Email подтверждён!</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-l)" }}>Твой аккаунт верифицирован. Теперь доступны все функции.</p>
          <Link href="/dashboard" style={{ display: "inline-flex", padding: "12px 24px", background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, borderRadius: "var(--radius-m)" }}>В личный кабинет →</Link>
        </>
      ) : error ? (
        <>
          <div style={{ fontSize: 48, marginBottom: "var(--space-m)" }}>❌</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-s)" }}>Ошибка</h1>
          <p style={{ color: "var(--color-error)", fontSize: "var(--text-s)", marginBottom: "var(--space-l)" }}>{error}</p>
          <Link href="/dashboard" style={{ color: "var(--color-accent)" }}>В личный кабинет</Link>
        </>
      ) : (
        <>
          <div style={{ fontSize: 48, marginBottom: "var(--space-m)" }}>📧</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-s)" }}>Проверь почту</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-l)" }}>Мы отправили ссылку для подтверждения email. Перейди по ссылке в письме.</p>
          <Link href="/dashboard" style={{ color: "var(--color-accent)" }}>В личный кабинет</Link>
        </>
      )}
    </div>
  );
}
