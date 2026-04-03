'use server'

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function getAllCompaniesWithStatus(search?: string) {
  let query = supabaseAdmin
    .from('companies')
    .select(`
      id, 
      nome, 
      cnpj,
      company_user!company_user_empresa_id_fkey (id, funcao)
    `)
    .eq('company_user.funcao', 'ADMIN') // Garante que só conte quem é ADMIN
    .order('nome', { ascending: true });

  // ... lógica de search mantida ...

  const { data, error } = await query;

  if (error) return [];

  return data.map(company => {
    // Contamos quantos registros de ADMIN existem para esta empresa
    const adminCount = company.company_user?.length || 0;
    
    return {
      id: company.id,
      nome: company.nome,
      cnpj: company.cnpj,
      adminCount: adminCount, // Novo campo com a quantidade real
      hasAdmin: adminCount > 0
    };
  });
}