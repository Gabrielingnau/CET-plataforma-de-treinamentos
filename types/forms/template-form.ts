import * as yup from "yup";

export const templateSchema = yup.object({
  titulo: yup.string().required("Título é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  arquivo_pdf: yup.mixed().required("O PDF do template é obrigatório"),
  capa_imagem: yup.mixed().required("Uma imagem de visualização é obrigatória"),
});

export type TemplateFormData = yup.InferType<typeof templateSchema>;
