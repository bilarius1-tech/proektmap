import { Wrench, Search, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-xs)" }}>Настройки сайта</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-xl)" }}>SEO, мета-теги, общие настройки</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
        {/* General */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
            <Wrench size={18} color="var(--color-text-secondary)" />
            <h2 style={{ fontSize: "var(--text-l)" }}>Общие</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-2xs)" }}>Название сайта</label>
              <input className="input" defaultValue="ProektMap — Инженерный навигатор" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-2xs)" }}>Описание</label>
              <textarea className="input" rows={3} defaultValue="Школа вайбкодинга в России. Научись создавать сайты с помощью AI." style={{ resize: "vertical" }} />
            </div>
            <div>
              <button className="btn btn-primary">Сохранить</button>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
            <Search size={18} color="var(--color-text-secondary)" />
            <h2 style={{ fontSize: "var(--text-l)" }}>SEO</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-2xs)" }}>Meta Title</label>
              <input className="input" defaultValue="ProektMap — Школа вайбкодинга в России" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-2xs)" }}>Meta Description</label>
              <textarea className="input" rows={2} defaultValue="Научись создавать сайты с помощью AI. От установки VS Code до запуска рекламы." style={{ resize: "vertical" }} />
            </div>
            <div>
              <button className="btn btn-primary">Сохранить</button>
            </div>
          </div>
        </div>

        {/* Коды */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
            <Globe size={18} color="var(--color-text-secondary)" />
            <h2 style={{ fontSize: "var(--text-l)" }}>Коды вставки</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-2xs)" }}>Яндекс.Метрика</label>
              <textarea className="input" rows={2} placeholder="Код счётчика Метрики" style={{ resize: "vertical" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-2xs)" }}>Код в &lt;head&gt;</label>
              <textarea className="input" rows={2} placeholder="Произвольный HTML" style={{ resize: "vertical" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 600, marginBottom: "var(--space-2xs)" }}>Код в &lt;body&gt;</label>
              <textarea className="input" rows={2} placeholder="Произвольный HTML" style={{ resize: "vertical" }} />
            </div>
            <div>
              <button className="btn btn-primary">Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
