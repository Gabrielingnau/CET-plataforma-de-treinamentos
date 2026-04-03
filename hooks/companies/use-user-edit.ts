import { useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserProfile } from "@/services/collaborators/update-users"
import { companyAdminSchema } from "@/types/forms/company-admin-form"
import { collaboratorSchema } from "@/types/forms/collaborator-form"
import { toast } from "sonner"

interface UseUserEditProps {
  userData: any
  empresaId: string | number
  isOpen: boolean
  onSuccess: () => void
}

export function useUserEdit({ userData, empresaId, isOpen, onSuccess }: UseUserEditProps) {
  const queryClient = useQueryClient()
  
  const isGestor = useMemo(() => 
    userData.role?.toLowerCase().trim() === 'empresa', 
  [userData.role])

  const schema = useMemo(() => 
    isGestor ? companyAdminSchema : collaboratorSchema, 
  [isGestor])

  const form = useForm({
    resolver: yupResolver(schema as any),
    mode: "onChange"
  })

  // Sincroniza os dados do formulário quando o modal abre
  useEffect(() => {
    if (isOpen) {
      form.reset({
        nome: userData.nome || "",
        cpf: userData.cpf || "",
        email: userData.email || "",
        telefone: userData.telefone || "",
        empresa_id: Number(empresaId),
      })
    }
  }, [isOpen, userData, empresaId, form])

  const mutation = useMutation({
    mutationFn: (data: any) => updateUserProfile(userData.id, data),
    onSuccess: () => {
      toast.success("Dados sincronizados com a KYDORA!")
      queryClient.invalidateQueries({ queryKey: ["company-details", String(empresaId)] })
      onSuccess()
    },
    onError: () => toast.error("Falha na atualização dos dados")
  })

  return {
    form,
    isGestor,
    isLoading: mutation.isPending,
    update: mutation.mutate
  }
}