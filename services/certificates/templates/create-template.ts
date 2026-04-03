import { supabase } from "@/lib/supabase/client";
import { uploadFile } from "@/services/storage/upload-file";
import { CertificateTemplate } from "@/types/database/template";

export async function createTemplate(
  data: Pick<CertificateTemplate, "titulo" | "descricao">, 
  pdfFile: File, 
  imageFile: File
): Promise<CertificateTemplate> {
  // 1. Upload do PDF (Pasta: templates)
  const pdfUrl = await uploadFile(pdfFile, "templates" as any);

  // 2. Upload da Capa (Pasta: template-imagem)
  const capaUrl = await uploadFile(imageFile, "template-imagem" as any);

  // 3. Inserção no Banco
  const { data: result, error } = await supabase
    .from("certificate_templates")
    .insert([{
      titulo: data.titulo,
      descricao: data.descricao,
      url_bucket: pdfUrl,
      capa_url: capaUrl,
    }])
    .select()
    .single();

  if (error) throw error;
  return result as CertificateTemplate;
}