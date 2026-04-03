export interface ExamAttempt {
  id: number;
  pontuacao: number;
  passou: boolean;
  created_at: string;
}

export interface QuizAttempt {
  id: number;
  module_id: number;
  passou: boolean;
  pontuacao: number;
}

// Nova interface para listar no modal
export interface Module {
  id: number;
  titulo: string;
  concluido: boolean;
}

export interface StudentTrainingDetail {
  training_id: number;
  titulo: string;
  carga_horaria: number;
  progresso: number;
  status: string;
  max_tentativas: number;
  tentativas_usadas: number;
  historico_provas: ExamAttempt[];
  modules: Module[]; // Substituímos o quiz_status genérico por módulos reais
}

export interface StudentDossier {
  user: {
    id: string;
    nome: string;
    email: string;
    empresa_nome: string;
  };
  trainings: StudentTrainingDetail[];
}