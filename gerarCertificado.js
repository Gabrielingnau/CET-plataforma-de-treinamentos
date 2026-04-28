import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs'

async function criarPDF() {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595]) // A4 horizontal

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { width, height } = page.getSize()
  const form = pdfDoc.getForm()

  // 🎯 FUNDO
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.98, 0.98),
  })

  // 🎯 BORDA EXTERNA
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0, 0.2, 0.4),
    borderWidth: 2,
  })

  // 🎯 TÍTULO
  const titulo = 'CERTIFICADO'
  const titleSize = 32
  const titleWidth = bold.widthOfTextAtSize(titulo, titleSize)

  page.drawText(titulo, {
    x: (width - titleWidth) / 2,
    y: height - 100,
    size: titleSize,
    font: bold,
    color: rgb(0, 0.2, 0.4),
  })

  // SUBTEXTO
  const subtitulo = 'Este certificado comprova que'
  const subWidth = font.widthOfTextAtSize(subtitulo, 14)

  page.drawText(subtitulo, {
    x: (width - subWidth) / 2,
    y: height - 140,
    size: 14,
    font,
  })

  // 🎯 NOME DO ALUNO
  const nomeAluno = form.createTextField('nome_aluno')
  nomeAluno.addToPage(page, {
    x: 150,
    y: height - 200,
    width: width - 300,
    height: 40,
    borderWidth: 0, // ✅ remove borda
  })

  // linha elegante
  page.drawLine({
    start: { x: 150, y: height - 205 },
    end: { x: width - 150, y: height - 205 },
    thickness: 1.5,
    color: rgb(0, 0.2, 0.4),
  })

  // TEXTO
  const texto = 'concluiu com êxito o treinamento'
  const textoWidth = font.widthOfTextAtSize(texto, 14)

  page.drawText(texto, {
    x: (width - textoWidth) / 2,
    y: height - 260,
    size: 14,
    font,
  })

  // 🎯 TREINAMENTO
  const nomeTreinamento = form.createTextField('nome_treinamento')
  nomeTreinamento.addToPage(page, {
    x: 150,
    y: height - 300,
    width: width - 300,
    height: 30,
    borderWidth: 0,
  })

  page.drawLine({
    start: { x: 150, y: height - 305 },
    end: { x: width - 150, y: height - 305 },
    thickness: 1,
  })

  // 🎯 CARGA HORÁRIA
  page.drawText('Carga horária:', {
    x: 180,
    y: height - 360,
    size: 12,
    font,
  })

  const carga = form.createTextField('carga_horaria')
  carga.addToPage(page, {
    x: 280,
    y: height - 365,
    width: 80,
    height: 20,
    borderWidth: 0,
  })

  // 🎯 DATA
  page.drawText('Data:', {
    x: 450,
    y: height - 360,
    size: 12,
    font,
  })

  const data = form.createTextField('data_conclusao')
  data.addToPage(page, {
    x: 500,
    y: height - 365,
    width: 120,
    height: 20,
    borderWidth: 0,
  })

  // 🎯 ASSINATURA
  page.drawLine({
    start: { x: width / 2 - 120, y: 120 },
    end: { x: width / 2 + 120, y: 120 },
    thickness: 1,
  })

  const assinatura = 'Responsável'
  const assWidth = font.widthOfTextAtSize(assinatura, 10)

  page.drawText(assinatura, {
    x: (width - assWidth) / 2,
    y: 100,
    size: 10,
    font,
  })

  // 🎯 CÓDIGO
  page.drawText('Código:', {
    x: 150,
    y: 80,
    size: 10,
    font,
  })

  const codigo = form.createTextField('codigo')
  codigo.addToPage(page, {
    x: 210,
    y: 75,
    width: 200,
    height: 20,
    borderWidth: 0,
  })

  // 🔥 remove aparência padrão feia
  form.updateFieldAppearances(font)

  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync('certificado.pdf', pdfBytes)
}

criarPDF()