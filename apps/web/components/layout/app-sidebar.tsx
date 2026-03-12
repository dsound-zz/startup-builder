'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem
} from '@/components/ui/sidebar'
import { LayoutDashboard, FolderKanban, Settings, Lightbulb } from 'lucide-react'

const menuItems = [
   {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
   },
   {
      title: 'Projects',
      url: '/projects',
      icon: FolderKanban,
   },
   {
      title: 'Idea Generation',
      url: '/ideas',
      icon: Lightbulb,
   },
   {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
   },
]

export function AppSidebar() {
   const pathname = usePathname()

   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>
                  <div className="flex items-center gap-2 px-2 py-2">
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Lightbulb className="h-4 w-4" />
                     </div>
                     <span className="text-lg font-bold">Startup Builder</span>
                  </div>
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {menuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton asChild isActive={pathname === item.url}>
                              <Link href={item.url}>
                                 <item.icon className="h-4 w-4" />
                                 <span>{item.title}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   )
}