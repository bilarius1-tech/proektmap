"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  Crown,
  Lock,
  Unlock,
  ExternalLink,
  Save,
  Search,
  Filter,
} from "lucide-react";

interface PatternItem {
  slug: string;
  defaultTitle: string;
  customTitle: string;
  title: string;
  defaultDesc: string;
  customDesc: string;
  description: string;
  category: string;
  screenshot: string;
  isPro: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export default function AdminUiPatternsClient({
  initialPatterns,
}: {
  initialPatterns: PatternItem[];
}) {
  const [patterns, setPatterns] = useState<PatternItem[]>(initialPatterns);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = Array.from(new Set(patterns.map((p) => p.category)));

  const filtered = patterns.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleFieldChange = (
    slug: string,
    field: keyof PatternItem,
    value: any
  ) => {
    setPatterns((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const updated = { ...p, [field]: value };
          if (field === "customTitle") {
            updated.title = value || p.defaultTitle;
          }
          if (field === "customDesc") {
            updated.description = value || p.defaultDesc;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleFileUpload = async (slug: string, file: File) => {
    setUploadingSlug(slug);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      handleFieldChange(slug, "screenshot", data.url);
      await savePattern(slug, { screenshot: data.url });
    } catch (e: any) {
      alert("Ошибка загрузки файла: " + e.message);
    } finally {
      setUploadingSlug(null);
    }
  };

  const savePattern = async (slug: string, overrideData?: Partial<PatternItem>) => {
    setSavingSlug(slug);
    const pattern = patterns.find((p) => p.slug === slug);
    if (!pattern) return;

    const payload = {
      slug,
      customTitle: overrideData?.customTitle ?? pattern.customTitle,
      customDesc: overrideData?.customDesc ?? pattern.customDesc,
      screenshot: overrideData?.screenshot ?? pattern.screenshot,
      isPro: overrideData?.isPro ?? pattern.isPro,
      isFeatured: overrideData?.isFeatured ?? pattern.isFeatured,
      sortOrder: overrideData?.sortOrder ?? pattern.sortOrder,
    };

    try {
      const res = await fetch("/api/admin/ui-patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      setSuccessMsg(`Паттерн #${slug} успешно сохранён!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      alert("Ошибка сохранения: " + e.message);
    } finally {
      setSavingSlug(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-l)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Sparkles size={20} color="var(--color-accent)" />
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, margin: 0 }}>
              Управление UI-Атласом
            </h1>
          </div>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", margin: 0 }}>
            Редактирование заголовков, загрузка превью/скриншотов и переключение доступа Free / Pro.
          </p>
        </div>

        {successMsg && (
          <div style={{ padding: "8px 16px", background: "var(--color-accent-light)", color: "var(--color-accent)", border: "1px solid var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 700 }}>
            {successMsg}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: "var(--space-l)", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "6px 12px", flex: 1, minWidth: 260 }}>
          <Search size={16} color="var(--color-text-tertiary)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или slug..."
            style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "var(--text-xs)", color: "var(--color-text-primary)" }}
          />
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          style={{ padding: "8px 12px", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-primary)" }}
        >
          <option value="all">Все категории ({patterns.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
        {filtered.map((item) => {
          const isSaving = savingSlug === item.slug;
          const isUploading = uploadingSlug === item.slug;

          return (
            <div
              key={item.slug}
              style={{
                background: "var(--color-bg-primary)",
                border: item.isPro ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                padding: "var(--space-m)",
                display: "grid",
                gridTemplateColumns: "180px 1fr 220px",
                gap: "var(--space-m)",
                alignItems: "start",
              }}
            >
              {/* Preview & Image Upload */}
              <div>
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    background: "var(--color-bg-secondary)",
                    border: "1px dashed var(--color-border)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  {item.screenshot ? (
                    <img
                      src={item.screenshot}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ textAlign: "center", padding: 8, color: "var(--color-text-tertiary)" }}>
                      <ImageIcon size={24} style={{ margin: "0 auto 4px" }} />
                      <span style={{ fontSize: 10 }}>Нет скриншота</span>
                    </div>
                  )}

                  {/* Upload Overlay Button */}
                  <label
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      opacity: isUploading ? 1 : 0,
                      transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <Upload size={14} />
                    <span>{isUploading ? "Загрузка..." : "Загрузить фото"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(item.slug, f);
                      }}
                    />
                  </label>
                </div>

                <a
                  href={`/ui-patterns/${item.slug}`}
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
                  <span>Песочница на сайте</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Editable Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontWeight: 700 }}>
                      #{item.slug}
                    </span>
                    <span style={{ fontSize: 10, textTransform: "uppercase", background: "var(--color-bg-secondary)", padding: "1px 6px", border: "1px solid var(--color-border)" }}>
                      {item.category}
                    </span>
                  </div>

                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 2 }}>
                    Заголовок решения (titleRu):
                  </label>
                  <input
                    type="text"
                    value={item.customTitle || item.defaultTitle}
                    onChange={(e) => handleFieldChange(item.slug, "customTitle", e.target.value)}
                    placeholder={item.defaultTitle}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      background: "var(--color-bg-secondary)",
                      border: "1px solid var(--color-border)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 2 }}>
                    Краткое описание:
                  </label>
                  <textarea
                    rows={2}
                    value={item.customDesc || item.defaultDesc}
                    onChange={(e) => handleFieldChange(item.slug, "customDesc", e.target.value)}
                    placeholder={item.defaultDesc}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      background: "var(--color-bg-secondary)",
                      border: "1px solid var(--color-border)",
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {/* Status Controls & Save */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 12, borderLeft: "1px solid var(--color-border-light)" }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                    Уровень доступа:
                  </label>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => handleFieldChange(item.slug, "isPro", false)}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                        border: "1px solid",
                        borderColor: !item.isPro ? "var(--color-success)" : "var(--color-border)",
                        background: !item.isPro ? "rgba(34, 197, 94, 0.1)" : "var(--color-bg-secondary)",
                        color: !item.isPro ? "var(--color-success)" : "var(--color-text-tertiary)",
                        cursor: "pointer",
                      }}
                    >
                      FREE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange(item.slug, "isPro", true)}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                        border: "1px solid",
                        borderColor: item.isPro ? "var(--color-accent)" : "var(--color-border)",
                        background: item.isPro ? "var(--color-accent)" : "var(--color-bg-secondary)",
                        color: item.isPro ? "#fff" : "var(--color-text-tertiary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                      }}
                    >
                      <Crown size={11} />
                      <span>PRO</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => savePattern(item.slug)}
                  disabled={isSaving}
                  style={{
                    padding: "8px 14px",
                    background: "var(--color-accent)",
                    color: "#fff",
                    border: "1px solid var(--color-accent)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: "auto",
                  }}
                >
                  <Save size={14} />
                  <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
