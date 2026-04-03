// services/trainings/reset-training-progress.ts
import { supabase } from "@/lib/supabase/client"

export async function resetTrainingProgress(
  userId: string, 
  trainingId: number, 
  allLessonIds: number[], 
  moduleIds: number[]
) {
  // 1. Limpa as tentativas da PROVA (Crucial para destravar a tela)
  const { error: examError } = await supabase
    .from("exam_attempts")
    .delete()
    .match({ user_id: userId, training_id: trainingId })

  if (examError) throw new Error("Erro ao resetar tentativas de prova")

  // 2. Limpa tentativas de QUIZ
  if (moduleIds.length > 0) {
    const { error: quizError } = await supabase
      .from("quiz_attempts")
      .delete()
      .eq("user_id", userId)
      .in("module_id", moduleIds)
    
    if (quizError) throw new Error("Erro ao resetar quizzes")
  }

  // 3. Limpa progresso das AULAS
  if (allLessonIds.length > 0) {
    const { error: lessonError } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", userId)
      .in("lesson_id", allLessonIds)

    if (lessonError) throw new Error("Erro ao resetar progresso de aulas")
  }

  return { success: true }
}