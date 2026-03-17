import { createClient } from "@/lib/supabase/server"
import { Training } from "@/types/database/trainings"

export async function getTrainingById(id: number): Promise<Training> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("trainings")
    .select()
    .eq("id", id)
    .single()

  if (error) throw error

  return data
}
