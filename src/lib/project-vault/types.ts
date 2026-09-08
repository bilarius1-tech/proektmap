export type VaultCapsuleStatus = "draft" | "published";

export type VaultCapsuleCard = {
  slug: string;
  name: string;
  tagline: string;
  sourceUrl: string;
  dnaVersion: string;
  stackLabels: string[];
  aiFlags: {
    harness: boolean;
    loop: boolean;
    graph: boolean;
  };
  status: VaultCapsuleStatus;
  accent?: string;
  seoTitle: string;
  seoDescription: string;
};

export type VaultDnaSection = {
  id: string;
  title: string;
  summary: string;
  paths: string[];
};

export type VaultCapsule = VaultCapsuleCard & {
  derivedFrom: string | null;
  longSummary: string[];
  dnaSections: VaultDnaSection[];
  snapshotHighlights: string[];
  reusablePatterns: string[];
  arsenalCandidates: { title: string; reason: string }[];
  packageRoot: string;
  manifestPath: string;
  links: {
    agentEngineering: string;
    aiSkills: string;
    arsenal: string;
    decisions?: string;
  };
};

export type VaultTrackMeta = {
  title: string;
  href: string;
  tagline: string;
  valueProp: string;
  afterTrack: string[];
};
