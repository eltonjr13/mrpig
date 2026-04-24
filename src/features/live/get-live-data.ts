import { getPregameData } from "@/features/pregame/get-pregame-data";
import { buildLiveAnalysis } from "@/services/analysis";
import { getLiveClientState } from "@/services/live";
import type { LiveData } from "@/types/app";

interface GetLiveDataParams {
  gameName?: string;
  tagLine?: string;
}

export async function getLiveData({
  gameName,
  tagLine,
}: GetLiveDataParams = {}): Promise<LiveData> {
  const [liveState, pregameData] = await Promise.all([
    getLiveClientState(),
    getPregameData({ gameName, tagLine }),
  ]);

  return {
    liveState,
    liveAnalysis: buildLiveAnalysis({
      liveState,
      pregameAnalysis: pregameData.analysis,
    }),
    sessionStatus: pregameData.sessionStatus,
    fallbackReason: pregameData.fallbackReason,
  };
}
