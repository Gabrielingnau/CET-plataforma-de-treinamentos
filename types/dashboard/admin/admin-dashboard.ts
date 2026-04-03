export interface GlobalStats {
  totalColaboradores: number;
  totalCertificados: number;
  taxaAprovacaoGeral: number; // (Total Passou / Total Tentativas) * 100
  empresasAtivas: number;
}

export interface CompanySummary {
  id: number;
  nome: string;
  totalAlunos: number;
  mediaProgresso: number;
  statusSaude: 'estavel' | 'atencao' | 'critico'; // Baseado na média de progresso e reprovações
}

export interface AdminDashboardData {
  stats: GlobalStats;
  rankingEmpresas: CompanySummary[];
}