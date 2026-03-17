import * as yup from "yup"

export const collaboratorSchema = yup.object({
  nome: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  empresa_id: yup.number().integer().required("Empresa é obrigatória"),
  cargo: yup.string().required("Cargo é obrigatório"),
})

export type CollaboratorFormData = yup.InferType<typeof collaboratorSchema>
