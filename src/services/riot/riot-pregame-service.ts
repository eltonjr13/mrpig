import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { getMostRecentMatchContext } from "@/services/riot/riot-match-context-service";
import { getMatchById, getMatchIdsByPuuid } from "@/services/riot/riot-match-service";
import { resolveRiotIdentity } from "@/services/riot/riot-player-service";
import type { RiotMatchDto, RiotPlatformRoute, RiotRegionalRoute } from "@/types/riot";

export interface RiotPregameParams {
  gameName: string;
  tagLine: string;
  regionalRoute?: RiotRegionalRoute;
  platformRoute?: RiotPlatformRoute;
}

export interface RiotPregameSeed {
  userChampion: string;
  enemyChampion: string;
  lane: string;
  allyComp: string[];
  enemyComp: string[];
  assumedEnemyJungle: string;
}

function getFulfilledMatches(results: PromiseSettledResult<RiotMatchDto>[]) {
  return results
    .filter((result): result is PromiseFulfilledResult<RiotMatchDto> => result.status === "fulfilled")
    .map((result) => result.value);
}

export async function getPregameSeedFromRiot({
  gameName,
  tagLine,
  regionalRoute,
  platformRoute,
}: RiotPregameParams): Promise<RiotPregameSeed> {
  const client = new RiotBaseClient();
  const resolvedIdentity = await resolveRiotIdentity(client, {
    gameName,
    tagLine,
    regionalRoute,
    platformRoute,
  });

  const matchIds = await getMatchIdsByPuuid(
    client,
    resolvedIdentity.account.puuid,
    resolvedIdentity.regionalRoute,
    { start: 0, count: 8 },
  );

  if (matchIds.length === 0) {
    throw new Error("Nenhuma partida recente encontrada para este jogador.");
  }

  const matchResults = await Promise.allSettled(
    matchIds.map((matchId) =>
      getMatchById(client, matchId, resolvedIdentity.regionalRoute),
    ),
  );
  const matches = getFulfilledMatches(matchResults);

  if (matches.length === 0) {
    throw new Error("Nao foi possivel carregar detalhes das partidas recentes.");
  }

  const context = getMostRecentMatchContext(matches, resolvedIdentity.account.puuid);

  if (!context) {
    throw new Error("Nao foi possivel derivar contexto pre-game das partidas recentes.");
  }

  return {
    userChampion: context.userChampion,
    enemyChampion: context.enemyChampion,
    lane: context.lane,
    allyComp: context.allyComp,
    enemyComp: context.enemyComp,
    assumedEnemyJungle: context.assumedEnemyJungle,
  };
}
