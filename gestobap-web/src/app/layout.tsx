import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GestoBap | Baply Workspace",
  description: "Sistema de Gestão Integrada Baply",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-stone-50">
        {children}
      </body>
    </html>
  );
}