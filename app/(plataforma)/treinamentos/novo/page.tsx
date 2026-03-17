import { CreateTrainingForm } from "./form"

export default function NovoTreinamentoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Treinamento</h1>
        <p className="text-muted-foreground">
          Crie um novo treinamento para sua empresa
        </p>
      </div>

      <CreateTrainingForm />
    </div>
  )
}
