import { NavItem } from "@/types/navigation/nav-item.type"

export const data: NavItem[] = [
  {
    title: "Painel de Controle",
    url: "/painel",
    roles: ["admin", "empresa"],
    items: [
      {
        title: "Administrador",
        url: "/painel/administrador",
        roles: ["admin"],
      },
      {
        title: "Empresa",
        url: "/painel/empresa",
        roles: ["admin", "empresa"],
      },
    ],
  },
  {
    title: "Treinamentos",
    url: "/treinamentos",
    roles: ["admin", "empresa", "colaborador"],
    items: [
      {
        title: "Novo +",
        url: "/treinamentos/novo",
        roles: ["admin"],
      },
      {
        title: "Visualizar",
        url: "/treinamentos/visualizar",
        roles: ["admin", "empresa", "colaborador"],
      },
    ],
  },
  {
    title: "Clientes",
    url: "/clientes",
    roles: ["admin"],
    items: [
      {
        title: "Novo",
        url: "/clientes/novo",
        roles: ["admin"],
      },
      {
        title: "Listar",
        url: "/clientes/listar",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Certificados",
    url: "/certificados",
    roles: ["admin"],
    items: [
      {
        title: "Templates",
        url: "/certificados/templates",
        roles: ["admin"],
      },
    ],
  },
]