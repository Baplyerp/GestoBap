import type { Metadata } from "next";
import { Toaster } from "sonner";
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
        {/* O nosso sistema de notificações premium */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}