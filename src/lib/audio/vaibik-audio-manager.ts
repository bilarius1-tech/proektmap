import {
  getIterationPlayId,
  getLabActionPromptId,
  getLabDoneId,
  hasVaibikAudio,
  VAIBIK_AUDIO,
  type VaibikAction,
  type VaibikAudioId,
  type VaibikIterationItem,
  type VaibikTheme,
} from "./vaibik-audio";
import { getQuestLineText } from "../quest-lines";

const MUTED_KEY = "vaibik_voice_muted";
const VOLUME_KEY = "vaibik_voice_volume";

export type VaibikVoiceState = {
  id: VaibikAudioId | null;
  subtitle: string | null;
  status: "idle" | "loading" | "playing" | "paused";
  muted: boolean;
  volume: number;
};

type Listener = (state: VaibikVoiceState) => void;

class VaibikAudioManager {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private settingsLoaded = false;
  private state: VaibikVoiceState = {
    id: null,
    subtitle: null,
    status: "idle",
    muted: false,
    volume: 1,
  };

  private ensureAudio(): HTMLAudioElement | null {
    if (typeof Audio === "undefined") return null;
    this.loadSettings();
    if (this.audio) return this.audio;

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = this.state.volume;
    audio.muted = this.state.muted;
    audio.addEventListener("ended", this.finish);
    audio.addEventListener("error", this.handleError);
    this.audio = audio;
    return audio;
  }

  private loadSettings() {
    if (this.settingsLoaded || typeof window === "undefined") return;
    this.settingsLoaded = true;
    try {
      const muted = localStorage.getItem(MUTED_KEY);
      const volume = Number(localStorage.getItem(VOLUME_KEY));
      this.state = {
        ...this.state,
        muted: muted === "true",
        volume: Number.isFinite(volume) ? clampVolume(volume) : 1,
      };
    } catch {
      // Недоступный localStorage не должен мешать игре.
    }
  }

  private persistSettings() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(MUTED_KEY, String(this.state.muted));
      localStorage.setItem(VOLUME_KEY, String(this.state.volume));
    } catch {
      // Настройки продолжат работать до перезагрузки.
    }
  }

  private update(patch: Partial<VaibikVoiceState>) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener(this.state);
  }

  private finish = () => {
    this.update({ id: null, subtitle: null, status: "idle" });
  };

  private handleError = () => {
    if (process.env.NODE_ENV === "development" && this.state.id) {
      console.warn(`[VaibikAudio] Не удалось загрузить: ${this.state.id}`);
    }
    this.finish();
  };

  subscribe(listener: Listener) {
    this.loadSettings();
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): VaibikVoiceState {
    return this.state;
  }

  async playVoice(id: VaibikAudioId | string, subtitle?: string) {
    if (!hasVaibikAudio(id)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[VaibikAudio] Неизвестный audio ID: ${id}`);
      }
      return false;
    }

    const audio = this.ensureAudio();
    if (!audio) return false;
    this.stopVoice();
    audio.src = VAIBIK_AUDIO[id];
    audio.currentTime = 0;
    const resolvedSubtitle = subtitle ?? getQuestLineText(id);
    this.update({
      id,
      subtitle: resolvedSubtitle.trim() || null,
      status: "loading",
    });

    try {
      await audio.play();
      if (this.state.id === id) this.update({ status: "playing" });
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[VaibikAudio] Воспроизведение ${id} заблокировано или недоступно`,
          error,
        );
      }
      if (this.state.id === id) this.finish();
      return false;
    }
  }

  stopVoice() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
    }
    if (this.state.status !== "idle") this.finish();
  }

  pauseVoice() {
    if (!this.audio || this.audio.paused || this.state.status === "idle") return;
    this.audio.pause();
    this.update({ status: "paused" });
  }

  async resumeVoice() {
    if (!this.audio || this.state.status !== "paused") return false;
    try {
      await this.audio.play();
      this.update({ status: "playing" });
      return true;
    } catch {
      return false;
    }
  }

  setVoiceVolume(value: number) {
    const volume = clampVolume(value);
    if (this.audio) this.audio.volume = volume;
    this.update({ volume });
    this.persistSettings();
  }

  muteVoice() {
    if (this.audio) this.audio.muted = true;
    this.update({ muted: true });
    this.persistSettings();
  }

  unmuteVoice() {
    if (this.audio) this.audio.muted = false;
    this.update({ muted: false });
    this.persistSettings();
  }

  isPlaying() {
    return this.state.status === "playing";
  }

  preloadVoice(id: VaibikAudioId) {
    if (typeof document === "undefined") return;
    const selector = `link[data-vaibik-audio="${CSS.escape(id)}"]`;
    if (document.head.querySelector(selector)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "audio";
    link.href = VAIBIK_AUDIO[id];
    link.dataset.vaibikAudio = id;
    document.head.appendChild(link);
  }

  playLabActionPrompt(theme: VaibikTheme, subtitle?: string) {
    return this.playVoice(getLabActionPromptId(theme), subtitle);
  }

  playLabDone(
    theme: VaibikTheme,
    action: VaibikAction,
    subtitle?: string,
  ) {
    return this.playVoice(getLabDoneId(theme, action), subtitle);
  }

  playIterationPlay(item: VaibikIterationItem, subtitle?: string) {
    return this.playVoice(getIterationPlayId(item), subtitle);
  }
}

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 1));
}

export const vaibikAudioManager = new VaibikAudioManager();

export const playVoice = vaibikAudioManager.playVoice.bind(vaibikAudioManager);
export const stopVoice = vaibikAudioManager.stopVoice.bind(vaibikAudioManager);
export const pauseVoice = vaibikAudioManager.pauseVoice.bind(vaibikAudioManager);
export const resumeVoice =
  vaibikAudioManager.resumeVoice.bind(vaibikAudioManager);
export const setVoiceVolume =
  vaibikAudioManager.setVoiceVolume.bind(vaibikAudioManager);
export const muteVoice = vaibikAudioManager.muteVoice.bind(vaibikAudioManager);
export const unmuteVoice =
  vaibikAudioManager.unmuteVoice.bind(vaibikAudioManager);
