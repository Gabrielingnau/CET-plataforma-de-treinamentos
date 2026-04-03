export interface Company {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  acesso_total: boolean;
  created_at: string;
  updated_at: string | null;
}

// Representação do Gestor no Formulário/UI
export interface CompanyGestor {
  id?: string; // Opcional pois novos gestores podem não ter ID ainda
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  funcao: 'ADMIN' | 'EMPRESA'; // Funções administrativas
}

// Interface completa para o que o Service de Update espera
export interface UpdateFullCompanyPayload {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  acesso_total: boolean;
  trainings_ids: number[];
  gestores: CompanyGestor[]; 
}

export interface CompanyTraining {
  id: number;
  empresa_id: number;
  training_id: number;
  created_at: string;
}

// Payloads para os Services
export type CreateCompanyPayload = Omit<Company, "id" | "created_at" | "updated_at">;

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

// Para o vínculo de treinamentos
export interface CompanyTrainingPayload {
  empresa_id: number;
  training_ids: number[];
}

// Atribuição Granular (User <-> Training)
export interface UserTraining {
  id: number;
  user_id: string;
  training_id: number;
  empresa_id: number;
  status: 'nao_iniciado' | 'em_andamento' | 'concluido';
  progresso: number;
  data_atribuicao: string;
}