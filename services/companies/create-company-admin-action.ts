// services/companies/create-company-admin-action.ts
'use server'

import { supabaseAdmin } from "@/lib/supabase/admin"
import { CompanyAdminFormData } from "@/types/forms/company-admin-form"

export async function createCompanyAdmin(data: CompanyAdminFormData) {
  let createdAuthUserId: string | null = null

  try {
    // Tratamento de campos opcionais e limpeza de máscaras
    const cleanCPF = data.cpf ? data.cpf.replace(/\D/g, "") : null
    const cleanTelefone = data.telefone ? data.telefone.replace(/\D/g, "") : null

    // 1. Criar Usuário no Auth (Admin API)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: cleanCPF || "Mudar@123", // Senha padrão se não houver CPF
      email_confirm: true,
      user_metadata: {
        nome: data.nome,
        role: "empresa",
        empresa_id: data.empresa_id,
        cpf: cleanCPF,
        telefone: cleanTelefone
      }
    })

    if (authError) throw new Error("Erro no Auth: " + authError.message)
    createdAuthUserId = authData.user.id

    // 2. Persistir na tabela pública 'users'
    const { error: userTableError } = await supabaseAdmin.from("users").upsert({
      id: createdAuthUserId,
      nome: data.nome,
      email: data.email,
      cpf: cleanCPF,
      telefone: cleanTelefone,
      role: "empresa",
      empresa_id: data.empresa_id,
      primeiro_login: true,
    })

    if (userTableError) throw new Error("Erro na tabela users: " + userTableError.message)

    // 3. Criar Vínculo na 'company_user'
    const { error: linkError } = await supabaseAdmin.from("company_user").insert({
      empresa_id: data.empresa_id,
      user_id: createdAuthUserId,
      funcao: "ADMIN",
    })

    if (linkError) throw new Error("Erro ao vincular gestor: " + linkError.message)

    return { success: true, userId: createdAuthUserId }

  } catch (error: any) {
    // Rollback: deleta do Auth se falhar no banco
    if (createdAuthUserId) {
      await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId)
    }
    return { success: false, error: error.message }
  }
}