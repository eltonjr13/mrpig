import { z } from "zod";

export const buildOptionSchema = z.object({
  id: z.union([z.literal("A"), z.literal("B"), z.literal("C")]),
  title: z.string(),
  scenario: z.string(),
  itemPath: z.array(z.string()),
  rationale: z.string(),
});

export const insightTagSchema = z.union([
  z.literal("lane agressiva"),
  z.literal("troca curta"),
  z.literal("troca longa ruim"),
  z.literal("pico no nivel 6"),
  z.literal("cuidado com burst AP"),
  z.literal("front-to-back favoravel"),
  z.literal("time inimigo com engage forte"),
]);

export const pregameAnalysisSchema = z.object({
  matchupOverview: z.string(),
  laneRiskScore: z.number().min(0).max(100),
  laneRiskLabel: z.union([z.literal("baixo"), z.literal("medio"), z.literal("alto")]),
  enemyDamageProfile: z.string(),
  powerSpikes: z.array(z.string()),
  tags: z.array(insightTagSchema),
  contextualAlerts: z.array(z.string()),
  buildOptions: z.array(buildOptionSchema).min(2).max(3),
});
