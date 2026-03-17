import { supabase } from "@/lib/supabase/client";
import { CreateExamQuestionPayload } from "@/types/database/questions";

export async function updateExamQuestion(id: number, payload: Partial<CreateExamQuestionPayload>) {
  const { data, error } = await supabase
    .from("exam_questions")
    .update(payload)
    .eq('id', id);

  if (error) throw error;

  return data;
}