import { buildMockPostgameData } from "@/features/mock-data/lol-mocks";
import { getPregameData } from "@/features/pregame/get-pregame-data";
import type { PostGameData } from "@/types/app";

export async function getPostgameData(): Promise<PostGameData> {
  const pregameData = await getPregameData({});
  return buildMockPostgameData(pregameData.analysis);
}
