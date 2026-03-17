import { supabase } from "@/lib/supabase/client"
import { User } from "@/types/database/users"

export async function listUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select()

  if (error) throw error

  return data
}
