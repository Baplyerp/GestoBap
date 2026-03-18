"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { ChevronDown, User, Moon, LogOut, ShieldAlert } from "lucide-react";

export default function Header() {
  const supabase = createClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado real conectado ao banco
  const [usuario, setUsuario] = useState({ 
    nome: "Carregando...", 
    cargo: "...",
    email: "...",
    isAdmin: false 
  });

  // Busca os dados do usuário logado
  useEffect(() => {
    async function carregarPerfilHeader() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: perfil } = await supabase
          .from("perfis")
          .select("nome, cargo, nivel")
          .eq("id", user.id)
          .single();

        if (perfil) {
          setUsuario({
            nome: perfil.nome,
            cargo: perfil.cargo || "Colaborador",
            email: user.email || "",
            isAdmin: perfil.nivel === "Admin"
          });
        }
      }
    }
    carregarPerfilHeader();

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
    <header className="fixed top-0 left-0 right-0 h-20 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 z-40 flex items-center justify-between px-8 pl-[104px] transition-all duration-300">
      
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-[#A67B5B] font-black text-xl shadow-lg shadow-stone-900/20">
          B
        </div>
        <span className="text-2xl font-black tracking-tighter text-stone-900">
          Baply<span className="text-[#A67B5B]">.</span>
        </span>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 bg-white border border-stone-200 pl-4 pr-2 py-1.5 rounded-full shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-200 group focus:outline-none"
        >
          <div className="flex flex-col text-right mr-1">
            <span className="text-sm font-bold text-stone-900 leading-tight group-hover:text-[#A67B5B] transition-colors">
              {usuario.nome.split(' ')[0]} {/* Mostra só o primeiro nome */}
            </span>
            <span className="text-xs text-stone-500 font-medium leading-tight">{usuario.cargo}</span>
          </div>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl border-2 border-white shadow-inner overflow-hidden">
              👨‍💼
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <ChevronDown size={16} className={`text-stone-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 py-2 animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="px-4 py-3 border-b border-stone-100 mb-2">
              <p className="text-sm font-bold text-stone-900">Conta Corporativa</p>
              <p className="text-xs text-stone-500 truncate">{usuario.email}</p>
            </div>
            
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors">
              <User size={18} className="text-stone-400" /> Meu Perfil
            </Link>
            
            {usuario.isAdmin && (
              <Link href="/dashboard/configuracoes" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                <ShieldAlert size={18} className="text-[#A67B5B]" /> Gestão & Controle
              </Link>
            )}

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors text-left">
              <Moon size={18} className="text-stone-400" /> Tema Escuro <span className="ml-auto text-[10px] bg-stone-100 px-2 py-0.5 rounded-full text-stone-500">Em breve</span>
            </button>
            
            <div className="h-px bg-stone-100 my-2"></div>
            
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
              <LogOut size={18} /> Encerrar Sessão
            </button>
          </div>
        )}
      </div>
    </header>
  );
}