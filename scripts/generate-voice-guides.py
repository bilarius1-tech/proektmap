#!/usr/bin/env python3
"""
Скрипт генерации MP3-файлов Голосового проводника ProektMap.
Поддерживает провайдеры:
  1. yandex (Yandex SpeechKit: Алёна, Ермил, Филипп и др.)
  2. edge   (Microsoft Neural: Светлана, Дмитрий)

Использование:
  python3 scripts/generate-voice-guides.py [--provider=yandex|edge] [--voice=alena|svetlana]
"""

from __future__ import annotations

import argparse
import asyncio
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public/audio/guides"
ENV_FILE = ROOT / ".env"
GUIDE_DATA_FILE = ROOT / "src/lib/voice-guide/guide-data.ts"


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if ENV_FILE.is_file():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip("\"'")
    return env


def parse_guides_from_ts() -> list[dict[str, str]]:
    """Парсит объекты из guide-data.ts"""
    content = GUIDE_DATA_FILE.read_text(encoding="utf-8")
    guides: list[dict[str, str]] = []

    # Ищем блоки внутри VOICE_GUIDES
    pattern = re.compile(
        r'id:\s*"([^"]+)",[\s\S]*?rawScript:\s*"([^"]+)",[\s\S]*?voiceScript:\s*"([^"]+)",[\s\S]*?audioSrc:\s*"([^"]+)"',
        re.MULTILINE,
    )

    for match in pattern.finditer(content):
        guide_id = match.group(1)
        raw_script = match.group(2)
        voice_script = match.group(3)
        audio_src = match.group(4)
        guides.append({
            "id": guide_id,
            "rawScript": raw_script,
            "voiceScript": voice_script,
            "audioSrc": audio_src,
        })

    return guides


def generate_yandex(guides: list[dict[str, str]], voice: str = "alena", speed: str = "1.05") -> None:
    env = load_env()
    api_key = env.get("YANDEX_API_KEY")
    folder_id = env.get("YANDEX_FOLDER_ID")

    if not api_key or not folder_id:
        print("[ERROR] YANDEX_API_KEY или YANDEX_FOLDER_ID не найдены в .env")
        sys.exit(1)

    url = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize"
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"\n🎙️ [Yandex SpeechKit] Генерация MP3 для {len(guides)} разделов (Голос: {voice}, Скорость: {speed})...\n")

    for item in guides:
        text = item["voiceScript"]
        filename = Path(item["audioSrc"]).name
        target_path = OUTPUT_DIR / filename

        params = {
            "text": text,
            "voice": voice,
            "speed": speed,
            "emotion": "good",
            "format": "mp3",
            "folderId": folder_id,
        }
        data = urllib.parse.urlencode(params).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Authorization": f"Api-Key {api_key}"},
        )

        try:
            with urllib.request.urlopen(req) as resp:
                content = resp.read()
                target_path.write_bytes(content)
                size_kb = len(content) / 1024
                print(f"  ✓ {item['id']:<12} -> {filename:<16} ({size_kb:.1f} KB)")
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")
            print(f"  ✗ Ошибка для {item['id']}: {e.code} - {err_msg}")


async def generate_edge(guides: list[dict[str, str]], voice: str = "ru-RU-SvetlanaNeural", rate: str = "+6%") -> None:
    try:
        import edge_tts
    except ImportError:
        print("[ERROR] Модуль edge-tts не установлен. Запустите: pip install edge-tts")
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n🎙️ [Microsoft Neural] Генерация MP3 для {len(guides)} разделов (Голос: {voice}, Скорость: {rate})...\n")

    for item in guides:
        text = item["voiceScript"]
        filename = Path(item["audioSrc"]).name
        target_path = OUTPUT_DIR / filename

        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(str(target_path))
        size_kb = target_path.stat().st_size / 1024
        print(f"  ✓ {item['id']:<12} -> {filename:<16} ({size_kb:.1f} KB)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Генератор голосовых гидов ProektMap")
    parser.add_argument("--provider", choices=["yandex", "edge"], default="yandex", help="Провайдер синтеза речи")
    parser.add_argument("--voice", default="", help="Имя голоса (alena/ermil/svetlana/dmitry)")
    parser.add_argument("--speed", default="", help="Скорость речи (например 1.05 или +6%)")
    args = parser.parse_args()

    guides = parse_guides_from_ts()
    if not guides:
        print("[ERROR] Не найдено ни одного сценария в guide-data.ts")
        sys.exit(1)

    print(f"Найдено сценариев: {len(guides)}")

    if args.provider == "yandex":
        voice = args.voice if args.voice else "alena"
        speed = args.speed if args.speed else "1.05"
        generate_yandex(guides, voice=voice, speed=speed)
    else:
        voice = args.voice if args.voice else "ru-RU-SvetlanaNeural"
        speed = args.speed if args.speed else "+6%"
        asyncio.run(generate_edge(guides, voice=voice, rate=speed))

    print("\n✅ Все файлы успешно сгенерированы в public/audio/guides/\n")


if __name__ == "__main__":
    main()
