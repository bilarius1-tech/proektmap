import { videoEmbedSrc } from "@/lib/shop/video-embed";

const YOUTUBE = /^https:\/\/(www\.youtube\.com\/embed\/|www\.youtube-nocookie\.com\/embed\/)/;

export function plainDescription(value: string) {
  return (value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function shopDescriptionHtml(raw: string) {
  const text = raw || "";
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    return text
      .split(/\n{2,}/)
      .map((part) => `<p>${escapeText(part).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  let html = text.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/<iframe\b([^>]*)>(?:<\/iframe>)?/gi, (_full, attrs: string) => {
    const srcMatch = attrs.match(/\ssrc\s*=\s*("([^"]+)"|'([^']+)')/i);
    const rawSrc = srcMatch?.[2] || srcMatch?.[3] || "";
    const src = videoEmbedSrc(rawSrc) || (YOUTUBE.test(rawSrc) ? rawSrc : "");
    if (!src) return "";
    return `<div class="video-embed"><iframe src="${src}" allowfullscreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock" style="width:100%;aspect-ratio:16/9;border:0"></iframe></div>`;
  });
  return html;
}
