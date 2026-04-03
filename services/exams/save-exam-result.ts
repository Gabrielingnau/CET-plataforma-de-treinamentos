import { supabase } from "@/lib/supabase/client";

export async function saveProvaResult(userId: string, trainingId: number, score: number, passed: boolean) {
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({
      user_id: userId,
      training_id: trainingId,
      pontuacao: score,
      passou: passed,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}