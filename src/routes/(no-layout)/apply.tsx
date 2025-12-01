import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(no-layout)/apply')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(no-layout)/apply"!</div>
}
