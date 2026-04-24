import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { riotLeagueEntriesSchema } from "@/schemas/riot.schema";
import type { RiotLeagueEntryDto, RiotPlatformRoute } from "@/types/riot";

export async function getLeagueEntriesBySummonerId(
  client: RiotBaseClient,
  summonerId: string,
  route: RiotPlatformRoute = "br1",
): Promise<RiotLeagueEntryDto[]> {
  const response = await client.get<unknown>({
    host: { type: "platform", route },
    path: `/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`,
  });

  return riotLeagueEntriesSchema.parse(response);
}

export async function getLeagueEntriesByPuuid(
  client: RiotBaseClient,
  puuid: string,
  route: RiotPlatformRoute = "br1",
): Promise<RiotLeagueEntryDto[]> {
  const response = await client.get<unknown>({
    host: { type: "platform", route },
    path: `/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`,
  });

  return riotLeagueEntriesSchema.parse(response);
}
