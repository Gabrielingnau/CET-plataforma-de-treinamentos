import { supabase } from "@/lib/supabase/client";
import { CertificateTemplate } from "@/types/database/template";
import { uploadFile } from "@/services/storage/upload-file"; // Importando seu service centralizado

/**
 * Atualiza o template, incluindo suporte opcional para novos arquivos (PDF e Capa)
 * Utiliza o service centralizado de upload para o bucket 'box'
 */
export async function updateTemplate(
  id: number, 
  texts: Partial<CertificateTemplate>,
  novoPdfFile?: File | null,
  novaCapaFile?: File | null
): Promise<boolean> {
  // Criamos um objeto para armazenar o que será atualizado no banco
  const updateData: Partial<CertificateTemplate> = { ...texts };

  try {
    // 1. Upload do Novo PDF (se houver) usando seu service de storage
    if (novoPdfFile) {
      // Como seu service usa uuidv4 internamente, não precisamos nos preocupar com o nome do arquivo
      const publicUrl = await uploadFile(novoPdfFile, "imagem"); 
      updateData.url_bucket = publicUrl;
    }

    // 2. Upload da Nova Capa (se houver) usando seu service de storage
    if (novaCapaFile) {
      const publicUrl = await uploadFile(novaCapaFile, "imagem");
      updateData.capa_url = publicUrl;
    }

    // 3. Atualização Final no Banco de Dados
    const { error } = await supabase
      .from("certificate_templates")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Erro ao atualizar template:", error.message);
    throw error;
  }
}

/**
 * Ativa ou Desativa o template invertendo o status atual
 */
export async function toggleTemplateStatus(id: number, currentStatus: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("certificate_templates")
    .update({ ativo: !currentStatus })
    .eq("id", id);

  if (error) {
    console.error("Erro ao alternar status:", error.message);
    throw error;
  }
  
  return true;
}

/**
 * Ativação direta retornando o objeto completo atualizado
 */
export async function activateTemplate(id: number): Promise<CertificateTemplate> {
  const { data, error } = await supabase
    .from("certificate_templates")
    .update({ ativo: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao ativar template:", error.message);
    throw error;
  }
  
  return data as CertificateTemplate;
}