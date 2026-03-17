import { supabase } from "@/lib/supabase/client"
import { ClientCompanyFormData } from "@/types/forms/client-company-form"

export async function updateClientCompany(
  id: number,
  company: Partial<ClientCompanyFormData>
) {
  const { data, error } = await supabase
    .from("empresas")
    .update(company)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
