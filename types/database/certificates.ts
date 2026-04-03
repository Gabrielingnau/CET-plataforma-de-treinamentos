// --- TEMPLATES DE CERTIFICADOS ---

export interface CertificateTemplate {
  id: number
  titulo: string
  descricao: string | null
  url_bucket: string
  palavras_chave: string[] // Mapeado do JSONB
  ativo: boolean
  capa_url: string | null
  criado_por: string | null // UUID
  created_at: string
  updated_at: string | null
}

export interface CreateCertificateTemplatePayload {
  titulo: string
  descricao?: string
  url_bucket: string
  capa_url?: string
  palavras_chave?: string[]
  criado_por: string
  ativo?: boolean
}

// --- CERTIFICADOS EMITIDOS (GERADOS) ---

export interface Certificate {
  id: number
  codigo: string // UUID gerado pelo banco
  user_id: string // UUID
  training_id: number
  template_id: number | null
  nome_aluno: string | null
  nome_treinamento: string | null
  carga_horaria: number | null
  data_conclusao: string | null
  caminho_pdf_bucket: string | null
  created_at: string
}

export interface CreateCertificatePayload {
  user_id: string
  training_id: number
  template_id: number
  nome_aluno: string
  nome_treinamento: string
  carga_horaria: number
  data_conclusao: string // ISO Date
  caminho_pdf_bucket: string
}