import { supabase } from "@/lib/supabase";
import type { OniricCase } from "@/types";

// ── Row shape stored in Supabase ──────────────────────────────────────────────
// The DB uses flat snake_case columns; we map to/from the OniricCase type.

type CaseRow = {
  id: string;
  created_at: string;
  input_tipo: string;
  texto_original: string | null;
  transcripcion: string | null;
  referencias_visuales: string[] | null;
  resumen: string;
  estructura_espacial: OniricCase["estructura_espacial"];
  dinamicas: string[];
  luz: OniricCase["luz"];
  materialidad: string[];
  corporalidad: OniricCase["corporalidad"];
  emocion: OniricCase["emocion"];
  recorrido: OniricCase["recorrido"];
  elementos_espaciales: string[];
  traduccion_espacial: OniricCase["traduccion_espacial"];
  keywords: string[];
};

function rowToCase(row: CaseRow): OniricCase {
  return {
    id: row.id,
    created_at: row.created_at,
    input: {
      tipo: row.input_tipo as OniricCase["input"]["tipo"],
      texto_original: row.texto_original ?? undefined,
      transcripcion: row.transcripcion ?? undefined,
      referencias_visuales: row.referencias_visuales ?? undefined,
    },
    resumen: row.resumen,
    estructura_espacial: row.estructura_espacial,
    dinamicas: row.dinamicas,
    luz: row.luz,
    materialidad: row.materialidad,
    corporalidad: row.corporalidad,
    emocion: row.emocion,
    recorrido: row.recorrido,
    elementos_espaciales: row.elementos_espaciales,
    traduccion_espacial: row.traduccion_espacial,
    keywords: row.keywords,
  };
}

function caseToRow(c: OniricCase): Omit<CaseRow, "created_at"> & { created_at: string } {
  return {
    id: c.id,
    created_at: c.created_at,
    input_tipo: c.input.tipo,
    texto_original: c.input.texto_original ?? null,
    transcripcion: c.input.transcripcion ?? null,
    referencias_visuales: c.input.referencias_visuales ?? null,
    resumen: c.resumen,
    estructura_espacial: c.estructura_espacial,
    dinamicas: c.dinamicas,
    luz: c.luz,
    materialidad: c.materialidad,
    corporalidad: c.corporalidad,
    emocion: c.emocion,
    recorrido: c.recorrido,
    elementos_espaciales: c.elementos_espaciales,
    traduccion_espacial: c.traduccion_espacial,
    keywords: c.keywords,
  };
}

export async function getAllCases(): Promise<OniricCase[]> {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as CaseRow[]).map(rowToCase);
}

export async function getCaseById(id: string): Promise<OniricCase | null> {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // row not found
    throw new Error(error.message);
  }
  return rowToCase(data as CaseRow);
}

export async function saveCase(oniricCase: OniricCase): Promise<void> {
  const { error } = await supabase.from("cases").insert(caseToRow(oniricCase));
  if (error) throw new Error(error.message);
}

export async function deleteCaseById(id: string): Promise<boolean> {
  const { error, count } = await supabase
    .from("cases")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
