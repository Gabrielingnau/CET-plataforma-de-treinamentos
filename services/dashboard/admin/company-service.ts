import { supabase } from "@/lib/supabase/client";
import { CompanyDashboardData, EmployeeStatus } from "@/types/dashboard/admin/company-details";

export const companyDetailsService = {
  async getCompanyOverview(companyId: string): Promise<CompanyDashboardData> {
    // 1. Busca dados da empresa e funcionários em paralelo
    const [companyRes, employeesRes, trainingsRes, attemptsRes, certsRes] = await Promise.all([
      supabase.from("companies").select("*").eq("id", companyId).single(),
      supabase.from("users").select("id, nome, email").eq("empresa_id", companyId).in('role', ['colaborador', 'empresa']),
      supabase.from("user_trainings").select("user_id, progresso, training_id").eq("empresa_id", companyId),
      supabase.from("exam_attempts").select("user_id, training_id, passou"),
      supabase.from("certificates").select("user_id")
    ]);

    if (companyRes.error) throw new Error("Empresa não encontrada");

    const companyData = companyRes.data;
    const employees = employeesRes.data || [];
    const allTrainings = trainingsRes.data || [];
    const allAttempts = attemptsRes.data || [];
    const allCerts = certsRes.data || [];

    // 2. Processamento da lista de funcionários
    const processedEmployees: EmployeeStatus[] = employees.map(emp => {
      const userTrainings = allTrainings.filter(t => t.user_id === emp.id);
      const userAttempts = allAttempts.filter(a => a.user_id === emp.id);
      const userCerts = allCerts.filter(c => c.user_id === emp.id).length;

      // Cálculo de progresso médio do aluno
      const avgProgresso = userTrainings.length > 0 
        ? userTrainings.reduce((acc, curr) => acc + Number(curr.progresso), 0) / userTrainings.length 
        : 0;

      // Lógica de Status Complexa (Protocolo Camada 2)
      let status: EmployeeStatus['status'] = 'pendente';

      // Verifica se há risco ou bloqueio (tentativas falhas sem aprovação posterior)
      const hasRisco = userTrainings.some(ut => {
        const attemptsForThisTask = userAttempts.filter(a => a.training_id === ut.training_id);
        const falhas = attemptsForThisTask.filter(a => !a.passou).length;
        const passou = attemptsForThisTask.some(a => a.passou);
        
        // Se falhou e não passou ainda, verificamos a contagem (aqui o max_tentativas é genérico, 
        // mas na Camada 3 seremos mais precisos por curso)
        return falhas > 0 && !passou;
      });

      if (hasRisco) status = 'risco';
      else if (avgProgresso === 100) status = 'concluido';
      else if (avgProgresso > 0) status = 'em_curso';

      return {
        user_id: emp.id,
        nome: emp.nome || "Sem Nome",
        email: emp.email || "",
        status,
        progresso_medio: Math.round(avgProgresso),
        total_certificados: userCerts,
        treinamentos_ativos: userTrainings.length
      };
    });

    // 3. Média de engajamento da empresa
    const mediaEngajamento = processedEmployees.length > 0
      ? processedEmployees.reduce((acc, curr) => acc + curr.progresso_medio, 0) / processedEmployees.length
      : 0;

    return {
      company: {
        id: companyData.id,
        nome: companyData.nome,
        cnpj: companyData.cnpj,
        total_colaboradores: employees.length,
        media_engajamento: Math.round(mediaEngajamento)
      },
      employees: processedEmployees
    };
  }
};