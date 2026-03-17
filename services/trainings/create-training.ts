import { supabase } from "@/lib/supabase/client"
import { CreateTrainingPayload } from "@/types/database/trainings"

export async function createTraining(training: CreateTrainingPayload) {
  const { data, error } = await supabase
    .from("trainings")
    .insert(training)
    .select()
    .single()

  if (error) throw error

  return data
}
