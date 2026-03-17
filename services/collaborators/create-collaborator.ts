import { supabase } from "@/lib/supabase/client"
import { CollaboratorFormData } from "@/types/forms/collaborator-form"

export async function createCollaborator(collaborator: CollaboratorFormData) {
  const { data, error } = await supabase
    .from("colaboradores")
    .insert(collaborator)
    .select()
    .single()

  if (error) throw error

  return data
}
