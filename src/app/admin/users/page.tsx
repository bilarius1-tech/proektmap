import { getDb } from "@/lib/db";
import { Ban, CheckCircle, Search } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const db = await getDb();
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { projects: { include: { blueprint: true } } },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Пользователи</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{users.length} пользователей</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["ID", "Email", "Имя", "Роль", "Проектов", "Дата", "Действия"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "10px 16px", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)" }}>{u.id.slice(0, 8)}</td>
                <td style={{ padding: "10px 16px", fontWeight: 600 }}>{u.email}</td>
                <td style={{ padding: "10px 16px", color: "var(--color-text-secondary)" }}>{u.name || "—"}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span className="badge" style={{
                    background: u.role === "admin" ? "var(--color-accent-light)" : "var(--color-bg-tertiary)",
                    color: u.role === "admin" ? "var(--color-accent)" : "var(--color-text-tertiary)",
                  }}>{u.role ?? "user"}</span>
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>
                    {u.projects?.length || 0}
                  </span>
                </td>
                <td style={{ padding: "10px 16px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  {new Date(u.createdAt).toLocaleDateString("ru")}
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Link href={`/admin/users/${u.id}`} className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: "var(--text-xs)" }}>
                      <Search size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
