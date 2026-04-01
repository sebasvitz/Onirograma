import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./globals.scss";

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
      <body className="h-full" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
        {/* Floating transparent header */}
        <header className="site-header">
          <Link href="/" className="site-logo">
            <span className="logo-dot" />
            Onirograma
          </Link>

          <nav className="site-nav">
            <Link href="/" className="site-nav-link">
              Inicio
            </Link>
            <Link href="/cases" className="site-nav-link">
              Biblioteca
            </Link>
          </nav>
        </header>

        {/* Noise grain overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        <main style={{ height: "100%" }}>{children}</main>
      </body>
    </html>
  );
}
