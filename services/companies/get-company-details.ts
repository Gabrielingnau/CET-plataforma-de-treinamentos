import { supabase } from "@/lib/supabase/client"

export async function getCompanyDetails(empresaId: string) {
  // 1. Busca os dados originais (Exatamente como você já fazia)
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      company_user!company_user_empresa_id_fkey (
        funcao,
        user:users!company_user_user_id_fkey (
          id,
          nome
        )
      ),
      colaboradores:users!users_empresa_id_fkey (
        id,
        nome,
        cpf,
        email,
        role,
        telefone,
        created_at,
        user_trainings (
          training_id,
          trainings (
            id,
            titulo
          )
        )
      ),
      catalogo:company_trainings!company_trainings_empresa_id_fkey (
        training:trainings (
          id,
          titulo,
          cover_url,
          carga_horaria
        )
      )
    `)
    .eq("id", Number(empresaId))
    .order('created_at', { foreignTable: 'users', ascending: false }) 
    .single()

  if (error) {
    console.error("Erro ao buscar detalhes:", error.message)
    return null
  }

  // --- LÓGICA DE ACESSO TOTAL (O PULO DO GATO) ---
  let finalCatalogo = data.catalogo?.map((c: any) => c.training) || []

  if (data.acesso_total) {
    // Se a empresa tem acesso total, buscamos todos os treinamentos ativos
    const { data: allTrainings } = await supabase
      .from("trainings")
      .select("id, titulo, cover_url, carga_horaria")
    
    if (allTrainings) {
      finalCatalogo = allTrainings
    }
  }
  // -----------------------------------------------

  const formattedData = {
    ...data,
    gestor: data.company_user?.find((cu: any) => cu.funcao === 'gestor')?.user || null,
    // Agora o catalogo retorna ou o que está vinculado, ou TUDO se for acesso_total
    catalogo: finalCatalogo 
  }

  return formattedData
}