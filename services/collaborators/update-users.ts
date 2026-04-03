import { supabase } from "@/lib/supabase/client";

interface UpdateUserPayload {
  nome: string;
  cpf?: string | null;
  email?: string | null;
  telefone?: string | null;
  empresa_id?: number; // Caso precise registrar a troca de empresa
}

/**
 * Atualiza os dados de perfil de um usuário (Gestor ou Colaborador) na tabela public.users
 */
export async function updateUserProfile(userId: string, data: UpdateUserPayload) {
  // Filtramos apenas os campos que realmente pertencem à tabela users
  const { nome, cpf, email, telefone } = data;

  const { error } = await supabase
    .from("users")
    .update({
      nome,
      cpf,
      email,
      telefone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Erro ao atualizar perfil do usuário:", error.message);
    throw error;
  }

  return true;
}