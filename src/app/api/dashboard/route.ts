import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/features/dashboard";
import { toErrorMessage } from "@/utils/safe-error";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameName = searchParams.get("gameName") ?? undefined;
  const tagLine = searchParams.get("tagLine") ?? undefined;

  try {
    const payload = await getDashboardData({ gameName, tagLine });
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao carregar dashboard", details: toErrorMessage(error) },
      { status: 500 },
    );
  }
}
