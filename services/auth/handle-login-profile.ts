import { supabase } from "@/lib/supabase/client"
import { AuthProfileResponse } from "@/types/database/users"

/**
 * Lógica de negócio executada após um login bem-sucedido.
 * Verifica a role e atualiza o status de primeiro login se necessário.
 */
export async function handleLoginProfile(userId: string) {
  // 1. Busca os dados do perfil
  const { data: profile, error } = await supabase
    .from("users")
    .select("role, primeiro_login")
    .eq("id", userId)
    .single() as { data: AuthProfileResponse | null, error: any }

  if (error || !profile) return null
  console.log(profile)
  // 2. Regra: Se for admin no primeiro acesso, marca como concluído
  if (profile.role === "admin" && profile.primeiro_login) {
    await supabase
      .from("users")
      .update({ primeiro_login: false })
      .eq("id", userId)
  }

  return profile
}