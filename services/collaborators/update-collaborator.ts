import { supabase } from "@/lib/supabase/client"
import { CollaboratorFormData } from "@/types/forms/collaborator-form"

export async function updateCollaborator(
  id: number,
  collaborator: Partial<CollaboratorFormData>
) {
  const { data, error } = await supabase
    .from("colaboradores")
    .update(collaborator)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
