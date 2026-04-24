import { RiotBaseClient } from "@/lib/api-clients/riot-base-client";
import { mockDashboardData } from "@/features/mock-data/lol-mocks";
import { getDashboardDataFromRiot } from "@/services/riot";
import type { DashboardData } from "@/types/app";
import { toErrorMessage } from "@/utils/safe-error";

interface GetDashboardDataParams {
  gameName?: string;
  tagLine?: string;
}

export async function getDashboardData({
  gameName,
  tagLine,
}: GetDashboardDataParams): Promise<DashboardData> {
  const riotClient = new RiotBaseClient();

  if (!riotClient.hasApiKey() || !gameName || !tagLine) {
    return mockDashboardData;
  }

  try {
    return await getDashboardDataFromRiot({
      gameName,
      tagLine,
    });
  } catch (error) {
    return {
      ...mockDashboardData,
      profile: {
        ...mockDashboardData.profile,
        gameName,
        tagLine,
      },
      sessionStatus: "riot_fallback",
      fallbackReason: toErrorMessage(error),
    };
  }
}
