"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase"; 
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CircleDollarSign, 
  Package, 
  Users, 
  Megaphone, 
  LogOut,
  ShieldCheck, 
  FileArchive, // 👈 Ícone para os Relatórios
  Radar // 👈 Ícone para a Governança Ativa
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); 
  const supabase = createClient();

  // 🚀 FUNÇÃO DE DESLOGAR COM SEGURANÇA
  const handleSair = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    await supabase.auth.signOut(); 
    window.location.href = "/"; 
  };

  // 🗺️ O NOSSO MAPA DE NAVEGAÇÃO ATUALIZADO (Agora completo!)
  const menuItems = [
    { nome: "Visão Global", rota: "/dashboard", Icone: LayoutDashboard },
    { nome: "Vendas (PDV)", rota: "/dashboard/vendas", Icone: ShoppingCart },
    { nome: "Financeiro & CRM", rota: "/dashboard/financeiro", Icone: CircleDollarSign },
    { nome: "Estoque Omni", rota: "/dashboard/estoque", Icone: Package },
    { nome: "Gestão de Tropa", rota: "/dashboard/configuracoes", Icone: ShieldCheck }, 
    { nome: "Relatórios & DRE", rota: "/dashboard/relatorios", Icone: FileArchive }, // 👈 Nova Sala Adicionada!
    { nome: "Governança", rota: "/dashboard/governanca", Icone: Radar }, // 👈 Nova Sala Adicionada!
  ];

  return (
    <aside className="fixed left-4 top-24 bottom-6 w-[72px] hover:w-64 bg-stone-900 rounded-2xl shadow-2xl transition-all duration-300 ease-out group z-50 flex flex-col overflow-hidden border border-stone-800">
      
      {/* Container de navegação */}
      <nav className="flex-1 py-6 px-3 space-y-4 overflow-y-auto overflow-x-hidden flex flex-col items-start mt-2">
        {menuItems.map((item) => {
          const isAtivo = pathname === item.rota;
          const Icone = item.Icone;
          
          return (
            <Link
              key={item.nome}
              href={item.rota}
              className="flex items-center gap-4 w-full group/item"
            >
              {/* A Bolinha do Ícone */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover/item:scale-110 ${
                isAtivo 
                  ? 'bg-[#A67B5B] text-white shadow-[0_0_15px_rgba(166,123,91,0.5)]' 
                  : 'bg-stone-800 text-stone-400 group-hover/item:bg-stone-700 group-hover/item:text-white group-hover/item:shadow-[0_0_10px_rgba(255,255,255,0.05)]'
              }`}>
                <Icone size={22} strokeWidth={isAtivo ? 2.5 : 2} />
              </div>
              
              {/* O Texto */}
              <span className={`whitespace-nowrap font-medium transition-all duration-300 ease-out origin-left ${
                isAtivo ? 'text-white' : 'text-stone-400 group-hover/item:text-white'
              } opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100`}>
                {item.nome}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Botão de Sair */}
      <div className="p-3 mb-2 shrink-0">
        <button 
          onClick={handleSair} 
          className="flex items-center gap-4 w-full group/item"
        >
          <div className="w-12 h-12 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover/item:scale-110 group-hover/item:bg-red-950 group-hover/item:text-red-400 group-hover/item:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <LogOut size={22} />
          </div>
          <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap font-medium text-stone-400 transition-all duration-300 origin-left scale-95 group-hover:scale-100 group-hover/item:text-red-400">
            Sair do Sistema
          </span>
        </button>
      </div>
    </aside>
  );
}