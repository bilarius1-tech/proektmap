"use client";

import { useState } from "react";
import FirstPrompt from "@/components/vaibik/first-prompt";
import MiniGame from "@/components/vaibik/mini-game";
import MissionFinal from "@/components/vaibik/mission-final";
import MissionIteration from "@/components/vaibik/mission-iteration";
import MissionStart from "@/components/vaibik/mission-start";
import ProgramVibeCraft from "@/components/vaibik/program-vibecraft";
import QuestIntro from "@/components/vaibik/quest-intro";
import WhatIsAiLab from "@/components/vaibik/what-is-ai-lab";

type Stage =
  | "intro"
  | "splash"
  | "lab"
  | "prompt"
  | "game"
  | "program"
  | "iteration"
  | "final";

export default function Quest() {
  const [stage, setStage] = useState<Stage>("intro");
  const [themeId, setThemeId] = useState<string>("space");
  const [actionId, setActionId] = useState<string>("stars");

  if (stage === "intro") {
    return <QuestIntro onStart={() => setStage("splash")} />;
  }

  if (stage === "splash") {
    return <MissionStart onStart={() => setStage("lab")} />;
  }

  if (stage === "lab") {
    return (
      <WhatIsAiLab
        onComplete={(t, a) => {
          setThemeId(t);
          setActionId(a);
          setStage("prompt");
        }}
      />
    );
  }

  if (stage === "prompt") {
    return (
      <FirstPrompt
        themeId={themeId}
        actionId={actionId}
        onComplete={() => setStage("game")}
      />
    );
  }

  if (stage === "program") {
    return (
      <ProgramVibeCraft
        themeId={themeId}
        actionId={actionId}
        onComplete={() => setStage("iteration")}
      />
    );
  }

  if (stage === "iteration") {
    return (
      <MissionIteration
        themeId={themeId}
        actionId={actionId}
        onComplete={() => setStage("final")}
      />
    );
  }

  if (stage === "final") {
    return <MissionFinal />;
  }

  return (
    <MiniGame
      themeId={themeId}
      actionId={actionId}
      onComplete={() => setStage("program")}
    />
  );
}
