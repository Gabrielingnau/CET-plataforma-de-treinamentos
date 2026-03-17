import { UserRole } from "../navigation/nav-item.type"

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string | null
  role: UserRole
  nome: string
}
