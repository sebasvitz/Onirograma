import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onirograma — Análisis Onírico Espacial",
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
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed] font-sans">
        <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-wide hover:opacity-80 transition-opacity">
            ◉ Onirograma
          </Link>
          <nav className="flex gap-6 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">
              Nuevo análisis
            </Link>
            <Link href="/cases" className="hover:text-white transition-colors">
              Archivo onírico
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 px-6 py-3 text-xs text-white/30 text-center">
          Onirograma — Cartografía Onírica · Sistema de traducción perceptiva-espacial
        </footer>
      </body>
    </html>
  );
}
