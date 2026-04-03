import { Metadata } from "next"
import { cookies } from "next/headers"
import NextTopLoader from "nextjs-toploader"
import { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { KBar } from "@/components/kbar"
import { TooltipProvider } from "@/components/ui/tooltip" // 1. Importe o Provider

export const metadata: Metadata = {
  title: "Painel Principal",
  description: "Algoritmo sendo desenvolvido",
  openGraph: {
    images: ["/og-image.png"],
  },
}

async function getSidebarDefaultState() {
  const cookieStore = await cookies()
  const value = cookieStore.get("sidebar_state")?.value

  // O cookie do Shadcn geralmente salva como string "true" ou "false"
  return value === "true"
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const defaultOpen = await getSidebarDefaultState()

  return (
    <KBar>
      <UIProviders defaultOpen={defaultOpen}>{children}</UIProviders>
    </KBar>
  )
}

// 🔹 Separação clara de responsabilidades
function UIProviders({
  children,
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  return (
    <TooltipProvider delayDuration={0}> {/* 2. Envolva tudo aqui */}
      <SidebarProvider defaultOpen={defaultOpen}>
        <NextTopLoader showSpinner={false} color="#F97316" /> {/* Cor laranja opcional */}

        <AppLayout>{children}</AppLayout>
      </SidebarProvider>
    </TooltipProvider>
  )
}

// 🔹 Layout estrutural puro (sem lógica)
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />

      <SidebarInset>
        <Header />

        {/* 👇 mais flexível */}
        <main>{children}</main>
      </SidebarInset>
    </>
  )
}