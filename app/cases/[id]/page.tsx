import { notFound } from "next/navigation";
import Link from "next/link";
import type { OniricCase } from "@/types";

async function getCase(id: string): Promise<OniricCase | null> {
  try {
    const { getCaseById } = await import("@/lib/db");
    return getCaseById(id);
  } catch {
    return null;
  }
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caso = await getCase(id);

  if (!caso) notFound();

  const date = new Date(caso.created_at).toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/cases"
          className="text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          ← Archivo
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-sm text-white/40 font-mono">{id.slice(0, 8)}…</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/40 uppercase tracking-widest">
            {caso.input.tipo}
          </span>
          <span className="text-xs text-white/30">{date}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {caso.keywords.map((kw) => (
            <span key={kw} className="tag">{kw}</span>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Resumen</div>
          <p className="text-sm text-white/80 leading-relaxed">{caso.resumen}</p>
        </div>
      </div>

      {/* Input original */}
      {(caso.input.texto_original || caso.input.transcripcion) && (
        <Section title="Input original">
          {caso.input.texto_original && (
            <SubSection label="Texto escrito">
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                {caso.input.texto_original}
              </p>
            </SubSection>
          )}
          {caso.input.transcripcion && (
            <SubSection label="Transcripción de audio">
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                {caso.input.transcripcion}
              </p>
            </SubSection>
          )}
        </Section>
      )}

      {/* Estructura espacial */}
      <Section title="Estructura espacial">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <DataCell label="Tipo" value={caso.estructura_espacial.tipo} />
          <DataCell label="Naturaleza" value={caso.estructura_espacial.naturaleza} />
          <DataCell label="Límites" value={caso.estructura_espacial.limites} />
          <DataCell label="Escala" value={caso.estructura_espacial.escala} />
          <DataCell label="Organización" value={caso.estructura_espacial.organizacion} />
        </div>
      </Section>

      {/* Dinámicas */}
      <Section title="Dinámicas espaciales">
        <div className="flex flex-wrap gap-2">
          {caso.dinamicas.map((d) => (
            <span key={d} className="px-3 py-1 rounded-full border border-white/15 text-sm text-white/70">
              {d}
            </span>
          ))}
        </div>
      </Section>

      {/* Luz */}
      <Section title="Luz">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <DataCell label="Intensidad" value={caso.luz.intensidad} />
          <DataCell label="Tipo" value={caso.luz.tipo} />
          <DataCell label="Temperatura" value={caso.luz.temperatura} />
          <DataCell label="Comportamiento" value={caso.luz.comportamiento} />
          <DataCell label="Origen" value={caso.luz.origen} />
        </div>
      </Section>

      {/* Materialidad */}
      <Section title="Materialidad">
        <div className="flex flex-wrap gap-2">
          {caso.materialidad.map((m) => (
            <span key={m} className="px-3 py-1 rounded-full border border-white/15 text-sm text-white/70">
              {m}
            </span>
          ))}
        </div>
      </Section>

      {/* Corporalidad */}
      <Section title="Corporalidad">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <DataCell label="Estado" value={caso.corporalidad.estado} />
          <DataCell label="Gravedad" value={caso.corporalidad.gravedad} />
          <DataCell label="Sensación" value={caso.corporalidad.sensacion} />
          <DataCell label="Control" value={caso.corporalidad.control} />
          <DataCell label="Presencia" value={caso.corporalidad.presencia} />
        </div>
      </Section>

      {/* Emoción */}
      <Section title="Emoción dominante">
        <div className="grid grid-cols-2 gap-3">
          <DataCell label="Principal" value={caso.emocion.principal} />
          <DataCell label="Clima afectivo" value={caso.emocion.clima_afectivo} />
        </div>
      </Section>

      {/* Recorrido */}
      <Section title="Recorrido">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DataCell label="Tipo" value={caso.recorrido.tipo} />
          <DataCell label="Continuidad" value={caso.recorrido.continuidad} />
          <DataCell label="Dirección" value={caso.recorrido.direccion} />
          <DataCell label="Lógica" value={caso.recorrido.logica} />
        </div>
      </Section>

      {/* Elementos espaciales */}
      {caso.elementos_espaciales.length > 0 && (
        <Section title="Elementos espaciales relevantes">
          <ul className="space-y-1">
            {caso.elementos_espaciales.map((el) => (
              <li key={el} className="text-sm text-white/60 flex items-start gap-2">
                <span className="text-white/20 mt-0.5">·</span>
                {el}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Traducción espacial */}
      <Section title="Traducción espacial">
        <div className="p-4 rounded-xl border border-white/15 bg-white/[0.04] mb-4">
          <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Potencial</div>
          <p className="text-sm text-white/80 leading-relaxed">
            {caso.traduccion_espacial.potencial}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(caso.traduccion_espacial.estrategias).map(([k, v]) => (
            <DataCell key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />
          ))}
        </div>
      </Section>

      {/* JSON raw */}
      <details className="mt-8">
        <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors">
          Ver JSON completo
        </summary>
        <pre className="mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white/50 overflow-auto">
          {JSON.stringify(caso, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function SubSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="text-xs text-white/30 mb-1">{label}</div>
      {children}
    </div>
  );
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg border border-white/8 bg-white/[0.02]">
      <div className="text-xs text-white/30 mb-1">{label}</div>
      <div className="text-sm text-white/80">{value}</div>
    </div>
  );
}
