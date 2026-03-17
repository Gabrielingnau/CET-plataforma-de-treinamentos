// services/lessons/create-lesson.ts
import { supabase } from "@/lib/supabase/client"
import { CreateLessonPayload } from "@/types/database/lessons"

export async function createLesson(lesson: CreateLessonPayload) {
  const { data, error } = await supabase
    .from("lessons")
    .insert(lesson)
    .select()
    .single()

  if (error) throw error
  return data
}
