import * as React from "react"
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
  GitBranch
} from "lucide-react"

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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from "@/components/ui/sidebar"

const data = {
  navMain: [
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
      url: "/dashboard/asset-monitoring",
      icon: Monitor,
      items: [
        {
          title: "Project 1",
          url: "/dashboard/asset-monitoring/project-1",
          items: [
            { title: "Asset 1", url: "/dashboard/asset-monitoring/project-1/asset-1" },
            { title: "Asset 2", url: "/dashboard/asset-monitoring/project-1/asset-2" },
            { title: "Asset 3", url: "/dashboard/asset-monitoring/project-1/asset-3" }
          ]
        },
        {
          title: "Project 2",
          url: "/dashboard/asset-monitoring/project-2",
          items: [
            { title: "Asset 1", url: "/dashboard/asset-monitoring/project-2/asset-1" },
            { title: "Asset 2", url: "/dashboard/asset-monitoring/project-2/asset-2" },
            { title: "Asset 3", url: "/dashboard/asset-monitoring/project-2/asset-3" }
          ]
        }
      ]
    },
    {
      title: "Fault Trees",
      url: "/dashboard/fault-trees",
      icon: GitBranch
    }
  ]
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
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
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 5}
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
                            defaultOpen={false}
                            className="group/collapsible"
                          >
                            <SidebarMenuSubItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.url}>
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
                                    {subItem.items.map(nestedItem => (
                                      <SidebarMenuSubItem key={nestedItem.title}>
                                        <SidebarMenuSubButton asChild>
                                          <Link href={nestedItem.url}>{nestedItem.title}</Link>
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
      <SidebarRail />
    </Sidebar>
  )
}
