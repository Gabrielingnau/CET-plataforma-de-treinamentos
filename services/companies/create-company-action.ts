// services/companies/create-company-action.ts
'use server'

import { supabaseAdmin } from "@/lib/supabase/admin"
import { CompanyFormData } from "@/types/forms/company-form"

export async function createCompanyAndTrainings(data: CompanyFormData) {
  try {
    // 1. Criar a Empresa
    const { data: company, error: compError } = await supabaseAdmin
      .from("companies")
      .insert({
        nome: data.nome,
        cnpj: data.cnpj.replace(/\D/g, ""), // Limpeza de máscara
        email: data.email,
        telefone: data.telefone?.replace(/\D/g, ""),
        acesso_total: data.acesso_total,
      })
      .select()
      .single()

    if (compError) throw new Error("Erro ao criar empresa: " + compError.message)

    // 2. Vincular Treinamentos (se houver)
    if (data.trainings_ids && data.trainings_ids.length > 0) {
      const trainingsToInsert = data.trainings_ids.map((id) => ({
        empresa_id: company.id,
        training_id: id,
      }))

      const { error: trainError } = await supabaseAdmin
        .from("company_trainings")
        .insert(trainingsToInsert)

      if (trainError) {
        // Rollback da empresa em caso de erro nos treinamentos
        await supabaseAdmin.from("companies").delete().eq("id", company.id)
        throw new Error("Erro ao vincular treinamentos: " + trainError.message)
      }
    }

    return { 
      success: true, 
      companyId: company.id, 
      companyNome: company.nome 
    }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}