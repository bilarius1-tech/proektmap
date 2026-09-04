export type AgentModuleSlug = "harness" | "loop" | "graph";

export type DriveCatchPair = {
  drive: string;
  catch: string;
  example?: string;
};

export type ChecklistItem = {
  label: string;
  hint?: string;
};

export type PromptExample = {
  level: "новичок" | "средний вайбкодер";
  title: string;
  prompt: string;
};

export type ArsenalLink = {
  label: string;
  href: string;
  note?: string;
};

export type AgentModule = {
  slug: AgentModuleSlug;
  order: number;
  enLabel: string;
  title: string;
  shortTitle: string;
  summary: string;
  heroLead: string;
  accent: string;
  whatItIs: string[];
  driveCatchTitle: string;
  driveCatch: DriveCatchPair[];
  parts: { name: string; role: string }[];
  checklist: ChecklistItem[];
  prompts: PromptExample[];
  definitionOfDone: string[];
  artifact: string;
  afterTrackAnswers: string[];
  arsenalLinks: ArsenalLink[];
  nextSlug: AgentModuleSlug | null;
  seoTitle: string;
  seoDescription: string;
};

export type TrackMeta = {
  title: string;
  href: string;
  tagline: string;
  valueProp: string;
  afterTrack: string[];
};
