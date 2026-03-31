import { NextRequest, NextResponse } from "next/server";
import { getCaseById, deleteCaseById } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const oniricCase = getCaseById(id);
  if (!oniricCase) {
    return NextResponse.json({ error: "Caso no encontrado." }, { status: 404 });
  }
  return NextResponse.json(oniricCase);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteCaseById(id);
  if (!deleted) {
    return NextResponse.json({ error: "Caso no encontrado." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
