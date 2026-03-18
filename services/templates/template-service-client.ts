import { supabase } from "@/lib/supabase/client";
import { uploadFile } from "@/services/storage/upload-file";

export async function createTemplate(data: any, pdfFile: File, imageFile: File) {
  try {
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
    return result;
  } catch (error) {
    console.error("Erro ao criar template:", error);
    throw error;
  }
}

export async function deleteTemplate(id: number, pdfUrl: string, capaUrl: string | null) {
  try {
    const { error: countError, count } = await supabase
      .from("trainings") 
      .select("id", { count: 'exact', head: true })
      .eq("template_id", id);

    if (countError) throw countError;

    // Se houver vínculos, desativamos e retornamos um objeto de aviso
    if (count !== null && count > 0) {
      const { error: updateError } = await supabase
        .from("certificate_templates")
        .update({ ativo: false })
        .eq("id", id);

      if (updateError) throw updateError;
      
      // RETORNO AMIGÁVEL EM VEZ DE THROW
      return { type: 'deactivated', message: "O template estava em uso e foi apenas desativado." };
    }

    // Se não houver vínculos, exclusão física
    const getPath = (url: string) => url.split('/public/box/')[1];
    const filesToDelete = [getPath(pdfUrl)];
    if (capaUrl) filesToDelete.push(getPath(capaUrl));

    await supabase.storage.from('box').remove(filesToDelete);
    await supabase.from("certificate_templates").delete().eq("id", id);

    return { type: 'deleted', message: "Template excluído permanentemente." };
  } catch (error: any) {
    console.error("Erro real no deleteTemplate:", error.message);
    throw error;
  }
}

export async function activateTemplate(id: number) {
  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      .update({ ativo: true })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Erro ao ativar template:", error.message);
    throw error;
  }
}

export async function updateTemplate(id: number, data: { titulo: string, descricao: string }) {
  const { error } = await supabase
    .from("certificate_templates")
    .update(data)
    .eq("id", id);

  if (error) throw error;
  return true;
}