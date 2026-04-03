import { TemplatesView } from "./_components/templates-view"

// Como o React Query gerencia o cache no cliente, 
// não precisamos mais de revalidate = 0 aqui para o fetch inicial.
export const metadata = {
  title: "Templates de Certificado | Admin",
  description: "Gerencie os modelos de certificados da plataforma.",
}

export default function TemplatesPage() {
  return (
    <main className="container mx-auto max-w-7xl sm:px-6 px-2 py-10">
      {/* Header da Página com Estilo Consistente */}
      <header className="mb-10 space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Templates de <span className="text-primary">Certificado</span>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Crie, edite e gerencie os modelos visuais que serão utilizados na emissão 
          automática de certificados para os seus alunos.
        </p>
      </header>

      {/* O componente agora busca seus próprios dados. 
        Não precisa mais passar initialTemplates.
      */}
      <TemplatesView />
    </main>
  )
}