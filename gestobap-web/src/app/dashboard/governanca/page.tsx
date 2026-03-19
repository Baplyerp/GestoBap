"use client";

import { 
  Radar, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Users, 
  FileText, 
  Search,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

// Mock de dados para visualizarmos o layout antes de plugar no banco
const ATIVIDADES_RECENTES = [
  { id: 1, usuario: "Maria Silva", acao: "Aprovou o relatório financeiro Q1", tempo: "Há 5 min", status: "success" },
  { id: 2, usuario: "Sistema", acao: "Backup automático concluído", tempo: "Há 12 min", status: "info" },
  { id: 3, usuario: "Carlos Mendes", acao: "Tentativa de login falha", tempo: "Há 45 min", status: "warning" },
  { id: 4, usuario: "Ana Costa", acao: "Alterou as permissões do grupo 'Vendas'", tempo: "Há 2 horas", status: "info" },
];

export default function GovernancaPage() {
  return (
    <div className="animate-in fade-in duration-500 mb-20">
      
      {/* 🚨 CABEÇALHO DO MÓDULO */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-4 border border-indigo-100 dark:border-indigo-500/20">
            <Radar size={14} className="animate-pulse" /> Monitoramento Ativo
          </div>
          <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight transition-colors">Radar de Governança</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1 transition-colors">
            Auditoria de processos, controle interno e rastreabilidade em tempo real.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Auditar logs..." 
              className="pl-9 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-stone-900 dark:text-white w-64 shadow-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-sm rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-all shadow-md">
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* 📊 MÉTRICAS PRINCIPAIS (Com Efeito Glow Premium ✨) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { 
            titulo: "Índice de Conformidade", valor: "98.5%", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10",
            glowClass: "group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] group-hover:scale-110" 
          },
          { 
            titulo: "Alertas Críticos", valor: "0", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10",
            glowClass: "drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse scale-110" 
          },
          { 
            titulo: "Sessões Ativas", valor: "12", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10",
            glowClass: "group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] group-hover:scale-110" 
          },
          { 
            titulo: "Logs Registrados (24h)", valor: "1.432", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10",
            glowClass: "group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.8)] group-hover:scale-110" 
          }
        ].map((metrica, i) => (
          <div key={i} className="group bg-white dark:bg-stone-800 rounded-[1.5rem] p-6 border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300 flex items-center gap-4 cursor-default">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metrica.bg} ${metrica.color} shrink-0 transition-colors`}>
              <metrica.icon size={24} className={`transition-all duration-500 ${metrica.glowClass}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{metrica.titulo}</p>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1 group-hover:translate-x-1 transition-transform duration-300">{metrica.valor}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🧩 BENTO GRID DE ANÁLISE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Painel Esquerdo: Log de Atividades (Ocupa 2 colunas) */}
        <div className="xl:col-span-2 bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center">
            <h3 className="font-black text-stone-900 dark:text-white text-lg flex items-center gap-2">
              <Activity className="text-indigo-500" size={20} /> Feed de Operações
            </h3>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-100 transition-colors">
              Ver Histórico Completo
            </span>
          </div>
          
          <div className="flex-1 p-6">
            <div className="space-y-6">
              {ATIVIDADES_RECENTES.map((atividade) => (
                // 👇 Adicionado "group" e "cursor-default" para escutar o mouse na linha toda
                <div key={atividade.id} className="group flex gap-4 items-start relative before:absolute before:left-[11px] before:top-8 before:bottom-[-24px] before:w-[2px] before:bg-stone-100 dark:before:bg-stone-700 last:before:hidden cursor-default">
                  
                  {/* 👇 Bolinha do tempo com efeito glow Dinâmico */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-stone-800 transition-all duration-500 ${
                    atividade.status === 'success' ? 'bg-emerald-500 group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 
                    atividade.status === 'warning' ? 'bg-amber-500 scale-125 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse' : 
                    'bg-indigo-400 group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]'
                  }`}>
                    {atividade.status === 'success' && <CheckCircle2 size={10} className="text-white" />}
                    {atividade.status === 'warning' && <AlertTriangle size={10} className="text-white" />}
                  </div>
                  
                  {/* 👇 Texto desliza e a hora ganha cor ao passar o mouse */}
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <p className="text-sm font-medium text-stone-900 dark:text-white leading-none mb-1">
                      <span className="font-bold">{atividade.usuario}</span> {atividade.acao}
                    </p>
                    <span className="text-xs font-medium text-stone-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">{atividade.tempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Painel Direito: Ações Rápidas de Auditoria */}
        <div className="col-span-1 space-y-6">
          <div className="bg-stone-900 dark:bg-stone-950 rounded-[2rem] p-8 border border-stone-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <h3 className="text-xl font-black text-white mb-2 relative z-10">Central de Conformidade</h3>
            <p className="text-stone-400 text-sm mb-6 relative z-10">Execute varreduras de segurança e emita relatórios de auditoria com um clique.</p>
            
            <div className="space-y-3 relative z-10">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left group/btn">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" /> Varredura de Acessos
                </span>
                <ChevronDown size={14} className="text-stone-500 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left group/btn">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-blue-400" /> Relatório DRE & Fiscal
                </span>
                <ChevronDown size={14} className="text-stone-500 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}