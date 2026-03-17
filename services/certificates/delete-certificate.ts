import { supabase } from "@/lib/supabase/client"

export async function deleteCertificate(id: number) {
  const { error } = await supabase.from("certificates").delete().eq("id", id)

  if (error) throw error
}
