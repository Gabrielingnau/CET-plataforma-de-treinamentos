import { supabase } from "@/lib/supabase/client"

export async function deleteCollaborator(id: number) {
  const { error } = await supabase.from("colaboradores").delete().eq("id", id)

  if (error) throw error
}
