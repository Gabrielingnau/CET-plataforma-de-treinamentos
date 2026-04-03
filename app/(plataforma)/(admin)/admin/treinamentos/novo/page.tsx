import { CreateTrainingForm } from "./form"

export default function NovoTreinamentoPage() {
  return (
    <div className="space-y-6 sm:px-6 px-2 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Novo Treinamento
        </h1>
        <p className="text-muted-foreground">
          Comece definindo os pilares do seu novo treinamento.
        </p>
      </div>

      <CreateTrainingForm />
    </div>
  )
}