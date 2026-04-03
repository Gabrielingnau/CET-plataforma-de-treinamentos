"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function createCollaboratorAction(data: {
  nome: string
  cpf: string
  empresaId: number
}) {
  // Limpa o CPF para garantir que o e-mail não tenha pontos ou traços
  const cleanCpf = data.cpf.replace(/\D/g, "")
  
  // NOVA LÓGICA: cpf@gmail.com
  const generatedEmail = `${cleanCpf}@gmail.com`

  // 1. Cria o usuário no Auth (via Admin SDK para não deslogar quem está criando)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: generatedEmail,
    password: cleanCpf, // O CPF limpo será a senha inicial
    email_confirm: true,
    user_metadata: {
      nome: data.nome,
      role: "colaborador",
      empresa_id: data.empresaId,
      cpf: cleanCpf,
    },
  })

  if (authError) throw new Error(authError.message)

  // 2. Insere ou atualiza na tabela pública 'users'
  const { error: dbError } = await supabaseAdmin
    .from("users")
    .upsert({
      id: authUser.user.id,
      nome: data.nome,
      email: generatedEmail,
      cpf: cleanCpf,
      role: "colaborador",
      empresa_id: data.empresaId
    })

  if (dbError) {
    // Rollback: se falhar no banco, deleta do Auth
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
    throw new Error(dbError.message)
  }

  return { success: true }
}