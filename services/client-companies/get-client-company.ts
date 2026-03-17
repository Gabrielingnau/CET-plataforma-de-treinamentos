import { supabase } from "@/lib/supabase/client"
import { ClientCompany } from "@/types/database/client-companies"

export async function getClientCompanyById(id: number): Promise<ClientCompany> {
  const { data, error } = await supabase
    .from("empresas")
    .select()
    .eq("id", id)
    .single()

  if (error) throw error

  return data
}
