"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { 
  GraduationCap, Trophy, BookOpen, Star, 
  PlayCircle, CheckCircle2, UploadCloud, FileText, 
  ExternalLink, Award, X, Loader2, Sparkles, Target, 
  TrendingUp, BrainCircuit
} from "lucide-react";

// ============================================================================
// 🚀 MOCKS DA ACADEMY
// ============================================================================
const TRILHAS_MOCK = [
  {
    id: "TR-001", titulo: "Mestre das Vendas B2C", icone: <Target size={24} className="text-rose-500"/>,
    cursos: [
      { id: "C-101", titulo: "Atendimento ao Cliente de Alto Impacto", instituicao: "Sebrae", carga: 4, xp: 150, url: "#" },
      { id: "C-102", titulo: "Gatilhos Mentais no WhatsApp", instituicao: "YouTube / Baply", carga: 2, xp: 100, url: "#" }
    ]
  },
  {
    id: "TR-002", titulo: "Gestão Financeira e Caixa", icone: <TrendingUp size={24} className="text-emerald-500"/>,
    cursos: [
      { id: "C-201", titulo: "Gestão de Fluxo de Caixa", instituicao: "ENAP", carga: 10, xp: 300, url: "#" },
      { id: "C-202", titulo: "Precificação Inteligente", instituicao: "Sebrae", carga: 5, xp: 200, url: "#" }
    ]
  }
];

const PROGRESSO_MOCK = [
  { id: "P-001", curso_id: "C-101", titulo: "Atendimento ao Cliente de Alto Impacto", status: "Em Andamento", xp_ganho: 0 },
  { id: "P-002", curso_id: "C-202", titulo: "Precificação Inteligente", status: "Concluído", xp_ganho: 200, certificado: "url_do_supabase.pdf" }
];

export default function BaplyAcademyPage() {
  const supabase = createClient();
  const [abaAtiva, setAbaAtiva] = useState("trilhas"); 
  
  // 💡 LÓGICA WHITE-LABEL: Se o cliente configurar um nome, usamos. Senão, é Baply!
  const nomeAcademyPersonalizado = ""; // Ex: "Sweet Academy"
  const nomeAcademy = nomeAcademyPersonalizado || "Baply Academy";
  
  const [modalUpload, setModalUpload] = useState(false);
  const [cursoAlvo, setCursoAlvo] = useState<any>(null);
  const [ficheiroCertificado, setFicheiroCertificado] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const xpTotal = PROGRESSO_MOCK.reduce((acc, curr) => acc + curr.xp_ganho, 0);
  const nivelAtual = Math.floor(xpTotal / 500) + 1; 
  const xpProximoNivel = nivelAtual * 500;
  const pctProgresso = Math.min((xpTotal / xpProximoNivel) * 100, 100);

  const abrirModalCertificado = (curso: any) => {
    setCursoAlvo(curso);
    setFicheiroCertificado(null);
    setModalUpload(true);
  };

  const enviarCertificadoSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiroCertificado) return toast.error("Anexe o PDF ou imagem do certificado.");

    setEnviando(true);

    try {
      const fileExt = ficheiroCertificado.name.split('.').pop();
      const fileName = `certificado_${cursoAlvo.id}_${Date.now()}.${fileExt}`;
      const filePath = `usuario_teste/${fileName}`;

      setTimeout(() => {
        toast.success("Certificado enviado para validação! 🎉", {
          description: "Assim que aprovado, receberá os seus XP."
        });
        setEnviando(false);
        setModalUpload(false);
      }, 2000);

    } catch (error) {
      toast.error("Erro ao enviar o ficheiro para o servidor.");
      setEnviando(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 mb-20 relative">
      
      <div className="mb-10 bg-stone-900 dark:bg-stone-950 rounded-[2rem] p-8 md:p-10 border border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-indigo-400 text-xs font-bold mb-4 backdrop-blur-sm">
            <GraduationCap size={14} /> Universidade Corporativa
          </div>
          {/* 👇 NOME DINÂMICO APLICADO AO TÍTULO GIGANTE 👇 */}
          <h1 className="text-4xl font-black text-white tracking-tight">{nomeAcademy}</h1>
          <p className="text-stone-400 font-medium mt-2 max-w-md">
            O conhecimento é o único ativo que escala infinitamente. Complete as trilhas e suba o nível da sua carreira.
          </p>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 w-full md:w-96 backdrop-blur-md">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><Trophy size={14} className="text-amber-400"/> O Seu Nível</p>
              <h3 className="text-3xl font-black text-white mt-1">Lvl. {nivelAtual} <span className="text-sm font-medium text-stone-500">({xpTotal} XP)</span></h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-indigo-400">Faltam {xpProximoNivel - xpTotal} XP</p>
            </div>
          </div>
          <div className="h-2.5 w-full bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 relative" style={{ width: `${pctProgresso}%` }}>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-8 border-b border-stone-200 dark:border-stone-700 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button onClick={() => setAbaAtiva("trilhas")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "trilhas" ? "border-indigo-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <BookOpen size={18} className={`transition-all ${abaAtiva === "trilhas" ? "text-indigo-500 scale-110" : ""}`} /> Explorar Trilhas
        </button>
        <button onClick={() => setAbaAtiva("meu_progresso")} className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${abaAtiva === "meu_progresso" ? "border-emerald-500 text-stone-900 dark:text-white" : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
          <Award size={18} className={`transition-all ${abaAtiva === "meu_progresso" ? "text-emerald-500 scale-110" : ""}`} /> O Meu Progresso & Certificados
        </button>
      </div>

      {abaAtiva === "trilhas" && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {TRILHAS_MOCK.map((trilha) => (
            <div key={trilha.id} className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800 shadow-inner">
                  {trilha.icone}
                </div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">{trilha.titulo}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trilha.cursos.map((curso) => (
                  <div key={curso.id} className="group border border-stone-200 dark:border-stone-700 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-lg bg-stone-50/50 dark:bg-stone-900/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          {curso.instituicao}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Star size={12}/> +{curso.xp} XP
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {curso.titulo}
                      </h4>
                      <p className="text-xs font-medium text-stone-500 flex items-center gap-1.5 mb-6">
                        <BrainCircuit size={14}/> Carga Horária: {curso.carga}h
                      </p>
                    </div>
                    
                    <a href={curso.url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-sm py-3 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all active:scale-95 group/btn">
                      <PlayCircle size={16} className="group-hover/btn:scale-110 transition-transform" /> Iniciar Curso Externo
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {abaAtiva === "meu_progresso" && (
        <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 p-8 shadow-sm animate-in fade-in duration-300 min-h-[400px]">
          <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2 mb-6">
            <Award size={20} className="text-emerald-500" /> Cofre de Conquistas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-700 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  <th className="pb-4 pl-4">Formação</th>
                  <th className="pb-4 text-center">Status</th>
                  <th className="pb-4 text-right">Recompensa</th>
                  <th className="pb-4 text-center pr-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
                {PROGRESSO_MOCK.map((prog) => (
                  <tr key={prog.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors">
                    <td className="py-4 pl-4 font-bold text-stone-900 dark:text-white text-sm">
                      {prog.titulo}
                    </td>
                    <td className="py-4 text-center">
                      {prog.status === "Concluído" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                          <CheckCircle2 size={12} /> Aprovado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20">
                          <Loader2 size={12} className="animate-spin" /> {prog.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {prog.xp_ganho > 0 ? (
                        <span className="text-xs font-black text-amber-500">+{prog.xp_ganho} XP</span>
                      ) : (
                        <span className="text-xs font-medium text-stone-400">Pendente</span>
                      )}
                    </td>
                    <td className="py-4 text-center pr-4">
                      {prog.status === "Concluído" ? (
                        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1 w-full">
                          <ExternalLink size={14}/> Ver Certificado
                        </button>
                      ) : (
                        <button onClick={() => abrirModalCertificado(prog)} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 w-full max-w-[160px] mx-auto">
                          <UploadCloud size={14}/> Anexar Certificado
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

      {modalUpload && cursoAlvo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={() => !enviando && setModalUpload(false)}></div>
          
          <div className="relative bg-white dark:bg-stone-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50 shrink-0">
              <div>
                <h3 className="font-black text-stone-900 dark:text-white text-xl flex items-center gap-2">
                  <UploadCloud size={20} className="text-indigo-500" /> Prova de Conclusão
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Envie o certificado para a Nuvem da Baply.</p>
              </div>
              <button disabled={enviando} onClick={() => setModalUpload(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors disabled:opacity-50">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={enviarCertificadoSupabase} className="p-6 space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-4 rounded-xl">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Referente ao Curso:</p>
                <p className="text-sm font-bold text-stone-900 dark:text-white">{cursoAlvo.titulo}</p>
              </div>

              <div className="w-full border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-8 bg-stone-50 dark:bg-stone-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group relative text-center">
                <FileText size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-3 group-hover:text-indigo-500 group-hover:-translate-y-1 transition-all" />
                
                {ficheiroCertificado ? (
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate px-4">{ficheiroCertificado.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-stone-600 dark:text-stone-300 mb-1">Clique para procurar o PDF</p>
                    <p className="text-xs text-stone-400">PDF, PNG ou JPG oficial do Sebrae/ENAP.</p>
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

              <button type="submit" disabled={enviando || !ficheiroCertificado} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-black text-sm py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {enviando ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {enviando ? "A encriptar e enviar..." : "Submeter para Validação"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}