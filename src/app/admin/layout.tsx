import Link from "next/link";
import { Home, FileText, Layers, GitBranch, Settings, Users, Menu, Puzzle, Link as LinkIcon, Cpu, BookOpen, Palette } from "lucide-react";

const nav = [
  { href: "/admin", label: "Обзор", icon: Home },
    { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/blueprints", label: "Blueprints", icon: FileText },
  { href: "/admin/stages", label: "Этапы", icon: Layers },
  { href: "/admin/decisions", label: "Решения", icon: GitBranch },
    { href: "/admin/glossary", label: "Глоссарий", icon: BookOpen },
    { href: "/admin/skills", label: "Skills", icon: Puzzle },
    { href: "/admin/blog", label: "Блог", icon: BookOpen },
    { href: "/admin/ai-radar", label: "AI Radar", icon: Cpu },
  { href: "/admin/design", label: "Дизайн", icon: Palette },
    { href: "/admin/mcp", label: "MCP-серверы", icon: Cpu },
    { href: "/admin/settings", label: "Настройки", icon: Settings },
    { href: "/admin/menu", label: "Меню", icon: Menu },
    { href: "/admin/referrals", label: "Рефералы", icon: LinkIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-secondary)" }}>
      <aside style={{ width: 220, background: "var(--color-bg-primary)", borderRight: "1px solid var(--color-border-light)", padding: "var(--space-m)" }}>
        <div style={{ fontSize: "var(--text-l)", fontWeight: 800, marginBottom: "var(--space-l)", padding: "0 var(--space-s)" }}>
          Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
          <span style={{ display: "block", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontWeight: 400 }}>Админка</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(item => (
            <Link key={item.href} href={item.href}
              style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", padding: "8px 12px", borderRadius: "var(--radius-m)", color: "var(--color-text-primary)", fontSize: "var(--text-s)", fontWeight: 500, textDecoration: "none", transition: "background var(--transition-fast)" }}>
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "var(--space-xl)", maxWidth: 1200 }}>{children}</main>
    </div>
  );
}
