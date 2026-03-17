"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import * as React from "react"
import { useContext } from "react"

import { AuthContext } from "@/contexts/auth-context"
import { data as navigationData } from "@/navigation/const-data"
import { Skeleton } from "@/components/ui/skeleton"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useContext(AuthContext)

  const role = user?.role ?? "colaborador"

  const filteredNav = navigationData
    .map((group) => {
      const filteredItems = group.items?.filter((item) =>
        item.roles?.includes(role)
      )

      if (!group.roles?.includes(role) && !filteredItems?.length) return null

      return { ...group, items: filteredItems }
    })
    .filter(Boolean)

  return (
    <Sidebar {...props}>
      {" "}
      <SidebarContent>
        {/* HEADER */}
        <SidebarHeader className="h-20 border-b p-4 px-4 md:h-24 border-muted">
          <h2 className="text-lg font-bold">CET</h2>

          {loading || !user ? (
            <Skeleton className="mt-2 h-4 w-32" />
          ) : (
            <p className="text-sm text-gray-500">Olá, {user.nome}</p>
          )}
        </SidebarHeader>

        {/* MENU */}
        {filteredNav.map((group) => (
          <SidebarGroup key={group?.title}>
            <SidebarGroupLabel>{group?.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group?.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
