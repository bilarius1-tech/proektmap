#!/usr/bin/env python3
"""Генерация локальных MP3 Вайбика через Piper."""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = ROOT / "src/lib/audio/vaibik-audio-manifest.json"
OUTPUT_DIR = ROOT / "public/audio/vaibik"
MODEL = ROOT / ".voice-cache/piper/ru_RU-denis-medium.onnx"

TEST_LINES = {
    "TEST_01": "Привет! Я Вайбик! Ура-а!",
    "TEST_02": "Но у меня есть секрет...",
    "TEST_03": "Я не умею читать мысли!",
    "TEST_04": "Смотри! Сейчас произойдёт волшебство...",
    "TEST_05": "Миссия выполнена! Ты настоящий вайбкодер!",
}


def find_voice_script() -> Path | None:
    source_names = ("VAIBIK_VOICE_SCRIPT.txt", "VAIBIK_REPLIQUES.txt")
    for name in source_names:
        direct = ROOT / name
        if direct.is_file():
            return direct
    ignored = {".git", ".next", "node_modules", ".voice-venv", ".voice-cache"}
    for name in source_names:
        for candidate in ROOT.rglob(name):
            if not ignored.intersection(candidate.parts):
                return candidate
    return None


def clean_text(value: str) -> str:
    value = re.sub(r"^\s*(?:текст|реплика)\s*:\s*", "", value, flags=re.I)
    value = value.strip().strip("«»\"'`")
    return re.sub(r"\s+", " ", value).strip()


def parse_voice_script(path: Path, expected_ids: set[str]) -> dict[str, str]:
    lines = path.read_text(encoding="utf-8-sig").splitlines()
    result: dict[str, str] = {}
    current_id: str | None = None
    chunks: list[str] = []

    def flush() -> None:
        nonlocal chunks
        if current_id:
            text = clean_text(" ".join(part for part in chunks if part.strip()))
            if text:
                result[current_id] = text
        chunks = []

    id_pattern = re.compile(
        r"^\s*(?:[-*#]+\s*)?(?:ID\s*[:=]\s*)?"
        r"([A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+)"
        r"(?:\s*(?:[:=|]|→|—)\s*(.*))?\s*$",
        flags=re.I,
    )
    for raw_line in lines:
        line = raw_line.strip()
        match = id_pattern.match(line)
        candidate = match.group(1) if match else None
        if candidate in expected_ids:
            flush()
            current_id = candidate
            inline_text = match.group(2) if match else None
            if inline_text:
                chunks.append(inline_text)
            continue
        if current_id and line:
            chunks.append(line)
    flush()
    return result


def synthesize(line_id: str, text: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="vaibik-") as temp_dir:
        wav_path = Path(temp_dir) / f"{line_id}.wav"
        subprocess.run(
            [
                sys.executable,
                "-m",
                "piper",
                "--model",
                str(MODEL),
                "--output_file",
                str(wav_path),
                "--length_scale",
                "1.02",
                "--sentence_silence",
                "0.18",
            ],
            input=text,
            text=True,
            encoding="utf-8",
            check=True,
        )
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(wav_path),
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "96k",
                str(destination),
            ],
            check=True,
        )
    print(f"✓ {line_id} → {destination.relative_to(ROOT)}")


def generate_test() -> None:
    for line_id, text in TEST_LINES.items():
        synthesize(line_id, text, OUTPUT_DIR / "test" / f"{line_id}.mp3")
    print(f"\nГотово: {len(TEST_LINES)} тестовых MP3")


def generate_all() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    expected_ids = set(manifest)
    script = find_voice_script()
    if script is None:
        raise SystemExit(
            "VAIBIK_VOICE_SCRIPT.txt или VAIBIK_REPLIQUES.txt не найден. "
            "Положите исходный сценарий "
            f"в корень проекта ({ROOT}) и повторите npm run voice:generate."
        )

    lines = parse_voice_script(script, expected_ids)
    missing_text = sorted(expected_ids - lines.keys())
    if missing_text:
        print("В сценарии не найдены тексты для ID:", file=sys.stderr)
        for line_id in missing_text:
            print(f"  - {line_id}", file=sys.stderr)
        raise SystemExit(
            "Генерация остановлена: тексты не выдумываются автоматически."
        )

    for line_id, relative_url in manifest.items():
        destination = ROOT / "public" / relative_url.lstrip("/")
        synthesize(line_id, lines[line_id], destination)
    print(f"\nГотово: {len(lines)} игровых MP3 из {script.relative_to(ROOT)}")


def main() -> None:
    if not MODEL.is_file():
        raise SystemExit("Сначала запустите npm run voice:setup")
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    if mode == "test":
        generate_test()
    elif mode == "all":
        generate_all()
    else:
        raise SystemExit("Режим должен быть test или all")


if __name__ == "__main__":
    main()
