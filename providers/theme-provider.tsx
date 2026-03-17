"use client"

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import * as React from "react"

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {" "}
      <ThemeHotkey />
      {children}{" "}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  const tag = target.tagName

  return (
    target.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // evita múltiplos disparos
      if (event.repeat || event.defaultPrevented) return

      // evita conflitos com atalhos do sistema
      if (event.metaKey || event.ctrlKey || event.altKey) return

      // proteção contra key indefinida
      if (!event.key) return

      const key = event.key.toLowerCase()

      // tecla que alterna o tema
      if (key !== "d") return

      // evita disparar enquanto digita
      if (isTypingTarget(event.target)) return

      // proteção durante hidratação
      if (!resolvedTheme) return

      const nextTheme = resolvedTheme === "dark" ? "light" : "dark"

      setTheme(nextTheme)
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}
