import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabaseAdmin = await createClient();
  try {
    const data = await request.json();

    // 1. Criar Empresa
    const { data: company, error: compError } = await supabaseAdmin
      .from("companies")
      .insert({
        nome: data.nome,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.telefone,
        acesso_total: data.acesso_total
      })
      .select()
      .single();

    if (compError) throw compError;

    // 2. Criar Usuário no Auth (Já confirmado e sem mexer na sua sessão)
    const cleanCPF = data.admin_cpf.replace(/\D/g, "");
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.admin_email,
      password: cleanCPF,
      email_confirm: true, // CRÍTICO: Já cria o usuário como confirmado
      user_metadata: { nome: data.admin_nome, role: 'empresa' }
    });

    if (authError) throw authError;
    const userId = authData.user.id;

    // 3. Salvar no public.users (Aqui o RLS é ignorado pela service_role)
    const { error: userTableError } = await supabaseAdmin.from("users").insert({
      id: userId,
      nome: data.admin_nome,
      email: data.admin_email,
      cpf: data.admin_cpf,
      role: 'empresa',
      empresa_id: company.id,
      primeiro_login: true
    });

    if (userTableError) throw userTableError;

    // 4. Vincular na company_user
    await supabaseAdmin.from("company_user").insert({
      empresa_id: company.id,
      user_id: userId,
      funcao: 'empresa'
    });

    // 5. Vincular Treinamentos
    if (data.trainings_ids?.length > 0) {
      const trainingsToInsert = data.trainings_ids.map((id: number) => ({
        empresa_id: company.id,
        training_id: id,
      }));
      await supabaseAdmin.from("company_trainings").insert(trainingsToInsert);
    }

    return NextResponse.json(company);

  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}