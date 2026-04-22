import {
  RiotApiError,
  RiotBaseClient,
} from "@/lib/api-clients/riot-base-client";
import { riotCurrentGameSchema } from "@/schemas/riot.schema";
import type { RiotCurrentGameInfoDto, RiotPlatformRoute } from "@/types/riot";

export async function getActiveGameBySummonerId(
  client: RiotBaseClient,
  summonerId: string,
  route: RiotPlatformRoute = "br1",
): Promise<RiotCurrentGameInfoDto | null> {
  try {
    const response = await client.get<unknown>({
      host: { type: "platform", route },
      path: `/lol/spectator/v5/active-games/by-summoner/${encodeURIComponent(summonerId)}`,
    });

    return riotCurrentGameSchema.parse(response);
  } catch (error) {
    if (error instanceof RiotApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
