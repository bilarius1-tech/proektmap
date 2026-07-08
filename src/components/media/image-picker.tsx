"use client";

import { useState, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

export default function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      fetch("/api/upload/list").then(r => r.json()).then(d => setImages(d.images || []));
    }
  }, [open]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) {
      setImages(prev => [data.url, ...prev]);
      onChange(data.url);
    }
    setUploading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div onClick={() => setOpen(!open)} style={{
          width: 100, height: 60, borderRadius: "var(--radius-s)", border: "2px dashed var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          background: value ? `url(${value}) center/cover` : "var(--color-bg-secondary)",
          flexShrink: 0, overflow: "hidden",
        }}>
          {!value && <ImageIcon size={20} style={{ color: "var(--color-text-tertiary)" }} />}
        </div>
        <div style={{ flex: 1 }}>
          <input value={value} onChange={e => onChange(e.target.value)} placeholder="URL картинки или выберите из медиатеки"
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
        <button onClick={() => setOpen(!open)} style={{
          padding: "8px 14px", borderRadius: "var(--radius-s)", background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)", cursor: "pointer", fontSize: "var(--text-xs)", whiteSpace: "nowrap",
        }}>🖼️ Медиатека</button>
      </div>

      {open && (
        <div style={{
          marginTop: "var(--space-m)", padding: "var(--space-m)", background: "white",
          borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)",
          maxHeight: 300, overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)" }}>
            <div style={{ fontWeight: 600, fontSize: "var(--text-s)" }}>Медиатека</div>
            <label style={{
              display: "flex", alignItems: "center", gap: 4, padding: "6px 12px",
              borderRadius: "var(--radius-s)", background: "var(--color-accent)", color: "white",
              fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
            }}>
              <Upload size={12} /> {uploading ? "Загрузка..." : "Загрузить"}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
            {images.map((img, i) => (
              <div key={i} onClick={() => { onChange(img); setOpen(false); }}
                style={{
                  aspectRatio: "1", borderRadius: "var(--radius-s)", cursor: "pointer",
                  background: `url(${img}) center/cover`,
                  border: value === img ? "3px solid var(--color-accent)" : "1px solid var(--color-border-light)",
                  opacity: value === img ? 1 : 0.8,
                }} />
            ))}
            {images.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "var(--space-l)", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>
                Загрузите первую картинку
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
