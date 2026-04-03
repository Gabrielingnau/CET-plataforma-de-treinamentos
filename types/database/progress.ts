// types/database/progress.ts
export interface LessonProgress {
  id: number;
  user_id: string;
  lesson_id: number;
  completed: boolean;
  created_at: string;
}

export interface QuizAttempt {
  id: number;
  user_id: string;
  module_id: number;
  respostas: Record<string, string>; // JSONB: { "pergunta_id": "resposta" }
  pontuacao: number;
  passou: boolean;
  created_at: string;
}

export interface ExamAttempt {
  id: number;
  user_id: string;
  training_id: number;
  respostas: Record<string, string>;
  pontuacao: number;
  passou: boolean;
  created_at: string;
}