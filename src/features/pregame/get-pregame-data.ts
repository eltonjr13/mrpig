import {
  mockAllyComp,
  mockEnemyComp,
  mockPregameAnalysisSeed,
  mockPregameTemplate,
} from "@/features/mock-data/lol-mocks";
import { buildPregameAnalysis } from "@/services/analysis";
import type { PregameData } from "@/types/app";

interface GetPregameDataParams {
  champion?: string;
  enemyChampion?: string;
  lane?: string;
}

export async function getPregameData({
  champion,
  enemyChampion,
  lane,
}: GetPregameDataParams): Promise<PregameData> {
  const userChampion = champion ?? mockPregameTemplate.userChampion;
  const targetEnemyChampion = enemyChampion ?? mockPregameTemplate.enemyChampion;
  const selectedLane = lane ?? mockPregameTemplate.lane;

  const analysis = buildPregameAnalysis({
    userChampion,
    enemyChampion: targetEnemyChampion,
    lane: selectedLane,
    allyComp: mockAllyComp,
    enemyComp: mockEnemyComp,
  });

  return {
    userChampion,
    enemyChampion: targetEnemyChampion,
    lane: selectedLane,
    assumedEnemyJungle: mockPregameTemplate.assumedEnemyJungle,
    analysis: analysis ?? mockPregameAnalysisSeed,
  };
}
