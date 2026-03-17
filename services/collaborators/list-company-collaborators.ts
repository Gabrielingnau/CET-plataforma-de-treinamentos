import { supabase } from "@/lib/supabase/client"
import { Collaborator } from "@/types/database/collaborators"

export async function listCompanyCollaborators(
  companyId: number
): Promise<Collaborator[]> {
  const { data, error } = await supabase
    .from("colaboradores")
    .select()
    .eq("empresa_id", companyId)

  if (error) throw error

  return data
}
