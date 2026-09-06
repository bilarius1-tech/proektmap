import { Metadata } from "next";
import { getDb } from "@/lib/db";
import { hasVkToken, VK_VIDEO_CHANNELS } from "@/lib/vk-video";
import VideoHubClient from "./video-hub-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Видеоуроки вайбкодинга и дизайна — VK Video | ProektMap",
  description:
    "Уроки с каналов Craftum Design и практики на ProektMap: смотри на сайте и сразу переходи к готовому маршруту без AI-скуфа.",
  alternates: {
    canonical: "https://proektmap.ru/video",
  },
};

export default async function VideoPage() {
  const db = await getDb();
  let videos: {
    id: string;
    title: string;
    description: string;
    duration: number;
    views: number;
    publishedAt: Date;
    thumbUrl: string;
    playerUrl: string;
    vkUrl: string;
    channelSlug: string;
  }[] = [];

  try {
    videos = await db.vkVideo.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 120,
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        views: true,
        publishedAt: true,
        thumbUrl: true,
        playerUrl: true,
        vkUrl: true,
        channelSlug: true,
      },
    });
  } catch {
    videos = [];
  }

  const tokenOk = hasVkToken();

  return (
    <div style={{ background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "60vh" }}>
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "var(--space-xl) var(--space-m) var(--space-l)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          VK Video → ProektMap
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}
        >
          Видеоуроки
        </h1>
        <p style={{ margin: "0 0 8px", fontSize: "var(--text-s)", color: "var(--color-text-secondary)", maxWidth: 560, lineHeight: 1.6 }}>
          Разборы вайбкодинга и дизайна с каналов Алексея. Смотри здесь — закрепляй маршрутом на сайте.
        </p>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
          {VK_VIDEO_CHANNELS.map((c) => c.title).join(" · ")}
          {videos.length > 0 ? ` · ${videos.length} в каталоге` : ""}
        </div>
      </div>

      <VideoHubClient
        hasToken={tokenOk}
        videos={videos.map((v) => ({
          ...v,
          publishedAt: v.publishedAt.toISOString(),
        }))}
      />
    </div>
  );
}
