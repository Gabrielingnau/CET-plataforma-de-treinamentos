import { CertificateTemplate } from "./certificates"
import { Lesson } from "./lessons"
import { Module } from "./modules"
import { User } from "./users" // Importando o type de user que você mandou

export interface Training {
  id: number
  created_at: string
  updated_at: string | null
  titulo: string
  descricao: string
  cover_url: string
  carga_horaria: number
  pontuacao_aprovacao: number
  max_exam_tentativas: number
  template_id: number | null
  empresa_id: number
  criado_por: string
}

export interface CreateTrainingPayload {
  titulo: string
  descricao: string
  cover_url: string
  carga_horaria: number
  pontuacao_aprovacao: number
  max_exam_tentativas: number
  template_id: number | null
  criado_por: string
  empresa_id?: number
}

/**
 * Interface específica para a listagem da View (getTrainingsList).
 * Usa os nomes (aliases) definidos na query do Supabase.
 */
export interface TrainingWithDetails extends Training {
  // O alias 'criador' retorna apenas o nome conforme sua query
  criador: Pick<User, "nome"> | null

  // O alias 'certificate_template'
  certificate_template: Pick<
    CertificateTemplate,
    "id" | "titulo" | "capa_url"
  > | null

  // O alias 'modules' que contém as aulas (lessons)
  modules: {
    id: number
    lessons: {
      id: number
    }[]
  }[]
}

// Mantendo sua estrutura antiga para compatibilidade se necessário
export interface FullTrainingStructure extends Training {
  certificate_templates: CertificateTemplate | null
  modulos: (Module & {
    aulas: Lesson[]
  })[]
}
