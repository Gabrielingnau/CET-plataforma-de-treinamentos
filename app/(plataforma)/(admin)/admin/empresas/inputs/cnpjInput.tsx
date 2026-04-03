import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"

interface CnpjInputProps {
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  error?: any
  disabled?: boolean
}

export function CnpjInput({ register, setValue, error, disabled }: CnpjInputProps) {
  const maskCNPJ = (v: string) => {
    v = v.replace(/\D/g, "")
    v = v.replace(/^(\d{2})(\d)/, "$1.$2")
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
    v = v.replace(/(\d{4})(\d)/, "$1-$2")
    return v.substring(0, 18)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="cnpj" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        CNPJ
      </Label>
      <Input
        id="cnpj"
        placeholder="00.000.000/0000-00"
        disabled={disabled}
        {...register("cnpj", {
          onChange: (e) => setValue("cnpj", maskCNPJ(e.target.value))
        })}
        className="bg-background/50 focus-visible:ring-primary"
      />
      {error && <p className="text-xs text-destructive font-medium">{error.message}</p>}
    </div>
  )
}