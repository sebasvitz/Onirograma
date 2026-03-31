"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { OniricCase } from "@/types";

type RecordingState = "idle" | "recording" | "stopped";

export default function HomePage() {
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OniricCase | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingState("recording");
    } catch {
      setError("No se pudo acceder al micrófono. Verifica los permisos.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecordingState("stopped");
  }, []);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingState("idle");
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

    if (!texto.trim() && !audioBlob && !imagenFile && !imagenUrl.trim()) {
      setError("Debes proporcionar al menos un input: texto, audio o imagen.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      if (texto.trim()) fd.append("texto", texto.trim());
      if (audioBlob) fd.append("audio", audioBlob, "grabacion.webm");
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

  const handleViewCase = () => {
    if (result) router.push(`/cases/${result.id}`);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setTexto("");
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setImagenFile(null);
    setImagenPreview(null);
    setImagenUrl("");
    setRecordingState("idle");
    setError(null);
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8 p-6 rounded-xl border border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-2 text-green-400 mb-3">
            <span className="text-xl">✓</span>
            <span className="font-semibold">Análisis completado</span>
          </div>
          <p className="text-white/60 text-sm mb-4">{result.resumen}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {result.keywords.map((kw) => (
              <span key={kw} className="tag">{kw}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleViewCase}
              className="px-4 py-2 bg-white text-black text-sm rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Ver análisis completo
            </button>
            <button
              onClick={handleNewAnalysis}
              className="px-4 py-2 border border-white/20 text-sm rounded-lg hover:border-white/40 transition-colors"
            >
              Nuevo análisis
            </button>
          </div>
        </div>
        <AnalysisSummary result={result} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-3 tracking-tight">
          Análisis Onírico
        </h1>
        <p className="text-white/50 text-sm leading-relaxed">
          Relata tu experiencia onírica. El sistema extrae variables espaciales,
          sensoriales y perceptivas para traducirlas en insumos de diseño.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Relato del sueño
          </label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            placeholder="Describe tu sueño con el mayor detalle posible: espacios, sensaciones, movimientos, luz, materiales, emociones..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Narración oral{" "}
            <span className="text-white/30 font-normal">(opcional)</span>
          </label>
          <div className="flex items-center gap-3">
            {recordingState === "idle" && (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-sm hover:border-white/40 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Grabar audio
              </button>
            )}
            {recordingState === "recording" && (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 border border-red-500/50 rounded-lg text-sm text-red-400 hover:border-red-500 transition-colors animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Detener grabación
              </button>
            )}
            {recordingState === "stopped" && audioUrl && (
              <div className="flex items-center gap-3 flex-1">
                <audio src={audioUrl} controls className="h-8 flex-1" />
                <button
                  type="button"
                  onClick={clearRecording}
                  className="text-white/30 hover:text-white/60 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          {recordingState === "idle" && (
            <div className="mt-2">
              <label className="block text-xs text-white/30 mb-1">
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
                className="text-xs text-white/50 file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-white/20 file:bg-transparent file:text-white/60 hover:file:border-white/40"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Imagen referencial{" "}
            <span className="text-white/30 font-normal">(opcional)</span>
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImagenFile(file);
              }}
              className="text-xs text-white/50 file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-white/20 file:bg-transparent file:text-white/60 hover:file:border-white/40"
            />
            <input
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="O pega un link de imagen"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30"
            />
            {imagenPreview && (
              <div className="relative w-32 h-32">
                <Image
                  src={imagenPreview}
                  alt="Vista previa de imagen referencial"
                  fill
                  unoptimized
                  className="object-cover rounded-lg border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagenFile(null);
                    setImagenPreview(null);
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black border border-white/20 text-white/60 text-xs flex items-center justify-center hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Analizando experiencia onírica...
            </span>
          ) : (
            "Analizar sueño"
          )}
        </button>
      </form>
    </div>
  );
}

function AnalysisSummary({ result }: { result: OniricCase }) {
  const sections = [
    {
      label: "Estructura espacial",
      content: Object.entries(result.estructura_espacial)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · "),
    },
    {
      label: "Dinámicas",
      content: result.dinamicas.join(", "),
    },
    {
      label: "Emoción",
      content: `${result.emocion.principal} — ${result.emocion.clima_afectivo}`,
    },
    {
      label: "Traducción espacial",
      content: result.traduccion_espacial.potencial,
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <div
          key={s.label}
          className="p-4 rounded-xl border border-white/10 bg-white/[0.03]"
        >
          <div className="text-xs text-white/40 uppercase tracking-widest mb-1">
            {s.label}
          </div>
          <div className="text-sm text-white/80">{s.content}</div>
        </div>
      ))}
    </div>
  );
}
