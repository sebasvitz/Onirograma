import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { analyzeOniricInput } from "@/lib/analyzer";
import { transcribeAudio } from "@/lib/transcriber";
import { saveCase } from "@/lib/db";
import type { OniricCase, InputType } from "@/types";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY no configurada en el servidor." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();

    const texto = (formData.get("texto") as string | null)?.trim() ?? "";
    const audioFile = formData.get("audio") as File | null;
    const imagenFile = formData.get("imagen") as File | null;
    const imagenUrl = (formData.get("imagenUrl") as string | null)?.trim() ?? "";

    let transcripcion: string | undefined;
    let inputType: InputType = "texto";
    const referencias_visuales: string[] = [];

    if (audioFile && audioFile.size > 0) {
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      transcripcion = await transcribeAudio(buffer, audioFile.name, apiKey);
      inputType = texto ? "mixto" : "audio";
    }

    if (imagenFile && imagenFile.size > 0) {
      const buffer = Buffer.from(await imagenFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      referencias_visuales.push(`data:${imagenFile.type};base64,${base64}`);
      if (inputType === "texto" && !texto) inputType = "imagen";
      else inputType = "mixto";
    }

    if (imagenUrl) {
      referencias_visuales.push(imagenUrl);
      if (inputType === "texto" && !texto) inputType = "imagen";
      else inputType = "mixto";
    }

    const partsForAnalysis: string[] = [];
    if (texto) partsForAnalysis.push(`Texto del sueño:\n${texto}`);
    if (transcripcion) {
      partsForAnalysis.push(`Narración oral transcrita:\n${transcripcion}`);
    }
    if (referencias_visuales.length > 0) {
      partsForAnalysis.push(
        `Referencias visuales proporcionadas: ${referencias_visuales.length} imagen(es)`
      );
    }

    if (partsForAnalysis.length === 0) {
      return NextResponse.json(
        { error: "Debes proporcionar al menos texto, audio o imagen." },
        { status: 400 }
      );
    }

    const relatoUnificado = partsForAnalysis.join("\n\n---\n\n");
    const analysis = await analyzeOniricInput(relatoUnificado, apiKey);

    const oniricCase: OniricCase = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      input: {
        tipo: inputType,
        texto_original: texto || undefined,
        transcripcion,
        referencias_visuales:
          referencias_visuales.length > 0 ? referencias_visuales : undefined,
      },
      ...analysis,
    };

    saveCase(oniricCase);

    return NextResponse.json(oniricCase, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
