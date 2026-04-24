import { RiotApiError, RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { getAccountByRiotId } from "@/services/riot/riot-account-service";
import { getSummonerByPuuid } from "@/services/riot/riot-summoner-service";
import type {
  RiotAccountDto,
  RiotPlatformRoute,
  RiotRegionalRoute,
  RiotSummonerDto,
} from "@/types/riot";

const REGIONAL_ROUTES: RiotRegionalRoute[] = ["americas", "europe", "asia"];
const PLATFORM_ROUTES_BY_REGIONAL: Record<RiotRegionalRoute, RiotPlatformRoute[]> = {
  americas: ["br1", "la1", "la2", "na1"],
  europe: ["eun1", "euw1", "tr1", "ru"],
  asia: ["jp1", "kr", "oc1"],
};

export interface RiotPlayerLookupParams {
  gameName: string;
  tagLine: string;
  regionalRoute?: RiotRegionalRoute;
  platformRoute?: RiotPlatformRoute;
}

export interface RiotResolvedIdentity {
  account: RiotAccountDto;
  summoner: RiotSummonerDto;
  regionalRoute: RiotRegionalRoute;
  platformRoute: RiotPlatformRoute;
}

function isNotFound(error: unknown) {
  return error instanceof RiotApiError && error.status === 404;
}

export async function resolveRiotIdentity(
  client: RiotBaseClient,
  {
    gameName,
    tagLine,
    regionalRoute,
    platformRoute,
  }: RiotPlayerLookupParams,
): Promise<RiotResolvedIdentity> {
  if (regionalRoute && platformRoute) {
    const account = await getAccountByRiotId(client, gameName, tagLine, regionalRoute);
    const summoner = await getSummonerByPuuid(client, account.puuid, platformRoute);
    return { account, summoner, regionalRoute, platformRoute };
  }

  let lastError: unknown;

  for (const candidateRegionalRoute of REGIONAL_ROUTES) {
    let account: RiotAccountDto;

    try {
      account = await getAccountByRiotId(client, gameName, tagLine, candidateRegionalRoute);
    } catch (error) {
      lastError = error;

      if (isNotFound(error)) {
        continue;
      }

      throw error;
    }

    for (const candidatePlatformRoute of PLATFORM_ROUTES_BY_REGIONAL[candidateRegionalRoute]) {
      try {
        const summoner = await getSummonerByPuuid(
          client,
          account.puuid,
          candidatePlatformRoute,
        );

        return {
          account,
          summoner,
          regionalRoute: candidateRegionalRoute,
          platformRoute: candidatePlatformRoute,
        };
      } catch (error) {
        lastError = error;

        if (isNotFound(error)) {
          continue;
        }

        throw error;
      }
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Nao foi possivel localizar o invocador informado na Riot API.");
}
