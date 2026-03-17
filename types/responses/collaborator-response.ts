import { Certificate } from "../database/certificates"

export interface CollaboratorResponse {
  id: number
  nome: string
  email: string
  empresa_id: number
  cargo: string
  certificates: Certificate[]
}
