"use client"

import { supabase } from "@/lib/supabase/client"

export async function seedCurrentTraining(trainingId: number) {
  const VIDEO_URL = "https://mkyaspdlvggxuctykolb.supabase.co/storage/v1/object/public/box/video/0cbf7e81-6d67-4992-aef4-60a067803449.mp4"

  console.log("🧹 Limpando dados antigos para re-popular...");

  // 1. LIMPEZA (CUIDADO: Isso apaga o progresso atual dos módulos desse treinamento)
  await supabase.from("modules").delete().eq("training_id", trainingId);
  await supabase.from("exam_questions").delete().eq("training_id", trainingId);

  // 2. CRIAR 3 MÓDULOS
  const { data: modulos, error: modError } = await supabase
    .from("modules")
    .insert([
      { training_id: trainingId, titulo: "Módulo 01: Normas e Introdução", descricao: "Base legal da NR-35 e conceitos de segurança.", ordem: 1 },
      { training_id: trainingId, titulo: "Módulo 02: Equipamentos e Conexão", descricao: "Inspeção e uso correto de EPIs e acessórios.", ordem: 2 },
      { training_id: trainingId, titulo: "Módulo 03: Prática e Resgate", descricao: "Procedimentos de emergência e suspensão inerte.", ordem: 3 }
    ])
    .select();

  if (modError) throw modError;

  const m1 = modulos.find(m => m.ordem === 1)!;
  const m2 = modulos.find(m => m.ordem === 2)!;
  const m3 = modulos.find(m => m.ordem === 3)!;

  // 3. CRIAR AULAS PARA TODOS OS MÓDULOS (Agora sim!)
  const aulasData = [
    // Aulas do Módulo 1
    { module_id: m1.id, titulo: "Aula 01: Introdução à NR-35", duracao_min: 10, video_url: VIDEO_URL, descricao: "Contexto legal.", ordem: 1 },
    { module_id: m1.id, titulo: "Aula 02: Análise de Risco", duracao_min: 12, video_url: VIDEO_URL, descricao: "Como identificar perigos.", ordem: 2 },
    
    // Aulas do Módulo 2
    { module_id: m2.id, titulo: "Aula 01: EPIs de Altura", duracao_min: 15, video_url: VIDEO_URL, descricao: "Cinturão e Talabarte.", ordem: 1 },
    { module_id: m2.id, titulo: "Aula 02: Inspeção de Equipamentos", duracao_min: 8, video_url: VIDEO_URL, descricao: "Checklist de segurança.", ordem: 2 },
    
    // Aulas do Módulo 3
    { module_id: m3.id, titulo: "Aula 01: Procedimentos de Resgate", duracao_min: 20, video_url: VIDEO_URL, descricao: "Primeiros socorros em altura.", ordem: 1 },
    { module_id: m3.id, titulo: "Aula 02: Suspensão Inerte", duracao_min: 10, video_url: VIDEO_URL, descricao: "Riscos da queda travada.", ordem: 2 }
  ];

  await supabase.from("lessons").insert(aulasData);

  // 4. QUIZ (Mantendo suas perguntas, elas já usam os IDs corretos m1, m2, m3)
  const quizQuestions = [
    { module_id: m1.id, pergunta: "Qual a altura mínima da NR-35?", opcoes: ["1m", "2m", "5m"], opcao_correta: "2m" },
    { module_id: m1.id, pergunta: "Quem autoriza o trabalho?", opcoes: ["Qualquer um", "Profissional capacitado", "O vigia"], opcao_correta: "Profissional capacitado" },
    { module_id: m2.id, pergunta: "Qual o fator de queda mais perigoso?", opcoes: ["0", "1", "2"], opcao_correta: "2" },
    { module_id: m2.id, pergunta: "O que o absorvedor faz?", opcoes: ["Prende o cabo", "Reduz o impacto", "Puxa o trabalhador"], opcao_correta: "Reduz o impacto" },
    { module_id: m2.id, pergunta: "Mosquetão deve estar sempre:", opcoes: ["Aberto", "Travado", "Preso com arame"], opcao_correta: "Travado" },
    { module_id: m3.id, pergunta: "ZQL significa:", opcoes: ["Zona de Queda Livre", "Zelo Quase Lindo", "Zero Quilos"], opcao_correta: "Zona de Queda Livre" },
    { module_id: m3.id, pergunta: "Risco da suspensão inerte é:", opcoes: ["Cansaço", "Morte/Lesão grave", "Fome"], opcao_correta: "Morte/Lesão grave" },
    { module_id: m3.id, pergunta: "Após uma queda real, o EPI deve ser:", opcoes: ["Lavado", "Descartado", "Doado"], opcao_correta: "Descartado" }
  ];

  await supabase.from("quiz_questions").insert(quizQuestions);

  // 5. PROVA FINAL
  const examQuestions = [
    { training_id: trainingId, pergunta: "Qual o limite de impacto no corpo?", opcoes: ["6kN", "10kN", "2kN"], opcao_correta: "6kN" },
    { training_id: trainingId, pergunta: "Talabarte em Y serve para quê?", opcoes: ["Descer rápido", "100% conectado", "Prender carga"], opcao_correta: "100% conectado" },
    { training_id: trainingId, pergunta: "Trava-quedas retrátil é bom para:", opcoes: ["Espaço reduzido", "Áreas abertas", "Calor"], opcao_correta: "Espaço reduzido" },
    { training_id: trainingId, pergunta: "Cinturão correto para altura:", opcoes: ["Abdominal", "Paraquedista", "Cinto comum"], opcao_correta: "Paraquedista" },
    { training_id: trainingId, pergunta: "Ancoragem deve suportar quanto?", opcoes: ["100kg", "1200kg (conforme projeto)", "50kg"], opcao_correta: "1200kg (conforme projeto)" },
    { training_id: trainingId, pergunta: "Linha de vida serve para:", opcoes: ["Ancoragem", "Descanso", "Subir escada"], opcao_correta: "Ancoragem" },
    { training_id: trainingId, pergunta: "Exame médico para altura é o:", opcoes: ["ASO de altura", "Exame de sangue", "Raio-x"], opcao_correta: "ASO de altura" },
    { training_id: trainingId, pergunta: "Pode trabalhar em altura sozinho?", opcoes: ["Sim", "Não (mínimo 2 pessoas)", "Só de dia"], opcao_correta: "Não (mínimo 2 pessoas)" }
  ];

  await supabase.from("exam_questions").insert(examQuestions);

  console.log("✅ Seed completo: 3 módulos com aulas e questões!");
  return true;
}