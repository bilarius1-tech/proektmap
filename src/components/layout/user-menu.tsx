"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function UserMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "4px 8px",
        background: "transparent", border: "1px solid var(--color-border-light)",
        borderRadius: "var(--radius-m)", cursor: "pointer", color: "var(--color-text-primary)",
        fontSize: "var(--text-s)",
      }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-accent)" }}>
          {(user.name || user.email || "?")[0].toUpperCase()}
        </div>
        <span className="hide-mobile" style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.name || user.email}
        </span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", right: 0, top: "100%", marginTop: 4, zIndex: 100,
            background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-m)", boxShadow: "var(--shadow-m)", minWidth: 180,
            padding: "var(--space-xs)",
          }}>
            <Link href="/dashboard" onClick={() => setOpen(false)} style={menuItem}><User size={14} /> Личный кабинет</Link>
            <Link href="/dashboard/settings" onClick={() => setOpen(false)} style={menuItem}><Settings size={14} /> Настройки</Link>
            <div style={{ height: 1, background: "var(--color-border-light)", margin: "4px 0" }} />
            <button onClick={() => signOut({ callbackUrl: "/" })} style={{ ...menuItem, width: "100%", textAlign: "left", background: "none", border: "none" }}>
              <LogOut size={14} /> Выйти
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const menuItem: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
  borderRadius: "var(--radius-s)", fontSize: "var(--text-s)", color: "var(--color-text-primary)",
  textDecoration: "none", cursor: "pointer", transition: "background 0.1s",
};
