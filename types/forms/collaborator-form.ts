import { cpf } from "cpf-cnpj-validator"
import * as yup from "yup"

export const collaboratorSchema = yup.object({
  nome: yup.string().required("O nome do colaborador é obrigatório"),
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("is-cpf", "CPF inválido", (value) => cpf.isValid(value)),
  empresa_id: yup.number().required(),
})

export type CollaboratorFormData = yup.InferType<typeof collaboratorSchema>
