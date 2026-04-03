// app/admin/treinamentos/novo/loading.tsx

export default function LoadingNovoTreinamento() {
  return (
    <main className="container mx-auto max-w-4xl px-6 py-10">
      {/* Header Skeleton */}
      <header className="mb-10 space-y-3">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-muted/60" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-muted/30" />
      </header>

      {/* Form Card Skeleton */}
      <div className="space-y-8 rounded-[2rem] border border-border bg-card/40 p-8">
        
        {/* Grid: Título e Carga Horária */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="space-y-2 md:col-span-3">
            <div className="h-4 w-32 animate-pulse rounded bg-muted/40" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-background/50 border border-border" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted/40" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-background/50 border border-border" />
          </div>
        </div>

        {/* Descrição Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
          <div className="h-32 w-full animate-pulse rounded-2xl bg-background/50 border border-border" />
        </div>

        {/* URL Capa Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-muted/40" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-background/50 border border-border" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-muted/20" />
          <div className="h-10 w-40 animate-pulse rounded-xl bg-primary/20" />
        </div>
      </div>
    </main>
  )
}