"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Camera, User, Mail, Briefcase, ShieldCheck, 
  Phone, KeyRound, Moon, Sun, MonitorSmartphone, Loader2, ChevronDown
} from "lucide-react";

// 🎨 NOSSA PALETA DE STATUS PREMIUM
const STATUS_OPTIONS = [
  { nome: "Disponível", corBolinha: "bg-emerald-500", estiloBadge: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { nome: "Focado", corBolinha: "bg-red-500", estiloBadge: "bg-red-50 text-red-600 border-red-100" },
  { nome: "Almoço", corBolinha: "bg-amber-500", estiloBadge: "bg-amber-50 text-amber-600 border-amber-100" },
  { nome: "Ausente", corBolinha: "bg-stone-400", estiloBadge: "bg-stone-100 text-stone-600 border-stone-200" }
];

export default function MeuPerfilPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuStatusRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [menuStatusAberto, setMenuStatusAberto] = useState(false);
  
  const [perfil, setPerfil] = useState({
    id: "",
    nome: "",
    email: "",
    cargo: "",
    nivel: "",
    telefone: "",
    avatar_url: "",
    status: "Disponível" // Estado inicial
  });

  useEffect(() => {
    async function carregarPerfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dadosPerfil } = await supabase
          .from("perfis")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dadosPerfil) {
          setPerfil({
            id: user.id,
            nome: dadosPerfil.nome || "",
            email: user.email || "",
            cargo: dadosPerfil.cargo || "Colaborador",
            nivel: dadosPerfil.nivel || "Básico",
            telefone: dadosPerfil.telefone || "",
            avatar_url: dadosPerfil.avatar_url || "",
            status: dadosPerfil.status || "Disponível" // Puxa do banco se existir
          });
        }
      }
      setLoading(false);
    }
    carregarPerfil();

    // Fecha o menuzinho de status se clicar fora
    function handleClickOutside(event: MouseEvent) {
      if (menuStatusRef.current && !menuStatusRef.current.contains(event.target as Node)) {
        setMenuStatusAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [supabase]);

  const handleUploadFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error("Selecione uma imagem.");

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${perfil.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase.from('perfis').update({ avatar_url: publicUrl }).eq('id', perfil.id);
      if (updateError) throw updateError;

      setPerfil({ ...perfil, avatar_url: publicUrl });
      toast.success("Foto atualizada!");
      window.dispatchEvent(new Event("perfilAtualizado"));

    } catch (error: any) {
      toast.error("Erro na foto", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSalvarDados = async () => {
    setSalvando(true);
    try {
      const { error } = await supabase.from("perfis").update({ nome: perfil.nome, telefone: perfil.telefone }).eq("id", perfil.id);
      if (error) throw error;
      toast.success("Dados salvos!");
      window.dispatchEvent(new Event("perfilAtualizado"));
    } catch (error: any) {
      toast.error("Erro ao salvar", { description: error.message });
    } finally {
      setSalvando(false);
    }
  };

  // ⚡ FUNÇÃO QUE TROCA O STATUS E FECHA O MENU
  const mudarStatus = async (novoStatus: string) => {
    setPerfil({ ...perfil, status: novoStatus });
    setMenuStatusAberto(false);
    
    try {
      // Salva silenciosamente no banco de dados
      await supabase.from("perfis").update({ status: novoStatus }).eq("id", perfil.id);
      toast.success(`Status alterado para ${novoStatus}`);
    } catch (error) {
      console.error("Erro ao salvar status no banco", error);
    }
  };

  if (loading) return <div className="flex justify-center p-20 text-stone-400"><Loader2 className="animate-spin" size={32} /></div>;

  // Encontra as cores do status atual para pintar a bolinha corretamente
  const statusAtual = STATUS_OPTIONS.find(s => s.nome === perfil.status) || STATUS_OPTIONS[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative max-w-5xl mx-auto">
      
      <div className="mb-10">
        <h1 className="text-4xl font-black text-stone-900 tracking-tight">Meu Perfil</h1>
        <p className="text-stone-500 font-medium mt-1">Gerencie sua identidade digital e preferências no ecossistema Baply.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: O SUPER-AVATAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-8 flex flex-col items-center text-center relative group">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-stone-100 to-white -z-10 rounded-t-[2rem]"></div>

            <div className="relative mb-6 mt-4">
              {perfil.avatar_url ? (
                <img src={perfil.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl bg-stone-100" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-stone-900 flex items-center justify-center text-5xl border-4 border-white shadow-xl overflow-hidden">👨‍💼</div>
              )}
              
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUploadFoto} disabled={uploading} />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute bottom-0 right-0 w-10 h-10 bg-[#A67B5B] hover:bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 border-2 border-white disabled:opacity-50">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              </button>
            </div>

            <h2 className="text-2xl font-black text-stone-900 tracking-tight">{perfil.nome}</h2>
            <p className="text-stone-500 font-medium flex items-center justify-center gap-2 mt-1">{perfil.cargo}</p>

            <div className="flex gap-2 mt-6 w-full justify-center items-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${perfil.nivel === 'Admin' ? 'bg-stone-900 text-[#A67B5B]' : 'bg-stone-100 text-stone-600'}`}>
                {perfil.nivel === 'Admin' && <ShieldCheck size={14} />} {perfil.nivel}
              </span>
              
              {/* 🎯 O BOTÃO DE STATUS INTERATIVO */}
              <div className="relative" ref={menuStatusRef}>
                <button 
                  onClick={() => setMenuStatusAberto(!menuStatusAberto)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm transition-all hover:scale-105 active:scale-95 ${statusAtual.estiloBadge}`}
                >
                  {/* ✨ O EFEITO RADAR PREMIUM ✨ */}
                  <div className="relative flex h-2 w-2 items-center justify-center">
                    {/* A "onda" que pisca suavemente ao redor (só aparece se estiver Disponível) */}
                    {perfil.status === 'Disponível' && (
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusAtual.corBolinha} opacity-75`}></span>
                    )}
                    {/* A bolinha sólida central */}
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${statusAtual.corBolinha}`}></span>
                  </div>
                  
                  {perfil.status}
                  <ChevronDown size={12} className="opacity-50 ml-0.5" />
                </button>

                {/* O MENU FLUTUANTE DE STATUS (Versão Premium Dinâmica) */}
                {menuStatusAberto && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white rounded-xl shadow-2xl border border-stone-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {STATUS_OPTIONS.map((opcao) => (
                      <button
                        key={opcao.nome}
                        onClick={() => mudarStatus(opcao.nome)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left ${
                          perfil.status === opcao.nome 
                            ? "bg-stone-50 text-stone-900 shadow-sm" // Destaca a opção atual
                            : "text-stone-500 hover:bg-stone-50 hover:text-stone-900" // Opções inativas
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${opcao.corBolinha} ${perfil.status === opcao.nome ? 'animate-pulse' : ''}`}></span>
                        {opcao.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: CONFIGURAÇÕES */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-8">
            <h3 className="font-black text-stone-900 text-lg mb-6 flex items-center gap-2"><User className="text-[#A67B5B]" /> Dados Cadastrais</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Nome de Exibição</label>
                <input type="text" value={perfil.nome} onChange={(e) => setPerfil({...perfil, nome: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all font-medium text-stone-900" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">WhatsApp / Celular</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="text" value={perfil.telefone} onChange={(e) => setPerfil({...perfil, telefone: e.target.value})} placeholder="(00) 00000-0000" className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all font-medium text-stone-900" />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center justify-between">E-mail Corporativo <span className="text-[10px] bg-stone-200 text-stone-500 px-2 py-0.5 rounded-md">Somente Leitura</span></label>
                <div className="relative opacity-70">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="text" value={perfil.email} readOnly className="w-full pl-11 pr-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={handleSalvarDados} disabled={salvando} className="px-6 py-3 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-stone-900/20 disabled:opacity-50 flex items-center gap-2">
                {salvando ? <Loader2 size={16} className="animate-spin" /> : null} Salvar Alterações
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-8 flex flex-col justify-between">
              <div><h3 className="font-black text-stone-900 text-lg mb-2 flex items-center gap-2"><KeyRound className="text-stone-400" /> Segurança</h3><p className="text-sm text-stone-500 font-medium mb-6">Mantenha sua conta protegida atualizando sua senha periodicamente.</p></div>
              <button className="w-full py-3 px-4 bg-stone-50 border border-stone-200 text-stone-700 font-bold text-sm rounded-xl hover:bg-stone-100 transition-colors">Alterar Senha de Acesso</button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-8 flex flex-col justify-between">
              <div><h3 className="font-black text-stone-900 text-lg mb-2 flex items-center gap-2"><MonitorSmartphone className="text-stone-400" /> Aparência</h3><p className="text-sm text-stone-500 font-medium mb-6">Personalize como você enxerga o sistema.</p></div>
              <div className="flex bg-stone-100 p-1.5 rounded-xl">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white shadow-sm rounded-lg text-sm font-bold text-stone-900"><Sun size={16} /> Claro</button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors"><Moon size={16} /> Escuro</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}