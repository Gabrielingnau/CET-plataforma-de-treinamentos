import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  
  // O link do seu email tem ?next=/resetar-senha
  const next = searchParams.get("next") ?? "/resetar-senha"

  if (code) {
    const supabase = await createClient()

    // O PKCE troca o código pela sessão aqui no servidor
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Com a sessão trocada, o usuário agora está logado
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error("Erro PKCE:", error.message)
  }

  // Se falhar, volta para o login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}