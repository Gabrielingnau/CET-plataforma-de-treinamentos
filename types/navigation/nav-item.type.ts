import { LucideIcon } from "lucide-react"

export type UserRole = "admin" | "empresa" | "colaborador"

export interface NavItem {
  title: string
  url: string // Mudei de href para url para bater com seu código
  icon?: LucideIcon // O ícone é opcional para sub-itens
  roles?: UserRole[] // Opcional para sub-itens
  items?: NavItem[] // Para suportar sub-menus
}