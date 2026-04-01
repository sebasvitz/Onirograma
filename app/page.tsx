"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { OniricCase } from "@/types";

// Three.js background — loaded only on client to avoid SSR issues
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), {
  ssr: false,
});

// ─── Section configuration ────────────────────────────────────────────────────
// Order: Título → Registrar → Biblioteca → Explicación

const SECTIONS = [
  {
    id: "titulo",
    label: "Título",
    bg: "radial-gradient(ellipse 110% 65% at 25% 20%, rgba(141,128,176,0.28) 0%, transparent 55%), radial-gradient(ellipse 80% 55% at 78% 78%, rgba(131,151,196,0.2) 0%, transparent 55%)",
  },
  {
    id: "registrar",
    label: "Registrar",
    bg: "radial-gradient(ellipse 110% 65% at 18% 62%, rgba(207,144,193,0.28) 0%, transparent 55%), radial-gradient(ellipse 80% 55% at 82% 18%, rgba(251,216,224,0.14) 0%, transparent 55%)",
  },
  {
    id: "biblioteca",
    label: "Biblioteca",
    bg: "radial-gradient(ellipse 110% 65% at 62% 78%, rgba(131,151,196,0.28) 0%, transparent 55%), radial-gradient(ellipse 80% 55% at 28% 18%, rgba(170,203,224,0.18) 0%, transparent 55%)",
  },
  {
    id: "explicacion",
    label: "Explicación",
    bg: "radial-gradient(ellipse 110% 65% at 72% 28%, rgba(107,87,156,0.3) 0%, transparent 55%), radial-gradient(ellipse 80% 55% at 18% 72%, rgba(141,128,176,0.2) 0%, transparent 55%)",
  },
] as const;

// ─── Geometric SVG decorations ────────────────────────────────────────────────

function GeoConcentric() {
  return (
    <svg width="440" height="440" viewBox="0 0 440 440" fill="none" aria-hidden>
      {[180, 140, 100, 60, 24].map((r) => (
        <circle key={r} cx="220" cy="220" r={r} stroke="currentColor" strokeWidth="0.6" />
      ))}
      <line x1="220" y1="40" x2="220" y2="400" stroke="currentColor" strokeWidth="0.6" />
      <line x1="40" y1="220" x2="400" y2="220" stroke="currentColor" strokeWidth="0.6" />
      <line x1="92" y1="92" x2="348" y2="348" stroke="currentColor" strokeWidth="0.6" />
      <line x1="348" y1="92" x2="92" y2="348" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

function GeoGrid() {
  return (
    <svg width="360" height="360" viewBox="0 0 360 360" fill="none" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={"h" + i} x1="0" y1={i * 45} x2="360" y2={i * 45} stroke="currentColor" strokeWidth="0.6" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={"v" + i} x1={i * 45} y1="0" x2={i * 45} y2="360" stroke="currentColor" strokeWidth="0.6" />
      ))}
    </svg>
  );
}

function GeoDiamond() {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" aria-hidden>
      {[170, 130, 90, 50].map((d) => (
        <polygon
          key={d}
          points={`200,${200 - d} ${200 + d},200 200,${200 + d} ${200 - d},200`}
          stroke="currentColor"
          strokeWidth="0.6"
        />
      ))}
      <rect x="30" y="30" width="340" height="340" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

// ─── Landing section ──────────────────────────────────────────────────────────

function LandingSection({ onNavigate }: { onNavigate: (i: number) => void }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-3rem",
          top: "50%",
          transform: "translateY(-55%)",
          color: "var(--color-violet)",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <GeoConcentric />
      </div>

      <div style={{ textAlign: "center", maxWidth: "30rem", position: "relative", zIndex: 1 }}>
        <div
          className="fade-up"
          style={{
            color: "var(--color-mauve)",
            fontSize: "0.62rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Sistema de cartografía onírica
        </div>

        <h1 className="hero-title fade-up-delay-1">
          Oniro
          <br />
          grama
        </h1>

        <p
          className="fade-up-delay-2"
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            lineHeight: 1.85,
            maxWidth: "26rem",
            margin: "0 auto 3rem",
          }}
        >
          Traducción perceptiva de experiencias oníricas en variables espaciales
          para diseño escenográfico.
        </p>

        <div
          className="fade-up-delay-3"
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}
        >
          <button
            onClick={() => onNavigate(1)}
            className="btn-primary"
            style={{ fontSize: "0.78rem", padding: "0.65rem 1.5rem" }}
          >
            Registrar sueño
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="btn-ghost"
            style={{ fontSize: "0.78rem", padding: "0.65rem 1.5rem" }}
          >
            Explicación
          </button>
        </div>
      </div>

      <div
        className="fade-up-delay-3"
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--text-muted)",
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        <span>Desplaza para explorar</span>
        <svg
          className="scroll-hint-arrow"
          width="14"
          height="20"
          viewBox="0 0 14 22"
          fill="none"
          style={{ opacity: 0.45 }}
          aria-hidden
        >
          <rect x="4" y="1" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1" />
          <line x1="7" y1="4" x2="7" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path
            d="M3 16 L7 20 L11 16"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Explicación section ──────────────────────────────────────────────────────

function ExplanationSection() {
  const dimensions = [
    {
      symbol: "○",
      title: "Estructura espacial",
      desc: "Tipo, límites, escala y organización del espacio percibido en el sueño.",
      color: "var(--color-powder)",
    },
    {
      symbol: "△",
      title: "Dinámicas",
      desc: "Fuerzas, flujos y movimientos activos dentro del espacio onírico.",
      color: "var(--color-mauve)",
    },
    {
      symbol: "□",
      title: "Luz & Materialidad",
      desc: "Intensidad, temperatura y comportamiento de la luz. Texturas y superficies percibidas.",
      color: "var(--color-petal)",
    },
    {
      symbol: "◇",
      title: "Corporalidad",
      desc: "Cómo el cuerpo habita el espacio: gravedad, control, sensación y presencia.",
      color: "var(--color-violet)",
    },
    {
      symbol: "⬡",
      title: "Traducción espacial",
      desc: "Las variables extraídas se convierten en parámetros concretos para diseño escenográfico.",
      color: "var(--color-periwinkle)",
    },
  ];

  return (
    <div className="flow-section" style={{ paddingTop: "3.5rem" }}>
      <div
        style={{ maxWidth: "54rem", margin: "0 auto", padding: "2.5rem 1.5rem 5rem", position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            right: "-1rem",
            top: "2rem",
            color: "var(--color-violet)",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        >
          <GeoGrid />
        </div>

        <div className="fade-up" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              color: "var(--color-violet)",
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Explicación
          </div>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 200,
              letterSpacing: "-0.025em",
              color: "var(--color-mist)",
              marginBottom: "1.25rem",
            }}
          >
            Cartografía onírica
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              maxWidth: "38rem",
              marginBottom: "2.5rem",
            }}
          >
            Onirograma es un sistema de{" "}
            <span style={{ color: "var(--color-mist)" }}>traducción perceptiva</span>, no de
            interpretación psicológica. Extrae variables objetivas de la experiencia onírica y las
            transforma en parámetros concretos para el diseño de espacios escenográficos.
          </p>

          <div
            style={{
              display: "grid",
              gap: "0.875rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              marginBottom: "2.5rem",
            }}
          >
            {dimensions.map((d, i) => (
              <div
                key={d.title}
                className="card fade-up"
                style={{
                  padding: "1.1rem 1.25rem",
                  animationDelay: `${i * 0.07}s`,
                  borderLeftColor: d.color,
                  borderLeftWidth: "2px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      color: d.color,
                      fontWeight: 300,
                      lineHeight: 1,
                      opacity: 0.85,
                    }}
                  >
                    {d.symbol}
                  </span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--color-mist)" }}>
                    {d.title}
                  </span>
                </div>
                <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderRadius: "1rem",
              border: "1px solid rgba(141,128,176,0.2)",
              background: "rgba(141,128,176,0.05)",
            }}
          >
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              &ldquo;El sueño no es interpretado &mdash;{" "}
              <strong style={{ color: "var(--color-violet)", fontWeight: 500 }}>cartografiado</strong>. Sus
              elementos se leen como datos espaciales, sensoriales y perceptivos, disponibles para ser
              traducidos en decisiones de diseño.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Library section ──────────────────────────────────────────────────────────

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

function LibrarySection({ onRegister }: { onRegister: () => void }) {
  const [cases, setCases] = useState<OniricCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCases(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flow-section" style={{ paddingTop: "3.5rem" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        <div className="fade-up" style={{ marginBottom: "2rem" }}>
          <div
            style={{
              color: "var(--color-periwinkle)",
              fontSize: "0.62rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            Archivo onírico
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <h2
              style={{
                fontSize: "2.2rem",
                fontWeight: 200,
                letterSpacing: "-0.025em",
                color: "var(--color-mist)",
              }}
            >
              Biblioteca
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {!loading && (
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  {cases.length} {cases.length === 1 ? "caso" : "casos"}
                </span>
              )}
              <button
                onClick={onRegister}
                className="btn-primary"
                style={{ fontSize: "0.78rem", padding: "0.5rem 1rem" }}
              >
                + Registrar
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5rem 0",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
            }}
          >
            Cargando...
          </div>
        ) : cases.length === 0 ? (
          <div style={{ padding: "6rem 0", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1.5rem", opacity: 0.2 }}>◈</div>
            <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>La biblioteca está vacía</p>
            <button
              onClick={onRegister}
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Registrar primer sueño →
            </button>
          </div>
        ) : (
          <div
            className="depth-grid"
            style={{
              display: "grid",
              gap: "0.875rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}
          >
            {cases.map((c, i) => {
              const date = new Date(c.created_at).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const accent = getEmotionAccent(c.emocion.principal);
              return (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="case-card fade-up"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    borderLeftColor: accent,
                    borderLeftWidth: "2px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "space-between",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--text-muted)",
                        fontFamily: "monospace",
                      }}
                    >
                      {date}
                    </span>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                        padding: "0.1rem 0.5rem",
                        borderRadius: "9999px",
                      }}
                    >
                      {c.input.tipo}
                    </span>
                  </div>
                  <p
                    className="line-clamp-3"
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      marginBottom: "0.65rem",
                    }}
                  >
                    {c.resumen}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.3rem",
                      marginBottom: "0.65rem",
                    }}
                  >
                    {c.keywords.slice(0, 4).map((kw) => (
                      <span key={kw} className="tag">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                      {c.estructura_espacial.tipo} · {c.estructura_espacial.escala}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: accent, opacity: 0.75 }}>
                      {c.emocion.principal}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Register section (form + result) ────────────────────────────────────────

function RegisterSection({ onAfterRegister }: { onAfterRegister: () => void }) {
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OniricCase | null>(null);

  const handleImagenFile = (file: File) => {
    setImagenFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagenPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!texto.trim()) {
      setError("Debes proporcionar al menos el relato del sueño.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("texto", texto.trim());
      if (imagenFile) fd.append("imagen", imagenFile);
      if (imagenUrl.trim()) fd.append("imagenUrl", imagenUrl.trim());

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Error en el análisis.");
      }

      setResult(data as OniricCase);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleNewRegistro = () => {
    setResult(null);
    setTexto("");
    setImagenFile(null);
    setImagenPreview(null);
    setImagenUrl("");
    setError(null);
  };

  // ── Result view ────────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="flow-section" style={{ paddingTop: "3.5rem" }}>
        <div style={{ maxWidth: "44rem", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
          <div
            className="fade-up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "2rem",
              color: "var(--color-violet)",
            }}
          >
            <span>◉</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>Análisis completado</span>
          </div>

          <div
            className="fade-up"
            style={{
              padding: "1.5rem",
              borderRadius: "1rem",
              border: "1px solid rgba(141,128,176,0.3)",
              background: "rgba(141,128,176,0.06)",
              marginBottom: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                marginBottom: "1rem",
              }}
            >
              {result.resumen}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {result.keywords.map((kw) => (
                <span key={kw} className="tag">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.65rem", marginBottom: "1.5rem" }}>
            {[
              {
                label: "Estructura espacial",
                value: Object.entries(result.estructura_espacial)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · "),
                accent: "var(--color-petal)",
              },
              {
                label: "Dinámicas",
                value: result.dinamicas.join(", "),
                accent: "var(--color-mauve)",
              },
              {
                label: "Emoción",
                value: `${result.emocion.principal} — ${result.emocion.clima_afectivo}`,
                accent: "var(--color-violet)",
              },
              {
                label: "Traducción espacial",
                value: result.traduccion_espacial.potencial,
                accent: "var(--color-powder)",
              },
            ].map((s, i) => (
              <div
                key={s.label}
                className="card fade-up"
                style={{ padding: "0.9rem 1.1rem", animationDelay: `${i * 0.07}s` }}
              >
                <div
                  className="section-label"
                  style={{ color: s.accent, opacity: 0.85, marginBottom: "0.25rem" }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push(`/cases/${result.id}`)}
              className="btn-primary"
              style={{ fontSize: "0.8rem" }}
            >
              Ver análisis completo
            </button>
            <button onClick={onAfterRegister} className="btn-ghost" style={{ fontSize: "0.8rem" }}>
              Ver biblioteca
            </button>
            <button onClick={handleNewRegistro} className="btn-ghost" style={{ fontSize: "0.8rem" }}>
              Nuevo registro
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form view ──────────────────────────────────────────────────────────────
  return (
    <div className="flow-section" style={{ paddingTop: "3.5rem" }}>
      <div
        style={{
          maxWidth: "44rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 5rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-2rem",
            top: "1rem",
            color: "var(--color-mauve)",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        >
          <GeoDiamond />
        </div>

        <div className="fade-up" style={{ position: "relative", zIndex: 1, marginBottom: "2rem" }}>
          <div
            style={{
              color: "var(--color-mauve)",
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            Sala de registro
          </div>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 200,
              letterSpacing: "-0.025em",
              color: "var(--color-mist)",
              marginBottom: "0.75rem",
            }}
          >
            Registrar sueño
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
            Relata tu experiencia onírica. El sistema extrae variables espaciales, sensoriales y
            perceptivas para traducirlas en insumos de diseño.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="fade-up-delay-1"
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative", zIndex: 1 }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Relato del sueño
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={7}
              placeholder="Describe tu sueño con el mayor detalle posible: espacios, sensaciones, movimientos, luz, materiales, emociones..."
              className="input-field"
              style={{ resize: "none" }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Imagen referencial{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImagenFile(file);
                }}
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              />
              <input
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="O pega un link de imagen"
                className="input-field"
                style={{ fontSize: "0.78rem" }}
              />
              {imagenPreview && (
                <div style={{ position: "relative", width: "6rem", height: "6rem" }}>
                  <Image
                    src={imagenPreview}
                    alt="Vista previa de imagen referencial"
                    fill
                    unoptimized
                    style={{ objectFit: "cover", borderRadius: "0.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagenFile(null);
                      setImagenPreview(null);
                    }}
                    style={{
                      position: "absolute",
                      top: "0.3rem",
                      right: "0.3rem",
                      width: "1.2rem",
                      height: "1.2rem",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)",
                      border: "none",
                      color: "white",
                      fontSize: "0.65rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                background: "rgba(251,216,224,0.08)",
                border: "1px solid rgba(251,216,224,0.2)",
                color: "var(--color-petal)",
                fontSize: "0.8rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ alignSelf: "flex-start", fontSize: "0.8rem" }}
          >
            {loading ? "Analizando..." : "Analizar sueño"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main page (full-flow container) ─────────────────────────────────────────

const SCROLL_COOLDOWN_MS = 850;
const SCROLL_BOUNDARY_PX = 8;

function isSectionAtBoundary(el: HTMLDivElement, direction: "down" | "up"): boolean {
  if (direction === "down") {
    return el.scrollTop >= el.scrollHeight - el.clientHeight - SCROLL_BOUNDARY_PX;
  }
  return el.scrollTop <= SCROLL_BOUNDARY_PX;
}

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastWheelTime = useRef(0);
  const touchStartY = useRef(0);

  const navigateTo = useCallback((index: number) => {
    if (index < 0 || index >= SECTIONS.length) return;
    const now = Date.now();
    if (now - lastWheelTime.current < SCROLL_COOLDOWN_MS) return;
    lastWheelTime.current = now;
    setCurrentSection(index);
  }, []);

  const navigateRelative = useCallback((delta: number) => {
    setCurrentSection((prev) => {
      const next = prev + delta;
      if (next < 0 || next >= SECTIONS.length) return prev;
      const now = Date.now();
      if (now - lastWheelTime.current < SCROLL_COOLDOWN_MS) return prev;
      lastWheelTime.current = now;
      return next;
    });
  }, []);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const sectionEl = sectionRefs.current[currentSection];
      if (sectionEl) {
        const direction = e.deltaY > 0 ? "down" : "up";
        if (!isSectionAtBoundary(sectionEl, direction)) return;
      }
      e.preventDefault();
      navigateRelative(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection, navigateRelative]);

  // Touch/swipe navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      const sectionEl = sectionRefs.current[currentSection];
      if (sectionEl) {
        const direction = delta > 0 ? "down" : "up";
        if (!isSectionAtBoundary(sectionEl, direction)) return;
      }
      navigateRelative(delta > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSection, navigateRelative]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") navigateRelative(1);
      if (e.key === "ArrowUp" || e.key === "PageUp") navigateRelative(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigateRelative]);

  return (
    <>
      {/* Atmospheric Three.js depth layer — behind all content */}
      <ThreeBackground currentSection={currentSection} />

      <div className="scroll-flow">
        {/* Background gradient layer */}
        <div className="flow-bg-layer" style={{ background: SECTIONS[currentSection].bg }} />

        {/* Sections container — order: Título, Registrar, Biblioteca, Explicación */}
        <div
          className="flow-sections"
          style={{ transform: `translateY(-${currentSection * 100}vh)` }}
        >
          <div className="flow-section" ref={(el) => { sectionRefs.current[0] = el; }}>
            <LandingSection onNavigate={navigateTo} />
          </div>
          <div className="flow-section" ref={(el) => { sectionRefs.current[1] = el; }}>
            <RegisterSection onAfterRegister={() => navigateTo(2)} />
          </div>
          <div className="flow-section" ref={(el) => { sectionRefs.current[2] = el; }}>
            <LibrarySection onRegister={() => navigateTo(1)} />
          </div>
          <div className="flow-section" ref={(el) => { sectionRefs.current[3] = el; }}>
            <ExplanationSection />
          </div>
        </div>

        {/* Side navigation dots */}
        <nav className="flow-nav" aria-label="Secciones">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={"flow-nav-dot" + (i === currentSection ? " active" : "")}
              onClick={() => navigateTo(i)}
              aria-label={s.label}
              title={s.label}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
