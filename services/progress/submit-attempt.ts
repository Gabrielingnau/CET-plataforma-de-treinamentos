import { supabase } from "@/lib/supabase/client"

interface SubmitAttemptProps {
  user_id: string // Mudamos para bater com o seu console.log
  module_id?: number // Mudamos para bater com o seu console.log
  training_id?: number // Para o caso de ser prova
  type: "quiz" | "exam"
  pontuacao: number
  passou: boolean
  respostas: any
}

// ... (interface permanece igual)

export async function submitAttempt(payload: SubmitAttemptProps) {
  const tableName = payload.type === "quiz" ? "quiz_attempts" : "exam_attempts"

  const insertData: any = {
    user_id: payload.user_id,
    pontuacao: payload.pontuacao,
    passou: payload.passou,
    respostas: payload.respostas,
  }

  if (payload.type === "quiz") {
    insertData.module_id = payload.module_id
  } else {
    insertData.training_id = payload.training_id
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error(`Erro ao salvar tentativa no Supabase:`, error.message)
    throw error
  }

  // --- O SEGREDO PARA O DASHBOARD DO ADMIN ---
  // Se o aluno passou no Quiz ou na Prova, avisamos a tabela global de progresso
  if (payload.passou) {
    // Se for quiz, precisamos do training_id (que geralmente vem no payload ou via query)
    // Para simplificar, você pode passar o training_id também no payload do quiz
    if (payload.training_id) {
      await supabase
        .from("user_trainings")
        .update({
          updated_at: new Date().toISOString(),
          // O progresso total pode ser calculado via Trigger no banco (mais seguro)
          // ou você pode dar um pequeno incremento aqui
        })
        .match({ user_id: payload.user_id, training_id: payload.training_id })
    }
  }

  return data
}
