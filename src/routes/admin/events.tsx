import { createFileRoute } from '@tanstack/react-router'
import {ComingSoonScreen} from "@/components/errors/coming-soon.tsx";

export const Route = createFileRoute('/admin/events')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <ComingSoonScreen/>
  )
}
