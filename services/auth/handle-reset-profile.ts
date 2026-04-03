import { supabase } from "@/lib/supabase/client";

/**
 * Apenas marca o status de 'primeiro_login' como concluído (false).
 */
export async function handleResetProfile(userId: string) {
  const { error } = await supabase
    .from("users")
    .update({ 
      primeiro_login: false,
      updated_at: new Date().toISOString() // Opcional: mantém o rastro de quando foi feito
    })
    .eq("id", userId);

  if (error) {
    console.error("Erro ao atualizar status de primeiro login:", error.message);
    throw error;
  }

  return true;
}