// services/collaborators/toggle-training.ts
import { supabase } from "@/lib/supabase/client"

interface ToggleArgs {
  colabId: string;
  trainingId: number;
  active: boolean;
  empresaId: number;
}

export async function toggleTrainingService({ colabId, trainingId, active, empresaId }: ToggleArgs) {
  if (active) {
    const { error } = await supabase
      .from("user_trainings")
      .delete()
      .match({ user_id: colabId, training_id: trainingId })
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("user_trainings")
      .insert({
        user_id: colabId,
        training_id: trainingId,
        empresa_id: Number(empresaId),
        status: "nao_iniciado",
        progresso: 0
      })
    if (error) throw error
  }
  return true
}