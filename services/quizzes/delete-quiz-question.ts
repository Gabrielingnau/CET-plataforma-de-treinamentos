import { supabase } from "@/lib/supabase/client";

export async function deleteQuizQuestion(id: number) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .delete()
    .eq('id', id);

  if (error) throw error;

  return data;
}