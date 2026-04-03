import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"

interface CpfInputProps {
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  error?: any
  disabled?: boolean
  label?: string
  name?: string
}

export function CpfInput({ register, setValue, error, disabled, label = "CPF", name = "admin_cpf" }: CpfInputProps) {
  const maskCPF = (v: string) => {
    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return v.substring(0, 14)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <Input
        id={name}
        placeholder="000.000.000-00"
        disabled={disabled}
        {...register(name, {
          onChange: (e) => setValue(name, maskCPF(e.target.value))
        })}
      />
      {error && <p className="text-xs text-destructive font-medium">{error.message}</p>}
    </div>
  )
}