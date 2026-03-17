import { supabase } from "@/lib/supabase/client"

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    // Você pode tratar o erro ou apenas lançá-lo para quem chama a função
    throw error
  }
}