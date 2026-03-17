// types/forms/question-form.ts
import * as yup from "yup"

export const questionSchema = yup.object({
  pergunta: yup.string().required("A pergunta é obrigatória"),
  // Validamos um array de strings com pelo menos 2 opções
  opcoes: yup.array()
    .of(yup.string().required("A opção não pode estar vazia"))
    .min(2, "Crie pelo menos 2 opções")
    .required("As opções são obrigatórias"),
  // A opção correta deve ser obrigatoriamente uma das strings do array de opções
  opcao_correta: yup.string().required("Selecione a resposta correta"),
  
  // IDs de referência (um ou outro será usado)
  module_id: yup.number().integer().optional(),
  training_id: yup.number().integer().optional(),
})

export type QuestionFormData = yup.InferType<typeof questionSchema>