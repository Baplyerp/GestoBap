"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { CheckCircle2, Clock, Target, Fingerprint, ShieldAlert, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
// 👇 IMPORTAMOS A LINHA MÁGICA DO NOSSO CORAÇÃO
import { usePerfil } from "@/contexts/PerfilContext"; 

export default function DashboardPage() {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [processandoPonto, setProcessandoPonto] = useState(false);
  const [pontoBatido, setPontoBatido] = useState(false);
  const [pontoId, setPontoId] = useState<string | null>(null);

  // 🪄 A LINHA MÁGICA: O Crachá agora pega os dados vivos do Coração
  const { nome, cargo, nivel, avatar_url } = usePerfil();

  // (Mock) Mantemos o código fixo por enquanto, até termos a tabela de ID de Funcionários
  const codigoFuncionario = "ID: BPL-001";

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Busca o último ponto
        const { data: historicoPonto } = await supabase
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
  }, [supabase]);

  const handlePonto = async () => {
    setProcessandoPonto(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Sessão expirada. Faça login novamente.");
      setProcessandoPonto(false);
      return;
    }

    if (!pontoBatido) {
      // ENTRADA
      const { data, error } = await supabase.from("registro_ponto").insert([
        { user_id: user.id, status: 'Em Operação' }
      ]).select();

      if (error) {
        toast.error(`Erro ao bater ponto: ${error.message}`);
      } else {
        toast.success("Ponto digital registrado com sucesso!", {
          description: "Seu turno foi iniciado no banco de dados."
        });
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
        toast.error(`Erro ao encerrar expediente: ${error.message}`);
      } else {
        toast.success("Expediente encerrado com sucesso!", {
          description: "Bom descanso."
        });
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
        <p>Conectando ao Supabase...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        {/* 🚨 A MARCA D'ÁGUA VISUAL 🚨 */}
        <h1 className="text-4xl font-black text-stone-900 tracking-tight">Visão Global (Conectado)</h1>
        <p className="text-stone-500 font-medium mt-1 italic">Centro de Comando Baply Workspace.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="col-span-1 space-y-6">
          <div className="bg-stone-900 rounded-[2rem] shadow-2xl shadow-stone-900/40 overflow-hidden relative border border-stone-800 group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A67B5B] rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex justify-between items-start mb-10">
                {/* 👇 O AVATAR SINCRONIZADO E COM EFEITO PRETO E BRANCO */}
                <div className="w-24 h-24 rounded-3xl bg-stone-100 border-4 border-[#A67B5B]/30 shadow-xl flex items-center justify-center text-5xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  {avatar_url ? (
                    <img src={avatar_url} alt="Avatar do Crachá" className="w-full h-full object-cover" />
                  ) : (
                    "👨‍💼"
                  )}
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-[10px] font-black text-[#A67B5B] uppercase tracking-[0.2em] backdrop-blur-md">
                    <Fingerprint size={12} /> {codigoFuncionario}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                {/* 👇 DADOS VIVOS E SINCRONIZADOS */}
                <h2 className="text-2xl font-bold text-white tracking-tight">{nome ? nome : "Carregando..."}</h2>
                <p className="text-[#A67B5B] font-bold text-xs uppercase tracking-widest pb-6">{cargo}</p>
                
                <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-stone-400 font-medium">Credencial</span>
                    <span className="font-bold text-stone-100 flex items-center gap-2">
                      <ShieldAlert size={14} className="text-[#A67B5B]" /> {nivel}
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

        {/* Metas Ocultadas para foco no Crachá */}
        <div className="col-span-1 xl:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-200 h-full flex flex-col items-center justify-center text-center">
            <Target size={48} className="text-stone-200 mb-4" />
            <h3 className="text-2xl font-black text-stone-900 tracking-tight mb-2">Área de Performance</h3>
            <p className="text-stone-500 max-w-sm">Metas visuais temporariamente ocultas para focarmos na conexão do Cérebro Baply.</p>
          </div>
        </div>

      </div>
    </div>
  );
}