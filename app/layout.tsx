import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onirograma — Cartografía Onírica",
  description:
    "Sistema de traducción perceptiva: transforma experiencias oníricas en variables espaciales para diseño.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
        <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-mist)", letterSpacing: "0.15em" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--color-mauve)", boxShadow: "0 0 6px var(--color-mauve)" }}
            />
            Onirograma
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Registrar sueño
            </Link>
            <Link
              href="/cases"
              className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Archivo onírico
            </Link>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer
          className="px-6 py-3 text-center"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "0.08em" }}
        >
          ONIROGRAMA · Sistema de cartografía onírico-espacial · Traducción perceptiva sin interpretación
        </footer>
      </body>
    </html>
  );
}
