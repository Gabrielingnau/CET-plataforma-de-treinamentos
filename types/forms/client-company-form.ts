import * as yup from "yup"

export const clientCompanySchema = yup.object({
  id: yup.number().integer().optional(),
  created_at: yup.date().optional().nullable(),
  updated_at: yup.date().optional().nullable(),
  nome: yup
    .string()
    .required("O nome da empresa é obrigatório")
    .min(2, "Nome muito curto"),
  cnpj: yup
    .string()
    .required("O CNPJ é obrigatório")
    .matches(/^\d{14}$/, "CNPJ deve ter 14 dígitos"),
  telefone: yup
    .string()
    .required("O telefone é obrigatório")
    .matches(/^\d{10,11}$/, "Telefone inválido"),
  acesso_total: yup
    .boolean()
    .default(false)
    .required("Defina o status de acesso"),
})

export type ClientCompanyFormData = yup.InferType<typeof clientCompanySchema>
