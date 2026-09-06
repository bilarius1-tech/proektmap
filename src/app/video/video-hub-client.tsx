"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, Play, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { VK_VIDEO_CHANNELS, VK_VIDEO_TEACHING, formatDuration } from "@/lib/vk-video";

export type VideoCard = {
  id: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  publishedAt: string;
  thumbUrl: string;
  playerUrl: string;
  vkUrl: string;
  channelSlug: string;
};

const PAGE_SIZE = 20;

export default function VideoHubClient({
  videos,
  hasToken,
}: {
  videos: VideoCard[];
  hasToken: boolean;
}) {
  const [channel, setChannel] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (channel === "all") return videos;
    return videos.filter((v) => v.channelSlug === channel);
  }, [videos, channel]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const active = activeId ? videos.find((v) => v.id === activeId) || null : null;

  function selectChannel(slug: string) {
    setChannel(slug);
    setPage(1);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-xxl)" }}>
      {!hasToken && (
        <div
          style={{
            marginBottom: "var(--space-l)",
            padding: "var(--space-l)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-secondary)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Каталог ждёт токен VK</div>
          <p style={{ margin: "0 0 12px", fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Страница готова. Добавь <code>VK_SERVICE_TOKEN</code> в .env и запусти синк — инструкция в docs.
          </p>
          <Link href="/blog" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600 }}>
            Пока смотри блог →
          </Link>
        </div>
      )}

      {hasToken && videos.length === 0 && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Видео ещё не синхронизированы</div>
          <p style={{ margin: 0, fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>
            Запусти <code>npx tsx --env-file=.env scripts/sync-vk-video.ts</code> или cron-обёртку.
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--space-m)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <div style={{ padding: "var(--space-m)", border: "1px solid #fecaca", background: "#fff7f7" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#b91c1c", marginBottom: 6 }}>Плохо</div>
          <div style={{ fontSize: "var(--text-xs)", lineHeight: 1.55 }}>{VK_VIDEO_TEACHING.bad}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 8 }}>{VK_VIDEO_TEACHING.why}</div>
        </div>
        <div style={{ padding: "var(--space-m)", border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#15803d", marginBottom: 6 }}>Хорошо</div>
          <div style={{ fontSize: "var(--text-xs)", lineHeight: 1.55 }}>{VK_VIDEO_TEACHING.good}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            <Link href="/resheniya/premium-landing" style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)" }}>
              Маршрут anti-скуф →
            </Link>
            <Link href="/ai-skills" style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)" }}>
              AI Skills →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "var(--space-m)" }}>
        <FilterChip active={channel === "all"} onClick={() => selectChannel("all")} label={`Все (${videos.length})`} />
        {VK_VIDEO_CHANNELS.map((c) => {
          const n = videos.filter((v) => v.channelSlug === c.slug).length;
          return (
            <FilterChip
              key={c.slug}
              active={channel === c.slug}
              onClick={() => selectChannel(c.slug)}
              label={`${c.shortTitle} (${n})`}
              accent={c.accent}
            />
          );
        })}
      </div>

      {filtered.length > 0 && (
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: "var(--space-s)" }}>
          {rangeLabel(safePage, PAGE_SIZE, filtered.length)}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-m)" }}>
        {pageItems.map((v) => {
          const ch = VK_VIDEO_CHANNELS.find((c) => c.slug === v.channelSlug);
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveId(v.id)}
              style={{
                textAlign: "left",
                padding: 0,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-primary)",
                cursor: "pointer",
                color: "inherit",
                font: "inherit",
              }}
            >
              <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--color-bg-secondary)" }}>
                {v.thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.thumbUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : null}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.25)",
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.65)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <Play size={18} fill="#fff" />
                  </span>
                </div>
                {v.duration > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: 8,
                      bottom: 8,
                      background: "rgba(0,0,0,0.75)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 6px",
                    }}
                  >
                    {formatDuration(v.duration)}
                  </span>
                )}
              </div>
              <div style={{ padding: "var(--space-m)" }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: ch?.accent || "var(--color-text-tertiary)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {ch?.shortTitle || v.channelSlug}
                </div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, fontFamily: "var(--font-heading)", lineHeight: 1.35, marginBottom: 6 }}>
                  {v.title}
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
                  {new Date(v.publishedAt).toLocaleDateString("ru")}
                  {v.views > 0 ? ` · ${v.views.toLocaleString("ru")} просм.` : ""}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length > PAGE_SIZE && (
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      )}

      <div
        style={{
          marginTop: "var(--space-xxl)",
          padding: "var(--space-l)",
          border: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-m)",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 4 }}>После урока — маршрут</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", maxWidth: 420, lineHeight: 1.5 }}>
            Before: {VK_VIDEO_TEACHING.before} → After: {VK_VIDEO_TEACHING.after}
          </div>
        </div>
        <Link
          href="/resheniya/premium-landing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 18px",
            background: "var(--color-accent)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "var(--text-xs)",
          }}
        >
          Собрать премиум-шаблон <ArrowRight size={16} />
        </Link>
      </div>

      <div style={{ marginTop: "var(--space-l)", display: "flex", gap: 16, flexWrap: "wrap" }}>
        {VK_VIDEO_CHANNELS.map((c) => (
          <a
            key={c.slug}
            href={c.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}
          >
            Все видео {c.title} на VK →
          </a>
        ))}
      </div>

      {active && <VideoModal video={active} onClose={() => setActiveId(null)} />}
    </div>
  );
}

function rangeLabel(page: number, pageSize: number, total: number) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return `${from}–${to} из ${total}`;
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages = visiblePages(page, totalPages);

  function go(p: number) {
    onChange(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      style={{
        marginTop: "var(--space-l)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <PageBtn disabled={page <= 1} onClick={() => go(page - 1)} ariaLabel="Назад">
        <ChevronLeft size={16} />
      </PageBtn>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} style={{ padding: "0 4px", color: "var(--color-text-tertiary)", fontSize: 13 }}>
            …
          </span>
        ) : (
          <PageBtn key={p} active={p === page} onClick={() => go(p as number)}>
            {p}
          </PageBtn>
        )
      )}
      <PageBtn disabled={page >= totalPages} onClick={() => go(page + 1)} ariaLabel="Вперёд">
        <ChevronRight size={16} />
      </PageBtn>
      {page < totalPages && (
        <button
          type="button"
          onClick={() => go(page + 1)}
          style={{
            marginLeft: 8,
            padding: "8px 14px",
            border: "1px solid var(--color-accent)",
            background: "transparent",
            color: "var(--color-accent)",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Ещё →
        </button>
      )}
    </div>
  );
}

function visiblePages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, total, current, current - 1, current + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      style={{
        minWidth: 36,
        height: 36,
        padding: "0 10px",
        border: active ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
        background: active ? "var(--color-bg-secondary)" : "var(--color-bg-primary)",
        color: active ? "var(--color-accent)" : "var(--color-text-primary)",
        fontWeight: 700,
        fontSize: 13,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function VideoModal({ video, onClose }: { video: VideoCard; onClose: () => void }) {
  const ch = VK_VIDEO_CHANNELS.find((c) => c.slug === video.channelSlug);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(10, 12, 16, 0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(920px, 100%)",
          background: "var(--color-bg-primary)",
          border: "1px solid var(--color-border)",
          maxHeight: "calc(100vh - 32px)",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {ch && (
              <div style={{ fontSize: 10, fontWeight: 700, color: ch.accent, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
                {ch.shortTitle}
              </div>
            )}
            <div style={{ fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", lineHeight: 1.35 }}>
              {video.title}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-primary)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe
            src={video.playerUrl}
            title={video.title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>

        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
            {new Date(video.publishedAt).toLocaleDateString("ru")}
            {video.views > 0 ? ` · ${video.views.toLocaleString("ru")} просм.` : ""}
            {video.duration > 0 ? ` · ${formatDuration(video.duration)}` : ""}
          </div>
          <a
            href={video.vkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              color: "var(--color-accent)",
              textDecoration: "none",
            }}
          >
            Открыть в VK <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        border: active ? `1px solid ${accent || "var(--color-accent)"}` : "1px solid var(--color-border)",
        background: active ? "var(--color-bg-secondary)" : "var(--color-bg-primary)",
        color: active ? accent || "var(--color-accent)" : "var(--color-text-secondary)",
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
