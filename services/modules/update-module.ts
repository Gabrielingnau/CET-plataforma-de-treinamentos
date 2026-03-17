import { supabase } from "@/lib/supabase/client"
import { Module } from "@/types/database/modules"

export async function updateModule(
  id: number,
  module: Partial<Module>
) {
  const { data, error } = await supabase
    .from("modules")
    .update(module)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
