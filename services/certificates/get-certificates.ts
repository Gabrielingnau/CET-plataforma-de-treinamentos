// services/certificates.ts
import { supabase } from "@/lib/supabase/client"

/**
 * Busca a URL de um certificado já emitido
 */
export async function getExistingCertificate(trainingId: number, userId: string) {
  const { data, error } = await supabase
    .from('certificates')
    .select('caminho_pdf_bucket')
    .eq('user_id', userId)
    .eq('training_id', trainingId)
    .maybeSingle()

  if (error) {
    console.error("Erro ao buscar certificado:", error)
    return null
  }

  return data?.caminho_pdf_bucket || null
}

/**
 * Sua função de emissão via Edge Function (mantenha como está)
 */
export async function generateCertificate(trainingId: number, userId: string) {
  const { data, error } = await supabase.functions.invoke('generate-pdf-certificate', {
    body: { trainingId, userId },
  })

  if (error) throw error
  return data 
}