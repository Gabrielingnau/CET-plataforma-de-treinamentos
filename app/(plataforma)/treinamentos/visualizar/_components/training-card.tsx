// app/treinamentos/_components/training-card.tsx
import { Edit, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteTrainingModal } from "./delete-training-modal";
import Link from "next/link";

export function TrainingCard({ training }: { training: any }) {
  const totalAulas = training.modulos?.reduce((acc: number, mod: any) => acc + mod.aulas.length, 0) || 0;

  return (
    <Card className="overflow-hidden flex flex-col">
      <img src={training.cover_url} alt={training.titulo} className="h-48 w-full object-cover" />
      
      <CardHeader>
        <CardTitle className="line-clamp-1">{training.titulo}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{training.descricao}</p>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1"><Clock size={14}/> {training.carga_Horaria}</span>
          <span className="flex items-center gap-1"><BookOpen size={14}/> {totalAulas} Aulas</span>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 gap-2 p-4">
        {/* Link para a página de edição hierárquica */}
        <Button variant="outline" size="icon" asChild title="Editar estrutura">
          <Link href={`/treinamentos/${training.id}/editar`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>

        {/* Modal de exclusão protegida */}
        <DeleteTrainingModal trainingId={training.id} trainingTitle={training.titulo} />
      </CardFooter>
    </Card>
  );
}