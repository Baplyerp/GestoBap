import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // 1. Recebe a "ficha de inscrição" preenchida lá na tela do CEO
    const body = await request.json();
    const { nome, email, cargo, nivel } = body;

    // 2. Cria a conexão "Modo Deus" com o Supabase usando a Chave Secreta
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 3. Dispara o E-mail Mágico de Convite (padrão do Supabase)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (authError) {
      return NextResponse.json({ erro: authError.message }, { status: 400 });
    }

    // 4. Se o convite foi enviado, grava o crachá do colaborador na tabela perfis
    if (authData.user) {
      const { error: dbError } = await supabaseAdmin.from("perfis").insert([
        {
          id: authData.user.id,
          nome: nome,
          cargo: cargo,
          nivel: nivel,
        }
      ]);

      if (dbError) {
        return NextResponse.json({ erro: "Convite enviado, mas erro ao criar perfil visual: " + dbError.message }, { status: 400 });
      }
    }

    // 5. Dá o ok para a tela mostrar a notificação verde da Sonner!
    return NextResponse.json({ sucesso: true, mensagem: "Convite enviado com sucesso!" });

  } catch (error) {
    return NextResponse.json({ erro: "Erro interno no cofre do servidor." }, { status: 500 });
  }
}