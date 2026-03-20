"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { 
  PackageSearch, Plus, Search, MoreVertical, 
  Image as ImageIcon, AlertOctagon, TrendingUp, MonitorSmartphone,
  UploadCloud, FileText, Bot, Layers, Edit3, Trash2, RefreshCw, X,
  CheckCircle2, Globe, Tag, DollarSign, ListOrdered, Palette, Sparkles,
  Filter, ShieldCheck, Loader2 // 👈 Os fugitivos foram capturados e estão aqui!
} from "lucide-react";

// 🚀 MOCK DE PRODUTOS (Arquitetura Omnichannel preparada para WordPress)
const PRODUTOS_MOCK = [
  { 
    id: "P001", cod: "789101", nome: "Jogo de Lençol Casal 400 Fios", 
    preco_venda: 189.90, custo: 90.00, estoque: 15, estoque_minimo: 5, 
    categoria: "Cama", 
    imagem: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=200&h=200",
    status_site: "Publicado", variacoes: ["Branco", "Bege", "Azul Marinho"]
  },
  { 
    id: "P002", cod: "789102", nome: "Toalha de Banho Algodão Egípcio", 
    preco_venda: 89.90, custo: 35.00, estoque: 2, estoque_minimo: 10, 
    categoria: "Banho", 
    imagem: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=200&h=200",
    status_site: "Rascunho", variacoes: ["Branco", "Cinza"]
  },
  { 
    id: "P004", cod: "789104", nome: "Manta Microfibra Solteiro", 
    preco_venda: 79.90, custo: 30.00, estoque: 0, estoque_minimo: 5, 
    categoria: "Cama", 
    imagem: "", // Simulando produto sem foto
    status_site: "Oculto", variacoes: []
  },
  { 
    id: "P005", cod: "789105", nome: "Kit Lavabo Luxo (Difusor)", 
    preco_venda: 145.00, custo: 60.00, estoque: 12, estoque_minimo: 4, 
    categoria: "Decoração", 
    imagem: "https://images.unsplash.com/photo-1584305514050-a9a39ab95c8e?auto=format&fit=crop&q=80&w=200&h=200",
    status_site: "Publicado", variacoes: ["Lavanda", "Bambu"]
  },
];

export default function EstoqueInteligentePage() {
  const [busca, setBusca] = useState("");
  const [abaGeral, setAbaGeral] = useState("lista"); // "lista" | "ia"
  
  // Estados do Estoque
  const [estoque, setEstoque] = useState(PRODUTOS_MOCK);
  
  // Estados do Menu de Ações (3 pontinhos)
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);

  // 🚀 ESTADOS DO SUPER MODAL DE PRODUTO
  const [modalAberto, setModalAberto] = useState(false);
  const [abaModal, setAbaModal] = useState("geral"); // "geral" | "precos" | "ecommerce"
  const [processando, setProcessando] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState({
    id: "", cod: "", nome: "", categoria: "", preco_venda: "", custo: "", 
    estoque: "", estoque_minimo: "", descricao_site: "", status_site: "Rascunho"
  });

  // Estados da Inteligência Artificial (Leitura de Notas)
  const [arquivoUpload, setArquivoUpload] = useState<File | null>(null);
  const [lendoIA, setLendoIA] = useState(false);
  const [resultadoIA, setResultadoIA] = useState<any | null>(null);

  // 🧮 CÁLCULOS DO DASHBOARD
  const capitalParado = estoque.reduce((acc, p) => acc + (p.custo * p.estoque), 0);
  const produtosEsgotados = estoque.filter(p => p.estoque <= 0).length;
  const produtosRisco = estoque.filter(p => p.estoque > 0 && p.estoque <= p.estoque_minimo).length;
  const produtosNoSite = estoque.filter(p => p.status_site === "Publicado").length;

  const produtosFiltrados = useMemo(() => {
    return estoque.filter(p => 
      p.nome.toLowerCase().includes(busca.toLowerCase()) || 
      p.cod.includes(busca)
    );
  }, [busca, estoque]);

  // AÇÕES DO SISTEMA
  const handleAbrirModal = (prod: any = null) => {
    if (prod) {
      setProdutoEditando({
        id: prod.id, cod: prod.cod, nome: prod.nome, categoria: prod.categoria,
        preco_venda: prod.preco_venda.toString(), custo: prod.custo.toString(),
        estoque: prod.estoque.toString(), estoque_minimo: prod.estoque_minimo.toString(),
        descricao_site: prod.descricao_site || "", status_site: prod.status_site
      });
    } else {
      setProdutoEditando({
        id: "", cod: "", nome: "", categoria: "", preco_venda: "", custo: "", 
        estoque: "", estoque_minimo: "5", descricao_site: "", status_site: "Rascunho"
      });
    }
    setAbaModal("geral");
    setModalAberto(true);
    setMenuAbertoId(null);
  };

  const handleSalvarProduto = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessando(true);
    setTimeout(() => {
      toast.success("Produto salvo com sucesso!", { description: "Matriz de dados atualizada." });
      setProcessando(false);
      setModalAberto(false);
    }, 1000);
  };

  // 🤖 SIMULAÇÃO DO MOTOR MULTI-MODELO DE IA
  const handleProcessarNotaIA = () => {
    if (!arquivoUpload) {
      toast.error("Anexe uma imagem ou PDF da nota fiscal primeiro.");
      return;
    }

    setLendoIA(true);
    
    // Simula a cascata: Tenta Gemini -> Tenta OpenAI -> Sucesso
    toast.info("Iniciando Motor Gemini 1.5 Pro...", { id: "ia-toast" });
    
    setTimeout(() => {
      toast.info("Falha de limite. Acionando Fallback: OpenAI GPT-4o...", { id: "ia-toast" });
      
      setTimeout(() => {
        setResultadoIA([
          { cod: "789456", nome: "Toalha Rosto Buddemeyer", qtd: 50, custo: 18.50 },
          { cod: "789457", nome: "Fronha Algodão Premium", qtd: 100, custo: 22.90 }
        ]);
        setLendoIA(false);
        toast.success("Documento lido e extraído com sucesso!", { id: "ia-toast" });
      }, 2000);
    }, 2000);
  };

  return (
    <div className="animate-in fade-in duration-500 mb-20 relative">
      
      {/* 🚨 CABEÇALHO */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 dark:bg-stone-100 text-[#A67B5B] text-xs font-bold mb-4 shadow-sm">
            <PackageSearch size={14} /> Centro Logístico
          </div>
          <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight transition-colors">Estoque Inteligente</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1 transition-colors">
            Gerencie SKUs, previna rupturas e sincronize seu catálogo com o E-commerce.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setAbaGeral("ia")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all shadow-sm active:scale-95 group"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> Entrada via I.A.
          </button>
          <button 
            onClick={() => handleAbrirModal()}
            className="flex items-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-stone-900/20 hover:shadow-[#A67B5B]/30 active:scale-95 group"
          >
            <Plus size={18} className="group-hover:scale-110 transition-transform" /> Novo Produto
          </button>
        </div>
      </div>

      {/* 📊 DASHBOARD DE ESTOQUE (BENTO GRID) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm transition-colors group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Capital Parado</p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform"><DollarSign size={14}/></div>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white">R$ {capitalParado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          <p className="text-[10px] font-medium text-stone-400 mt-1">Custo total do estoque físico</p>
        </div>

        <div className="bg-red-50 dark:bg-red-500/10 p-5 rounded-2xl border border-red-100 dark:border-red-500/20 transition-colors relative overflow-hidden group cursor-default">
          <AlertOctagon size={80} className="absolute -right-4 -bottom-4 text-red-200 dark:text-red-900/30 opacity-50 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Furos / Esgotados</p>
          </div>
          <div className="text-3xl font-black text-red-700 dark:text-red-300 relative z-10">{produtosEsgotados}</div>
          <p className="text-[10px] font-bold text-red-500 mt-1 relative z-10 uppercase tracking-wider">Ação Imediata Necessária</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-500/20 transition-colors group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest">Estoque de Risco</p>
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform"><AlertOctagon size={14}/></div>
          </div>
          <div className="text-2xl font-black text-amber-800 dark:text-amber-400">{produtosRisco} SKUs</div>
          <p className="text-[10px] font-medium text-amber-600/70 mt-1">Abaixo do limite de segurança</p>
        </div>

        <div className="bg-stone-900 dark:bg-stone-950 p-5 rounded-2xl border border-stone-800 shadow-xl transition-colors group cursor-default relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Sincronia E-commerce</p>
            <div className="w-8 h-8 rounded-full bg-white/10 text-blue-400 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700"><RefreshCw size={14}/></div>
          </div>
          <div className="text-2xl font-black text-white relative z-10">{produtosNoSite} <span className="text-sm font-medium text-stone-400">Ativos no Site</span></div>
          <p className="text-[10px] font-bold text-blue-400 mt-1 relative z-10 uppercase tracking-wider">Integração WordPress OK</p>
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO PRINCIPAL */}
      <div className="flex items-center gap-8 border-b border-stone-200 dark:border-stone-700 mb-8 transition-colors">
        <button onClick={() => setAbaGeral("lista")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaGeral === "lista" ? "border-[#A67B5B] text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <ListOrdered size={18} className={`transition-all ${abaGeral === "lista" ? "text-[#A67B5B] drop-shadow-[0_0_8px_rgba(166,123,91,0.5)] scale-110" : ""}`} /> Catálogo & Inventário
        </button>
        <button onClick={() => setAbaGeral("ia")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaGeral === "ia" ? "border-indigo-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <Bot size={18} className={`transition-all ${abaGeral === "ia" ? "text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] scale-110" : ""}`} /> Leitor de Notas Fiscais (I.A.)
        </button>
      </div>

      {/* --- CONTEÚDO 1: A MASTER TABELA DE ESTOQUE --- */}
      {abaGeral === "lista" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors animate-in fade-in duration-300">
          <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-stone-50/50 dark:bg-stone-900/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar SKU ou nome do produto..." 
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all text-stone-900 dark:text-white font-medium shadow-sm" 
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors w-full md:w-auto justify-center">
              <Filter size={16} /> Filtros Rápidos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold">
                  <th className="p-6">Produto</th>
                  <th className="p-6">Precificação</th>
                  <th className="p-6 w-48">Nível de Estoque</th>
                  <th className="p-6 text-center">Status Omnichannel</th>
                  <th className="p-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-stone-500 dark:text-stone-400">
                      <PackageSearch size={48} className="mx-auto mb-4 opacity-30" />
                      <p className="font-bold text-lg">Nenhum SKU encontrado.</p>
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((prod) => {
                    const pctEstoque = Math.min((prod.estoque / (prod.estoque_minimo * 3)) * 100, 100);
                    const corBarra = prod.estoque <= 0 ? "bg-red-500" : prod.estoque <= prod.estoque_minimo ? "bg-amber-500" : "bg-emerald-500";
                    
                    return (
                      <tr key={prod.id} className="group hover:bg-stone-50 dark:hover:bg-stone-700/20 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-300">
                            {/* IMAGEM DO PRODUTO */}
                            <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden shrink-0 relative group-hover:border-[#A67B5B]/50 transition-colors">
                              {prod.imagem ? (
                                <img src={prod.imagem} alt={prod.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              ) : (
                                <ImageIcon size={20} className="text-stone-300 dark:text-stone-600" />
                              )}
                              {prod.variacoes.length > 0 && (
                                <div className="absolute bottom-0 right-0 bg-stone-900/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-tl-lg backdrop-blur-sm">
                                  +{prod.variacoes.length}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-stone-900 dark:text-white group-hover:text-[#A67B5B] transition-colors leading-tight line-clamp-1">{prod.nome}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                                <span>{prod.categoria}</span> • <span className="font-mono">SKU: {prod.cod}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-6">
                           <p className="text-sm font-black text-stone-900 dark:text-white">R$ {prod.preco_venda.toFixed(2).replace('.', ',')}</p>
                           <p className="text-xs font-medium text-stone-400">Custo: R$ {prod.custo.toFixed(2).replace('.', ',')}</p>
                        </td>
                        
                        <td className="p-6">
                          <div className="flex justify-between items-end mb-1.5">
                            <span className={`text-sm font-black ${prod.estoque <= 0 ? 'text-red-500' : prod.estoque <= prod.estoque_minimo ? 'text-amber-500' : 'text-stone-900 dark:text-white'}`}>
                              {prod.estoque} un
                            </span>
                            <span className="text-[10px] font-bold text-stone-400">Mín: {prod.estoque_minimo}</span>
                          </div>
                          {/* BARRA DE SAÚDE DO ESTOQUE */}
                          <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div className={`h-full ${corBarra} rounded-full transition-all duration-1000`} style={{ width: `${pctEstoque}%` }}></div>
                          </div>
                        </td>
                        
                        <td className="p-6 text-center">
                          {prod.status_site === "Publicado" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-shadow">
                              <Globe size={12} /> WP Sync OK
                            </span>
                          )}
                          {prod.status_site === "Rascunho" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-stone-100 text-stone-500 border border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700">
                              <Edit3 size={12} /> Draft Interno
                            </span>
                          )}
                          {prod.status_site === "Oculto" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20">
                              <MonitorSmartphone size={12} /> Off-line
                            </span>
                          )}
                        </td>
                        
                        <td className="p-6 text-center relative z-10">
                          <button onClick={(e) => { e.stopPropagation(); setMenuAbertoId(menuAbertoId === prod.id ? null : prod.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-[#A67B5B] hover:bg-[#A67B5B]/10 dark:hover:text-[#A67B5B] dark:hover:bg-[#A67B5B]/10 transition-colors mx-auto group-hover:scale-110">
                            <MoreVertical size={18} />
                          </button>
                          {menuAbertoId === prod.id && (
                            <div className="absolute right-12 top-10 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-xl shadow-stone-900/10 border border-stone-100 dark:border-stone-700 z-[60] animate-in fade-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <div className="py-1">
                                <button onClick={() => handleAbrirModal(prod)} className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                  <Edit3 size={14} /> Editar Omnichannel
                                </button>
                                <div className="h-px bg-stone-100 dark:bg-stone-700 my-1"></div>
                                <button className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                  <Trash2 size={14} /> Excluir SKU
                                </button>
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
          <div className="p-5 border-t border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 text-center">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Mostrando <span className="font-bold text-stone-900 dark:text-white">{produtosFiltrados.length}</span> SKUs no portfólio.
            </p>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO 2: O MOTOR DE IA (LEITURA DE NOTAS FISCAIS) --- */}
      {abaGeral === "ia" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-500">
          
          {/* Zona de Upload e Cascata de IA */}
          <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
            
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
              <Bot size={32} />
            </div>
            
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Motor de Visão Computacional</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium max-w-sm mb-8">
              Arraste o PDF ou a foto da Nota Fiscal do seu fornecedor. Nossa arquitetura multi-modelos (Gemini + OpenAI) extrairá os produtos, quantidades e custos automaticamente.
            </p>

            {/* Drag and Drop Zone simulado */}
            <div className="w-full max-w-md border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-8 bg-stone-50 dark:bg-stone-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group mb-6">
               <UploadCloud size={40} className="mx-auto text-indigo-300 dark:text-indigo-600 mb-3 group-hover:text-indigo-500 group-hover:-translate-y-1 transition-all" />
               <p className="text-sm font-bold text-stone-600 dark:text-stone-300 mb-1">Clique para procurar arquivo</p>
               <p className="text-xs text-stone-400">PDF, PNG, JPG até 10MB</p>
               
               <input 
                  type="file" 
                  className="hidden" 
                  id="fileUpload" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setArquivoUpload(e.target.files[0]);
                      toast.success("Arquivo anexado!");
                    }
                  }} 
                />
                <button onClick={() => document.getElementById('fileUpload')?.click()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"></button>
            </div>

            {arquivoUpload && (
              <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-900 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 mb-6">
                <FileText size={16} className="text-indigo-500" />
                <span className="text-sm font-bold text-stone-700 dark:text-stone-300 truncate max-w-[200px]">{arquivoUpload.name}</span>
                <button onClick={() => setArquivoUpload(null)} className="text-stone-400 hover:text-red-500"><X size={14}/></button>
              </div>
            )}

            <button 
              onClick={handleProcessarNotaIA}
              disabled={lendoIA || !arquivoUpload}
              className="w-full max-w-md flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {lendoIA ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:scale-110 transition-transform" />} 
              {lendoIA ? "Processando Algoritmos..." : "Extrair Dados da Nota"}
            </button>

            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-6 flex items-center gap-1.5 justify-center">
              <ShieldCheck size={12}/> Cascade Mode Ativo: Gemini & GPT-4o
            </p>
          </div>

          {/* Resultado da Leitura (Memória da IA) */}
          <div className="bg-stone-900 dark:bg-stone-950 rounded-[2rem] border border-stone-800 shadow-xl overflow-hidden flex flex-col relative">
            <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-white/5">
              <h3 className="font-black text-white flex items-center gap-2">
                <Database size={18} className="text-indigo-400" /> Dados Extraídos
              </h3>
              {resultadoIA && (
                <button onClick={() => {setResultadoIA(null); setArquivoUpload(null);}} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Limpar Buffer</button>
              )}
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
              {!resultadoIA ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-stone-500">
                    <MonitorSmartphone size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-sm text-center">Aguardando processamento de documento.</p>
                    <p className="text-xs mt-1 opacity-70 text-center max-w-xs">Os itens encontrados na nota fiscal aparecerão aqui prontos para importação em lote.</p>
                 </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-indigo-200">A Inteligência Artificial identificou <strong className="text-white">{resultadoIA.length} itens únicos</strong> na nota fiscal do fornecedor.</p>
                  </div>
                  
                  {/* Tabela de Resultados da IA */}
                  <div className="bg-stone-800/50 rounded-xl border border-stone-700 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-stone-800 border-b border-stone-700 text-[10px] uppercase tracking-widest text-stone-400">
                          <th className="p-4">SKU / Nome Lido</th>
                          <th className="p-4 text-center">Qtd</th>
                          <th className="p-4 text-right">Custo Un.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-700/50">
                        {resultadoIA.map((item: any, idx: number) => (
                          <tr key={idx} className="text-sm text-white">
                            <td className="p-4">
                              <span className="text-xs font-bold text-stone-500 mr-2">#{item.cod}</span>
                              {item.nome}
                            </td>
                            <td className="p-4 text-center font-bold">{item.qtd}</td>
                            <td className="p-4 text-right text-indigo-300">R$ {item.custo.toFixed(2).replace('.', ',')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-white text-stone-900 font-black text-sm py-3.5 rounded-xl hover:bg-stone-200 transition-all shadow-md active:scale-[0.98] mt-4">
                    <Layers size={16} /> Importar Tudo para o Estoque
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}

      {/* 🚀 O SUPER MODAL OMNICHANNEL (CADASTRO/EDIÇÃO) */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={() => setModalAberto(false)}></div>
          
          <div className="relative bg-white dark:bg-stone-900 w-full max-w-4xl h-[85vh] md:h-auto md:max-h-[90vh] rounded-[2rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-stone-900 dark:bg-stone-100 text-[#A67B5B] flex items-center justify-center shadow-lg">
                  <PackageSearch size={20} />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 dark:text-white text-xl">
                    {produtoEditando.id ? "Editar SKU Omnichannel" : "Cadastrar Novo Produto"}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Configure logística, precificação e SEO para o E-commerce.</p>
                </div>
              </div>
              <button onClick={() => setModalAberto(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 p-2.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Abas do Modal */}
            <div className="flex overflow-x-auto border-b border-stone-100 dark:border-stone-800 px-6 bg-white dark:bg-stone-900 shrink-0 scrollbar-hide">
              <button onClick={() => setAbaModal("geral")} className={`py-4 px-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${abaModal === "geral" ? "border-[#A67B5B] text-[#A67B5B]" : "border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"}`}>
                <Tag size={16} /> Identidade Visual
              </button>
              <button onClick={() => setAbaModal("precos")} className={`py-4 px-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${abaModal === "precos" ? "border-[#A67B5B] text-[#A67B5B]" : "border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"}`}>
                <DollarSign size={16} /> Finanças & Estoque
              </button>
              <button onClick={() => setAbaModal("ecommerce")} className={`py-4 px-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${abaModal === "ecommerce" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"}`}>
                <Globe size={16} /> E-commerce (WooCommerce)
              </button>
            </div>

            {/* Corpo Form */}
            <div className="flex-1 overflow-y-auto p-8 bg-stone-50/30 dark:bg-stone-900/10">
              <form id="form-produto" onSubmit={handleSalvarProduto}>
                
                {/* ABA 1: IDENTIDADE VISUAL */}
                {abaModal === "geral" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-300">
                    {/* Zona de Upload de Imagem (Lado Esquerdo) */}
                    <div className="md:col-span-4">
                      <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2 block">Foto Principal (Capa)</label>
                      <div className="w-full aspect-square bg-stone-100 dark:bg-stone-800 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/80 hover:border-[#A67B5B]/50 transition-all cursor-pointer group relative overflow-hidden">
                        <UploadCloud size={32} className="mb-2 group-hover:scale-110 group-hover:text-[#A67B5B] transition-transform" />
                        <span className="text-xs font-bold">Upload Capa JPG/PNG</span>
                        <span className="text-[10px] mt-1 opacity-70">1080x1080px Recomendado</span>
                      </div>
                    </div>
                    
                    {/* Campos de Texto (Lado Direito) */}
                    <div className="md:col-span-8 space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Nome do Produto</label>
                        <input type="text" required value={produtoEditando.nome} onChange={(e) => setProdutoEditando({...produtoEditando, nome: e.target.value})} className="w-full px-4 py-3.5 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-base focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all dark:text-white font-bold" placeholder="Ex: Jogo de Lençol Casal 400 Fios" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Cód. Fábrica (SKU)</label>
                          <input type="text" required value={produtoEditando.cod} onChange={(e) => setProdutoEditando({...produtoEditando, cod: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] transition-all dark:text-white" placeholder="Ex: 789101" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Categoria Principal</label>
                          <select value={produtoEditando.categoria} onChange={(e) => setProdutoEditando({...produtoEditando, categoria: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] transition-all appearance-none font-medium text-stone-700 dark:text-stone-300">
                            <option value="">Selecione...</option>
                            <option value="Cama">Cama</option>
                            <option value="Banho">Banho</option>
                            <option value="Mesa">Mesa</option>
                            <option value="Decoração">Decoração</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA 2: FINANÇAS & ESTOQUE */}
                {abaModal === "precos" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Precificação</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Custo de Fábrica (R$)</label>
                          <input type="number" step="0.01" required value={produtoEditando.custo} onChange={(e) => setProdutoEditando({...produtoEditando, custo: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] transition-all dark:text-white font-mono" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Preço de Venda (R$)</label>
                          <input type="number" step="0.01" required value={produtoEditando.preco_venda} onChange={(e) => setProdutoEditando({...produtoEditando, preco_venda: e.target.value})} className="w-full px-4 py-3 bg-stone-900 text-[#A67B5B] border border-stone-800 rounded-xl text-lg font-black focus:outline-none focus:ring-2 focus:ring-[#A67B5B] shadow-sm font-mono placeholder:text-stone-700" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Margem Bruta Simulada</label>
                          <div className="w-full px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-between">
                            <span>Estimativa:</span>
                            <span>
                              {Number(produtoEditando.preco_venda) > 0 
                                ? `${(((Number(produtoEditando.preco_venda) - Number(produtoEditando.custo)) / Number(produtoEditando.preco_venda)) * 100).toFixed(1)}%` 
                                : "0.0%"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Controle Físico</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Quantidade Atual em Estoque</label>
                          <input type="number" required value={produtoEditando.estoque} onChange={(e) => setProdutoEditando({...produtoEditando, estoque: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-base focus:outline-none focus:border-[#A67B5B] transition-all dark:text-white font-black" placeholder="Ex: 50" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest flex items-center gap-1.5"><AlertOctagon size={12}/> Alerta de Estoque Mínimo</label>
                          <input type="number" required value={produtoEditando.estoque_minimo} onChange={(e) => setProdutoEditando({...produtoEditando, estoque_minimo: e.target.value})} className="w-full px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all dark:text-amber-100 font-bold" placeholder="Quando o sistema deve avisar?" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA 3: E-COMMERCE E VARIAÇÕES (A Mágica do WordPress) */}
                {abaModal === "ecommerce" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-5 rounded-2xl flex items-start gap-4">
                       <Globe size={24} className="text-blue-500 shrink-0 mt-1" />
                       <div>
                         <h4 className="font-bold text-blue-800 dark:text-blue-300">Integração WooCommerce Habilitada</h4>
                         <p className="text-sm text-blue-600 dark:text-blue-400/80 mt-1">Ao salvar este produto como "Publicado", ele será enviado automaticamente para a vitrine do seu site WordPress hospedado na Hostinger.</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Descrição Rica (SEO para o Site)</label>
                        <textarea 
                          value={produtoEditando.descricao_site} 
                          onChange={(e) => setProdutoEditando({...produtoEditando, descricao_site: e.target.value})} 
                          className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all dark:text-white resize-none" 
                          rows={5}
                          placeholder="Ex: Lençol luxuoso fabricado com fios de algodão egípcio para noites de sono inesquecíveis..."
                        ></textarea>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Status da Sincronização</label>
                          <select value={produtoEditando.status_site} onChange={(e) => setProdutoEditando({...produtoEditando, status_site: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none font-bold text-stone-900 dark:text-white">
                            <option value="Rascunho">📝 Rascunho Interno</option>
                            <option value="Publicado">🌐 Publicado no Site</option>
                            <option value="Oculto">👁️‍🗨️ Oculto do Catálogo</option>
                          </select>
                        </div>
                        
                        {/* 💡 Preview das Variações (Grade Visual) */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><Palette size={12} /> Grade de Variações (Cores)</label>
                          <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-700 flex gap-2 flex-wrap">
                             <span className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-md text-xs font-bold shadow-sm">Branco</span>
                             <span className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-md text-xs font-bold shadow-sm">Bege</span>
                             <button type="button" className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-md text-xs font-bold flex items-center gap-1 border border-dashed border-stone-400 dark:border-stone-600 transition-colors">
                               <Plus size={10} /> Cor
                             </button>
                          </div>
                          <p className="text-[10px] text-stone-400">Na versão completa, gerencie estoque separado por cor/tamanho.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer do Modal */}
            <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex justify-between items-center shrink-0">
              <p className="text-xs font-medium text-stone-400 hidden md:block">Campos com <span className="text-red-500">*</span> são obrigatórios para a criação do SKU.</p>
              <div className="flex gap-3 w-full md:w-auto">
                <button type="button" onClick={() => setModalAberto(false)} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  Cancelar
                </button>
                <button form="form-produto" type="submit" disabled={processando} className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2">
                  {processando ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {processando ? "Sincronizando..." : "Salvar no Servidor"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// 💡 Componente customizado para a área de IA
function Database({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}