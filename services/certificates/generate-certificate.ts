import { supabase } from "@/lib/supabase/client"

export async function generateCertificate(
  trainingId: number, 
  userId: string, 
  isAdmin: boolean = false
) {
  // Chamada para a Edge Function com o novo parâmetro isAdmin
  const { data, error } = await supabase.functions.invoke('generate-pdf-certificate', {
    body: { 
      trainingId, 
      userId,
      isAdmin // O Supabase agora sabe se deve salvar ou apenas gerar o preview
    },
  })

  if (error) {
    console.error("Erro ao gerar certificado:", error)
    throw error
  }
  
  // Lógica para lidar com o Preview do Admin (Base64)
  if (data.status === 'preview' && data.pdfBase64) {
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${data.pdfBase64}`
    link.download = `Preview_Certificado_${trainingId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return { ...data, url: link.href } // Retorna um objeto compatível
  }

  // Retorna os dados do certificado (URL do Storage no fluxo normal)
  return data 
}