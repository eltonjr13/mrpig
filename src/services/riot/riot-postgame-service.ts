import { buildPregameAnalysis } from "@/services/analysis";
import { getMatchContextByPuuid } from "@/services/riot/riot-match-context-service";
import { getMatchById, getMatchIdsByPuuid } from "@/services/riot/riot-match-service";
import { normalizeRecentMatches } from "@/services/riot/riot-normalizers";
import { resolveRiotIdentity } from "@/services/riot/riot-player-service";
import { buildPostgameCoachReport } from "@/services/postgame";
import type { PostGameData } from "@/types/app";
import type { RiotPlatformRoute, RiotRegionalRoute } from "@/types/riot";
import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";

export interface RiotPostgameParams {
  gameName: string;
  tagLine: string;
  matchId?: string;
  regionalRoute?: RiotRegionalRoute;
  platformRoute?: RiotPlatformRoute;
}

function toBuildUsed(itemIds: number[]) {
  return itemIds
    .filter((itemId) => itemId > 0)
    .slice(0, 3)
    .map((itemId) => `Item ${itemId}`);
}

export async function getPostgameDataFromRiot({
  gameName,
  tagLine,
  matchId,
  regionalRoute,
  platformRoute,
}: RiotPostgameParams): Promise<PostGameData> {
  const client = new RiotBaseClient();
  const resolvedIdentity = await resolveRiotIdentity(client, {
    gameName,
    tagLine,
    regionalRoute,
    platformRoute,
  });

  const targetMatchId =
    matchId ??
    (
      await getMatchIdsByPuuid(
        client,
        resolvedIdentity.account.puuid,
        resolvedIdentity.regionalRoute,
        { start: 0, count: 1 },
      )
    )[0];

  if (!targetMatchId) {
    throw new Error("Nao foi possivel localizar uma partida para revisao.");
  }

  const match = await getMatchById(
    client,
    targetMatchId,
    resolvedIdentity.regionalRoute,
  );
  const context = getMatchContextByPuuid(match, resolvedIdentity.account.puuid);
  const normalizedMatch = normalizeRecentMatches([match], resolvedIdentity.account.puuid)[0];

  if (!context || !normalizedMatch) {
    throw new Error("Nao foi possivel extrair dados do jogador na partida selecionada.");
  }

  const pregameAnalysis = buildPregameAnalysis({
    userChampion: context.userChampion,
    enemyChampion: context.enemyChampion,
    lane: context.lane,
    allyComp: context.allyComp,
    enemyComp: context.enemyComp,
  });

  const buildUsed = toBuildUsed([
    context.participant.item0,
    context.participant.item1,
    context.participant.item2,
    context.participant.item3,
    context.participant.item4,
    context.participant.item5,
    context.participant.item6,
  ]);

  return {
    matchId: normalizedMatch.matchId,
    championName: normalizedMatch.championName,
    report: buildPostgameCoachReport({
      match: normalizedMatch,
      pregameAnalysis,
      buildUsed,
    }),
  };
}
