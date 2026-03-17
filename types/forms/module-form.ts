// types/forms/module-form.ts
import * as yup from "yup"

export const moduleSchema = yup.object({
  titulo: yup.string().required("O título do módulo é obrigatório"),
  descricao: yup.string().required("A descrição do módulo é obrigatória"),
  training_id: yup.number().integer().required("ID do treinamento é obrigatório"),
  ordem: yup.number().integer().min(1, "A ordem deve ser no mínimo 1").required("Ordem é obrigatória"),
})

export type ModuleFormData = yup.InferType<typeof moduleSchema>