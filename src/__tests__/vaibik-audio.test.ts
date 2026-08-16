import { describe, expect, it } from "vitest";
import { getQuestLineText } from "@/lib/quest-lines";
import {
  getIterationPlayId,
  getLabActionPromptId,
  getLabDoneId,
  VAIBIK_AUDIO,
} from "@/lib/audio/vaibik-audio";

describe("локальная озвучка Вайбика", () => {
  it("связывает каждый ID с одноимённым MP3 и субтитром", () => {
    expect(Object.keys(VAIBIK_AUDIO)).toHaveLength(48);
    for (const [id, path] of Object.entries(VAIBIK_AUDIO)) {
      expect(path).toBe(`/audio/vaibik/${id}.mp3`);
      expect(getQuestLineText(id as keyof typeof VAIBIK_AUDIO)).not.toBe("");
    }
  });

  it("строит ID динамических реплик", () => {
    expect(getLabActionPromptId("space")).toBe("lab.action.prompt.space");
    expect(getLabDoneId("dino", "aliens")).toBe(
      "lab.done.dino.aliens",
    );
    expect(getIterationPlayId("crystals")).toBe(
      "iteration.play.crystals",
    );
  });
});
