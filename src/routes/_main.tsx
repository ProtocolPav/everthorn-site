import { createFileRoute, Outlet } from '@tanstack/react-router'
import SiteHeader from "@/components/layout/header/header.tsx";


export const Route = createFileRoute('/_main')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
          <SiteHeader/>
          <Outlet/>
      </>
  )
}
