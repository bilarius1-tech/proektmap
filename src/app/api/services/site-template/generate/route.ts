import { NextResponse } from "next/server";
import { generateTemplateDossier } from "@/lib/services/site-template/generate";
import { clientIp, generateSlots, rateLimitAllow } from "@/lib/services/site-template/rate-limit";
import type { SiteKind, StyleSeed, TemplateInput } from "@/lib/services/site-template/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

const KINDS: SiteKind[] = ["landing", "multipage", "product"];

function clip(value: unknown, max: number): string {
  return String(value || "").trim().slice(0, max);
}

function parseStyle(raw: unknown): StyleSeed | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const hex = (v: unknown) => {
    const h = String(v || "").trim().toUpperCase();
    return /^#[0-9A-F]{6}$/.test(h) ? h : "";
  };
  const bg = hex(s.bg);
  const text = hex(s.text);
  const accent = hex(s.accent);
  if (!bg || !text || !accent) return null;
  return {
    bg,
    text,
    muted: hex(s.muted) || "#666666",
    accent,
    border: hex(s.border) || "#DEDEDE",
    fontDisplay: clip(s.fontDisplay, 60) || "Manrope",
    fontBody: clip(s.fontBody, 60) || clip(s.fontDisplay, 60) || "Manrope",
    radius: Math.min(48, Math.max(0, Number(s.radius) || 12)),
    maxWidth: Math.min(1440, Math.max(720, Number(s.maxWidth) || 1120)),
    buttonHeight: Math.min(56, Math.max(36, Number(s.buttonHeight) || 48)),
    sourceUrl: clip(s.sourceUrl, 300) || undefined,
  };
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimitAllow(ip)) {
    return NextResponse.json({ error: "Слишком много сборок. Подождите несколько минут." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Нужны поля проекта." }, { status: 400 });
  }

  const idea = clip(body.idea, 4000);
  const productName = clip(body.productName, 80);
  if (idea.length < 12 && productName.length < 2) {
    return NextResponse.json({ error: "Опишите проект своими словами — кто, что делает, какое действие." }, { status: 400 });
  }

  const kind = KINDS.includes(body.kind as SiteKind) ? (body.kind as SiteKind) : "landing";
  const input: TemplateInput = {
    productName: productName || "Сайт",
    audience: clip(body.audience, 240),
    offer: clip(body.offer, 400),
    action: clip(body.action, 200),
    leadTo: clip(body.leadTo, 200),
    idea,
    refs: clip(body.refs, 800),
    constraints: clip(body.constraints, 400),
    kind,
    style: parseStyle(body.style),
  };

  try {
    const dossier = await generateSlots.run(() => generateTemplateDossier(input));
    return NextResponse.json(dossier);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось собрать шаблон.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
