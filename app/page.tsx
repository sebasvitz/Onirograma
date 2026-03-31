"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { OniricCase } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type RecordingState = "idle" | "recording" | "stopped";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

// ─── Entry screen ─────────────────────────────────────────────────────────────

function EntryScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      className="atm-bg min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center px-6 py-16"
      style={{ textAlign: "center" }}
    >
      <div className="fade-up mb-3" style={{ color: "var(--color-mauve)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
        Sistema de cartografía onírica
      </div>

      <h1
        className="fade-up-delay-1 mb-5"
        style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 200,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "var(--color-mist)",
        }}
      >
        Onirograma
      </h1>

      <p
        className="fade-up-delay-2 mb-14 max-w-sm"
        style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}
      >
        Traduce tu experiencia onírica en variables espaciales y perceptivas
        para diseño escenográfico.
      </p>

      {/* Two portals */}
      <div className="fade-up-delay-3 w-full max-w-lg grid grid-cols-2 gap-4">
        <button
          onClick={onEnter}
          className="portal-link portal-record text-left"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "rgba(207,144,193,0.15)", color: "var(--color-mauve)" }}
          >
            ◎
          </span>
          <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--color-mist)" }}>
            Sala de registro
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Registra una nueva experiencia onírica
          </span>
        </button>

        <Link href="/cases" className="portal-link portal-archive">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "rgba(131,151,196,0.15)", color: "var(--color-periwinkle)" }}
          >
            ◈
          </span>
          <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--color-mist)" }}>
            Biblioteca
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Explora el archivo onírico registrado
          </span>
        </Link>
      </div>

      <div
        className="fade-up-delay-3 mt-16"
        style={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
      >
        El sistema NO realiza interpretación psicológica ·
        Traducción perceptiva → espacial
      </div>
    </div>
  );
}

// ─── Result view ──────────────────────────────────────────────────────────────

function ResultScreen({
  result,
  onViewCase,
  onNewAnalysis,
}: {
  result: OniricCase;
  onViewCase: () => void;
  onNewAnalysis: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div
        className="fade-up mb-6 p-5 rounded-2xl"
        style={{ border: "1px solid rgba(141,128,176,0.3)", background: "rgba(141,128,176,0.06)" }}
      >
        <div className="flex items-center gap-2 mb-3" style={{ color: "var(--color-violet)" }}>
          <span>◉</span>
          <span className="text-sm font-medium">Análisis completado</span>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {result.resumen}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {result.keywords.map((kw) => (
            <span key={kw} className="tag">{kw}</span>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onViewCase} className="btn-primary">
            Ver análisis completo
          </button>
          <button onClick={onNewAnalysis} className="btn-ghost">
            Nuevo registro
          </button>
        </div>
      </div>

      {/* Quick preview */}
      <div className="space-y-3">
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
            className="card p-4 fade-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div
              className="section-label mb-1"
              style={{ color: s.accent, opacity: 0.8 }}
            >
              {s.label}
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dream form ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [showEntry, setShowEntry] = useState(true);

  const [texto, setTexto] = useState("");
  const [transcripcion, setTranscripcion] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OniricCase | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg",
      });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingState("recording");
      finalTranscriptRef.current = "";

      // Start Web Speech API for live transcription if available
      if (speechSupported) {
        const SpeechRecognitionAPI =
          window.SpeechRecognition ?? window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = "es-ES";
        recognition.continuous = true;
        recognition.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let interimText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const r = event.results[i];
            if (r.isFinal) {
              finalTranscriptRef.current += r[0].transcript + " ";
            } else {
              interimText += r[0].transcript;
            }
          }
          setLiveTranscript(finalTranscriptRef.current + interimText);
        };

        recognition.onerror = (e: { error: string }) => {
          // Only notify on permission errors; other transient errors are acceptable
          if (e.error === "not-allowed" || e.error === "service-not-allowed") {
            setError(
              "El micrófono no tiene permiso para usar el reconocimiento de voz automático. Escribe la transcripción manualmente."
            );
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch {
      setError("No se pudo acceder al micrófono. Verifica los permisos.");
    }
  }, [speechSupported]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setRecordingState("stopped");
    // Commit live transcript to transcripcion state
    setTimeout(() => {
      const final = finalTranscriptRef.current.trim();
      if (final) setTranscripcion(final);
      setLiveTranscript("");
    }, 300);
  }, []);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingState("idle");
    setTranscripcion("");
    setLiveTranscript("");
    finalTranscriptRef.current = "";
  }, [audioUrl]);

  const handleImagenFile = (file: File) => {
    setImagenFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagenPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!texto.trim() && !transcripcion.trim()) {
      if (recordingState === "recording") {
        setError("Detén la grabación antes de enviar.");
      } else if (audioBlob) {
        setError(
          "La narración fue grabada pero la transcripción automática no está disponible. Por favor escribe el contenido en el campo de transcripción."
        );
      } else {
        setError("Debes proporcionar al menos texto o una narración.");
      }
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      if (texto.trim()) fd.append("texto", texto.trim());
      if (transcripcion.trim()) fd.append("transcripcion", transcripcion.trim());
      if (audioBlob) fd.append("hasAudio", "true");
      if (imagenFile) fd.append("imagen", imagenFile);
      if (imagenUrl.trim()) fd.append("imagenUrl", imagenUrl.trim());

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Error en el análisis.");
      }

      setResult(data as OniricCase);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCase = () => {
    if (result) router.push(`/cases/${result.id}`);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setTexto("");
    setTranscripcion("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setImagenFile(null);
    setImagenPreview(null);
    setImagenUrl("");
    setRecordingState("idle");
    setError(null);
    setLiveTranscript("");
    finalTranscriptRef.current = "";
    setShowEntry(true);
  };

  // Show entry screen (spatial portal)
  if (showEntry && !result) {
    return <EntryScreen onEnter={() => setShowEntry(false)} />;
  }

  // Show result screen
  if (result) {
    return (
      <ResultScreen
        result={result}
        onViewCase={handleViewCase}
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  // Show recording form
  return (
    <div className="atm-bg min-h-[calc(100vh-7rem)]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="fade-up mb-10">
          <div
            className="flex items-center gap-2 mb-5 cursor-pointer w-fit"
            onClick={() => setShowEntry(true)}
            style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
          >
            ← Entrada
          </div>
          <div
            className="mb-1"
            style={{ color: "var(--color-mauve)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Sala de registro
          </div>
          <h1
            className="mb-3"
            style={{ fontSize: "1.8rem", fontWeight: 300, letterSpacing: "-0.01em", color: "var(--color-mist)" }}
          >
            Registrar sueño
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Relata tu experiencia onírica. El sistema extrae variables espaciales,
            sensoriales y perceptivas para traducirlas en insumos de diseño.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 fade-up-delay-1">

          {/* Text input */}
          <div>
            <label
              className="block mb-2"
              style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)" }}
            >
              Relato del sueño
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={7}
              placeholder="Describe tu sueño con el mayor detalle posible: espacios, sensaciones, movimientos, luz, materiales, emociones..."
              className="input-field resize-none"
            />
          </div>

          {/* Audio recording */}
          <div>
            <label
              className="block mb-2"
              style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)" }}
            >
              Narración oral{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span>
            </label>

            <div className="flex items-center gap-3 mb-3">
              {recordingState === "idle" && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="btn-ghost"
                  style={{ fontSize: "0.8rem" }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--color-mauve)" }}
                  />
                  Grabar narración
                </button>
              )}

              {recordingState === "recording" && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="btn-ghost"
                  style={{
                    fontSize: "0.8rem",
                    borderColor: "rgba(251,216,224,0.3)",
                    color: "var(--color-petal)",
                    animation: "pulse 2s infinite",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--color-petal)" }}
                  />
                  Detener grabación
                </button>
              )}

              {recordingState === "stopped" && audioUrl && (
                <div className="flex items-center gap-3 flex-1">
                  <audio src={audioUrl} controls className="h-8 flex-1" />
                  <button
                    type="button"
                    onClick={clearRecording}
                    className="text-xs transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Live transcript indicator */}
            {recordingState === "recording" && speechSupported && (
              <div
                className="p-3 rounded-xl text-xs mb-3"
                style={{
                  background: "rgba(207,144,193,0.07)",
                  border: "1px solid rgba(207,144,193,0.15)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  minHeight: "3rem",
                }}
              >
                <span style={{ color: "var(--color-mauve)", marginRight: "0.4rem" }}>●</span>
                {liveTranscript || "Transcribiendo..."}
              </div>
            )}

            {/* Audio file upload */}
            {recordingState === "idle" && (
              <div className="mb-3">
                <label
                  className="block mb-1"
                  style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
                >
                  O sube un archivo de audio (mp3, wav, webm, m4a)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudioBlob(file);
                      setAudioUrl(URL.createObjectURL(file));
                      setRecordingState("stopped");
                    }
                  }}
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                />
              </div>
            )}

            {/* Manual transcription (shown when audio exists) */}
            {(recordingState === "stopped" || transcripcion) && (
              <div>
                <label
                  className="block mb-1"
                  style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
                >
                  Transcripción{" "}
                  {speechSupported
                    ? "(capturada automáticamente — puedes editar)"
                    : "(escribe aquí el contenido de la grabación para el análisis)"}
                </label>
                <textarea
                  value={transcripcion}
                  onChange={(e) => setTranscripcion(e.target.value)}
                  rows={3}
                  placeholder="Transcripción del audio..."
                  className="input-field resize-none"
                  style={{ fontSize: "0.8rem" }}
                />
              </div>
            )}
          </div>

          {/* Image reference */}
          <div>
            <label
              className="block mb-2"
              style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)" }}
            >
              Imagen referencial{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span>
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImagenFile(file);
                }}
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="O pega un link de imagen"
                className="input-field"
                style={{ fontSize: "0.8rem" }}
              />
              {imagenPreview && (
                <div className="relative w-28 h-28">
                  <Image
                    src={imagenPreview}
                    alt="Vista previa de imagen referencial"
                    fill
                    unoptimized
                    className="object-cover rounded-xl"
                    style={{ border: "1px solid var(--border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagenFile(null);
                      setImagenPreview(null);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                border: "1px solid rgba(251,216,224,0.2)",
                background: "rgba(251,216,224,0.05)",
                color: "var(--color-petal)",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 inline-block"
                  style={{
                    borderColor: "rgba(12,11,16,0.3)",
                    borderTopColor: "#0c0b10",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Analizando experiencia onírica…
              </>
            ) : (
              "Analizar sueño"
            )}
          </button>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
          `}</style>
        </form>
      </div>
    </div>
  );
}

