import {createFileRoute, Outlet} from '@tanstack/react-router'
import {AdminSidebar} from "@/components/layout/admin-sidebar/sidebar.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {AdminSidebarTrigger} from "@/components/layout/admin-sidebar/sidebar-trigger.tsx";

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
              <header className="border-b flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                  <div className="flex items-center gap-2 px-4">
                      <AdminSidebarTrigger />
                      <Breadcrumb>
                          <BreadcrumbList>
                              <BreadcrumbItem className="hidden md:block">
                                  <BreadcrumbLink href="#">
                                      Building Your Application
                                  </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator className="hidden md:block" />
                              <BreadcrumbItem>
                                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                              </BreadcrumbItem>
                          </BreadcrumbList>
                      </Breadcrumb>
                  </div>
              </header>

              <Outlet/>
          </SidebarInset>
      </SidebarProvider>
  )
}
