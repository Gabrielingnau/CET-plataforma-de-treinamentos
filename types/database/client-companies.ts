export interface ClientCompany {
  id: number
  created_at: string
  updated_at: string | null
  nome: string
  cnpj: string
  telefone: string
  acesso_total: boolean
}
