import { auth } from "@/lib/auth";
import Link from "next/link";
import { Menu } from "lucide-react";
import UserMenu from "./user-menu";

export default async function GlobalHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header style={{
      height: 56, background: "var(--color-bg-primary)", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 var(--space-m)",
      borderBottom: "1px solid var(--color-border-light)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      {/* Left: Logo + Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-l)" }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, textDecoration: "none", color: "inherit", whiteSpace: "nowrap" }}>
          Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
        </Link>
        <nav style={{ display: "flex", gap: "var(--space-s)", alignItems: "center" }} className="hide-mobile">
          <Link href="/" style={navLink}>Шаблоны</Link>
          <Link href="/#memory-bank" style={navLink}>Memory Bank</Link>
        </nav>
      </div>

      {/* Right: User */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link href="/auth" className="btn btn-primary" style={{ textDecoration: "none", fontSize: "var(--text-xs)", padding: "6px 14px" }}>
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}

const navLink: React.CSSProperties = {
  color: "var(--color-text-secondary)", fontSize: "var(--text-s)", textDecoration: "none",
  padding: "4px 8px", borderRadius: "var(--radius-s)",
};
