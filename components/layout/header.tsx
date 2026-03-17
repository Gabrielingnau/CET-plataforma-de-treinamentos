 
"use client"

import { LogoutButton } from "@/components/logout-button"

import { SearchInput } from "../kbar/search-input"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"
import { Breadcrumbs } from "./breadcrumbs"
import { ModeToggle } from "./ModeToggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-border bg-white/80 px-4 shadow-md backdrop-blur-xl transition-all duration-300 md:h-24 dark:bg-zinc-900/80">
      {/* Esquerda */}
      <div className="flex items-center gap-4">
        <SidebarTrigger/>

        <Separator
          orientation="vertical"
          className="h-6 bg-muted-foreground/30 hidden md:block"
        />

        <Breadcrumbs />
      </div>

      {/* Direita */}
      <div className="flex items-center gap-3 md:gap-4">
          <SearchInput />

        <ModeToggle />

        <LogoutButton />
      </div>
    </header>
  )
}
