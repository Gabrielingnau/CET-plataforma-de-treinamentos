import { getTemplates } from "@/services/templates/template-service-server";
import { TemplatesView } from "./_components/templates-view";

// Força a página a não usar cache estático para refletir mudanças no banco
export const revalidate = 0; 

export default async function TemplatesPage() {
  // Busca os dados no servidor (Seguro e rápido)
  const templates = await getTemplates();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Templates de Certificado</h1>
        <p className="text-muted-foreground">Gerencie e visualize os modelos de certificados disponíveis para seus treinamentos.</p>
      </div>

      {/* Passa os dados para o componente de filtro (Client) */}
      <TemplatesView initialTemplates={templates || []} />
    </main>
  );
}