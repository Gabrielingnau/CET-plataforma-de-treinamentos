import { supabase } from "@/lib/supabase/client"

/**
 * Grava a nova senha definida pelo usuário no Supabase.
 */
export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    throw error
  }

  return true
}