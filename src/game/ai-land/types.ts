export type QuestStage =
  | "intro"
  | "talk"
  | "challenge"
  | "result"
  | "reward"
  | "done";

export interface AiLandProgress {
  stage: QuestStage;
  xp: number;
  badges: string[];
}

export interface AiLandGameCallbacks {
  onRobotInteraction: () => void;
  onBridgeReached: () => void;
}

export interface AiLandGameHandle {
  destroy: () => void;
  setMoveLeft: (active: boolean) => void;
  setMoveRight: (active: boolean) => void;
  interact: () => void;
  setPaused: (paused: boolean) => void;
  openBridge: () => void;
}
