import { supabase } from "@/lib/supabase/client"

export async function createUser(user: any) {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single()

  if (error) throw error

  return data
}
