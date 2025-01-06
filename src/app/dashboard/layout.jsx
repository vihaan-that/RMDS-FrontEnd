import { AppSidebar } from "../../components/app-sidebar"
import { DynamicBreadcrumbs } from "../../components/dynamic-breadcrumbs"
import { PlantInfo } from "../../components/plant-info"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

export default function DashboardLayout({children}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col w-full">
          {/* RMDS Header */}
          <div className="w-full bg-primary text-primary-foreground p-4">
            <h1 className="text-2xl font-bold text-center">
              Remote Monitoring and Diagnostic System (RMDS)
            </h1>
          </div>

          {/* Existing header with breadcrumbs */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs />
          </header>

          {/* Plant Information */}
          <PlantInfo
            plantName="EXAMPLE PLANT"
            load="500 MW"
            imageUrl="/placeholder.svg"
          />

         {children} 
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
