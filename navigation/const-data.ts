import { NavItem } from "@/types/navigation/nav-item.type"
import { LayoutDashboard, GraduationCap, Users, FileCheck } from "lucide-react"

export const data: NavItem[] = [
  {
    title: "Painel de Controle",
    url: "/admin/painel",
    icon: LayoutDashboard,
    roles: ["admin", "empresa"],
    items: [
      {
        title: "Administrador",
        url: "/admin/painel",
        roles: ["admin"],
      },
      {
        title: "Empresa",
        url: "/empresa/painel",
        roles: ["empresa"],
      },
    ],
  },
  {
    title: "Treinamentos",
    url: "/admin/treinamentos",
    icon: GraduationCap,
    roles: ["admin", "empresa", "colaborador"],
    items: [
      {
        title: "Novo +",
        url: "/admin/treinamentos/novo",
        roles: ["admin"],
      },
      {
        title: "Gerenciar",
        url: "/admin/treinamentos/gerenciar",
        roles: ["admin"],
      },
      {
        title: "Catálogo",
        url: "/empresa/treinamentos/catalogo",
        roles: ["empresa"],
      },
      {
        title: "Meus Treinamentos",
        url: "/empresa/treinamentos/meus-treinamentos",
        roles: ["empresa", "admin"],
        hideFromRoles: ["admin"],
      },
      {
        title: "Meus Treinamentos",
        url: "/colaborador/treinamentos/meus-treinamentos",
        roles: ["colaborador", "admin"],
        hideFromRoles: ["admin"],
      },
    ],
  },
  {
    title: "Empresas",
    url: "/admin/empresas",
    icon: Users,
    roles: ["admin"],
    items: [
      {
        title: "Nova Empresa +",
        url: "/admin/empresas/novo",
        roles: ["admin"],
      },
      {
        title: "Novo Gestor +",
        url: "/admin/empresas/gestor",
        roles: ["admin"],
      },
      {
        title: "Gerenciar",
        url: "/admin/empresas/gerenciar",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Certificados",
    url: "/admin/certificados",
    icon: FileCheck,
    roles: ["admin"],
    items: [
      {
        title: "Templates",
        url: "/admin/certificados/templates",
        roles: ["admin"],
      },
    ],
  },
]
