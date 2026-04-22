import { getPregameData } from "@/features/pregame/get-pregame-data";
import { buildLiveAnalysis } from "@/services/analysis";
import { getLiveClientState } from "@/services/live";
import type { LiveData } from "@/types/app";

export async function getLiveData(): Promise<LiveData> {
  const [liveState, pregameData] = await Promise.all([
    getLiveClientState(),
    getPregameData({}),
  ]);

  return {
    liveState,
    liveAnalysis: buildLiveAnalysis({
      liveState,
      pregameAnalysis: pregameData.analysis,
    }),
  };
}
