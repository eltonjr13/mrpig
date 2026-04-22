import type {
  BuildOption,
  InsightTag,
  LiveAnalysis,
  PregameAnalysis,
} from "@/types/analysis";
import type { NormalizedLiveState } from "@/types/live-client";

export interface PregameAnalysisInput {
  userChampion: string;
  enemyChampion: string;
  lane: string;
  allyComp: string[];
  enemyComp: string[];
}

export interface LiveAnalysisInput {
  liveState: NormalizedLiveState;
  pregameAnalysis: PregameAnalysis;
}

const laneCounterAdjustments: Record<string, number> = {
  "Camille:Renekton": 20,
  "Fiora:Malphite": 15,
  "Azir:Zed": 18,
  "Yasuo:Annie": 12,
  "Jinx:Caitlyn": 10,
};

const championDamageProfile: Record<string, "AD" | "AP" | "MISTO"> = {
  Ahri: "AP",
  Annie: "AP",
  Azir: "AP",
  Caitlyn: "AD",
  Camille: "AD",
  Fiora: "AD",
  Jinx: "AD",
  Leona: "AP",
  Malphite: "AP",
  Ornn: "AP",
  Renekton: "AD",
  Sejuani: "AP",
  Sylas: "AP",
  Vi: "AD",
  Yasuo: "AD",
  Zed: "AD",
};

const levelSixSpikeChampions = new Set([
  "Annie",
  "Azir",
  "Malphite",
  "Renekton",
  "Sylas",
  "Vi",
  "Zed",
]);

const engageChampions = new Set(["Leona", "Malphite", "Ornn", "Sejuani", "Vi"]);

function getCounterKey(userChampion: string, enemyChampion: string) {
  return `${userChampion}:${enemyChampion}`;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function riskLabel(score: number): PregameAnalysis["laneRiskLabel"] {
  if (score >= 67) {
    return "alto";
  }
  if (score >= 40) {
    return "medio";
  }
  return "baixo";
}

function detectEnemyDamageProfile(enemyComp: string[]) {
  const distribution = enemyComp.reduce(
    (acc, champion) => {
      const profile = championDamageProfile[champion] ?? "MISTO";
      if (profile === "AD") {
        acc.ad += 1;
      } else if (profile === "AP") {
        acc.ap += 1;
      } else {
        acc.mixed += 1;
      }
      return acc;
    },
    { ad: 0, ap: 0, mixed: 0 },
  );

  if (distribution.ap >= 3) {
    return "predominante AP";
  }
  if (distribution.ad >= 3) {
    return "predominante AD";
  }
  return "misto";
}

function hasStrongEnemyEngage(enemyComp: string[]) {
  return enemyComp.filter((champion) => engageChampions.has(champion)).length >= 2;
}

function getBuildOptions(
  laneRiskScore: number,
  enemyDamageProfile: string,
): BuildOption[] {
  const defensiveOption: BuildOption = {
    id: "A",
    title: "Rota defensiva",
    scenario: "Quando o inicio da lane estiver sob pressao",
    itemPath: ["Item de lane seguro", "Resistencia situacional", "Poder utilitario"],
    rationale:
      "Reduz risco de troca desfavoravel e melhora consistencia para entrar no mid game.",
  };

  const balancedOption: BuildOption = {
    id: "B",
    title: "Rota balanceada",
    scenario: "Quando o estado da lane estiver neutro",
    itemPath: ["Item core", "Segundo item flexivel", "Upgrade de dano sustentado"],
    rationale:
      "Mantem curva de poder estavel sem comprometer leitura de luta front-to-back.",
  };

  const scalingOption: BuildOption = {
    id: "C",
    title: "Rota de escala",
    scenario: "Quando a composicao aliada joga para teamfights longas",
    itemPath: ["Item de escala", "Sinergia de teamfight", "Pico tardio"],
    rationale:
      "Prioriza impacto no jogo medio/tardio quando a partida tende a desacelerar.",
  };

  if (laneRiskScore >= 65 || enemyDamageProfile === "predominante AP") {
    return [defensiveOption, balancedOption, scalingOption];
  }

  return [balancedOption, scalingOption, defensiveOption];
}

function getTags(input: PregameAnalysisInput, riskScore: number, enemyProfile: string): InsightTag[] {
  const tags: InsightTag[] = [];

  if (riskScore >= 65) {
    tags.push("lane agressiva");
    tags.push("troca longa ruim");
  } else {
    tags.push("troca curta");
  }

  if (
    levelSixSpikeChampions.has(input.userChampion) ||
    levelSixSpikeChampions.has(input.enemyChampion)
  ) {
    tags.push("pico no nivel 6");
  }

  if (enemyProfile === "predominante AP") {
    tags.push("cuidado com burst AP");
  }

  if (hasStrongEnemyEngage(input.enemyComp)) {
    tags.push("time inimigo com engage forte");
  } else {
    tags.push("front-to-back favoravel");
  }

  return [...new Set(tags)].slice(0, 6);
}

function buildMatchupOverview(input: PregameAnalysisInput, riskScore: number) {
  if (riskScore >= 65) {
    return `${input.userChampion} vs ${input.enemyChampion} tende a ser lane de alto risco nos primeiros niveis.`;
  }
  if (riskScore >= 40) {
    return `${input.userChampion} vs ${input.enemyChampion} indica matchup equilibrado com janelas curtas de troca.`;
  }
  return `${input.userChampion} vs ${input.enemyChampion} tem fase de lane relativamente controlavel se o plano de escala for mantido.`;
}

export function buildPregameAnalysis(input: PregameAnalysisInput): PregameAnalysis {
  const baseRisk = 50;
  const counterAdjustment = laneCounterAdjustments[getCounterKey(input.userChampion, input.enemyChampion)] ?? 0;
  const laneAdjustment = input.lane === "top" ? 5 : input.lane === "mid" ? 3 : 0;
  const engageAdjustment = hasStrongEnemyEngage(input.enemyComp) ? 8 : 0;

  const laneRiskScore = clampScore(baseRisk + counterAdjustment + laneAdjustment + engageAdjustment);
  const enemyDamageProfile = detectEnemyDamageProfile(input.enemyComp);
  const buildOptions = getBuildOptions(laneRiskScore, enemyDamageProfile);
  const tags = getTags(input, laneRiskScore, enemyDamageProfile);

  const contextualAlerts = [
    laneRiskScore >= 60
      ? "Lane desfavoravel nos niveis iniciais; priorize trocas de baixo comprometimento."
      : "A lane permite pressao moderada, desde que o recurso principal seja preservado.",
    enemyDamageProfile === "predominante AP"
      ? "Prefira rota de item defensiva nesta partida contra dano magico concentrado."
      : "Distribuicao de dano inimiga mais estavel, com margem para build flexivel.",
    hasStrongEnemyEngage(input.enemyComp)
      ? "Time inimigo possui engage forte; valorize posicionamento para fights longas."
      : "Sua composicao pode jogar front-to-back com boa consistencia.",
  ];

  return {
    matchupOverview: buildMatchupOverview(input, laneRiskScore),
    laneRiskScore,
    laneRiskLabel: riskLabel(laneRiskScore),
    enemyDamageProfile,
    powerSpikes: [
      "Nivel 6 para ultimates chave",
      "Primeiro item completo",
      "Dois itens para lutas de objetivo",
    ],
    tags,
    contextualAlerts,
    buildOptions,
  };
}

export function buildLiveAnalysis(input: LiveAnalysisInput): LiveAnalysis {
  const enemyLevels = input.liveState.enemyTeam.map((player) => player.level);
  const allyLevels = input.liveState.allyTeam.map((player) => player.level);
  const averageEnemyLevel =
    enemyLevels.length > 0
      ? enemyLevels.reduce((total, level) => total + level, 0) / enemyLevels.length
      : 0;
  const averageAllyLevel =
    allyLevels.length > 0
      ? allyLevels.reduce((total, level) => total + level, 0) / allyLevels.length
      : 0;

  const levelGap = Number((averageEnemyLevel - averageAllyLevel).toFixed(1));
  const buildPathFocus =
    input.pregameAnalysis.laneRiskScore >= 60 ? input.pregameAnalysis.buildOptions[0].id : "B";

  const macroAlerts = [
    levelGap >= 1
      ? "Equipe inimiga com vantagem de nivel no momento; priorize lutas em janelas favoraveis."
      : "Niveis proximos entre os times; transicoes de objetivo estao equilibradas.",
    "Evite trocas longas antes do proximo spike de item principal.",
    "Leia a composicao antes de forcar engage: contexto da fight importa mais que micro-acao isolada.",
  ];

  const compositionalRead = input.pregameAnalysis.tags.includes("time inimigo com engage forte")
    ? "Composicao inimiga tem forte iniciacao; a partida favorece resposta coordenada."
    : "Composicao tende a front-to-back e cresce com execucao limpa de teamfight.";

  return {
    gameStateSummary:
      input.liveState.availability === "available"
        ? `Partida em andamento aos ${Math.floor(input.liveState.gameTimeSeconds / 60)} min com leitura contextual ativa.`
        : "Live Client indisponivel; exibindo contexto seguro sem comandos em tempo real.",
    macroAlerts,
    tags: input.pregameAnalysis.tags,
    buildPathFocus,
    compositionalRead,
  };
}
