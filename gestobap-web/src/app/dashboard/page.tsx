"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Fingerprint, 
  Users, 
  ShieldAlert, 
  LogOut 
} from "lucide-react";

export default function DashboardPage() {
  // Estado para simular o bater de ponto
  const [pontoBatido, setPontoBatido] = useState(false);

  // Mock de Dados para o Crachá Premium (Plano B 2.0)
  const usuario = {
    nome: "Jean Batista",
    cargo: "CEO & Fundador",
    nivel: "Admin (Acesso Total)",
    codigo: "ID: BPL-001"
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Cabeçalho de Boas-vindas */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-stone-900 tracking-tight">Visão Global</h1>
        <p className="text-stone-500 font-medium mt-1 italic">
          Centro de Comando Baply Workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 💳 COLUNA 1: O CRACHÁ DIGITAL PREMIUM */}
        <div className="col-span-1 space-y-6">
          
          <div className="bg-stone-900 rounded-[2rem] shadow-2xl shadow-stone-900/40 overflow-hidden relative border border-stone-800 group">
            
            {/* Efeito de Glow Caramelo no Fundo */}
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
                    <span className="text-stone-400 font-medium">Status do Turno</span>
                    <span className={`font-bold flex items-center gap-2 ${pontoBatido ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {pontoBatido ? <CheckCircle2 size={14} /> : <Clock size={14} />} 
                      {pontoBatido ? "Em Operação" : "Aguardando Ponto"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Ponto Digital Interativo */}
          <button 
            onClick={() => setPontoBatido(!pontoBatido)}
            className={`w-full py-5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              pontoBatido 
                ? "bg-stone-200 text-stone-500 shadow-stone-200/20 hover:bg-stone-300" 
                : "bg-stone-950 text-white shadow-stone-950/40 hover:bg-stone-800 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {pontoBatido ? <LogOut size={18} /> : <Fingerprint size={18} />}
            {pontoBatido ? "Encerrar Expediente" : "Bater Ponto Digital"}
          </button>
        </div>

        {/* 📊 COLUNA 2 e 3: ÁREA DE METAS E PRODUTIVIDADE */}
        <div className="col-span-1 xl:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Target size={120} />
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-[#A67B5B] shadow-lg shadow-stone-900/20">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight">Metas de Performance</h3>
                <p className="text-sm text-stone-500 font-medium">Indicadores em tempo real para a Baply.</p>
              </div>
            </div>
            
            <div className="space-y-10">
              {/* Meta 1 */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                      <TrendingUp size={14} className="text-[#A67B5B]" /> Financeiro
                    </span>
                    <h4 className="text-lg font-bold text-stone-900">Faturamento Global</h4>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-stone-900 italic">75%</span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase">R$ 45k / R$ 60k</span>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden p-1 border border-stone-200/50">
                  <div className="bg-gradient-to-r from-stone-900 to-[#A67B5B] h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-[#A67B5B]/20" style={{ width: "75%" }}></div>
                </div>
              </div>

              {/* Meta 2 */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                      <Users size={14} className="text-[#A67B5B]" /> Expansão
                    </span>
                    <h4 className="text-lg font-bold text-stone-900">Novos Clientes (CRM)</h4>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-stone-900 italic">40%</span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase">12 de 30 leads</span>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden p-1 border border-stone-200/50">
                  <div className="bg-stone-900 h-full rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}