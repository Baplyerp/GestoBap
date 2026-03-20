"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase";

type PerfilContextData = {
  nome: string;
  avatar_url: string;
  cargo: string;
  status: string;
  nivel: string;
  email: string;
  carregando: boolean; // 👈 A nova sentinela
  atualizarPerfil: () => void;
};

const PerfilContext = createContext<PerfilContextData>({} as PerfilContextData);

export function PerfilProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [carregando, setCarregando] = useState(true); // 👈 Começa esperando
  const [perfil, setPerfil] = useState({
    nome: "",
    avatar_url: "",
    cargo: "Colaborador",
    status: "Disponível",
    nivel: "", // 👈 Começa vazio para evitar acessos indevidos
    email: "",
  });

  const carregarPerfil = async () => {
    try {
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
    } finally {
      setCarregando(false); // 👈 Pronto! O cérebro terminou de pensar
    }
  };

  useEffect(() => {
    carregarPerfil();
    window.addEventListener("perfilAtualizado", carregarPerfil);
    return () => window.removeEventListener("perfilAtualizado", carregarPerfil);
  }, []);

  return (
    <PerfilContext.Provider value={{ ...perfil, carregando, atualizarPerfil: carregarPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
}

export const usePerfil = () => useContext(PerfilContext);