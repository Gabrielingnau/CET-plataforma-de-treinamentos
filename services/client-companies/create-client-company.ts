import { supabase } from "@/lib/supabase/client"
import { ClientCompanyFormData } from "@/types/forms/client-company-form"

export async function createClientCompany(company: ClientCompanyFormData) {
  const { data, error } = await supabase
    .from("empresas")
    .insert(company)
    .select()
    .single()

  if (error) throw error

  return data
}
