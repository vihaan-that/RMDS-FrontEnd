"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Minus,
  Plus,
  Home,
  Activity,
  Database,
  AlertTriangle,
  FileText,
  Monitor,
  GitBranch,
  LogOut
} from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"

import { SearchForm } from "./search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from "@/components/ui/sidebar"

export function AppSidebar({ className, ...props }) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [projectAssets, setProjectAssets] = useState([])
  const [openItems, setOpenItems] = React.useState([])

  useEffect(() => {
    const fetchProjectAssets = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/project-assets')
        const data = await response.json()
        setProjectAssets(data.project.assets)
      } catch (error) {
        console.error('Error fetching project assets:', error)
      }
    }

    fetchProjectAssets()
  }, [])

  const toggleItem = (itemId) => {
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const navMain = [
    {
      title: "Landing",
      url: "/dashboard",
      icon: Home
    },
    {
      title: "Live Data",
      url: "/dashboard/live-data",
      icon: Activity
    },
    {
      title: "Plant Data",
      url: "/dashboard/plant-data",
      icon: Database
    },
    {
      title: "Incidents",
      url: "/dashboard/incidents",
      icon: AlertTriangle
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: FileText
    },
    {
      title: "Asset Monitoring",
      url: "/dashboard",
      icon: Monitor,
      items: projectAssets.map(asset => ({
        title: asset.assetName,
        url: `/dashboard/asset-monitoring/project-1/${asset.assetName.toLowerCase().replace(/\s+/g, '-')}`,
        items: asset.sensors.map(sensor => ({
          title: sensor.tagName,
          url: `/dashboard/asset-monitoring/project-1/${asset.assetName.toLowerCase().replace(/\s+/g, '-')}/${sensor.tagName.toLowerCase().replace(/\s+/g, '-')}`
        }))
      }))
    },
    {
      title: "Fault Trees",
      url: "/dashboard/fault-trees",
      icon: GitBranch
    }
  ]

  return (
    <Sidebar {...props} className={cn("pb-12 h-full flex flex-col", className)}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="items-start">
                <div className="flex aspect-square size-20 items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src="/BHEL-logo.png"
                    alt="BHEL Logo"
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Power Plant Monitor</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={pathname.includes(item.url)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.title}
                        {item.items ? (
                          <>
                            <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                            <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                          </>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map(subItem => (
                          <Collapsible
                            key={subItem.title}
                            defaultOpen={pathname.includes(subItem.url)}
                            className="group/collapsible"
                          >
                            <SidebarMenuSubItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.url}>
                                    <Database className="mr-2 h-4 w-4" />
                                    {subItem.title}
                                    {subItem.items ? (
                                      <>
                                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                                      </>
                                    ) : null}
                                  </Link>
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              {subItem.items ? (
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {subItem.items.map(sensor => (
                                      <SidebarMenuSubItem key={sensor.title}>
                                        <SidebarMenuSubButton asChild>
                                          <Link href={sensor.url}>
                                            <Activity className="mr-2 h-4 w-4" />
                                            {sensor.title}
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              ) : null}
                            </SidebarMenuSubItem>
                          </Collapsible>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto border-t pt-4 px-3">
        <div className="flex items-center justify-between px-4 mb-2">
          <div>
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <SidebarRail />
    </Sidebar>
  )
}
