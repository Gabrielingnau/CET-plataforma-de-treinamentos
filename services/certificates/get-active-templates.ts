import { supabase } from "@/lib/supabase/client"

/**
 * Busca todos os templates de certificado que estão marcados como ativos.
 */
export async function getActiveCertificateTemplates() {
  const { data, error } = await supabase
    .from("certificate_templates")
    .select("*")
    .eq("ativo", true)

  if (error) {
    throw new Error("Erro ao carregar templates de certificado: " + error.message)
  }

  return data || []
}