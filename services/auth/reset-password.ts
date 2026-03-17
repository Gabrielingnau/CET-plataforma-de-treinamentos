// @/services/auth/reset-password.ts (ou similar)
import { supabase } from "@/lib/supabase/client"

export async function sendResetPasswordEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // O segredo está aqui: o redirectTo deve ser o seu callback com o parâmetro next
    redirectTo: `${window.location.origin}/callback?next=/resetar-senha`,
  })

  if (error) throw error
  return true
}