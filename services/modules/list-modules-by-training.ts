import { supabase } from "@/lib/supabase/client"
import { Module } from "@/types/database/modules"

export async function listModulesByTraining(
  trainingId: number
): Promise<Module[]> {
  const { data, error } = await supabase
    .from("modules")
    .select()
    .eq("treinamento_id", trainingId)

  if (error) throw error

  return data
}
