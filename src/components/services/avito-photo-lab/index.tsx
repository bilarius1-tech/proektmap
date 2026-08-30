"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  UploadCloud,
  FileImage,
  Sliders,
  Sparkles,
  Layers,
  Search,
  Download,
  Check,
  AlertTriangle,
  ShieldCheck,
  Eye,
  RefreshCw,
  Trash2,
  FolderArchive,
  Copy,
  Info,
  ArrowRight,
  Split,
  Maximize2,
  Minimize2,
  HelpCircle,
  Zap,
  Crop,
  Shield,
  Heart,
  Tag,
  Smartphone,
  EyeOff,
  LayoutGrid,
  Camera,
  Cpu,
  SlidersHorizontal,
  X,
  FileCode,
  FileSpreadsheet,
  Code,
} from "lucide-react";
import {
  UniquePreset,
  UniqueRecipe,
  GeneratedVariant,
  ListingSet,
  DuplicateScanResult,
} from "@/lib/services/avito-photo/types";
import {
  PRESET_RECIPES,
  cropImageTo4x3,
  padImageTo4x3,
} from "@/lib/services/avito-photo/transforms";
import {
  loadImageFromFile,
  generateOptimizedVariants,
  assembleListingSets,
  scanForDuplicates,
} from "@/lib/services/avito-photo/engine";
import {
  downloadVariantsZip,
  downloadListingSetsZip,
  triggerBlobDownload,
  triggerTextDownload,
  generateAvitoXmlFeed,
  generateAvitoCsvFeed,
  AvitoFeedOptions,
} from "@/lib/services/avito-photo/zip-exporter";
import {
  ExifCameraProfile,
  EXIF_PROFILES,
  detectAiMarkersInFile,
  GeneratedExif,
} from "@/lib/services/avito-photo/exif-spoofer";

type ActiveTab = "generator" | "mass_posting" | "duplicate_scanner" | "ai_studio";

export default function AvitoPhotoLabWorkspace() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("generator");

  // ==========================================
  // TAB 1: GENERATOR STATE
  // ==========================================
  const [genFiles, setGenFiles] = useState<{ file: File; preview: string; name: string }[]>([]);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [genPreset, setGenPreset] = useState<UniquePreset>("standard");
  const [customRecipe, setCustomRecipe] = useState<UniqueRecipe>(PRESET_RECIPES.custom);
  const [variantCount, setVariantCount] = useState<number>(12);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genProgress, setGenProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);
  const [selectedVariantForModal, setSelectedVariantForModal] = useState<GeneratedVariant | null>(null);

  // Safe Zone & 4:3 Aspect Ratio State
  const [showSafeZoneOverlay, setShowSafeZoneOverlay] = useState<boolean>(true);
  const [showAvitoUiElements, setShowAvitoUiElements] = useState<boolean>(true);
  const [activeImageMeta, setActiveImageMeta] = useState<{
    width: number;
    height: number;
    ratio: number;
    is4x3: boolean;
  } | null>(null);

  // EXIF & AI Signature Spoofing State
  const [exifProfileChoice, setExifProfileChoice] = useState<ExifCameraProfile>("random_mix");
  const [cleanAiSignatures, setCleanAiSignatures] = useState<boolean>(true);
  const [detectedAiSignatures, setDetectedAiSignatures] = useState<{
    hasAiMarkers: boolean;
    details: string[];
  } | null>(null);
  const [selectedExifModalVariant, setSelectedExifModalVariant] = useState<GeneratedVariant | null>(null);

  // Analyze dimensions, aspect ratio and AI signatures of selected image
  useEffect(() => {
    if (genFiles.length === 0 || !genFiles[selectedFileIdx]) {
      setActiveImageMeta(null);
      setDetectedAiSignatures(null);
      return;
    }
    const currentItem = genFiles[selectedFileIdx];

    // Check AI signatures (C2PA, IPTC, Prompt/Workflow)
    detectAiMarkersInFile(currentItem.file).then((res) => {
      setDetectedAiSignatures(res);
    });

    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const ratio = w / (h || 1);
      // Standard Avito horizontal 4:3 is ~1.3333. Allow tolerance [1.30, 1.36]
      const is4x3 = ratio >= 1.30 && ratio <= 1.36;
      setActiveImageMeta({ width: w, height: h, ratio, is4x3 });
    };
    img.src = currentItem.preview;
  }, [genFiles, selectedFileIdx]);

  // Handle center crop to official 4:3
  const handleCropSelectedTo4x3 = async () => {
    if (!genFiles[selectedFileIdx]) return;
    try {
      const current = genFiles[selectedFileIdx];
      const img = await loadImageFromFile(current.file);
      const { dataUrl } = cropImageTo4x3(img);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const newFile = new File([blob], current.name.replace(/\.[^.]+$/, "_4x3.jpg"), { type: "image/jpeg" });
      const newPreview = URL.createObjectURL(newFile);

      setGenFiles((prev) => {
        const next = [...prev];
        next[selectedFileIdx] = { file: newFile, preview: newPreview, name: newFile.name };
        return next;
      });
    } catch (err) {
      console.error("Failed to crop to 4:3:", err);
    }
  };

  // Handle pad to official 4:3 with smart blur background
  const handlePadSelectedTo4x3 = async (fillMode: "blur" | "dark" | "white" = "blur") => {
    if (!genFiles[selectedFileIdx]) return;
    try {
      const current = genFiles[selectedFileIdx];
      const img = await loadImageFromFile(current.file);
      const { dataUrl } = padImageTo4x3(img, fillMode);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const newFile = new File([blob], current.name.replace(/\.[^.]+$/, "_4x3_pad.jpg"), { type: "image/jpeg" });
      const newPreview = URL.createObjectURL(newFile);

      setGenFiles((prev) => {
        const next = [...prev];
        next[selectedFileIdx] = { file: newFile, preview: newPreview, name: newFile.name };
        return next;
      });
    } catch (err) {
      console.error("Failed to pad to 4:3:", err);
    }
  };

  // ==========================================
  // TAB 2: MASS POSTING STATE
  // ==========================================
  const [massFiles, setMassFiles] = useState<{ file: File; preview: string; name: string }[]>([]);
  const [listingsCount, setListingsCount] = useState<number>(10);
  const [photosPerListing, setPhotosPerListing] = useState<number>(4);
  const [isAssembling, setIsAssembling] = useState<boolean>(false);
  const [massProgress, setMassProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [generatedSets, setGeneratedSets] = useState<ListingSet[]>([]);

  // Feed Export Settings
  const [feedCategory, setFeedCategory] = useState<string>("Товары");
  const [feedGoodsType, setFeedGoodsType] = useState<string>("Одежда, обувь, аксессуары");
  const [feedBaseTitle, setFeedBaseTitle] = useState<string>("Товар с гарантией и быстрой доставкой");
  const [feedPrice, setFeedPrice] = useState<number>(4990);
  const [feedAddress, setFeedAddress] = useState<string>("Москва, Тверская улица, 1");
  const [feedImageHost, setFeedImageHost] = useState<string>("https://images.proektmap.ru/listings");
  const [showFeedModal, setShowFeedModal] = useState<boolean>(false);
  const [feedModalType, setFeedModalType] = useState<"xml" | "csv">("xml");
  const [feedCopied, setFeedCopied] = useState<boolean>(false);

  // ==========================================
  // TAB 3: DUPLICATE SCANNER STATE
  // ==========================================
  const [scanFiles, setScanFiles] = useState<{ file: File; preview: string; name: string }[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [scanResults, setScanResults] = useState<{ results: DuplicateScanResult[]; totalDuplicates: number; totalUnique: number } | null>(null);

  // ==========================================
  // TAB 4: AI STUDIO STATE
  // ==========================================
  const [aiProductScene, setAiProductScene] = useState<string>("modern_room");
  const [aiPromptCopied, setAiPromptCopied] = useState<boolean>(false);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  // Helper for file handling
  const handleFileUpload = (
    files: FileList | null,
    setFunc: React.Dispatch<React.SetStateAction<{ file: File; preview: string; name: string }[]>>
  ) => {
    if (!files || files.length === 0) return;
    const newItems: { file: File; preview: string; name: string }[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newItems.push({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        });
      }
    });

    setFunc((prev) => [...prev, ...newItems]);
  };

  // Run Generator Pipeline
  const runGeneration = async () => {
    if (genFiles.length === 0) return;
    setIsGenerating(true);
    setGenProgress({ done: 0, total: variantCount });

    try {
      const activeFile = genFiles[selectedFileIdx];
      const img = await loadImageFromFile(activeFile.file);
      const baseRecipe = genPreset === "custom" ? customRecipe : PRESET_RECIPES[genPreset];
      const recipe: UniqueRecipe = {
        ...baseRecipe,
        exifProfile: exifProfileChoice,
        cleanAiSignatures,
      };

      const results = await generateOptimizedVariants(
        img,
        activeFile.name,
        recipe,
        variantCount,
        (done, total) => setGenProgress({ done, total })
      );

      setGeneratedVariants(results);

      // Track usage in background
      fetch("/api/services/avito-photo-uniquizer/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "use" }),
      }).catch(() => {});
    } catch (err) {
      console.error("Failed to generate variants:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run Mass Posting Assembler
  const runMassAssembly = async () => {
    if (massFiles.length === 0) return;
    setIsAssembling(true);
    setMassProgress({ done: 0, total: listingsCount });

    try {
      const sets = await assembleListingSets(
        massFiles.map((m) => ({ file: m.file, name: m.name })),
        listingsCount,
        photosPerListing,
        PRESET_RECIPES.mass_posting,
        (done, total) => setMassProgress({ done, total })
      );

      setGeneratedSets(sets);

      fetch("/api/services/avito-photo-uniquizer/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "use" }),
      }).catch(() => {});
    } catch (err) {
      console.error("Failed to assemble sets:", err);
    } finally {
      setIsAssembling(false);
    }
  };

  // Run Duplicate Scanner
  const runScan = async () => {
    if (scanFiles.length === 0) return;
    setIsScanning(true);
    setScanProgress({ done: 0, total: scanFiles.length });

    try {
      const report = await scanForDuplicates(
        scanFiles.map((f) => ({ file: f.file, name: f.name })),
        (done, total) => setScanProgress({ done, total })
      );

      setScanResults(report);
    } catch (err) {
      console.error("Failed to scan duplicates:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const getSafetyBadge = (similarity: number) => {
    if (similarity > 88) {
      return {
        label: "Слишком похож",
        color: "var(--color-warning)",
        bg: "rgba(234, 179, 8, 0.15)",
        desc: "Высокий риск склейки",
      };
    }
    if (similarity >= 60 && similarity <= 88) {
      return {
        label: "Оптимально",
        color: "var(--color-accent)",
        bg: "rgba(16, 185, 129, 0.15)",
        desc: "Безопасно для товарки",
      };
    }
    return {
      label: "Глубокая уникальность",
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.15)",
      desc: "Сильное отличие",
    };
  };

  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-l)",
        border: "1px solid var(--color-border-light)",
        overflow: "hidden",
        boxShadow: "var(--shadow-m)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Top Tool Navigation Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-border-light)",
          background: "var(--color-bg-secondary)",
          overflowX: "auto",
        }}
      >
        <button
          onClick={() => setActiveTab("generator")}
          style={{
            padding: "16px 22px",
            border: "none",
            background: activeTab === "generator" ? "var(--color-surface)" : "transparent",
            color: activeTab === "generator" ? "var(--color-accent)" : "var(--color-text-secondary)",
            borderBottom: activeTab === "generator" ? "2px solid var(--color-accent)" : "2px solid transparent",
            fontSize: "var(--text-s)",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          <Zap size={16} />
          <span>Генератор вариантов</span>
        </button>

        <button
          onClick={() => setActiveTab("mass_posting")}
          style={{
            padding: "16px 22px",
            border: "none",
            background: activeTab === "mass_posting" ? "var(--color-surface)" : "transparent",
            color: activeTab === "mass_posting" ? "var(--color-accent)" : "var(--color-text-secondary)",
            borderBottom: activeTab === "mass_posting" ? "2px solid var(--color-accent)" : "2px solid transparent",
            fontSize: "var(--text-s)",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          <Layers size={16} />
          <span>Масс-постинг комбайн</span>
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "var(--radius-full)",
              background: "rgba(16, 185, 129, 0.15)",
              color: "var(--color-accent)",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            PRO
          </span>
        </button>

        <button
          onClick={() => setActiveTab("duplicate_scanner")}
          style={{
            padding: "16px 22px",
            border: "none",
            background: activeTab === "duplicate_scanner" ? "var(--color-surface)" : "transparent",
            color: activeTab === "duplicate_scanner" ? "var(--color-accent)" : "var(--color-text-secondary)",
            borderBottom: activeTab === "duplicate_scanner" ? "2px solid var(--color-accent)" : "2px solid transparent",
            fontSize: "var(--text-s)",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          <Search size={16} />
          <span>Сканер дубликатов</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_studio")}
          style={{
            padding: "16px 22px",
            border: "none",
            background: activeTab === "ai_studio" ? "var(--color-surface)" : "transparent",
            color: activeTab === "ai_studio" ? "var(--color-accent)" : "var(--color-text-secondary)",
            borderBottom: activeTab === "ai_studio" ? "2px solid var(--color-accent)" : "2px solid transparent",
            fontSize: "var(--text-s)",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          <Sparkles size={16} />
          <span>AI Studio (Product Lock)</span>
        </button>
      </div>

      {/* Workspace Body */}
      <div style={{ padding: "28px 24px" }}>
        {/* ========================================================================= */}
        {/* TAB 1: GENERATOR (SINGLE / MULTI TO VARIANTS) */}
        {/* ========================================================================= */}
        {activeTab === "generator" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 28 }}>
              {/* Left Column: Upload & Preview */}
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 8, color: "var(--color-text-secondary)" }}>
                  1. Исходные фотографии товара
                </label>

                {genFiles.length === 0 ? (
                  <div
                    onClick={() => fileInputRef1.current?.click()}
                    style={{
                      border: "2px dashed var(--color-border)",
                      borderRadius: "var(--radius-m)",
                      padding: "40px 20px",
                      textAlign: "center",
                      background: "var(--color-bg-secondary)",
                      cursor: "pointer",
                      transition: "border 0.2s ease",
                    }}
                  >
                    <input
                      ref={fileInputRef1}
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileUpload(e.target.files, setGenFiles)}
                    />
                    <UploadCloud size={40} style={{ color: "var(--color-accent)", margin: "0 auto 12px" }} />
                    <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 4 }}>
                      Выберите или перетащите фото товара
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                      JPG, PNG, WEBP (до 50 фото) &middot; Рекомендация Авито: 4:3 (горизонтальное)
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Safe Zone & Overlay Toolbar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => setShowSafeZoneOverlay(!showSafeZoneOverlay)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "var(--radius-s)",
                            border: showSafeZoneOverlay ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                            background: showSafeZoneOverlay ? "rgba(16, 185, 129, 0.12)" : "var(--color-surface)",
                            color: showSafeZoneOverlay ? "var(--color-accent)" : "var(--color-text-secondary)",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Shield size={12} />
                          <span>Охранная зона 1:1</span>
                        </button>

                        <button
                          onClick={() => setShowAvitoUiElements(!showAvitoUiElements)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "var(--radius-s)",
                            border: showAvitoUiElements ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                            background: showAvitoUiElements ? "rgba(16, 185, 129, 0.12)" : "var(--color-surface)",
                            color: showAvitoUiElements ? "var(--color-accent)" : "var(--color-text-secondary)",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Smartphone size={12} />
                          <span>UI Авито</span>
                        </button>
                      </div>

                      {activeImageMeta && (
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: "var(--radius-s)",
                            background: activeImageMeta.is4x3 ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: activeImageMeta.is4x3 ? "var(--color-accent)" : "var(--color-warning)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {activeImageMeta.is4x3 ? <Check size={12} /> : <AlertTriangle size={12} />}
                          <span>{activeImageMeta.width}×{activeImageMeta.height} ({activeImageMeta.is4x3 ? "4:3 Авито" : `${activeImageMeta.ratio.toFixed(2)}:1`})</span>
                        </div>
                      )}
                    </div>

                    {/* Active Selected Image Box with Safe Zone Overlay */}
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "4 / 3",
                        maxHeight: 280,
                        background: "#0c0d10",
                        borderRadius: "var(--radius-m)",
                        overflow: "hidden",
                        border: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                    >
                      <img
                        src={genFiles[selectedFileIdx]?.preview}
                        alt="Original"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />

                      {/* Safe Zone Overlay */}
                      {showSafeZoneOverlay && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            display: "flex",
                          }}
                        >
                          {/* Left Danger / Mobile Cut Zone (12.5% width) */}
                          <div
                            style={{
                              width: "12.5%",
                              height: "100%",
                              background: "rgba(239, 68, 68, 0.22)",
                              borderRight: "1px dashed rgba(239, 68, 68, 0.7)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                transform: "rotate(-90deg)",
                                whiteSpace: "nowrap",
                                fontSize: 9,
                                fontWeight: 700,
                                color: "#fca5a5",
                                textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                              }}
                            >
                              Срез 1:1
                            </span>
                          </div>

                          {/* Center Safe Zone (75% width = 1:1 Square) */}
                          <div
                            style={{
                              width: "75%",
                              height: "100%",
                              border: "2px dashed rgba(16, 185, 129, 0.9)",
                              background: "rgba(16, 185, 129, 0.04)",
                              position: "relative",
                              boxSizing: "border-box",
                            }}
                          >
                            {/* Safe Zone Badge Top */}
                            <div
                              style={{
                                position: "absolute",
                                top: 6,
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "rgba(16, 185, 129, 0.9)",
                                color: "#000000",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-s)",
                                fontSize: 9,
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                              }}
                            >
                              БЕЗОПАСНАЯ ЗОНА 1:1 (ТЕКСТ & ШИЛЬДИКИ)
                            </div>

                            {/* Center Crosshair Marker */}
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 14,
                                height: 14,
                                border: "1px solid rgba(255,255,255,0.4)",
                                borderRadius: "50%",
                              }}
                            />
                          </div>

                          {/* Right Danger / Mobile Cut Zone (12.5% width) */}
                          <div
                            style={{
                              width: "12.5%",
                              height: "100%",
                              background: "rgba(239, 68, 68, 0.22)",
                              borderLeft: "1px dashed rgba(239, 68, 68, 0.7)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                transform: "rotate(90deg)",
                                whiteSpace: "nowrap",
                                fontSize: 9,
                                fontWeight: 700,
                                color: "#fca5a5",
                                textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                              }}
                            >
                              Срез 1:1
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Avito UI Elements Overlay */}
                      {showAvitoUiElements && (
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                          {/* Top-Right Favorite Heart */}
                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "rgba(0,0,0,0.6)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backdropFilter: "blur(4px)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                            }}
                          >
                            <Heart size={16} color="#ffffff" fill="none" strokeWidth={2.5} />
                          </div>

                          {/* Top-Left Photo Counter */}
                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              padding: "3px 8px",
                              borderRadius: "var(--radius-s)",
                              background: "rgba(0,0,0,0.65)",
                              color: "#ffffff",
                              fontSize: 10,
                              fontWeight: 700,
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            1 / 8
                          </div>

                          {/* Bottom-Left Price Tag Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: 8,
                              left: 8,
                              padding: "4px 9px",
                              borderRadius: "var(--radius-s)",
                              background: "rgba(0,0,0,0.75)",
                              color: "#ffffff",
                              fontSize: 11,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <Tag size={12} style={{ color: "var(--color-accent)" }} />
                            <span>12 500 ₽</span>
                          </div>
                        </div>
                      )}

                      {/* Filename Tag */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          padding: "2px 7px",
                          borderRadius: "var(--radius-s)",
                          background: "rgba(0,0,0,0.7)",
                          color: "#ffffff",
                          fontSize: 10,
                          fontWeight: 500,
                        }}
                      >
                        {genFiles[selectedFileIdx]?.name}
                      </div>
                    </div>

                    {/* Non-4:3 Warning Alert and Quick Fix Actions */}
                    {activeImageMeta && !activeImageMeta.is4x3 && (
                      <div
                        style={{
                          background: "rgba(245, 158, 11, 0.1)",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                          borderRadius: "var(--radius-m)",
                          padding: "10px 12px",
                          marginBottom: 12,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <AlertTriangle size={16} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 2 }} />
                          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                            <strong style={{ color: "var(--color-warning)" }}>Нестандартное соотношение сторон ({activeImageMeta.width}×{activeImageMeta.height}).</strong>
                            <br />
                            Официальный стандарт Авито — <strong>4:3 (горизонтальное)</strong>. На смартфонах фото с другим форматом могут отобразиться с нежелательной авто-обрезкой краев.
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={handleCropSelectedTo4x3}
                            style={{
                              flex: 1,
                              padding: "6px 10px",
                              borderRadius: "var(--radius-s)",
                              background: "var(--color-surface)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-text-primary)",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                            }}
                          >
                            <Crop size={13} style={{ color: "var(--color-accent)" }} />
                            <span>Обрезать в 4:3 (Центр)</span>
                          </button>

                          <button
                            onClick={() => handlePadSelectedTo4x3("blur")}
                            style={{
                              flex: 1,
                              padding: "6px 10px",
                              borderRadius: "var(--radius-s)",
                              background: "var(--color-surface)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-text-primary)",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                            }}
                          >
                            <LayoutGrid size={13} style={{ color: "var(--color-accent)" }} />
                            <span>Достроить поля до 4:3</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* AI Signatures Detected Alert */}
                    {detectedAiSignatures?.hasAiMarkers && (
                      <div
                        style={{
                          background: "rgba(168, 85, 247, 0.1)",
                          border: "1px solid rgba(168, 85, 247, 0.3)",
                          borderRadius: "var(--radius-m)",
                          padding: "10px 12px",
                          marginBottom: 12,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <Sparkles size={16} style={{ color: "#a855f7", flexShrink: 0, marginTop: 2 }} />
                          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                            <strong style={{ color: "#c084fc" }}>Обнаружены скрытые метки ИИ / графических редакторов:</strong>
                            <div style={{ marginTop: 2, color: "var(--color-text-primary)", fontWeight: 500 }}>
                              {detectedAiSignatures.details.join(" • ")}
                            </div>
                            <div style={{ fontSize: 10, color: "var(--color-accent)", marginTop: 4, fontWeight: 600 }}>
                              🛡️ При генерации эти метки будут полностью вычищены, а файлу присвоен настоящий EXIF физической камеры.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Thumbnails row */}
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                      {genFiles.map((file, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedFileIdx(idx)}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: "var(--radius-s)",
                            border: selectedFileIdx === idx ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                            overflow: "hidden",
                            cursor: "pointer",
                            flexShrink: 0,
                            position: "relative",
                          }}
                        >
                          <img src={file.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                      <button
                        onClick={() => fileInputRef1.current?.click()}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: "var(--radius-s)",
                          border: "1px dashed var(--color-border)",
                          background: "var(--color-bg-secondary)",
                          color: "var(--color-text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setGenFiles([]);
                        setGeneratedVariants([]);
                      }}
                      style={{
                        marginTop: 10,
                        padding: "4px 8px",
                        background: "transparent",
                        border: "none",
                        color: "var(--color-error)",
                        fontSize: 11,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Trash2 size={12} /> Очистить список
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Preset & Settings */}
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 8, color: "var(--color-text-secondary)" }}>
                  2. Режим и алгоритм уникализации
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
                  {(["natural", "standard", "mass_posting", "custom"] as UniquePreset[]).map((pKey) => {
                    const presetObj = PRESET_RECIPES[pKey];
                    const isSelected = genPreset === pKey;
                    return (
                      <button
                        key={pKey}
                        onClick={() => setGenPreset(pKey)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "var(--radius-m)",
                          border: isSelected ? "2px solid var(--color-accent)" : "1px solid var(--color-border-light)",
                          background: isSelected ? "rgba(16, 185, 129, 0.08)" : "var(--color-bg-secondary)",
                          color: "var(--color-text-primary)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 2 }}>{presetObj.name}</div>
                        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
                          Сходство: {presetObj.targetSimilarityMin}-{presetObj.targetSimilarityMax}%
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Fine-Tuning Sliders if 'custom' selected */}
                {genPreset === "custom" && (
                  <div
                    style={{
                      background: "var(--color-bg-secondary)",
                      borderRadius: "var(--radius-m)",
                      padding: "14px 16px",
                      marginBottom: 16,
                      border: "1px solid var(--color-border-light)",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 10, color: "var(--color-text-secondary)" }}>
                      Тонкая настройка параметров:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                          <span>Кроп & Масштаб:</span>
                          <b>до {customRecipe.cropMax}%</b>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="0.5"
                          value={customRecipe.cropMax}
                          onChange={(e) => setCustomRecipe({ ...customRecipe, cropMax: parseFloat(e.target.value) })}
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                          <span>Микро-поворот:</span>
                          <b>±{customRecipe.rotateMax}°</b>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.5"
                          step="0.1"
                          value={customRecipe.rotateMax}
                          onChange={(e) => setCustomRecipe({ ...customRecipe, rotateMax: parseFloat(e.target.value) })}
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                          <span>Уровень микро-шума:</span>
                          <b>{customRecipe.noiseLevel}</b>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="80"
                          value={customRecipe.noiseLevel}
                          onChange={(e) => setCustomRecipe({ ...customRecipe, noiseLevel: parseInt(e.target.value) })}
                          style={{ width: "100%" }}
                        />
                      </div>

                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, cursor: "pointer", marginTop: 4, color: "var(--color-text-primary)" }}>
                        <input
                          type="checkbox"
                          checked={customRecipe.safeZoneProtection ?? true}
                          onChange={(e) => setCustomRecipe({ ...customRecipe, safeZoneProtection: e.target.checked })}
                        />
                        <span>🛡️ Защита охранной области 1:1 (Edge Guard)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 3. EXIF Metadata & AI Sanitizer */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                      <Camera size={14} style={{ color: "var(--color-accent)" }} />
                      <span>3. Профиль камеры и очистка ИИ</span>
                    </label>
                  </div>

                  {/* Profile Chips */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 6, marginBottom: 10 }}>
                    {[
                      { id: "random_mix", label: "🎲 Случайный микс", sub: "Для серии объявлений" },
                      { id: "iphone_15_pro", label: "📱 iPhone 15 Pro", sub: "Apple 6.86mm" },
                      { id: "samsung_s24", label: "📱 Galaxy S24 Ultra", sub: "Samsung 24mm" },
                      { id: "xiaomi_14", label: "📱 Xiaomi 14 Leica", sub: "Leica 23mm" },
                      { id: "sony_a7m4", label: "📷 Sony A7 IV", sub: "FE 24-70 GM" },
                    ].map((p) => {
                      const isSel = exifProfileChoice === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setExifProfileChoice(p.id as ExifCameraProfile)}
                          style={{
                            padding: "6px 8px",
                            borderRadius: "var(--radius-s)",
                            border: isSel ? "1.5px solid var(--color-accent)" : "1px solid var(--color-border)",
                            background: isSel ? "rgba(16, 185, 129, 0.12)" : "var(--color-surface)",
                            color: "var(--color-text-primary)",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ fontSize: 11, fontWeight: 700 }}>{p.label}</div>
                          <div style={{ fontSize: 9, color: "var(--color-text-tertiary)" }}>{p.sub}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* AI Signature Sanitization Checkbox */}
                  <div
                    style={{
                      background: "var(--color-bg-secondary)",
                      borderRadius: "var(--radius-s)",
                      padding: "8px 12px",
                      border: "1px solid var(--color-border-light)",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, cursor: "pointer", color: "var(--color-text-primary)" }}>
                      <input
                        type="checkbox"
                        checked={cleanAiSignatures}
                        onChange={(e) => setCleanAiSignatures(e.target.checked)}
                        style={{ marginTop: 2 }}
                      />
                      <div style={{ lineHeight: 1.35 }}>
                        <span style={{ fontWeight: 600 }}>Очистка меток нейросетей (AI Sanitizer)</span>
                        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                          Удаляет C2PA, IPTC «trainedAlgorithmicMedia», ComfyUI/Midjourney signatures и заменяет на легитимный EXIF камеры.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Number of Variants */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)" }}>
                      Количество уникальных вариантов:
                    </span>
                    <b style={{ fontSize: "var(--text-s)", color: "var(--color-accent)" }}>{variantCount} шт</b>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[6, 12, 20, 30, 50].map((num) => (
                      <button
                        key={num}
                        onClick={() => setVariantCount(num)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          borderRadius: "var(--radius-s)",
                          border: variantCount === num ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                          background: variantCount === num ? "var(--color-accent)" : "var(--color-surface)",
                          color: variantCount === num ? "#ffffff" : "var(--color-text-secondary)",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Run Button */}
                <button
                  disabled={genFiles.length === 0 || isGenerating}
                  onClick={runGeneration}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderRadius: "var(--radius-m)",
                    background: genFiles.length === 0 ? "var(--color-bg-secondary)" : "var(--color-accent)",
                    color: genFiles.length === 0 ? "var(--color-text-tertiary)" : "#ffffff",
                    fontSize: "var(--text-s)",
                    fontWeight: 700,
                    border: "none",
                    cursor: genFiles.length === 0 || isGenerating ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: genFiles.length > 0 ? "var(--shadow-m)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Отбор кандидатов ({genProgress.done}/{genProgress.total})...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Сгенерировать {variantCount} безопасных копий</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Variants Results Grid */}
            {generatedVariants.length > 0 && (
              <div
                style={{
                  borderTop: "1px solid var(--color-border-light)",
                  paddingTop: 28,
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "var(--text-l)", fontWeight: 800, marginBottom: 4 }}>
                      Сгенерированные варианты ({generatedVariants.length} шт)
                    </h3>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                      Все варианты прошли отбор pHash + dHash. Метаданные очищены.
                    </p>
                  </div>

                  {/* Batch Download ZIP */}
                  <button
                    onClick={() => downloadVariantsZip(generatedVariants)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "var(--radius-s)",
                      background: "var(--color-accent)",
                      color: "#ffffff",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "var(--shadow-s)",
                    }}
                  >
                    <Download size={15} /> Скачать все варианты (ZIP)
                  </button>
                </div>

                {/* Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  {generatedVariants.map((variant, idx) => {
                    const badge = getSafetyBadge(variant.similarityToOriginal);
                    return (
                      <div
                        key={variant.id}
                        style={{
                          background: "var(--color-bg-secondary)",
                          borderRadius: "var(--radius-m)",
                          border: "1px solid var(--color-border)",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            height: 170,
                            position: "relative",
                            background: "var(--color-surface)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={variant.dataUrl}
                            alt={`Variant ${idx + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />

                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              padding: "2px 7px",
                              borderRadius: "var(--radius-s)",
                              background: badge.bg,
                              color: badge.color,
                              fontSize: 10,
                              fontWeight: 700,
                              border: `1px solid ${badge.color}`,
                            }}
                          >
                            {badge.label}
                          </div>

                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              padding: "2px 6px",
                              borderRadius: "var(--radius-s)",
                              background: "rgba(0,0,0,0.65)",
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            #{idx + 1}
                          </div>
                        </div>

                        {/* Card Info */}
                        <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
                          {/* Main Safety Score */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--color-border-light)" }}>
                            <span style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Безопасность:</span>
                            <span style={{ fontWeight: 800, color: badge.color, fontSize: 13 }}>
                              {100 - variant.similarityToOriginal}%
                            </span>
                          </div>

                          {/* Dual Engine breakdown: Structural (pHash+dHash) vs Color (3D RGB) */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 8, fontSize: 10, background: "var(--color-surface)", padding: "6px 8px", borderRadius: "var(--radius-s)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--color-text-tertiary)" }}>Структура (pHash):</span>
                              <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{variant.structuralSimilarity ?? variant.similarityToOriginal}%</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--color-text-tertiary)" }}>Цвет (RGB Cube):</span>
                              <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{variant.colorSimilarity ?? variant.similarityToOriginal}%</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--color-text-tertiary)" }}>Сохранение качества:</span>
                              <span style={{ fontWeight: 700, color: "var(--color-accent)" }}>{variant.qualityScore}%</span>
                            </div>
                          </div>

                          {/* EXIF Camera & AI Status Tag */}
                          {variant.exifData && (
                            <div
                              onClick={() => setSelectedExifModalVariant(variant)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: 10,
                                marginBottom: 8,
                                padding: "4px 8px",
                                borderRadius: "var(--radius-s)",
                                background: "rgba(16, 185, 129, 0.08)",
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                cursor: "pointer",
                                transition: "background 0.15s ease",
                              }}
                              title="Нажмите для детального просмотра EXIF и статуса очистки ИИ"
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                <Camera size={11} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                                <span style={{ fontWeight: 600 }}>{variant.exifData.model}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ color: "var(--color-text-tertiary)" }}>{variant.exifData.exposureTime}s</span>
                                <Info size={11} style={{ color: "var(--color-accent)" }} />
                              </div>
                            </div>
                          )}

                          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 12, lineHeight: 1.35 }}>
                            Кроп: {variant.parametersUsed.crop}% &middot; Поворот: {variant.parametersUsed.rotate}°
                          </div>

                          {/* Action button */}
                          <div style={{ marginTop: "auto", display: "flex", gap: 6 }}>
                            <button
                              onClick={() => setSelectedExifModalVariant(variant)}
                              style={{
                                padding: "6px 8px",
                                borderRadius: "var(--radius-s)",
                                border: "1px solid var(--color-border)",
                                background: "var(--color-surface)",
                                color: "var(--color-text-secondary)",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                              }}
                              title="Инспектор EXIF и ИИ-меток"
                            >
                              <SlidersHorizontal size={12} />
                            </button>

                            <button
                              onClick={() => {
                                const a = document.createElement("a");
                                a.href = variant.dataUrl;
                                a.download = `photo_variant_${idx + 1}.jpg`;
                                a.click();
                              }}
                              style={{
                                flex: 1,
                                padding: "6px 0",
                                borderRadius: "var(--radius-s)",
                                border: "1px solid var(--color-border)",
                                background: "var(--color-surface)",
                                color: "var(--color-text-primary)",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                              }}
                            >
                              <Download size={12} /> Скачать
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MASS POSTING COMBINE */}
        {/* ========================================================================= */}
        {activeTab === "mass_posting" && (
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)",
                borderRadius: "var(--radius-m)",
                padding: "20px",
                border: "1px solid var(--color-border-light)",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Layers size={20} style={{ color: "#3b82f6" }} />
                <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700 }}>
                  Сборщик непересекающихся наборов для объявлений (Масс-постинг)
                </h3>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", maxWidth: 780, lineHeight: 1.5 }}>
                Загрузите пачку фото одного товара (5–15 шт). Система сгенерирует нужное количество уникальных объявлений (папок),
                где в каждом объявлении будет <b>своё главное фото</b> и уникальные дополнительные ракурсы без повторений.
              </p>
            </div>

            {/* Upload multi-files */}
            <div style={{ marginBottom: 24 }}>
              <input
                ref={fileInputRef2}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e.target.files, setMassFiles)}
              />

              {massFiles.length === 0 ? (
                <div
                  onClick={() => fileInputRef2.current?.click()}
                  style={{
                    border: "2px dashed var(--color-border)",
                    borderRadius: "var(--radius-m)",
                    padding: "40px 20px",
                    textAlign: "center",
                    background: "var(--color-bg-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <FolderArchive size={40} style={{ color: "#3b82f6", margin: "0 auto 12px" }} />
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 4 }}>
                    Загрузите набор фотографий товара (от 3 до 20 шт)
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                    Перетащите фото разных ракурсов или деталей товара
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>Загружено {massFiles.length} исходных фото:</span>
                    <button
                      onClick={() => setMassFiles([])}
                      style={{ background: "none", border: "none", color: "var(--color-error)", fontSize: 11, cursor: "pointer" }}
                    >
                      Сбросить
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
                    {massFiles.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: "var(--radius-s)",
                          border: "1px solid var(--color-border)",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img src={f.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                    <button
                      onClick={() => fileInputRef2.current?.click()}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: "var(--radius-s)",
                        border: "1px dashed var(--color-border)",
                        background: "var(--color-bg-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Set parameters */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginBottom: 24,
                background: "var(--color-bg-secondary)",
                padding: "16px 20px",
                borderRadius: "var(--radius-m)",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                  Количество объявлений (папок):
                </label>
                <select
                  value={listingsCount}
                  onChange={(e) => setListingsCount(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-s)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <option value={5}>5 объявлений</option>
                  <option value={10}>10 объявлений</option>
                  <option value={15}>15 объявлений</option>
                  <option value={20}>20 объявлений</option>
                  <option value={30}>30 объявлений</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                  Фотографий в одном объявлении:
                </label>
                <select
                  value={photosPerListing}
                  onChange={(e) => setPhotosPerListing(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-s)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <option value={2}>2 фото</option>
                  <option value={3}>3 фото</option>
                  <option value={4}>4 фото</option>
                  <option value={5}>5 фото</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  disabled={massFiles.length === 0 || isAssembling}
                  onClick={runMassAssembly}
                  style={{
                    width: "100%",
                    padding: "10px 18px",
                    borderRadius: "var(--radius-s)",
                    background: massFiles.length === 0 ? "var(--color-surface)" : "var(--color-accent)",
                    color: massFiles.length === 0 ? "var(--color-text-tertiary)" : "#ffffff",
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    border: "none",
                    cursor: massFiles.length === 0 || isAssembling ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {isAssembling ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Сборка ({massProgress.done}/{massProgress.total})...</span>
                    </>
                  ) : (
                    <>
                      <Layers size={14} />
                      <span>Собрать {listingsCount} наборов</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Sets Display */}
            {generatedSets.length > 0 && (
              <div>
                {/* Autoload Feeds Configuration Panel */}
                <div
                  style={{
                    background: "var(--color-bg-secondary)",
                    borderRadius: "var(--radius-m)",
                    padding: "18px 20px",
                    border: "1px solid var(--color-border)",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FileCode size={18} style={{ color: "var(--color-accent)" }} />
                      <h4 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                        Параметры XML / CSV фидов Автозагрузки Авито
                      </h4>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button
                        onClick={() => {
                          setFeedModalType("xml");
                          setShowFeedModal(true);
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-s)",
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text-primary)",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Code size={13} style={{ color: "var(--color-accent)" }} />
                        <span>Предпросмотр XML</span>
                      </button>

                      <button
                        onClick={() => {
                          const xml = generateAvitoXmlFeed(generatedSets, {
                            category: feedCategory,
                            goodsType: feedGoodsType,
                            baseTitle: feedBaseTitle,
                            price: feedPrice,
                            address: feedAddress,
                            imageHostUrl: feedImageHost,
                          });
                          triggerTextDownload(xml, "avito_autoload_feed.xml", "application/xml");
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-s)",
                          background: "rgba(59, 130, 246, 0.12)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          color: "#3b82f6",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <FileCode size={13} />
                        <span>Скачать XML</span>
                      </button>

                      <button
                        onClick={() => {
                          const csv = generateAvitoCsvFeed(generatedSets, {
                            category: feedCategory,
                            goodsType: feedGoodsType,
                            baseTitle: feedBaseTitle,
                            price: feedPrice,
                            address: feedAddress,
                            imageHostUrl: feedImageHost,
                          });
                          triggerTextDownload(csv, "avito_import_feed.csv", "text/csv");
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-s)",
                          background: "rgba(16, 185, 129, 0.12)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          color: "var(--color-accent)",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <FileSpreadsheet size={13} />
                        <span>Скачать CSV</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4, fontWeight: 600 }}>
                        Базовый заголовок объявления:
                      </label>
                      <input
                        type="text"
                        value={feedBaseTitle}
                        onChange={(e) => setFeedBaseTitle(e.target.value)}
                        placeholder="Название товара..."
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "var(--radius-s)",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          fontSize: 11,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4, fontWeight: 600 }}>
                        Цена (руб):
                      </label>
                      <input
                        type="number"
                        value={feedPrice}
                        onChange={(e) => setFeedPrice(parseInt(e.target.value) || 0)}
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "var(--radius-s)",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          fontSize: 11,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4, fontWeight: 600 }}>
                        Город / Адрес показа:
                      </label>
                      <input
                        type="text"
                        value={feedAddress}
                        onChange={(e) => setFeedAddress(e.target.value)}
                        placeholder="Москва, Тверская..."
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "var(--radius-s)",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          fontSize: 11,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4, fontWeight: 600 }}>
                        Префикс CDN / S3 хранилища фото:
                      </label>
                      <input
                        type="text"
                        value={feedImageHost}
                        onChange={(e) => setFeedImageHost(e.target.value)}
                        placeholder="https://s3.ru/my-bucket"
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "var(--radius-s)",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          fontSize: 11,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <h4 style={{ fontSize: "var(--text-m)", fontWeight: 800 }}>
                    Готовые наборы ({generatedSets.length} объявлений)
                  </h4>
                  <button
                    onClick={() => downloadListingSetsZip(generatedSets, "avito_mass_posting_pack.zip", {
                      category: feedCategory,
                      goodsType: feedGoodsType,
                      baseTitle: feedBaseTitle,
                      price: feedPrice,
                      address: feedAddress,
                      imageHostUrl: feedImageHost,
                    })}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "var(--radius-s)",
                      background: "var(--color-accent)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "var(--shadow-s)",
                    }}
                  >
                    <Download size={15} /> Скачать полный ZIP-пак (Папки + XML + CSV)
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {generatedSets.map((set) => (
                    <div
                      key={set.setIndex}
                      style={{
                        background: "var(--color-bg-secondary)",
                        borderRadius: "var(--radius-m)",
                        padding: "14px 18px",
                        border: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "var(--radius-full)",
                            background: "var(--color-surface)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 12,
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          {set.setIndex}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{set.title}</div>
                          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                            Главное: 1 фото &middot; Дополнительных: {set.additionalImages.length} фото &middot; EXIF: {set.mainImage.exifData?.model || "iPhone 15 Pro"}
                          </div>
                        </div>
                      </div>

                      {/* Photos thumbnails preview */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <div
                          title="Главное фото"
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "var(--radius-s)",
                            border: "2px solid var(--color-accent)",
                            overflow: "hidden",
                          }}
                        >
                          <img src={set.mainImage.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        {set.additionalImages.map((img, idx) => (
                          <div
                            key={idx}
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "var(--radius-s)",
                              border: "1px solid var(--color-border)",
                              overflow: "hidden",
                            }}
                          >
                            <img src={img.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DUPLICATE SCANNER */}
        {/* ========================================================================= */}
        {activeTab === "duplicate_scanner" && (
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(239, 68, 68, 0.08) 100%)",
                borderRadius: "var(--radius-m)",
                padding: "20px",
                border: "1px solid var(--color-border-light)",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Search size={20} style={{ color: "var(--color-warning)" }} />
                <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700 }}>
                  Сканер дубликатов фотографий (Perceptual Duplicate Scanner)
                </h3>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", maxWidth: 780, lineHeight: 1.5 }}>
                Загрузите пачку ваших старых фото или базу объявлений. Сканер построит матрицу визуального хэша (pHash + dHash)
                и подсветит пары с критическим сходством (&gt; 85%), которые Авито может склеить или заблокировать.
              </p>
            </div>

            <input
              ref={fileInputRef3}
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e.target.files, setScanFiles)}
            />

            {scanFiles.length === 0 ? (
              <div
                onClick={() => fileInputRef3.current?.click()}
                style={{
                  border: "2px dashed var(--color-border)",
                  borderRadius: "var(--radius-m)",
                  padding: "40px 20px",
                  textAlign: "center",
                  background: "var(--color-bg-secondary)",
                  cursor: "pointer",
                }}
              >
                <Search size={40} style={{ color: "var(--color-warning)", margin: "0 auto 12px" }} />
                <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 4 }}>
                  Загрузите базу фотографий для сканирования (до 100 шт)
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                  Поиск скрытых и явных дубликатов прямо в браузере
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Выбрано {scanFiles.length} фото для анализа</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setScanFiles([])}
                      style={{ background: "none", border: "none", color: "var(--color-error)", fontSize: 11, cursor: "pointer" }}
                    >
                      Очистить
                    </button>
                    <button
                      disabled={isScanning}
                      onClick={runScan}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "var(--radius-s)",
                        background: "var(--color-accent)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        border: "none",
                        cursor: isScanning ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Анализ ({scanProgress.done}/{scanProgress.total})...</span>
                        </>
                      ) : (
                        <>
                          <Search size={14} />
                          <span>Запустить сканирование</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scan Results Display */}
                {scanResults && (
                  <div style={{ marginTop: 20 }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 12,
                        marginBottom: 20,
                      }}
                    >
                      <div style={{ background: "var(--color-bg-secondary)", padding: "14px", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)" }}>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Проверено файлов:</div>
                        <div style={{ fontSize: 20, fontWeight: 800 }}>{scanFiles.length}</div>
                      </div>
                      <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: "14px", borderRadius: "var(--radius-m)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                        <div style={{ fontSize: 11, color: "var(--color-error)" }}>Конфликтов / дублей:</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-error)" }}>{scanResults.results.length}</div>
                      </div>
                      <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "14px", borderRadius: "var(--radius-m)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                        <div style={{ fontSize: 11, color: "var(--color-accent)" }}>Уникальных фото:</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-accent)" }}>{scanResults.totalUnique}</div>
                      </div>
                    </div>

                    {scanResults.results.length === 0 ? (
                      <div
                        style={{
                          padding: "32px",
                          textAlign: "center",
                          background: "rgba(16, 185, 129, 0.08)",
                          borderRadius: "var(--radius-m)",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        <ShieldCheck size={32} style={{ color: "var(--color-accent)", margin: "0 auto 8px" }} />
                        <h4 style={{ fontSize: "var(--text-m)", fontWeight: 700, color: "var(--color-accent)" }}>
                          Дубликатов не обнаружено!
                        </h4>
                        <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                          Все загруженные фото имеют достаточный уровень визуального отличия.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {scanResults.results.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: "var(--color-bg-secondary)",
                              borderRadius: "var(--radius-m)",
                              padding: "14px 18px",
                              border: "1px solid var(--color-border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: 12,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                              <img src={item.previewA} alt="" style={{ width: 50, height: 50, borderRadius: "var(--radius-s)", objectFit: "cover" }} />
                              <div style={{ fontSize: 11, fontWeight: 600 }}>{item.fileA}</div>
                              <Split size={16} style={{ color: "var(--color-text-tertiary)" }} />
                              <img src={item.previewB} alt="" style={{ width: 50, height: 50, borderRadius: "var(--radius-s)", objectFit: "cover" }} />
                              <div style={{ fontSize: 11, fontWeight: 600 }}>{item.fileB}</div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", display: "flex", gap: 8 }}>
                                <span>Структура: <b>{item.structuralSimilarity ?? item.similarity}%</b></span>
                                <span>Цвет (RGB): <b>{item.colorSimilarity ?? item.similarity}%</b></span>
                              </div>

                              <div
                                style={{
                                  padding: "5px 12px",
                                  borderRadius: "var(--radius-s)",
                                  background: item.similarity >= 90 ? "rgba(239, 68, 68, 0.15)" : "rgba(234, 179, 8, 0.15)",
                                  color: item.similarity >= 90 ? "var(--color-error)" : "var(--color-warning)",
                                  fontWeight: 700,
                                  fontSize: 12,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <AlertTriangle size={14} />
                                Итог: {item.similarity}% ({item.isDuplicate ? "Дубликат / Риск склейки" : "Пограничное сходство"})
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AI STUDIO (PRODUCT LOCK) */}
        {/* ========================================================================= */}
        {activeTab === "ai_studio" && (
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)",
                borderRadius: "var(--radius-m)",
                padding: "20px",
                border: "1px solid var(--color-border-light)",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Sparkles size={20} style={{ color: "#a855f7" }} />
                <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700 }}>
                  AI Studio: Принцип Product Lock (Замок на товар)
                </h3>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", maxWidth: 780, lineHeight: 1.5 }}>
                В отличие от обычной генерации, которая меняет форму и детали товара, методология <b>Product Lock</b> жестко
                фиксирует пиксели и геометрию объекта, заменяя исключительно фон, тени, ракурс освещения и сцену.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {/* Left: Scene presets */}
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 8, color: "var(--color-text-secondary)" }}>
                  Выберите целевое окружение для товара:
                </label>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { id: "modern_room", name: "🏠 Светлая современная квартира / Интерьер", desc: "Естественный дневной свет из окна, деревянный пол, минимализм" },
                    { id: "studio_clean", name: "📸 Премиальная фотостудия", desc: "Мягкий софтбокс, нейтральный градиентный фон, реалистичные контактные тени" },
                    { id: "outdoor_urban", name: "🏙️ Городская уличная среда", desc: "Уличный асфальт, открытое пространство, естественные блики" },
                    { id: "industrial", name: "🔧 Техническое / Гаражное помещение", desc: "Верстак, кирпичная или бетонная стена, сфокусированный рабочий свет" },
                  ].map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => setAiProductScene(scene.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "var(--radius-m)",
                        border: aiProductScene === scene.id ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                        background: aiProductScene === scene.id ? "rgba(16, 185, 129, 0.08)" : "var(--color-bg-secondary)",
                        color: "var(--color-text-primary)",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{scene.name}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{scene.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Master Prompt with Negative Prompt for AI Models */}
              <div
                style={{
                  background: "var(--color-bg-secondary)",
                  borderRadius: "var(--radius-m)",
                  padding: "18px",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)" }}>
                      AI Master-Prompt для ComfyUI / SD / Flux Inpainting:
                    </span>
                  </div>

                  <div
                    style={{
                      background: "var(--color-surface)",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-s)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      lineHeight: 1.5,
                      border: "1px solid var(--color-border)",
                      marginBottom: 12,
                      maxHeight: 160,
                      overflowY: "auto",
                    }}
                  >
                    <code>
                      {`[PRODUCT_LOCK: MASK_EXACT]\nReplace background with ${aiProductScene}. Keep exact product shape, labels, color palette and proportions untouched. Generate physically accurate ground shadow and matching soft ambient reflection. Ultra-sharp product edge.`}
                    </code>
                  </div>

                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                    Используйте этот промпт в OpenRouter / ComfyUI для безупречного сохранения товара при генерации любых фонов.
                  </div>
                </div>

                <button
                  onClick={() => {
                    const promptText = `[PRODUCT_LOCK: MASK_EXACT]\nReplace background with ${aiProductScene}. Keep exact product shape, labels, color palette and proportions untouched. Generate physically accurate ground shadow and matching soft ambient reflection.`;
                    navigator.clipboard.writeText(promptText);
                    setAiPromptCopied(true);
                    setTimeout(() => setAiPromptCopied(false), 2000);
                  }}
                  style={{
                    marginTop: 16,
                    padding: "10px 16px",
                    borderRadius: "var(--radius-s)",
                    background: "var(--color-accent)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {aiPromptCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{aiPromptCopied ? "Скопировано!" : "Скопировать AI Master-Prompt"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: EXIF & AI METADATA INSPECTOR */}
        {/* ========================================================================= */}
        {selectedExifModalVariant && (
          <div
            onClick={() => setSelectedExifModalVariant(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-l)",
                maxWidth: 580,
                width: "100%",
                overflow: "hidden",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--color-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--color-bg-secondary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Camera size={18} style={{ color: "var(--color-accent)" }} />
                  <h3 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    Инспектор EXIF & Метаданных снимка
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedExifModalVariant(null)}
                  style={{ background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: 20, maxHeight: "75vh", overflowY: "auto" }}>
                {/* Image & Main Info Header */}
                <div style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "center" }}>
                  <img
                    src={selectedExifModalVariant.dataUrl}
                    alt="Preview"
                    style={{ width: 90, height: 90, borderRadius: "var(--radius-m)", objectFit: "cover", border: "1px solid var(--color-border)" }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                      {selectedExifModalVariant.exifData?.make} {selectedExifModalVariant.exifData?.model}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                      {selectedExifModalVariant.exifData?.lensModel}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-s)",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "var(--color-accent)",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      <ShieldCheck size={12} />
                      <span>100% Очищено от следов нейросетей & редакторов</span>
                    </div>
                  </div>
                </div>

                {/* EXIF Tags Table */}
                <div style={{ fontSize: 11, background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", padding: "12px 16px", border: "1px solid var(--color-border-light)", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--color-text-secondary)", textTransform: "uppercase", fontSize: 10 }}>
                    Встроенные теги съемки (JPEG APP1 Segment):
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "6px 12px" }}>
                    <span style={{ color: "var(--color-text-tertiary)" }}>Производитель (Make):</span>
                    <b>{selectedExifModalVariant.exifData?.make}</b>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Модель (Model):</span>
                    <b>{selectedExifModalVariant.exifData?.model}</b>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Объектив (Lens):</span>
                    <span>{selectedExifModalVariant.exifData?.lensModel}</span>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Выдержка (Exposure):</span>
                    <b>{selectedExifModalVariant.exifData?.exposureTime} сек</b>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Диафрагма (F-Number):</span>
                    <b>f/{selectedExifModalVariant.exifData?.fNumber}</b>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Светочувствительность:</span>
                    <b>ISO {selectedExifModalVariant.exifData?.iso}</b>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Фокусное расстояние:</span>
                    <b>{selectedExifModalVariant.exifData?.focalLength} мм</b>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Дата и время съемки:</span>
                    <b>{selectedExifModalVariant.exifData?.dateTime}</b>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Прошивка устройства:</span>
                    <span>{selectedExifModalVariant.exifData?.software}</span>

                    <span style={{ color: "var(--color-text-tertiary)" }}>Цветовое пространство:</span>
                    <span>sRGB (Standard Color Space)</span>
                  </div>
                </div>

                {/* AI Sanitization Checklist */}
                <div style={{ background: "rgba(16, 185, 129, 0.06)", borderRadius: "var(--radius-m)", padding: "12px 16px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--color-accent)", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={14} />
                    <span>Отчет безопасности анти-спам алгоритмов Авито:</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: "var(--color-text-secondary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={12} style={{ color: "var(--color-accent)" }} />
                      <span>C2PA / Content Credentials манифесты полностью удалены</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={12} style={{ color: "var(--color-accent)" }} />
                      <span>IPTC «trainedAlgorithmicMedia» и «DigitalSourceType» удалены</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={12} style={{ color: "var(--color-accent)" }} />
                      <span>Подписи ComfyUI / Automatic1111 / Photoshop / Canva удалены</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={12} style={{ color: "var(--color-accent)" }} />
                      <span>Пиксели переквантованы (разрушены цифровые водяные знаки SynthID)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid var(--color-border)",
                  background: "var(--color-bg-secondary)",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setSelectedExifModalVariant(null)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-s)",
                    background: "var(--color-accent)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: AVITO FEED PREVIEW (XML / CSV) */}
        {/* ========================================================================= */}
        {showFeedModal && (
          <div
            onClick={() => setShowFeedModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-l)",
                maxWidth: 720,
                width: "100%",
                overflow: "hidden",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--color-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--color-bg-secondary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <FileCode size={20} style={{ color: "var(--color-accent)" }} />
                  <div>
                    <h3 style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                      Предпросмотр фида для Автозагрузки Авито
                    </h3>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
                      Стандартный формат выгрузки объявлений и ссылок на фотопаки
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Tab switch */}
                  <div style={{ display: "flex", background: "var(--color-surface)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
                    <button
                      onClick={() => setFeedModalType("xml")}
                      style={{
                        padding: "4px 10px",
                        border: "none",
                        background: feedModalType === "xml" ? "var(--color-accent)" : "transparent",
                        color: feedModalType === "xml" ? "#fff" : "var(--color-text-secondary)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      XML
                    </button>
                    <button
                      onClick={() => setFeedModalType("csv")}
                      style={{
                        padding: "4px 10px",
                        border: "none",
                        background: feedModalType === "csv" ? "var(--color-accent)" : "transparent",
                        color: feedModalType === "csv" ? "#fff" : "var(--color-text-secondary)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      CSV
                    </button>
                  </div>

                  <button
                    onClick={() => setShowFeedModal(false)}
                    style={{ background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer" }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: 20 }}>
                <div
                  style={{
                    background: "var(--color-surface)",
                    padding: "14px 16px",
                    borderRadius: "var(--radius-m)",
                    border: "1px solid var(--color-border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    lineHeight: 1.5,
                    maxHeight: "55vh",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {feedModalType === "xml"
                    ? generateAvitoXmlFeed(generatedSets, {
                        category: feedCategory,
                        goodsType: feedGoodsType,
                        baseTitle: feedBaseTitle,
                        price: feedPrice,
                        address: feedAddress,
                        imageHostUrl: feedImageHost,
                      })
                    : generateAvitoCsvFeed(generatedSets, {
                        category: feedCategory,
                        goodsType: feedGoodsType,
                        baseTitle: feedBaseTitle,
                        price: feedPrice,
                        address: feedAddress,
                        imageHostUrl: feedImageHost,
                      })}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid var(--color-border)",
                  background: "var(--color-bg-secondary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                  Объявлений в фиде: <b>{generatedSets.length}</b>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      const text = feedModalType === "xml"
                        ? generateAvitoXmlFeed(generatedSets, {
                            category: feedCategory,
                            goodsType: feedGoodsType,
                            baseTitle: feedBaseTitle,
                            price: feedPrice,
                            address: feedAddress,
                            imageHostUrl: feedImageHost,
                          })
                        : generateAvitoCsvFeed(generatedSets, {
                            category: feedCategory,
                            goodsType: feedGoodsType,
                            baseTitle: feedBaseTitle,
                            price: feedPrice,
                            address: feedAddress,
                            imageHostUrl: feedImageHost,
                          });
                      navigator.clipboard.writeText(text);
                      setFeedCopied(true);
                      setTimeout(() => setFeedCopied(false), 2000);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "var(--radius-s)",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {feedCopied ? <Check size={14} style={{ color: "var(--color-accent)" }} /> : <Copy size={14} />}
                    <span>{feedCopied ? "Скопировано!" : "Скопировать код"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (feedModalType === "xml") {
                        const xml = generateAvitoXmlFeed(generatedSets, {
                          category: feedCategory,
                          goodsType: feedGoodsType,
                          baseTitle: feedBaseTitle,
                          price: feedPrice,
                          address: feedAddress,
                          imageHostUrl: feedImageHost,
                        });
                        triggerTextDownload(xml, "avito_autoload_feed.xml", "application/xml");
                      } else {
                        const csv = generateAvitoCsvFeed(generatedSets, {
                          category: feedCategory,
                          goodsType: feedGoodsType,
                          baseTitle: feedBaseTitle,
                          price: feedPrice,
                          address: feedAddress,
                          imageHostUrl: feedImageHost,
                        });
                        triggerTextDownload(csv, "avito_import_feed.csv", "text/csv");
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "var(--radius-s)",
                      background: "var(--color-accent)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Download size={14} />
                    <span>Скачать файл ({feedModalType.toUpperCase()})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
