import { supabase } from "@/lib/supabase/client";
import { AdminDashboardData, CompanySummary } from "@/types/dashboard/admin/admin-dashboard";

export const adminMainService = {
  async getGlobalOverview(): Promise<AdminDashboardData> {
    // 1. Buscas Paralelas para KPIs e Listagem Base
    const [companiesRes, usersRes, certsRes, attemptsRes, userTrainingsRes] = await Promise.all([
      supabase.from("companies").select("id, nome"),
      supabase.from("users").select("id, empresa_id").in('role', ['colaborador', 'empresa']),
      supabase.from("certificates").select("id", { count: "exact" }),
      supabase.from("exam_attempts").select("passou"),
      supabase.from("user_trainings").select("progresso, empresa_id")
    ]);

    const companies = companiesRes.data || [];
    const colaboradores = usersRes.data || [];
    const treinamentos = userTrainingsRes.data || [];
    const tentativas = attemptsRes.data || [];

    // 2. Cálculo da Taxa de Aprovação Global
    const totalTentativas = tentativas.length;
    const totalPassou = tentativas.filter(t => t.passou).length;
    const taxaAprovacao = totalTentativas > 0 
      ? Math.round((totalPassou / totalTentativas) * 100) 
      : 0;

    // 3. Processamento do Ranking de Empresas
    const rankingEmpresas: CompanySummary[] = companies.map(emp => {
      const empresaTrainings = treinamentos.filter(ut => ut.empresa_id === emp.id);
      const empresaAlunos = colaboradores.filter(u => u.empresa_id === emp.id).length;
      
      const somaProgresso = empresaTrainings.reduce((acc, curr) => acc + Number(curr.progresso), 0);
      const media = empresaTrainings.length > 0 
        ? Math.round(somaProgresso / empresaTrainings.length) 
        : 0;

      // Lógica de Saúde: Se a média for baixa (< 40), está crítico.
      let status: CompanySummary['statusSaude'] = 'estavel';
      if (media < 40) status = 'critico';
      else if (media < 70) status = 'atencao';

      return {
        id: Number(emp.id),
        nome: emp.nome,
        totalAlunos: empresaAlunos,
        mediaProgresso: media,
        statusSaude: status
      };
    }).sort((a, b) => b.mediaProgresso - a.mediaProgresso);

    return {
      stats: {
        totalColaboradores: colaboradores.length,
        totalCertificados: certsRes.count || 0,
        taxaAprovacaoGeral: taxaAprovacao,
        empresasAtivas: companies.length
      },
      rankingEmpresas
    };
  }
};