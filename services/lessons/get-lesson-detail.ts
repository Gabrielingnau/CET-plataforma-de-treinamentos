import { supabase } from "@/lib/supabase/client";

export async function getLessonDetail(lessonId: number) {
  const { data, error } = await supabase
    .from("lessons")
    .select(`
      *,
      modulo:modules (
        id,
        titulo,
        training_id
      )
    `)
    .eq("id", lessonId)
    .single();

  if (error) throw error;
  return data;
}