// app/admin/treinamentos/[id]/builder/loading.tsx

export default function LoadingBuilder() {
  return (
    <div className="flex flex-col overflow-hidden animate-pulse">
      {/* 1. Header do Treinamento (Skeleton) */}
      <div className="h-20 w-full border-b bg-card/40 flex items-center justify-between px-8">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-lg bg-muted/60" />
          <div className="h-3 w-32 rounded-md bg-muted/30" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-primary/20" />
      </div>

      <div className="flex flex-1 flex-col lg:flex-row h-[calc(100vh-80px)]">
        
        {/* 2. Sidebar Desktop (Skeleton) */}
        <div className="hidden border-r bg-card/20 lg:block lg:w-80 p-6 space-y-6">
          <div className="h-4 w-20 rounded bg-muted/40 mb-8" />
          
          {/* Simulando 3 Módulos na lista */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-10 w-full rounded-xl bg-muted/30 border border-border/50" />
              {/* Simulando Aulas dentro do módulo */}
              <div className="ml-4 space-y-2">
                <div className="h-8 w-[90%] rounded-lg bg-muted/20" />
                <div className="h-8 w-[85%] rounded-lg bg-muted/20" />
              </div>
            </div>
          ))}
          
          <div className="pt-4">
            <div className="h-10 w-full rounded-xl border border-dashed border-border bg-muted/10" />
          </div>
        </div>

        {/* 3. Área Principal de Edição (Skeleton) */}
        <main className="flex-1 bg-muted/5 p-6 lg:p-10">
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Título da Seção sendo editada */}
            <div className="h-8 w-64 rounded-xl bg-muted/40" />
            
            {/* Card do Formulário */}
            <div className="rounded-[2rem] border border-border bg-card/40 p-8 space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-muted/40" />
                <div className="h-12 w-full rounded-xl bg-background/50 border border-border" />
              </div>
              
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted/40" />
                <div className="h-32 w-full rounded-2xl bg-background/50 border border-border" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <div className="h-10 w-24 rounded-xl bg-muted/20" />
                <div className="h-10 w-32 rounded-xl bg-primary/20" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}