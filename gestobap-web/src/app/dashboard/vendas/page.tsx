"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { 
  Search, ShoppingCart, Plus, Minus, Trash2, 
  Tag, CreditCard, User, ScanBarcode, CheckCircle2,
  PackageOpen, ChevronRight, X, QrCode, Banknote, 
  SmartphoneNfc, CalendarClock, Receipt, MessageCircleHeart,
  Loader2, Store, RotateCcw, ReceiptText, AlertOctagon, Wallet, CalendarDays
} from "lucide-react";

// 🚀 MOCK DE PRODUTOS
const PRODUTOS_MOCK = [
  { id: "P001", cod: "789101", nome: "Jogo de Lençol Casal 400 Fios", preco: 189.90, estoque: 15, categoria: "Cama", cor: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  { id: "P002", cod: "789102", nome: "Toalha de Banho Algodão Egípcio", preco: 89.90, estoque: 32, categoria: "Banho", cor: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  { id: "P003", cod: "789103", nome: "Travesseiro Viscoelástico Nasa", preco: 129.90, estoque: 8, categoria: "Cama", cor: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  { id: "P004", cod: "789104", nome: "Manta Microfibra Solteiro", preco: 79.90, estoque: 0, categoria: "Cama", cor: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  { id: "P005", cod: "789105", nome: "Kit Lavabo Luxo (Saboneteira + Difusor)", preco: 145.00, estoque: 12, categoria: "Decoração", cor: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  { id: "P006", cod: "789106", nome: "Edredom King Size Dupla Face", preco: 349.90, estoque: 5, categoria: "Cama", cor: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
];

// Constantes para as datas simuladas
const hojeStr = new Date().toISOString().split('T')[0];
const ontemData = new Date();
ontemData.setDate(ontemData.getDate() - 1);
const ontemStr = ontemData.toISOString().split('T')[0];

// 🚀 MOCK DE VENDAS COM DATAS REAIS (Para o Filtro de Calendário funcionar)
const VENDAS_MOCK = [
  { id: "TRX-99812", hora: "13:45", data_venda: hojeStr, cliente: "Maria Souza", total: 279.80, metodo: "Pix", status: "Concluída" },
  { id: "TRX-99811", hora: "11:30", data_venda: hojeStr, cliente: "Consumidor Final", total: 89.90, metodo: "Cartão", status: "Concluída" },
  // Uma venda feita "ontem" para testarmos o filtro:
  { id: "TRX-99810", hora: "18:15", data_venda: ontemStr, cliente: "Ana Costa", total: 145.00, metodo: "Sweet Flex", status: "Concluída" },
];

export default function FrenteDeCaixaPage() {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [descontoReal, setDescontoReal] = useState<number | "">("");

  // ESTADOS DO CHECKOUT E RECIBO
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState("Pix");
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [parcelasFlex, setParcelasFlex] = useState(1);
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState(new Date().toISOString().split('T')[0]);
  const [processandoVenda, setProcessandoVenda] = useState(false);
  const [reciboGerado, setReciboGerado] = useState<any | null>(null);

  // 🚀 ESTADOS DA GESTÃO DE CAIXA E FILTRO DE DATA
  const [isCaixaOpen, setIsCaixaOpen] = useState(false);
  const [vendasBanco, setVendasBanco] = useState<any[]>(VENDAS_MOCK); // O banco de dados de vendas
  const [dataCaixaFiltro, setDataCaixaFiltro] = useState(hojeStr); // Inicia sempre filtrando por "Hoje"

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return PRODUTOS_MOCK.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.cod.includes(termo)
    );
  }, [busca]);

  const adicionarAoCarrinho = (produto: any) => {
    if (produto.estoque <= 0) {
      toast.error("Produto esgotado!", { description: "Verifique o estoque antes de vender." });
      return;
    }
    setCarrinho((prev) => {
      const itemExistente = prev.find(item => item.id === produto.id);
      if (itemExistente) {
        if (itemExistente.qtd >= produto.estoque) {
          toast.warning("Limite de estoque atingido para este item.");
          return prev;
        }
        return prev.map(item => 
          item.id === produto.id ? { ...item, qtd: item.qtd + 1, subtotal: (item.qtd + 1) * item.preco } : item
        );
      }
      toast.success(`${produto.nome} adicionado!`);
      return [...prev, { ...produto, qtd: 1, subtotal: produto.preco }];
    });
  };

  const alterarQuantidade = (id: string, delta: number) => {
    setCarrinho((prev) => {
      return prev.map(item => {
        if (item.id === id) {
          const novaQtd = item.qtd + delta;
          if (novaQtd === 0) return item; 
          if (delta > 0 && novaQtd > item.estoque) {
            toast.warning("Estoque máximo atingido.");
            return item;
          }
          return { ...item, qtd: novaQtd, subtotal: novaQtd * item.preco };
        }
        return item;
      });
    });
  };

  const removerDoCarrinho = (id: string) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const limparCarrinho = () => {
    if(window.confirm("Esvaziar o carrinho atual?")) {
      setCarrinho([]);
      setDescontoReal("");
      setMetodoPagamento("Pix");
      setParcelasFlex(1);
    }
  };

  // CÁLCULOS DO CARRINHO
  const subtotalCarrinho = carrinho.reduce((acc, item) => acc + item.subtotal, 0);
  const totalDesconto = Number(descontoReal) || 0;
  const totalFinal = Math.max(0, subtotalCarrinho - totalDesconto);
  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  const valorParcelaFlex = totalFinal / parcelasFlex;

  // 🚀 LÓGICA DE FINALIZAÇÃO E GERAÇÃO DO RECIBO
  const handleConfirmarVenda = () => {
    if (metodoPagamento === "Sweet Flex" && clienteSelecionado === "") {
      toast.error("Obrigatório selecionar um cliente para vendas no Sweet Flex!");
      return;
    }

    setProcessandoVenda(true);
    
    setTimeout(() => {
      const idTransacao = `TRX-${Math.floor(Math.random() * 1000000)}`;
      const clienteNome = clienteSelecionado ? clienteSelecionado.split(" - ")[0] : "Consumidor Final";

      const dadosRecibo = {
        id_transacao: idTransacao,
        data: new Date().toLocaleDateString('pt-BR'),
        itens: [...carrinho],
        subtotal: subtotalCarrinho,
        desconto: totalDesconto,
        total: totalFinal,
        metodo: metodoPagamento,
        parcelas: parcelasFlex,
        cliente_nome: clienteNome,
        cliente_telefone: clienteSelecionado ? "5511999999999" : "" 
      };

      // 💡 INTEGRAÇÃO: Injeta a nova venda no "Banco" automaticamente com a data de HOJE
      const novaVendaHistorico = {
        id: idTransacao,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        data_venda: hojeStr,
        cliente: clienteNome,
        total: totalFinal,
        metodo: metodoPagamento,
        status: "Concluída"
      };
      setVendasBanco([novaVendaHistorico, ...vendasBanco]);

      setProcessandoVenda(false);
      setIsCheckoutOpen(false); 
      setReciboGerado(dadosRecibo); 
      
      setCarrinho([]);
      setDescontoReal("");
      setClienteSelecionado("");
      setParcelasFlex(1);
      
      toast.success("Venda Finalizada!", { description: "O recibo digital foi gerado com sucesso." });
    }, 1500);
  };

  // 🚀 LÓGICA DA BORRACHA MÁGICA (ESTORNO)
  const handleEstornarVenda = (idVenda: string) => {
    const confirmacao = window.confirm(`ATENÇÃO: Deseja realmente ESTORNAR a transação ${idVenda}? Os itens retornarão ao estoque e o valor será subtraído do caixa.`);
    if (!confirmacao) return;

    // Atualiza o status da venda na lista principal do banco
    setVendasBanco(prev => prev.map(venda => 
      venda.id === idVenda ? { ...venda, status: "Estornada" } : venda
    ));

    toast.warning(`Transação ${idVenda} estornada!`, {
      description: "O fluxo de caixa foi recalculado."
    });
  };

  // 💬 CONSTRUTOR DA MENSAGEM DO WHATSAPP
  const gerarLinkWhatsApp = () => {
    if (!reciboGerado) return "#";
    
    let texto = `🌸 *BAPLY STORE - RECIBO DIGITAL* 🌸\n`;
    texto += `━━━━━━━━━━━━━━━━━━━\n`;
    texto += `Olá, *${reciboGerado.cliente_nome}*! ✨\n`;
    texto += `Aqui está o resumo da sua compra conosco hoje (${reciboGerado.data}):\n\n`;
    
    reciboGerado.itens.forEach((item: any) => {
      texto += `🛍️ ${item.qtd}x ${item.nome} - R$ ${item.subtotal.toFixed(2).replace('.', ',')}\n`;
    });
    
    texto += `━━━━━━━━━━━━━━━━━━━\n`;
    texto += `💰 *Subtotal:* R$ ${reciboGerado.subtotal.toFixed(2).replace('.', ',')}\n`;
    if (reciboGerado.desconto > 0) {
      texto += `📉 *Desconto:* - R$ ${reciboGerado.desconto.toFixed(2).replace('.', ',')}\n`;
    }
    texto += `✅ *TOTAL FINAL:* *R$ ${reciboGerado.total.toFixed(2).replace('.', ',')}*\n\n`;
    texto += `💳 *Pagamento:* ${reciboGerado.metodo}`;
    
    if (reciboGerado.metodo === "Sweet Flex") {
      texto += ` em ${reciboGerado.parcelas}x de R$ ${(reciboGerado.total / reciboGerado.parcelas).toFixed(2).replace('.', ',')}\n`;
      texto += `\n📌 *Lembrete Flex:* Mantenha suas parcelas em dia para continuar aproveitando nosso crediário exclusivo! 🥰`;
    } else {
      texto += `\n`;
    }
    
    texto += `\n✨ *Obrigado pela preferência!*`;

    return `https://wa.me/${reciboGerado.cliente_telefone}?text=${encodeURIComponent(texto)}`;
  };

  // 🧮 CÁLCULOS DE FECHAMENTO DE CAIXA BASEADO NA DATA SELECIONADA
  // 1. Filtramos apenas as vendas do dia escolhido pelo gerente
  const vendasFiltradasPorData = vendasBanco.filter(v => v.data_venda === dataCaixaFiltro);
  
  // 2. Filtramos apenas as concluídas para fazer a contabilidade
  const vendasValidas = vendasFiltradasPorData.filter(v => v.status === "Concluída");
  
  // 3. Calculamos os totais
  const totalPix = vendasValidas.filter(v => v.metodo === "Pix").reduce((acc, v) => acc + v.total, 0);
  const totalCartao = vendasValidas.filter(v => v.metodo === "Cartão").reduce((acc, v) => acc + v.total, 0);
  const totalDinheiro = vendasValidas.filter(v => v.metodo === "Dinheiro").reduce((acc, v) => acc + v.total, 0);
  const totalCrediario = vendasValidas.filter(v => v.metodo === "Sweet Flex").reduce((acc, v) => acc + v.total, 0);
  const totalCaixaGeral = totalPix + totalCartao + totalDinheiro + totalCrediario;

  // Renderiza a data em formato PT-BR para exibição
  const dataFormatadaExibicao = new Date(dataCaixaFiltro + "T00:00:00").toLocaleDateString('pt-BR');

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col mb-10 relative">
      
      {/* CABEÇALHO */}
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-[#A67B5B] text-xs font-bold mb-3 shadow-sm">
            <ShoppingCart size={14} /> Frente de Caixa (PDV)
          </div>
          <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">Nova Venda</h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCaixaOpen(true)}
            className="flex items-center gap-2 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm transition-colors text-sm font-bold text-stone-700 dark:text-stone-300"
          >
            <Store size={18} className="text-[#A67B5B]" />
            <span className="hidden md:inline">Gestão de Caixa</span>
          </button>

          <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-900 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-inner">
            <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-500">
              <User size={14} />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-stone-900 dark:text-white leading-none">Terminal 01</p>
              <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">Bia</p>
            </div>
          </div>
        </div>
      </div>

      {/* GRID PDV */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* LADO ESQUERDO: VITRINE E BUSCA */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 shrink-0">
            <div className="relative">
              <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" size={20} />
              <input 
                type="text" 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Bipar código de barras ou buscar por nome..." 
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-800 rounded-xl text-base focus:outline-none focus:border-[#A67B5B] focus:ring-4 focus:ring-[#A67B5B]/10 transition-all text-stone-900 dark:text-white font-bold shadow-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {["Tudo", "Cama", "Banho", "Decoração"].map((cat) => (
                <button key={cat} className="px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 hover:border-[#A67B5B] hover:text-[#A67B5B] whitespace-nowrap transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-stone-50/30 dark:bg-stone-900/10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {produtosFiltrados.length === 0 ? (
                <div className="col-span-full py-12 text-center text-stone-400">
                  <PackageOpen size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="font-bold">Nenhum produto encontrado.</p>
                  <p className="text-sm mt-1">Verifique a digitação ou sincronize o estoque.</p>
                </div>
              ) : (
                produtosFiltrados.map((prod) => (
                  <div 
                    key={prod.id} 
                    onClick={() => adicionarAoCarrinho(prod)}
                    className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 overflow-hidden ${
                      prod.estoque > 0 
                        ? "bg-white dark:bg-stone-800 border-stone-100 dark:border-stone-700 hover:border-[#A67B5B] hover:shadow-lg hover:shadow-[#A67B5B]/10 hover:-translate-y-1" 
                        : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#A67B5B] rounded-full blur-[50px] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div>
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${prod.cor} ${prod.text}`}>
                          {prod.categoria}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500">#{prod.cod}</span>
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-white leading-tight line-clamp-2 relative z-10">{prod.nome}</h3>
                    </div>
                    <div className="flex justify-between items-end mt-4 relative z-10">
                      <p className={`text-xs font-bold ${prod.estoque > 0 ? "text-stone-500" : "text-red-500"}`}>
                        {prod.estoque > 0 ? `${prod.estoque} em estoque` : "Esgotado"}
                      </p>
                      <p className="text-lg font-black text-[#A67B5B]">
                        R$ {prod.preco.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* LADO DIREITO: CARRINHO STICKY */}
        <div className="lg:col-span-4 flex flex-col bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-xl overflow-hidden relative">
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center bg-stone-900 dark:bg-stone-950 text-white shrink-0">
            <h2 className="font-black text-lg flex items-center gap-2">
              <ShoppingCart size={18} className="text-[#A67B5B]" /> Carrinho
            </h2>
            <span className="bg-[#A67B5B] text-white text-xs font-black px-2.5 py-1 rounded-full">
              {totalItens} itens
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 bg-stone-50/50 dark:bg-stone-900/30">
            {carrinho.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 p-6 text-center">
                <ScanBarcode size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-sm">O carrinho está vazio.</p>
                <p className="text-xs mt-1 opacity-70">Bipe um produto ou clique na vitrine para começar a venda.</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {carrinho.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm relative group animate-in slide-in-from-left-4 duration-300">
                    <button onClick={() => removerDoCarrinho(item.id)} className="absolute top-2 right-2 text-stone-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white pr-8 leading-tight mb-3">{item.nome}</h4>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-1">
                        <button onClick={() => alterarQuantidade(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#A67B5B] shadow-sm"><Minus size={12} strokeWidth={3}/></button>
                        <span className="text-xs font-black w-4 text-center text-stone-900 dark:text-white">{item.qtd}</span>
                        <button onClick={() => alterarQuantidade(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#A67B5B] shadow-sm"><Plus size={12} strokeWidth={3}/></button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 font-medium line-through decoration-stone-300 dark:decoration-stone-600">{item.qtd > 1 ? `R$ ${(item.preco * item.qtd).toFixed(2)}` : ""}</p>
                        <p className="text-sm font-black text-stone-900 dark:text-white">R$ {item.subtotal.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="shrink-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-400 flex items-center justify-center shrink-0"><Tag size={16} /></div>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">R$</span>
                <input 
                  type="number" 
                  value={descontoReal}
                  onChange={(e) => setDescontoReal(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Desconto Geral (R$)" 
                  min="0" step="0.01"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-bold focus:outline-none focus:border-[#A67B5B] text-stone-900 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-medium text-stone-500 dark:text-stone-400"><span>Subtotal ({totalItens} itens)</span><span>R$ {subtotalCarrinho.toFixed(2).replace('.', ',')}</span></div>
              {totalDesconto > 0 && <div className="flex justify-between text-sm font-bold text-emerald-500"><span>Desconto Aplicado</span><span>- R$ {totalDesconto.toFixed(2).replace('.', ',')}</span></div>}
              <div className="flex justify-between items-end pt-2 border-t border-stone-100 dark:border-stone-700">
                <span className="text-base font-black text-stone-900 dark:text-white uppercase tracking-wider">Total</span>
                <span className="text-3xl font-black text-[#A67B5B] tracking-tighter">R$ {totalFinal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={limparCarrinho} disabled={carrinho.length === 0} className="p-4 rounded-xl border-2 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"><Trash2 size={20} /></button>
              <button disabled={carrinho.length === 0} onClick={() => setIsCheckoutOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-[#A67B5B] dark:text-stone-900 font-black text-lg rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xl shadow-stone-900/20 hover:shadow-[#A67B5B]/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group">
                <CreditCard size={20} className="group-hover:scale-110 transition-transform" /> Cobrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🚀 SLIDE-OVER: GESTÃO E FECHAMENTO DO CAIXA */}
      {/* ========================================== */}
      {isCaixaOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setIsCaixaOpen(false)}
          ></div>

          <div className="relative w-full max-w-2xl bg-stone-50 dark:bg-stone-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-stone-200 dark:border-stone-800">
            
            {/* Header do Caixa com o FILTRO DE DATAS integrado */}
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-950">
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <Store size={20} className="text-[#A67B5B]" /> Gestão de Caixa
                </h2>
                <p className="text-sm font-medium text-stone-500">Auditoria financeira de {dataFormatadaExibicao}.</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* 👇 O NOVO CALENDÁRIO AUDITOR! */}
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                  <input 
                    type="date" 
                    value={dataCaixaFiltro}
                    onChange={(e) => setDataCaixaFiltro(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-bold text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#A67B5B] transition-colors"
                  />
                </div>

                <button 
                  onClick={() => setIsCaixaOpen(false)} 
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Corpo do Caixa */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Wallet size={16} /> Entradas do Dia Selecionado
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Caixa Geral Total */}
                  <div className="col-span-2 bg-stone-900 dark:bg-stone-950 p-6 rounded-2xl border border-stone-800 flex items-center justify-between shadow-xl">
                    <div>
                      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Volume Total de Vendas</p>
                      <h3 className="text-3xl font-black text-white">R$ {totalCaixaGeral.toFixed(2).replace('.', ',')}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">
                      <CreditCard size={24} />
                    </div>
                  </div>

                  {/* Quebra por Método */}
                  <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><QrCode size={14}/></div>
                    <p className="text-xs font-bold text-stone-500">PIX</p>
                    <p className="text-xl font-black text-stone-900 dark:text-white">R$ {totalPix.toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center"><SmartphoneNfc size={14}/></div>
                    <p className="text-xs font-bold text-stone-500">CARTÃO (Déb/Créd)</p>
                    <p className="text-xl font-black text-stone-900 dark:text-white">R$ {totalCartao.toFixed(2).replace('.', ',')}</p>
                  </div>

                  <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center"><Banknote size={14}/></div>
                    <p className="text-xs font-bold text-stone-500">DINHEIRO</p>
                    <p className="text-xl font-black text-stone-900 dark:text-white">R$ {totalDinheiro.toFixed(2).replace('.', ',')}</p>
                  </div>

                  <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-[#A67B5B] rounded-full blur-[30px] opacity-20"></div>
                    <div className="w-8 h-8 rounded-full bg-[#A67B5B]/10 text-[#A67B5B] flex items-center justify-center relative z-10"><CalendarClock size={14}/></div>
                    <p className="text-xs font-bold text-stone-500 relative z-10">SWEET FLEX (Crediário)</p>
                    <p className="text-xl font-black text-stone-900 dark:text-white relative z-10">R$ {totalCrediario.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </div>

              {/* HISTÓRICO E BORRACHA MÁGICA */}
              <div>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ReceiptText size={16} /> Histórico de {dataFormatadaExibicao}
                </h3>
                
                {vendasFiltradasPorData.length === 0 ? (
                  <div className="text-center py-10 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 border-dashed">
                    <p className="text-stone-500 font-medium">Nenhuma transação registrada nesta data.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vendasFiltradasPorData.map((venda) => (
                      <div key={venda.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors ${
                        venda.status === "Concluída" 
                          ? "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600" 
                          : "bg-stone-100 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 opacity-60"
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-400 flex items-center justify-center shrink-0 font-bold text-xs">
                            {venda.hora}
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${venda.status === "Estornada" ? "text-stone-400 line-through decoration-stone-300" : "text-stone-900 dark:text-white"}`}>
                              {venda.id}
                            </p>
                            <p className="text-xs font-medium text-stone-500">
                              {venda.cliente} • {venda.metodo}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 sm:mt-0">
                          <p className={`font-black text-lg text-right ${
                            venda.status === "Concluída" ? "text-stone-900 dark:text-white" : "text-red-500"
                          }`}>
                            R$ {venda.total.toFixed(2).replace('.', ',')}
                          </p>
                          
                          {venda.status === "Concluída" ? (
                            <button 
                              onClick={() => handleEstornarVenda(venda.id)}
                              className="p-2 rounded-lg text-stone-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
                              title="Cancelar / Estornar Venda"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md uppercase tracking-widest">
                              Cancelada
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DE PAGAMENTO */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-stone-50 dark:bg-stone-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-stone-200 dark:border-stone-800">
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-950">
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <CreditCard size={20} className="text-[#A67B5B]" /> Finalizar Venda
                </h2>
                <p className="text-sm font-medium text-stone-500">Escolha a forma de pagamento.</p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-stone-900 dark:bg-stone-950 rounded-2xl p-6 text-center border border-stone-800 relative overflow-hidden group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#A67B5B] rounded-full blur-[60px] opacity-20"></div>
                <p className="text-stone-400 text-sm font-bold uppercase tracking-widest relative z-10 mb-1">Total a Pagar</p>
                <h3 className="text-5xl font-black text-[#A67B5B] tracking-tighter relative z-10">R$ {totalFinal.toFixed(2).replace('.', ',')}</h3>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2"><User size={16} className="text-stone-400" /> Identificação do Cliente</label>
                <select value={clienteSelecionado} onChange={(e) => setClienteSelecionado(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all appearance-none font-medium text-stone-700 dark:text-stone-300 shadow-sm">
                  <option value="">Consumidor Final (Sem Cadastro)</option>
                  <option value="Maria Souza">Maria Souza - (11) 99999-9999</option>
                  <option value="Ana Costa">Ana Costa - (11) 88888-8888</option>
                </select>
                {metodoPagamento === "Sweet Flex" && !clienteSelecionado && <p className="text-xs font-bold text-red-500 animate-pulse mt-1">⚠️ O cadastro do cliente é obrigatório para vendas no Sweet Flex.</p>}
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-900 dark:text-white">Meio de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ id: "Pix", icone: QrCode, desc: "À vista" }, { id: "Cartão", icone: SmartphoneNfc, desc: "Débito/Crédito" }, { id: "Dinheiro", icone: Banknote, desc: "Espécie" }, { id: "Sweet Flex", icone: CalendarClock, desc: "Crediário Próprio" }].map((metodo) => (
                    <button key={metodo.id} onClick={() => setMetodoPagamento(metodo.id)} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${metodoPagamento === metodo.id ? "border-[#A67B5B] bg-[#A67B5B]/5 text-[#A67B5B]" : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-500 hover:border-stone-300 dark:hover:border-stone-700"}`}>
                      <metodo.icone size={24} className={`mb-2 ${metodoPagamento === metodo.id ? "text-[#A67B5B]" : "text-stone-400"}`} />
                      <span className={`text-sm font-bold ${metodoPagamento === metodo.id ? "text-stone-900 dark:text-white" : ""}`}>{metodo.id}</span>
                      <span className="text-[10px] uppercase tracking-wider opacity-70">{metodo.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              {metodoPagamento === "Sweet Flex" && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 animate-in slide-in-from-bottom-2 duration-300">
                  <h4 className="font-black text-amber-800 dark:text-amber-500 mb-4 flex items-center gap-2"><CalendarClock size={18} /> Plano de Parcelamento</h4>
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-amber-700 dark:text-amber-600 uppercase tracking-widest mb-2 block">Número de Parcelas</label>
                      <div className="flex items-center gap-4 bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-amber-900/50 p-1">
                        <button type="button" onClick={() => setParcelasFlex(Math.max(1, parcelasFlex - 1))} className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 hover:bg-amber-200"><Minus size={16} strokeWidth={3}/></button>
                        <span className="flex-1 text-center font-black text-lg text-amber-900 dark:text-amber-400">{parcelasFlex}x</span>
                        <button type="button" onClick={() => setParcelasFlex(Math.min(12, parcelasFlex + 1))} className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 hover:bg-amber-200"><Plus size={16} strokeWidth={3}/></button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-amber-700 dark:text-amber-600 uppercase tracking-widest mb-2 block">1º Vencimento</label>
                      <input type="date" value={dataPrimeiraParcela} onChange={(e) => setDataPrimeiraParcela(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-bold text-amber-900 dark:text-amber-100" />
                    </div>
                    <div className="pt-4 border-t border-amber-200/50 dark:border-amber-900/50">
                      <p className="text-center text-sm font-medium text-amber-800 dark:text-amber-500">
                        O cliente pagará: <br/><span className="text-2xl font-black block mt-1">{parcelasFlex}x de R$ {valorParcelaFlex.toFixed(2).replace('.', ',')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
               <button onClick={handleConfirmarVenda} disabled={processandoVenda || (metodoPagamento === "Sweet Flex" && !clienteSelecionado)} className="w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black text-lg py-4 rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xl shadow-stone-900/20 hover:shadow-[#A67B5B]/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {processandoVenda ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />} 
                {processandoVenda ? "Processando..." : "Confirmar e Gerar Recibo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECIBO DIGITAL */}
      {reciboGerado && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center animate-in zoom-in-95 duration-300 border border-stone-100 dark:border-stone-800">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center -mt-16 mb-4 border-4 border-white dark:border-stone-900 shadow-sm relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-20"></div>
              <CheckCircle2 size={40} className="text-emerald-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-1">Venda Concluída!</h2>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-6">Transação {reciboGerado.id_transacao} registrada.</p>
            <div className="w-full bg-stone-50 dark:bg-stone-950 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 mb-6 space-y-4 relative">
               <div className="absolute -top-1.5 left-0 right-0 h-3 flex justify-around overflow-hidden">
                 {[...Array(15)].map((_, i) => (
                   <div key={i} className="w-3 h-3 bg-white dark:bg-stone-900 rounded-full"></div>
                 ))}
               </div>
               <div className="text-center pt-2">
                 <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Valor Recebido</p>
                 <p className="text-4xl font-black text-stone-900 dark:text-white">R$ {reciboGerado.total.toFixed(2).replace('.', ',')}</p>
               </div>
               <div className="h-px bg-stone-200 dark:bg-stone-800 w-full border-dashed border-b-2"></div>
               <div className="space-y-2 text-sm font-medium">
                 <div className="flex justify-between"><span className="text-stone-500 dark:text-stone-400">Cliente</span><span className="text-stone-900 dark:text-white font-bold">{reciboGerado.cliente_nome}</span></div>
                 <div className="flex justify-between"><span className="text-stone-500 dark:text-stone-400">Pagamento</span><span className="text-stone-900 dark:text-white font-bold">{reciboGerado.metodo} {reciboGerado.metodo === "Sweet Flex" && `(${reciboGerado.parcelas}x)`}</span></div>
                 <div className="flex justify-between"><span className="text-stone-500 dark:text-stone-400">Itens Comprados</span><span className="text-stone-900 dark:text-white font-bold">{reciboGerado.itens.reduce((acc: number, item: any) => acc + item.qtd, 0)} un</span></div>
               </div>
            </div>
            <div className="w-full space-y-3">
              <a href={gerarLinkWhatsApp()} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-sm py-4 rounded-xl transition-all shadow-lg shadow-[#25D366]/30 active:scale-[0.98] group">
                <MessageCircleHeart size={20} className="group-hover:-translate-y-1 transition-transform" /> Enviar Recibo via WhatsApp
              </a>
              <button onClick={() => setReciboGerado(null)} className="w-full flex items-center justify-center gap-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-sm py-4 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-all active:scale-[0.98]">
                Nova Venda (Limpar Tela)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}