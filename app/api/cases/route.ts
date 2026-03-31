import { NextResponse } from "next/server";
import { getAllCases } from "@/lib/db";

export async function GET() {
  try {
    const cases = getAllCases();
    return NextResponse.json(cases);
  } catch {
    return NextResponse.json(
      { error: "Error al recuperar los casos." },
      { status: 500 }
    );
  }
}
