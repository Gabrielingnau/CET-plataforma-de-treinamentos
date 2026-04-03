import { supabase } from "@/lib/supabase/client"
import { LoginFormData } from "@/types/forms/login-form"

export async function login(data: LoginFormData) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    // Lançamos o erro original para o TanStack Query capturar no onError
    throw error
  }

  return authData
}