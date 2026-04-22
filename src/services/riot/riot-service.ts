import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import type { DashboardData } from "@/types/app";
import type {
  RiotPlatformRoute,
  RiotRegionalRoute,
  RiotMatchDto,
} from "@/types/riot";
import { getAccountByRiotId } from "@/services/riot/riot-account-service";
import { getLeagueEntriesBySummonerId } from "@/services/riot/riot-league-service";
import { getMatchById, getMatchIdsByPuuid } from "@/services/riot/riot-match-service";
import {
  calculateOverallWinRate,
  normalizeChampionPool,
  normalizePlayerProfile,
  normalizeRecentMatches,
} from "@/services/riot/riot-normalizers";
import { getSummonerByPuuid } from "@/services/riot/riot-summoner-service";

export interface RiotDashboardParams {
  gameName: string;
  tagLine: string;
  regionalRoute?: RiotRegionalRoute;
  platformRoute?: RiotPlatformRoute;
}

export async function getDashboardDataFromRiot({
  gameName,
  tagLine,
  regionalRoute = "americas",
  platformRoute = "br1",
}: RiotDashboardParams): Promise<DashboardData> {
  const client = new RiotBaseClient();

  const account = await getAccountByRiotId(client, gameName, tagLine, regionalRoute);
  const summoner = await getSummonerByPuuid(client, account.puuid, platformRoute);
  const rankEntries = await getLeagueEntriesBySummonerId(client, summoner.id, platformRoute);

  const matchIds = await getMatchIdsByPuuid(client, account.puuid, regionalRoute, {
    start: 0,
    count: 8,
  });

  const matchResults = await Promise.allSettled(
    matchIds.map((matchId) => getMatchById(client, matchId, regionalRoute)),
  );
  const matches = matchResults
    .filter((result): result is PromiseFulfilledResult<RiotMatchDto> => result.status === "fulfilled")
    .map((result) => result.value);

  const recentMatches = normalizeRecentMatches(matches, account.puuid);
  const championPool = normalizeChampionPool(matches, account.puuid);

  return {
    profile: normalizePlayerProfile(account, summoner, rankEntries),
    rankEntries,
    recentMatches,
    championPool,
    overallWinRate: calculateOverallWinRate(recentMatches),
    sessionStatus: "riot_connected",
  };
}
