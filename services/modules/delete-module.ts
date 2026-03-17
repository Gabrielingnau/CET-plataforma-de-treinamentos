import { supabase } from "@/lib/supabase/client"

export async function deleteModule(id: number) {
  const { error } = await supabase.from("modules").delete().eq("id", id)

  if (error) throw error
}
