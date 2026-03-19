import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    // 👇 1. Adicionado o suppressHydrationWarning
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
        
        {/* 👇 2. O ThemeProvider agora "abraça" todo o sistema */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          {/* O nosso sistema de notificações premium */}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        
      </body>
    </html>
  );
}