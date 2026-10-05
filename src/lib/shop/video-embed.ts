export function videoEmbedSrc(raw: string): string | null {
  const iframe = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  const candidate = (iframe?.[1] || raw).trim().replace(/&amp;/g, "&");
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "rutube.ru") {
    if (url.pathname.startsWith("/play/embed/")) return `https://rutube.ru${url.pathname.replace(/\/$/, "")}`;
    const match = url.pathname.match(/\/video\/([\w-]+)/);
    return match ? `https://rutube.ru/play/embed/${match[1]}` : null;
  }
  if (host === "vk.com" || host === "vkvideo.ru") {
    if (url.pathname.includes("video_ext.php")) {
      const oid = url.searchParams.get("oid");
      const id = url.searchParams.get("id");
      if (!oid || !id || !/^-?\d+$/.test(oid) || !/^\d+$/.test(id)) return null;
      const hash = url.searchParams.get("hash");
      let src = `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;
      if (hash) src += `&hash=${encodeURIComponent(hash)}`;
      return src;
    }
    const match = `${url.pathname}${url.search}`.match(/video(-?\d+)_(\d+)/);
    return match ? `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2` : null;
  }
  return null;
}
