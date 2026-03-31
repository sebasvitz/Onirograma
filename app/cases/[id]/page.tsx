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

const SECTION_ACCENTS: Record<string, string> = {
  "Input original": "var(--color-mist)",
  "Estructura espacial": "var(--color-powder)",
  "Dinámicas espaciales": "var(--color-mauve)",
  "Luz": "var(--color-petal)",
  "Materialidad": "var(--color-periwinkle)",
  "Corporalidad": "var(--color-violet)",
  "Emoción dominante": "var(--color-mauve)",
  "Recorrido": "var(--color-periwinkle)",
  "Elementos espaciales": "var(--color-powder)",
  "Traducción espacial": "var(--color-mist)",
};

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
    <div className="atm-bg min-h-[calc(100vh-7rem)]">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 fade-up" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <Link href="/cases" className="hover:opacity-70 transition-opacity" style={{ color: "var(--text-secondary)" }}>
            ← Biblioteca
          </Link>
          <span style={{ opacity: 0.3 }}>/</span>
          <span style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
            {id.slice(0, 8)}…
          </span>
        </div>

        {/* Hero header */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="px-2 py-0.5 rounded-full uppercase"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              {caso.input.tipo}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{date}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {caso.keywords.map((kw) => (
              <span key={kw} className="tag">{kw}</span>
            ))}
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{
              border: "1px solid rgba(221,233,239,0.1)",
              background: "rgba(221,233,239,0.03)",
            }}
          >
            <div className="section-label mb-2" style={{ color: "var(--color-mist)" }}>
              Resumen
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {caso.resumen}
            </p>
          </div>
        </div>

        {/* Input original */}
        {(caso.input.texto_original || caso.input.transcripcion) && (
          <Section title="Input original">
            {caso.input.texto_original && (
              <SubSection label="Texto escrito">
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {caso.input.texto_original}
                </p>
              </SubSection>
            )}
            {caso.input.transcripcion && (
              <SubSection label="Transcripción de narración">
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {caso.input.transcripcion}
                </p>
              </SubSection>
            )}
          </Section>
        )}

        {/* Estructura espacial */}
        <Section title="Estructura espacial">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <DataCell label="Tipo" value={caso.estructura_espacial.tipo} accent="var(--color-powder)" />
            <DataCell label="Naturaleza" value={caso.estructura_espacial.naturaleza} accent="var(--color-powder)" />
            <DataCell label="Límites" value={caso.estructura_espacial.limites} accent="var(--color-powder)" />
            <DataCell label="Escala" value={caso.estructura_espacial.escala} accent="var(--color-powder)" />
            <DataCell label="Organización" value={caso.estructura_espacial.organizacion} accent="var(--color-powder)" />
          </div>
        </Section>

        {/* Dinámicas */}
        <Section title="Dinámicas espaciales">
          <div className="flex flex-wrap gap-2">
            {caso.dinamicas.map((d) => (
              <span
                key={d}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  border: "1px solid rgba(207,144,193,0.25)",
                  background: "rgba(207,144,193,0.07)",
                  color: "var(--color-mauve)",
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </Section>

        {/* Luz */}
        <Section title="Luz">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <DataCell label="Intensidad" value={caso.luz.intensidad} accent="var(--color-petal)" />
            <DataCell label="Tipo" value={caso.luz.tipo} accent="var(--color-petal)" />
            <DataCell label="Temperatura" value={caso.luz.temperatura} accent="var(--color-petal)" />
            <DataCell label="Comportamiento" value={caso.luz.comportamiento} accent="var(--color-petal)" />
            <DataCell label="Origen" value={caso.luz.origen} accent="var(--color-petal)" />
          </div>
        </Section>

        {/* Materialidad */}
        <Section title="Materialidad">
          <div className="flex flex-wrap gap-2">
            {caso.materialidad.map((m) => (
              <span
                key={m}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  border: "1px solid rgba(131,151,196,0.25)",
                  background: "rgba(131,151,196,0.07)",
                  color: "var(--color-periwinkle)",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </Section>

        {/* Corporalidad */}
        <Section title="Corporalidad">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <DataCell label="Estado" value={caso.corporalidad.estado} accent="var(--color-violet)" />
            <DataCell label="Gravedad" value={caso.corporalidad.gravedad} accent="var(--color-violet)" />
            <DataCell label="Sensación" value={caso.corporalidad.sensacion} accent="var(--color-violet)" />
            <DataCell label="Control" value={caso.corporalidad.control} accent="var(--color-violet)" />
            <DataCell label="Presencia" value={caso.corporalidad.presencia} accent="var(--color-violet)" />
          </div>
        </Section>

        {/* Emoción */}
        <Section title="Emoción dominante">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DataCell label="Principal" value={caso.emocion.principal} accent="var(--color-mauve)" />
            <DataCell label="Clima afectivo" value={caso.emocion.clima_afectivo} accent="var(--color-mauve)" />
          </div>
        </Section>

        {/* Recorrido */}
        <Section title="Recorrido">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <DataCell label="Tipo" value={caso.recorrido.tipo} accent="var(--color-periwinkle)" />
            <DataCell label="Continuidad" value={caso.recorrido.continuidad} accent="var(--color-periwinkle)" />
            <DataCell label="Dirección" value={caso.recorrido.direccion} accent="var(--color-periwinkle)" />
            <DataCell label="Lógica" value={caso.recorrido.logica} accent="var(--color-periwinkle)" />
          </div>
        </Section>

        {/* Elementos espaciales */}
        {caso.elementos_espaciales.length > 0 && (
          <Section title="Elementos espaciales relevantes">
            <ul className="space-y-1">
              {caso.elementos_espaciales.map((el) => (
                <li
                  key={el}
                  className="flex items-start gap-2"
                  style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--color-powder)", marginTop: "0.1rem" }}>·</span>
                  {el}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Traducción espacial */}
        <Section title="Traducción espacial">
          <div
            className="p-5 rounded-2xl mb-4"
            style={{
              border: "1px solid rgba(221,233,239,0.12)",
              background: "rgba(221,233,239,0.04)",
            }}
          >
            <div className="section-label mb-2" style={{ color: "var(--color-mist)" }}>
              Potencial de traducción
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.7 }}>
              {caso.traduccion_espacial.potencial}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(caso.traduccion_espacial.estrategias).map(([k, v]) => (
              <DataCell
                key={k}
                label={k.charAt(0).toUpperCase() + k.slice(1)}
                value={v}
                accent="var(--color-mist)"
              />
            ))}
          </div>
        </Section>

        {/* JSON raw */}
        <details className="mt-10">
          <summary
            className="cursor-pointer transition-colors"
            style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
          >
            Ver datos completos (JSON)
          </summary>
          <pre
            className="mt-3 p-4 rounded-xl overflow-auto"
            style={{
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.02)",
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {JSON.stringify(caso, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const accent = SECTION_ACCENTS[title] ?? "var(--color-mist)";
  return (
    <div className="mb-8">
      <div
        className="section-label mb-3"
        style={{ color: accent }}
      >
        {title}
      </div>
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
    <div className="mb-4">
      <div className="section-label mb-1">{label}</div>
      {children}
    </div>
  );
}

function DataCell({
  label,
  value,
  accent = "var(--color-mist)",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      className="p-3 rounded-xl"
      style={{
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        className="section-label mb-1"
        style={{ color: accent, opacity: 0.7 }}
      >
        {label}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

