import Link from "next/link";
import type { OniricCase } from "@/types";

async function getCases(): Promise<OniricCase[]> {
  try {
    const { getAllCases } = await import("@/lib/db");
    return getAllCases();
  } catch {
    return [];
  }
}

const INPUT_LABELS: Record<string, string> = {
  texto: "Texto",
  audio: "Audio",
  imagen: "Imagen",
  mixto: "Mixto",
};

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight mb-1">
            Archivo Onírico
          </h1>
          <p className="text-white/40 text-sm">
            {cases.length} {cases.length === 1 ? "caso registrado" : "casos registrados"}
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-white text-black text-sm rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          + Nuevo análisis
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-white/30 text-lg mb-4">No hay casos registrados aún</p>
          <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors underline underline-offset-4">
            Registrar primer sueño →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cases.map((c) => (
            <CaseCard key={c.id} caso={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({ caso }: { caso: OniricCase }) {
  const date = new Date(caso.created_at).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/cases/${caso.id}`}
      className="group block p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-white/30 font-mono">{date}</span>
        <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/40">
          {INPUT_LABELS[caso.input.tipo] ?? caso.input.tipo}
        </span>
      </div>
      <p className="text-sm text-white/70 leading-relaxed mb-3 line-clamp-3">
        {caso.resumen}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {caso.keywords.slice(0, 4).map((kw) => (
          <span key={kw} className="tag">{kw}</span>
        ))}
        {caso.keywords.length > 4 && (
          <span className="tag">+{caso.keywords.length - 4}</span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{caso.estructura_espacial.tipo} · {caso.estructura_espacial.escala}</span>
        <span className="group-hover:text-white/60 transition-colors">Ver →</span>
      </div>
    </Link>
  );
}
