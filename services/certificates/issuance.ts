import { supabase } from "@/lib/supabase/client"

export async function issueCertificate(params: {
  userId: string;
  trainingId: number;
  templateId: number;
  studentName: string;
  trainingName: string;
  workload: number;
  isAdmin: boolean;
}) {
  // 1. Se for Admin, podemos apenas gerar o visual sem salvar, 
  // mas como você quer liberar para admin criar também, vamos salvar com uma flag ou apenas prosseguir.
  
  const { data, error } = await supabase
    .from("certificates")
    .insert({
      user_id: params.userId,
      training_id: params.trainingId,
      template_id: params.templateId,
      nome_aluno: params.studentName,
      nome_treinamento: params.trainingName,
      carga_horaria: params.workload,
      data_conclusao: new Date().toISOString(),
      // O campo 'codigo' (UUID) é gerado automaticamente pelo banco
    })
    .select()
    .single()

  if (error) throw error
  return data
}