"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  DollarSign, TrendingUp, TrendingDown, Users, 
  Search, MessageCircle, AlertTriangle, FileText, 
  BrainCircuit, CheckCircle2, ChevronRight, X, 
  CalendarDays, SmartphoneNfc, ArrowUpRight, ArrowDownRight,
  MessageCircleHeart, Loader2, Landmark, Sparkles
} from "lucide-react";

// 🚀 MOCKS FINANCEIROS
const DESPESAS_MOCK = [
  { id: "DESP-001", descricao: "Fornecedor: Buddemeyer (Lote Toalhas)", valor: 2450.00, vencimento: "2026-03-25", status: "Pendente", categoria: "Estoque" },
  { id: "DESP-002", descricao: "Aluguel da Loja", valor: 3200.00, vencimento: "2026-03-10", status: "Pago", categoria: "Custo Fixo" },
  { id: "DESP-003", descricao: "Tráfego Pago (Instagram Ads)", valor: 500.00, vencimento: "2026-03-15", status: "Pago", categoria: "Marketing" },
];

const RECEBIVEIS_MOCK = [
  { id: "REC-101", cliente: "Ana Costa", telefone: "5511999999999", valor: 145.00, atraso: 12, status: "Atrasado", risco: "Médio", ultima_cobranca: "Nunca" },
  { id: "REC-102", cliente: "Maria Souza", telefone: "5511888888888", valor: 89.90, atraso: 0, status: "No Prazo", risco: "Baixo", ultima_cobranca: "Nunca" },
  { id: "REC-103", cliente: "Juliana Silva", telefone: "5511777777777", valor: 450.00, atraso: 45, status: "Crítico", risco: "Alto", ultima_cobranca: "Há 15 dias" },
];

export default function FinanceiroCRMPage() {
  const [abaAtiva, setAbaAtiva] = useState("visao_geral"); 
  
  const [modalCobranca, setModalCobranca] = useState(false);
  const [clienteAlvo, setClienteAlvo] = useState<any>(null);
  
  const [estrategiaIA, setEstrategiaIA] = useState("amigavel");
  const [gerandoMensagem, setGerandoMensagem] = useState(false);
  const [mensagemGerada, setMensagemGerada] = useState("");

  const [analisandoDados, setAnalisandoDados] = useState(false);
  const [relatorioCEO, setRelatorioCEO] = useState("");

  const receitaMes = 18450.00;
  const despesasPagas = DESPESAS_MOCK.filter(d => d.status === "Pago").reduce((acc, d) => acc + d.valor, 0);
  const totalReceber = RECEBIVEIS_MOCK.reduce((acc, r) => acc + r.valor, 0);
  const inadimplencia = RECEBIVEIS_MOCK.filter(r => r.atraso > 0).reduce((acc, r) => acc + r.valor, 0);
  const lucroLiquidoAtual = receitaMes - despesasPagas;

  const abrirCobranca = (cliente: any) => {
    setClienteAlvo(cliente);
    setMensagemGerada("");
    setModalCobranca(true);
  };

  const gerarMensagemIA = () => {
    setGerandoMensagem(true);
    setTimeout(() => {
      let msg = "";
      if (estrategiaIA === "amigavel") {
        msg = `Olá, ${clienteAlvo.cliente.split(' ')[0]}! Tudo bem com você? 🌸\n\nAqui é do setor financeiro da Baply Store. Passando rapidinho só para te lembrar da sua parcela do Sweet Flex no valor de R$ ${clienteAlvo.valor.toFixed(2).replace('.', ',')}, que acabou passando do vencimento.\n\nEsqueceu? Não tem problema nenhum! Posso te mandar a chave Pix atualizada para baixarmos isso no sistema? 🥰`;
      } else {
        msg = `Olá, ${clienteAlvo.cliente.split(' ')[0]}. Tudo bem?\n\nConsta em nosso sistema um atraso de ${clienteAlvo.atraso} dias referente à sua parcela de R$ ${clienteAlvo.valor.toFixed(2).replace('.', ',')}. \n\nPara mantermos o seu limite do Sweet Flex ativo e evitarmos juros, preparamos uma condição especial de isenção de multas se o pagamento for feito hoje. Como podemos te ajudar a regularizar essa pendência? 🤝`;
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
### 📊 Diagnóstico Executivo Baply
**Saúde Geral:** O caixa está operando com superávit. O lucro líquido atual é de **R$ ${lucroLiquidoAtual.toLocaleString('pt-BR')}**, representando uma excelente margem de contribuição frente à receita bruta.

**🚨 Alertas Críticos:**
1. **Inadimplência (Sweet Flex):** Temos **R$ ${inadimplencia.toLocaleString('pt-BR')}** retidos na rua. O caso da cliente *Juliana Silva* (45 dias de atraso) precisa de uma régua de cobrança mais agressiva. Sugiro congelar o limite dela imediatamente.
2. **Custo de Aquisição (Marketing):** O investimento de R$ 500,00 no Instagram Ads está se provando saudável, mas sugiro rastrear quantos clientes novos vieram especificamente dessa campanha para calcularmos o CAC exato.

**💡 Ação Sugerida:**
Utilize o módulo de CRM hoje para acionar os clientes com atraso leve (até 15 dias) oferecendo um "Cupom Surpresa" na próxima compra caso quitem a dívida à vista. Isso recupera o caixa rápido e estimula a recompra.
      `;
      setRelatorioCEO(relatorio);
      setAnalisandoDados(false);
      toast.success("Relatório estratégico finalizado.");
    }, 2500);
  };

  return (
    <div className="animate-in fade-in duration-500 mb-20 relative">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-[#A67B5B] text-xs font-bold mb-4 shadow-sm">
            <Landmark size={14} /> Centro Financeiro
          </div>
          <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight transition-colors">Cérebro Financeiro & CRM</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1 transition-colors">
            Monitore o DRE, controle despesas e recupere dinheiro com Inteligência Artificial.
          </p>
        </div>
      </div>

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
            <p className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1">Sweet Flex (Crediário)</p>
            <h3 className="text-3xl font-black text-amber-800 dark:text-amber-300">R$ {totalReceber.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
            <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wider">R$ {inadimplencia.toLocaleString('pt-BR', {minimumFractionDigits: 2})} em Atraso</p>
          </div>
        </div>

        <div className="bg-stone-900 dark:bg-stone-950 p-6 rounded-[2rem] border border-stone-800 shadow-xl transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A67B5B] rounded-full blur-[60px] opacity-20"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#A67B5B]/20 text-[#A67B5B] flex items-center justify-center group-hover:scale-110 transition-transform"><DollarSign size={20} strokeWidth={3}/></div>
            <span className="px-2.5 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-wider rounded-lg">Resultado Real</span>
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Lucro Líquido</p>
            <h3 className="text-3xl font-black text-white">R$ {lucroLiquidoAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-stone-200 dark:border-stone-700 mb-8 transition-colors">
        <button onClick={() => setAbaAtiva("visao_geral")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "visao_geral" ? "border-[#A67B5B] text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <TrendingUp size={18} className={`transition-all ${abaAtiva === "visao_geral" ? "text-[#A67B5B] drop-shadow-[0_0_8px_rgba(166,123,91,0.5)] scale-110" : ""}`} /> Visão DRE
        </button>
        <button onClick={() => setAbaAtiva("crm")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "crm" ? "border-rose-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <Users size={18} className={`transition-all ${abaAtiva === "crm" ? "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] scale-110" : ""}`} /> Máquina de Recuperação (CRM)
        </button>
        <button onClick={() => setAbaAtiva("despesas")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "despesas" ? "border-amber-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <FileText size={18} className={`transition-all ${abaAtiva === "despesas" ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-110" : ""}`} /> Contas a Pagar
        </button>
        <button onClick={() => setAbaAtiva("ceo_ia")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "ceo_ia" ? "border-indigo-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <BrainCircuit size={18} className={`transition-all ${abaAtiva === "ceo_ia" ? "text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] scale-110" : ""}`} /> CEO Artificial
        </button>
      </div>

      {/* --- ABA 1: VISÃO GERAL --- */}
      {abaAtiva === "visao_geral" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 p-12 text-center animate-in fade-in duration-300">
          <TrendingUp size={64} className="mx-auto text-stone-300 dark:text-stone-600 mb-6" />
          <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Painel de DRE Ativo</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">Nesta versão final, aqui entrarão os gráficos de barras e pizzas mostrando a evolução das suas receitas versus despesas ao longo do ano.</p>
        </div>
      )}

      {/* --- ABA 2: A MÁQUINA DE RECUPERAÇÃO DE DINHEIRO (CRM) --- */}
      {abaAtiva === "crm" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors animate-in fade-in duration-300">
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-rose-50/30 dark:bg-rose-500/5">
            <div>
              <h3 className="font-black text-stone-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-500" /> Inadimplência e Crediário
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">Gerencie atrasos e inicie abordagens inteligentes pelo WhatsApp.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar cliente devedor..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-all text-stone-900 dark:text-white shadow-sm" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold">
                  <th className="p-6">Cliente (Sweet Flex)</th>
                  <th className="p-6">Valor Pendente</th>
                  <th className="p-6">Status / Atraso</th>
                  <th className="p-6 text-center">Último Contato</th>
                  <th className="p-6 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {RECEBIVEIS_MOCK.map((rec) => (
                  <tr key={rec.id} className="group hover:bg-stone-50 dark:hover:bg-stone-700/20 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-stone-900 dark:text-white">{rec.cliente}</p>
                      <p className="text-xs font-medium text-stone-500 dark:text-stone-400 font-mono mt-0.5">{rec.telefone}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-black text-stone-900 dark:text-white">R$ {rec.valor.toFixed(2).replace('.', ',')}</p>
                    </td>
                    <td className="p-6">
                      {rec.atraso > 0 ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${rec.risco === "Alto" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"}`}>
                            {rec.status}
                          </span>
                          <span className="text-xs font-bold text-red-500">{rec.atraso} dias vencido</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                          Em Dia
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-xs font-medium text-stone-500">{rec.ultima_cobranca}</span>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => abrirCobranca(rec)}
                        disabled={rec.atraso === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-bold hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed mx-auto group/btn"
                      >
                        <MessageCircleHeart size={14} className="group-hover/btn:scale-110 transition-transform" /> Cobrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ABA 3: CONTAS A PAGAR --- */}
      {abaAtiva === "despesas" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 p-12 text-center animate-in fade-in duration-300">
          <FileText size={64} className="mx-auto text-stone-300 dark:text-stone-600 mb-6" />
          <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Central de Despesas</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">Aqui ficará o controle exato de todas as contas da loja, aluguel e pagamentos aos fornecedores, integrado com o Banco Sweet.</p>
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
              A Inteligência Artificial analisa todo o seu fluxo de caixa, cruza os dados de inadimplência e sugere as melhores estratégias de mercado para aumentar o seu lucro.
            </p>

            <button 
              onClick={gerarRelatorioCEO}
              disabled={analisandoDados}
              className="w-full max-w-xs flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {analisandoDados ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:scale-110 transition-transform" />} 
              {analisandoDados ? "Cruzando Dados..." : "Gerar Diagnóstico"}
            </button>
          </div>

          <div className="xl:col-span-7 bg-stone-900 dark:bg-stone-950 rounded-[2rem] border border-stone-800 shadow-xl overflow-hidden flex flex-col relative min-h-[400px]">
            <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-white/5 shrink-0">
              <h3 className="font-black text-white flex items-center gap-2">
                <FileText size={18} className="text-indigo-400" /> Relatório da Diretoria
              </h3>
            </div>
            
            {/* 👇 CORREÇÃO VISUAL DO TEXTO DA IA APLICADA AQUI 👇 */}
            <div className="flex-1 p-6 overflow-y-auto">
              {!relatorioCEO ? (
                 <div className="h-full flex flex-col items-center justify-center text-stone-500">
                    <FileText size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-sm text-center">Aguardando solicitação.</p>
                    <p className="text-xs mt-1 opacity-70 text-center max-w-xs">O relatório gerado não substitui o trabalho de um contador oficial.</p>
                 </div>
              ) : (
                <div className="text-stone-300 text-sm leading-relaxed space-y-4 animate-in fade-in zoom-in-95 duration-500">
                  {/* O texto agora obedece o text-stone-300 (cinza claro) e os negritos ficam text-white */}
                  <div dangerouslySetInnerHTML={{ 
                    __html: relatorioCEO
                      .replace(/\n\n/g, '</p><p className="mt-2">')
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>')
                      .replace(/### (.*?)<br\/>/g, '<h3 class="text-indigo-400 text-xl font-black mt-4 mb-3">$1</h3>') 
                  }} />
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}

      {/* 🚀 SLIDE-OVER: A MÁQUINA DE COBRANÇA (I.A.) */}
      {modalCobranca && clienteAlvo && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setModalCobranca(false)}></div>

          <div className="relative w-full max-w-md bg-stone-50 dark:bg-stone-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-stone-200 dark:border-stone-800">
            
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-950 shrink-0">
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <MessageCircleHeart size={20} className="text-rose-500" /> Assistente de Cobrança
                </h2>
                <p className="text-sm font-medium text-stone-500">Recupere o crédito sem perder o cliente.</p>
              </div>
              <button onClick={() => setModalCobranca(false)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-5 relative overflow-hidden">
                <AlertTriangle size={80} className="absolute -right-4 -bottom-4 text-rose-200 dark:text-rose-900/30 opacity-50" />
                <h3 className="font-black text-rose-900 dark:text-rose-300 mb-1 relative z-10">{clienteAlvo.cliente}</h3>
                <div className="space-y-1 relative z-10 text-sm font-medium text-rose-700 dark:text-rose-400/80">
                  <p>Dívida Atual: <strong className="text-rose-900 dark:text-rose-300">R$ {clienteAlvo.valor.toFixed(2).replace('.', ',')}</strong></p>
                  <p>Atraso: <strong className="text-red-600 dark:text-red-400">{clienteAlvo.atraso} dias</strong></p>
                  <p>Risco Atribuído: <strong>{clienteAlvo.risco}</strong></p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BrainCircuit size={14} /> Estratégia de Abordagem (I.A.)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setEstrategiaIA("amigavel")} className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${estrategiaIA === "amigavel" ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-300"}`}>
                    🤝 Lembrete Amigável
                  </button>
                  <button onClick={() => setEstrategiaIA("negociacao")} className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${estrategiaIA === "negociacao" ? "bg-rose-50 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/50 text-rose-700 dark:text-rose-300" : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-300"}`}>
                    🚨 Negociação Urgente
                  </button>
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
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Mensagem Otimizada</label>
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
                      toast.success("Mensagem enviada e registrada no CRM!");
                      setModalCobranca(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-sm py-4 rounded-xl transition-all shadow-lg shadow-[#25D366]/30 active:scale-[0.98] mt-4 group"
                  >
                    <MessageCircle size={18} className="group-hover:-translate-y-1 transition-transform" />
                    Enviar via WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}