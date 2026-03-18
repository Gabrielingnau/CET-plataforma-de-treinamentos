import { PDFDocument } from 'pdf-lib';

export async function validateTemplatePDF(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Aqui você poderia tentar preencher campos se fosse um PDF Form (AcroForms)
  // Mas como você quer buscar "Palavras Chave" no texto, o ideal é que o 
  // usuário suba um PDF com campos de formulário (Form Fields).
  
  const form = pdfDoc.getForm();
  const fields = form.getFields().map(f => f.getName());
  
  const requiredFields = ["nome_aluno", "nome_treinamento", "carga_horaria"];
  const missing = requiredFields.filter(field => !fields.includes(field));

  return {
    isValid: missing.length === 0,
    missingFields: missing,
    detectedFields: fields
  };
}