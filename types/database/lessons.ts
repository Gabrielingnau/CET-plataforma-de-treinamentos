// types/lesson.ts

import { ModuleData } from "./modules";

export interface Lesson {
  id: number;
  module_id: number;
  titulo: string;
  descricao: string;
  video_url: string;
  texto_video: string; // Conteúdo em texto que acompanha o vídeo
  duracao_min: number; // int4
  ordem: number;
  created_at: string;
  updated_at: string | null;
}

export interface CreateLessonPayload {
  module_id: number;
  titulo: string;
  descricao: string;
  video_url: string;
  texto_video: string;
  duracao_min: number;
  ordem: number;
}

export interface LessonData {
  id: number;
  titulo: string;
  descricao: string;
  video_url: string;
  modulo: ModuleData;
}

export interface UpdateLessonPayload extends Partial<CreateLessonPayload> {}