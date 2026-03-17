export interface Certificate {
  id: number
  created_at: string
  updated_at: string | null
  titulo: string
  template: string
  colaborador_id: number
  treinamento_id: number
}
