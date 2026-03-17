import { supabase } from "@/lib/supabase/client";
import { CreateQuizQuestionPayload } from "@/types/database/questions";

export async function updateQuizQuestion(id: number, payload: Partial<CreateQuizQuestionPayload>) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .update(payload)
    .eq('id', id);

  if (error) throw error;

  return data;
}