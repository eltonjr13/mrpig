import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import type { DashboardData } from "@/types/app";
import type {
  RiotMatchDto,
  RiotPlatformRoute,
  RiotRegionalRoute,
} from "@/types/riot";
import {
  getLeagueEntriesByPuuid,
  getLeagueEntriesBySummonerId,
} from "@/services/riot/riot-league-service";
import { getMatchById, getMatchIdsByPuuid } from "@/services/riot/riot-match-service";
import { resolveRiotIdentity } from "@/services/riot/riot-player-service";
import {
  calculateOverallWinRate,
  normalizeChampionPool,
  normalizePlayerProfile,
  normalizeRecentMatches,
} from "@/services/riot/riot-normalizers";

export interface RiotDashboardParams {
  gameName: string;
  tagLine: string;
  regionalRoute?: RiotRegionalRoute;
  platformRoute?: RiotPlatformRoute;
}

export async function getDashboardDataFromRiot({
  gameName,
  tagLine,
  regionalRoute,
  platformRoute,
}: RiotDashboardParams): Promise<DashboardData> {
  const client = new RiotBaseClient();

  const resolvedIdentity = await resolveRiotIdentity(client, {
    gameName,
    tagLine,
    regionalRoute,
    platformRoute,
  });

  const rankEntries = resolvedIdentity.summoner.id
    ? await getLeagueEntriesBySummonerId(
        client,
        resolvedIdentity.summoner.id,
        resolvedIdentity.platformRoute,
      )
    : await getLeagueEntriesByPuuid(
        client,
        resolvedIdentity.summoner.puuid,
        resolvedIdentity.platformRoute,
      );

  const matchIds = await getMatchIdsByPuuid(client, resolvedIdentity.account.puuid, resolvedIdentity.regionalRoute, {
    start: 0,
    count: 8,
  });

  const matchResults = await Promise.allSettled(
    matchIds.map((matchId) => getMatchById(client, matchId, resolvedIdentity.regionalRoute)),
  );
  const matches = matchResults
    .filter((result): result is PromiseFulfilledResult<RiotMatchDto> => result.status === "fulfilled")
    .map((result) => result.value);

  const recentMatches = normalizeRecentMatches(matches, resolvedIdentity.account.puuid);
  const championPool = normalizeChampionPool(matches, resolvedIdentity.account.puuid);

  return {
    profile: normalizePlayerProfile(resolvedIdentity.account, resolvedIdentity.summoner, rankEntries),
    rankEntries,
    recentMatches,
    championPool,
    overallWinRate: calculateOverallWinRate(recentMatches),
    sessionStatus: "riot_connected",
  };
}
