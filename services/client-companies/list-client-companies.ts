import { supabase } from "@/lib/supabase/client"
import { ClientCompany } from "@/types/database/client-companies"

export async function listClientCompanies(): Promise<ClientCompany[]> {
  const { data, error } = await supabase.from("empresas").select()

  if (error) throw error

  return data
}
