import { supabase } from "@/lib/supabase/client"

/**
 * Deleta uma empresa e todos os seus vínculos (usuários, certificados, progresso, etc)
 * apenas utilizando o ID da empresa.
 */
export async function deleteFullCompanyStructure(companyId: string) {
  try {
    // 1. BUSCAR TODOS OS USUÁRIOS VINCULADOS À EMPRESA
    // Buscamos tanto na tabela 'users' quanto na 'company_user' para garantir
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("empresa_id", companyId);

    if (fetchError) throw new Error(`Erro ao buscar usuários: ${fetchError.message}`);

    const userIds = users?.map(u => u.id) || [];

    if (userIds.length > 0) {
      // 2. DELETAR DEPENDÊNCIAS DOS USUÁRIOS
      // Deletar certificados
      const { error: certError } = await supabase
        .from("certificates")
        .delete()
        .in("user_id", userIds);
      if (certError) throw certError;

      // Deletar progresso de lições (para evitar erros de FK)
      const { error: progressError } = await supabase
        .from("lesson_progress")
        .delete()
        .in("user_id", userIds);
      if (progressError) throw progressError;

      // Deletar tentativas de exames e quizzes
      await supabase.from("exam_attempts").delete().in("user_id", userIds);
      await supabase.from("quiz_attempts").delete().in("user_id", userIds);

      // Deletar registros de treinamentos atribuídos
      await supabase.from("user_trainings").delete().in("user_id", userIds);

      // 3. DELETAR OS USUÁRIOS DA TABELA PUBLIC.USERS
      // Primeiro removemos da tabela de junção company_user (se não houver cascade)
      await supabase.from("company_user").delete().in("user_id", userIds);

      const { error: deleteUsersError } = await supabase
        .from("users")
        .delete()
        .in("id", userIds);

      if (deleteUsersError) throw deleteUsersError;
    }

    // 4. DELETAR VÍNCULOS DE TREINAMENTOS DA EMPRESA
    await supabase.from("company_trainings").delete().eq("empresa_id", companyId);

    // 5. DELETAR A EMPRESA
    const { error: companyError } = await supabase
      .from("companies")
      .delete()
      .eq("id", companyId);

    if (companyError) throw companyError;

    return { success: true };
  } catch (error: any) {
    console.error("Falha na exclusão total:", error);
    throw new Error(`Erro ao excluir estrutura da empresa: ${error.message}`);
  }
}