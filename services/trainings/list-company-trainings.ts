import { createClient } from "@/lib/supabase/server"
import { Training } from "@/types/database/trainings"

export async function listCompanyTrainings(
  companyId: number
): Promise<Training[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("company_trainings")
    .select()
    .eq("empresa_id", companyId)

  if (error) throw error

  return data
}
