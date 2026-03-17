// app/(plataforma)/treinamentos/visualizar/page.tsx
import { createClient } from "@/lib/supabase/server";
import { HierarchicalEditor } from "./_components/hierarchical-editor";

export default async function VisualizarTreinamentosPage() {
  const supabase = await createClient();

  // 1. Busca todos os treinamentos para a listagem/sidebar
  const { data: trainings } = await supabase
    .from("trainings")
    .select(`
      *
    `)
    .order("created_at", { ascending: false });

  if (!trainings) return <div>Nenhum treinamento encontrado.</div>;

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-background">
      <HierarchicalEditor trainings={trainings} />
    </div>
  );
}