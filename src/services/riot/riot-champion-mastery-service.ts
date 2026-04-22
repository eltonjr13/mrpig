import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { riotChampionMasteriesSchema } from "@/schemas/riot.schema";
import type {
  RiotChampionMasteryDto,
  RiotPlatformRoute,
} from "@/types/riot";

export async function getChampionMasteriesByPuuid(
  client: RiotBaseClient,
  puuid: string,
  route: RiotPlatformRoute = "br1",
): Promise<RiotChampionMasteryDto[]> {
  const response = await client.get<unknown>({
    host: { type: "platform", route },
    path: `/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}`,
  });

  return riotChampionMasteriesSchema.parse(response);
}
