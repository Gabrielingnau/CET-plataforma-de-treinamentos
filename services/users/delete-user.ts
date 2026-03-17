import { supabase } from "@/lib/supabase/client"

export async function deleteUser(id: string) {
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) throw error
}
