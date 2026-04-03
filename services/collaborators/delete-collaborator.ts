// delete-collaborator.ts
import { supabase } from "@/lib/supabase/client"

export async function deleteCollaborator(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId)
  if (error) throw error
  return true
}

// update-collaborator.ts
export async function updateCollaborator(userId: string, data: { nome: string, cpf: string }) {
  const { error } = await supabase
    .from("users")
    .update({ nome: data.nome, cpf: data.cpf })
    .eq("id", userId)
  if (error) throw error
  return true
}