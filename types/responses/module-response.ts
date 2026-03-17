import { LessonResponse } from "./lesson-response"

export interface ModuleResponse {
  id: number
  titulo: string
  descricao: string
  treinamento_id: number
  ordem: number
  lessons: LessonResponse[]
}
