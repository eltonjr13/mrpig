import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { riotSummonerSchema } from "@/schemas/riot.schema";
import type { RiotPlatformRoute, RiotSummonerDto } from "@/types/riot";

export async function getSummonerByPuuid(
  client: RiotBaseClient,
  puuid: string,
  route: RiotPlatformRoute = "br1",
): Promise<RiotSummonerDto> {
  const response = await client.get<unknown>({
    host: { type: "platform", route },
    path: `/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`,
  });

  return riotSummonerSchema.parse(response);
}
