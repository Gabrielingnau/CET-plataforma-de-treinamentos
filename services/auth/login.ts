import { supabase } from "@/lib/supabase/client"
import { LoginFormData } from "@/types/forms/login-form"

export async function login(data: LoginFormData) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    // Se der erro, para tudo aqui e joga o erro pro useMutation
    throw error
  }

  // Retorna apenas o data (que contém user e session)
  return authData
}