// types/training.ts

import { Lesson } from "./lessons";
import { Module } from "./modules";

/**
 * 1. ENTIDADE COMPLETA (GET)
 * O que o banco retorna. Aqui todos os campos são obrigatórios ou 
 * seguem a estrutura exata da tabela.
 */
export interface Training {
  id: string; // ou number, dependendo do seu banco
  created_at: string;
  updated_at: string | null;
  titulo: string;
  descricao: string;
  cover_url: string;
  carga_horaria: string;
  pontuacao_aprovacao: number;
  max_exam_tentativas: number;
  empresa_id: number;
  criado_por: string;
}

/**
 * 2. PAYLOAD DE CRIAÇÃO (POST)
 * O que enviamos para o banco. Não enviamos 'id' nem 'created_at', 
 * pois o banco gera sozinho.
 */
export interface CreateTrainingPayload {
  titulo: string;
  descricao: string;
  cover_url: string;
  carga_horaria: string;
  pontuacao_aprovacao: number;
  max_exam_tentativas: number;
  criado_por: string; // Vem do seu AuthContext
  empresa_id?: number; // Opcional se for injetado no backend
}

/**
 * 3. PAYLOAD DE ATUALIZAÇÃO (PUT/PATCH)
 * Todos os campos de criação, mas opcionais (Partial), 
 * pois você pode querer editar apenas o título, por exemplo.
 */
export interface UpdateTrainingPayload extends Partial<CreateTrainingPayload> {
  // Opcional: campos que só existem na edição se houver necessidade
}

/**
 * 4. INTERFACE PARA RELAÇÕES (JOIN)
 * Usado na sua página de "Visualizar", onde você traz o treinamento + módulos
 */
export interface TrainingWithRelations extends Training {
  modulos: Array<Module & {
    aulas: Lesson[];
  }>;
}