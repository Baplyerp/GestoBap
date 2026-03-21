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
  carregando: boolean; // 👈 Nossa sentinela de carregamento
  atualizarPerfil: () => void;
};

const PerfilContext = createContext<PerfilContextData>({} as PerfilContextData);

export function PerfilProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [carregando, setCarregando] = useState(true);
  const [perfil, setPerfil] = useState({
    nome: "",
    avatar_url: "",
    cargo: "Colaborador",
    status: "Disponível",
    nivel: "",
    email: "",
  });

  // Função que vai no cofre buscar os dados
  const carregarPerfil = async () => {
    setCarregando(true); // Força a sentinela a avisar que está trabalhando
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
        } else {
          // Fallback caso o usuário logue, mas a tabela de perfil ainda não tenha sincronizado
          setPerfil((prev) => ({ ...prev, email: user.email || "" }));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setCarregando(false); // Libera a tela
    }
  };

  useEffect(() => {
    // 1. Busca na primeira vez que o sistema abre
    carregarPerfil();

    // 🚨 2. O GRANDE SEGREDO: O Ouvinte do Supabase!
    // Ele fica escutando se alguém faz login ou logout na aplicação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        // O usuário acabou de logar! Vamos buscar o perfil dele na hora.
        carregarPerfil();
      } else if (event === "SIGNED_OUT") {
        // O usuário saiu. Limpamos o cérebro.
        setPerfil({
          nome: "", avatar_url: "", cargo: "Colaborador", status: "Disponível", nivel: "", email: ""
        });
      }
    });

    // 📻 3. O RÁDIO: Escuta o sinal "perfilAtualizado" que disparamos na tela de Perfil
    window.addEventListener("perfilAtualizado", carregarPerfil);
    
    return () => {
      window.removeEventListener("perfilAtualizado", carregarPerfil);
      authListener.subscription.unsubscribe(); // Desliga o ouvinte para não dar vazamento de memória
    };
  }, [supabase]);

  return (
    <PerfilContext.Provider value={{ ...perfil, carregando, atualizarPerfil: carregarPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
}

// 🪄 A LINHA MÁGICA: O gancho que as outras telas vão usar para receber os dados!
export const usePerfil = () => useContext(PerfilContext);