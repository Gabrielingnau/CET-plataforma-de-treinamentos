import { supabase } from "@/lib/supabase/client";
import { CreateQuizQuestionPayload } from "@/types/database/questions";

export async function createQuizQuestion(payload: CreateQuizQuestionPayload) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .insert([payload]);

  if (error) throw error;

  return data;
}