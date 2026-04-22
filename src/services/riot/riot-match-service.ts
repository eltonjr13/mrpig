import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { riotMatchSchema } from "@/schemas/riot.schema";
import type {
  RiotMatchDto,
  RiotMatchListQuery,
  RiotRegionalRoute,
} from "@/types/riot";

export async function getMatchIdsByPuuid(
  client: RiotBaseClient,
  puuid: string,
  route: RiotRegionalRoute = "americas",
  query: RiotMatchListQuery = { start: 0, count: 8, type: "ranked" },
): Promise<string[]> {
  const response = await client.get<unknown>({
    host: { type: "regional", route },
    path: `/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids`,
    query: {
      start: query.start,
      count: query.count,
      queue: query.queue,
      type: query.type,
    },
  });

  return Array.isArray(response) ? response.map(String) : [];
}

export async function getMatchById(
  client: RiotBaseClient,
  matchId: string,
  route: RiotRegionalRoute = "americas",
): Promise<RiotMatchDto> {
  const response = await client.get<unknown>({
    host: { type: "regional", route },
    path: `/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
  });

  return riotMatchSchema.parse(response);
}
