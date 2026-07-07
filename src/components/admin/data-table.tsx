"use client";

import { useState } from "react";

interface Column<T> { key: string; header: string; render?: (row: T) => React.ReactNode; width?: string; }
interface DataTableProps<T> {
  columns: Column<T>[]; data: T[]; searchFields?: string[];
  searchPlaceholder?: string; pageSize?: number;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({ columns, data, searchFields, searchPlaceholder = "Поиск...", pageSize = 20, actions }: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  let filtered = data;
  if (search && searchFields) {
    const q = search.toLowerCase();
    filtered = data.filter(row => searchFields.some(f => String(row[f] || "").toLowerCase().includes(q)));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)", flexWrap: "wrap", gap: "var(--space-s)" }}>
        {searchFields && <input className="input" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder={searchPlaceholder} style={{ maxWidth: 280 }} />}
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{total} записей{search ? " · найдено: " + total : ""}</span>
      </div>

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {columns.map(col => (
                <th key={col.key} style={{ textAlign: "left", padding: "10px 16px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, width: col.width, whiteSpace: "nowrap" }}>{col.header}</th>
              ))}
              {actions && <th style={{ width: 80, padding: "10px 16px" }} />}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={row.id || i} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                {columns.map(col => <td key={col.key} style={{ padding: "10px 16px", fontSize: "var(--text-s)" }}>{col.render ? col.render(row) : row[col.key]}</td>)}
                {actions && <td style={{ padding: "10px 16px" }}><div style={{ display: "flex", gap: 4 }}>{actions(row)}</div></td>}
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={columns.length + (actions ? 1 : 0)} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{search ? "Ничего не найдено" : "Нет данных"}</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-s)", fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>
          <span>{start + 1}–{Math.min(start + pageSize, total)} из {total}</span>
          <div style={{ display: "flex", gap: 2 }}>
            <button onClick={() => setPage(1)} disabled={page === 1} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: "var(--text-xs)" }}>«</button>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: "var(--text-xs)" }}>‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pn = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pn > totalPages) return null;
              return <button key={pn} onClick={() => setPage(pn)} className={page === pn ? "btn btn-primary" : "btn btn-ghost"} style={{ padding: "4px 10px", fontSize: "var(--text-xs)", minWidth: 32 }}>{pn}</button>;
            })}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: "var(--text-xs)" }}>›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: "var(--text-xs)" }}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}
