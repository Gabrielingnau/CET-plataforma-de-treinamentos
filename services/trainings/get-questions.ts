import { supabase } from "@/lib/supabase/client";

export async function getQuestions(targetId: number, type: "quiz" | "exam") {
  const tableName = type === "quiz" ? "quiz_questions" : "exam_questions";
  const idColumn = type === "quiz" ? "module_id" : "training_id";

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(idColumn, targetId);

  if (error) throw error;
  return data;
}