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

const EMOTION_ACCENT: Record<string, string> = {
  calma: "var(--color-powder)",
  fascinación: "var(--color-mist)",
  extrañeza: "var(--color-mauve)",
  ansiedad: "var(--color-petal)",
  tensión: "var(--color-periwinkle)",
  tristeza: "var(--color-violet)",
  alegría: "var(--color-powder)",
};

function getEmotionAccent(emocion: string): string {
  for (const [key, color] of Object.entries(EMOTION_ACCENT)) {
    if (emocion.toLowerCase().includes(key)) return color;
  }
  return "var(--color-violet)";
}

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="atm-bg" style={{ minHeight: "100vh", paddingTop: "3.5rem" }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="fade-up mb-10">
          <div
            className="mb-1"
            style={{
              color: "var(--color-periwinkle)",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Archivo onírico
          </div>
          <div className="flex items-end justify-between">
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 300,
                letterSpacing: "-0.01em",
                color: "var(--color-mist)",
              }}
            >
              Biblioteca
            </h1>
            <div className="flex items-center gap-4">
              <span
                style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
              >
                {cases.length}{" "}
                {cases.length === 1 ? "caso" : "casos"}
              </span>
              <Link href="/" className="btn-primary" style={{ padding: "0.5rem 1rem" }}>
                + Registrar sueño
              </Link>
            </div>
          </div>
        </div>

        {cases.length === 0 ? (
          <div
            className="py-32 text-center fade-up"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="text-5xl mb-6 opacity-20">◈</div>
            <p className="text-lg mb-4">La biblioteca está vacía</p>
            <Link
              href="/"
              className="text-sm underline underline-offset-4 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Registrar primer sueño →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 fade-up-delay-1">
            {cases.map((c, i) => (
              <CaseCard
                key={c.id}
                caso={c}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CaseCard({ caso, index }: { caso: OniricCase; index: number }) {
  const date = new Date(caso.created_at).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const accent = getEmotionAccent(caso.emocion.principal);

  return (
    <Link
      href={`/cases/${caso.id}`}
      className="group card block p-5"
      style={{
        animationDelay: `${index * 0.05}s`,
        borderLeftColor: accent,
        borderLeftWidth: "2px",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <span
          style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "monospace" }}
        >
          {date}
        </span>
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            fontSize: "0.65rem",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          {INPUT_LABELS[caso.input.tipo] ?? caso.input.tipo}
        </span>
      </div>

      {/* Summary */}
      <p
        className="mb-3 line-clamp-3"
        style={{
          fontSize: "0.82rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        {caso.resumen}
      </p>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {caso.keywords.slice(0, 4).map((kw) => (
          <span key={kw} className="tag">
            {kw}
          </span>
        ))}
        {caso.keywords.length > 4 && (
          <span className="tag">+{caso.keywords.length - 4}</span>
        )}
      </div>

      {/* Spatial meta */}
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          {caso.estructura_espacial.tipo} · {caso.estructura_espacial.escala}
        </span>
        <span
          className="text-xs transition-colors"
          style={{ color: accent, opacity: 0.7 }}
        >
          {caso.emocion.principal}
        </span>
      </div>
    </Link>
  );
}

