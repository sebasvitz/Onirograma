import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { analyzeOniricInputRules } from "@/lib/analyzer-rules";
import { saveCase } from "@/lib/db";
import type { OniricCase, InputType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const texto = (formData.get("texto") as string | null)?.trim() ?? "";
    // transcripcion: provided by browser Web Speech API on the client side
    const transcripcion =
      (formData.get("transcripcion") as string | null)?.trim() ?? "";
    const imagenFile = formData.get("imagen") as File | null;
    const imagenUrl = (formData.get("imagenUrl") as string | null)?.trim() ?? "";
    const hasAudio = (formData.get("hasAudio") as string | null) === "true";

    let inputType: InputType = "texto";
    const referencias_visuales: string[] = [];

    if (hasAudio) {
      inputType = texto || transcripcion ? "mixto" : "audio";
    }

    if (imagenFile && imagenFile.size > 0) {
      const buffer = Buffer.from(await imagenFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      referencias_visuales.push(`data:${imagenFile.type};base64,${base64}`);
      if (!hasAudio && !texto && !transcripcion) inputType = "imagen";
      else inputType = "mixto";
    }

    if (imagenUrl) {
      referencias_visuales.push(imagenUrl);
      if (!hasAudio && !texto && !transcripcion) inputType = "imagen";
      else inputType = "mixto";
    }

    // Build unified relato for rule-based analysis
    const partsForAnalysis: string[] = [];
    if (texto) partsForAnalysis.push(texto);
    if (transcripcion) partsForAnalysis.push(transcripcion);

    if (partsForAnalysis.length === 0) {
      return NextResponse.json(
        {
          error:
            "Debes proporcionar al menos texto o una transcripción del audio.",
        },
        { status: 400 }
      );
    }

    const relatoUnificado = partsForAnalysis.join("\n\n");
    const analysis = analyzeOniricInputRules(relatoUnificado);

    const oniricCase: OniricCase = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      input: {
        tipo: inputType,
        texto_original: texto || undefined,
        transcripcion: transcripcion || undefined,
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
