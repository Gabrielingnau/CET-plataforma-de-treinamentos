import { supabase } from "@/lib/supabase/client"
import { User } from "@/types/database/users"

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("Usuário não autenticado")
    return null
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }

  return data as User | null
}