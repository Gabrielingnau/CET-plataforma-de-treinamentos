import { supabase } from "@/lib/supabase/client";
import { EditCompanyFormData } from "@/types/forms/edit-company-form";

/**
 * Atualiza os dados completos de uma parceria:
 * 1. Dados institucionais da empresa
 * 2. Lista de gestores (via upsert)
 * 3. Vínculo de treinamentos (limpa e reinsere)
 */
export async function updateFullCompany(data: EditCompanyFormData) {
  // 1. Atualiza os dados da Empresa (Tabela companies)
  const { error: companyError } = await supabase
    .from("companies")
    .update({
      nome: data.nome,
      cnpj: data.cnpj,
      email: data.email,
      telefone: data.telefone,
      acesso_total: data.acesso_total,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (companyError) {
    console.error("Erro ao atualizar empresa:", companyError);
    throw new Error("Falha ao atualizar dados da empresa.");
  }

  // 2. Sincroniza os Gestores (Tabela users)
  // O Upsert usa o 'id' para atualizar o existente ou inserir se for novo
  if (data.gestores && data.gestores.length > 0) {
    const gestoresPayload = data.gestores.map(g => ({
      id: g.id, // Se g.id for undefined, o Supabase gera um novo (cuidado com RLS aqui)
      nome: g.nome,
      email: g.email,
      cpf: g.cpf,
      telefone: g.telefone,
      role: 'empresa', // Define a role padrão para gestores de clientes
      empresa_id: data.id,
      updated_at: new Date().toISOString(),
    }));

    const { error: userError } = await supabase
      .from("users")
      .upsert(gestoresPayload, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (userError) {
      console.error("Erro no upsert de gestores:", userError);
      throw new Error("Erro ao sincronizar gestores. Verifique as permissões de acesso.");
    }
  }

  // 3. Sincroniza Treinamentos (Catálogo da Empresa)
  // Primeiro removemos todos os vínculos atuais para evitar duplicidade ou lixo
  const { error: deleteError } = await supabase
    .from("company_trainings")
    .delete()
    .eq("empresa_id", data.id);

  if (deleteError) throw deleteError;

  // Se não for acesso total, inserimos apenas os IDs selecionados no modal
  if (!data.acesso_total && data.trainings_ids && data.trainings_ids.length > 0) {
    const toInsert = data.trainings_ids.map(tId => ({
      empresa_id: data.id,
      training_id: tId
    }));

    const { error: insertError } = await supabase
      .from("company_trainings")
      .insert(toInsert);

    if (insertError) {
      console.error("Erro ao vincular treinamentos:", insertError);
      throw new Error("Empresa atualizada, mas houve um erro ao sincronizar o catálogo.");
    }
  }

  return { success: true };
}