import { createFileRoute } from '@tanstack/react-router'
import {AdminSidebar} from "@/components/layout/admin-sidebar/sidebar.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <SidebarProvider>
          <AdminSidebar />
      </SidebarProvider>
  )
}
