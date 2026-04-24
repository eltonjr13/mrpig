import { NextRequest, NextResponse } from "next/server";
import { getPostgameData } from "@/features/postgame";
import { toErrorMessage } from "@/utils/safe-error";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get("matchId") ?? undefined;
  const gameName = searchParams.get("gameName") ?? undefined;
  const tagLine = searchParams.get("tagLine") ?? undefined;

  try {
    const payload = await getPostgameData({ matchId, gameName, tagLine });
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao carregar postgame", details: toErrorMessage(error) },
      { status: 500 },
    );
  }
}
