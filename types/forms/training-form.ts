import * as yup from "yup"

export const trainingSchema = yup.object({
  // Aceita FileList (novo upload) ou string (URL existente)
  cover_url: yup.mixed().required("A imagem de capa é obrigatória"),
  titulo: yup.string().required("Título é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  carga_horaria: yup.string().required("Carga horária é obrigatória"),
  
  // Novo campo: Template do Certificado
  // Como o Select do Radix/Shadcn trabalha com strings, 
  // recebemos a string e validamos se ela existe.
  template_id: yup
    .string()
    .required("Selecione um template de certificado")
    .test("is-number", "ID do template inválido", (value) => !isNaN(Number(value))),

  pontuacao_aprovacao: yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .integer("A pontuação deve ser um número inteiro")
    .min(0, "Mínimo 0%")
    .max(100, "Máximo 100%")
    .required("Pontuação de aprovação é obrigatória"),

  max_exam_tentativas: yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .integer("O número de tentativas deve ser inteiro")
    .min(1, "Mínimo 1 tentativa")
    .required("Número máximo de tentativas é obrigatório"),
})

export type TrainingFormData = yup.InferType<typeof trainingSchema>