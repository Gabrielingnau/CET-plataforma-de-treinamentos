import { supabase } from "@/lib/supabase/client";
import { CreateExamQuestionPayload } from "@/types/database/questions";

export async function createExamQuestion(payload: CreateExamQuestionPayload) {
  const { data, error } = await supabase
    .from("exam_questions")
    .insert([payload]);

  if (error) throw error;

  return data;
}