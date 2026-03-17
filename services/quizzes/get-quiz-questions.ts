import { supabase } from "@/lib/supabase/client";

export async function getQuizQuestions(moduleId: number) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq('module_id', moduleId)
    .order('id');

  if (error) throw error;

  return data;
}