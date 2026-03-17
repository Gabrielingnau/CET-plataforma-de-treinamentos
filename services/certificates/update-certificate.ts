import { supabase } from "@/lib/supabase/client"

export async function updateCertificate(id: number, certificate: any) {
  const { data, error } = await supabase
    .from("certificates")
    .update(certificate)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
