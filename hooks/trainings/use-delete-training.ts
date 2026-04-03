"use client"

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTraining } from "@/services/trainings/delete-training";
import { toast } from "sonner";

export function useDeleteTraining(trainingId: number | string, trainingTitle: string) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteTraining(Number(trainingId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings-list"] });
      toast.success("Treinamento removido.");
      setOpen(false);
      setConfirmText("");
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir: " + error.message);
    }
  });

  const canDelete = confirmText === trainingTitle;

  const handleCopy = () => {
    navigator.clipboard.writeText(trainingTitle);
    toast.info("Nome copiado!");
  };

  return {
    open,
    setOpen,
    confirmText,
    setConfirmText,
    mutation,
    canDelete,
    handleCopy
  };
}