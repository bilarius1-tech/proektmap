"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Sparkles,
  Layers,
  Globe,
  Github,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Eye,
  Rocket,
} from "lucide-react";

const CATEGORIES = [
  "SaaS",
  "Бот",
  "Веб-сервис",
  "AI-ассистент",
  "Автоматизация",
  "Мобильное приложение",
  "Игра",
  "Инструмент",
];

const SUGGESTED_AI_TOOLS = [
  "Cursor IDE",
  "Claude 3.7 Sonnet",
  "Claude 3.5 Sonnet",
  "DeepSeek V3",
  "DeepSeek R1",
  "GPT-4o",
  "Bolt.new",
  "v0 by Vercel",
  "Lovable",
  "Windsurf",
  "Midjourney v6",
  "n8n AI",
];

const SUGGESTED_TECH_STACK = [
  "Next.js 16",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Python",
  "FastAPI",
  "Prisma ORM",
  "PostgreSQL",
  "Supabase",
  "Docker",
  "Node.js",
  "Telegram Bot API",
];

export default function NewProjectClient({ user }: { user: any }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("SaaS");
  const [description, setDescription] = useState("");
  const [aiRecipe, setAiRecipe] = useState("");
  const [timeSpent, setTimeSpent] = useState("2 дня");
  const [url, setUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [status, setStatus] = useState("Запущен");

  const [selectedAiTools, setSelectedAiTools] = useState<string[]>(["Cursor IDE", "Claude 3.7 Sonnet"]);
  const [customAiTool, setCustomAiTool] = useState("");

  const [selectedTech, setSelectedTech] = useState<string[]>(["Next.js 16", "TypeScript"]);
  const [customTech, setCustomTech] = useState("");

  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAiTool = (tool: string) => {
    setSelectedAiTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const addCustomAiTool = () => {
    if (customAiTool.trim() && !selectedAiTools.includes(customAiTool.trim())) {
      setSelectedAiTools((prev) => [...prev, customAiTool.trim()]);
      setCustomAiTool("");
    }
  };

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const addCustomTech = () => {
    if (customTech.trim() && !selectedTech.includes(customTech.trim())) {
      setSelectedTech((prev) => [...prev, customTech.trim()]);
      setCustomTech("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) newUrls.push(data.url);
        }
      }
      setScreenshots((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      setError("Ошибка при загрузке изображений. Попробуйте ещё раз.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Пожалуйста, укажите название проекта");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          aiRecipe,
          timeSpent,
          url,
          githubUrl,
          telegramUrl,
          status,
          aiTools: selectedAiTools.join(", "),
          techStack: selectedTech.join(", "),
          screenshot: screenshots[0] || "",
          screenshots,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка при сохранении проекта");
      }

      if (data.moderationStatus === "pending") {
        alert("🎉 Проект успешно отправлен! Он появится в общем каталоге сразу после быстрой проверки модератором.");
      }
      router.push(`/dashboard`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Не удалось опубликовать работу");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--color-bg-primary)", minHeight: "100vh", padding: "40px 20px 80px", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        {/* Navigation back */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
          <Link
            href="/ai-workshop"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600 }}
          >
            <ArrowLeft size={14} /> Назад в AI Цех
          </Link>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 700 }}>
            +150 XP за публикацию кейса
          </span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(15, 184, 128, 0.1)", color: "#0fb880", borderRadius: 4, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            <Sparkles size={14} /> Портфолио вайбкодера
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Добавить работу в портфолио
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", margin: 0, lineHeight: 1.6 }}>
            Поделитесь проектом, собранным с помощью нейросетей. Кейс увидят клиенты, работодатели и сообщество вайбкодеров.
          </p>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b", fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>

          {/* Block 1: Main info */}
          <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "24px 28px" }}>
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Layers size={18} color="var(--color-accent)" /> 1. Основная информация
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                  Название проекта *
                </label>
                <input
                  type="text"
                  placeholder="например, CRM для автосервиса на AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                  Категория продукта
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)" }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                Краткое описание (питч кейса)
              </label>
              <textarea
                rows={2}
                placeholder="Что делает продукт? Какую задачу клиента решает?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                  <Clock size={13} style={{ verticalAlign: "middle", marginRight: 4 }} /> Время разработки
                </label>
                <input
                  type="text"
                  placeholder="например, 2 дня / 24 часа / 1 неделя"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                  Статус проекта
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)" }}
                >
                  <option value="Запущен">🚀 Запущен в production</option>
                  <option value="Бета-тест">🧪 Бета-версия / MVP</option>
                  <option value="Концепт">💡 Концепт / Демо</option>
                </select>
              </div>
            </div>
          </div>

          {/* Block 2: Visuals & Behance Media */}
          <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "24px 28px" }}>
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <ImageIcon size={18} color="var(--color-accent)" /> 2. Обложка и галерея скриншотов (Behance витрина)
            </h2>

            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 16 }}>
              Загрузите главный скриншот обложки и дополнительные изображения интерфейса вашего продукта.
            </p>

            {/* Upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--color-border)",
                borderRadius: 8,
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                background: "var(--color-bg-primary)",
                transition: "border-color 0.2s",
                marginBottom: 16,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <Upload size={28} color="var(--color-accent)" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 4 }}>
                {isUploading ? "Загружаем изображения..." : "Нажмите для загрузки скриншотов"}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                Поддерживаются PNG, JPG, WebP. Первая загруженная картинка станет обложкой.
              </div>
            </div>

            {/* Previews grid */}
            {screenshots.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {screenshots.map((imgUrl, idx) => (
                  <div
                    key={imgUrl}
                    style={{
                      position: "relative",
                      borderRadius: 6,
                      overflow: "hidden",
                      border: idx === 0 ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                      aspectRatio: "16/10",
                      background: "#000",
                    }}
                  >
                    <img src={imgUrl} alt={`Screenshot ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {idx === 0 && (
                      <span style={{ position: "absolute", top: 6, left: 6, background: "var(--color-accent)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                        Главная обложка
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeScreenshot(idx);
                      }}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Block 3: AI Stack & Recipe */}
          <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "24px 28px" }}>
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="var(--color-accent)" /> 3. AI-рецепт и используемые технологии
            </h2>

            {/* AI Tools selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--color-text-primary)" }}>
                Нейросети, AI-редакторы и ассистенты:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {SUGGESTED_AI_TOOLS.map((tool) => {
                  const selected = selectedAiTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleAiTool(tool)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: selected ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                        background: selected ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                        color: selected ? "var(--color-accent)" : "var(--color-text-secondary)",
                      }}
                    >
                      {selected ? "✓ " : "+ "}
                      {tool}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="text"
                  placeholder="Добавить свой AI-инструмент (например, Perplexity)..."
                  value={customAiTool}
                  onChange={(e) => setCustomAiTool(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomAiTool();
                    }
                  }}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={addCustomAiTool}
                  style={{ padding: "8px 16px", borderRadius: 6, background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  <Plus size={14} style={{ verticalAlign: "middle" }} />
                </button>
              </div>
            </div>

            {/* Tech Stack selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--color-text-primary)" }}>
                Технологический стек (кодовая база):
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {SUGGESTED_TECH_STACK.map((tech) => {
                  const selected = selectedTech.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: selected ? "1px solid #6366f1" : "1px solid var(--color-border)",
                        background: selected ? "rgba(99, 102, 241, 0.1)" : "var(--color-bg-primary)",
                        color: selected ? "#6366f1" : "var(--color-text-secondary)",
                      }}
                    >
                      {selected ? "✓ " : "+ "}
                      {tech}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="text"
                  placeholder="Добавить свой фреймворк или библиотеку..."
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTech();
                    }
                  }}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={addCustomTech}
                  style={{ padding: "8px 16px", borderRadius: 6, background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  <Plus size={14} style={{ verticalAlign: "middle" }} />
                </button>
              </div>
            </div>

            {/* AI Recipe Details */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                AI-рецепт и как вы это собрали (Vibe Coding Stories)
              </label>
              <textarea
                rows={4}
                placeholder="Расскажите сообществу: как формулировали промпты? Какие возникли сложности и как AI помог их обойти? В чём была архитектурная фишка?"
                value={aiRecipe}
                onChange={(e) => setAiRecipe(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)", resize: "vertical" }}
              />
            </div>
          </div>

          {/* Block 4: Links & Proof of Work */}
          <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "24px 28px" }}>
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={18} color="var(--color-accent)" /> 4. Живые ссылки и Proof of Work
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                  <Globe size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Ссылка на работающий проект (Live URL)
                </label>
                <input
                  type="url"
                  placeholder="https://my-awesome-product.ru"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                    <Github size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> GitHub репозиторий (опционально)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>
                    <Send size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Ссылка на Telegram-бота (если это бот)
                  </label>
                  <input
                    type="url"
                    placeholder="https://t.me/my_bot"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: "var(--text-s)", background: "var(--color-bg-primary)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit action */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
            <Link
              href="/ai-workshop"
              style={{ padding: "12px 24px", borderRadius: 6, border: "1px solid var(--color-border)", textDecoration: "none", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", fontWeight: 600 }}
            >
              Отмена
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 6,
                background: "var(--color-accent)",
                color: "#fff",
                border: "none",
                fontSize: "var(--text-s)",
                fontWeight: 700,
                cursor: isSubmitting || !title.trim() ? "not-allowed" : "pointer",
                opacity: isSubmitting || !title.trim() ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                "Публикуем кейс..."
              ) : (
                <>
                  <Rocket size={16} /> Опубликовать работу в портфолио
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
