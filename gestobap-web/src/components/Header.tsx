"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  User, 
  ShieldAlert, 
  Target, 
  Activity,
  Radar // 👈 O novo ícone para o Radar de Governança
} from "lucide-react";

// 👇 Importando a Linha Mágica do Coração!
import { usePerfil } from "@/contexts/PerfilContext"; 

// As mesmas cores do Perfil para sincronizar a bolinha do crachá
const STATUS_COLORS: Record<string, string> = {
  "Disponível": "bg-emerald-500",
  "Focado": "bg-red-500",
  "Almoço": "bg-amber-500",
  "Ausente": "bg-stone-400"
};

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🪄 A LINHA MÁGICA: O Header agora escuta o Coração (PerfilProvider)
  const { nome, cargo, email, nivel, status, avatar_url } = usePerfil();

  // Verifica se é admin com base no nível global
  const isAdmin = nivel === "Admin";

  useEffect(() => {
    // Lógica para fechar o menu ao clicar fora
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 z-40 flex items-center justify-between px-8 pl-[104px] transition-colors duration-300">
      
      {/* O LOGO VOLTOU! */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-[#A67B5B] font-black text-xl shadow-lg shadow-stone-900/20">
          B
        </div>
        <span className="text-2xl font-black tracking-tighter text-stone-900 dark:text-white transition-colors">
          Baply<span className="text-[#A67B5B]">.</span>
        </span>
      </div>
      
      {/* O MINI-CRACHÁ SINCRONIZADO */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 pl-4 pr-2 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group focus:outline-none"
        >
          <div className="flex flex-col text-right mr-1">
            <span className="text-sm font-bold text-stone-900 dark:text-white leading-tight group-hover:text-[#A67B5B] transition-colors">
              {nome ? nome.split(' ')[0] : "Carregando..."}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-tight">{cargo}</span>
          </div>
          
          <div className="relative">
            {/* O Avatar Sincronizado! */}
            {avatar_url ? (
              <img src={avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-stone-800 shadow-inner" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xl border-2 border-white dark:border-stone-800 shadow-inner overflow-hidden">
                👨‍💼
              </div>
            )}
            {/* Bolinha de Status Dinâmica */}
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${STATUS_COLORS[status] || 'bg-stone-400'} border-2 border-white dark:border-stone-800 rounded-full shadow-sm`}></div>
          </div>
          
          <ChevronDown size={16} className={`text-stone-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* O MENU FLUTUANTE (DROPDOWN) */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 py-2 animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            
            {/* 1. Header do Menu (Conta) */}
            <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 mb-2">
              <p className="text-sm font-bold text-stone-900 dark:text-white">Conta Corporativa</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{email || "..."}</p>
            </div>
            
            {/* 2. Ferramentas do Colaborador */}
            <Link href="/dashboard/perfil" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors">
              <User size={18} className="text-stone-400" /> Meu Perfil
            </Link>
            
            <Link href="/dashboard/metas" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors">
              <Target size={18} className="text-stone-400" /> Minhas Metas <span className="ml-auto text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full text-stone-500">Novo</span>
            </Link>

            {/* Status Dinâmico */}
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors text-left group/status">
              <Activity size={18} className={`${status === 'Focado' ? 'text-red-500' : status === 'Almoço' ? 'text-amber-500' : status === 'Ausente' ? 'text-stone-400' : 'text-emerald-500'} group-hover/status:scale-110 transition-transform`} /> 
              Status: {status}
            </button>
            
            {/* 3. Área de Governança (Apenas Admins) */}
            {isAdmin && (
              <>
                <div className="h-px bg-stone-100 dark:bg-stone-800 my-2"></div>
                <div className="px-4 py-1">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Administração</p>
                </div>
                <Link href="/dashboard/configuracoes" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors">
                  <ShieldAlert size={18} className="text-[#A67B5B]" /> Gestão de Tropa
                </Link>
              </>
            )}

            <div className="h-px bg-stone-100 dark:bg-stone-800 my-2"></div>
            
            {/* 4. Radar de Governança (ATIVADO!) */}
            <Link href="/dashboard/governanca" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors text-left group/radar">
              <Radar size={18} className="text-stone-400 group-hover/radar:text-indigo-500 transition-colors" /> Radar de Governança
            </Link>
            
          </div>
        )}
      </div>
    </header>
  );
}