import { supabase } from "@/lib/supabase/client"
import { FullTrainingStructure } from "@/types/database/trainings"

export interface StructureData {
  training: FullTrainingStructure
  completedLessons: number[]
  passedQuizzes: number[]
  examAttempts: any[]
  passedFinalExam: boolean
  attemptCount: number
  maxAttempts: number
  hasFailedDefinitively: boolean
  status?: string 
}

/**
 * BUSCA de dados: Mantemos pura, apenas para leitura.
 */
export async function getStructureData(
  userId: string,
  trainingId: number
): Promise<StructureData> {
 const { data: training, error: tError } = await supabase
  .from("trainings")
  .select(`
    *,
    certificate_templates (*), 
    modulos:modules(
      *,
      aulas:lessons(*)
    )
  `)
  .eq("id", trainingId)
  .order('ordem', { foreignTable: 'modules', ascending: true })
  .order('ordem', { foreignTable: 'modules.lessons', ascending: true })
  .single()

  if (tError) throw tError

  console.log(training)

  const trainingData = (training as unknown) as FullTrainingStructure

  const allLessonIds = trainingData.modulos?.flatMap((m) => m.aulas?.map((a) => a.id) || []) || []
  const moduleIds = trainingData.modulos?.map((m) => m.id) || []

  let uniqueLessons: number[] = []
  if (allLessonIds.length > 0) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("completed", true)
      .in("lesson_id", allLessonIds)
    
    uniqueLessons = Array.from(new Set(progress?.map((p) => p.lesson_id) || []))
  }

  let uniqueQuizzes: number[] = []
  if (moduleIds.length > 0) {
    const { data: quizzes } = await supabase
      .from("quiz_attempts")
      .select("module_id")
      .eq("user_id", userId)
      .eq("passou", true)
      .in("module_id", moduleIds)

    uniqueQuizzes = Array.from(new Set(quizzes?.map((q) => q.module_id) || []))
  }

  const { data: exams } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("training_id", trainingId)
    .order('created_at', { ascending: false })

  const examAttempts = exams || []
  const passedFinalExam = examAttempts.some((attempt) => attempt.passou === true)
  const attemptCount = examAttempts.length
  const maxAttempts = trainingData.max_exam_tentativas || 3 
  const hasFailedDefinitively = attemptCount >= maxAttempts && !passedFinalExam

  return {
    training: trainingData,
    completedLessons: uniqueLessons,
    passedQuizzes: uniqueQuizzes,
    examAttempts,
    passedFinalExam,
    attemptCount,
    maxAttempts,
    hasFailedDefinitively,
    // @ts-ignore
    status: training.status 
  }
}

/**
 * AÇÃO de atualização: Nova função específica para o "Side Effect"
 */
export async function updateTrainingStatusToReady(userId: string, trainingId: number) {
  const { error } = await supabase
    .from("user_trainings")
    .update({
      status: "pronto_para_prova",
      updated_at: new Date().toISOString(),
    })
    .match({ user_id: userId, training_id: trainingId })

  if (error) throw error
  return true
}