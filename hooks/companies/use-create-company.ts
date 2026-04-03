import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { companySchema, CompanyFormData } from "@/types/forms/company-form"
import { createCompanyAndTrainings } from "@/services/companies/create-company-action"
import { getTrainingsList } from "@/services/trainings/get-training"

export function useCreateCompany() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema),
    mode: "onChange",
    defaultValues: {
      acesso_total: false,
      trainings_ids: [],
      email: "",
    },
  })

  const { watch, setValue, trigger, handleSubmit, getValues } = form
  const acessoTotal = watch("acesso_total")
  const selectedTrainings = watch("trainings_ids") || []

  const { data: trainings, isLoading: loadingTrainings } = useQuery({
    queryKey: ["trainings-list"],
    queryFn: getTrainingsList,
  })

  const mutation = useMutation({
    mutationFn: createCompanyAndTrainings,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Empresa ${data.companyNome} cadastrada!`)
        queryClient.invalidateQueries({ queryKey: ["companies-list"] })
        // Redireciona para a listagem geral após o sucesso
        router.push(`/admin/empresas/gerenciar`)
      } else {
        toast.error(data.error)
      }
    },
  })

  // Validação para avançar ao passo 2
  const handleNextStep = async () => {
    const isValid = await trigger(["nome", "cnpj", "telefone", "email"])
    if (isValid) {
      setStep(2)
      window.scrollTo(0, 0) // Scroll para o topo ao mudar de passo
    } else {
      toast.error("Preencha os dados básicos da empresa para continuar.")
    }
  }

  const toggleTraining = useCallback((id: number) => {
    const current = getValues("trainings_ids") || []
    const isSelected = current.includes(id)
    const newValue = isSelected ? current.filter(i => i !== id) : [...current, id]
    setValue("trainings_ids", newValue, { shouldValidate: true })
  }, [getValues, setValue])

  const toggleAllTrainings = useCallback(() => {
    const newState = !acessoTotal
    setValue("acesso_total", newState)
    setValue("trainings_ids", newState && trainings ? trainings.map(t => t.id) : [], { shouldValidate: true })
  }, [acessoTotal, trainings, setValue])

  // Lógica de submissão protegida
  const onSubmit = handleSubmit((data) => {
    // Se o usuário apertar 'Enter' no passo 1, enviamos ele para o passo 2 em vez de criar
    if (step === 1) {
      handleNextStep()
      return
    }

    // Validação extra: Se não for acesso total, obriga a ter pelo menos 1 curso
    if (!data.acesso_total && (!data.trainings_ids || data.trainings_ids.length === 0)) {
      toast.error("Selecione os treinamentos ou ative o Acesso Total.")
      return
    }

    mutation.mutate(data)
  })

  return {
    step,
    setStep,
    form,
    trainings,
    loadingTrainings,
    mutation,
    acessoTotal,
    selectedTrainings,
    handleNextStep,
    toggleTraining,
    toggleAllTrainings,
    onSubmit
  }
}