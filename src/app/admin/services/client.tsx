"use client";

import React, { useState } from "react";
import { normalizeMediaUrl } from "@/lib/services/data";
import {
  Wrench,
  Upload,
  Image as ImageIcon,
  Check,
  ExternalLink,
  Save,
  Search,
  Eye,
  Sparkles,
  Layers,
  Trash2,
} from "lucide-react";

interface ServiceAdminItem {
  slug: string;
  defaultTitle: string;
  customTitle: string;
  title: string;
  defaultDesc: string;
  customDesc: string;
  description: string;
  category: string;
  coverImage: string;
  viewCount: number;
  useCount: number;
  shareCount: number;
  isFeatured: boolean;
  sortOrder: number;
  status: string;
}

export default function AdminServicesClient({
  initialServices,
}: {
  initialServices: ServiceAdminItem[];
}) {
  const [services, setServices] = useState<ServiceAdminItem[]>(initialServices);
  const [search, setSearch] = useState("");
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  const handleFieldChange = (
    slug: string,
    field: keyof ServiceAdminItem,
    value: any
  ) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.slug === slug) {
          const updated = { ...s, [field]: value };
          if (field === "customTitle") {
            updated.title = value || s.defaultTitle;
          }
          if (field === "customDesc") {
            updated.description = value || s.defaultDesc;
          }
          return updated;
        }
        return s;
      })
    );
  };

  const handleFileUpload = async (slug: string, file: File) => {
    setUploadingSlug(slug);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      handleFieldChange(slug, "coverImage", data.url);
      await saveService(slug, { coverImage: data.url });
    } catch (e: any) {
      alert("Ошибка загрузки файла: " + e.message);
    } finally {
      setUploadingSlug(null);
    }
  };

  const saveService = async (slug: string, overrideFields: Partial<ServiceAdminItem> = {}) => {
    setSavingSlug(slug);
    try {
      const current = services.find((s) => s.slug === slug);
      if (!current) return;

      const payload = {
        slug,
        customTitle: overrideFields.customTitle !== undefined ? overrideFields.customTitle : current.customTitle,
        customDesc: overrideFields.customDesc !== undefined ? overrideFields.customDesc : current.customDesc,
        coverImage: overrideFields.coverImage !== undefined ? overrideFields.coverImage : current.coverImage,
        isFeatured: overrideFields.isFeatured !== undefined ? overrideFields.isFeatured : current.isFeatured,
        sortOrder: overrideFields.sortOrder !== undefined ? overrideFields.sortOrder : current.sortOrder,
      };

      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccessMsg(`Микросервис "${current.title}" успешно сохранен`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      alert("Ошибка при сохранении: " + e.message);
    } finally {
      setSavingSlug(null);
    }
  };

  return (
    <div>
      {/* Toast */}
      {successMsg && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: "var(--color-surface)",
            color: "var(--color-accent)",
            padding: "12px 20px",
            borderRadius: "var(--radius-m)",
            boxShadow: "var(--shadow-l)",
            border: "1px solid var(--color-accent)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: "var(--text-s)",
            fontWeight: 700,
          }}
        >
          <Check size={18} />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "var(--space-l)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Wrench size={24} style={{ color: "var(--color-accent)" }} />
          <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, margin: 0 }}>
            Управление микросервисами
          </h1>
        </div>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", margin: 0 }}>
          Здесь можно менять главное фото (обложку), кастомный заголовок H1, описание и настройки отображения.
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: "var(--space-l)",
          background: "var(--color-surface)",
          padding: 12,
          borderRadius: "var(--radius-m)",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-tertiary)",
            }}
          />
          <input
            type="text"
            placeholder="Поиск по названию или slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: "var(--radius-s)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-primary)",
              fontSize: "var(--text-s)",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {filtered.map((item) => {
          const isSaving = savingSlug === item.slug;
          const isUploading = uploadingSlug === item.slug;

          return (
            <div
              key={item.slug}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-l)",
                border: "1px solid var(--color-border-light)",
                padding: "24px",
                boxShadow: "var(--shadow-s)",
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: 24,
              }}
            >
              {/* Left: Image Uploader */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 6, color: "var(--color-text-secondary)" }}>
                  Обложка / Фото сервиса:
                </label>

                <div
                  style={{
                    height: 140,
                    borderRadius: "var(--radius-m)",
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {item.coverImage ? (
                    <img
                      src={normalizeMediaUrl(item.coverImage)}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ textAlign: "center", padding: 10 }}>
                      <ImageIcon size={32} style={{ color: "var(--color-text-tertiary)", margin: "0 auto 4px" }} />
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Нет обложки</div>
                    </div>
                  )}

                  {isUploading && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      Загрузка...
                    </div>
                  )}
                </div>

                {/* Upload & Clear buttons */}
                <div style={{ display: "flex", gap: 6 }}>
                  <label
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: "var(--radius-s)",
                      background: "var(--color-accent)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <Upload size={12} />
                    <span>Загрузить</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(item.slug, file);
                      }}
                    />
                  </label>

                  {item.coverImage && (
                    <button
                      onClick={() => handleFieldChange(item.slug, "coverImage", "")}
                      title="Удалить обложку"
                      style={{
                        padding: "6px 8px",
                        borderRadius: "var(--radius-s)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-secondary)",
                        color: "var(--color-error)",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  placeholder="или URL картинки..."
                  value={item.coverImage}
                  onChange={(e) => handleFieldChange(item.slug, "coverImage", e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "4px 8px",
                    fontSize: 10,
                    borderRadius: "var(--radius-s)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-primary)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              {/* Right: Text Fields & Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)" }}>
                      /services/{item.slug}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--color-bg-secondary)",
                          color: "var(--color-text-secondary)",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {item.category}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                        👁️ {item.viewCount} просмотров &middot; ⚡ {item.useCount} генераций
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/services/${item.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "var(--color-accent)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <span>Открыть на сайте</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Custom Title (H1) */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                    Заголовок H1 (название):
                  </label>
                  <input
                    type="text"
                    value={item.customTitle || ""}
                    placeholder={item.defaultTitle}
                    onChange={(e) => handleFieldChange(item.slug, "customTitle", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-s)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-primary)",
                      color: "var(--color-text-primary)",
                      fontSize: "var(--text-s)",
                      fontWeight: 700,
                    }}
                  />
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                    По умолчанию: {item.defaultTitle}
                  </div>
                </div>

                {/* Custom Description */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                    Краткое описание:
                  </label>
                  <textarea
                    rows={2}
                    value={item.customDesc || ""}
                    placeholder={item.defaultDesc}
                    onChange={(e) => handleFieldChange(item.slug, "customDesc", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-s)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-primary)",
                      color: "var(--color-text-primary)",
                      fontSize: "var(--text-xs)",
                      resize: "vertical",
                    }}
                  />
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                    По умолчанию: {item.defaultDesc}
                  </div>
                </div>

                {/* Footer Save Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
                  <button
                    disabled={isSaving}
                    onClick={() => saveService(item.slug)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "var(--radius-s)",
                      background: "var(--color-accent)",
                      color: "#fff",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      border: "none",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "var(--shadow-s)",
                    }}
                  >
                    <Save size={14} />
                    <span>{isSaving ? "Сохранение..." : "Сохранить изменения"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
