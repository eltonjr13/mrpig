import { buildMockPostgameData } from "@/features/mock-data/lol-mocks";
import { getPregameData } from "@/features/pregame/get-pregame-data";
import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { getPostgameDataFromRiot } from "@/services/riot";
import type { PostGameData } from "@/types/app";
import { toErrorMessage } from "@/utils/safe-error";

interface GetPostgameDataParams {
  matchId?: string;
  gameName?: string;
  tagLine?: string;
}

export async function getPostgameData({
  matchId,
  gameName,
  tagLine,
}: GetPostgameDataParams = {}): Promise<PostGameData> {
  const riotClient = new RiotBaseClient();
  const hasIdentity = Boolean(gameName?.trim() && tagLine?.trim());

  if (hasIdentity && riotClient.hasApiKey()) {
    try {
      const riotPostgameData = await getPostgameDataFromRiot({
        gameName: gameName!,
        tagLine: tagLine!,
        matchId,
      });

      return {
        ...riotPostgameData,
        sessionStatus: "riot_connected",
      };
    } catch (error) {
      const pregameData = await getPregameData({ gameName, tagLine });
      const mockPostgameData = buildMockPostgameData(pregameData.analysis);

      return {
        ...mockPostgameData,
        sessionStatus: "riot_fallback",
        fallbackReason: toErrorMessage(error),
      };
    }
  }

  const pregameData = await getPregameData({ gameName, tagLine });
  const mockPostgameData = buildMockPostgameData(pregameData.analysis);

  return {
    ...mockPostgameData,
    sessionStatus: pregameData.sessionStatus ?? "mock_mode",
    fallbackReason: pregameData.fallbackReason,
  };
}
