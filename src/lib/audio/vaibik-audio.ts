import manifest from "./vaibik-audio-manifest.json";

export const VAIBIK_AUDIO = manifest;

export type VaibikAudioId = keyof typeof VAIBIK_AUDIO;
export type VaibikTheme = "space" | "dino" | "cat";
export type VaibikAction = "stars" | "aliens" | "score";
export type VaibikIterationItem = "stars" | "crystals" | "coins";

export function hasVaibikAudio(id: string): id is VaibikAudioId {
  return Object.hasOwn(VAIBIK_AUDIO, id);
}

export function getLabActionPromptId(
  theme: VaibikTheme,
): VaibikAudioId {
  return `lab.action.prompt.${theme}` as VaibikAudioId;
}

export function getLabDoneId(
  theme: VaibikTheme,
  action: VaibikAction,
): VaibikAudioId {
  return `lab.done.${theme}.${action}` as VaibikAudioId;
}

export function getIterationPlayId(
  item: VaibikIterationItem,
): VaibikAudioId {
  return `iteration.play.${item}` as VaibikAudioId;
}
