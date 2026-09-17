import { NextResponse } from "next/server";
import { packStarterZip } from "@/lib/services/site-template/pack-zip";
import { clientIp, generateSlots, rateLimitAllow } from "@/lib/services/site-template/rate-limit";
import type { SiteKind, TemplateDossier } from "@/lib/services/site-template/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

function clip(value: unknown, max: number): string {
  return String(value || "").slice(0, max);
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimitAllow(ip)) {
    return NextResponse.json({ error: "Слишком много скачиваний." }, { status: 429 });
  }

  let body: Partial<TemplateDossier>;
  try {
    body = (await request.json()) as Partial<TemplateDossier>;
  } catch {
    return NextResponse.json({ error: "Сначала соберите шаблон." }, { status: 400 });
  }

  if (!body.briefMd || !body.designMd || !body.tokensCss) {
    return NextResponse.json({ error: "Нет досье. Нажмите «Собрать шаблон»." }, { status: 400 });
  }

  const dossier: TemplateDossier = {
    productName: clip(body.productName, 80) || "Сайт",
    slug: clip(body.slug, 40).replace(/[^a-z0-9-]/g, "") || "site",
    kind: (body.kind as SiteKind) || "landing",
    briefMd: clip(body.briefMd, 20_000),
    designMd: clip(body.designMd, 20_000),
    sitemapMd: clip(body.sitemapMd, 8_000),
    referencesMd: clip(body.referencesMd, 8_000),
    handoffMd: clip(body.handoffMd, 8_000),
    tokensCss: clip(body.tokensCss, 8_000),
    cursorPrompt: clip(body.cursorPrompt, 4_000),
    warnings: [],
  };

  try {
    const zip = await generateSlots.run(() => packStarterZip(dossier));
    return new NextResponse(new Uint8Array(zip), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${dossier.slug}-site-starter.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[site-template-pack]", error);
    return NextResponse.json({ error: "Не удалось упаковать zip." }, { status: 503 });
  }
}
