import { Metadata } from "next"
import { cookies } from "next/headers"
import NextTopLoader from "nextjs-toploader"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { KBar } from "@/components/kbar"

export const metadata: Metadata = {
  title: "Painel Principal",
  description: "Algoritmo sendo desenvolvido",
  openGraph: {
    images: ["/og-image.png"],
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  // Corrigido nome do cookie
  const sidebarState = cookieStore.get("sidebar_state")?.value

  const defaultOpen = sidebarState === "true"

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <NextTopLoader showSpinner={false} />

        <AppSidebar />

        <SidebarInset>
          <Header />

          <main className="p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}