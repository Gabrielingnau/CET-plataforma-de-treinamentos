import { supabase } from "@/lib/supabase/client"
import { Lesson } from "@/types/database/lessons"

export async function listLessonsByModule(moduleId: number): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select()
    .eq("modulo_id", moduleId)

  if (error) throw error

  return data
}
