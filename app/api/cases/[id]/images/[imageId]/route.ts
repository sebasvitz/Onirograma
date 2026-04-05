import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { deleteSectionImage } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { imageId } = await params;

  const url = await deleteSectionImage(imageId);

  if (url === null) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  // Remove the file from Storage
  try {
    const supabase = getSupabaseClient();
    // Extract the path after the bucket name from the public URL
    const marker = "/object/public/dream-images/";
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const storagePath = url.slice(idx + marker.length);
      await supabase.storage.from("dream-images").remove([decodeURIComponent(storagePath)]);
    }
  } catch {
    // Non-fatal: DB record is already deleted
  }

  return NextResponse.json({ ok: true });
}
