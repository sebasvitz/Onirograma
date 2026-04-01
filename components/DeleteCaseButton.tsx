"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCaseButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/cases");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "No se pudo eliminar el sueño.");
        setConfirming(false);
      }
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  if (confirming) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>¿Eliminar?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            fontSize: "0.72rem",
            padding: "0.25rem 0.65rem",
            borderRadius: "9999px",
            border: "1px solid rgba(251,216,224,0.35)",
            background: "rgba(251,216,224,0.08)",
            color: "var(--color-petal)",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "..." : "Confirmar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            fontSize: "0.72rem",
            padding: "0.25rem 0.65rem",
            borderRadius: "9999px",
            border: "1px solid var(--border)",
            background: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
      <button
        onClick={() => { setConfirming(true); setError(null); }}
        style={{
          fontSize: "0.72rem",
          padding: "0.25rem 0.65rem",
          borderRadius: "9999px",
          border: "1px solid var(--border)",
          background: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--color-petal)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(251,216,224,0.35)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        }}
      >
        Eliminar sueño
      </button>
      {error && (
        <span style={{ fontSize: "0.68rem", color: "var(--color-petal)" }}>{error}</span>
      )}
    </div>
  );
}
