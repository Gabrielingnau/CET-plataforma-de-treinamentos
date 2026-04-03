import { supabase } from "@/lib/supabase/client";
import { QuizAttempt } from "@/types/database/progress"; // Type sugerido

export async function submitQuizAttempt(payload: Omit<QuizAttempt, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert([payload]);

  if (error) throw error;
  return data;
}