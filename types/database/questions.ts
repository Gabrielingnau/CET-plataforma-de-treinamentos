// types/questions.ts

export interface BaseQuestion {
  id: number;
  pergunta: string;
  opcoes: string[]; // No JSONB do banco guardaremos ['Opção A', 'Opção B', ...]
  opcao_correta: string;
  created_at: string;
}

// Perguntas do Módulo (Quiz)
export interface QuizQuestion extends BaseQuestion {
  module_id: number;
}

export interface CreateQuizQuestionPayload {
  module_id: number;
  pergunta: string;
  opcoes: string[];
  opcao_correta: string;
}

// Perguntas do Treinamento (Prova Final)
export interface ExamQuestion extends BaseQuestion {
  training_id: number;
}

export interface CreateExamQuestionPayload {
  training_id: number;
  pergunta: string;
  opcoes: string[];
  opcao_correta: string;
}

export interface UpdateQuestionPayload extends Partial<CreateQuizQuestionPayload & CreateExamQuestionPayload> {}