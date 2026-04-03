import { supabase } from "@/lib/supabase/client"

export async function getCompanyCatalogue(empresaId: number | null) {
  if (!empresaId) return null

  // 1. Busca info básica da empresa
  const { data: empresa, error: empError } = await supabase
    .from("companies")
    .select("id, nome, acesso_total")
    .eq("id", empresaId)
    .single()

  if (empError) throw empError

  let rawTrainings = []

  // 2. Busca os treinamentos (Acesso Total ou Vinculado)
  if (empresa.acesso_total) {
    const { data } = await supabase
      .from("trainings")
      .select("id, titulo, descricao, cover_url, carga_horaria")
    rawTrainings = data || []
  } else {
    const { data } = await supabase
      .from("company_trainings")
      .select(`training:trainings (id, titulo, descricao, cover_url, carga_horaria)`)
      .eq("empresa_id", empresaId)
    
    rawTrainings = data?.map((item: any) => item.training) || []
  }

  // 3. Pega contagem de módulos e aulas para cada treinamento de forma eficiente
  const trainingsWithCounts = await Promise.all(
    rawTrainings.map(async (training: any) => {
      // Contagem de Módulos (Usando head: true para performance)
      const { count: modulesCount } = await supabase
        .from("modules")
        .select("*", { count: "exact", head: true })
        .eq("training_id", training.id)

      // Contagem de Aulas (Via join com modules para pegar todas as aulas do treinamento)
      const { count: lessonsCount } = await supabase
        .from("lessons")
        .select("*, modules!inner(training_id)", { count: "exact", head: true })
        .eq("modules.training_id", training.id)

      return {
        ...training,
        modulesCount: modulesCount || 0,
        lessonsCount: lessonsCount || 0
      }
    })
  )

  return { empresa, trainings: trainingsWithCounts }
}

export async function getTrainingUsers(trainingId: number, empresaId: number | null) {
  if (!empresaId) return []
  
  const { data, error } = await supabase
    .from("user_trainings")
    .select(`
      status,
      progresso,
      user:users ( id, nome, role, email )
    `)
    .eq("training_id", trainingId)
    .eq("empresa_id", empresaId)

  if (error) throw error
  return data
}