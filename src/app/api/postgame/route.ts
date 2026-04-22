import { NextResponse } from "next/server";
import { getPostgameData } from "@/features/postgame";
import { toErrorMessage } from "@/utils/safe-error";

export async function GET() {
  try {
    const payload = await getPostgameData();
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao carregar postgame", details: toErrorMessage(error) },
      { status: 500 },
    );
  }
}
