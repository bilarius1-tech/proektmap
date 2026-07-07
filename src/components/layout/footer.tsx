import Link from "next/link";

export default function GlobalFooter() {
  return (
    <footer style={{
      background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border-light)",
      padding: "var(--space-xl) var(--space-m)", marginTop: "auto",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "var(--space-xl)" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "var(--text-m)", marginBottom: "var(--space-s)" }}>
            Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
            Первая школа AI-инженеров в России. Научись создавать проекты с помощью AI.
          </p>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: "var(--space-s)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-tertiary)" }}>Проект</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <Link href="/" style={footerLink}>Шаблоны</Link>
            <Link href="/dashboard" style={footerLink}>Личный кабинет</Link>
            <Link href="/auth" style={footerLink}>Войти</Link>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: "var(--space-s)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-tertiary)" }}>Документы</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <Link href="#" style={footerLink}>Политика конфиденциальности</Link>
            <Link href="#" style={footerLink}>Условия использования</Link>
            <Link href="#" style={footerLink}>Оферта</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "var(--space-xl) auto 0", paddingTop: "var(--space-m)", borderTop: "1px solid var(--color-border-light)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
        © 2026 ProektMap. Школа AI-инженеров. ИП Тимофеев А.Г.
        <div style={{ marginTop: 4 }}>
          <a href="/admin" style={{ color: "var(--color-text-tertiary)", fontSize: "10px", textDecoration: "none", opacity: 0.3 }}>админка</a>
        </div>
      </div>
    </footer>
  );
}

const footerLink: React.CSSProperties = {
  fontSize: "var(--text-s)", color: "var(--color-text-secondary)", textDecoration: "none",
};
