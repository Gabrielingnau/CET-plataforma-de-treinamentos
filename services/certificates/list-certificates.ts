import { supabase } from "@/lib/supabase/client"
import { Certificate } from "@/types/database/certificates"

export async function listCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase.from("certificates").select()

  if (error) throw error

  return data
}
