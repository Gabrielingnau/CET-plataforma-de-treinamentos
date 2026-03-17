// app/(plataforma)/treinamentos/novo/[id]/modulos/novo/page.tsx

import { getTrainingById } from "@/services/trainings/get-training";
import { createClient } from "@/lib/supabase/server";
import CourseBuilderClient from "./_components/course-builder-layout"; // Ajuste o caminho se necessário
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // 1. No Next.js 15, params é uma Promise
  const { id } = await params;
  const trainingId = Number(id);

  if (isNaN(trainingId)) {
    return notFound();
  }

  // 2. Busca os dados do treinamento e sua estrutura (módulos e aulas)
  // Certifique-se que o seu service getTrainingById traz os módulos junto
  // Ou faça o fetch da estrutura aqui.
  const supabase = await createClient();
  
  const { data: training, error } = await supabase
    .from("trainings")
    .select(`
      *,
      modules (
        *,
        lessons (*)
      )
    `)
    .eq("id", trainingId)
    .single();

  if (error || !training) {
    return notFound();
  }

  // 3. Renderiza o componente de cliente passando os dados garantidos
  return (
    <CourseBuilderClient 
      training={training} 
      initialStructure={training.modules || []} 
    />
  );
}