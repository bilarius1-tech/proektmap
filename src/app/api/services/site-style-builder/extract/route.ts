import { NextResponse } from "next/server";
import { extractStyleFromUrl } from "@/lib/services/site-style-builder/extract";
import { clientIp, extractSlots, rateLimitAllow } from "@/lib/services/site-style-builder/rate-limit";
import { assertPublicHttpUrl, UnsafeUrlError } from "@/lib/services/site-style-builder/ssrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimitAllow(ip)) {
    return NextResponse.json(
      { error: "Слишком много съёмов. Подождите несколько минут или задайте токены вручную." },
      { status: 429 },
    );
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Нужен адрес сайта." }, { status: 400 });
  }

  let target: URL;
  try {
    target = await assertPublicHttpUrl(body.url || "");
  } catch (error) {
    const message = error instanceof UnsafeUrlError ? error.message : "Некорректный адрес.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const extracted = await extractSlots.run(() => extractStyleFromUrl(target));
    return NextResponse.json(extracted);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось снять стиль.";
    return NextResponse.json({ error: message, fallback: true }, { status: 503 });
  }
}
