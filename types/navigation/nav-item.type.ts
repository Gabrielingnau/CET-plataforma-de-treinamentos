import { LucideIcon } from "lucide-react"

export type UserRole = "admin" | "empresa" | "colaborador"

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon // Agora aceita ícones do Lucide-React
  roles?: UserRole[]
  hideFromRoles?: UserRole[]
  items?: NavItem[]
}