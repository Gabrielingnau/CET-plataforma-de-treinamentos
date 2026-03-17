// services/modules/create-module.ts
import { supabase } from "@/lib/supabase/client" // Usar sempre o client para Mutations em forms
import { CreateModulePayload } from "@/types/database/modules"

export async function createModule(module: CreateModulePayload) {
  const { data, error } = await supabase
    .from("modules")
    .insert(module)
    .select()
    .single()

  if (error) throw error
  return data
}
