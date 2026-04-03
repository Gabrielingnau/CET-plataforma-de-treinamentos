import { supabase } from "@/lib/supabase/client";

export async function toggleLessonProgress({
  userId,
  lessonId,
  trainingId,
  completed
}: {
  userId: string;
  lessonId: number;
  trainingId: number;
  completed: boolean;
}) {
  // 1. Atualiza o progresso da aula individual
  const { error: upsertError } = await supabase
    .from("lesson_progress")
    .upsert(
      { user_id: userId, lesson_id: lessonId, completed: completed },
      { onConflict: 'user_id,lesson_id' }
    );

  if (upsertError) throw upsertError;

  /**
   * OTIMIZAÇÃO: 
   * Usamos { count: 'exact', head: true } para que o Supabase retorne APENAS o número.
   * Não baixamos nenhuma linha/row, apenas o cabeçalho com o total.
   */

  // 2. Conta o total de aulas do treinamento (via join com módulos)
  const { count: totalAulas } = await supabase
    .from("lessons")
    .select("id, modules!inner(training_id)", { count: 'exact', head: true })
    .eq("modules.training_id", trainingId);

  // 3. Conta quantas aulas o usuário concluiu NESTE treinamento
  // Filtramos o progresso pelas aulas que pertencem ao trainingId via join
  const { count: aulasConcluidas } = await supabase
    .from("lesson_progress")
    .select("lesson_id, lessons!inner(modules!inner(training_id))", { 
      count: 'exact', 
      head: true 
    })
    .eq("user_id", userId)
    .eq("completed", true)
    .eq("lessons.modules.training_id", trainingId);

  // 4. Calcula o percentual
  const total = totalAulas || 0;
  const concluidas = aulasConcluidas || 0;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  // 5. Atualiza a tabela user_trainings
  // Usamos Match para garantir que estamos atualizando a linha correta
  const { error: updateError } = await supabase
    .from("user_trainings")
    .update({
      progresso: percentual,
      status: percentual === 100 ? 'concluido' : 'em_andamento',
      updated_at: new Date().toISOString()
    })
    .match({ user_id: userId, training_id: trainingId });

  if (updateError) {
    console.error("Erro ao atualizar user_trainings:", updateError);
  }

  return { percentual };
}