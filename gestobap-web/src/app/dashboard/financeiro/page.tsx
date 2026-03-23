"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { 
  DollarSign, TrendingUp, TrendingDown, Users, 
  Search, MessageCircle, AlertTriangle, FileText, 
  BrainCircuit, CheckCircle2, ChevronRight, X, 
  CalendarDays, SmartphoneNfc, ArrowUpRight, ArrowDownRight,
  MessageCircleHeart, Loader2, Landmark, Sparkles,
  Bot, History, Wallet, Target, UserPlus, MapPin, Edit2, Trash2
} from "lucide-react";

// ============================================================================
// 🚀 MOCKS DE ALTA FIDELIDADE (Até o Supabase encher de dados reais)
// ============================================================================
const DESPESAS_MOCK = [
  { id: "DESP-001", descricao: "Fornecedor: Buddemeyer (Lote Toalhas)", valor: 2450.00, vencimento: "2026-03-25", status: "Pendente", categoria: "Estoque" },
  { id: "DESP-002", descricao: "Aluguel da Loja", valor: 3200.00, vencimento: "2026-03-10", status: "Pago", categoria: "Custo Fixo" },
  { id: "DESP-003", descricao: "Tráfego Pago (Instagram Ads)", valor: 500.00, vencimento: "2026-03-15", status: "Pago", categoria: "Marketing" },
];

// O DIRETÓRIO CENTRAL DE CLIENTES
const CLIENTES_MOCK = [
  { id: "CLI-101", cliente: "Ana Costa", telefone: "5511999999999", endereco: "Rua das Flores, 123 - Centro", valor_pendente: 145.00, atraso: 12, status_divida: "Atrasado", risco: "Atenção", ltv: 1250.00, cashback: 15.00, ultima_interacao: "Lembrete via IA (Há 2 dias)" },
  { id: "CLI-102", cliente: "Maria Souza", telefone: "5511888888888", endereco: "Av. Paulista, 1000 - Bela Vista", valor_pendente: 89.90, atraso: 0, status_divida: "No Prazo", risco: "Excelente", ltv: 3400.00, cashback: 45.50, ultima_interacao: "Agradecimento (Há 1 mês)" },
  { id: "CLI-103", cliente: "Juliana Silva", telefone: "5511777777777", endereco: "Rua Augusta, 500 - Consolação", valor_pendente: 450.00, atraso: 45, status_divida: "Crítico", risco: "Crítico", ltv: 450.00, cashback: 0.00, ultima_interacao: "Promessa Quebrada (Há 15 dias)" },
];

export default function FinanceiroCRMPage() {
  const supabase = createClient();

  const [abaAtiva, setAbaAtiva] = useState("clientes"); // Começando na nova aba
  const [loading, setLoading] = useState(true);
  const [isInicializado, setIsInicializado] = useState(false);
  
  // ESTADOS DO CRM DE COBRANÇA
  const [modalCobranca, setModalCobranca] = useState(false);
  const [clienteAlvo, setClienteAlvo] = useState<any>(null);
  const [estrategiaIA, setEstrategiaIA] = useState("amigavel");
  const [gerandoMensagem, setGerandoMensagem] = useState(false);
  const [mensagemGerada, setMensagemGerada] = useState("");
  const [automacaoLigada, setAutomacaoLigada] = useState(false);

  // ESTADOS DO CEO IA
  const [analisandoDados, setAnalisandoDados] = useState(false);
  const [relatorioCEO, setRelatorioCEO] = useState("");

  // 👇 NOVOS ESTADOS: CARTEIRA DE CLIENTES
  const [buscaCliente, setBuscaCliente] = useState("");
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [formCliente, setFormCliente] = useState({ nome: "", telefone: "", cpf: "", endereco: "" });
  const [salvandoCliente, setSalvandoCliente] = useState(false);

  const receitaMes = 18450.00;
  const despesasPagas = DESPESAS_MOCK.filter(d => d.status === "Pago").reduce((acc, d) => acc + d.valor, 0);
  const totalReceber = CLIENTES_MOCK.reduce((acc, r) => acc + r.valor_pendente, 0);
  const inadimplencia = CLIENTES_MOCK.filter(r => r.atraso > 0).reduce((acc, r) => acc + r.valor_pendente, 0);
  const lucroLiquidoAtual = receitaMes - despesasPagas;

  // ==========================================================================
  // 🛡️ MEMÓRIA MUSCULAR DO CRM E CADASTRO (AUTO-SAVE)
  // ==========================================================================
  useEffect(() => {
    // Memória da Cobrança
    const draftMsg = localStorage.getItem("@baply_crm_msg");
    const draftEstrategia = localStorage.getItem("@baply_crm_estrategia");
    const draftClienteId = localStorage.getItem("@baply_crm_cliente_id");

    // Memória do Cadastro de Cliente
    const draftFormCliente = localStorage.getItem("@baply_crm_form_novo_cli");

    if (draftMsg) setMensagemGerada(draftMsg);
    if (draftEstrategia) setEstrategiaIA(draftEstrategia);
    if (draftFormCliente) setFormCliente(JSON.parse(draftFormCliente));
    
    if (draftClienteId) {
      const cli = CLIENTES_MOCK.find(c => c.id === draftClienteId);
      if (cli) {
        setClienteAlvo(cli);
        setModalCobranca(true);
      }
    }

    setLoading(false);
    setIsInicializado(true);
  }, []);

  useEffect(() => {
    if (isInicializado) {
      if (modalCobranca && clienteAlvo) {
        localStorage.setItem("@baply_crm_msg", mensagemGerada);
        localStorage.setItem("@baply_crm_estrategia", estrategiaIA);
        localStorage.setItem("@baply_crm_cliente_id", clienteAlvo.id);
      }
      if (modalNovoCliente) {
        localStorage.setItem("@baply_crm_form_novo_cli", JSON.stringify(formCliente));
      }
    }
  }, [mensagemGerada, estrategiaIA, clienteAlvo, modalCobranca, formCliente, modalNovoCliente, isInicializado]);

  const fecharModalCRM = () => {
    setModalCobranca(false);
    setMensagemGerada("");
    setClienteAlvo(null);
    localStorage.removeItem("@baply_crm_msg");
    localStorage.removeItem("@baply_crm_estrategia");
    localStorage.removeItem("@baply_crm_cliente_id");
  };

  const fecharModalNovoCliente = () => {
    setModalNovoCliente(false);
    setFormCliente({ nome: "", telefone: "", cpf: "", endereco: "" });
    localStorage.removeItem("@baply_crm_form_novo_cli");
  };

  // ==========================================================================

  const abrirCobranca = (cliente: any) => {
    setClienteAlvo(cliente);
    if (clienteAlvo?.id !== cliente.id) setMensagemGerada("");
    setModalCobranca(true);
  };

  const salvarNovoCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCliente.nome || !formCliente.telefone) {
      toast.error("Nome e WhatsApp são obrigatórios!");
      return;
    }
    
    setSalvandoCliente(true);
    setTimeout(() => {
      // 🚀 AQUI ENTRARÁ O INSERT NO SUPABASE FUTURAMENTE
      toast.success(`${formCliente.nome} cadastrada com sucesso!`);
      setSalvandoCliente(false);
      fecharModalNovoCliente();
    }, 1500);
  };

  const gerarMensagemIA = () => {
    setGerandoMensagem(true);
    setTimeout(() => {
      let msg = "";
      if (estrategiaIA === "amigavel") {
        msg = `Olá, ${clienteAlvo.cliente.split(' ')[0]}! Tudo bem com você? 🌸\n\nAqui é do setor financeiro da Sweet Home. Passando rapidinho só para te lembrar da sua parcela do Sweet Flex no valor de R$ ${clienteAlvo.valor_pendente.toFixed(2).replace('.', ',')}, que acabou passando do vencimento.\n\nEsqueceu? Não tem problema nenhum! Posso te mandar a chave Pix atualizada para baixarmos isso no sistema? 🥰`;
      } else if (estrategiaIA === "negociacao") {
        msg = `Olá, ${clienteAlvo.cliente.split(' ')[0]}. Tudo bem?\n\nConsta em nosso sistema um atraso de ${clienteAlvo.atraso} dias referente à sua parcela de R$ ${clienteAlvo.valor_pendente.toFixed(2).replace('.', ',')}. \n\nPara mantermos o seu limite do Sweet Flex ativo e evitarmos o bloqueio de juros, preparamos uma isenção especial das multas se o acerto for feito hoje. Como podemos te ajudar a regularizar essa pendência? 🤝`;
      } else {
        msg = `Oiii, ${clienteAlvo.cliente.split(' ')[0]}! ✨ Passando para agradecer por manter seus pagamentos em dia! Como recompensa, você tem R$ ${clienteAlvo.cashback.toFixed(2).replace('.', ',')} de Cashback liberado para usar na loja! Venha nos visitar. 🛍️💖`;
      }
      setMensagemGerada(msg);
      setGerandoMensagem(false);
      toast.success("Mensagem persuasiva gerada com sucesso!");
    }, 1500);
  };

  const gerarRelatorioCEO = () => {
    setAnalisandoDados(true);
    setTimeout(() => {
      const relatorio = `
### 📊 Diagnóstico Executivo Unit Economics
**Saúde Geral:** O caixa está operando com superávit. O lucro líquido atual é de **R$ ${lucroLiquidoAtual.toLocaleString('pt-BR')}**, representando uma excelente margem de contribuição.

**🚨 Alertas Críticos:**
1. **Inadimplência (Sweet Flex):** Temos **R$ ${inadimplencia.toLocaleString('pt-BR')}** retidos na rua. A cliente *Juliana Silva* (Risco Crítico) teve quebra de promessa há 15 dias. Bloqueio sistêmico recomendado.
2. **Custo de Aquisição (Marketing):** O investimento de R$ 500,00 no Instagram. O CAC (Custo de Aquisição) está em R$ 45,00 por cliente, enquanto o LTV médio da base está em R$ 1.200,00. Uma proporção excelente de 26x. A máquina está saudável.

**💡 Ação Tática de Growth:**
Utilize o módulo de CRM hoje para acionar os clientes com *Risco Excelente* que possuem saldo de *Cashback* preso. Ofereça um atendimento VIP via WhatsApp. Isso aumenta o LTV sem gastar R$ 1 a mais em Ads.
      `;
      setRelatorioCEO(relatorio);
      setAnalisandoDados(false);
      toast.success("Relatório estratégico finalizado.");
    }, 2500);
  };

  const clientesFiltrados = CLIENTES_MOCK.filter(c => 
    c.cliente.toLowerCase().includes(buscaCliente.toLowerCase()) || 
    c.telefone.includes(buscaCliente)
  );

  if (loading) return null;

  return (
    <div className="animate-in fade-in duration-500 mb-20 relative">
      
      {/* 🚨 CABEÇALHO */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-[#A67B5B] text-xs font-bold mb-4 shadow-sm">
            <Landmark size={14} /> Centro Operacional Baply
          </div>
          <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight transition-colors">CRM, Clientes & Financeiro</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1 transition-colors">
            Gerencie sua base de clientes, recupere inadimplentes e cruze dados financeiros reais.
          </p>
        </div>
      </div>

      {/* 📊 MÉTRICAS GLOBAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-stone-800 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowUpRight size={20} strokeWidth={3}/></div>
            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg">Entradas</span>
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">Receita do Mês</p>
            <h3 className="text-3xl font-black text-stone-900 dark:text-white">R$ {receitaMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowDownRight size={20} strokeWidth={3}/></div>
            <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider rounded-lg">Saídas</span>
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">Contas Pagas</p>
            <h3 className="text-3xl font-black text-stone-900 dark:text-white">R$ {despesasPagas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-[2rem] border border-amber-200 dark:border-amber-500/20 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <AlertTriangle size={100} className="absolute -right-6 -bottom-6 text-amber-200 dark:text-amber-900/30 opacity-40 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform"><CalendarDays size={20} strokeWidth={3}/></div>
            <span className="px-2.5 py-1 bg-white/50 dark:bg-stone-900/50 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg backdrop-blur-sm">A Receber</span>
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1">Sweet Flex (Dívida Ativa)</p>
            <h3 className="text-3xl font-black text-amber-800 dark:text-amber-300">R$ {totalReceber.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
            <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wider">R$ {inadimplencia.toLocaleString('pt-BR', {minimumFractionDigits: 2})} em Atraso</p>
          </div>
        </div>

        <div className="bg-stone-900 dark:bg-stone-950 p-6 rounded-[2rem] border border-stone-800 shadow-xl transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A67B5B] rounded-full blur-[60px] opacity-20"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#A67B5B]/20 text-[#A67B5B] flex items-center justify-center group-hover:scale-110 transition-transform"><DollarSign size={20} strokeWidth={3}/></div>
            <span className="px-2.5 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-wider rounded-lg">DRE</span>
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Lucro Líquido</p>
            <h3 className="text-3xl font-black text-white">R$ {lucroLiquidoAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          </div>
        </div>
      </div>

      {/* 🧭 NAVEGAÇÃO DE ABAS */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-stone-200 dark:border-stone-700 mb-8 transition-colors overflow-x-auto whitespace-nowrap scrollbar-hide">
        {/* 👇 NOVA ABA: CARTEIRA DE CLIENTES */}
        <button onClick={() => setAbaAtiva("clientes")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "clientes" ? "border-indigo-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <Users size={18} className={`transition-all ${abaAtiva === "clientes" ? "text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] scale-110" : ""}`} /> Diretório de Clientes
        </button>
        <button onClick={() => setAbaAtiva("crm")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "crm" ? "border-rose-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <Target size={18} className={`transition-all ${abaAtiva === "crm" ? "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] scale-110" : ""}`} /> LTV & Cobrança (CRM)
        </button>
        <button onClick={() => setAbaAtiva("visao_geral")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "visao_geral" ? "border-[#A67B5B] text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <TrendingUp size={18} className={`transition-all ${abaAtiva === "visao_geral" ? "text-[#A67B5B] drop-shadow-[0_0_8px_rgba(166,123,91,0.5)] scale-110" : ""}`} /> Dashboard DRE
        </button>
        <button onClick={() => setAbaAtiva("despesas")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "despesas" ? "border-amber-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <FileText size={18} className={`transition-all ${abaAtiva === "despesas" ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-110" : ""}`} /> Compras e Saídas
        </button>
        <button onClick={() => setAbaAtiva("ceo_ia")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "ceo_ia" ? "border-indigo-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <BrainCircuit size={18} className={`transition-all ${abaAtiva === "ceo_ia" ? "text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] scale-110" : ""}`} /> CEO Artificial
        </button>
      </div>

      {/* ====================================================================== */}
      {/* 👥 ABA 0: CARTEIRA DE CLIENTES (O NOVO DIRETÓRIO) */}
      {/* ====================================================================== */}
      {abaAtiva === "clientes" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors animate-in fade-in duration-300">
          
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-indigo-50/30 dark:bg-indigo-500/5 shrink-0">
            <div>
              <h3 className="font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-indigo-500" /> Carteira de Clientes
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">A base central da loja. Estes dados integram com o PDV e o CRM de cobrança.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                  type="text" 
                  value={buscaCliente}
                  onChange={(e) => setBuscaCliente(e.target.value)}
                  placeholder="Buscar por nome ou Zap..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all text-stone-900 dark:text-white shadow-sm" 
                />
              </div>
              
              <button 
                onClick={() => setModalNovoCliente(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-black bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md active:scale-95 shrink-0"
              >
                <UserPlus size={18} /> Novo Cadastro
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700 text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold">
                  <th className="p-5">Nome & Contato</th>
                  <th className="p-5">Endereço Principal</th>
                  <th className="p-5 text-right">Estatísticas de Compra</th>
                  <th className="p-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-stone-400">
                      <Users size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="font-bold">Nenhum cliente encontrado.</p>
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cli) => (
                    <tr key={cli.id} className="group hover:bg-stone-50 dark:hover:bg-stone-700/20 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-sm shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                            {cli.cliente.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                              {cli.cliente} <span className="text-[9px] bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-300 px-1.5 py-0.5 rounded font-mono">{cli.id}</span>
                            </p>
                            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 font-mono mt-0.5 flex items-center gap-1">
                              <MessageCircle size={10} className="text-emerald-500"/> {cli.telefone}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-5">
                        <p className="text-xs font-medium text-stone-600 dark:text-stone-300 max-w-xs line-clamp-2">
                          {cli.endereco || <span className="italic opacity-50">Endereço não cadastrado</span>}
                        </p>
                      </td>
                      
                      <td className="p-5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">LTV: R$ {cli.ltv.toFixed(2).replace('.', ',')}</p>
                          <span className="inline-flex items-center gap-1 bg-[#A67B5B]/10 text-[#A67B5B] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mt-0.5">
                            <Wallet size={10} /> + R$ {cli.cashback.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </td>
                      
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 bg-stone-100 dark:bg-stone-900 text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors" title="Editar">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 bg-stone-100 dark:bg-stone-900 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors" title="Excluir">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ABA 1: CRM & LTV (A MÁQUINA DE DINHEIRO) --- */}
      {abaAtiva === "crm" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors animate-in fade-in duration-300">
          
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-rose-50/30 dark:bg-rose-500/5">
            <div>
              <h3 className="font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Target size={18} className="text-rose-500" /> Relacionamento e Inadimplência
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">Acompanhe o Life Time Value (LTV), Cashback e acione a Automação de WhatsApp.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar cliente..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-all text-stone-900 dark:text-white shadow-sm" 
                />
              </div>
              
              {/* 🤖 GATILHO DE AUTOMAÇÃO PREMIUM */}
              <button 
                onClick={() => setAutomacaoLigada(!automacaoLigada)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all shadow-sm shrink-0 ${automacaoLigada ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/30 animate-pulse" : "bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"}`}
              >
                <Bot size={16} /> {automacaoLigada ? "Automação ON" : "Ligar Robô"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700 text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold">
                  <th className="p-5">Dossiê da Cliente</th>
                  <th className="p-5 text-right">Saldo Devedor</th>
                  <th className="p-5 text-center">Score / Atraso</th>
                  <th className="p-5 text-right">LTV & Cashback</th>
                  <th className="p-5 text-center">Status da Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {CLIENTES_MOCK.map((rec) => (
                  <tr key={rec.id} className="group hover:bg-stone-50 dark:hover:bg-stone-700/20 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        {rec.cliente}
                      </p>
                      <p className="text-xs font-medium text-stone-500 dark:text-stone-400 font-mono mt-0.5">{rec.telefone}</p>
                    </td>
                    
                    <td className="p-5 text-right">
                      <p className={`text-base font-black ${rec.atraso > 0 ? "text-rose-600 dark:text-rose-400" : "text-stone-900 dark:text-white"}`}>
                        R$ {rec.valor_pendente.toFixed(2).replace('.', ',')}
                      </p>
                    </td>
                    
                    <td className="p-5 text-center">
                      {rec.atraso > 0 ? (
                        <div className="flex flex-col gap-1 items-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${rec.risco === "Crítico" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"}`}>
                            Risco {rec.risco}
                          </span>
                          <span className="text-xs font-bold text-red-500">{rec.atraso} dias vencido</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 items-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                            Risco {rec.risco}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">Em Dia</span>
                        </div>
                      )}
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Total Comprado (LTV)</span>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">R$ {rec.ltv.toFixed(2).replace('.', ',')}</p>
                        {rec.cashback > 0 && (
                          <span className="inline-flex items-center gap-1 bg-[#A67B5B]/10 text-[#A67B5B] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mt-1">
                            <Wallet size={10} /> + R$ {rec.cashback.toFixed(2).replace('.', ',')} Cashback
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-5 text-center">
                      <p className="text-[10px] font-bold text-stone-500 mb-2 truncate max-w-[150px] mx-auto">{rec.ultima_interacao}</p>
                      
                      {automacaoLigada ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold w-full justify-center opacity-70 cursor-not-allowed">
                          <Bot size={14} /> Fila do Robô
                        </span>
                      ) : (
                        <button 
                          onClick={() => abrirCobranca(rec)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-sm mx-auto group/btn w-full ${rec.atraso > 0 ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                        >
                          <MessageCircleHeart size={14} className="group-hover/btn:scale-110 transition-transform" /> 
                          {rec.atraso > 0 ? "Cobrar / Negociar" : "Fidelizar"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ABA 2: VISÃO GERAL (DRE) --- */}
      {abaAtiva === "visao_geral" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 p-12 text-center animate-in fade-in duration-300">
          <TrendingUp size={64} className="mx-auto text-stone-300 dark:text-stone-600 mb-6" />
          <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Painel de DRE Ativo</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">Em breve: Gráficos de barras e pizzas mostrando a evolução das suas receitas versus despesas ao longo do ano.</p>
        </div>
      )}

      {/* --- ABA 3: CONTAS A PAGAR --- */}
      {abaAtiva === "despesas" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 p-12 text-center animate-in fade-in duration-300">
          <FileText size={64} className="mx-auto text-stone-300 dark:text-stone-600 mb-6" />
          <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Central de Despesas</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">Em breve: Controle exato de todas as contas da loja, aluguel e pagamentos aos fornecedores.</p>
        </div>
      )}

      {/* --- ABA 4: O CEO ARTIFICIAL (RELATÓRIOS PREDITIVOS) --- */}
      {abaAtiva === "ceo_ia" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-right-8 duration-500">
          <div className="xl:col-span-5 bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
              <BrainCircuit size={32} />
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Conselheiro Baply A.I.</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium max-w-sm mb-8">
              A Inteligência Artificial analisa o seu Unit Economics (CAC x LTV), cruza os dados de inadimplência e sugere as melhores estratégias de Growth.
            </p>
            <button 
              onClick={gerarRelatorioCEO} disabled={analisandoDados}
              className="w-full max-w-xs flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {analisandoDados ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:scale-110 transition-transform" />} 
              {analisandoDados ? "Calculando Unit Economics..." : "Gerar Diagnóstico"}
            </button>
          </div>

          <div className="xl:col-span-7 bg-stone-900 dark:bg-stone-950 rounded-[2rem] border border-stone-800 shadow-xl overflow-hidden flex flex-col relative min-h-[400px]">
            <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-white/5 shrink-0">
              <h3 className="font-black text-white flex items-center gap-2"><FileText size={18} className="text-indigo-400" /> Relatório Executivo de Growth</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {!relatorioCEO ? (
                 <div className="h-full flex flex-col items-center justify-center text-stone-500">
                    <FileText size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-sm text-center">Aguardando solicitação.</p>
                 </div>
              ) : (
                <div className="text-stone-300 text-sm leading-relaxed space-y-4 animate-in fade-in zoom-in-95 duration-500">
                  <div dangerouslySetInnerHTML={{ 
                    __html: relatorioCEO.replace(/\n\n/g, '</p><p className="mt-2">').replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>').replace(/### (.*?)<br\/>/g, '<h3 class="text-indigo-400 text-xl font-black mt-4 mb-3">$1</h3>') 
                  }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 🚀 SLIDE-OVER: MODAL DE NOVO CLIENTE */}
      {/* ====================================================================== */}
      {modalNovoCliente && (
        <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={fecharModalNovoCliente}></div>

          <div className="relative w-full max-w-lg bg-stone-50 dark:bg-stone-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-stone-200 dark:border-stone-800">
            
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-950 shrink-0">
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <UserPlus size={20} className="text-indigo-500" /> Cadastrar Cliente
                </h2>
                <p className="text-sm font-medium text-stone-500">Amplie sua base central de contatos.</p>
              </div>
              <button onClick={fecharModalNovoCliente} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              
              {/* O BUSCADOR MÁGICO DE CEP (Legado Premium do Streamlit) */}
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-5 mb-6">
                <label className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <MapPin size={14} /> Auto-Preenchimento por CEP
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ex: 01001-000" 
                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-950 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium text-stone-700 dark:text-stone-300 shadow-sm"
                  />
                  <button onClick={() => toast.info("Integração com ViaCEP em breve!")} className="bg-indigo-600 text-white px-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm shrink-0">
                    Buscar
                  </button>
                </div>
              </div>

              <form onSubmit={salvarNovoCliente} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Nome Completo *</label>
                  <input 
                    type="text" required
                    value={formCliente.nome} onChange={e => setFormCliente({...formCliente, nome: e.target.value})}
                    placeholder="Ex: Ana Costa" 
                    className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all text-stone-900 dark:text-white shadow-sm font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">WhatsApp *</label>
                    <input 
                      type="text" required
                      value={formCliente.telefone} onChange={e => setFormCliente({...formCliente, telefone: e.target.value})}
                      placeholder="(11) 99999-9999" 
                      className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all text-stone-900 dark:text-white shadow-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">CPF / CNPJ</label>
                    <input 
                      type="text" 
                      value={formCliente.cpf} onChange={e => setFormCliente({...formCliente, cpf: e.target.value})}
                      placeholder="000.000.000-00" 
                      className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all text-stone-900 dark:text-white shadow-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Endereço Completo</label>
                  <textarea 
                    value={formCliente.endereco} onChange={e => setFormCliente({...formCliente, endereco: e.target.value})}
                    placeholder="Rua, Número, Bairro, Cidade - UF" rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all text-stone-900 dark:text-white shadow-sm resize-none font-medium"
                  />
                </div>

                <button 
                  type="submit" disabled={salvandoCliente}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-black text-lg py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {salvandoCliente ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />} 
                  {salvandoCliente ? "Salvando no Cofre..." : "Salvar Cliente"}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* 🚀 SLIDE-OVER: A MÁQUINA DE RELACIONAMENTO (I.A. + DRAFT) */}
      {modalCobranca && clienteAlvo && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={fecharModalCRM}></div>

          <div className="relative w-full max-w-md bg-stone-50 dark:bg-stone-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-stone-200 dark:border-stone-800">
            
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-950 shrink-0">
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <MessageCircleHeart size={20} className="text-rose-500" /> Estúdio de Relacionamento
                </h2>
                <p className="text-sm font-medium text-stone-500">Aumente o LTV de forma inteligente.</p>
              </div>
              <button onClick={fecharModalCRM} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className={`border rounded-2xl p-5 relative overflow-hidden ${clienteAlvo.atraso > 0 ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"}`}>
                {clienteAlvo.atraso > 0 ? (
                  <AlertTriangle size={80} className="absolute -right-4 -bottom-4 text-rose-200 dark:text-rose-900/30 opacity-50" />
                ) : (
                  <Target size={80} className="absolute -right-4 -bottom-4 text-emerald-200 dark:text-emerald-900/30 opacity-50" />
                )}
                
                <h3 className={`font-black mb-1 relative z-10 ${clienteAlvo.atraso > 0 ? "text-rose-900 dark:text-rose-300" : "text-emerald-900 dark:text-emerald-300"}`}>{clienteAlvo.cliente}</h3>
                
                <div className={`space-y-1 relative z-10 text-sm font-medium ${clienteAlvo.atraso > 0 ? "text-rose-700 dark:text-rose-400/80" : "text-emerald-700 dark:text-emerald-400/80"}`}>
                  {clienteAlvo.atraso > 0 ? (
                    <>
                      <p>Dívida Atual: <strong className="text-rose-900 dark:text-rose-300">R$ {clienteAlvo.valor_pendente.toFixed(2).replace('.', ',')}</strong></p>
                      <p>Atraso: <strong className="text-red-600 dark:text-red-400">{clienteAlvo.atraso} dias</strong></p>
                    </>
                  ) : (
                    <>
                      <p>LTV (Total Gasto): <strong className="text-emerald-900 dark:text-emerald-300">R$ {clienteAlvo.ltv.toFixed(2).replace('.', ',')}</strong></p>
                      <p>Cashback Parado: <strong className="text-emerald-900 dark:text-emerald-300">R$ {clienteAlvo.cashback.toFixed(2).replace('.', ',')}</strong></p>
                    </>
                  )}
                </div>
              </div>

              {/* TIMELINE DE INTERAÇÕES */}
              <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-4">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2 mb-3"><History size={14}/> Última Interação</h4>
                <div className="flex gap-3">
                  <div className="w-1.5 rounded-full bg-stone-200 dark:bg-stone-700"></div>
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-white">{clienteAlvo.ultima_interacao}</p>
                    <p className="text-xs text-stone-500">Via Sistema Baply</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BrainCircuit size={14} /> Direcionamento da I.A.
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {clienteAlvo.atraso > 0 ? (
                    <>
                      <button onClick={() => setEstrategiaIA("amigavel")} className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${estrategiaIA === "amigavel" ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-300"}`}>
                        🤝 Amigável
                      </button>
                      <button onClick={() => setEstrategiaIA("negociacao")} className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${estrategiaIA === "negociacao" ? "bg-rose-50 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/50 text-rose-700 dark:text-rose-300" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-300"}`}>
                        🚨 Acordo / Isenção
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEstrategiaIA("fidelizacao")} className={`col-span-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${estrategiaIA === "fidelizacao" ? "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-300"}`}>
                        🎁 Oferecer Cashback
                      </button>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={gerarMensagemIA}
                  disabled={gerandoMensagem}
                  className="w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black text-sm py-3.5 rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  {gerandoMensagem ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {gerandoMensagem ? "Escrevendo..." : "Gerar Texto com I.A."}
                </button>
              </div>

              {mensagemGerada && (
                <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-300">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex justify-between">
                    <span>Mensagem Otimizada</span>
                    <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> Salva em Rascunho</span>
                  </label>
                  <textarea 
                    value={mensagemGerada}
                    onChange={(e) => setMensagemGerada(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-all dark:text-white resize-none shadow-inner"
                  />
                  
                  <a 
                    href={`https://wa.me/${clienteAlvo.telefone}?text=${encodeURIComponent(mensagemGerada)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      toast.success("Redirecionando... O rascunho continua salvo se precisar voltar.");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-sm py-4 rounded-xl transition-all shadow-lg shadow-[#25D366]/30 active:scale-[0.98] mt-4 group"
                  >
                    <MessageCircle size={18} className="group-hover:-translate-y-1 transition-transform" />
                    Ir para o WhatsApp
                  </a>
                  
                  <button 
                    onClick={() => {
                      toast.success("Ação arquivada com sucesso no CRM!");
                      fecharModalCRM();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-sm py-3 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors mt-2"
                  >
                    Dar Baixa e Limpar Rascunho
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}