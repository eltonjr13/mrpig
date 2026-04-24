import { NextRequest, NextResponse } from "next/server";
import { getPregameData } from "@/features/pregame";
import { toErrorMessage } from "@/utils/safe-error";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameName = searchParams.get("gameName") ?? undefined;
  const tagLine = searchParams.get("tagLine") ?? undefined;
  const champion = searchParams.get("champion") ?? undefined;
  const enemyChampion = searchParams.get("enemyChampion") ?? undefined;
  const lane = searchParams.get("lane") ?? undefined;

  try {
    const payload = await getPregameData({
      gameName,
      tagLine,
      champion,
      enemyChampion,
      lane,
    });
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao carregar pregame", details: toErrorMessage(error) },
      { status: 500 },
    );
  }
}
