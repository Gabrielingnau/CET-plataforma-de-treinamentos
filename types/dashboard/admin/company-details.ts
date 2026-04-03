export interface EmployeeStatus {
  user_id: string;
  nome: string;
  email: string;
  // Status consolidado para a tabela
  status: 'pendente' | 'em_curso' | 'concluido' | 'risco' | 'bloqueado';
  progresso_medio: number;
  total_certificados: number;
  treinamentos_ativos: number;
}

export interface CompanyDetails {
  id: number;
  nome: string;
  cnpj: string;
  total_colaboradores: number;
  media_engajamento: number; // Média de progresso de todos os user_trainings da empresa
}

export interface CompanyDashboardData {
  company: CompanyDetails;
  employees: EmployeeStatus[];
}