import { supabase } from "@/lib/supabase/client"

interface CreateAttemptProps {
  userId: string
  trainingId: number
  score: number
  passed: boolean
  responses: Record<number, string>
}

export async function submitExamAttempt({
  userId,
  trainingId,
  score,
  passed,
  responses
}: CreateAttemptProps) {
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({
      user_id: userId,
      training_id: trainingId,
      pontuacao: score,
      passou: passed,
      respostas: responses,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao salvar tentativa de prova:", error.message)
    throw new Error("Não foi possível registrar o resultado da prova.")
  }

  return data
}