import * as yup from "yup"

// Schema de validação
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
}).required()

// Tipo extraído do schema para o React Hook Form
export type LoginFormData = yup.InferType<typeof loginSchema>

// Tipo para o formulário de Esqueci a Senha
export type ForgotPasswordData = {
  email: string
}

// Tipo para o formulário de Reset de Senha
export type ResetPasswordData = yup.InferType<typeof resetPasswordSchema>

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(6, "Mínimo de 6 caracteres")
    .matches(/\d/, "Pelo menos um número")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
    .required("Confirmação é obrigatória"),
}).required()