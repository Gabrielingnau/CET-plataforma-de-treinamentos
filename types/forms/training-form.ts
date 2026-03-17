import * as yup from "yup"

export const trainingSchema = yup.object({
  cover_url: yup.string().url("URL de capa inválida").required("URL de capa é obrigatória"),
  titulo: yup.string().required("Título é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  carga_horaria: yup.string().required("Carga horária é obrigatória"),
  pontuacao_aprovacao: yup.number().integer().required("Pontuação de aprovação é obrigatória"),
  max_exam_tentativas: yup.number().integer().required("Número máximo de tentativas é obrigatório"),
})

export type TrainingFormData = yup.InferType<typeof trainingSchema>
