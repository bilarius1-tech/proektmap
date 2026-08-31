import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { text, voice = "ru-RU-SvetlanaNeural", rate = "+6%" } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Параметр text обязателен" }, { status: 400 });
    }

    // Ограничиваем длину превью до 1500 символов в целях безопасности
    const cleanText = text.trim().slice(0, 1500).replace(/["`$\\]/g, "");

    const tempFile = path.join(
      os.tmpdir(),
      `voice_preview_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`
    );

    // Поддерживаемые голоса Edge-TTS
    const validVoices: Record<string, string> = {
      "svetlana-fast": "ru-RU-SvetlanaNeural",
      "svetlana": "ru-RU-SvetlanaNeural",
      "dmitry-fast": "ru-RU-DmitryNeural",
      "dmitry": "ru-RU-DmitryNeural",
      "ru-RU-SvetlanaNeural": "ru-RU-SvetlanaNeural",
      "ru-RU-DmitryNeural": "ru-RU-DmitryNeural",
    };

    const targetVoice = validVoices[voice] || "ru-RU-SvetlanaNeural";
    const targetRate = rate || (voice.includes("fast") ? "+6%" : "+0%");

    // Вызываем edge-tts через CLI
    const cmd = `edge-tts --voice "${targetVoice}" --rate "${targetRate}" --text "${cleanText}" --write-media "${tempFile}"`;
    await execAsync(cmd, { timeout: 20000 });

    const audioBuffer = await fs.readFile(tempFile);
    await fs.unlink(tempFile).catch(() => {});

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("Speech synthesis error:", err);
    return NextResponse.json(
      { error: "Не удалось сгенерировать голос", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
