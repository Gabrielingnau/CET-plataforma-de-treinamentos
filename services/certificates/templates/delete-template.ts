import { supabase } from "@/lib/supabase/client";

export async function deleteTemplate(
  id: number, 
  pdfUrl: string, 
  capaUrl: string | null
): Promise<{ type: 'deleted' | 'deactivated'; message: string }> {
  // Verifica se há treinamentos vinculados
  const { error: countError, count } = await supabase
    .from("trainings") 
    .select("id", { count: 'exact', head: true })
    .eq("template_id", id);

  if (countError) throw countError;

  // Se estiver em uso, apenas desativamos
  if (count !== null && count > 0) {
    await supabase
      .from("certificate_templates")
      .update({ ativo: false })
      .eq("id", id);
      
    return { 
      type: 'deactivated', 
      message: "Template em uso: foi apenas desativado para preservar os certificados existentes." 
    };
  }

  // Se não estiver em uso, exclusão física dos arquivos e do banco
  const getPath = (url: string) => url.split('/public/box/')[1];
  const filesToDelete = [getPath(pdfUrl)];
  if (capaUrl) filesToDelete.push(getPath(capaUrl));

  await supabase.storage.from('box').remove(filesToDelete);
  
  const { error: deleteError } = await supabase
    .from("certificate_templates")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  return { type: 'deleted', message: "Template excluído permanentemente." };
}