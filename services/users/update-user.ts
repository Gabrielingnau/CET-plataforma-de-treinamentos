import { supabase } from "@/lib/supabase/client"

export async function updateUser(id: string, user: any) {
  const { data, error } = await supabase
    .from("users")
    .update(user)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
