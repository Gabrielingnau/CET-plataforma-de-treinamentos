import { supabase } from "@/lib/supabase/client"
import { Lesson } from "@/types/database/lessons"

export async function updateLesson(
  id: number,
  lesson: Partial<Lesson>
) {
  const { data, error } = await supabase
    .from("lessons")
    .update(lesson)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
