import * as yup from "yup"

export const trainingSchema = yup.object({
  cover_url: yup.mixed<FileList | string>().required("A imagem de capa é obrigatória"),
  titulo: yup.string().required("Título é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  
  carga_horaria: yup
    .number()
    .typeError("A carga horária deve ser um número válido")
    .required("Carga horária é obrigatória")
    .min(0, "A carga horária não pode ser negativa") // Apenas não-negativo
    .integer("Use apenas números inteiros"),

  template_id: yup
    .string()
    .required("Selecione um template de certificado")
    .test("is-number", "ID do template inválido", (value) => !isNaN(Number(value))),

  pontuacao_aprovacao: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .required("Pontuação de aprovação é obrigatória")
    .integer("A pontuação deve ser um número inteiro")
    .min(0, "Mínimo 0%")
    .max(100, "Máximo 100%"),

  max_exam_tentativas: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .required("Número máximo de tentativas é obrigatório")
    .integer("O número de tentativas deve ser inteiro")
    .min(1, "Mínimo 1 tentativa"), // Tentativas geralmente começam em 1
})

export type TrainingFormData = yup.InferType<typeof trainingSchema>