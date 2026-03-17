import * as yup from "yup"

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Email inválido")
    .required("Email é obrigatório"),

  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
})

export type LoginFormData = yup.InferType<typeof loginSchema>