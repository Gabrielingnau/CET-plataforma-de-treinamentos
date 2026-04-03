
export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Esqueleto dos Filtros */}
      <div className="h-24 w-full rounded-[2.5rem] bg-card/40 border border-border" />

      {/* Esqueleto do Grid de Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="h-100 w-full rounded-[32px] bg-card/50 border border-border" 
          />
        ))}
      </div>
    </div>
  )
}