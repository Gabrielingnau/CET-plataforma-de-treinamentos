import { supabase } from "@/lib/supabase/client"

export async function createCertificate(certificate: any) {
  const { data, error } = await supabase
    .from("certificates")
    .insert(certificate)
    .select()
    .single()

  if (error) throw error

  return data
}
