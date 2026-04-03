import { supabase } from "@/lib/supabase/client";

export async function getStudentTrainingData(userId: string, trainingId: number) {
  // 1. Busca a estrutura do treinamento (Treinamento -> Módulos -> Aulas)
  const trainingPromise = supabase
    .from("trainings")
    .select(`
      *,
      modulos:modules(
        *,
        aulas:lessons(*)
      )
    `)
    .eq("id", trainingId)
    .single();

  // 2. Busca o progresso das aulas do aluno
  const progressPromise = supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", userId);

  // 3. Busca as tentativas de Quiz que o aluno PASSOU (para liberar o próximo módulo)
  const quizPromise = supabase
    .from("quiz_attempts")
    .select("module_id")
    .eq("user_id", userId)
    .eq("passou", true);

  // 4. Busca as tentativas da Prova Final (Exam)
  const examPromise = supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("training_id", trainingId)
    .order('created_at', { ascending: false }); // Pega a mais recente primeiro

  // Executa todas as promessas em paralelo para performance
  const [trainingRes, progressRes, quizRes, examRes] = await Promise.all([
    trainingPromise,
    progressPromise,
    quizPromise,
    examPromise
  ]);

  // Tratamento de erros
  if (trainingRes.error) throw trainingRes.error;
  if (progressRes.error) throw progressRes.error;
  if (quizRes.error) throw quizRes.error;
  if (examRes.error) throw examRes.error;

  return {
    training: trainingRes.data,
    completedLessons: new Set(progressRes.data?.map(l => l.lesson_id) || []),
    passedQuizzes: new Set(quizRes.data?.map(q => q.module_id) || []),
    examAttempts: examRes.data || []
  };
}