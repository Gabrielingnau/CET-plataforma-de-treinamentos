import { supabase } from "@/lib/supabase/client"

export async function deleteClientCompany(id: number) {
  const { error } = await supabase.from("empresas").delete().eq("id", id)

  if (error) throw error
}
