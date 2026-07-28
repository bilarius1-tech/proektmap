import Link from "next/link";
import { Home, Search, BookOpen, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "60dvh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "var(--space-xl) var(--space-m)", textAlign: "center",
    }}>
      <div style={{ maxWidth: 500 }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: "var(--color-accent)", lineHeight: 1, marginBottom: "var(--space-s)", fontFamily: "var(--font-heading)" }}>
          404
        </div>
        <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", fontFamily: "var(--font-heading)" }}>
          Страница не найдена
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7, marginBottom: "var(--space-xl)" }}>
          Возможно, страница была перемещена, удалена или вы набрали неправильный адрес.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "12px 24px", borderRadius: "var(--radius-m)",
            background: "var(--color-accent)", color: "white",
            textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600,
          }}>
            <Home size={16} /> На главную
          </Link>
          <Link href="/blog" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "12px 24px", borderRadius: "var(--radius-m)",
            background: "var(--color-bg-secondary)", color: "var(--color-text-primary)",
            textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600,
            border: "1px solid var(--color-border)",
          }}>
            <BookOpen size={16} /> Блог
          </Link>
          <Link href="/search" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "12px 24px", borderRadius: "var(--radius-m)",
            background: "var(--color-bg-secondary)", color: "var(--color-text-primary)",
            textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600,
            border: "1px solid var(--color-border)",
          }}>
            <Search size={16} /> Поиск
          </Link>
        </div>
        <div style={{ marginTop: "var(--space-xl)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          <Link href="/sitemap" style={{ color: "var(--color-accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Compass size={14} /> Карта сайта
          </Link>
        </div>
      </div>
    </div>
  );
}
