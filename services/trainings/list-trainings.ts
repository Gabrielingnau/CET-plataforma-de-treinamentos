import { createClient } from "@/lib/supabase/server"
import { Training } from "@/types/database/trainings"

export async function listTrainings(): Promise<Training[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("trainings").select()

  if (error) throw error

  return data
}
