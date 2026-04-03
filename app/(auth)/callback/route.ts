import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  
  // Define para onde ir após o login (Padrão: /resetar-senha para e-mails de recuperação)
  const next = searchParams.get("next") ?? "/resetar-senha"

  if (code) {
    const supabase = await createClient()

    // Troca o código PKCE pela sessão real
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const redirectUrl = new URL(next, origin)
      
      // Se o destino for resetar-senha, avisamos o middleware que é uma recuperação
      if (next === "/resetar-senha") {
        redirectUrl.searchParams.set("type", "recovery")
      }
      
      return NextResponse.redirect(redirectUrl.toString())
    }
    
    console.error("Erro no Callback Auth:", error.message)
  }

  // Em caso de erro, volta para o login com um parâmetro de erro
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}