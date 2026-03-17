import { supabase } from "@/lib/supabase/client"
import { TrainingFormData } from "@/types/forms/training-form"

export async function updateTraining(
  id: number,
  training: Partial<TrainingFormData>
) {
  const { data, error } = await supabase
    .from("trainings")
    .update(training)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
