import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { riotAccountSchema } from "@/schemas/riot.schema";
import type { RiotAccountDto, RiotRegionalRoute } from "@/types/riot";

export async function getAccountByRiotId(
  client: RiotBaseClient,
  gameName: string,
  tagLine: string,
  route: RiotRegionalRoute = "americas",
): Promise<RiotAccountDto> {
  const response = await client.get<unknown>({
    host: { type: "regional", route },
    path: `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
  });

  return riotAccountSchema.parse(response);
}
