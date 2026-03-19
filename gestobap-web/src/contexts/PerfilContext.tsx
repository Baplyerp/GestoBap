"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase";

// Define a estrutura do nosso "Coração"
type PerfilContextData = {
  nome: string;
  avatar_url: string;
  cargo: string;
  status: string;
  nivel: string;
  email: string;
  atualizarPerfil: () => void; // Permite forçar uma atualização se necessário
};

const PerfilContext = createContext<PerfilContextData>({} as PerfilContextData);

export function PerfilProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [perfil, setPerfil] = useState({
    nome: "",
    avatar_url: "",
    cargo: "Colaborador",
    status: "Disponível",
    nivel: "Básico",
    email: "",
  });

  // Função que vai no cofre buscar os dados
  const carregarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: db } = await supabase.from("perfis").select("*").eq("id", user.id).single();
      if (db) {
        setPerfil({
          nome: db.nome || "Usuário",
          avatar_url: db.avatar_url || "",
          cargo: db.cargo || "Colaborador",
          status: db.status || "Disponível",
          nivel: db.nivel || "Básico",
          email: user.email || "",
        });
      }
    }
  };

  useEffect(() => {
    // Busca na primeira vez que o sistema abre
    carregarPerfil();

    // 📻 O RÁDIO: Escuta o sinal "perfilAtualizado" que disparamos na tela de Perfil
    window.addEventListener("perfilAtualizado", carregarPerfil);
    
    return () => window.removeEventListener("perfilAtualizado", carregarPerfil);
  }, [supabase]);

  return (
    <PerfilContext.Provider value={{ ...perfil, atualizarPerfil: carregarPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
}

// 🪄 A LINHA MÁGICA: O gancho que as outras telas vão usar para receber os dados!
export const usePerfil = () => useContext(PerfilContext);