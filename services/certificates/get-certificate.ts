import { supabase } from "@/lib/supabase/client"
import { Certificate } from "@/types/database/certificates"

export async function getCertificateById(id: number): Promise<Certificate> {
  const { data, error } = await supabase
    .from("certificates")
    .select()
    .eq("id", id)
    .single()

  if (error) throw error

  return data
}
