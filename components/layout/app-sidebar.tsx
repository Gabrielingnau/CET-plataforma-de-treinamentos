"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/auth/use-auth"
import { data as navigationData } from "@/navigation/const-data"
import { NavItem } from "@/types/navigation/nav-item.type"
import { UserRole } from "@/types/database/users"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAuth()
  const { isMobile, setOpenMobile, state } = useSidebar() 
  const userRole: UserRole = user?.role ?? "colaborador"
  const isCollapsed = state === "collapsed"

  const filteredNav = React.useMemo(() => {
    return navigationData
      .map((group) => {
        const filteredItems = group.items?.filter((item) => {
          const hasAccess = item.roles?.includes(userRole)
          const isHidden = item.hideFromRoles?.includes(userRole)
          return hasAccess && !isHidden
        })

        const groupHasAccess = group.roles?.includes(userRole)
        const groupIsHidden = group.hideFromRoles?.includes(userRole)

        if (groupIsHidden || (!groupHasAccess && (!filteredItems || filteredItems.length === 0))) {
          return null
        }

        return { ...group, items: filteredItems }
      })
      .filter(Boolean) as NavItem[]
  }, [userRole])

  return (
    <Sidebar {...props} collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className={cn(
        "transition-all duration-300 border-b border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden",
        isCollapsed ? "h-20 items-center justify-center p-0" : "p-4 min-h-[110px] justify-center"
      )}>
        {/* LOGO AREA - Suporta nomes longos como KYDORA */}
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <div className={cn(
            "bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 transition-all duration-500",
            isCollapsed ? "h-11 w-11 shadow-none" : "h-10 w-10"
          )}>
            <span className="text-primary-foreground font-black text-sm italic">LOG</span>
          </div>
          
          <div className={cn(
            "flex flex-col min-w-0 flex-1 transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            <h2 className="text-xl font-black tracking-tighter text-foreground uppercase italic leading-none truncate">
              Kydora
            </h2>
            <span className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mt-1 truncate">
              Intelligence
            </span>
          </div>
        </div>

        {/* USER INFO AREA */}
        {!loading && !isCollapsed && (
          <div className="flex flex-col mt-4 animate-in fade-in slide-in-from-left-2 duration-500 overflow-hidden">
            <p className="text-[11px] font-black uppercase tracking-widest text-foreground truncate w-full">
              {user?.nome || "Usuário"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter truncate">
                {userRole} account
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNav.map((group) => (
                <Collapsible
                  key={group.title}
                  asChild
                  open={isMobile ? true : undefined}
                  defaultOpen={isMobile}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={group.title} 
                        className="h-11 font-bold text-[13px] rounded-xl hover:bg-primary/5 transition-all active:scale-95"
                        disabled={isMobile}
                      >
                        {group.icon && <group.icon className="size-5 shrink-0" />}
                        <span className="group-data-[state=collapsed]:hidden ml-2 truncate">{group.title}</span>
                        
                        {!isMobile && (
                          <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[state=collapsed]:hidden" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items?.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton 
                              asChild 
                              className="h-9 text-[12px] opacity-70 hover:opacity-100 hover:text-primary transition-all"
                              onClick={() => {
                                if (isMobile) setOpenMobile(false)
                              }}
                            >
                              <Link href={item.url} className="truncate block">
                                <span className="truncate">{item.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}