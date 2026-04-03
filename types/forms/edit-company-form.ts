import { cnpj, cpf } from "cpf-cnpj-validator"
import * as yup from "yup"

import { companySchema } from "./company-form"

export const editCompanySchema = companySchema.shape({
  // ID da Empresa (Obrigatório para o Update)
  id: yup.number().required("ID da empresa é necessário para edição"),

  // Sobrescrevemos o CNPJ caso queira garantir a validação no Edit também
  cnpj: yup
    .string()
    .required("CNPJ é obrigatório")
    .test("is-cnpj", "CNPJ inválido", (value) => cnpj.isValid(value || "")),

  // Lista de Gestores com validação de CPF
  gestores: yup
    .array()
    .of(
      yup.object({
        id: yup.string().optional(),
        nome: yup.string().required("Nome do gestor é obrigatório"),
        email: yup
          .string()
          .email("E-mail inválido")
          .required("E-mail é obrigatório"),
        cpf: yup
          .string()
          .required("CPF é obrigatório")
          .test("is-cpf", "CPF inválido", (value) => cpf.isValid(value || "")), // Validação Real de CPF
        telefone: yup
          .string()
          .transform((value) => (value === "" ? undefined : value)) // Se vazio, vira undefined
          .matches(/^\(\d{2}\)\s\d{4,5}-\d{4,5}$/, {
            message: "Telefone inválido",
            excludeEmptyString: true,
          })
          .required("telefone obrigatório"),
      })
    )
    .min(1, "É necessário pelo menos um gestor"),
})

export type EditCompanyFormData = yup.InferType<typeof editCompanySchema>
