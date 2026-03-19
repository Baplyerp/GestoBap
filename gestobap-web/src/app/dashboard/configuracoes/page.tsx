"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  ShieldAlert, Users, Clock, Search, MoreVertical, 
  CheckCircle2, Filter, Loader2, X, Mail, Briefcase, UserPlus,
  Shield, Activity, ShieldCheck
} from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  "Disponível": "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Focado": "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  "Almoço": "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "Ausente": "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700"
};

const STATUS_DOT: Record<string, string> = {
  "Disponível": "bg-emerald-500",
  "Focado": "bg-red-500",
  "Almoço": "bg-amber-500",
  "Ausente": "bg-stone-400"
};

export default function GestaoControlePage() {
  const supabase = createClient();
  const [abaAtiva, setAbaAtiva] = useState("equipe");
  
  const [equipe, setEquipe] = useState<any[]>([]);
  const [pontos, setPontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Motores de busca
  const [buscaEquipe, setBuscaEquipe] = useState("");
  const [buscaPonto, setBuscaPonto] = useState("");

  // 🚀 NOVOS ESTADOS: Filtros Avançados
  const [menuFiltroAberto, setMenuFiltroAberto] = useState(false);
  const [filtroNivel, setFiltroNivel] = useState("Todos"); // "Todos" | "Admin"
  const [filtroStatus, setFiltroStatus] = useState("Todos"); // "Todos" | "Online"
  const filtroRef = useRef<HTMLDivElement>(null);

  // Estados dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [processandoCadastro, setProcessandoCadastro] = useState(false);
  const [novoColaborador, setNovoColaborador] = useState({ nome: "", email: "", cargo: "", nivel: "Básico" });

  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [processandoEdicao, setProcessandoEdicao] = useState(false);
  const [colaboradorEditando, setColaboradorEditando] = useState({ id: "", nome: "", cargo: "", nivel: "" });

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      // Fecha o menu de 3 pontinhos
      setMenuAbertoId(null);
      // Fecha o menu de filtros se clicar fora
      if (filtroRef.current && !filtroRef.current.contains(event.target as Node)) {
        setMenuFiltroAberto(false);
      }
    };
    window.addEventListener('click', handleClickFora);
    return () => window.removeEventListener('click', handleClickFora);
  }, []);

  const handleEditarColaborador = (id: string, nome: string, cargo: string, nivel: string) => {
    setColaboradorEditando({ id, nome, cargo: cargo || "", nivel: nivel || "Básico" });
    setModalEdicaoAberto(true);
    setMenuAbertoId(null);
  };

  // 🚀 AÇÃO DE DESLIGAR (REAL): Remove do Banco e da Tela!
  const handleDesligarColaborador = async (id: string, nome: string) => {
    const confirmacao = window.confirm(`Tem certeza que deseja revogar o acesso de ${nome}?`);
    if (!confirmacao) return;

    try {
      // 1. Remove visualmente na mesma hora (Sensação de rapidez)
      setEquipe(equipe.filter(user => user.id !== id));
      setMenuAbertoId(null);
      
      // 2. Apaga da tabela perfis no Supabase (Revoga o acesso)
      const { error } = await supabase.from("perfis").delete().eq("id", id);
      if (error) throw error;
      
      toast.success(`${nome} foi desligado(a) da tropa.`);
    } catch (error: any) {
      toast.error("Erro ao desligar", { description: error.message });
      carregarPainelAdmin(); // Se der erro, recarrega a lista
    }
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessandoEdicao(true);
    try {
      const { error } = await supabase.from("perfis").update({ cargo: colaboradorEditando.cargo, nivel: colaboradorEditando.nivel }).eq("id", colaboradorEditando.id);
      if (error) throw error;
      toast.success(`Perfil atualizado!`, { description: `Os dados de ${colaboradorEditando.nome} foram salvos.` });
      setModalEdicaoAberto(false);
      carregarPainelAdmin();
    } catch (erro: any) {
      toast.error("Erro ao atualizar", { description: erro.message });
    } finally {
      setProcessandoEdicao(false);
    }
  };

  const carregarPainelAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfilExiste } = await supabase.from("perfis").select("id").eq("id", user.id).single();
      if (!perfilExiste) {
        await supabase.from("perfis").insert([{ id: user.id, nome: "Jean Batista", cargo: "CEO & Fundador", nivel: "Admin" }]);
      }
    }
    const { data: perfisData } = await supabase.from("perfis").select("*").order("nome", { ascending: true });
    if (perfisData) setEquipe(perfisData);

    const { data: pontosData } = await supabase.from("registro_ponto").select("*").order("hora_entrada", { ascending: false });
    if (pontosData) setPontos(pontosData);

    setLoading(false);
  };

  useEffect(() => { carregarPainelAdmin(); }, []);

  const formatarData = (dataIso: string) => new Date(dataIso).toLocaleDateString('pt-BR');
  const formatarHora = (dataIso: string | null) => {
    if (!dataIso) return "--:--";
    return new Date(dataIso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getNomeColaborador = (userId: string) => {
    const colaborador = equipe.find(p => p.id === userId);
    if (colaborador && colaborador.nome) return colaborador.nome;
    return `ID: ${userId.substring(0, 8).toUpperCase()}`;
  };

  const handleCadastrarColaborador = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessandoCadastro(true);
    try {
      const resposta = await fetch("/api/convite", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoColaborador),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Erro desconhecido ao enviar convite.");
      toast.success(`${novoColaborador.nome} recrutado com sucesso!`, { description: `Um e-mail oficial foi enviado para ${novoColaborador.email}` });
      setModalAberto(false);
      setNovoColaborador({ nome: "", email: "", cargo: "", nivel: "Básico" });
      carregarPainelAdmin();
    } catch (erro: any) {
      toast.error("Falha na Contratação", { description: erro.message });
    } finally {
      setProcessandoCadastro(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Sincronizando dados da matriz...</p>
      </div>
    );
  }

  const totalAdmins = equipe.filter(u => u.nivel === 'Admin').length;
  const totalOnline = equipe.filter(u => u.status === 'Disponível' || u.status === 'Focado').length;

  // 🚀 LÓGICA REFINADA: Busca + Filtros Avançados
  const equipeFiltrada = equipe.filter((user) => {
    const termo = buscaEquipe.toLowerCase();
    const bateTexto = (user.nome || "").toLowerCase().includes(termo) ||
                      (user.cargo || "").toLowerCase().includes(termo) ||
                      (user.email || "").toLowerCase().includes(termo);
    
    const bateNivel = filtroNivel === "Todos" || (filtroNivel === "Admin" && user.nivel === "Admin");
    const bateStatus = filtroStatus === "Todos" || (filtroStatus === "Online" && (user.status === "Disponível" || user.status === "Focado"));

    return bateTexto && bateNivel && bateStatus;
  });

  const pontosFiltrados = pontos.filter((ponto) => {
    const termo = buscaPonto.toLowerCase();
    const nome = getNomeColaborador(ponto.user_id).toLowerCase();
    const status = (ponto.status || "").toLowerCase();
    return nome.includes(termo) || status.includes(termo);
  });

  // Indicador visual se há filtros ativos
  const temFiltroAtivo = filtroNivel !== "Todos" || filtroStatus !== "Todos";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative mb-20">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-[#A67B5B] text-xs font-bold mb-4 shadow-sm">
            <ShieldAlert size={14} /> Administração Central
          </div>
          <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight transition-colors">Gestão & Controle</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1 transition-colors">Administração central do Baply Workspace.</p>
        </div>
        
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-stone-900/20 hover:shadow-[#A67B5B]/30 dark:hover:shadow-white/20 active:scale-95 group"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" /> Novo Colaborador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="group bg-white dark:bg-stone-800 p-6 rounded-[1.5rem] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300 flex items-center gap-4 cursor-default">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-500 shrink-0 transition-colors">
            <Users size={24} className="transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] group-hover:scale-110" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-0.5">Efetivo Total</p>
            <div className="text-3xl font-black text-stone-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">{equipe.length}</div>
          </div>
        </div>

        <div className="group bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-500/20 transition-all duration-300 flex items-center gap-4 cursor-default relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 relative z-10 transition-colors">
            <Activity size={24} className="transition-all duration-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse scale-110" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Online Agora</p>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300 group-hover:translate-x-1 transition-transform duration-300">{totalOnline}</div>
          </div>
          <Activity size={80} className="absolute -right-4 -bottom-4 text-emerald-200 dark:text-emerald-900/30 opacity-50 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="group bg-white dark:bg-stone-800 p-6 rounded-[1.5rem] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300 flex items-center gap-4 cursor-default">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shrink-0 transition-colors">
            <ShieldCheck size={24} className="transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.8)] group-hover:scale-110" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-0.5">Administradores</p>
            <div className="text-3xl font-black text-stone-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">{totalAdmins}</div>
          </div>
        </div>

        <div className="group bg-stone-900 dark:bg-stone-950 p-6 rounded-[1.5rem] border border-stone-800 shadow-xl transition-all duration-300 flex items-center gap-4 cursor-default relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#A67B5B] rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-700"></div>
           <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 text-[#A67B5B] shrink-0 relative z-10 transition-colors">
            <Mail size={24} className="transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(166,123,91,0.8)] group-hover:scale-110" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-0.5">Convites Pendentes</p>
            <div className="text-3xl font-black text-[#A67B5B] group-hover:translate-x-1 transition-transform duration-300">0</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-stone-200 dark:border-stone-700 mb-8 transition-colors">
        <button onClick={() => setAbaAtiva("equipe")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "equipe" ? "border-[#A67B5B] text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <Users size={18} className={`transition-all ${abaAtiva === "equipe" ? "text-[#A67B5B] drop-shadow-[0_0_8px_rgba(166,123,91,0.5)] scale-110" : ""}`} /> Controle de Tropa ({equipeFiltrada.length})
        </button>
        <button onClick={() => setAbaAtiva("ponto")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "ponto" ? "border-[#A67B5B] text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <Clock size={18} className={`transition-all ${abaAtiva === "ponto" ? "text-[#A67B5B] drop-shadow-[0_0_8px_rgba(166,123,91,0.5)] scale-110" : ""}`} /> Auditoria de Ponto ({pontosFiltrados.length})
        </button>
      </div>

      {/* --- ABA EQUIPE --- */}
      {abaAtiva === "equipe" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-stone-50/50 dark:bg-stone-900/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                value={buscaEquipe}
                onChange={(e) => setBuscaEquipe(e.target.value)}
                placeholder="Buscar por nome ou cargo..." 
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all text-stone-900 dark:text-white font-medium" 
              />
            </div>
            
            {/* 🚀 BOTÃO DE FILTROS AVANÇADOS COM DROPDOWN */}
            <div className="relative" ref={filtroRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setMenuFiltroAberto(!menuFiltroAberto); }}
                className="flex items-center gap-2 px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors w-full md:w-auto justify-center group relative"
              >
                <Filter size={16} className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-colors" /> 
                Filtros
                {/* Bolinha vermelha se tiver filtro ativo */}
                {temFiltroAtivo && <span className="absolute top-2 right-2 w-2 h-2 bg-[#A67B5B] rounded-full animate-pulse"></span>}
              </button>

              {menuFiltroAberto && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-700 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Nível de Acesso</p>
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setFiltroNivel("Todos")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${filtroNivel === "Todos" ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900" : "bg-transparent text-stone-500 border-stone-200 dark:border-stone-700"}`}>Todos</button>
                    <button onClick={() => setFiltroNivel("Admin")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${filtroNivel === "Admin" ? "bg-[#A67B5B]/10 text-[#A67B5B] border-[#A67B5B]/20" : "bg-transparent text-stone-500 border-stone-200 dark:border-stone-700"}`}>Admin</button>
                  </div>

                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Disponibilidade</p>
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setFiltroStatus("Todos")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${filtroStatus === "Todos" ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900" : "bg-transparent text-stone-500 border-stone-200 dark:border-stone-700"}`}>Todos</button>
                    <button onClick={() => setFiltroStatus("Online")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${filtroStatus === "Online" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-transparent text-stone-500 border-stone-200 dark:border-stone-700"}`}>Online</button>
                  </div>
                  
                  {temFiltroAtivo && (
                    <button onClick={() => { setFiltroNivel("Todos"); setFiltroStatus("Todos"); }} className="w-full mt-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                      Limpar Filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold">
                  <th className="p-6">Colaborador</th>
                  <th className="p-6">Contato</th>
                  <th className="p-6">Nível de Acesso</th>
                  <th className="p-6">Status Atual</th>
                  <th className="p-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {equipeFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-500 dark:text-stone-400 font-medium">
                      Nenhum colaborador encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  equipeFiltrada.map((user) => {
                    const statusAtual = user.status || "Disponível"; 
                    return (
                      <tr key={user.id} className="group hover:bg-stone-50 dark:hover:bg-stone-700/20 transition-colors cursor-default">
                        <td className="p-6">
                          <div className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-2xl border-2 border-white dark:border-stone-700 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(166,123,91,0.5)] group-hover:border-[#A67B5B]/30 overflow-hidden">
                              {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : "👨‍💼"}
                            </div>
                            <div>
                              <p className="font-bold text-stone-900 dark:text-white group-hover:text-[#A67B5B] transition-colors">{user.nome}</p>
                              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">{user.cargo || 'Não definido'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 font-medium">
                            <Mail size={14} className="text-stone-400" /> {user.email || `ID: ${user.id.substring(0,8)}`}
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${user.nivel === 'Admin' ? 'bg-stone-900 text-[#A67B5B] border-stone-800 dark:bg-[#A67B5B]/10 dark:text-[#A67B5B] dark:border-[#A67B5B]/20 group-hover:shadow-[0_0_10px_rgba(166,123,91,0.3)]' : 'bg-white text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'}`}>
                            {user.nivel === 'Admin' && <Shield size={12} />} {user.nivel || 'Básico'}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-transform group-hover:scale-[1.02] ${STATUS_STYLE[statusAtual] || STATUS_STYLE["Ausente"]}`}>
                            <div className="relative flex h-2 w-2 items-center justify-center">
                              {statusAtual === 'Disponível' && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${STATUS_DOT[statusAtual]} opacity-75`}></span>}
                              <span className={`relative inline-flex h-2 w-2 rounded-full ${STATUS_DOT[statusAtual] || 'bg-stone-400'}`}></span>
                            </div>
                            {statusAtual}
                          </div>
                        </td>
                        <td className="p-6 text-center relative">
                          <button onClick={(e) => { e.stopPropagation(); setMenuAbertoId(menuAbertoId === user.id ? null : user.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-[#A67B5B] hover:bg-[#A67B5B]/10 dark:hover:text-[#A67B5B] dark:hover:bg-[#A67B5B]/10 transition-colors mx-auto group-hover:scale-110">
                            <MoreVertical size={18} />
                          </button>
                          {menuAbertoId === user.id && (
                            <div className="absolute right-12 top-10 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-xl shadow-stone-900/10 border border-stone-100 dark:border-stone-700 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="py-1">
                                <button onClick={() => handleEditarColaborador(user.id, user.nome, user.cargo, user.nivel)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">Editar Perfil</button>
                                <div className="h-px bg-stone-100 dark:bg-stone-700 my-1"></div>
                                {/* 👇 O botão de Desligar agora aciona a função que apaga de verdade */}
                                <button onClick={() => handleDesligarColaborador(user.id, user.nome)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Desligar Colaborador</button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-5 border-t border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 text-center flex justify-between items-center">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Mostrando <span className="font-bold text-stone-900 dark:text-white">{equipeFiltrada.length}</span> de {equipe.length} colaboradores.
            </p>
          </div>
        </div>
      )}

      {/* --- ABA PONTO DIGITAL --- */}
      {abaAtiva === "ponto" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-stone-50/50 dark:bg-stone-900/30">
            <h3 className="font-bold text-stone-900 dark:text-white hidden md:block">Registros Recentes</h3>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                value={buscaPonto}
                onChange={(e) => setBuscaPonto(e.target.value)}
                placeholder="Filtrar por nome ou status..." 
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all text-stone-900 dark:text-white font-medium" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                  <th className="p-6">Data</th>
                  <th className="p-6">Colaborador</th>
                  <th className="p-6">Entrada</th>
                  <th className="p-6">Saída</th>
                  <th className="p-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {pontosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-500 dark:text-stone-400 font-medium">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  pontosFiltrados.map((registro) => (
                    <tr key={registro.id} className="group hover:bg-stone-50 dark:hover:bg-stone-700/20 transition-colors cursor-default">
                      <td className="p-6 text-sm font-bold text-stone-900 dark:text-white group-hover:translate-x-1 transition-transform">{formatarData(registro.hora_entrada)}</td>
                      <td className="p-6 text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-[#A67B5B] transition-colors">{getNomeColaborador(registro.user_id)}</td>
                      <td className="p-6 text-sm font-medium text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{formatarHora(registro.hora_entrada)}</td>
                      <td className="p-6 text-sm font-medium text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{registro.hora_saida === null ? "-- : --" : formatarHora(registro.hora_saida)}</td>
                      <td className="p-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-transform group-hover:scale-105 ${registro.status === 'Em Operação' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-stone-100 text-stone-500 border border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'}`}>
                          {registro.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-5 border-t border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 text-center">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Mostrando <span className="font-bold text-stone-900 dark:text-white">{pontosFiltrados.length}</span> registros de auditoria.
            </p>
          </div>
        </div>
      )}

      {/* MANTIVE OS MODAIS INTACTOS PARA NÃO DEIXAR O CÓDIGO AINDA MAIOR, JÁ ESTÃO 100% OK */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setModalAberto(false)}></div>
          <div className="relative bg-white dark:bg-stone-900 w-full max-w-lg rounded-[2rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-[#A67B5B] flex items-center justify-center shadow-lg">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 dark:text-white text-lg">Adicionar à Tropa</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Cadastre um novo talento no GestoBap</p>
                </div>
              </div>
              <button onClick={() => setModalAberto(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCadastrarColaborador} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Nome Completo</label>
                <input type="text" required value={novoColaborador.nome} onChange={(e) => setNovoColaborador({...novoColaborador, nome: e.target.value})} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all dark:text-white" placeholder="Ex: Carlos Oliveira" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="email" required value={novoColaborador.email} onChange={(e) => setNovoColaborador({...novoColaborador, email: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all dark:text-white" placeholder="carlos@baply.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input type="text" required value={novoColaborador.cargo} onChange={(e) => setNovoColaborador({...novoColaborador, cargo: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all dark:text-white" placeholder="Gerente de Vendas" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Nível de Acesso</label>
                  <select value={novoColaborador.nivel} onChange={(e) => setNovoColaborador({...novoColaborador, nivel: e.target.value})} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all appearance-none font-medium text-stone-700 dark:text-stone-300">
                    <option value="Básico">Operacional (Básico)</option>
                    <option value="Gerência">Gerência</option>
                    <option value="Admin">Administrador Total</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalAberto(false)} className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">Cancelar</button>
                <button type="submit" disabled={processandoCadastro} className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {processandoCadastro ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {processandoCadastro ? "Processando..." : "Enviar Convite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEdicaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setModalEdicaoAberto(false)}></div>
          <div className="relative bg-white dark:bg-stone-900 w-full max-w-lg rounded-[2rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border-2 border-[#A67B5B]/30 flex items-center justify-center text-lg shadow-sm">👨‍💼</div>
                <div>
                  <h3 className="font-black text-stone-900 dark:text-white text-lg">Editar Perfil</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Atualize os dados de {colaboradorEditando.nome}</p>
                </div>
              </div>
              <button onClick={() => setModalEdicaoAberto(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSalvarEdicao} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input type="text" required value={colaboradorEditando.cargo} onChange={(e) => setColaboradorEditando({...colaboradorEditando, cargo: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Nível de Acesso</label>
                  <select value={colaboradorEditando.nivel} onChange={(e) => setColaboradorEditando({...colaboradorEditando, nivel: e.target.value})} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all appearance-none font-medium text-stone-700 dark:text-stone-300">
                    <option value="Básico">Operacional (Básico)</option>
                    <option value="Gerência">Gerência</option>
                    <option value="Admin">Administrador Total</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalEdicaoAberto(false)} className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">Cancelar</button>
                <button type="submit" disabled={processandoEdicao} className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {processandoEdicao ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {processandoEdicao ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}