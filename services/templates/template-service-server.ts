import { createClient } from "@/lib/supabase/server";

export async function getTemplates() {
  const supabase = await createClient(); // Usa o cliente de servidor
  const { data, error } = await supabase
    .from("certificate_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro no servidor:", error);
    return [];
  }
  return data;
}