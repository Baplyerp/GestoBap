"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner"; // Nosso alto-falante chique
import { 
  ShieldAlert, Users, Clock, Search, Plus, MoreVertical, 
  CheckCircle2, XCircle, Filter, Loader2, X, Mail, Briefcase, UserPlus
} from "lucide-react";

export default function GestaoControlePage() {
  const supabase = createClient();
  const [abaAtiva, setAbaAtiva] = useState("equipe");
  
  const [equipe, setEquipe] = useState<any[]>([]);
  const [pontos, setPontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 NOVOS ESTADOS PARA A TELA DE CONTRATAÇÃO
  const [modalAberto, setModalAberto] = useState(false);
  const [processandoCadastro, setProcessandoCadastro] = useState(false);
  const [novoColaborador, setNovoColaborador] = useState({
    nome: "",
    email: "",
    cargo: "",
    nivel: "Básico"
  });

  // 🚀 NOVOS ESTADOS PARA O MENU DE AÇÕES DA TABELA
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);

  // Fecha o menu se o usuário clicar fora dele
  useEffect(() => {
    const handleClickFora = () => setMenuAbertoId(null);
    window.addEventListener('click', handleClickFora);
    return () => window.removeEventListener('click', handleClickFora);
  }, []);

  // Simulações das Ações do Menu
  const handleEditarColaborador = (id: string, nome: string, cargo: string, nivel: string) => {
    // Preenche o formulário com os dados atuais do funcionário
    setColaboradorEditando({ id, nome, cargo: cargo || "", nivel: nivel || "Básico" });
    setModalEdicaoAberto(true); // Abre o modal de edição
    setMenuAbertoId(null); // Fecha o menuzinho dos 3 pontinhos
  };

  const handleDesligarColaborador = (id: string, nome: string) => {
    toast.error(`Desligando ${nome}...`, { description: "Em breve: Exclusão no banco de dados." });
    setMenuAbertoId(null);
  };

  // 🚀 ESTADOS DO MODAL DE EDIÇÃO
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [processandoEdicao, setProcessandoEdicao] = useState(false);
  const [colaboradorEditando, setColaboradorEditando] = useState({ id: "", nome: "", cargo: "", nivel: "" });

  // 🚀 AÇÃO REAL DE ATUALIZAR NO BANCO
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessandoEdicao(true);

    try {
      const { error } = await supabase
        .from("perfis")
        .update({ 
          cargo: colaboradorEditando.cargo, 
          nivel: colaboradorEditando.nivel 
        })
        .eq("id", colaboradorEditando.id); // Onde o ID for igual ao do funcionário que estamos editando

      if (error) throw error;

      toast.success(`Perfil atualizado!`, { description: `Os dados de ${colaboradorEditando.nome} foram salvos.` });
      setModalEdicaoAberto(false);
      carregarPainelAdmin(); // Atualiza a tabela na hora!

    } catch (erro: any) {
      toast.error("Erro ao atualizar", { description: erro.message });
    } finally {
      setProcessandoEdicao(false);
    }
  };

  // 1. FUNÇÃO DE CARREGAMENTO SEPARADA (Para atualizar a tabela depois de contratar)
  const carregarPainelAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: perfilExiste } = await supabase.from("perfis").select("id").eq("id", user.id).single();
      if (!perfilExiste) {
        await supabase.from("perfis").insert([{
          id: user.id, nome: "Jean Batista", cargo: "CEO & Fundador", nivel: "Admin"
        }]);
      }
    }

    const { data: perfisData } = await supabase.from("perfis").select("*").order("nome", { ascending: true });
    if (perfisData) setEquipe(perfisData);

    const { data: pontosData } = await supabase.from("registro_ponto").select("*").order("hora_entrada", { ascending: false });
    if (pontosData) setPontos(pontosData);

    setLoading(false);
  };

  // 2. CHAMA A FUNÇÃO QUANDO A TELA ABRE
  useEffect(() => {
    carregarPainelAdmin();
  }, []);

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

  // 3. 🚀 AÇÃO DO BOTÃO CONECTADA AO COFRE (API)
  const handleCadastrarColaborador = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessandoCadastro(true);
    
    try {
      // Bate na porta do cofre e entrega a ficha do novo recruta
      const resposta = await fetch("/api/convite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoColaborador),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro desconhecido ao enviar convite.");
      }

      // Se o e-mail foi enviado e o perfil criado, avisa com estilo!
      toast.success(`${novoColaborador.nome} recrutado com sucesso!`, {
        description: `Um e-mail oficial foi enviado para ${novoColaborador.email}`
      });

      setModalAberto(false);
      setNovoColaborador({ nome: "", email: "", cargo: "", nivel: "Básico" }); // Limpa o formulário
      
      // Atualiza a tabela na mesma hora
      carregarPainelAdmin();

    } catch (erro: any) {
      toast.error("Falha na Contratação", {
        description: erro.message
      });
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A67B5B]/10 text-[#A67B5B] text-xs font-black uppercase tracking-widest mb-3 border border-[#A67B5B]/20">
            <ShieldAlert size={14} /> Acesso Restrito
          </div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight">Gestão & Controle</h1>
          <p className="text-stone-500 font-medium mt-1">Administração central do Baply Workspace.</p>
        </div>
        
        {/* LIGAMOS O BOTÃO AO MODAL AQUI! */}
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-stone-900/20 active:scale-95"
        >
          <Plus size={18} /> Novo Colaborador
        </button>
      </div>

      <div className="flex items-center gap-8 border-b border-stone-200 mb-8">
        <button 
          onClick={() => setAbaAtiva("equipe")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "equipe" ? "border-[#A67B5B] text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"}`}
        >
          <Users size={18} className={abaAtiva === "equipe" ? "text-[#A67B5B]" : ""} /> 
          Controle de Tropa ({equipe.length})
        </button>
        <button 
          onClick={() => setAbaAtiva("ponto")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "ponto" ? "border-[#A67B5B] text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"}`}
        >
          <Clock size={18} className={abaAtiva === "ponto" ? "text-[#A67B5B]" : ""} /> 
          Auditoria de Ponto ({pontos.length})
        </button>
      </div>

      {/* --- ABA EQUIPE --- */}
      {abaAtiva === "equipe" && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input type="text" placeholder="Buscar colaborador..." className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B]/30 transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 text-stone-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Colaborador</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Nível de Acesso</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {equipe.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-lg border border-stone-200">👨‍💼</div>
                        <div>
                          <p className="text-sm font-bold text-stone-900">{user.nome}</p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5">ID: {user.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-700">{user.cargo || 'Não definido'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${user.nivel?.includes('Admin') ? 'bg-stone-900 text-[#A67B5B]' : 'bg-stone-100 text-stone-600'}`}>
                        {user.nivel || 'Básico'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      {/* O botão dos 3 pontinhos */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que o clique feche o menu imediatamente
                          setMenuAbertoId(menuAbertoId === user.id ? null : user.id);
                        }}
                        className="text-stone-400 hover:text-stone-900 transition-colors p-2 rounded-lg hover:bg-stone-100"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* O Menu Flutuante (Dropdown) */}
                      {menuAbertoId === user.id && (
                        <div 
                          className="absolute right-8 top-10 w-48 bg-white rounded-xl shadow-xl shadow-stone-900/10 border border-stone-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                          onClick={(e) => e.stopPropagation()} // Mantém o menu aberto ao clicar dentro dele
                        >
                          <div className="py-1">
                            <button 
                              onClick={() => handleEditarColaborador(user.id, user.nome, user.cargo, user.nivel)}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                              Editar Perfil
                            </button>
                            <button 
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                              Revogar Acesso
                            </button>
                            <div className="h-px bg-stone-100 my-1"></div>
                            <button 
                              onClick={() => handleDesligarColaborador(user.id, user.nome)}
                              className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Desligar Colaborador
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ABA PONTO DIGITAL --- */}
      {abaAtiva === "ponto" && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h3 className="font-bold text-stone-900">Registros Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 text-stone-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Colaborador</th>
                  <th className="px-6 py-4">Entrada</th>
                  <th className="px-6 py-4">Saída</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pontos.map((registro) => (
                  <tr key={registro.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-stone-900">{formatarData(registro.hora_entrada)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-700">{getNomeColaborador(registro.user_id)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-600">{formatarHora(registro.hora_entrada)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-600">{registro.hora_saida === null ? "-- : --" : formatarHora(registro.hora_saida)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${registro.status === 'Em Operação' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-stone-100 text-stone-500 border border-stone-200'}`}>
                        {registro.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🚀 O MODAL FLUTUANTE DE CONTRATAÇÃO 🚀 */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          {/* Fundo escurecido/embaçado */}
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setModalAberto(false)} // Fecha se clicar fora
          ></div>
          
          {/* O Cartão do Formulário */}
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-[#A67B5B] flex items-center justify-center shadow-lg shadow-stone-900/20">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-lg">Adicionar à Tropa</h3>
                  <p className="text-xs text-stone-500 font-medium">Cadastre um novo talento no GestoBap</p>
                </div>
              </div>
              <button 
                onClick={() => setModalAberto(false)}
                className="text-stone-400 hover:text-stone-900 hover:bg-stone-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCadastrarColaborador} className="p-8 space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={novoColaborador.nome}
                  onChange={(e) => setNovoColaborador({...novoColaborador, nome: e.target.value})}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all"
                  placeholder="Ex: Carlos Oliveira"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={novoColaborador.email}
                    onChange={(e) => setNovoColaborador({...novoColaborador, email: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all"
                    placeholder="carlos@baply.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={novoColaborador.cargo}
                      onChange={(e) => setNovoColaborador({...novoColaborador, cargo: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all"
                      placeholder="Gerente de Vendas"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Nível de Acesso</label>
                  <select 
                    value={novoColaborador.nivel}
                    onChange={(e) => setNovoColaborador({...novoColaborador, nivel: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all appearance-none font-medium text-stone-700"
                  >
                    <option value="Básico">Operacional (Básico)</option>
                    <option value="Gerência">Gerência</option>
                    <option value="Admin">Administrador Total</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={processandoCadastro}
                  className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processandoCadastro ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {processandoCadastro ? "Processando..." : "Enviar Convite"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 🚀 MODAL FLUTUANTE DE EDIÇÃO 🚀 */}
      {modalEdicaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setModalEdicaoAberto(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 border-2 border-[#A67B5B]/30 flex items-center justify-center text-lg shadow-sm">
                  👨‍💼
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-lg">Editar Perfil</h3>
                  <p className="text-xs text-stone-500 font-medium">Atualize os dados de {colaboradorEditando.nome}</p>
                </div>
              </div>
              <button onClick={() => setModalEdicaoAberto(false)} className="text-stone-400 hover:text-stone-900 hover:bg-stone-100 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input 
                      type="text" required value={colaboradorEditando.cargo}
                      onChange={(e) => setColaboradorEditando({...colaboradorEditando, cargo: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Nível de Acesso</label>
                  <select 
                    value={colaboradorEditando.nivel}
                    onChange={(e) => setColaboradorEditando({...colaboradorEditando, nivel: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all appearance-none font-medium text-stone-700"
                  >
                    <option value="Básico">Operacional (Básico)</option>
                    <option value="Gerência">Gerência</option>
                    <option value="Admin">Administrador Total</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalEdicaoAberto(false)} className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={processandoEdicao} className="flex-1 px-5 py-3 rounded-xl font-bold text-sm bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-stone-900/20 disabled:opacity-50 flex items-center justify-center gap-2">
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