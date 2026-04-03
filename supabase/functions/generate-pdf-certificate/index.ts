import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1"
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Recebendo o isAdmin do corpo da requisição
    const { trainingId, userId, isAdmin = false } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. VALIDAÇÃO (Apenas para colaboradores reais)
    if (!isAdmin) {
      const { data: existingCert } = await supabaseAdmin
        .from('certificates')
        .select('caminho_pdf_bucket')
        .eq('user_id', userId)
        .eq('training_id', trainingId)
        .maybeSingle()

      if (existingCert?.caminho_pdf_bucket) {
        return new Response(JSON.stringify({ url: existingCert.caminho_pdf_bucket, status: 'already_exists' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
    }

    // 2. BUSCA DE DADOS (Igual para ambos, mas no Admin usamos dados mockados se falhar)
    const { data: training } = await supabaseAdmin
      .from('trainings')
      .select('titulo, carga_horaria, certificate_templates(id, url_bucket)')
      .eq('id', trainingId)
      .single()

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('nome')
      .eq('id', userId)
      .single()

    const template = training?.certificate_templates
    if (!template?.url_bucket) throw new Error('Template não configurado.')

    // 3. DEFINIÇÃO DO REGISTRO (Se admin, criamos um objeto fake na memória)
    let certRecord;
    if (!isAdmin) {
      const { data, error } = await supabaseAdmin
        .from('certificates')
        .insert({
          user_id: userId,
          training_id: trainingId,
          template_id: template.id,
          nome_aluno: user?.nome || 'Usuário',
          nome_treinamento: training.titulo,
          carga_horaria: training.carga_horaria,
          data_conclusao: new Date().toISOString()
        })
        .select().single()
      if (error) throw error
      certRecord = data
    } else {
      // Mock para o PDF do Admin
      certRecord = {
        codigo: 'PREVIEW-ADMIN-000',
        nome_aluno: user?.nome || 'ADMIN TESTE',
        nome_treinamento: training.titulo,
        carga_horaria: training.carga_horaria
      }
    }

    // 4. PROCESSAMENTO DO PDF (Ocorre para os dois casos)
    const response = await fetch(template.url_bucket)
    const existingBytes = await response.arrayBuffer()
    const pdfDoc = await PDFDocument.load(existingBytes)
    const form = pdfDoc.getForm()

    try { form.getTextField('nome_aluno').setText(certRecord.nome_aluno.toUpperCase()) } catch(e) {}
    try { form.getTextField('nome_treinamento').setText(certRecord.nome_treinamento) } catch(e) {}
    try { form.getTextField('carga_horaria').setText(`${certRecord.carga_horaria}h`) } catch(e) {}
    try { form.getTextField('data_conclusao').setText(new Date().toLocaleDateString('pt-BR')) } catch(e) {}
    try { form.getTextField('codigo').setText(certRecord.codigo) } catch(e) {}

    form.flatten()
    const finalBytes = await pdfDoc.save()

    // 5. DECISÃO FINAL: SALVAR OU RETORNAR PREVIEW
    if (isAdmin) {
      // Retornamos o PDF como Base64 para o Admin baixar direto no front-end
      const base64Pdf = encode(finalBytes)
      return new Response(JSON.stringify({ 
        pdfBase64: base64Pdf, 
        status: 'preview',
        message: 'Modo Admin: PDF gerado sem persistência.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Fluxo normal para Colaboradores (Upload para Storage)
    const filePath = `certificados/${certRecord.codigo}.pdf`
    const { error: uploadError } = await supabaseAdmin.storage
      .from('box')
      .upload(filePath, finalBytes, { contentType: 'application/pdf', upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabaseAdmin.storage.from('box').getPublicUrl(filePath)
    await supabaseAdmin.from('certificates').update({ caminho_pdf_bucket: publicUrl }).eq('id', certRecord.id)

    return new Response(JSON.stringify({ url: publicUrl, status: 'created' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})