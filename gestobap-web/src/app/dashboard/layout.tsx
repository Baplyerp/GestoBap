"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePerfil } from "@/contexts/PerfilContext";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { carregando } = usePerfil();

  // 🛡️ Se o cérebro ainda não buscou os dados, mostramos o "Loading Premium"
  if (carregando) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#A67B5B] mb-4" size={40} />
        <p className="text-stone-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
          Sincronizando Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 animate-in fade-in duration-500">
      <Header />
      <Sidebar />
      <main className="pt-24 pl-[104px] pr-8 pb-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}