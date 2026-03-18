"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Fingerprint, 
  Users, 
  ShieldAlert, 
  LogOut,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [processandoPonto, setProcessandoPonto] = useState(false);
  const [pontoBatido, setPontoBatido] = useState(false);
  const [pontoId, setPontoId] = useState<string | null>(null);

  const [usuario, setUsuario] = useState({
    nome: "Jean Batista (Local)",
    cargo: "CEO & Fundador",
    nivel: "Admin",
    codigo: "ID: BPL-001"
  });

  // CARREGAMENTO: Verifica a sessão e o histórico
  useEffect(() => {
    async function carregarDados() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Usuário não está logado no Supabase!", authError);
        // Não interrompe a tela, mas avisa no console
      } else {
        // Puxa o último ponto
        const { data: historicoPonto, error: erroBusca } = await supabase
          .from("registro_ponto")
          .select("*")
          .eq("user_id", user.id)
          .order("hora_entrada", { ascending: false })
          .limit(1);

        if (historicoPonto && historicoPonto.length > 0) {
          if (historicoPonto[0].hora_saida === null) {
            setPontoBatido(true);
            setPontoId(historicoPonto[0].id);
          }
        }
      }
      setLoading(false);
    }
    carregarDados();
  }, []);

  // AÇÃO DO BOTÃO: Com alertas na tela para investigarmos!
  const handlePonto = async () => {
    setProcessandoPonto(true);
    
    // 1. Verifica se sabe quem é você
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      alert("❌ ERRO DE SESSÃO: O sistema não detectou o seu login. Volte na tela inicial e faça login novamente com seu e-mail e senha!");
      setProcessandoPonto(false);
      return;
    }

    if (!pontoBatido) {
      // ENTRADA
      const { data, error } = await supabase.from("registro_ponto").insert([
        { user_id: user.id }
      ]).select();

      if (error) {
        alert(`❌ O BANCO RECUSOU A GRAVAÇÃO!\nMotivo: ${error.message}\nDetalhes: ${error.details}`);
      } else {
        alert("✅ PONTO GRAVADO NO SUPABASE COM SUCESSO!");
        setPontoBatido(true);
        if (data && data.length > 0) setPontoId(data[0].id);
      }
    } else if (pontoId) {
      // SAÍDA
      const horaAgora = new Date().toISOString();
      const { error } = await supabase
        .from("registro_ponto")
        .update({ hora_saida: horaAgora, status: 'Turno Encerrado' })
        .eq("id", pontoId);

      if (error) {
        alert(`❌ ERRO AO REGISTRAR SAÍDA: ${error.message}`);
      } else {
        alert("✅ SAÍDA REGISTRADA COM SUCESSO!");
        setPontoBatido(false);
        setPontoId(null);
      }
    }
    setProcessandoPonto(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Sincronizando Cérebro Baply...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* O resto da tela continua igualzinho, chique e elegante! */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-stone-900 tracking-tight">Visão Global</h1>
        <p className="text-stone-500 font-medium mt-1 italic">Centro de Comando Baply Workspace.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <div className="bg-stone-900 rounded-[2rem] shadow-2xl shadow-stone-900/40 overflow-hidden relative border border-stone-800 group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A67B5B] rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-24 h-24 rounded-3xl bg-stone-100 border-4 border-[#A67B5B]/30 shadow-xl flex items-center justify-center text-5xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  👨‍💼
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-[10px] font-black text-[#A67B5B] uppercase tracking-[0.2em] backdrop-blur-md">
                    <Fingerprint size={12} /> {usuario.codigo}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">{usuario.nome}</h2>
                <p className="text-[#A67B5B] font-bold text-xs uppercase tracking-widest pb-6">{usuario.cargo}</p>
                
                <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-stone-400 font-medium">Credencial</span>
                    <span className="font-bold text-stone-100 flex items-center gap-2">
                      <ShieldAlert size={14} className="text-[#A67B5B]" /> {usuario.nivel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-stone-400 font-medium">Status</span>
                    <span className={`font-bold flex items-center gap-2 ${pontoBatido ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {pontoBatido ? <CheckCircle2 size={14} /> : <Clock size={14} />} 
                      {pontoBatido ? "Em Operação" : "Aguardando Ponto"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePonto}
            disabled={processandoPonto}
            className={`w-full py-5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              processandoPonto ? "opacity-50 cursor-not-allowed" : ""
            } ${
              pontoBatido 
                ? "bg-stone-200 text-stone-500 shadow-stone-200/20 hover:bg-stone-300" 
                : "bg-stone-950 text-white shadow-stone-950/40 hover:bg-stone-800 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {processandoPonto ? <Loader2 size={18} className="animate-spin" /> : pontoBatido ? <LogOut size={18} /> : <Fingerprint size={18} />}
            {processandoPonto ? "Sincronizando..." : pontoBatido ? "Encerrar Expediente" : "Bater Ponto Digital"}
          </button>
        </div>

        {/* ... (Área de Metas - Apenas placeholder visual) ... */}
        <div className="col-span-1 xl:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-200 h-full">
            <h3 className="text-2xl font-black text-stone-900 tracking-tight mb-8">Área de Dados</h3>
            <p className="text-stone-500">As metas continuam aqui, ocultas no código para focar no teste do botão.</p>
          </div>
        </div>
      </div>
    </div>
  );
}