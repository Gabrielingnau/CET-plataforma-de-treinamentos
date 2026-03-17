import { ModuleResponse } from "./module-response"

export interface TrainingResponse {
  id: number
  titulo: string
  descricao: string
  empresa_id: number
  modules: ModuleResponse[]
}
