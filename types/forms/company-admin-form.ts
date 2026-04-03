// types/forms/company-admin-schema.ts
import * as yup from "yup"
import { cpf } from 'cpf-cnpj-validator'

// 1. Defina a interface explicitamente para o formulário
export interface CompanyAdminFormData {
  nome: string;
  email: string;
  cpf?: string | null;
  telefone?: string | null;
  empresa_id: number;
}

// 2. Crie o schema forçando a tipagem da interface
export const companyAdminSchema: yup.ObjectSchema<CompanyAdminFormData> = yup.object({
  nome: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  
  // O segredo está no .transform para evitar strings vazias "" gerando erro de tipo
  cpf: yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test('is-cpf', 'CPF inválido', value => !value || cpf.isValid(value)),
    
  telefone: yup
      .string()
      .transform((value) => (value === "" ? undefined : value)) // Se vazio, vira undefined
      .matches(/^\(\d{2}\)\s\d{4,5}-\d{4,5}$/, {
        message: "Telefone inválido",
        excludeEmptyString: true,
      }).required("telefone obrigatório"),
    
  empresa_id: yup.number().required("A empresa é obrigatória"),
})