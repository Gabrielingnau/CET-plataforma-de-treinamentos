import { supabase } from "@/lib/supabase/client"
import { LoginFormData } from "@/types/forms/login-form"

export async function login(data: LoginFormData) {
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) throw error
}