"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();
  const supabase = createClient();

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

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans">
      
      {/* LADO ESQUERDO: BRANDING DA BAPLY (A Tela Premium com as cores do Dash) */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Efeitos de Fundo Elegantes (Idênticos ao Cartão do Dashboard) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#A67B5B] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-stone-800 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#A67B5B] font-black text-2xl shadow-lg">
            B
          </div>
          <span className="text-3xl font-black tracking-tighter text-white">
            Baply<span className="text-[#A67B5B]">.</span>
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">
            A evolução da<br />
            sua gestão começa<br />
            <span className="text-[#A67B5B]">aqui.</span>
          </h1>
          <p className="text-stone-400 text-lg font-medium max-w-md">
            Acesse o Workspace exclusivo da Baply. Controle de tropa, gestão de ponto e dados em uma única plataforma premium.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-stone-500 text-sm font-medium">
          <ShieldCheck size={18} className="text-[#A67B5B]" />
          <span>Ambiente Seguro e Criptografado</span>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO DE LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10 bg-stone-50">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          <div className="mb-10 text-center lg:text-left">
            {/* Logo para versão Mobile */}
            <div className="lg:hidden w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center text-[#A67B5B] font-black text-3xl shadow-lg mx-auto mb-6">
              B
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">Bem-vindo de volta</h2>
            <p className="text-stone-500 font-medium mt-2">Insira suas credenciais corporativas.</p>
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
                  placeholder="ceo@baply.com"
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
    </div>
  );
}