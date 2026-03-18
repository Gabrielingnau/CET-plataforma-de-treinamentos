import { supabase } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Faz o upload de um arquivo para o bucket 'box'
 * @param file O arquivo vindo do input type="file"
 * @param folder A pasta de destino ('imagem' ou 'video')
 */
export async function uploadFile(file: File, folder: "imagem" | "video") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("box") // Nome corrigido para box
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Erro Supabase Storage:", error);
    throw new Error("Falha ao subir arquivo para o servidor.");
  }

  const { data: { publicUrl } } = supabase.storage
    .from("box")
    .getPublicUrl(filePath);

  return publicUrl;
}