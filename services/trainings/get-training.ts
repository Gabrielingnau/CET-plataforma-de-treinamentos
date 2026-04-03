import { supabase } from "@/lib/supabase/client"
import { Training, TrainingWithDetails } from "@/types/database/trainings"

/**
 * Busca a lista de treinamentos otimizada para a Grid (View Principal).
 * Retorna os dados com os aliases necessários para o TrainingCard.
 */
export async function getTrainingsList(): Promise<TrainingWithDetails[]> {
  const { data, error } = await supabase
    .from("trainings")
    .select(
      `
      *,
      criador:users!trainings_criado_por_fkey (nome),
      certificate_template:certificate_templates!trainings_template_id_fkey (id, titulo, capa_url),
      modules (
        id,
        lessons (id)
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar lista de treinamentos:", error.message)
    throw error
  }

  // O Supabase às vezes tem dificuldade em inferir JOINS complexos,
  // por isso forçamos o tipo que definimos manualmente.
  return data as unknown as TrainingWithDetails[]
}

/**
 * Busca um treinamento específico pelo ID com todos os detalhes aninhados.
 * Útil para páginas de edição ou detalhes profundos.
 */
export async function getTrainingById(id: number): Promise<Training> {
  const { data, error } = await supabase
    .from("trainings")
    .select(
      `
      *,
      modules (
        *,
        lessons (*)
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Erro ao buscar treinamento ID ${id}:`, error.message)
    throw error
  }

  return data as Training
}
