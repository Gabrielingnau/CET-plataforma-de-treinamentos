// services/modules/create-module.ts
import { supabase } from "@/lib/supabase/client" // Usar sempre o client para Mutations em forms
import { CreateModulePayload } from "@/types/database/modules"
/*
  Função para criar um novo módulo no banco de dados usando Supabase.
  Recebe um objeto do tipo CreateModulePayload e insere na tabela "modules".
  Retorna os dados do módulo criado ou lança um erro em caso de falha.
*/
export async function createModule(module: CreateModulePayload) {
  const { data, error } = await supabase
    .from("modules")
    .insert(module)
    .select()
    .single()

  if (error) throw error
  return data
}
