import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { createSectionImage } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const section = formData.get("section");

  if (!file || typeof section !== "string" || !section.trim()) {
    return NextResponse.json({ error: "Missing file or section." }, { status: 400 });
  }

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Usa JPEG, PNG, GIF o WebP." },
      { status: 400 }
    );
  }

  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "El archivo supera el límite de 10 MB." }, { status: 400 });
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `section-refs/${caseId}/${filename}`;

  const supabase = getSupabaseClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("dream-images")
    .upload(storagePath, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("dream-images")
    .getPublicUrl(storagePath);

  const image = await createSectionImage(caseId, section, urlData.publicUrl);
  return NextResponse.json({ image }, { status: 201 });
}
