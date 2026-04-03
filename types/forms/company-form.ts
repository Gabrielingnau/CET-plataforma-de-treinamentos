import { cnpj } from "cpf-cnpj-validator"
import * as yup from "yup"

export const companySchema = yup.object({
  // --- DADOS DA EMPRESA (Tabela companies) ---
  nome: yup.string().required("O nome da empresa é obrigatório"),
  cnpj: yup
    .string()
    .required("CNPJ é obrigatório")
    .test("is-cnpj", "CNPJ inválido", (value) => cnpj.isValid(value)),
  email: yup
    .string()
    .email("E-mail institucional inválido")
    .required("E-mail da empresa é obrigatório"),
  telefone: yup
    .string()
    .transform((value) => (value === "" ? undefined : value)) // Se vazio, vira undefined
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4,5}$/, {
      message: "Telefone inválido",
      excludeEmptyString: true,
    }).required("telefone obrigatório"),
  acesso_total: yup.boolean().default(false),
  // --- VÍNCULOS (company_trainings) ---
  trainings_ids: yup.array().of(yup.number().defined()).default([]),
})

export type CompanyFormData = yup.InferType<typeof companySchema>
