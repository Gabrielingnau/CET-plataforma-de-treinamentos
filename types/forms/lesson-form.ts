// types/forms/lesson-form.ts
import * as yup from "yup"

export const lessonSchema = yup.object({
  titulo: yup.string().required("O título da aula é obrigatório"),
  descricao: yup.string().required("A descrição da aula é obrigatória"),
  // Mudamos para mixed para aceitar o arquivo do input
  video_url: yup.mixed().required("O arquivo de vídeo é obrigatório"),
  texto_video: yup.string().required("O conteúdo em texto é obrigatório"),
  duracao_min: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .integer("A duração deve ser um número inteiro")
    .min(1, "Mínimo de 1 minuto")
    .required("Duração é obrigatória"),
  ordem: yup.number().integer().min(1).required("A ordem é obrigatória"),
  module_id: yup.number().integer().required("O ID do módulo é obrigatório"),
})

export type LessonFormData = yup.InferType<typeof lessonSchema>