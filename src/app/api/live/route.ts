import { NextResponse } from "next/server";
import { getLiveData } from "@/features/live";
import { toErrorMessage } from "@/utils/safe-error";

export async function GET() {
  try {
    const payload = await getLiveData();
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao carregar live", details: toErrorMessage(error) },
      { status: 500 },
    );
  }
}
