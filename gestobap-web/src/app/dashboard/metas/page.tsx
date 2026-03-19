"use client";

import { 
  Target, 
  TrendingUp, 
  Award, 
  Zap, 
  Calendar, 
  ChevronRight, 
  CheckCircle2,
  Trophy
} from "lucide-react";

// Mock de dados: O que o colaborador precisa alcançar este mês
const METAS_ATUAIS = [
  { id: 1, titulo: "Vendas do Mês", atual: 35000, alvo: 50000, formato: "R$", cor: "bg-emerald-500", glow: "group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" },
  { id: 2, titulo: "Novos Clientes", atual: 18, alvo: 40, formato: "un", cor: "bg-blue-500", glow: "group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" },
  { id: 3, titulo: "Satisfação (NPS)", atual: 92, alvo: 95, formato: "%", cor: "bg-indigo-500", glow: "group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.8)]" },
];

export default function MinhasMetasPage() {
  return (
    <div className="animate-in fade-in duration-500 mb-20">
      
      {/* 🎯 CABEÇALHO DO MÓDULO */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-4 border border-amber-100 dark:border-amber-500/20">
            <Target size={14} className="animate-pulse" /> Ciclo de Março/2026
          </div>
          <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight transition-colors">Minhas Metas</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1 transition-colors">
            Acompanhe seu desempenho, conquiste objetivos e suba de nível.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all shadow-sm">
            <Calendar size={16} className="text-stone-400" /> Histórico
          </button>
        </div>
      </div>

      {/* 🏆 PLACAR GERAL (Scorecard) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Card Principal: Pontuação Global */}
        <div className="xl:col-span-2 bg-stone-900 dark:bg-stone-950 rounded-[2rem] p-8 border border-stone-800 shadow-xl relative overflow-hidden group flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-lg font-black text-white flex items-center gap-2 mb-1">
              <Trophy className="text-amber-400" size={20} /> Score de Performance
            </h2>
            <p className="text-stone-400 text-sm mb-6">Você está entre os 10% melhores da equipe este mês!</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white tracking-tighter">845</span>
              <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">Pontos</span>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <div className="w-32 h-32 rounded-full border-8 border-white/10 flex items-center justify-center relative">
               <div className="absolute inset-0 border-8 border-amber-400 rounded-full border-t-transparent border-l-transparent rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>
               <div className="text-center">
                 <Zap size={24} className="text-amber-400 mx-auto mb-1 animate-pulse" />
                 <span className="text-white font-black text-xl"> Nv. 4</span>
               </div>
            </div>
          </div>
        </div>

        {/* Card Secundário: Sequência (Streak) */}
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-8 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-center items-center text-center group cursor-default transition-colors">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] transition-all duration-500">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight mb-1">12 Dias</h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">Batendo a meta diária</p>
        </div>

      </div>

      {/* 📊 BARRAS DE PROGRESSO DAS METAS */}
      <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 border-b border-stone-100 dark:border-stone-700">
          <h3 className="font-black text-stone-900 dark:text-white text-xl flex items-center gap-2">
            Objetivos Principais (OKRs)
          </h3>
        </div>
        
        <div className="p-8 space-y-8">
          {METAS_ATUAIS.map((meta) => {
            const porcentagem = Math.min(Math.round((meta.atual / meta.alvo) * 100), 100);
            
            return (
              <div key={meta.id} className="group cursor-default">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-lg flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      {meta.titulo} 
                      {porcentagem >= 100 && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-stone-900 dark:text-white">
                      {meta.formato === "R$" ? `R$ ${meta.atual.toLocaleString('pt-BR')}` : meta.atual}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 font-medium ml-1">
                      / {meta.formato === "R$" ? `R$ ${meta.alvo.toLocaleString('pt-BR')}` : meta.alvo} {meta.formato !== "R$" && meta.formato}
                    </span>
                  </div>
                </div>

                {/* A Barra de Progresso Animada */}
                <div className="h-4 w-full bg-stone-100 dark:bg-stone-900 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full ${meta.cor} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                    style={{ width: `${porcentagem}%` }}
                  >
                    {/* Efeito de brilho passando dentro da barra */}
                    <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs font-bold transition-colors duration-500 ${meta.glow.replace('group-hover:', '')} opacity-0 group-hover:opacity-100 ${meta.cor.replace('bg-', 'text-')}`}>
                    +{porcentagem}% Concluído
                  </span>
                  <span className="text-xs font-medium text-stone-400">Restam {meta.alvo - meta.atual > 0 ? meta.alvo - meta.atual : 0} para a meta</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}