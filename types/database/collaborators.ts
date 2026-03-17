export interface Collaborator {
  id: number
  created_at: string
  updated_at: string | null
  nome: string
  email: string
  empresa_id: number
  cargo: string
}
