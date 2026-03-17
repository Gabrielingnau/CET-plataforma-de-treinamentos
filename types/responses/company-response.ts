import { TrainingResponse } from "./training-response"

export interface CompanyResponse {
  id: number
  nome: string
  cnpj: string
  telefone: string
  acesso_total: boolean
  trainings: TrainingResponse[]
}
