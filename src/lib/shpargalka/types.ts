export type PackStatus = "published" | "soon";

export type PackIconName =
  | "Code"
  | "Palette"
  | "Megaphone"
  | "PenLine"
  | "Table"
  | "Briefcase"
  | "GraduationCap"
  | "Users"
  | "Rocket"
  | "Globe"
  | "Scale"
  | "Calculator"
  | "Newspaper"
  | "LineChart"
  | "BookOpen"
  | "HeartHandshake";

export interface ShpargalkaWriteRule {
  bad: string;
  good: string;
  why: string;
}

export interface ShpargalkaExample {
  before: string;
  after: string;
}

export interface ShpargalkaPack {
  slug: string;
  title: string;
  profession: string;
  icon: PackIconName;
  summary: string;
  status: PackStatus;
  tasks: string[];
  howToWrite: ShpargalkaWriteRule;
  example: ShpargalkaExample;
}

export interface ShpargalkaPrompt {
  id: string;
  pack: string;
  title: string;
  task: string;
  body: string;
  why: string;
  bad?: string;
  relatedHref?: string;
  relatedLabel?: string;
}
