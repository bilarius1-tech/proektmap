"use client";

import { useState, useEffect } from "react";
import { Upload, ImageIcon, X } from "lucide-react";

export default function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (open) fetch("/api/upload/list").then(r => r.json()).then(d => setImages(d.images || []));
  }, [open]);

  async function uploadFile(file: File) {
    setUploading(true);
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) { setImages(prev => [data.url, ...prev]); onChange(data.url); }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) uploadFile(file);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div onClick={() => setOpen(!open)} style={{
          width: 100, height: 60, borderRadius: "var(--radius-s)", border: "2px dashed var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          background: value ? `url(${value}) center/cover` : "var(--color-bg-secondary)",
          flexShrink: 0, overflow: "hidden",
        }}>{!value && <ImageIcon size={20} style={{ color: "var(--color-text-tertiary)" }} />}</div>
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder="URL или выберите из медиатеки →"
          style={{ flex: 1, padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        <button type="button" onClick={() => setOpen(!open)}
          style={{ padding: "8px 14px", borderRadius: "var(--radius-s)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", cursor: "pointer", fontSize: "var(--text-xs)", whiteSpace: "nowrap" }}>🖼️ Медиатека</button>
      </div>

      {open && (
        <div style={{ marginTop: "var(--space-m)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", maxHeight: 320, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)" }}>
            <div style={{ fontWeight: 600, fontSize: "var(--text-s)" }}>Медиатека</div>
            <label style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-s)", background: "var(--color-accent)", color: "white", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
              <Upload size={12} /> {uploading ? "Загрузка..." : "Загрузить"}
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} style={{ display: "none" }} />
            </label>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: dragOver ? "2px dashed var(--color-accent)" : "2px dashed transparent",
              borderRadius: "var(--radius-m)", padding: dragOver ? 12 : 0, marginBottom: 8, textAlign: "center",
              fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", transition: "0.2s",
            }}>
            {dragOver ? "Отпустите для загрузки" : images.length === 0 ? "Перетащите картинку сюда" : ""}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 6 }}>
            {images.map((img, i) => (
              <div key={i} onClick={() => { onChange(img); setOpen(false); }}
                style={{ aspectRatio: "1", borderRadius: "var(--radius-s)", cursor: "pointer",
                  background: `url(${img}) center/cover`,
                  border: value === img ? "3px solid var(--color-accent)" : "1px solid var(--color-border-light)",
                  opacity: value === img ? 1 : 0.85, position: "relative",
                }}>
                {value === img && <div style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "var(--color-accent)", color: "white", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
