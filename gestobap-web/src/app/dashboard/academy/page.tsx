"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { usePerfil } from "@/contexts/PerfilContext";
import { 
  GraduationCap, Trophy, BookOpen, Star, 
  PlayCircle, CheckCircle2, UploadCloud, FileText, 
  ExternalLink, Award, X, Loader2, Sparkles, Target, 
  TrendingUp, BrainCircuit, ShieldAlert, Link as LinkIcon, 
  Image as ImageIcon, Check, Filter, Search
} from "lucide-react";

// ============================================================================
// 🚀 MOCKS DA ACADEMY 2.0 (Com imagens reais e estrutura de Admin)
// ============================================================================
const CURSOS_MOCK = [
  { id: "C-101", trilha: "Vendas", titulo: "Atendimento ao Cliente de Alto Impacto", instituicao: "Sebrae", carga: 4, xp: 150, url: "https://sebrae.com.br", imagem: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=400&h=250" },
  { id: "C-102", trilha: "Vendas", titulo: "Gatilhos Mentais no WhatsApp", instituicao: "Baply", carga: 2, xp: 100, url: "https://youtube.com", imagem: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400&h=250" },
  { id: "C-201", trilha: "Finanças", titulo: "Gestão de Fluxo de Caixa", instituicao: "ENAP", carga: 10, xp: 300, url: "https://enap.gov.br", imagem: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400&h=250" },
  { id: "C-301", trilha: "Liderança", titulo: "Gestão de Pessoas", instituicao: "Harvard ManageMentor", carga: 20, xp: 500, url: "https://harvard.edu", imagem: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400&h=250" }
];

const PROGRESSO_MOCK = [
  { id: "P-001", curso_id: "C-101", titulo: "Atendimento ao Cliente de Alto Impacto", status: "Em Andamento", xp_ganho: 0, user: "Bia" },
  { id: "P-002", curso_id: "C-202", titulo: "Precificação Inteligente", status: "Concluído", xp_ganho: 200, certificado: "url_do_supabase.pdf", user: "Bia" }
];

const APROVACOES_PENDENTES_MOCK = [
  { id: "AP-001", aluno: "João (Estoque)", curso: "Gestão de Estoque", data_envio: "Hoje, 14:30", certificado: "link.pdf" }
];

export default function BaplyAcademyPage() {
  const supabase = createClient();
  const { nivel } = usePerfil();
  const isAdmin = nivel === "Admin" || nivel === "CEO" || nivel === "Gerente";

  const [abaAtiva, setAbaAtiva] = useState("trilhas"); // "trilhas" | "meu_progresso" | "admin"
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  
  // 💡 LÓGICA WHITE-LABEL DINÂMICA
  const [nomeAcademy, setNomeAcademy] = useState("Baply Academy");
  
  // Estados do Modal de Upload (Aluno)
  const [modalUpload, setModalUpload] = useState(false);
  const [cursoAlvo, setCursoAlvo] = useState<any>(null);
  const [ficheiroCertificado, setFicheiroCertificado] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  // 🤖 ESTADOS DO ROBÔ DE EXTRAÇÃO (Gestão Admin)
  const [urlCurso, setUrlCurso] = useState("");
  const [extraindoUrl, setExtraindoUrl] = useState(false);
  const [dadosExtraidos, setDadosExtraidos] = useState<{titulo: string, imagem: string, instituicao: string} | null>(null);
  const [novoCurso, setNovoCurso] = useState({ carga: "", xp: "", trilha: "Vendas" });

  const xpTotal = PROGRESSO_MOCK.reduce((acc, curr) => acc + curr.xp_ganho, 0);
  const nivelAtual = Math.floor(xpTotal / 500) + 1; 
  const xpProximoNivel = nivelAtual * 500;
  const pctProgresso = Math.min((xpTotal / xpProximoNivel) * 100, 100);

  useEffect(() => {
    const nomeLojaSalvo = localStorage.getItem("@baply_nome_loja");
    if (nomeLojaSalvo) {
      const primeiroNome = nomeLojaSalvo.split(' ')[0];
      setNomeAcademy(`${primeiroNome} Academy`);
    }
  }, []);

  const abrirModalCertificado = (curso: any) => {
    setCursoAlvo(curso);
    setFicheiroCertificado(null);
    setModalUpload(true);
  };

  const enviarCertificadoSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiroCertificado) return toast.error("Anexe o PDF ou imagem do certificado.");
    setEnviando(true);
    setTimeout(() => {
      toast.success("Certificado enviado para a Mesa de Aprovação! 🎉", {
        description: "Assim que a gerência aprovar, os seus XP serão creditados."
      });
      setEnviando(false);
      setModalUpload(false);
    }, 2000);
  };

  // ==========================================================================
  // 🤖 O ROBÔ EXTRATOR DE OPEN GRAPH (A MÁGICA DA INTEGRAÇÃO)
  // ==========================================================================
  const extrairMetadadosDoCurso = async () => {
    if (!urlCurso || !urlCurso.includes("http")) {
      return toast.error("Cole um link válido (com https://).");
    }
    
    setExtraindoUrl(true);
    toast.info("A investigar a URL...", { description: "Buscando capa e título oficiais do site."});

    try {
      // Usamos a Microlink API pública para contornar bloqueios de CORS do navegador e roubar a OG Tag
      const resposta = await fetch(`https://api.microlink.io?url=${encodeURIComponent(urlCurso)}`);
      const dados = await resposta.json();

      if (dados.status === "success") {
        setDadosExtraidos({
          titulo: dados.data.title || "Título não encontrado",
          imagem: dados.data.image?.url || dados.data.logo?.url || "",
          instituicao: dados.data.publisher || new URL(urlCurso).hostname.replace('www.', '').split('.')[0].toUpperCase()
        });
        toast.success("✨ Dados extraídos com sucesso!");
      } else {
        toast.warning("Não foi possível extrair a imagem automaticamente. Preencha manualmente.");
        setDadosExtraidos({ titulo: "", imagem: "", instituicao: "Ex: Sebrae" });
      }
    } catch (erro) {
      toast.error("Erro ao contactar o site do curso.");
      setDadosExtraidos({ titulo: "", imagem: "", instituicao: "" });
    }
    
    setExtraindoUrl(false);
  };

  const salvarNovoCurso = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Curso adicionado ao catálogo oficial da empresa!");
    setUrlCurso("");
    setDadosExtraidos(null);
    setNovoCurso({ carga: "", xp: "", trilha: "Vendas" });
  };

  const aprovarCertificado = (id: string) => {
    toast.success("Certificado Validado! XP creditado ao colaborador.");
  };

  const categorias = ["Todas", ...Array.from(new Set(CURSOS_MOCK.map(c => c.trilha)))];
  const cursosFiltrados = filtroCategoria === "Todas" ? CURSOS_MOCK : CURSOS_MOCK.filter(c => c.trilha === filtroCategoria);

  return (
    <div className="animate-in fade-in duration-500 mb-20 relative">
      
      {/* 🚨 HEADER GAMIFICADO */}
      <div className="mb-10 bg-stone-900 dark:bg-stone-950 rounded-[2rem] p-8 md:p-10 border border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-indigo-400 text-xs font-bold mb-4 backdrop-blur-sm shadow-inner">
            <GraduationCap size={14} /> Desenvolvimento Contínuo
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">{nomeAcademy}</h1>
          <p className="text-stone-400 font-medium mt-2 max-w-md">
            O conhecimento é o único ativo que escala infinitamente. Domine os processos e suba o nível da sua carreira.
          </p>
        </div>

        {/* MOTOR DE DOPAMINA (BARRA DE XP) */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 w-full md:w-96 backdrop-blur-md shadow-2xl">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><Trophy size={14} className="text-amber-400"/> O Seu Nível</p>
              <h3 className="text-3xl font-black text-white mt-1">Lvl. {nivelAtual} <span className="text-sm font-medium text-stone-500">({xpTotal} XP)</span></h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-indigo-400">Faltam {xpProximoNivel - xpTotal} XP</p>
            </div>
          </div>
          <div className="h-2.5 w-full bg-stone-800 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 relative" style={{ width: `${pctProgresso}%` }}>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 NAVEGAÇÃO DE ABAS */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide gap-8">
        <div className="flex items-center gap-8">
          <button onClick={() => setAbaAtiva("trilhas")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "trilhas" ? "border-indigo-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
            <BookOpen size={18} className={`transition-all ${abaAtiva === "trilhas" ? "text-indigo-500 scale-110" : ""}`} /> Catálogo de Trilhas
          </button>
          <button onClick={() => setAbaAtiva("meu_progresso")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "meu_progresso" ? "border-emerald-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
            <Award size={18} className={`transition-all ${abaAtiva === "meu_progresso" ? "text-emerald-500 scale-110" : ""}`} /> Meu Cofre (XP)
          </button>
        </div>
        
        {/* ABA EXCLUSIVA DA GERÊNCIA */}
        {isAdmin && (
          <button onClick={() => setAbaAtiva("admin")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "admin" ? "border-[#A67B5B] text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
            <ShieldAlert size={18} className={`transition-all ${abaAtiva === "admin" ? "text-[#A67B5B] scale-110" : ""}`} /> Portal do Reitor
          </button>
        )}
      </div>

      {/* ====================================================================== */}
      {/* 📚 ABA 1: A VITRINE DE CURSOS (VISÃO DO ALUNO) */}
      {/* ====================================================================== */}
      {abaAtiva === "trilhas" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* FILTROS ELEGANTES */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-stone-400 mr-2"><Filter size={16}/> <span className="text-xs font-bold uppercase tracking-widest">Trilhas:</span></div>
            {categorias.map(cat => (
              <button 
                key={cat} onClick={() => setFiltroCategoria(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filtroCategoria === cat ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-indigo-300"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cursosFiltrados.map((curso) => (
              <div key={curso.id} className="group bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl overflow-hidden hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between">
                
                {/* A IMAGEM EXTRAÍDA PELO NOSSO ROBÔ */}
                <div className="h-40 w-full bg-stone-100 dark:bg-stone-900 relative overflow-hidden">
                  {curso.imagem ? (
                    <img src={curso.imagem} alt={curso.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300"><ImageIcon size={40}/></div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-black text-amber-500 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                    <Star size={12}/> {curso.xp} XP
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-stone-900/80 text-white backdrop-blur-md">
                    {curso.instituicao}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">{curso.trilha}</span>
                  <h4 className="font-black text-lg text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {curso.titulo}
                  </h4>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <p className="text-xs font-bold text-stone-400 flex items-center gap-1.5"><BrainCircuit size={14}/> {curso.carga}h de Carga</p>
                    <a href={curso.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">
                      <PlayCircle size={20} className="ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 🏆 ABA 2: O MEU PROGRESSO E PROVA DE TRABALHO */}
      {/* ====================================================================== */}
      {abaAtiva === "meu_progresso" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 p-8 shadow-sm animate-in fade-in duration-300 min-h-[400px]">
          <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2 mb-6">
            <Award size={20} className="text-emerald-500" /> Cofre de Conquistas Pessoais
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-700 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  <th className="pb-4 pl-4">Formação Em Andamento / Concluída</th>
                  <th className="pb-4 text-center">Status</th>
                  <th className="pb-4 text-right">Recompensa</th>
                  <th className="pb-4 text-center pr-4">Ação / Prova</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {PROGRESSO_MOCK.map((prog) => (
                  <tr key={prog.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors group">
                    <td className="py-4 pl-4 font-bold text-stone-900 dark:text-white text-sm">
                      {prog.titulo}
                    </td>
                    <td className="py-4 text-center">
                      {prog.status === "Concluído" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                          <CheckCircle2 size={12} /> Aprovado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20 shadow-inner">
                          <Loader2 size={12} className="animate-spin" /> {prog.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {prog.xp_ganho > 0 ? (
                        <span className="text-xs font-black text-amber-500 flex items-center justify-end gap-1"><Star size={12}/> +{prog.xp_ganho} XP</span>
                      ) : (
                        <span className="text-xs font-medium text-stone-400">Pendente</span>
                      )}
                    </td>
                    <td className="py-4 text-center pr-4">
                      {prog.status === "Concluído" ? (
                        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 w-full bg-indigo-50 dark:bg-indigo-500/10 py-2 rounded-xl transition-colors">
                          <ExternalLink size={14}/> Ver Certificado
                        </button>
                      ) : (
                        <button onClick={() => abrirModalCertificado(prog)} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 dark:bg-stone-100 hover:bg-[#A67B5B] text-white dark:text-stone-900 dark:hover:bg-[#A67B5B] dark:hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 w-full max-w-[160px] mx-auto">
                          <UploadCloud size={14}/> Anexar Prova
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

      {/* ====================================================================== */}
      {/* 👑 ABA 3: GESTÃO ADMIN (FÁBRICA DE CURSOS E APROVAÇÕES) */}
      {/* ====================================================================== */}
      {isAdmin && abaAtiva === "admin" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-right-8 duration-500">
          
          {/* O ROBÔ EXTRATOR DE CURSOS (COLUNA DA ESQUERDA) */}
          <div className="xl:col-span-7 bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A67B5B] to-amber-500"></div>
            
            <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-[#A67B5B]" /> Fábrica Mágica de Cursos
            </h2>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-8">
              Cole o link oficial do curso. A nossa I.A. vai ler o código do site externo e extrair a capa de alta resolução e o título automaticamente usando Open Graph.
            </p>

            <div className="bg-stone-50 dark:bg-stone-900/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 mb-6">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><LinkIcon size={14}/> Link Oficial do Curso (Sebrae, ENAP, etc)</label>
              <div className="flex gap-2">
                <input 
                  type="url" value={urlCurso} onChange={e => setUrlCurso(e.target.value)}
                  placeholder="https://www.sebrae.com.br/..." 
                  className="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] transition-all font-medium shadow-inner text-stone-900 dark:text-white"
                />
                <button onClick={extrairMetadadosDoCurso} disabled={extraindoUrl || !urlCurso} className="bg-[#A67B5B] text-white px-5 rounded-xl font-black text-sm hover:bg-[#8d664a] transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0 flex items-center gap-2">
                  {extraindoUrl ? <Loader2 size={16} className="animate-spin"/> : <Search size={16}/>}
                  {extraindoUrl ? "Lendo site..." : "Extrair Capa"}
                </button>
              </div>
            </div>

            {/* PREVIEW DO CARD MÁGICO */}
            <form onSubmit={salvarNovoCurso} className={`transition-all duration-500 ${dadosExtraidos ? 'opacity-100 scale-100' : 'opacity-50 scale-95 pointer-events-none filter grayscale'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* PREVIEW VISUAL */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-32 w-full bg-stone-100 dark:bg-stone-950 relative">
                    {dadosExtraidos?.imagem ? (
                      <img src={dadosExtraidos.imagem} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300"><ImageIcon size={32}/></div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-black text-white bg-stone-900/80 px-2 py-0.5 rounded-full backdrop-blur-md">
                      {dadosExtraidos?.instituicao || "Instituição"}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-indigo-500 mb-1 uppercase">Pré-visualização</p>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-2">{dadosExtraidos?.titulo || "O título do curso aparecerá aqui..."}</h4>
                  </div>
                </div>

                {/* DADOS DO SISTEMA */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Trilha de Destino</label>
                    <select value={novoCurso.trilha} onChange={e => setNovoCurso({...novoCurso, trilha: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-bold text-stone-700 dark:text-stone-300 focus:border-[#A67B5B]">
                      <option value="Vendas">🎯 Vendas B2C</option>
                      <option value="Finanças">📈 Finanças & Caixa</option>
                      <option value="Liderança">👑 Liderança</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Carga (Horas)</label>
                      <input type="number" required value={novoCurso.carga} onChange={e => setNovoCurso({...novoCurso, carga: e.target.value})} placeholder="Ex: 4" className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:border-[#A67B5B] font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Recompensa (XP)</label>
                      <input type="number" required value={novoCurso.xp} onChange={e => setNovoCurso({...novoCurso, xp: e.target.value})} placeholder="Ex: 150" className="w-full px-4 py-2.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400 focus:border-amber-500 font-black" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black text-sm py-4 rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xl active:scale-[0.98]">
                <CheckCircle2 size={18} /> Publicar Curso na Vitrine
              </button>
            </form>
          </div>

          {/* MESA DE APROVAÇÃO (COLUNA DA DIREITA) */}
          <div className="xl:col-span-5 bg-stone-900 dark:bg-stone-950 rounded-[2rem] border border-stone-800 shadow-xl overflow-hidden flex flex-col relative">
            <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-white/5">
              <h3 className="font-black text-white flex items-center gap-2">
                <ShieldAlert size={18} className="text-emerald-400" /> Mesa de Aprovação
              </h3>
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{APROVACOES_PENDENTES_MOCK.length} Fila</span>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {APROVACOES_PENDENTES_MOCK.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-stone-500 py-10">
                    <CheckCircle2 size={48} className="mb-4 opacity-20 text-emerald-500" />
                    <p className="font-medium text-sm text-center">Todos os certificados avaliados.</p>
                 </div>
              ) : (
                APROVACOES_PENDENTES_MOCK.map(pendente => (
                  <div key={pendente.id} className="bg-stone-800/50 border border-stone-700 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{pendente.data_envio}</p>
                        <h4 className="font-bold text-white text-sm mt-1">{pendente.aluno}</h4>
                      </div>
                      <a href="#" className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors" title="Visualizar PDF">
                        <FileText size={14}/>
                      </a>
                    </div>
                    <div className="bg-stone-900 rounded-lg p-3 mb-4 border border-stone-800">
                      <p className="text-xs text-stone-400">Pleiteando XP para:</p>
                      <p className="text-sm font-bold text-indigo-300 truncate">{pendente.curso}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-colors">Rejeitar</button>
                      <button onClick={() => aprovarCertificado(pendente.id)} className="flex-[2] py-2 rounded-xl text-xs font-black text-emerald-900 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                        <Check size={14} strokeWidth={3}/> Validar e Dar XP
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ====================================================================== */}
      {/* 🚀 MODAL: UPLOAD PARA SUPABASE STORAGE (VISÃO DO ALUNO) */}
      {/* ====================================================================== */}
      {modalUpload && cursoAlvo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={() => !enviando && setModalUpload(false)}></div>
          
          <div className="relative bg-white dark:bg-stone-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50 shrink-0">
              <div>
                <h3 className="font-black text-stone-900 dark:text-white text-xl flex items-center gap-2">
                  <UploadCloud size={20} className="text-indigo-500" /> Prova de Conclusão
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Envie o certificado oficial em PDF ou JPG.</p>
              </div>
              <button disabled={enviando} onClick={() => setModalUpload(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors disabled:opacity-50">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={enviarCertificadoSupabase} className="p-6 space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-4 rounded-xl">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Pleiteando os XP do curso:</p>
                <p className="text-sm font-bold text-stone-900 dark:text-white">{cursoAlvo.titulo}</p>
              </div>

              <div className="w-full border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-8 bg-stone-50 dark:bg-stone-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group relative text-center">
                <FileText size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-3 group-hover:text-indigo-500 group-hover:-translate-y-1 transition-all" />
                
                {ficheiroCertificado ? (
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate px-4">{ficheiroCertificado.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-stone-600 dark:text-stone-300 mb-1">Clique para procurar o arquivo</p>
                    <p className="text-xs text-stone-400">Use o arquivo baixado do portal do Sebrae ou ENAP.</p>
                  </>
                )}
                
                <input 
                  type="file" accept=".pdf,.png,.jpg,.jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFicheiroCertificado(e.target.files[0]);
                    }
                  }} 
                />
              </div>

              <button type="submit" disabled={enviando || !ficheiroCertificado} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-black text-lg py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {enviando ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {enviando ? "A encriptar e enviar..." : "Submeter para Validação do RH"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}