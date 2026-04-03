import { supabase } from "@/lib/supabase/client"

export async function getCompaniesList() {
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      company_user (
        funcao,
        users (
          id,
          nome,
          email,
          cpf,
          telefone
        )
      ),
      company_trainings (
        training_id,
        trainings (
          id,
          titulo
        )
      ),
      users (id) 
    `)
    .order("created_at", { ascending: false })
   console.log("Dados brutos recebidos do Supabase:", data, "Erro:", error);
  if (error) throw error;

  return (data || []).map((c: any) => {
    // 1. Filtramos TODOS os usuários que possuem função ADMIN ou EMPRESA
    const todosOsGestores = c.company_user
      ?.filter((rel: any) => 
        rel.funcao?.toUpperCase() === "EMPRESA" || 
        rel.funcao?.toUpperCase() === "ADMIN"
      )
      .map((rel: any) => rel.users) || [];

    // 2. Definimos o gestor principal (o primeiro da lista, se existir)
    const gestorPrincipal = todosOsGestores[0];

    return {
      id: c.id,
      nome: c.nome,
      cnpj: c.cnpj,
      email: c.email,
      telefone: c.telefone,
      acesso_total: c.acesso_total,
      created_at: c.created_at,
      
      // Dados do Gestor Responsável (Principal)
      responsavel_id: gestorPrincipal?.id || "",
      admin_nome: gestorPrincipal?.nome || "SEM GESTOR",
      admin_email: gestorPrincipal?.email || "",
      admin_cpf: gestorPrincipal?.cpf || "",
      
      // AQUI ESTÁ O PULO DO GATO:
      // Passamos a lista completa ou a contagem para a UI
      gestores: todosOsGestores, 
      adminCount: todosOsGestores.length,

      treinamentos: c.company_trainings?.map((ct: any) => ({
        id: ct.training_id,
        nome: ct.trainings?.titulo
      })) || [],
      
      count_colaboradores: c.users?.length || 0,
      count_treinamentos: c.company_trainings?.length || 0
    }
  });
}