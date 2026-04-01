import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { analyzeOniricInputRules } from "@/lib/analyzer-rules";
import { saveCase } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import type { OniricCase, InputType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const texto = (formData.get("texto") as string | null)?.trim() ?? "";
    const imagenFile = formData.get("imagen") as File | null;
    const imagenUrl = (formData.get("imagenUrl") as string | null)?.trim() ?? "";

    let inputType: InputType = "texto";
    const referencias_visuales: string[] = [];

    if (imagenFile && imagenFile.size > 0) {
      const arrayBuffer = await imagenFile.arrayBuffer();
      const ext = imagenFile.name.split(".").pop() ?? "bin";
      const fileName = `${uuidv4()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("dream-images")
        .upload(fileName, arrayBuffer, { contentType: imagenFile.type });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("dream-images")
          .getPublicUrl(fileName);
        referencias_visuales.push(urlData.publicUrl);
      }
      inputType = texto ? "mixto" : "imagen";
    }

    if (imagenUrl) {
      referencias_visuales.push(imagenUrl);
      inputType = texto ? "mixto" : "imagen";
    }

    if (!texto) {
      return NextResponse.json(
        { error: "Debes proporcionar al menos el relato del sueño." },
        { status: 400 }
      );
    }

    const analysis = analyzeOniricInputRules(texto);

    const oniricCase: OniricCase = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      input: {
        tipo: inputType,
        texto_original: texto,
        referencias_visuales:
          referencias_visuales.length > 0 ? referencias_visuales : undefined,
      },
      ...analysis,
    };

    await saveCase(oniricCase);

    return NextResponse.json(oniricCase, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
