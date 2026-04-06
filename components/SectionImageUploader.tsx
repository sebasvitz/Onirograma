"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SectionImage } from "@/types";

interface Props {
  caseId: string;
  section: string;
  initialImages: SectionImage[];
}

export default function SectionImageUploader({ caseId, section, initialImages }: Props) {
  const [images, setImages] = useState<SectionImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);

      try {
        const res = await fetch(`/api/cases/${caseId}/images`, {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Error al subir la imagen.");
        } else {
          setImages((prev) => [...prev, json.image as SectionImage]);
        }
      } catch {
        setError("Error de red. Inténtalo de nuevo.");
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (imageId: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/images/${imageId}`, { method: "DELETE" });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "No se pudo eliminar la imagen.");
      }
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    }
  };

  return (
    <div style={{ marginTop: "0.75rem" }}>
      {/* Image grid */}
      {images.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "0.6rem",
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                position: "relative",
                width: 80,
                height: 80,
                borderRadius: "0.6rem",
                overflow: "hidden",
                border: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              {/* Thumbnail — opens lightbox */}
              <button
                onClick={() => setLightbox(img.url)}
                title="Ver imagen"
                style={{ display: "block", width: "100%", height: "100%", padding: 0, border: "none", background: "none", cursor: "zoom-in" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt="Imagen de referencia"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </button>
              {/* Delete button */}
              <button
                onClick={() => handleDelete(img.id)}
                title="Eliminar imagen"
                style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "rgba(15,13,34,0.75)",
                  border: "1px solid rgba(237,232,255,0.2)",
                  color: "var(--text-muted)",
                  fontSize: "0.6rem",
                  lineHeight: 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            fontSize: "0.7rem",
            padding: "0.25rem 0.7rem",
            borderRadius: "9999px",
            border: "1px solid var(--border)",
            background: "none",
            color: "var(--text-muted)",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.5 : 1,
            letterSpacing: "0.05em",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
        >
          {uploading ? "Subiendo…" : "+ Imagen de referencia"}
        </button>
        {error && (
          <span style={{ fontSize: "0.7rem", color: "var(--color-petal)", opacity: 0.8 }}>
            {error}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Lightbox modal */}
      {lightbox && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de imagen"
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15,13,34,0.88)",
            backdropFilter: "blur(6px)",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "min(90vw, 900px)",
              maxHeight: "85vh",
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid var(--border)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              cursor: "default",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt="Vista previa ampliada"
              style={{
                display: "block",
                maxWidth: "min(90vw, 900px)",
                maxHeight: "85vh",
                objectFit: "contain",
              }}
            />
            <button
              onClick={() => setLightbox(null)}
              title="Cerrar"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(15,13,34,0.8)",
                border: "1px solid rgba(237,232,255,0.25)",
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
