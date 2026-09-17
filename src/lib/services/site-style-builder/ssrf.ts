import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "metadata.internal",
]);

function ipv4ToInt(ip: string): number {
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return -1;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

export function isPrivateIp(ip: string): boolean {
  if (ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd")) return true;
  const n = ipv4ToInt(ip);
  if (n < 0) return true;
  const inRange = (start: string, end: string) => n >= ipv4ToInt(start) && n <= ipv4ToInt(end);
  return (
    inRange("0.0.0.0", "0.255.255.255") ||
    inRange("10.0.0.0", "10.255.255.255") ||
    inRange("127.0.0.0", "127.255.255.255") ||
    inRange("169.254.0.0", "169.254.255.255") ||
    inRange("172.16.0.0", "172.31.255.255") ||
    inRange("192.168.0.0", "192.168.255.255") ||
    inRange("224.0.0.0", "239.255.255.255")
  );
}

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

export async function assertPublicHttpUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new UnsafeUrlError("Вставьте полный адрес, начиная с https://");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Только http и https.");
  }

  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new UnsafeUrlError("Разрешены только порты 80 и 443.");
  }

  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new UnsafeUrlError("Этот адрес нельзя снимать.");
  }

  const ips: string[] = [];
  if (isIP(host)) {
    ips.push(host);
  } else {
    try {
      const v4 = await lookup(host, { all: true, verbatim: true });
      ips.push(...v4.map((row) => row.address));
    } catch {
      throw new UnsafeUrlError("Не удалось найти этот сайт.");
    }
  }

  if (ips.length === 0 || ips.some(isPrivateIp)) {
    throw new UnsafeUrlError("Этот адрес нельзя снимать.");
  }

  return url;
}
