import { supabase } from "@/lib/supabase/client"

export async function deleteLesson(id: number) {
  const { error } = await supabase.from("lessons").delete().eq("id", id)

  if (error) throw error
}
