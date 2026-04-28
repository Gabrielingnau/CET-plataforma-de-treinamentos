/**
 * Interface para os 4 cards de KPI no topo do dashboard
 */
export interface CompanyDashboardStats {
  totalColaboradores: number;
  mediaProgressoUnidade: number;
  totalCertificados: number;
  ativos24h: number;
}

/**
 * Dados para o gráfico de área (Recharts)
 */
export interface ActivityChartData {
  name: string; // Ex: "Seg", "Ter", "Qua"
  atividades: number; // Volume de lições/quizzes concluídos
}

/**
 * Representação de uma linha na tabela de gestão de alunos
 */
export interface CollaboratorRow {
  id: string;
  nome: string;
  cpf: string;
  progresso_medio: number;
  certificados_count: number;
  role: 'colaborador' | 'empresa'; // Adicionado para diferenciar gestores na lista
  status: 'concluido' | 'em_curso' | 'nao_iniciado';
}

/**
 * Resposta completa do Service para o carregamento inicial da página
 */
export interface CompanyDashboardData {
  stats: CompanyDashboardStats;
  chartData: ActivityChartData[];
  collaborators: CollaboratorRow[];
}

/**
 * Detalhes de progresso por Treinamento (Usado no Drawer/Sheet lateral)
 */
export interface UserTrainingDetail {
  titulo_treinamento: string;
  progresso: number;
  status: 'concluido' | 'em_curso' | 'nao_iniciado';
  data_conclusao: string | null;
}

/**
 * Informações do certificado para download (Usado no Modal)
 */
export interface UserCertificate {
  id: number;
  nome_treinamento: string;
  data_conclusao: string;
  caminho_pdf_bucket: string; // URL direta do Storage do Supabase
  codigo: string; // UUID de validação do certificado
}