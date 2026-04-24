import {
  mockAllyComp,
  mockEnemyComp,
  mockPregameAnalysisSeed,
  mockPregameTemplate,
} from "@/features/mock-data/lol-mocks";
import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { buildPregameAnalysis } from "@/services/analysis";
import { getPregameSeedFromRiot } from "@/services/riot";
import type { PregameData } from "@/types/app";
import { toErrorMessage } from "@/utils/safe-error";

interface GetPregameDataParams {
  gameName?: string;
  tagLine?: string;
  champion?: string;
  enemyChampion?: string;
  lane?: string;
}

function buildMockPregameData({
  champion,
  enemyChampion,
  lane,
  sessionStatus = "mock_mode",
  fallbackReason,
}: Pick<GetPregameDataParams, "champion" | "enemyChampion" | "lane"> & {
  sessionStatus?: PregameData["sessionStatus"];
  fallbackReason?: string;
}): PregameData {
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
    allyComp: mockAllyComp,
    enemyComp: mockEnemyComp,
    sessionStatus,
    fallbackReason,
  };
}

export async function getPregameData({
  gameName,
  tagLine,
  champion,
  enemyChampion,
  lane,
}: GetPregameDataParams): Promise<PregameData> {
  const riotClient = new RiotBaseClient();
  const hasIdentity = Boolean(gameName?.trim() && tagLine?.trim());

  if (!hasIdentity || !riotClient.hasApiKey()) {
    return buildMockPregameData({ champion, enemyChampion, lane });
  }

  try {
    const riotSeed = await getPregameSeedFromRiot({
      gameName: gameName!,
      tagLine: tagLine!,
    });

    const userChampion = champion ?? riotSeed.userChampion;
    const targetEnemyChampion = enemyChampion ?? riotSeed.enemyChampion;
    const selectedLane = lane ?? riotSeed.lane;
    const allyComp = riotSeed.allyComp.length > 0 ? riotSeed.allyComp : mockAllyComp;
    const enemyComp = riotSeed.enemyComp.length > 0 ? riotSeed.enemyComp : mockEnemyComp;

    return {
      userChampion,
      enemyChampion: targetEnemyChampion,
      lane: selectedLane,
      assumedEnemyJungle: riotSeed.assumedEnemyJungle,
      analysis: buildPregameAnalysis({
        userChampion,
        enemyChampion: targetEnemyChampion,
        lane: selectedLane,
        allyComp,
        enemyComp,
      }),
      allyComp,
      enemyComp,
      sessionStatus: "riot_connected",
    };
  } catch (error) {
    return buildMockPregameData({
      champion,
      enemyChampion,
      lane,
      sessionStatus: "riot_fallback",
      fallbackReason: toErrorMessage(error),
    });
  }
}
