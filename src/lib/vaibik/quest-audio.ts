"use client";

import { hasVaibikAudio } from "@/lib/audio/vaibik-audio";
import {
  playVoice,
  stopVoice,
  vaibikAudioManager,
} from "@/lib/audio/vaibik-audio-manager";
import { LINE_TEXT } from "@/lib/vaibik/quest-lines";

/**
 * Голос Вайбика (MP3 + запасной Web Speech API), фоновая космическая музыка и звуковые
 * эффекты. Управление разделено на два независимых канала:
 *  - «звук» (SOUND_KEY) — голос Вайбика и звуковые эффекты;
 *  - «музыка» (MUSIC_KEY) — фоновая космическая музыка.
 * Аудио (музыка) стартует только после первого взаимодействия пользователя
 * (unlock). Пока оба канала выключены, всё молчит.
 */

const SOUND_KEY = "vaibik-sound";
const MUSIC_KEY = "vaibik-music";

let enabled = true;
let musicEnabled = true;
let unlocked = false;
let ctx: AudioContext | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;

type Listener = (enabled: boolean) => void;
const soundListeners = new Set<Listener>();
const musicListeners = new Set<Listener>();

// ── Защита AudioParam от невалидных значений ───────────────────────
// Браузер выбрасывает Runtime TypeError "The provided float value is
// non-finite", если в AudioParam попадает NaN или бесконечность. Ниже —
// безопасные обёртки, которые нормализуют/отбрасывают невалидные числа,
// чтобы такое значение физически не могло попасть в AudioParam.

/** Приводит значение к конечному числу; невалидные числа → 0. */
function toFinite(value: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** Безопасная запись param.value (прямое присваивание). */
function setParamValue(param: AudioParam, value: number): void {
  param.value = toFinite(value);
}

/** Безопасный param.setValueAtTime. */
function setParamAt(param: AudioParam, value: number, time: number): void {
  if (!Number.isFinite(time)) return;
  param.setValueAtTime(toFinite(value), time);
}

/** Безопасный param.linearRampToValueAtTime. */
function linearParamAt(param: AudioParam, value: number, time: number): void {
  if (!Number.isFinite(time)) return;
  param.linearRampToValueAtTime(toFinite(value), time);
}

/** Безопасный param.exponentialRampToValueAtTime (цель строго > 0). */
function expoParamAt(param: AudioParam, value: number, time: number): void {
  if (!Number.isFinite(time)) return;
  const v = toFinite(value);
  param.exponentialRampToValueAtTime(v > 0 ? v : 0.001, time);
}

// ── Единый голос Вайбика ──────────────────────────────────────────
// Вайбик всегда говорит одним русским голосом: предпочитаем женский
// русский голос (например, «Irina»), иначе — первый доступный русский.

function getRussianVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window))
    return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("ru"));
}

function pickRussianVoice(): SpeechSynthesisVoice | null {
  const ru = getRussianVoices();
  if (ru.length === 0) return null;
  const preferred = ru.find((v) =>
    /irina|milena|alena|alyona|alya|tatyana|tatiana|katya|katia|polina|arina|daria|darya|svetlana|maria|masha|olga|anna/i.test(
      v.name
    )
  );
  return preferred ?? ru[0];
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  sfxGain = ctx.createGain();
  setParamValue(sfxGain.gain, enabled ? 0.5 : 0);
  sfxGain.connect(ctx.destination);
  musicGain = ctx.createGain();
  setParamValue(musicGain.gain, musicEnabled ? 0.35 : 0);
  musicGain.connect(ctx.destination);
  return ctx;
}

export function isEnabled(): boolean {
  return enabled;
}

export function isMusicEnabled(): boolean {
  return musicEnabled;
}

export function isUnlocked(): boolean {
  return unlocked;
}

/** Вызывается при первом взаимодействии пользователя. */
export function unlock(): void {
  if (typeof window === "undefined") return;
  const first = !unlocked;
  unlocked = true;
  const c = getCtx();
  if (c && c.state === "suspended") void c.resume();
  if (first && c) {
    if (enabled && sfxGain) {
      sfxGain.gain.cancelScheduledValues(c.currentTime);
      setParamAt(sfxGain.gain, 0.001, c.currentTime);
      linearParamAt(sfxGain.gain, 0.5, c.currentTime + 1.2);
    }
    if (musicEnabled && musicGain) {
      musicGain.gain.cancelScheduledValues(c.currentTime);
      setParamAt(musicGain.gain, 0.001, c.currentTime);
      linearParamAt(musicGain.gain, 0.35, c.currentTime + 1.2);
    }
  }
  // Разблокируем HTMLAudio в жесте пользователя (иначе MP3 из useEffect → NotAllowed → TTS).
  void unlockHtmlAudio().then(() => flushPendingSpeech());
  if (musicEnabled) startMusic();
}

type PendingSpeech = { text: string; onEnd?: () => void; lineId?: string };
let pendingSpeech: PendingSpeech | null = null;

function flushPendingSpeech(): void {
  if (!pendingSpeech || !unlocked) return;
  const next = pendingSpeech;
  pendingSpeech = null;
  speakNow(next.text, next.onEnd, next.lineId);
}

async function unlockHtmlAudio(): Promise<void> {
  try {
    await vaibikAudioManager.unlockPlayback();
  } catch {
    // ignore
  }
}

export function toggleEnabled(): boolean {
  setEnabled(!enabled);
  return enabled;
}

export function toggleMusic(): boolean {
  setMusicEnabled(!musicEnabled);
  return musicEnabled;
}

function store(key: string, value: boolean): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value ? "1" : "0");
    }
  } catch {
    // ignore storage errors
  }
}

export function setEnabled(value: boolean): void {
  if (enabled === value) return;
  enabled = value;
  store(SOUND_KEY, value);
  const c = ctx;
  if (c && sfxGain) {
    if (value) {
      if (c.state === "suspended") void c.resume();
      sfxGain.gain.cancelScheduledValues(c.currentTime);
      setParamAt(sfxGain.gain, 0.001, c.currentTime);
      linearParamAt(sfxGain.gain, 0.5, c.currentTime + 0.5);
    } else {
      sfxGain.gain.cancelScheduledValues(c.currentTime);
      setParamAt(sfxGain.gain, sfxGain.gain.value, c.currentTime);
      linearParamAt(sfxGain.gain, 0.001, c.currentTime + 0.3);
      stopSpeak();
    }
  }
  soundListeners.forEach((l) => l(value));
}

export function setMusicEnabled(value: boolean): void {
  if (musicEnabled === value) return;
  musicEnabled = value;
  store(MUSIC_KEY, value);
  const c = ctx;
  if (c && musicGain) {
    if (value) {
      if (c.state === "suspended") void c.resume();
      musicGain.gain.cancelScheduledValues(c.currentTime);
      setParamAt(musicGain.gain, 0.001, c.currentTime);
      linearParamAt(musicGain.gain, 0.35, c.currentTime + 0.6);
      startMusic();
    } else {
      musicGain.gain.cancelScheduledValues(c.currentTime);
      setParamAt(musicGain.gain, musicGain.gain.value, c.currentTime);
      linearParamAt(musicGain.gain, 0.001, c.currentTime + 0.4);
      stopMusic();
    }
  }
  musicListeners.forEach((l) => l(value));
}

export function subscribeSound(listener: Listener): () => void {
  soundListeners.add(listener);
  return () => soundListeners.delete(listener);
}

export function subscribeMusic(listener: Listener): () => void {
  musicListeners.add(listener);
  return () => musicListeners.delete(listener);
}

export function readStoredPreference(): boolean {
  return readStored(SOUND_KEY);
}

export function readStoredMusicPreference(): boolean {
  return readStored(MUSIC_KEY);
}

function readStored(key: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = window.localStorage.getItem(key);
    if (v === null) return true;
    return v === "1";
  } catch {
    return true;
  }
}

function blip(
  freq: number,
  duration: number,
  type: OscillatorType,
  volume = 0.2
) {
  if (!ctx || !sfxGain) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  setParamAt(osc.frequency, freq, now);
  setParamAt(gain.gain, 0.0001, now);
  expoParamAt(gain.gain, volume, now + 0.015);
  expoParamAt(gain.gain, 0.001, now + duration);
  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(now);
  osc.stop(now + duration + 0.02);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

export function playClick(): void {
  unlock();
  if (!enabled || !ctx) return;
  blip(360, 0.09, "square", 0.12);
}

export function playPop(): void {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  setParamAt(osc.frequency, 520, now);
  expoParamAt(osc.frequency, 880, now + 0.14);
  setParamAt(gain.gain, 0.16, now);
  expoParamAt(gain.gain, 0.001, now + 0.16);
  osc.connect(gain);
  gain.connect(sfxGain!);
  osc.start(now);
  osc.stop(now + 0.18);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

export function playWin(): void {
  if (!enabled || !ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const now = ctx!.currentTime + i * 0.12;
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = "triangle";
    setParamAt(osc.frequency, freq, now);
    setParamAt(gain.gain, 0.0001, now);
    expoParamAt(gain.gain, 0.18, now + 0.02);
    expoParamAt(gain.gain, 0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(sfxGain!);
    osc.start(now);
    osc.stop(now + 0.34);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  });
}

export function playError(): void {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  setParamAt(osc.frequency, 220, now);
  expoParamAt(osc.frequency, 110, now + 0.25);
  setParamAt(gain.gain, 0.15, now);
  expoParamAt(gain.gain, 0.001, now + 0.3);
  osc.connect(gain);
  gain.connect(sfxGain!);
  osc.start(now);
  osc.stop(now + 0.32);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

const PAD_NOTES = [220, 261.63, 329.63, 392, 440, 523.25, 659.25];
// ВАЖНО: индексы ниже обязаны указывать на существующие элементы PAD_NOTES
// (0..PAD_NOTES.length-1). Иначе freq станет undefined, а присваивание
// undefined в AudioParam.value приведёт к ошибке "float value is non-finite".
const CHORDS = [
  [0, 2, 4],
  [3, 5, 6],
  [1, 3, 5],
  [2, 4, 6],
];

function padNote(freq: number, detune: number) {
  if (!ctx || !musicGain) return;
  // Защита от невалидных (NaN/бесконечность) значений AudioParam: такие
  // значения недопустимы и выбрасывают Runtime TypeError в браузере.
  if (!Number.isFinite(freq) || !Number.isFinite(detune)) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  setParamValue(filter.frequency, 800);
  osc.type = "sine";
  setParamValue(osc.frequency, freq);
  setParamValue(osc.detune, detune);
  setParamAt(gain.gain, 0.0001, now);
  expoParamAt(gain.gain, 0.05, now + 1.6);
  expoParamAt(gain.gain, 0.001, now + 5);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(musicGain);
  osc.start(now);
  osc.stop(now + 5.2);
  osc.onended = () => {
    osc.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

function playPadLayer() {
  if (!ctx || !musicEnabled) return;
  const chord = CHORDS[Math.floor(Math.random() * CHORDS.length)];
  chord.forEach((offset) => {
    padNote(PAD_NOTES[offset], Math.random() * 8 - 4);
    padNote(PAD_NOTES[offset] * 2, Math.random() * 10 - 5);
  });
}

function startMusic() {
  if (musicTimer !== null || !ctx || !musicEnabled) return;
  playPadLayer();
  musicTimer = window.setInterval(() => {
    if (!musicEnabled) return;
    playPadLayer();
  }, 3000);
}

function stopMusic() {
  if (musicTimer !== null) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

/** По тексту реплики найти id для MP3 (если есть точное совпадение). */
function findLineIdByText(text: string): string | null {
  const needle = text.trim();
  for (const [id, value] of Object.entries(LINE_TEXT)) {
    if (value === needle) return id;
  }
  return null;
}

/**
 * Озвучивание реплики Вайбика.
 * MP3 из /audio/vaibik/ — основной голос. Браузерный TTS — только если файла нет.
 */
export function speak(text: string, onEnd?: () => void, lineId?: string): void {
  if (!enabled || typeof window === "undefined") {
    onEnd?.();
    return;
  }
  if (!unlocked) {
    pendingSpeech = { text, onEnd, lineId };
    return;
  }
  speakNow(text, onEnd, lineId);
}

function speakNow(text: string, onEnd?: () => void, lineId?: string): void {
  const id = lineId || findLineIdByText(text);
  if (id && hasVaibikAudio(id)) {
    // Есть файл — не откатываемся на TTS (иначе слышен только «браузерный» голос).
    void playVoice(id, text, onEnd).then((ok) => {
      if (!ok) {
        // play() до разблокировки HTMLAudio — повторим после unlock().
        pendingSpeech = { text, onEnd, lineId: id };
      }
    });
    return;
  }
  speakWithBrowserTts(text, onEnd);
}

/** Явно озвучить реплику по ключу (предпочтительно MP3). */
export function speakLine(lineId: string, onEnd?: () => void): void {
  const text = LINE_TEXT[lineId] ?? "";
  speak(text, onEnd, lineId);
}

function speakWithBrowserTts(text: string, onEnd?: () => void): void {
  if (!("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  const assignVoice = () => {
    const ru = pickRussianVoice();
    if (ru) utterance.voice = ru;
  };
  if (onEnd) utterance.onend = onEnd;
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = () => {
      synth.onvoiceschanged = null;
      assignVoice();
      synth.speak(utterance);
    };
    return;
  }
  assignVoice();
  synth.speak(utterance);
}

export function stopSpeak(): void {
  if (typeof window === "undefined") return;
  pendingSpeech = null;
  window.speechSynthesis?.cancel();
  stopVoice({ silent: true });
}
