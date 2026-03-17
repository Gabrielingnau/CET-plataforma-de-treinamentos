import { supabase } from "@/lib/supabase/client"

export async function deleteTraining(id: number) {
  const { error } = await supabase.from("trainings").delete().eq("id", id)

  if (error) throw error
}
