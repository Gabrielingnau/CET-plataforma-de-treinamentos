"use client"

import { forwardRef } from "react"
import { FieldError } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="group flex w-full flex-col gap-2">
        <Label
          className={cn(
            "text-[10px] font-black tracking-widest text-muted-foreground uppercase italic"
          )}
        >
          {label}
        </Label>

        <div className="relative">
          <Input 
            ref={ref} 
            {...props} 
            className={cn(
              "h-12 rounded-xl font-bold uppercase italic focus-visible:ring-primary/20",
              error && "border-destructive/50 focus-visible:ring-destructive/20",
              className
            )}
          />
        </div>

        {error && (
          <p className="text-[9px] font-black text-destructive uppercase tracking-tight italic">
            {error.message}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"