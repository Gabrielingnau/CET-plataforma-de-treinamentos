import { supabase } from "@/lib/supabase/client"

/**
 * Dispara o e-mail de recuperação de senha para o usuário.
 */
export async function sendResetPasswordEmail(email: string) {
  // Define a URL de retorno dinâmica (funciona em localhost e produção)
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // O link no e-mail vai para o callback e depois para a tela de nova senha
    redirectTo: `${baseUrl}/auth/callback?next=/redefinir-senha`,
  })

  if (error) {
    throw error
  }

  return true
}