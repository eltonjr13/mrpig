export type InsightTag =
  | "lane agressiva"
  | "troca curta"
  | "troca longa ruim"
  | "pico no nivel 6"
  | "cuidado com burst AP"
  | "front-to-back favoravel"
  | "time inimigo com engage forte";

export interface BuildOption {
  id: "A" | "B" | "C";
  title: string;
  scenario: string;
  itemPath: string[];
  rationale: string;
}

export interface PregameAnalysis {
  matchupOverview: string;
  laneRiskScore: number;
  laneRiskLabel: "baixo" | "medio" | "alto";
  enemyDamageProfile: string;
  powerSpikes: string[];
  tags: InsightTag[];
  contextualAlerts: string[];
  buildOptions: BuildOption[];
}

export interface LiveAnalysis {
  gameStateSummary: string;
  macroAlerts: string[];
  tags: InsightTag[];
  buildPathFocus: BuildOption["id"];
  compositionalRead: string;
}

export interface PostGameCoachReport {
  summary: string;
  positives: string[];
  improvementPoints: string[];
  likelyErrorPatterns: string[];
  buildReview: string;
  nextGameSuggestions: string[];
}
