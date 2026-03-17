import { supabase } from "@/lib/supabase/client"
import { User } from "@/types/database/users"

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .maybeSingle() // retorna null se não encontrar ou RLS bloquear

  if (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }

  return data as User | null
}