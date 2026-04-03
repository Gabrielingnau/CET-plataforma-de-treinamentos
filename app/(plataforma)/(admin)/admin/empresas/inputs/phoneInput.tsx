// inputs/phoneInput.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"

interface PhoneInputProps {
  name?: string; // Adicione isso
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  error?: any
  disabled?: boolean
}

export function PhoneInput({ name = "telefone", register, setValue, error, disabled }: PhoneInputProps) {
  
  const maskPhone = (v: string) => {
    v = v.replace(/\D/g, ""); 
    if (v.length > 11) v = v.substring(0, 11);

    if (v.length > 10) {
      // Celular: (99) 99999-9999
      return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (v.length > 5) {
      // Fixo ou parcial: (99) 9999-9999
      return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (v.length > 2) {
      return v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (v.length > 0) {
      return v.replace(/(\d{0,2})/, "($1");
    }
    return v;
  }

  return (
    <div className="space-y-2 text-left">
      <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">
        Telefone / WhatsApp
      </Label>
      <Input
        placeholder="(00) 00000-0000"
        disabled={disabled}
        {...register(name, { // Use o name dinâmico aqui
          onChange: (e) => {
            const maskedValue = maskPhone(e.target.value);
            setValue(name, maskedValue, { shouldValidate: true }); // E aqui
          }
        })}
        className="h-12 focus-visible:ring-primary/20 font-bold uppercase italic"
      />
      {error && (
        <span className="text-[9px] font-bold text-destructive uppercase italic animate-in fade-in">
          {error.message}
        </span>
      )}
    </div>
  )
}