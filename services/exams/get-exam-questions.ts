import { supabase } from "@/lib/supabase/client";

export async function getExamQuestions(trainingId: number) {
  const { data, error } = await supabase
    .from("exam_questions")
    .select("*")
    .eq('training_id', trainingId)
    .order('id');

  if (error) throw error;

  return data;
}