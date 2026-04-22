import type { BuildOption, PregameAnalysis } from "@/types/analysis";
import type { DashboardData, MatchOverview, PostGameData, PregameData } from "@/types/app";
import { buildPostgameCoachReport } from "@/services/postgame";

export const defaultPlayerIdentity = {
  gameName: "CoachPlayer",
  tagLine: "BR1",
  puuid: "mock-puuid-001",
};

export const mockRecentMatches: MatchOverview[] = [
  {
    matchId: "BR1_1234567890",
    championName: "Camille",
    queueLabel: "Ranked Solo/Duo",
    kda: "7/3/6",
    result: "WIN",
    gameDurationSeconds: 1880,
    playedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    matchId: "BR1_1234567821",
    championName: "Camille",
    queueLabel: "Ranked Solo/Duo",
    kda: "4/6/5",
    result: "LOSS",
    gameDurationSeconds: 1740,
    playedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    matchId: "BR1_1234567688",
    championName: "Fiora",
    queueLabel: "Ranked Solo/Duo",
    kda: "9/4/3",
    result: "WIN",
    gameDurationSeconds: 1960,
    playedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

export const mockBuildOptions: BuildOption[] = [
  {
    id: "A",
    title: "Rota defensiva",
    scenario: "Lane pressionada por burst",
    itemPath: ["Item defensivo inicial", "Mitigacao AP", "Poder de luta estavel"],
    rationale: "Mais consistencia em trocas curtas e menor risco de all-in inimigo.",
  },
  {
    id: "B",
    title: "Rota balanceada",
    scenario: "Jogo neutro com espaco para side lane",
    itemPath: ["Item core", "Acelerador de dano", "Sustentacao situacional"],
    rationale: "Mantem opcao de split e teamfight sem travar a build cedo.",
  },
  {
    id: "C",
    title: "Rota de escala",
    scenario: "Partida tende a 3+ itens",
    itemPath: ["Escala principal", "Dano tardio", "Item de fechamento"],
    rationale: "Compensa quando sua composicao cresce melhor no late game.",
  },
];

export const mockDashboardData: DashboardData = {
  profile: {
    gameName: defaultPlayerIdentity.gameName,
    tagLine: defaultPlayerIdentity.tagLine,
    puuid: defaultPlayerIdentity.puuid,
    summonerLevel: 223,
    rankLabel: "EMERALD II - 64 LP",
  },
  rankEntries: [
    {
      leagueId: "mock-league-1",
      queueType: "RANKED_SOLO_5x5",
      tier: "EMERALD",
      rank: "II",
      summonerId: "mock-summoner-1",
      puuid: defaultPlayerIdentity.puuid,
      leaguePoints: 64,
      wins: 102,
      losses: 91,
      veteran: false,
      inactive: false,
      freshBlood: false,
      hotStreak: true,
    },
  ],
  recentMatches: mockRecentMatches,
  championPool: [
    { championName: "Camille", games: 24, winRate: 58.3 },
    { championName: "Fiora", games: 16, winRate: 56.2 },
    { championName: "Gwen", games: 10, winRate: 52.1 },
  ],
  sessionStatus: "mock_mode",
  overallWinRate: 61.5,
};

export const mockPregameTemplate: Omit<PregameData, "analysis"> = {
  userChampion: "Camille",
  enemyChampion: "Renekton",
  lane: "top",
  assumedEnemyJungle: "Vi",
};

export const mockPregameAnalysisSeed: PregameAnalysis = {
  matchupOverview: "Camille vs Renekton tende a ser lane de risco elevado ate o primeiro item.",
  laneRiskScore: 71,
  laneRiskLabel: "alto",
  enemyDamageProfile: "predominante AD",
  powerSpikes: ["Nivel 6", "Primeiro item completo", "Dois itens"],
  tags: [
    "lane agressiva",
    "troca longa ruim",
    "pico no nivel 6",
    "time inimigo com engage forte",
  ],
  contextualAlerts: [
    "Lane desfavoravel nos niveis iniciais.",
    "Prefira rota de item defensiva nesta partida.",
    "Evite trocas longas antes do primeiro spike.",
  ],
  buildOptions: mockBuildOptions,
};

export function buildMockPostgameData(
  pregameAnalysis: PregameAnalysis,
): PostGameData {
  const match = mockRecentMatches[0];

  return {
    matchId: match.matchId,
    championName: match.championName,
    report: buildPostgameCoachReport({
      match,
      pregameAnalysis,
      buildUsed: ["Item core", "Mitigacao AP", "Poder de luta estavel"],
    }),
  };
}

export const mockAllyComp = ["Camille", "Vi", "Ahri", "Jinx", "Leona"];
export const mockEnemyComp = ["Renekton", "Sejuani", "Sylas", "Caitlyn", "Ornn"];
