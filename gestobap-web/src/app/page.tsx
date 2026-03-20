"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, ShieldCheck, Box } from "lucide-react";

// ============================================================================
// 🚀 INTEGRAÇÃO (MOCK): PUXANDO DADOS DA GOVERNANÇA
// Na vida real, isso virá de uma consulta ao Supabase na tabela de config da loja.
// ============================================================================
const CONFIG_LOJA_MOCK = {
  nome: "Sweet Home",
  slogan: "Conforto e luxo para o seu lar.",
  // Experimente DELETAR o conteúdo das aspas da "logo" e do "bg_login" abaixo 
  // para ver o sistema voltar magicamente para o "Modo Baply Original"!
  logo: "", 
  bg_login: "",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  
  // 🛡️ ESTADOS ANTI-BUG (O Porteiro Invisível)
  const [isMounted, setIsMounted] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  // 🚀 O PORTEIRO: Verifica a sessão ANTES de desenhar a tela
  useEffect(() => {
    setIsMounted(true);
    
    const checarSessaoAtiva = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Se já tem sessão, joga direto pro Dashboard sem a tela piscar
        router.push("/dashboard");
      } else {
        // Se não tem, libera a tela de login para o usuário
        setVerificandoSessao(false);
      }
    };
    
    checarSessaoAtiva();
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  // 🛡️ TELA DE CARREGAMENTO SEGURO (Bloqueia o "piscar" da tela)
  if (!isMounted || verificandoSessao) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900 text-[#A67B5B]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Iniciando Baply OS...</p>
      </div>
    );
  }

  // 🛡️ Lógica do "Camaleão": A loja tem identidade própria?
  const temPersonalizacao = Boolean(CONFIG_LOJA_MOCK.logo && CONFIG_LOJA_MOCK.bg_login);

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans animate-in fade-in duration-500">
      
      {/* ====================================================================== */}
      {/* 🎨 LADO ESQUERDO: O PALCO (Alterna entre Baply e a Marca do Cliente) */}
      {/* ====================================================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 p-12 flex-col justify-between relative overflow-hidden">
        
        {temPersonalizacao ? (
          // 🌟 CENÁRIO A: MARCA DO CLIENTE (Ex: Sweet Home)
          <>
            {/* Foto de Fundo da Loja (Com overlay escuro para o texto ler bem) */}
            <div className="absolute inset-0 z-0">
              <img src={CONFIG_LOJA_MOCK.bg_login} alt="Fundo" className="w-full h-full object-cover opacity-40 animate-in zoom-in-105 duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent"></div>
            </div>

            <div className="relative z-10 flex items-center gap-4 animate-in slide-in-from-left-8 duration-700">
              <img src={CONFIG_LOJA_MOCK.logo} alt="Logo" className="w-16 h-16 rounded-2xl shadow-2xl border-2 border-white/10" />
            </div>

            <div className="relative z-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
              <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Workspace <br/>
                <span className="text-[#A67B5B]">{CONFIG_LOJA_MOCK.nome}</span>
              </h1>
              <p className="text-stone-300 text-lg font-medium max-w-md">
                {CONFIG_LOJA_MOCK.slogan}
              </p>
            </div>
          </>
        ) : (
          // 🔵 CENÁRIO B: FALLBACK BAPLY (Original e Intacto)
          <>
            {/* Efeitos de Fundo Elegantes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#A67B5B] rounded-full blur-[120px]"></div>
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-stone-800 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 flex items-center gap-3 animate-in slide-in-from-left-8 duration-700">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#A67B5B] font-black text-2xl shadow-lg">
                B
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">
                Baply<span className="text-[#A67B5B]">.</span>
              </span>
            </div>

            <div className="relative z-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
              <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">
                A evolução da<br />
                sua gestão começa<br />
                <span className="text-[#A67B5B]">aqui.</span>
              </h1>
              <p className="text-stone-400 text-lg font-medium max-w-md">
                Acesse o Workspace exclusivo da Baply. Controle de tropa, gestão de ponto e dados em uma única plataforma premium.
              </p>
            </div>
          </>
        )}

        {/* Selo de Segurança (Fica igual nos dois cenários) */}
        <div className="relative z-10 flex items-center gap-2 text-stone-400 text-sm font-medium animate-in fade-in duration-1000 delay-300">
          <ShieldCheck size={18} className={temPersonalizacao ? "text-emerald-500" : "text-[#A67B5B]"} />
          <span>Ambiente corporativo seguro</span>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 🔐 LADO DIREITO: FORMULÁRIO DE LOGIN (A MÁQUINA) */}
      {/* ====================================================================== */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 relative z-10 bg-stone-50">
        
        {/* Container que centraliza o form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            
            <div className="mb-10 text-center lg:text-left">
              {/* Logo para versão Mobile */}
              <div className="lg:hidden mx-auto mb-6 flex justify-center">
                {temPersonalizacao ? (
                   <img src={CONFIG_LOJA_MOCK.logo} className="w-20 h-20 rounded-3xl shadow-xl border-2 border-stone-200" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center text-[#A67B5B] font-black text-3xl shadow-lg">
                    B
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-black text-stone-900 tracking-tight">Bem-vindo de volta</h2>
              <p className="text-stone-500 font-medium mt-2">
                {temPersonalizacao ? `Acesso restrito à equipe ${CONFIG_LOJA_MOCK.nome}.` : "Insira suas credenciais corporativas."}
              </p>
            </div>

            {erro && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-full bg-red-600 rounded-full"></div>
                {erro}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all shadow-sm"
                    placeholder="voce@empresa.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Senha de Acesso</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Acessar Workspace"}
              </button>
            </form>
          </div>
        </div>

        {/* 👇 A ASSINATURA DE GRIFE */}
        <div className="mt-8 flex justify-center animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2 px-4 py-2 bg-stone-200/50 rounded-full text-stone-400 opacity-60 hover:opacity-100 transition-opacity cursor-default">
            <Box size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Powered by Baply OS</span>
          </div>
        </div>

      </div>
    </div>
  );
}