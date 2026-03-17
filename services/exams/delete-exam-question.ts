import { supabase } from "@/lib/supabase/client";

export async function deleteExamQuestion(id: number) {
  const { data, error } = await supabase
    .from("exam_questions")
    .delete()
    .eq('id', id);

  if (error) throw error;

  return data;
}