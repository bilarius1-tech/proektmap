import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

const execAsync = promisify(exec);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Range",
  "Access-Control-Max-Age": "86400",
};

const CACHE_DIR = path.join(process.cwd(), "public/audio/cache");

async function handleSynthesize(text: string, voiceParam?: string, rateParam?: string) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Параметр text обязателен" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Ограничиваем длину до 2000 символов в целях безопасности
  const cleanText = text.trim().slice(0, 2000).replace(/["`$\\]/g, "");

  // Поддерживаемые голоса Edge-TTS
  const validVoices: Record<string, string> = {
    "svetlana-fast": "ru-RU-SvetlanaNeural",
    "svetlana": "ru-RU-SvetlanaNeural",
    "dmitry-fast": "ru-RU-DmitryNeural",
    "dmitry": "ru-RU-DmitryNeural",
    "ru-RU-SvetlanaNeural": "ru-RU-SvetlanaNeural",
    "ru-RU-DmitryNeural": "ru-RU-DmitryNeural",
  };

  const targetVoice = validVoices[voiceParam || ""] || "ru-RU-SvetlanaNeural";
  const targetRate =
    rateParam || (voiceParam && voiceParam.includes("fast") ? "+6%" : "+0%");

  // Создаем хэш для кэша
  const cacheKey = crypto
    .createHash("md5")
    .update(`${cleanText}_${targetVoice}_${targetRate}`)
    .digest("hex");

  await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => {});
  const cachedFilePath = path.join(CACHE_DIR, `${cacheKey}.mp3`);

  // Проверяем наличие в кэше
  try {
    const cachedBuffer = await fs.readFile(cachedFilePath);
    return new NextResponse(cachedBuffer, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "audio/mpeg",
        "Content-Length": cachedBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Cache": "HIT",
      },
    });
  } catch {
    // Не найдено в кэше — генерируем
  }

  const tempFile = path.join(
    os.tmpdir(),
    `voice_synth_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`
  );

  // Вызываем edge-tts через CLI
  const cmd = `edge-tts --voice "${targetVoice}" --rate "${targetRate}" --text "${cleanText}" --write-media "${tempFile}"`;
  await execAsync(cmd, { timeout: 25000 });

  const audioBuffer = await fs.readFile(tempFile);
  await fs.unlink(tempFile).catch(() => {});

  // Сохраняем в кэш
  await fs.writeFile(cachedFilePath, audioBuffer).catch(() => {});

  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Cache": "MISS",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text") || "";
    const voice = searchParams.get("voice") || "ru-RU-SvetlanaNeural";
    const rate = searchParams.get("rate") || "";

    return await handleSynthesize(text, voice, rate);
  } catch (err: any) {
    console.error("Speech synthesis GET error:", err);
    return NextResponse.json(
      { error: "Не удалось сгенерировать голос", details: err?.message || String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { text, voice, rate } = body;

    return await handleSynthesize(text, voice, rate);
  } catch (err: any) {
    console.error("Speech synthesis POST error:", err);
    return NextResponse.json(
      { error: "Не удалось сгенерировать голос", details: err?.message || String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
